import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import type { DocumentJsonData } from '../api/types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  buttons?: ActionButton[]
}

interface ActionButton {
  type: 'detail' | 'buy'
  label: string
  productName: string
}

interface InsuranceChatbotProps {
  documentId: string
  jsonData: DocumentJsonData | null
}

// System Prompt cho AI (exported for future API integration)
export const SYSTEM_PROMPT = `Bạn là "Trợ lý Bảo hiểm AI", một trợ lý ảo chuyên nghiệp được tích hợp trên website. Vai trò của bạn là tư vấn, giải thích và so sánh các sản phẩm bảo hiểm một cách thân thiện, chính xác và chu toàn.

RÀNG BUỘC CỐT LÕI: Toàn bộ kiến thức của bạn về sản phẩm, quyền lợi, phí và quy trình đều phải được lấy từ dữ liệu JSON được cung cấp. Bạn TUYỆT ĐỐI KHÔNG được bịa đặt thông tin sản phẩm, quyền lợi hoặc mức phí không có trong JSON.

NGUYÊN TẮC TRẢ LỜI:
1. JSON-First: Mọi thông tin phải từ JSON. Nếu không tìm thấy, trả lời: "Xin lỗi, tôi chưa có thông tin chi tiết về [tên sản phẩm]. Bạn có muốn tôi tư vấn sản phẩm tương tự không?"
2. Ngắn gọn & Rõ ràng: Sử dụng gạch đầu dòng (Markdown), dễ hiểu
3. Disclaimer: LUÔN kết thúc bằng: "Thông tin này chỉ mang tính tham khảo, bạn vui lòng xem chi tiết trong hợp đồng/quy tắc bảo hiểm nhé."
4. Làm rõ nhu cầu: Hỏi thêm câu hỏi khi người dùng hỏi chung chung
5. Out-of-Scope: Từ chối nhẹ nhàng nếu không liên quan bảo hiểm
6. Đồng cảm với khiếu nại, giải thích quy trình khách quan

NGỮ ĐIỆU THEO CHỦ ĐỀ:
- Xe cơ giới: Thân mật, gần gũi, thực tế
- Sức khỏe: Quan tâm, chu đáo, đáng tin cậy
- Nhân thọ: Trang trọng, sâu sắc, KHÔNG hài hước
- Du lịch: Hào hứng, vui vẻ, an tâm
- Tài sản: An toàn, bảo vệ, nghiêm túc

NÚT BẤM: Khi đề cập sản phẩm cụ thể, BẮT BUỘC tạo:
- [Xem chi tiết: Tên Sản Phẩm Chính Xác]
- [Mua ngay: Tên Sản Phẩm Chính Xác]`

// Mock products database - Thay thế bằng API thật
const MOCK_PRODUCTS = [
  {
    id: 'tnds_xe_may',
    product_name: 'Bảo hiểm TNDS Xe máy Bắt buộc',
    category: 'Xe cơ giới',
    keywords: ['tnds', 'xe máy', 'công an', 'bắt buộc', 'cà vạt'],
    summary: 'Bảo hiểm bắt buộc bồi thường cho bên thứ ba khi xảy ra tai nạn',
    benefits: [
      'Thiệt hại về người: Tối đa 150 triệu/người/vụ',
      'Thiệt hại về tài sản: Tối đa 50 triệu/vụ',
      'Chi phí y tế cho người bị nạn',
      'Bồi thường thiệt hại vật chất'
    ],
    price_info: 'Phí cố định: 66.000 VNĐ/năm (đã bao gồm VAT)',
    claim_procedure: [
      'Bước 1: Thông báo tai nạn cho hotline 1900-xxxx',
      'Bước 2: Thu thập hồ sơ (biên bản CA, giấy tờ xe, hóa đơn)',
      'Bước 3: Gửi hồ sơ về công ty bảo hiểm',
      'Bước 4: Nhận bồi thường trong 15 ngày làm việc'
    ],
    exclusions: ['Lái xe không có bằng lái', 'Sử dụng rượu bia', 'Vi phạm luật giao thông nghiêm trọng']
  },
  {
    id: 'suc_khoe_toan_dien',
    product_name: 'Bảo hiểm Sức khỏe Toàn diện',
    category: 'Sức khỏe',
    keywords: ['sức khỏe', 'y tế', 'viện phí', 'điều trị', 'bệnh viện'],
    summary: 'Bảo vệ toàn diện chi phí y tế, nội trú, ngoại trú và phẫu thuật',
    benefits: [
      'Chi phí nội trú: Tối đa 500 triệu/năm',
      'Chi phí ngoại trú: Tối đa 50 triệu/năm',
      'Phẫu thuật: Tối đa 300 triệu/ca',
      'Thai sản: 50 triệu',
      'Nha khoa: 10 triệu/năm'
    ],
    price_info: 'Từ 3.500.000 VNĐ/năm (tùy độ tuổi và gói)',
    claim_procedure: [
      'Bước 1: Thông báo nhập viện qua hotline hoặc app',
      'Bước 2: Xuất trình thẻ bảo hiểm tại bệnh viện',
      'Bước 3: Thanh toán trực tiếp (cashless) hoặc hoàn phí',
      'Bước 4: Nhận bồi thường trong 7-10 ngày'
    ],
    exclusions: ['Bệnh có từ trước', 'Chấn thương do rượu bia', 'Thẩm mỹ']
  }
]

const SUGGESTED_QUESTIONS = [
  'Hồ sơ này thuộc gói bảo hiểm nào?',
  'Quyền lợi người dùng nhận được là gì?',
  'Cần mua thêm bảo hiểm gì để đủ bảo vệ?',
  'Thời hạn hợp đồng là bao lâu?',
  'Thủ tục bồi thường như thế nào?'
]

export default function InsuranceChatbot({ documentId, jsonData }: InsuranceChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'assistant',
    content: getGreetingByContext(jsonData),
    timestamp: new Date()
  }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Debug log to check props
  useEffect(() => {
    console.log('InsuranceChatbot mounted with:', { documentId, jsonData })
  }, [documentId, jsonData])

  const handleSendMessage = async (message?: string) => {
    const userMessage = message || input.trim()
    if (!userMessage || isLoading) return

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      // Generate AI response with advanced logic
      const { response, buttons } = generateSmartAIResponse(userMessage, jsonData)
      
      // Simulate streaming delay
      await new Promise(resolve => setTimeout(resolve, 1200))

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        buttons: buttons
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleActionButton = (button: ActionButton) => {
    console.log(`Action button clicked:`, button)
    // TODO: Implement product detail/buy page navigation
    alert(`Chức năng "${button.label}" cho "${button.productName}" sẽ sớm được cập nhật!`)
  }

  return (
    <Card className="h-full flex flex-col border-trust-200 shadow-trust">
      <CardHeader className="border-b bg-gradient-to-r from-trust-50 to-blue-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-trust-600 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Insurance Advisor</CardTitle>
            <p className="text-sm text-gray-600 font-normal">
              Tư vấn bảo hiểm thông minh dựa trên hồ sơ của bạn
            </p>
          </div>
          <Sparkles className="w-5 h-5 text-trust-500 ml-auto" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-trust-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-trust-600" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-trust-600 text-white rounded-tr-sm'
                    : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                
                {/* Action Buttons */}
                {message.role === 'assistant' && message.buttons && message.buttons.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.buttons.map((button, btnIdx) => (
                      <Button
                        key={btnIdx}
                        onClick={() => handleActionButton(button)}
                        size="sm"
                        className={`text-xs ${
                          button.type === 'buy'
                            ? 'bg-gradient-to-r from-trust-600 to-trust-700 hover:from-trust-700 hover:to-trust-800 text-white'
                            : 'bg-white border-2 border-trust-600 text-trust-700 hover:bg-trust-50'
                        }`}
                      >
                        {button.type === 'buy' ? '🛒' : '📄'} {button.label}
                      </Button>
                    ))}
                  </div>
                )}
                
                <span className={`text-xs mt-1 block ${message.role === 'user' ? 'text-trust-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-trust-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-trust-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-trust-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <Loader2 className="w-5 h-5 text-trust-600 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 2 && !isLoading && (
          <div className="px-4 pb-3">
            <p className="text-xs text-gray-500 mb-2">Câu hỏi gợi ý:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.slice(0, 3).map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs px-3 py-2 bg-trust-50 text-trust-700 rounded-lg hover:bg-trust-100 transition-colors border border-trust-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-trust-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-trust-600 hover:bg-trust-700 text-white px-6 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== HELPER FUNCTIONS ====================

// Detect topic from keywords and document data
function detectTopic(question: string, jsonData: DocumentJsonData | null): string {
  const q = question.toLowerCase()
  const docType = jsonData?.document_type?.toLowerCase() || ''
  
  // Xe cơ giới
  if (q.match(/cà vạt|cavet|xe máy|ô tô|tnds|xe cộ/i) || docType.includes('xe') || docType.includes('tnds')) {
    return 'vehicle'
  }
  
  // Sức khỏe
  if (q.match(/sức khỏe|y tế|viện phí|bệnh viện|thẻ sức khỏe|tai nạn/i) || docType.includes('sức khỏe') || docType.includes('y tế')) {
    return 'health'
  }
  
  // Nhân thọ
  if (q.match(/nhân thọ|tích lũy|cho con|hưu trí|đầu tư|gia đình/i) || docType.includes('nhân thọ')) {
    return 'life'
  }
  
  // Du lịch
  if (q.match(/du lịch|nước ngoài|delay|chuyến bay/i) || docType.includes('du lịch')) {
    return 'travel'
  }
  
  // Tài sản
  if (q.match(/nhà|cháy nổ|tài sản|chung cư/i) || docType.includes('tài sản') || docType.includes('nhà')) {
    return 'property'
  }
  
  return 'general'
}

// Get greeting by context
function getGreetingByContext(jsonData: DocumentJsonData | null): string {
  const topic = detectTopic('', jsonData)
  
  const greetings: Record<string, string> = {
    vehicle: 'Chào bạn! Thấy bạn quan tâm đến bảo hiểm xe. Tôi sẽ tư vấn loại bảo hiểm giúp bạn giải quyết êm đẹp khi có sự cố va chạm, và cũng "tự tin" khi gặp các chú công an nhé! 😉',
    health: 'Chào bạn, sức khỏe là vốn quý nhất. 🏥 Tôi sẽ giúp bạn tìm hiểu các gói bảo hiểm sức khỏe để bạn an tâm điều trị mà không phải lo lắng về chi phí nhé.',
    life: 'Chào bạn. Việc bạn tìm hiểu về bảo hiểm nhân thọ cho thấy bạn là người rất có trách nhiệm cho tương lai. 👨‍👩‍👧‍👦 Tôi sẽ cùng bạn phân tích kỹ lưỡng để xây dựng một kế hoạch bảo vệ và tích lũy chu toàn nhất cho gia đình.',
    travel: 'Chào bạn, bạn chuẩn bị cho chuyến đi chơi xa ạ? ✈️ Để chuyến đi được trọn vẹn, tôi sẽ tư vấn gói bảo hiểm du lịch giúp bạn xử lý mọi sự cố từ thất lạc hành lý đến y tế khẩn cấp!',
    property: 'Chào bạn. Ngôi nhà là tài sản lớn. 🏡 Tôi sẽ tư vấn cho bạn giải pháp để bảo vệ tổ ấm của mình khỏi những rủi ro không lường trước như cháy nổ, thiên tai.',
    general: 'Chào bạn! Tôi là Trợ lý Bảo hiểm AI. Tôi có thể giúp gì cho bạn hôm nay ạ?'
  }
  
  return greetings[topic] || greetings.general
}

// Parse action buttons from response text
function parseActionButtons(responseText: string): { response: string; buttons?: ActionButton[] } {
  const buttons: ActionButton[] = []
  let cleanText = responseText
  
  // Match [Xem chi tiết: Product Name] or [Mua ngay: Product Name]
  const buttonRegex = /\[(Xem chi tiết|Mua ngay): ([^\]]+)\]/g
  const matches = Array.from(responseText.matchAll(buttonRegex))
  
  matches.forEach(match => {
    const action = match[1]
    const productName = match[2]
    
    buttons.push({
      type: action === 'Xem chi tiết' ? 'detail' : 'buy',
      label: action,
      productName: productName
    })
    
    // Remove button markup from text
    cleanText = cleanText.replace(match[0], '')
  })
  
  // Clean up extra newlines
  cleanText = cleanText.replace(/\n{3,}/g, '\n\n').trim()
  
  return { 
    response: cleanText, 
    buttons: buttons.length > 0 ? buttons : undefined 
  }
}

// Find product by name or keywords
function findProduct(query: string): typeof MOCK_PRODUCTS[0] | null {
  const q = query.toLowerCase()
  
  return MOCK_PRODUCTS.find(product => {
    // Exact name match
    if (product.product_name.toLowerCase().includes(q)) return true
    
    // Keyword match
    return product.keywords.some(keyword => q.includes(keyword.toLowerCase()))
  }) || null
}

// Generate smart AI response with context awareness
function generateSmartAIResponse(question: string, jsonData: DocumentJsonData | null): { response: string; buttons?: ActionButton[] } {
  const q = question.toLowerCase()
  // Detect topic for future use (e.g., tone adjustment, analytics)
  detectTopic(question, jsonData)
  
  // Handle out-of-scope questions
  if (q.match(/thời tiết|tin tức|kể chuyện|nấu ăn|âm nhạc/i)) {
    return {
      response: 'Xin lỗi, tôi là trợ lý chuyên về bảo hiểm. Bạn có cần tôi tư vấn về gói bảo hiểm nào không ạ? ☂️'
    }
  }
  
  // Scenario 1: Ask about specific product
  if (q.match(/tnds|xe máy|bảo hiểm xe/i)) {
    const product = findProduct('tnds xe máy')
    if (product) {
      const response = `Chào bạn! Bảo hiểm TNDS Xe máy là giấy tờ "tự tin" khi gặp các chú công an đó 😉.\n\nĐây là bảo hiểm bắt buộc, dùng để bồi thường cho người khác (bên thứ ba) nếu bạn không may gây tai nạn.\n\n**Quyền lợi chính:**\n${product.benefits.map(b => `• ${b}`).join('\n')}\n\n**Phí bảo hiểm:**\n${product.price_info}\n\nBạn có thể xem đầy đủ và mua ngay tại đây nhé:\n[Xem chi tiết: ${product.product_name}]\n\n*(Thông tin này chỉ mang tính tham khảo, bạn vui lòng xem chi tiết trong hợp đồng/quy tắc bảo hiểm nhé.)*`
      
      return parseActionButtons(response)
    }
  }
  
  if (q.match(/sức khỏe|y tế|viện phí/i)) {
    const product = findProduct('sức khỏe')
    if (product) {
      const response = `Với nhu cầu bảo vệ sức khỏe, gói "${product.product_name}" là rất phù hợp. 🏥\n\nGói này sẽ giúp bạn chi trả chi phí điều trị nội trú, phẫu thuật tại các bệnh viện hàng đầu.\n\n**Quyền lợi chính:**\n${product.benefits.map(b => `• ${b}`).join('\n')}\n\n**Phí bảo hiểm:**\n${product.price_info}\n\n[Xem chi tiết: ${product.product_name}]\n\n*(Thông tin này chỉ mang tính tham khảo...)*`
      
      return parseActionButtons(response)
    }
  }
  
  // Scenario 2: Ask about claim procedure
  if (q.match(/thủ tục|bồi thường|hồ sơ|yêu cầu/i)) {
    const product = findProduct(q)
    if (product && product.claim_procedure) {
      return {
        response: `Để yêu cầu bồi thường cho gói ${product.product_name}, bạn cần thực hiện các bước sau:\n\n${product.claim_procedure.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}\n\n*(Thông tin này chỉ mang tính tham khảo...)*`
      }
    }
    
    return {
      response: 'Để tư vấn chính xác về thủ tục bồi thường, bạn vui lòng cho tôi biết bạn quan tâm đến gói bảo hiểm nào? (Ví dụ: TNDS xe máy, Sức khỏe, Du lịch...)'
    }
  }
  
  // Scenario 3: General consultation
  if (q.match(/tư vấn|nên mua|giới thiệu/i)) {
    return {
      response: `Tôi rất vui được tư vấn cho bạn! Để đưa ra gợi ý phù hợp nhất, bạn có thể cho tôi biết:\n\n• Bạn đang quan tâm đến loại bảo hiểm nào? (Xe cộ, Sức khỏe, Nhân thọ, Du lịch...)\n• Độ tuổi của bạn?\n• Ngân sách dự kiến?\n• Bạn đã có bảo hiểm gì chưa?`
    }
  }
  
  // Scenario 4: Compare products
  if (q.match(/so sánh|khác nhau|phân biệt/i)) {
    return {
      response: `Tôi sẽ giúp bạn so sánh các gói bảo hiểm. Bạn muốn so sánh gói nào với gói nào?\n\nVí dụ:\n• "So sánh TNDS và bảo hiểm vật chất xe"\n• "So sánh gói sức khỏe cơ bản và toàn diện"`
    }
  }
  
  // Default: Analyze from jsonData
  return generateDocumentAnalysisResponse(question, jsonData)
}

// Generate response based on document analysis (original logic)
function generateDocumentAnalysisResponse(question: string, jsonData: DocumentJsonData | null): { response: string; buttons?: ActionButton[] } {
  const q = question.toLowerCase()

  if (!jsonData) {
    return {
      response: 'Xin lỗi, tôi chưa có đủ thông tin để trả lời. Vui lòng đảm bảo tài liệu đã được phân tích thành công.'
    }
  }

  // Type of insurance
  if (q.includes('loại') || q.includes('thuộc') || q.includes('gói')) {
    const docType = jsonData.document_type || 'Chưa xác định'
    const confidence = jsonData.confidence ? (jsonData.confidence * 100).toFixed(0) : '0'
    return {
      response: `Dựa trên phân tích, hồ sơ này thuộc loại: **${docType}** (độ tin cậy: ${confidence}%).\n\nĐây là một loại bảo hiểm quan trọng giúp bảo vệ bạn khỏi các rủi ro liên quan.\n\n*(Thông tin này chỉ mang tính tham khảo...)*`
    }
  }

  // Benefits
  if (q.includes('quyền lợi') || q.includes('nhận được') || q.includes('lợi ích')) {
    const people = jsonData.people || []
    const orgs = jsonData.organizations || []
    const peopleNames = people.map(p => {
      if (typeof p === 'string') return p
      return p.name || 'N/A'
    }).join(', ')
    const orgNames = orgs.map(o => {
      if (typeof o === 'string') return o
      return o.name || 'N/A'
    }).join(', ')
    return {
      response: `Từ hồ sơ, tôi phát hiện:\n\n` +
           `👤 Người thụ hưởng: ${peopleNames || 'Chưa xác định'}\n` +
           `🏢 Tổ chức liên quan: ${orgNames || 'Chưa xác định'}\n\n` +
           `Quyền lợi cụ thể phụ thuộc vào điều khoản hợp đồng. Tôi khuyên bạn nên kiểm tra kỹ phần "Phạm vi bảo hiểm" trong hợp đồng.\n\n*(Thông tin này chỉ mang tính tham khảo...)*`
    }
  }

  // Additional insurance needed
  if (q.includes('mua thêm') || q.includes('cần thêm') || q.includes('bổ sung')) {
    const response = `Dựa trên loại bảo hiểm hiện tại (${jsonData.document_type || 'chưa xác định'}), tôi khuyên bạn nên xem xét:\n\n` +
           `1. 🛡 Bảo hiểm tai nạn cá nhân - để bảo vệ toàn diện\n` +
           `2. ❤️ Bảo hiểm sức khỏe - chi trả viện phí\n` +
           `3. 🏠 Bảo hiểm tài sản - bảo vệ nhà cửa, xe cộ\n\n` +
           `[Xem chi tiết: Bảo hiểm Sức khỏe Toàn diện]\n\n` +
           `Bạn muốn tôi giải thích chi tiết về gói nào?`
    
    return parseActionButtons(response)
  }

  // Default response
  const peopleCount = jsonData.people?.length || 0
  const orgsCount = jsonData.organizations?.length || 0
  
  return {
    response: `Dựa trên hồ sơ đã phân tích, tôi thấy:\n\n` +
         `📄 Loại tài liệu: ${jsonData.document_type || 'Chưa xác định'}\n` +
         `📊 Tổng số trang: ${jsonData.total_pages || 'N/A'}\n` +
         `👥 Số người liên quan: ${peopleCount}\n` +
         `🏢 Số tổ chức: ${orgsCount}\n\n` +
         `Bạn có thể hỏi tôi về quyền lợi, điều khoản, hoặc gợi ý bảo hiểm phù hợp.\n\n*(Thông tin này chỉ mang tính tham khảo...)*`
  }
}
