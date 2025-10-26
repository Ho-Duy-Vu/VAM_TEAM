import { useNavigate } from 'react-router-dom'
import { 
  Shield, 
  Heart, 
  Users, 
  Plane, 
  LifeBuoy, 
  Car,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { InsurancePackagesSection } from '../components/InsurancePackagesSection'

interface InsuranceType {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const insuranceTypes: InsuranceType[] = [
  {
    id: 'accident',
    title: 'Tai nạn cá nhân',
    description: 'Bảo vệ toàn diện cho các rủi ro tai nạn bất ngờ',
    icon: <Shield className="w-8 h-8" />,
    color: 'text-trust-600',
    bgColor: 'bg-trust-50'
  },
  {
    id: 'health',
    title: 'Sức khỏe',
    description: 'Chi trả viện phí, phẫu thuật và điều trị nội trú',
    icon: <Heart className="w-8 h-8" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 'social',
    title: 'Bảo hiểm xã hội',
    description: 'Quyền lợi người lao động theo luật định',
    icon: <Users className="w-8 h-8" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'travel',
    title: 'Du lịch quốc tế',
    description: 'An tâm mọi chuyến đi với bảo hiểm toàn cầu',
    icon: <Plane className="w-8 h-8" />,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50'
  },
  {
    id: 'life',
    title: 'Nhân thọ',
    description: 'Bảo vệ tương lai cho gia đình bạn',
    icon: <LifeBuoy className="w-8 h-8" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    id: 'property',
    title: 'Tài sản - Ô tô / Nhà ở',
    description: 'Bảo vệ tài sản khỏi thiệt hại và mất mát',
    icon: <Car className="w-8 h-8" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
]

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Đa dạng gói bảo hiểm',
    description: '7 gói bảo hiểm từ 400K - 8M VNĐ cho mọi nhu cầu'
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI tự động điền form',
    description: 'Trích xuất thông tin từ CCCD, giấy tờ của bạn'
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: 'Thanh toán tiện lợi',
    description: 'QR Code hoặc thẻ tín dụng an toàn, nhanh chóng'
  }
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section with Background Image */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-gradient-to-br from-[#0a192f] via-[#1e3a5f] to-[#2c5282]">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0"
            style={{
              // Sau khi import heroBackground, uncomment dòng dưới và comment dòng linear-gradient
              // backgroundImage: `url(${heroBackground})`,
              backgroundImage: `linear-gradient(135deg, #0a192f 0%, #1e3a5f 50%, #2c5282 100%)`,
              backgroundSize: 'contain', // Hiển thị đủ nội dung ảnh
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#0f2744', // Màu nền cho phần trống
            }}
          >
            {/* Tech Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
            
            {/* Gradient Overlay - creates depth and ensures text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-trust-950/60 via-transparent to-blue-900/60"></div>
            
            {/* Glowing orbs for depth */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
            
            {/* Animated particles effect */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
              <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              <div className="absolute top-2/3 right-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
            
            {/* Shield icon watermark */}
            <div className="absolute right-10 top-1/4 opacity-5">
              <Shield className="w-96 h-96 text-white" />
            </div>
          </div>
        
          <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium shadow-lg">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>Powered by AI Technology</span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
                Bảo Hiểm Thông Minh
              </h1>
              <p className="text-xl lg:text-2xl text-gray-100 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
                Lựa chọn gói bảo hiểm phù hợp. AI tự động điền thông tin từ tài liệu của bạn.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Button
                  onClick={() => {
                    // Scroll to insurance packages section
                    document.getElementById('insurance-packages')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Xem Các Gói Bảo Hiểm
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/about')}
                  className="border-2 border-white/50 bg-white/5 text-white hover:bg-white/20 hover:border-white/70 px-8 py-6 rounded-xl font-semibold text-lg backdrop-blur-md transition-all duration-300 hover:scale-105"
                >
                  Tìm Hiểu Thêm
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Features Highlight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                {features.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto text-blue-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Insurance Packages Section - MAIN FEATURE */}
        <InsurancePackagesSection />

      {/* Insurance Types Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Các loại bảo hiểm chúng tôi hỗ trợ
          </h2>
          <p className="text-lg text-gray-600">
            AI của chúng tôi có thể phân tích và tư vấn cho mọi loại hợp đồng bảo hiểm
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {insuranceTypes.map((type) => (
            <Card 
              key={type.id} 
              className="group hover:shadow-trust-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-trust-300 overflow-hidden"
            >
              <CardContent className="p-8">
                <div className={`w-16 h-16 ${type.bgColor} rounded-2xl flex items-center justify-center ${type.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {type.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-trust-600 transition-colors">
                  {type.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {type.description}
                </p>

                <div className="flex items-center text-trust-600 font-medium group-hover:gap-2 transition-all">
                  <span>Tìm hiểu thêm</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
