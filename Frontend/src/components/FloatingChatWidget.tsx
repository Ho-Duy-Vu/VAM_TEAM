/**
 * Floating Insurance Chatbot Widget
 * Always-accessible AI advisor powered by Gemini
 * Responsive mobile design with iMessage-style UI
 */

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { Button } from './ui/button'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Quick suggestion questions
const QUICK_QUESTIONS = [
  '🌊 Tôi ở miền Trung – nên mua gì?',
  '🚗 Xe ngập nước có bồi thường không?',
  '⛈️ Giải thích quyền lợi bảo hiểm thiên tai'
]

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: '👋 Xin chào! Tôi là AI tư vấn bảo hiểm của ADE Insurance. Tôi có thể giúp gì cho bạn?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom when new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])
  
  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(event.target as Node)) {
        // Don't close if clicking the floating button
        const target = event.target as HTMLElement
        if (!target.closest('[data-chat-button]')) {
          // Removed auto-close: setIsOpen(false)
        }
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  // Get uploaded document ID from localStorage
  const getDocumentId = (): number | null => {
    try {
      const stored = localStorage.getItem('uploadedDocumentIds')
      if (stored) {
        const ids = JSON.parse(stored)
        return ids.length > 0 ? ids[0] : null
      }
    } catch (error) {
      console.error('Error parsing document IDs:', error)
    }
    return null
  }
  
  const sendMessage = async (content: string) => {
    if (!content.trim()) return
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    
    try {
      // Prepare chat history (last 10 messages for context)
      const chatHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      // Get document ID if available
      const documentId = getDocumentId()
      
      // Call chat API
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          document_id: documentId,
          chat_history: chatHistory
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      
      // Log context info for debugging
      console.log('[Chat] Context:', {
        has_context: data.has_context,
        region: data.region,
        document_id: documentId
      })
      
    } catch (error) {
      console.error('Chat error:', error)
      
      // Fallback error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau hoặc liên hệ hotline: 1900-xxxx',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }
  
  const handleQuickQuestion = (question: string) => {
    // Remove emoji prefix for cleaner message
    const cleanQuestion = question.replace(/^[^\s]+\s/, '')
    sendMessage(cleanQuestion)
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  return (
    <>
      {/* Floating Chat Button - Bottom Right */}
      {!isOpen && (
        <button
          data-chat-button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 group"
          aria-label="Mở chat tư vấn bảo hiểm"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            💬 Tư vấn bảo hiểm miễn phí
            <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}
      
      {/* Chat Window - iMessage Style */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 animate-slide-up"
        >
          {/* Header - Gradient */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-3xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-2xl">🤖</span>
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-base">AI Tư vấn Bảo hiểm</h3>
                <p className="text-xs text-white/90 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Đang online
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Đóng chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages - iMessage Style */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1.5 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator - iOS Style */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 rounded-3xl rounded-bl-md px-5 py-3.5 shadow-sm border border-gray-200 dark:border-gray-600">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Questions - Only show initially */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">💡 Câu hỏi gợi ý:</p>
              <div className="flex flex-col gap-2">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs text-left px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300 rounded-xl hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/40 dark:hover:to-purple-900/40 transition-all border border-indigo-200 dark:border-indigo-800"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input - Modern Design */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-3xl">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 transition-all"
                disabled={isTyping}
                maxLength={500}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Powered by Gemini AI 🚀
            </p>
          </form>
        </div>
      )}
      
      {/* Mobile Responsive Styles */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        @media (max-width: 640px) {
          [data-chat-button] {
            bottom: 1rem;
            right: 1rem;
          }
          
          ${isOpen ? `
          .fixed.bottom-6.right-6.w-96 {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }
          
          .fixed.bottom-6.right-6.w-96 > div:first-child {
            border-radius: 0 !important;
          }
          
          .fixed.bottom-6.right-6.w-96 > form:last-child {
            border-radius: 0 !important;
          }
          ` : ''}
        }
      `}</style>
    </>
  )
}
