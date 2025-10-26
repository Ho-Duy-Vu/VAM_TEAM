"""
AI Service for Document Analysis using Google Gemini
"""

from google import genai
from google.genai import types
from PIL import Image
import json
import re
import base64
import io
from typing import Dict, Any, Optional
import os

# Person Info Extraction Prompt - For CCCD/ID Cards/Driver License
PERSON_INFO_EXTRACTION_PROMPT = """You are an expert at extracting personal information from Vietnamese ID cards (CCCD), Driver Licenses, and similar documents.

Your task is to extract personal information from this document image and return it in JSON format.

CRITICAL RULES:
1. Extract ONLY information that is CLEARLY VISIBLE in the document
2. DO NOT invent or guess any information
3. Return null for fields that are not present
4. Keep Vietnamese text as-is (DO NOT translate)
5. Extract dates in DD/MM/YYYY format

SUPPORTED DOCUMENT TYPES:
- CCCD (Căn cước công dân) - Vietnamese ID Card
- CMND (Chứng minh nhân dân) - Old ID Card
- Bằng lái xe (Driver License)
- Hộ chiếu (Passport)
- Sổ hộ khẩu (Household Registration)

JSON OUTPUT FORMAT:
{
  "fullName": "Họ và tên đầy đủ | null",
  "dateOfBirth": "DD/MM/YYYY | null",
  "gender": "Nam | Nữ | null",
  "idNumber": "Số CCCD/CMND/Bằng lái | null",
  "address": "Địa chỉ đầy đủ | null",
  "phone": "Số điện thoại (nếu có) | null",
  "email": "Email (nếu có) | null",
  "placeOfOrigin": "Quê quán | null",
  "nationality": "Quốc tịch | null",
  "issueDate": "Ngày cấp DD/MM/YYYY | null",
  "expiryDate": "Ngày hết hạn DD/MM/YYYY | null",
  "documentType": "CCCD | CMND | Driver License | Passport | etc."
}

FIELD EXTRACTION RULES:

fullName:
- Extract from "Họ và tên" / "Name" field
- Keep Vietnamese characters (ê, ô, ơ, ă, etc.)
- Capitalize properly: "NGUYỄN VĂN A" → "Nguyễn Văn A"

dateOfBirth:
- Extract from "Ngày sinh" / "Date of birth"
- Format: DD/MM/YYYY
- Example: "01/01/1990"

gender:
- Extract from "Giới tính" / "Sex"
- Return "Nam" or "Nữ" (Vietnamese)
- If M/Male → "Nam", if F/Female → "Nữ"

idNumber:
- Extract from "Số" field (CCCD/CMND number)
- Or "Số bằng lái" (Driver license number)
- Keep exactly as shown (no spaces, dashes preserved)
- Example: "001234567890" or "079123456789"

address:
- Extract from "Nơi thường trú" / "Place of residence"
- Full address with street, ward, district, city
- Example: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM"

phone:
- Extract if visible on document (not always present)
- Format: Keep as shown (with or without spaces)
- Example: "0901234567"

email:
- Extract if visible (rarely present on ID cards)

placeOfOrigin:
- Extract from "Quê quán" / "Place of origin"
- Example: "Hà Nội"

nationality:
- Usually "Việt Nam" for Vietnamese ID
- Extract from "Quốc tịch" field

issueDate:
- Extract from "Ngày cấp" / "Date of issue"
- Format: DD/MM/YYYY

expiryDate:
- Extract from "Có giá trị đến" / "Valid until"
- Format: DD/MM/YYYY
- May be "Không thời hạn" (No expiry) → return "Không thời hạn"

documentType:
- Auto-detect from document appearance
- Values: "CCCD" | "CMND" | "Driver License" | "Passport" | "Household Registration"

IMPORTANT:
- Return ONLY valid JSON (no markdown, no explanations)
- All text values must be properly escaped
- Use null (not "null" string) for missing fields
- Preserve Vietnamese diacritics exactly

Now extract personal information from this document:"""

# Vehicle Info Extraction Prompt - For Vehicle Registration (Cà vẹt xe)
VEHICLE_INFO_EXTRACTION_PROMPT = """You are an expert at extracting vehicle information from Vietnamese vehicle registration documents (Giấy đăng ký xe / Cà vẹt).

Your task is to extract vehicle information from this document image and return it in JSON format.

CRITICAL RULES:
1. Extract ONLY information that is CLEARLY VISIBLE in the document
2. DO NOT invent or guess any information
3. Return null for fields that are not present
4. Keep Vietnamese text as-is (DO NOT translate)
5. Extract dates in DD/MM/YYYY format

SUPPORTED DOCUMENT TYPES:
- Giấy đăng ký xe ô tô (Car registration)
- Giấy đăng ký xe máy (Motorcycle registration)
- Cà vẹt xe (Vehicle registration card)

JSON OUTPUT FORMAT:
{
  "vehicleType": "Ô tô | Xe máy | Xe tải | null",
  "licensePlate": "Biển số xe (VD: 30A-12345) | null",
  "chassisNumber": "Số khung (VIN) | null",
  "engineNumber": "Số máy | null",
  "brand": "Hãng xe (Honda, Toyota, Yamaha...) | null",
  "model": "Dòng xe (SH Mode, Vios...) | null",
  "manufacturingYear": "Năm sản xuất | null",
  "color": "Màu sơn | null",
  "engineCapacity": "Dung tích xi lanh (cc) | null",
  "registrationDate": "Ngày đăng ký DD/MM/YYYY | null",
  "ownerName": "Tên chủ xe | null",
  "ownerAddress": "Địa chỉ chủ xe | null",
  "documentType": "Vehicle Registration"
}

FIELD EXTRACTION RULES:

vehicleType:
- Extract from document type or vehicle classification
- Values: "Ô tô", "Xe máy", "Xe tải", etc.

licensePlate:
- Extract from "Biển số đăng ký" / "Biển kiểm soát"
- Format: XX[A-Z]-XXXXX (e.g., 30A-12345, 51H-98765)
- Keep dashes/spaces as shown

chassisNumber:
- Extract from "Số khung" / "VIN"
- Usually 17-character alphanumeric code
- Keep exactly as shown

engineNumber:
- Extract from "Số máy"
- Alphanumeric code
- Keep exactly as shown

brand:
- Extract from "Nhãn hiệu" / "Hãng xe"
- Examples: Honda, Toyota, Yamaha, Suzuki, Hyundai

model:
- Extract from "Loại xe" / "Dòng xe"  
- Examples: SH Mode, Wave Alpha, Vios, Accent

manufacturingYear:
- Extract from "Năm sản xuất"
- 4-digit year: 2020, 2021, etc.

color:
- Extract from "Màu sơn"
- Keep Vietnamese: Đỏ, Xanh, Trắng, Đen, etc.

engineCapacity:
- Extract from "Dung tích xi lanh"
- Number only (cc unit removed): 125, 150, 1500, etc.

registrationDate:
- Extract from "Ngày đăng ký lần đầu"
- Format: DD/MM/YYYY

ownerName:
- Extract from "Tên chủ sở hữu"
- Keep Vietnamese characters

ownerAddress:
- Extract from "Địa chỉ" of owner
- Full address if available

IMPORTANT:
- Return ONLY valid JSON (no markdown, no explanations)
- All text values must be properly escaped
- Use null (not "null" string) for missing fields
- Preserve Vietnamese diacritics exactly

Now extract vehicle information from this document:"""

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyAVMe9ck7e7yX4F9__HIEkxUwq1XCSi4v0"
client = genai.Client(api_key=GEMINI_API_KEY)

# Insurance Chatbot Prompt - Smart advisor based on document analysis
INSURANCE_CHATBOT_PROMPT = """Bạn là AI Tư vấn viên bảo hiểm chuyên nghiệp của công ty ADE Insurance.

🎯 NHIỆM VỤ:
- Tư vấn bảo hiểm thông minh dựa trên phân tích tài liệu khách hàng
- Giải thích lợi ích & gợi ý sản phẩm phù hợp theo vùng miền
- Giọng điệu chuyên nghiệp, thân thiện, dễ hiểu

🔐 QUY TẮC BẢO MẬT (CRITICAL):
❌ TUYỆT ĐỐI KHÔNG được tiết lộ:
  - Số CMND/CCCD
  - Địa chỉ chi tiết (chỉ nêu vùng miền: Bắc/Trung/Nam)
  - Số điện thoại
  - Email cá nhân
  - Bất kỳ thông tin nhạy cảm nào

✅ CHỈ ĐƯỢC sử dụng:
  - Vùng miền (Bắc/Trung/Nam) để gợi ý
  - Loại bảo hiểm phù hợp
  - Giải thích quyền lợi
  - Ưu đãi & khuyến mãi

📋 NGUYÊN TẮC TRẢ LỜI:

1️⃣ NGẮN GỌN & RÕ RÀNG:
   - Mỗi câu trả lời 2-4 câu
   - Dùng emoji phù hợp (🏠 🌊 🚗 ⛈️ ✅)
   - Bullet points khi cần liệt kê

2️⃣ CÁ NHÂN HÓA:
   - Nếu biết vùng miền → gợi ý bảo hiểm thiên tai phù hợp
   - Miền Bắc: Ngập lụt mùa mưa
   - Miền Trung: Bão & lũ quét
   - Miền Nam: Triều cường, ngập úng
   
3️⃣ TƯ VẤN THÔNG MINH:
   - Giải thích LÝ DO khách hàng nên mua
   - Đưa ra 2-3 gói phù hợp nhất
   - Kêu gọi hành động: "Bạn muốn xem chi tiết không?"

4️⃣ XỬ LÝ THIẾU THÔNG TIN:
   - Nếu chưa có document → khuyến khích upload để tư vấn chính xác
   - "Tôi cần phân tích hồ sơ của bạn để tư vấn tốt hơn. Bạn có thể upload CCCD không?"

5️⃣ UPSELL & CROSS-SELL:
   - Gợi ý combo: Nhân thọ + Sức khỏe
   - Ưu đãi gia đình
   - Bảo hiểm xe + Thiên tai

📌 CÁC CÂU HỎI THƯỜNG GẶP:

Q: "Tôi ở miền Trung nên mua gì?"
A: "🌊 Miền Trung đang trong mùa bão lũ! 
Gói bảo hiểm thiên tai sẽ bảo vệ nhà cửa & phương tiện trước ngập lụt.
✅ Quyền lợi: Đền bù 100% giá trị khi thiệt hại
Bạn muốn xem chi tiết gói nào?"

Q: "Xe ngập nước có bồi thường không?"
A: "🚗 CÓ! Gói bảo hiểm thiên tai phương tiện bồi thường:
✅ Ngập nước động cơ
✅ Hỏng hóc do mưa lũ
✅ Sửa chữa hoặc đền bù 100%
Xe bạn loại nào để tôi tư vấn chính xác?"

Q: "Giải thích quyền lợi bảo hiểm thiên tai"
A: "🏠 Bảo hiểm thiên tai bảo vệ:
✅ Nhà cửa: Sập đổ, hư hại do bão
✅ Tài sản: Đồ dùng, nội thất ngập nước
✅ Phương tiện: Xe máy, ô tô
💰 Đền bù lên đến 500 triệu/sự kiện
Bạn muốn mua gói nào?"

🎯 TONE & STYLE:
- Xưng hô: "Bạn" / "Anh/Chị" (tuỳ ngữ cảnh)
- Thân thiện nhưng chuyên nghiệp
- Tránh thuật ngữ phức tạp
- Luôn kết thúc bằng câu hỏi mở để tiếp tục tương tác

Bây giờ hãy trả lời câu hỏi sau của khách hàng:"""

# Markdown Extraction Prompt - Optimized for large documents with tables
DOCUMENT_MARKDOWN_PROMPT = """You are an expert OCR and document analysis system specialized in extracting structured content from documents.

Your task is to extract ALL text content from this document image and format it as clean, well-structured Markdown.

CRITICAL RULES:
1. Extract EVERY piece of text visible in the document - do not skip any content
2. Maintain the original language - DO NOT translate
3. Preserve document structure with proper Markdown formatting
4. For TABLES: Use proper Markdown table syntax with aligned columns
5. For LISTS: Use appropriate list formatting (-, *, or numbered)
6. Maintain logical reading order (top to bottom, left to right)
7. Preserve all numbers, dates, codes, and special characters EXACTLY as shown
8. Keep paragraph breaks and spacing

OUTPUT REQUIREMENTS:
- Return ONLY Markdown text (no JSON, no explanations, no code blocks)
- Start directly with the document content
- Use proper Markdown syntax throughout

FORMATTING GUIDELINES:

Headers:
- Document title: # Title
- Major sections: ## Section Name  
- Subsections: ### Subsection Name
- Minor headings: #### Heading

Tables (CRITICAL for structured data - THIS IS THE MOST IMPORTANT):
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |

RULES FOR TABLES:
- ALWAYS detect tables in the document (forms, grids, structured data)
- MUST use proper Markdown table syntax with pipes |
- MUST include header row with column names
- MUST include separator row with dashes |----------|
- Align columns neatly with consistent spacing
- One row per data entry
- Preserve cell content EXACTLY as shown
- For empty cells, use empty space between pipes
- For merged cells, repeat content or use descriptive text
- Extract ALL rows visible in the table, not just sample rows

Example of properly formatted table:
| Species | Breed/Color | Age | Sex | Name |
|---------|-------------|-----|-----|------|
| Reindeer | Brown/White | Adult | M | DASHER |
| Reindeer | Brown/White | Adult | M | DANCER |
| Reindeer | Brown/White | Adult | M | PRANCER |

Lists:
- Unordered: - item or * item
- Ordered: 1. item, 2. item
- Nested: indent with 2 spaces

Text Formatting:
- **Bold** for important text
- *Italic* for emphasis
- `Code` for special values/codes
- > Quote for quoted sections

Preserve:
- Line breaks between paragraphs
- Spacing in formatted sections
- All punctuation and symbols
- Original text case

Now extract ALL content from the document, structure it logically, and format as Markdown:"""

# Insurance Recommendation Prompt - Region-based recommendations
INSURANCE_RECOMMENDATION_PROMPT = """🎯 ROLE:
Bạn là hệ thống "AI Insurance Recommendation Engine".
Nhiệm vụ: đọc tài liệu (CCCD, giấy tờ định danh, hợp đồng…) và chỉ cần xác định:
- Địa chỉ thường trú hoặc tạm trú
- Quê quán (nơi sinh/nguyên quán)
- Thuộc miền Bắc / miền Trung / miền Nam (Việt Nam)
Sau đó đề xuất các gói bảo hiểm phù hợp với rủi ro vùng miền.

---

📌 INPUT:
1 hình ảnh hoặc tài liệu có chứa địa chỉ cư trú/tạm trú và/hoặc quê quán bằng tiếng Việt.

---

📌 OUTPUT — TRẢ VỀ JSON HỢP LỆ DUY NHẤT:

{
  "address": {
      "text": "...",
      "type": "thuong_tru" | "tam_tru" | "unknown",
      "region": "Bac" | "Trung" | "Nam" | "Unknown"
  },
  "place_of_origin": {
      "text": "...",
      "region": "Bac" | "Trung" | "Nam" | "Unknown"
  },
  "recommended_packages": [
      {
        "name": "...",
        "reason": "...",
        "priority": 0.0-1.0
      }
  ]
}

---

📌 LOGIC GỢI Ý GÓI BẢO HIỂM:

**QUY TẮC ƯU TIÊN:**
1. Phân tích quê quán trước (place_of_origin)
2. Nếu quê quán là Bắc hoặc Trung → ĐỀ XUẤT NGAY, không cần kiểm tra địa chỉ thường trú
3. Nếu quê quán là Nam → kiểm tra địa chỉ thường trú (address)
   - Nếu địa chỉ thường trú là Bắc/Trung → ĐỀ XUẤT
   - Nếu địa chỉ thường trú cũng là Nam → KHÔNG ĐỀ XUẤT
4. Nếu không có quê quán → dùng địa chỉ thường trú

**ĐIỀU KIỆN ĐỀ XUẤT:**

Nếu (place_of_origin.region == "Bac" hoặc "Trung") HOẶC (place_of_origin.region == "Nam" VÀ address.region == "Bac" hoặc "Trung"):
  - Add:
  - Add:
      1️⃣ Bảo hiểm thiên tai ngập lụt
         - priority: 0.95
         - reason: "Khu vực miền [Bắc/Trung] thường xuyên chịu ảnh hưởng bởi bão và mưa lũ. Gói bảo hiểm này bảo vệ tài sản khỏi thiệt hại do ngập lụt, lũ quét."
      
      2️⃣ Bảo hiểm nhà cửa trước bão
         - priority: 0.90
         - reason: "Bão và gió mạnh thường xảy ra tại miền [Bắc/Trung], gây hư hại cho mái nhà, cửa sổ, tường. Gói này đảm bảo chi phí sửa chữa hoặc xây dựng lại."
      
      3️⃣ Bảo hiểm phương tiện ngập nước
         - priority: 0.85
         - reason: "Xe máy, ô tô dễ bị ngập nước khi mưa lớn hoặc lũ lụt. Gói này giúp bồi thường chi phí sửa chữa động cơ, hệ thống điện bị hư hỏng do nước."

Nếu (place_of_origin.region == "Nam" VÀ address.region == "Nam") HOẶC (cả 2 đều Unknown):
  - Không đề xuất gì (để mảng recommended_packages rỗng: [])
  - Giữ đầy đủ key theo JSON format

**VÍ DỤ MINH HỌA:**
- Quê quán: Hà Tĩnh (Trung) → ĐỀ XUẤT 3 gói (bất kể địa chỉ thường trú ở đâu)
- Quê quán: TP.HCM (Nam), Địa chỉ: Hà Nội (Bắc) → ĐỀ XUẤT 3 gói
- Quê quán: TP.HCM (Nam), Địa chỉ: Cần Thơ (Nam) → KHÔNG đề xuất
- Quê quán: Unknown, Địa chỉ: Nghệ An (Trung) → ĐỀ XUẤT 3 gói

---

📌 XÁC ĐỊNH VÙNG MIỀN:

**CÁCH NHẬN BIẾT QUÊ QUÁN TRÊN CCCD/CMND:**
- Tìm dòng có chữ: "Quê quán" | "Place of origin" | "Nguyên quán"
- Thường nằm ở mặt SAU của CCCD (CCCD mới gắn chip)
- Hoặc ở mặt TRƯỚC của CMND (CMND cũ 9 số)
- Format: "Quê quán: [Xã/Phường], [Huyện/Quận], [Tỉnh/Thành phố]"
- Ví dụ: "Quê quán: Xã Hòa Bình, Huyện Tân Lạc, Hòa Bình"
- Chỉ cần tỉnh/thành phố cuối cùng để xác định vùng miền

**PHÂN LOẠI MIỀN:**

MIỀN BẮC (Bac):
- Hà Nội, Hải Phòng, Quảng Ninh, Hải Dương, Hưng Yên, Bắc Ninh, Vĩnh Phúc, Phú Thọ
- Thái Nguyên, Bắc Giang, Lạng Sơn, Cao Bằng, Lào Cai, Yên Bái, Tuyên Quang
- Hòa Bình, Sơn La, Lai Châu, Điện Biên, Hà Giang
- Ninh Bình, Nam Định, Thái Bình

MIỀN TRUNG (Trung):
- Thanh Hóa, Nghệ An, Hà Tĩnh, Quảng Bình, Quảng Trị, Thừa Thiên Huế
- Đà Nẵng, Quảng Nam, Quảng Ngãi, Bình Định
- Phú Yên, Khánh Hòa, Ninh Thuận, Bình Thuận
- Kon Tum, Gia Lai, Đắk Lắk, Đắk Nông, Lâm Đồng

MIỀN NAM (Nam):
- TP. Hồ Chí Minh (TP.HCM, Sài Gòn)
- Bà Rịa - Vũng Tàu, Đồng Nai, Bình Dương, Bình Phước, Tây Ninh
- Long An, Tiền Giang, Bến Tre, Trà Vinh, Vĩnh Long
- Đồng Tháp, An Giang, Kiên Giang, Cần Thơ, Hậu Giang
- Sóc Trăng, Bạc Liêu, Cà Mau

---

📌 YÊU CẦU BẮT BUỘC:
- Không trả lời gì ngoài JSON
- JSON phải hợp lệ tuyệt đối
- Nếu thiếu dữ liệu → vẫn giữ key & gán giá trị "Unknown" hoặc []
- Không lưu lại hay mô tả nội dung hình ảnh
- Trích xuất địa chỉ và quê quán CHÍNH XÁC như trong tài liệu (giữ nguyên tiếng Việt có dấu)
- **LUÔN trích xuất CẢ HAI:** quê quán (place_of_origin) và địa chỉ thường trú (address)
- **ƯU TIÊN quê quán** để đề xuất, nhưng vẫn cần cả 2 thông tin để đưa ra quyết định chính xác
- Xác định vùng miền cho CẢ quê quán VÀ địa chỉ thường trú
- Áp dụng đúng logic đề xuất theo quy tắc ưu tiên ở trên

Bây giờ phân tích tài liệu và trả về JSON:"""

# Document Analysis Prompt - Enhanced for better JSON structure
DOCUMENT_AUTO_ANALYSIS_PROMPT = """You are an expert document analyzer for insurance and legal documents.

Your task is to analyze this document image and extract structured information in valid JSON format.

CRITICAL RULES:
1. Automatically detect the document type (e.g., "Insurance Claim Form", "Policy Document", "Contract", "Invoice", "Medical Report", "ID Card", "Veterinary Certificate", etc.)
2. Extract ONLY information that is ACTUALLY PRESENT and CLEARLY VISIBLE in the document
3. DO NOT invent, guess, or infer information not explicitly shown
4. Support ALL languages: Keep original language - DO NOT translate
5. For tables/structured data: Extract each row as a separate entry with clear field:value pairs
6. For dates: Extract ONLY explicitly written dates (format: YYYY-MM-DD or preserve original format)
7. Detect signatures, stamps, seals, checkmarks, or handwritten annotations

SPECIAL HANDLING FOR TABLES:
- If document contains tables (forms, grids), extract EACH ROW as a separate "number" entry
- Format table data as clear field-value pairs
- Example: {"label": "Animal 1 - Reindeer DASHER", "value": "Species: Reindeer, Name: DASHER, Sex: M, Age: Adult"}
- Extract ALL visible rows, not just samples
- Preserve column headers as field names

OUTPUT FORMAT:
- Return ONLY valid JSON (no markdown, no explanations, no code blocks)
- Use null for missing text fields, [] for missing arrays, false for booleans
- Ensure all strings are properly escaped
- All values must be extracted from the document, not inferred

JSON SCHEMA:
{
  "document_type": "specific type of document",
  "confidence": 0.0-1.0,
  "title": "document title if present | null",
  "summary": "concise 2-3 sentence summary of key information",
  "people": [
    {"name": "Full Name", "role": "Insured | Claimant | Witness | Doctor | etc. | null"}
  ],
  "organizations": [
    {"name": "Company/Organization Name"}
  ],
  "locations": [
    {"name": "Full Address or Location"}
  ],
  "dates": [
    {"label": "Date of Birth | Effective Date | Claim Date | etc.", "value": "YYYY-MM-DD"}
  ],
  "numbers": [
    {"label": "Policy Number | Claim Number | Amount | Phone | ID | Account | etc.", "value": "exact value as string"}
  ],
  "signature_detected": true | false
}

EXTRACTION GUIDELINES:

People: 
- Names of individuals mentioned with their role
- Examples: policy holder, insured person, claimant, beneficiary, witness, doctor, agent

Organizations:
- Insurance companies, hospitals, clinics, employers, service providers
- Extract full official names

Locations:
- Complete addresses (street, city, state, postal code)
- Separate entries for different locations

Dates:
- ONLY dates explicitly written in the document
- Common types: birth date, issue date, effective date, expiry date, claim date, incident date
- Format as YYYY-MM-DD (convert from any format shown)

Numbers (CRITICAL for tables):
- Policy/Certificate numbers
- Claim/Case numbers  
- Monetary amounts (with currency if shown)
- Phone numbers, fax numbers
- ID numbers, license numbers
- Account numbers
- Percentages, quantities
- Each table row's key data as separate entries

Signatures:
- true if handwritten signature, stamp, seal, or official mark is visible
- false if no signature visible

IMPORTANT:
- If document has tables: Extract each important row's data as separate number entries
- Preserve all numbers exactly (including leading zeros, dashes, spaces)
- For empty fields: use null or []
- Extract what you SEE, not what you think should be there

Now analyze the document and return ONLY the JSON object:"""


def clean_json_response(response_text: str) -> str:
    """
    Clean JSON response by removing markdown wrappers and extra text
    """
    # Remove markdown code blocks
    text = re.sub(r'```json\s*', '', response_text)
    text = re.sub(r'```\s*', '', text)
    
    # Remove any text before first { and after last }
    text = text.strip()
    
    # Find first { and last }
    start_idx = text.find('{')
    end_idx = text.rfind('}')
    
    if start_idx != -1 and end_idx != -1:
        text = text[start_idx:end_idx+1]
    
    return text.strip()


def validate_json_schema(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate and ensure JSON follows the required schema
    """
    # Ensure all required fields exist
    schema = {
        "document_type": data.get("document_type", "Unknown Document"),
        "confidence": float(data.get("confidence", 0.0)),
        "title": data.get("title"),
        "summary": data.get("summary", ""),
        "people": data.get("people", []),
        "organizations": data.get("organizations", []),
        "locations": data.get("locations", []),
        "dates": data.get("dates", []),
        "numbers": data.get("numbers", []),
        "signature_detected": bool(data.get("signature_detected", False))
    }
    
    # Ensure confidence is between 0 and 1
    if schema["confidence"] < 0:
        schema["confidence"] = 0.0
    elif schema["confidence"] > 1:
        schema["confidence"] = 1.0
    
    return schema


async def analyze_auto_document(image_path: str) -> Dict[str, Any]:
    """
    Analyze document using Gemini 2.5 Flash
    Optimized for large files with automatic image optimization
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Dictionary containing structured analysis results
    """
    try:
        # Load image
        if not os.path.exists(image_path):
            return {
                "error": f"Image file not found: {image_path}",
                "document_type": "Error",
                "confidence": 0.0,
                "title": None,
                "summary": "Failed to load document image",
                "people": [],
                "organizations": [],
                "locations": [],
                "dates": [],
                "numbers": [],
                "signature_detected": False
            }
        
        # Open image with PIL
        image = Image.open(image_path)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Optimize image for large files (> 2MB or > 4000px)
        file_size = os.path.getsize(image_path) / (1024 * 1024)  # Size in MB
        max_dimension = max(image.size)
        
        if file_size > 2 or max_dimension > 4000:
            # Calculate new size while maintaining aspect ratio
            max_size = 3000  # Maximum dimension
            if max_dimension > max_size:
                ratio = max_size / max_dimension
                new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
                image = image.resize(new_size, Image.Resampling.LANCZOS)
                print(f"   📐 Optimized image from {image_path} to {new_size} (original: {max_dimension}px, {file_size:.1f}MB)")
        
        # Convert PIL Image to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()
        
        # Generate content with Gemini 2.0 Flash
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                types.Content(
                    role='user',
                    parts=[
                        types.Part(text=DOCUMENT_AUTO_ANALYSIS_PROMPT),
                        types.Part(
                            inline_data=types.Blob(
                                data=img_byte_arr,
                                mime_type='image/jpeg'
                            )
                        )
                    ]
                )
            ],
            config=types.GenerateContentConfig(
                temperature=0.1,
                top_p=0.95,
                top_k=40,
                max_output_tokens=8192
            )
        )
        
        # Get response text
        response_text = response.text
        
        # Clean JSON response
        cleaned_json = clean_json_response(response_text)
        
        # Parse JSON
        try:
            result = json.loads(cleaned_json)
            # Validate schema
            result = validate_json_schema(result)
            return result
        except json.JSONDecodeError as e:
            # If JSON parsing fails, return error with raw response
            print(f"JSON Parse Error: {e}")
            print(f"Raw response: {response_text}")
            print(f"Cleaned JSON: {cleaned_json}")
            
            return {
                "error": f"Failed to parse JSON response: {str(e)}",
                "raw_response": response_text[:500],  # First 500 chars for debugging
                "document_type": "Parse Error",
                "confidence": 0.0,
                "title": None,
                "summary": "Failed to parse AI response",
                "people": [],
                "organizations": [],
                "locations": [],
                "dates": [],
                "numbers": [],
                "signature_detected": False
            }
            
    except Exception as e:
        # Handle any other errors
        print(f"Error in analyze_auto_document: {e}")
        return {
            "error": str(e),
            "document_type": "Error",
            "confidence": 0.0,
            "title": None,
            "summary": f"Analysis failed: {str(e)}",
            "people": [],
            "organizations": [],
            "locations": [],
            "dates": [],
            "numbers": [],
            "signature_detected": False
        }


async def extract_markdown_content(image_path: str) -> str:
    """
    Extract full text content from document as Markdown
    Optimized for large files with automatic image optimization
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Markdown formatted text content
    """
    try:
        # Load image
        if not os.path.exists(image_path):
            return f"# Error\n\nImage file not found: {image_path}"
        
        # Open image with PIL
        image = Image.open(image_path)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Optimize image for large files (> 2MB or > 4000px)
        file_size = os.path.getsize(image_path) / (1024 * 1024)  # Size in MB
        max_dimension = max(image.size)
        
        if file_size > 2 or max_dimension > 4000:
            # Calculate new size while maintaining aspect ratio
            max_size = 3000  # Maximum dimension
            if max_dimension > max_size:
                ratio = max_size / max_dimension
                new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
                image = image.resize(new_size, Image.Resampling.LANCZOS)
                print(f"   📐 Optimized image from {image_path} to {new_size} (original: {max_dimension}px, {file_size:.1f}MB)")
        
        # Convert PIL Image to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()
        
        # Generate content with Gemini 2.0 Flash
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=[
                types.Content(
                    role='user',
                    parts=[
                        types.Part(text=DOCUMENT_MARKDOWN_PROMPT),
                        types.Part(
                            inline_data=types.Blob(
                                data=img_byte_arr,
                                mime_type='image/jpeg'
                            )
                        )
                    ]
                )
            ],
            config=types.GenerateContentConfig(
                temperature=0.1,
                top_p=0.95,
                top_k=40,
                max_output_tokens=8192
            )
        )
        
        # Get response text
        markdown_text = response.text
        
        # Clean up any markdown code blocks if present
        markdown_text = re.sub(r'^```markdown\s*', '', markdown_text, flags=re.MULTILINE)
        markdown_text = re.sub(r'^```\s*$', '', markdown_text, flags=re.MULTILINE)
        markdown_text = markdown_text.strip()
        
        return markdown_text
        
    except Exception as e:
        # Handle any errors
        print(f"Error in extract_markdown_content: {e}")
        import traceback
        traceback.print_exc()
        return f"# Error\n\nFailed to extract text: {str(e)}"


def get_image_path_from_url(image_url: str) -> Optional[str]:
    """
    Convert image URL to local file path
    
    Args:
        image_url: URL path like "/data/images/xxx.png"
        
    Returns:
        Local file path or None if invalid
    """
    if not image_url:
        return None
    
    # Remove leading slash and /data/ prefix
    if image_url.startswith('/data/'):
        path = image_url[6:]  # Remove '/data/'
        return f"data/{path}"
    elif image_url.startswith('/'):
        path = image_url[1:]  # Remove leading '/'
        return path
    
    return image_url


async def extract_person_info(image_path: str) -> Dict[str, Any]:
    """
    Extract personal information from CCCD/ID/Driver License using Gemini
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Dictionary containing personal information
    """
    try:
        # Load image
        if not os.path.exists(image_path):
            return {
                "error": f"Image file not found: {image_path}",
                "fullName": None,
                "dateOfBirth": None,
                "gender": None,
                "idNumber": None,
                "address": None,
                "phone": None,
                "email": None,
                "placeOfOrigin": None,
                "nationality": None,
                "issueDate": None,
                "expiryDate": None,
                "documentType": None
            }
        
        # Open image with PIL
        image = Image.open(image_path)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Optimize image
        file_size = os.path.getsize(image_path) / (1024 * 1024)
        max_dimension = max(image.size)
        
        if file_size > 2 or max_dimension > 4000:
            max_size = 3000
            if max_dimension > max_size:
                ratio = max_size / max_dimension
                new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
                image = image.resize(new_size, Image.Resampling.LANCZOS)
                print(f"   📐 Optimized image to {new_size}")
        
        # Convert to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()
        
        # Call Gemini API with retry logic for quota errors
        max_retries = 3
        retry_delay = 2  # seconds
        response = None
        
        for attempt in range(max_retries):
            try:
                response = client.models.generate_content(
                    model='gemini-2.0-flash-exp',
                    contents=[
                        types.Content(
                            role='user',
                            parts=[
                                types.Part(text=PERSON_INFO_EXTRACTION_PROMPT),
                                types.Part(
                                    inline_data=types.Blob(
                                        data=img_byte_arr,
                                        mime_type='image/jpeg'
                                    )
                                )
                            ]
                        )
                    ],
                    config=types.GenerateContentConfig(
                        temperature=0.1,
                        top_p=0.95,
                        top_k=40,
                        max_output_tokens=2048
                    )
                )
                break  # Success, exit retry loop
                
            except Exception as api_error:
                error_msg = str(api_error)
                
                # Check if it's a quota error
                if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg or "quota" in error_msg.lower():
                    print(f"   ⚠️  Quota exceeded (attempt {attempt + 1}/{max_retries})")
                    
                    if attempt < max_retries - 1:
                        import time
                        wait_time = retry_delay * (attempt + 1)
                        print(f"   ⏳ Waiting {wait_time}s before retry...")
                        time.sleep(wait_time)
                        continue
                    else:
                        # All retries exhausted, return fallback data
                        print(f"   ⚠️  API quota exhausted. Returning empty data for manual entry...")
                        return {
                            "fullName": None,
                            "dateOfBirth": None,
                            "gender": None,
                            "idNumber": None,
                            "address": None,
                            "phone": None,
                            "email": None,
                            "placeOfOrigin": None,
                            "nationality": "Việt Nam",
                            "issueDate": None,
                            "expiryDate": None,
                            "documentType": "CCCD",
                            "extractionStatus": "quota_exceeded",
                            "message": "⚠️ API quota đã hết (50 requests/ngày). Vui lòng nhập thông tin thủ công hoặc thử lại sau 24h."
                        }
                else:
                    # Other API errors, re-raise
                    raise api_error
        
        # If response is None after retries, return error
        if response is None:
            return {
                "fullName": None,
                "dateOfBirth": None,
                "gender": None,
                "idNumber": None,
                "address": None,
                "phone": None,
                "email": None,
                "placeOfOrigin": None,
                "nationality": None,
                "issueDate": None,
                "expiryDate": None,
                "documentType": None,
                "extractionStatus": "failed",
                "message": "❌ Extraction failed after retries"
            }
        
        # Get response
        response_text = response.text
        
        # Clean JSON
        cleaned_json = clean_json_response(response_text)
        
        # Parse JSON
        try:
            result = json.loads(cleaned_json)
            print(f"✅ Extracted person info: {result.get('fullName', 'N/A')}")
            return result
        except json.JSONDecodeError as e:
            print(f"❌ JSON Parse Error: {e}")
            print(f"Raw response: {response_text}")
            
            return {
                "error": f"Failed to parse JSON: {str(e)}",
                "raw_response": response_text[:500],
                "fullName": None,
                "dateOfBirth": None,
                "gender": None,
                "idNumber": None,
                "address": None,
                "phone": None,
                "email": None,
                "placeOfOrigin": None,
                "nationality": None,
                "issueDate": None,
                "expiryDate": None,
                "documentType": None
            }
            
    except Exception as e:
        print(f"❌ Error in extract_person_info: {e}")
        import traceback
        traceback.print_exc()
        return {
            "error": str(e),
            "fullName": None,
            "dateOfBirth": None,
            "gender": None,
            "idNumber": None,
            "address": None,
            "phone": None,
            "email": None,
            "placeOfOrigin": None,
            "nationality": None,
            "issueDate": None,
            "expiryDate": None,
            "documentType": None
        }


async def extract_vehicle_info(image_path: str) -> Dict[str, Any]:
    """
    Extract vehicle information from Vehicle Registration (Cà vẹt) using Gemini
    
    Args:
        image_path: Path to the vehicle registration image file
        
    Returns:
        Dictionary containing vehicle information
    """
    try:
        # Load image
        if not os.path.exists(image_path):
            return {
                "error": f"Image file not found: {image_path}",
                "vehicleType": None,
                "licensePlate": None,
                "chassisNumber": None,
                "engineNumber": None,
                "brand": None,
                "model": None,
                "manufacturingYear": None,
                "color": None,
                "engineCapacity": None,
                "registrationDate": None,
                "ownerName": None,
                "ownerAddress": None,
                "documentType": "Vehicle Registration"
            }
        
        # Open image with PIL
        image = Image.open(image_path)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Optimize image
        file_size = os.path.getsize(image_path) / (1024 * 1024)
        max_dimension = max(image.size)
        
        if file_size > 2 or max_dimension > 4000:
            max_size = 3000
            if max_dimension > max_size:
                ratio = max_size / max_dimension
                new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
                image = image.resize(new_size, Image.Resampling.LANCZOS)
                print(f"   📐 Optimized image to {new_size}")
        
        # Convert to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()
        
        # Call Gemini API
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=[
                types.Content(
                    role='user',
                    parts=[
                        types.Part(text=VEHICLE_INFO_EXTRACTION_PROMPT),
                        types.Part(
                            inline_data=types.Blob(
                                data=img_byte_arr,
                                mime_type='image/jpeg'
                            )
                        )
                    ]
                )
            ],
            config=types.GenerateContentConfig(
                temperature=0.1,
                top_p=0.95,
                top_k=40,
                max_output_tokens=2048
            )
        )
        
        # Extract JSON from response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```'):
            response_text = re.sub(r'^```(?:json)?\n', '', response_text)
            response_text = re.sub(r'\n```$', '', response_text)
        
        # Parse JSON
        try:
            vehicle_data = json.loads(response_text)
            print(f"   ✅ Vehicle info extracted: {vehicle_data.get('licensePlate', 'N/A')}")
            return vehicle_data
        except json.JSONDecodeError as json_err:
            print(f"   ⚠️  JSON parse error: {json_err}")
            print(f"   📄 Raw response: {response_text[:500]}")
            return {
                "error": f"Invalid JSON response: {json_err}",
                "raw_response": response_text,
                "vehicleType": None,
                "licensePlate": None,
                "chassisNumber": None,
                "engineNumber": None,
                "brand": None,
                "model": None,
                "manufacturingYear": None,
                "color": None,
                "engineCapacity": None,
                "registrationDate": None,
                "ownerName": None,
                "ownerAddress": None,
                "documentType": "Vehicle Registration"
            }
            
    except Exception as e:
        print(f"❌ Error in extract_vehicle_info: {e}")
        import traceback
        traceback.print_exc()
        return {
            "error": str(e),
            "vehicleType": None,
            "licensePlate": None,
            "chassisNumber": None,
            "engineNumber": None,
            "brand": None,
            "model": None,
            "manufacturingYear": None,
            "color": None,
            "engineCapacity": None,
            "registrationDate": None,
            "ownerName": None,
            "ownerAddress": None,
            "documentType": "Vehicle Registration"
        }


async def recommend_insurance_by_address(image_path: str) -> Dict[str, Any]:
    """
    Analyze document address and recommend insurance packages based on region
    
    Args:
        image_path: Path to the image file (CCCD, ID, contract, etc.)
        
    Returns:
        Dictionary containing address analysis and insurance recommendations
        {
            "address": {
                "text": "Full address",
                "type": "thuong_tru | tam_tru | unknown",
                "region": "Bac | Trung | Nam | Unknown"
            },
            "place_of_origin": {
                "text": "Place of origin",
                "region": "Bac | Trung | Nam | Unknown"
            },
            "recommended_packages": [
                {
                    "name": "Package name",
                    "reason": "Reason for recommendation",
                    "priority": 0.0-1.0
                }
            ]
        }
    """
    try:
        # Load image
        if not os.path.exists(image_path):
            return {
                "error": f"Image file not found: {image_path}",
                "address": {
                    "text": "",
                    "type": "unknown",
                    "region": "Unknown"
                },
                "place_of_origin": {
                    "text": "",
                    "region": "Unknown"
                },
                "recommended_packages": []
            }
        
        # Open image with PIL
        image = Image.open(image_path)
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Optimize image
        file_size = os.path.getsize(image_path) / (1024 * 1024)
        max_dimension = max(image.size)
        
        if file_size > 2 or max_dimension > 4000:
            max_size = 3000
            if max_dimension > max_size:
                ratio = max_size / max_dimension
                new_size = (int(image.size[0] * ratio), int(image.size[1] * ratio))
                image = image.resize(new_size, Image.Resampling.LANCZOS)
                print(f"   📐 Optimized image to {new_size}")
        
        # Convert to bytes
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()
        
        # Call Gemini API
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=[
                types.Content(
                    role='user',
                    parts=[
                        types.Part(text=INSURANCE_RECOMMENDATION_PROMPT),
                        types.Part(
                            inline_data=types.Blob(
                                data=img_byte_arr,
                                mime_type='image/jpeg'
                            )
                        )
                    ]
                )
            ],
            config=types.GenerateContentConfig(
                temperature=0.1,
                top_p=0.95,
                top_k=40,
                max_output_tokens=2048
            )
        )
        
        # Get response
        response_text = response.text
        
        # Clean JSON
        cleaned_json = clean_json_response(response_text)
        
        # Parse JSON
        try:
            result = json.loads(cleaned_json)
            place_region = result.get('place_of_origin', {}).get('region', 'Unknown')
            addr_region = result.get('address', {}).get('region', 'Unknown')
            print(f"✅ Quê quán: {place_region}, Address: {addr_region}")
            print(f"   📦 {len(result.get('recommended_packages', []))} packages recommended")
            return result
        except json.JSONDecodeError as e:
            print(f"❌ JSON Parse Error: {e}")
            print(f"Raw response: {response_text}")
            
            return {
                "error": f"Failed to parse JSON: {str(e)}",
                "raw_response": response_text[:500],
                "address": {
                    "text": "",
                    "type": "unknown",
                    "region": "Unknown"
                },
                "place_of_origin": {
                    "text": "",
                    "region": "Unknown"
                },
                "recommended_packages": []
            }
            
    except Exception as e:
        print(f"❌ Error in recommend_insurance_by_address: {e}")
        import traceback
        traceback.print_exc()
        return {
            "error": str(e),
            "address": {
                "text": "",
                "type": "unknown",
                "region": "Unknown"
            },
            "place_of_origin": {
                "text": "",
                "region": "Unknown"
            },
            "recommended_packages": []
        }


async def recommend_insurance_by_person_info(person_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Recommend insurance packages based on extracted PersonInfo data
    Uses placeOfOrigin and address from already extracted data
    
    Args:
        person_data: PersonInfo dict with placeOfOrigin, address, etc.
        
    Returns:
        Dictionary containing insurance recommendations based on region
    """
    try:
        place_of_origin = person_data.get('placeOfOrigin', '')
        address = person_data.get('address', '')
        
        print(f"   🏠 Analyzing: placeOfOrigin='{place_of_origin}', address='{address}'")
        
        # Helper function to determine region from location text
        def get_region(location_text: str) -> str:
            if not location_text:
                return "Unknown"
            
            location_lower = location_text.lower()
            
            # Miền Bắc
            bac_provinces = [
                'hà nội', 'hải phòng', 'quảng ninh', 'hải dương', 'hưng yên', 'bắc ninh', 
                'vĩnh phúc', 'phú thọ', 'thái nguyên', 'bắc giang', 'lạng sơn', 'cao bằng',
                'lào cai', 'yên bái', 'tuyên quang', 'hòa bình', 'sơn la', 'lai châu',
                'điện biên', 'hà giang', 'ninh bình', 'nam định', 'thái bình'
            ]
            
            # Miền Trung
            trung_provinces = [
                'thanh hóa', 'nghệ an', 'hà tĩnh', 'quảng bình', 'quảng trị', 'thừa thiên huế',
                'đà nẵng', 'quảng nam', 'quảng ngãi', 'bình định', 'phú yên', 'khánh hòa',
                'ninh thuận', 'bình thuận', 'kon tum', 'gia lai', 'đắk lắk', 'đắk nông', 'lâm đồng'
            ]
            
            # Check provinces
            for province in bac_provinces:
                if province in location_lower:
                    return "Bac"
            
            for province in trung_provinces:
                if province in location_lower:
                    return "Trung"
            
            # Miền Nam (default if not Bắc or Trung)
            nam_keywords = ['sài gòn', 'tp.hcm', 'hồ chí minh', 'đồng nai', 'bình dương', 'long an', 'tiền giang', 'cần thơ', 'an giang']
            for keyword in nam_keywords:
                if keyword in location_lower:
                    return "Nam"
            
            return "Unknown"
        
        # Determine regions
        place_region = get_region(place_of_origin)
        addr_region = get_region(address)
        
        print(f"   📍 Quê quán region: {place_region}, Address region: {addr_region}")
        
        # Recommendation logic
        recommended_packages = []
        final_region = "Unknown"
        
        # Priority 1: Quê quán Bắc/Trung → recommend
        if place_region in ["Bac", "Trung"]:
            final_region = place_region
            recommended_packages = [
                {
                    "name": "Bảo hiểm thiên tai ngập lụt",
                    "reason": f"Quê quán tại miền {place_region} thường xuyên chịu ảnh hưởng bởi bão và mưa lũ. Gói bảo hiểm này bảo vệ tài sản khỏi thiệt hại do ngập lụt, lũ quét.",
                    "priority": 0.95
                },
                {
                    "name": "Bảo hiểm nhà cửa trước bão",
                    "reason": f"Bão và gió mạnh thường xảy ra tại miền {place_region}, gây hư hại cho mái nhà, cửa sổ, tường. Gói này đảm bảo chi phí sửa chữa hoặc xây dựng lại.",
                    "priority": 0.90
                },
                {
                    "name": "Bảo hiểm phương tiện ngập nước",
                    "reason": "Xe máy, ô tô dễ bị ngập nước khi mưa lớn hoặc lũ lụt. Gói này giúp bồi thường chi phí sửa chữa động cơ, hệ thống điện bị hư hỏng do nước.",
                    "priority": 0.85
                }
            ]
        # Priority 2: Quê quán Nam + Address Bắc/Trung → recommend
        elif place_region == "Nam" and addr_region in ["Bac", "Trung"]:
            final_region = addr_region
            recommended_packages = [
                {
                    "name": "Bảo hiểm thiên tai ngập lụt",
                    "reason": f"Địa chỉ thường trú tại miền {addr_region} thường xuyên chịu ảnh hưởng bởi bão và mưa lũ. Gói bảo hiểm này bảo vệ tài sản khỏi thiệt hại do ngập lụt, lũ quét.",
                    "priority": 0.95
                },
                {
                    "name": "Bảo hiểm nhà cửa trước bão",
                    "reason": f"Bão và gió mạnh thường xảy ra tại miền {addr_region}, gây hư hại cho mái nhà, cửa sổ, tường. Gói này đảm bảo chi phí sửa chữa hoặc xây dựng lại.",
                    "priority": 0.90
                },
                {
                    "name": "Bảo hiểm phương tiện ngập nước",
                    "reason": "Xe máy, ô tô dễ bị ngập nước khi mưa lớn hoặc lũ lụt. Gói này giúp bồi thường chi phí sửa chữa động cơ, hệ thống điện bị hư hỏng do nước.",
                    "priority": 0.85
                }
            ]
        # Otherwise: No recommendation
        else:
            final_region = place_region if place_region != "Unknown" else addr_region
        
        print(f"   ✅ Final region: {final_region}, Packages: {len(recommended_packages)}")
        
        return {
            "address": {
                "text": address,
                "type": "thuong_tru" if address else "unknown",
                "region": addr_region
            },
            "place_of_origin": {
                "text": place_of_origin,
                "region": place_region
            },
            "recommended_packages": recommended_packages
        }
        
    except Exception as e:
        print(f"❌ Error in recommend_insurance_by_person_info: {e}")
        import traceback
        traceback.print_exc()
        return {
            "error": str(e),
            "address": {
                "text": "",
                "type": "unknown",
                "region": "Unknown"
            },
            "place_of_origin": {
                "text": "",
                "region": "Unknown"
            },
            "recommended_packages": []
        }

