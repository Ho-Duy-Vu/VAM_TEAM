import { Shield, Target, Users, Zap, Award, Globe, Heart, TrendingUp } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Card, CardContent } from '../components/ui/card'

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Uy tín & Tin cậy',
      description: 'Cam kết bảo vệ quyền lợi khách hàng với sự minh bạch cao nhất',
      color: 'text-trust-600',
      bgColor: 'bg-trust-50'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Công nghệ AI tiên tiến',
      description: 'Ứng dụng Gemini AI để phân tích và tư vấn chính xác',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Tận tâm với khách hàng',
      description: 'Hỗ trợ 24/7, luôn đặt lợi ích khách hàng lên hàng đầu',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Chất lượng hàng đầu',
      description: 'Đạt nhiều giải thưởng uy tín trong ngành bảo hiểm',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const stats = [
    { number: '100K+', label: 'Khách hàng tin tưởng' },
    { number: '500+', label: 'Gói bảo hiểm' },
    { number: '99.8%', label: 'Hài lòng' },
    { number: '24/7', label: 'Hỗ trợ' }
  ]

  const team = [
    {
      name: 'Nguyễn Văn A',
      role: 'CEO & Founder',
      description: '15+ năm kinh nghiệm trong ngành bảo hiểm',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=2563eb&color=fff'
    },
    {
      name: 'Trần Thị B',
      role: 'CTO',
      description: 'Chuyên gia AI và Machine Learning',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=7c3aed&color=fff'
    },
    {
      name: 'Lê Văn C',
      role: 'Head of Insurance',
      description: 'Chuyên viên tư vấn bảo hiểm cao cấp',
      avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=059669&color=fff'
    },
    {
      name: 'Phạm Thị D',
      role: 'Head of Customer Success',
      description: 'Đảm bảo trải nghiệm khách hàng tốt nhất',
      avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+D&background=dc2626&color=fff'
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
                Về VAM Insurance
              </h1>
              <p className="text-xl text-trust-100 leading-relaxed">
                Chúng tôi đang cách mạng hóa ngành bảo hiểm với công nghệ AI tiên tiến, 
                giúp mọi người dễ dàng tiếp cận và lựa chọn gói bảo hiểm phù hợp nhất.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <Card className="border-2 border-trust-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-trust-100 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-trust-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Làm cho bảo hiểm trở nên dễ hiểu và dễ tiếp cận hơn cho mọi người thông qua 
                    công nghệ AI. Chúng tôi tin rằng mọi người đều xứng đáng có được sự bảo vệ 
                    tốt nhất mà không cần phải trải qua các quy trình phức tạp.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-trust-200">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                    <Globe className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tầm nhìn</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Trở thành nền tảng bảo hiểm AI hàng đầu Việt Nam, nơi công nghệ kết hợp 
                    hoàn hảo với dịch vụ con người để mang lại trải nghiệm bảo hiểm tốt nhất, 
                    nhanh chóng và đáng tin cậy nhất.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-r from-trust-50 to-blue-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-trust-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
              <p className="text-lg text-gray-600">
                Những nguyên tắc định hướng mọi hoạt động của chúng tôi
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, idx) => (
                <Card key={idx} className="border-2 hover:border-trust-300 hover:shadow-lg transition-all">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center ${value.color} mx-auto mb-4`}>
                      {value.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Đội ngũ lãnh đạo</h2>
              <p className="text-lg text-gray-600">
                Những người đam mê công nghệ và mong muốn thay đổi ngành bảo hiểm
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {team.map((member, idx) => (
                <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                    <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-trust-600 text-sm font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-gray-600">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Tại sao chọn VAM Insurance?
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: 'AI phân tích tức thì',
                    description: 'Gemini 2.5 Flash giúp phân tích hồ sơ trong vài giây, không cần chờ đợi'
                  },
                  {
                    icon: <Heart className="w-6 h-6" />,
                    title: 'Tư vấn cá nhân hóa',
                    description: 'Đề xuất gói bảo hiểm dựa trên nhu cầu thực tế của bạn, không áp đặt'
                  },
                  {
                    icon: <TrendingUp className="w-6 h-6" />,
                    title: 'Giá cả cạnh tranh',
                    description: 'So sánh giá từ nhiều nhà cung cấp để bạn có lựa chọn tốt nhất'
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: 'Bảo mật tuyệt đối',
                    description: 'Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn quốc tế'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-6 bg-white rounded-xl border-2 border-gray-100 hover:border-trust-200 transition-colors">
                    <div className="w-12 h-12 bg-trust-100 rounded-xl flex items-center justify-center text-trust-600 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
