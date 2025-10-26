"""
Chat Service for Insurance Advisor AI
"""

from google import genai
from google.genai import types
from typing import Dict, Any, Optional, List

# Use same API key as ai_service
GEMINI_API_KEY = "AIzaSyAVMe9ck7e7yX4F9__HIEkxUwq1XCSi4v0"
client = genai.Client(api_key=GEMINI_API_KEY)

# Insurance Chatbot Prompt
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


async def chat_with_insurance_advisor(
    user_message: str,
    document_analysis: Optional[Dict[str, Any]] = None,
    chat_history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """
    Chat with AI Insurance Advisor using Gemini
    
    Args:
        user_message: User's question/message
        document_analysis: Optional document analysis data (address, region, recommendations)
        chat_history: Optional previous chat messages for context
        
    Returns:
        Dictionary containing AI response
    """
    try:
        # Build context from document analysis
        context = ""
        region = "chưa xác định"
        recommended_packages = []
        
        if document_analysis:
            # Extract region
            if document_analysis.get('place_of_origin'):
                region = document_analysis['place_of_origin'].get('region', 'chưa xác định')
            elif document_analysis.get('address'):
                region = document_analysis['address'].get('region', 'chưa xác định')
            
            # Extract recommended packages
            if document_analysis.get('recommended_packages'):
                recommended_packages = document_analysis['recommended_packages']
            
            # Build context string
            if region != "chưa xác định" and region != "Unknown":
                context += f"\n📍 THÔNG TIN KHÁCH HÀNG (CHỈ SỬ DỤNG NỘI BỘ - KHÔNG TIẾT LỘ):\n"
                context += f"- Vùng miền: {region}\n"
                
                if recommended_packages:
                    context += f"- Gói bảo hiểm được đề xuất:\n"
                    for pkg in recommended_packages[:3]:  # Top 3
                        context += f"  • {pkg.get('name', 'N/A')}: {pkg.get('reason', 'N/A')}\n"
                
                context += f"\n💡 Hãy tư vấn dựa trên thông tin này (KHÔNG NÊU RA SỐ GIẤY TỜ)"
        
        # Build chat history context
        history_context = ""
        if chat_history and len(chat_history) > 0:
            history_context = "\n📜 LỊCH SỬ HỘI THOẠI GẦN ĐÂY:\n"
            for msg in chat_history[-5:]:  # Last 5 messages
                role = "Khách hàng" if msg.get('role') == 'user' else "AI"
                history_context += f"{role}: {msg.get('content', '')}\n"
        
        # Combine prompt
        full_prompt = INSURANCE_CHATBOT_PROMPT + context + history_context + f"\n\nCâu hỏi: {user_message}"
        
        print(f"\n💬 Chat request: '{user_message[:50]}...'")
        if context:
            print(f"   📋 Context: Region={region}, Packages={len(recommended_packages)}")
        
        # Call Gemini API
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=full_prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,  # More creative for conversation
                top_p=0.9,
                top_k=40,
                max_output_tokens=1024
            )
        )
        
        ai_reply = response.text.strip()
        
        print(f"   ✅ AI replied: '{ai_reply[:100]}...'")
        
        return {
            "reply": ai_reply,
            "has_context": bool(document_analysis),
            "region": region if document_analysis else None
        }
        
    except Exception as e:
        print(f"❌ Chat error: {e}")
        import traceback
        traceback.print_exc()
        
        # Fallback response
        return {
            "reply": "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể thử lại hoặc liên hệ hotline 1900-xxxx để được tư vấn trực tiếp.",
            "error": str(e),
            "has_context": False
        }
