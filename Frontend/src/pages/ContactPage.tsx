import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    setSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Điện thoại',
      details: ['Hotline: 1900-xxxx (Miễn phí)', 'Di động: 0123-456-789'],
      color: 'text-trust-600',
      bgColor: 'bg-trust-50'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      details: ['support@vaminsurance.com', 'sales@vaminsurance.com'],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Địa chỉ',
      details: ['123 Đường ABC, Quận 1', 'TP. Hồ Chí Minh, Việt Nam'],
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Giờ làm việc',
      details: ['Thứ 2 - Thứ 6: 8:00 - 18:00', 'Thứ 7: 8:00 - 12:00'],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  const offices = [
    {
      city: 'TP. Hồ Chí Minh',
      address: '123 Đường ABC, Quận 1',
      phone: '(028) 1234-5678',
      isPrimary: true
    },
    {
      city: 'Hà Nội',
      address: '456 Phố XYZ, Quận Hoàn Kiếm',
      phone: '(024) 8765-4321',
      isPrimary: false
    },
    {
      city: 'Đà Nẵng',
      address: '789 Đường DEF, Quận Hải Châu',
      phone: '(0236) 3456-7890',
      isPrimary: false
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-trust-600 to-trust-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Liên hệ với chúng tôi
              </h1>
              <p className="text-xl text-trust-100 leading-relaxed">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. 
                Hãy để lại thông tin và chúng tôi sẽ liên hệ ngay!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {contactInfo.map((info, idx) => (
                <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 ${info.bgColor} rounded-2xl flex items-center justify-center ${info.color} mx-auto mb-4`}>
                      {info.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-sm text-gray-600">{detail}</p>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <Card className="border-2 border-trust-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-trust-600" />
                    Gửi tin nhắn cho chúng tôi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-transparent"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-transparent"
                        placeholder="email@vaminsurance.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-transparent"
                        placeholder="0123-456-789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chủ đề *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-transparent"
                      >
                        <option value="">Chọn chủ đề</option>
                        <option value="general">Tư vấn chung</option>
                        <option value="product">Sản phẩm bảo hiểm</option>
                        <option value="claim">Yêu cầu bồi thường</option>
                        <option value="support">Hỗ trợ kỹ thuật</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-trust-500 focus:border-transparent resize-none"
                        placeholder="Nhập nội dung tin nhắn của bạn..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full bg-trust-600 hover:bg-trust-700 text-white py-6"
                    >
                      {submitting ? (
                        'Đang gửi...'
                      ) : (
                        <>
                          Gửi tin nhắn
                          <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Offices */}
              <div className="space-y-6">
                <Card className="border-2 border-trust-200">
                  <CardHeader>
                    <CardTitle>Văn phòng của chúng tôi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {offices.map((office, idx) => (
                      <div 
                        key={idx}
                        className={`p-4 rounded-lg border-2 ${
                          office.isPrimary 
                            ? 'border-trust-300 bg-trust-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-gray-900">{office.city}</h4>
                          {office.isPrimary && (
                            <span className="text-xs bg-trust-600 text-white px-2 py-1 rounded-full">
                              Trụ sở chính
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{office.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span>{office.phone}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Support */}
                <Card className="bg-gradient-to-br from-trust-600 to-trust-800 text-white">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Cần hỗ trợ ngay?</h3>
                    <p className="text-trust-100 mb-6">
                      Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
                    </p>
                    <div className="space-y-3">
                      <a 
                        href="tel:1900-xxxx"
                        className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        <div>
                          <div className="text-sm text-trust-100">Hotline</div>
                          <div className="font-semibold">1900-xxxx</div>
                        </div>
                      </a>
                      <a 
                        href="mailto:support@vaminsurance.com"
                        className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                        <div>
                          <div className="text-sm text-trust-100">Email</div>
                          <div className="font-semibold">support@vaminsurance.com</div>
                        </div>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
