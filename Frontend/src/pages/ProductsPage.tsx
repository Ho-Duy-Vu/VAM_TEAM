import { Shield, Heart, Users, Plane, Car, Home, Building, Briefcase, Baby, ArrowRight, CheckCircle2, Droplets, Wind, CloudRain, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { insurancePackages, formatPrice } from '../data/insurancePackages'

interface Product {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
  features: string[]
  price: string
}

const products: Product[] = [
  {
    id: 'health',
    title: 'Bảo hiểm sức khỏe',
    description: 'Bảo vệ sức khỏe toàn diện cho bạn và gia đình',
    icon: <Heart className="w-10 h-10" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    features: [
      'Chi trả viện phí không giới hạn',
      'Khám chữa bệnh nội trú và ngoại trú',
      'Phẫu thuật và điều trị đặc biệt',
      'Xét nghiệm và chẩn đoán hình ảnh',
      'Thuốc men theo toa bác sĩ'
    ],
    price: 'Từ 200.000đ/tháng'
  },
  {
    id: 'accident',
    title: 'Bảo hiểm tai nạn cá nhân',
    description: 'Bảo vệ toàn diện trước các rủi ro tai nạn',
    icon: <Shield className="w-10 h-10" />,
    color: 'text-trust-600',
    bgColor: 'bg-trust-50',
    features: [
      'Bồi thường tử vong do tai nạn',
      'Chi phí điều trị thương tật',
      'Trợ cấp thu nhập khi nghỉ việc',
      'Bảo vệ 24/7 mọi lúc mọi nơi',
      'Không cần khám sức khỏe'
    ],
    price: 'Từ 150.000đ/tháng'
  },
  {
    id: 'social',
    title: 'Bảo hiểm xã hội',
    description: 'Quyền lợi người lao động theo luật định',
    icon: <Users className="w-10 h-10" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    features: [
      'Chế độ ốm đau, thai sản',
      'Lương hưu khi nghỉ việc',
      'Trợ cấp thất nghiệp',
      'Tai nạn lao động, bệnh nghề nghiệp',
      'Tử tuất'
    ],
    price: 'Theo quy định nhà nước'
  },
  {
    id: 'travel',
    title: 'Bảo hiểm du lịch',
    description: 'An tâm khám phá thế giới',
    icon: <Plane className="w-10 h-10" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    features: [
      'Y tế khẩn cấp khi đi du lịch',
      'Hủy chuyến đi bất khả kháng',
      'Thất lạc hành lý',
      'Chậm chuyến bay',
      'Hỗ trợ khẩn cấp 24/7'
    ],
    price: 'Từ 100.000đ/chuyến'
  },
  {
    id: 'car',
    title: 'Bảo hiểm ô tô',
    description: 'Bảo vệ xe và tài xế trên mọi hành trình',
    icon: <Car className="w-10 h-10" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    features: [
      'Bảo hiểm vật chất xe',
      'Trách nhiệm dân sự bắt buộc',
      'Tai nạn lái xe, hành khách',
      'Hỗ trợ sửa chữa khẩn cấp',
      'Đền bù thiệt hại bên thứ 3'
    ],
    price: 'Từ 500.000đ/năm'
  },
  {
    id: 'home',
    title: 'Bảo hiểm nhà cửa',
    description: 'Bảo vệ tài sản và tổ ấm của bạn',
    icon: <Home className="w-10 h-10" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    features: [
      'Cháy nổ, thiên tai',
      'Trộm cắp, mất trộm',
      'Thiệt hại nội thất',
      'Trách nhiệm dân sự',
      'Chi phí thuê nhà tạm'
    ],
    price: 'Từ 300.000đ/năm'
  },
  {
    id: 'business',
    title: 'Bảo hiểm doanh nghiệp',
    description: 'Bảo vệ toàn diện cho doanh nghiệp',
    icon: <Building className="w-10 h-10" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    features: [
      'Tài sản doanh nghiệp',
      'Trách nhiệm nghề nghiệp',
      'Gián đoạn kinh doanh',
      'Tai nạn lao động',
      'Bảo hiểm hàng hóa'
    ],
    price: 'Liên hệ tư vấn'
  },
  {
    id: 'life',
    title: 'Bảo hiểm nhân thọ',
    description: 'Bảo vệ tương lai gia đình bạn',
    icon: <Briefcase className="w-10 h-10" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    features: [
      'Quyền lợi tử vong',
      'Thương tật toàn bộ vĩnh viễn',
      'Bệnh hiểm nghèo',
      'Tích lũy tiết kiệm',
      'Miễn đóng phí bảo hiểm'
    ],
    price: 'Từ 500.000đ/tháng'
  },
  {
    id: 'children',
    title: 'Bảo hiểm cho trẻ em',
    description: 'Đầu tư cho tương lai con trẻ',
    icon: <Baby className="w-10 h-10" />,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    features: [
      'Chi phí giáo dục đại học',
      'Bệnh tật, tai nạn',
      'Miễn đóng phí nếu người đóng tử vong',
      'Tích lũy cho con',
      'Khuyến học, học bổng'
    ],
    price: 'Từ 250.000đ/tháng'
  }
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-trust-600 to-trust-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Sản phẩm bảo hiểm
              </h1>
              <p className="text-xl text-trust-100 leading-relaxed">
                Khám phá đa dạng các gói bảo hiểm phù hợp với nhu cầu của bạn. 
                Từ bảo hiểm sức khỏe đến bảo hiểm tài sản, chúng tôi có giải pháp cho mọi người.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card 
                  key={product.id}
                  className="border-2 hover:border-trust-300 hover:shadow-trust-lg transition-all duration-300 group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 ${product.bgColor} rounded-2xl flex items-center justify-center ${product.color} group-hover:scale-110 transition-transform`}>
                        {product.icon}
                      </div>
                      <span className="text-sm font-semibold text-trust-700 bg-trust-50 px-3 py-1 rounded-full">
                        {product.price}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-2">{product.title}</CardTitle>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-gray-900 text-sm">Quyền lợi bảo hiểm:</h4>
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Link to="/contact" className="flex-1">
                        <Button className="w-full bg-trust-600 hover:bg-trust-700 text-white">
                          Tư vấn ngay
                        </Button>
                      </Link>
                      <Button variant="outline" className="flex-1 border-trust-300 text-trust-700 hover:bg-trust-50">
                        Chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Natural Disaster Insurance Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">BẢO HIỂM THIÊN TAI</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Bảo Vệ Tài Sản Khỏi Thiên Tai
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Đặc biệt dành cho khu vực Miền Bắc và Miền Trung - Bảo vệ nhà cửa, tài sản khỏi ngập lụt, bão, lũ quét
              </p>
            </div>

            {/* Natural Disaster Packages */}
            <div className="grid md:grid-cols-3 gap-8">
              {insurancePackages
                .filter(pkg => pkg.type === 'natural_disaster')
                .map((pkg) => {
                  const iconMap: Record<string, React.ReactNode> = {
                    Droplets: <Droplets className="w-10 h-10" />,
                    Wind: <Wind className="w-10 h-10" />,
                    CloudRain: <CloudRain className="w-10 h-10" />
                  }
                  
                  const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
                    blue: { 
                      bg: 'bg-blue-50', 
                      text: 'text-blue-600', 
                      border: 'border-blue-200',
                      badge: 'bg-blue-600'
                    },
                    cyan: { 
                      bg: 'bg-cyan-50', 
                      text: 'text-cyan-600', 
                      border: 'border-cyan-200',
                      badge: 'bg-cyan-600'
                    },
                    slate: { 
                      bg: 'bg-slate-50', 
                      text: 'text-slate-600', 
                      border: 'border-slate-200',
                      badge: 'bg-slate-600'
                    }
                  }
                  
                  const colors = colorMap[pkg.color] || colorMap.blue
                  
                  return (
                    <Card 
                      key={pkg.id}
                      className={`border-2 ${colors.border} hover:shadow-2xl transition-all duration-300 group overflow-hidden`}
                    >
                      {pkg.featured && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center py-2 text-sm font-bold">
                          ⭐ PHỔ BIẾN NHẤT
                        </div>
                      )}
                      
                      <CardHeader className={colors.bg}>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center ${colors.text} shadow-lg group-hover:scale-110 transition-transform`}>
                            {iconMap[pkg.icon] || <Shield className="w-10 h-10" />}
                          </div>
                          <span className={`text-xs font-bold ${colors.badge} text-white px-3 py-1 rounded-full`}>
                            {pkg.period}
                          </span>
                        </div>
                        <CardTitle className="text-xl mb-2">{pkg.shortName}</CardTitle>
                        <p className="text-sm text-gray-600">{pkg.description}</p>
                      </CardHeader>

                      <CardContent className="pt-6">
                        {/* Price */}
                        <div className={`${colors.bg} rounded-lg p-4 mb-6 text-center border-2 ${colors.border}`}>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatPrice(pkg.price)}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Bảo hiểm: <span className={`font-bold ${colors.text}`}>{pkg.coverage}</span>
                          </div>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-2 mb-6">
                          <h4 className="font-semibold text-gray-900 text-sm">Quyền lợi:</h4>
                          {pkg.benefits.slice(0, 4).map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                              <span className="text-sm text-gray-700">{benefit}</span>
                            </div>
                          ))}
                          {pkg.benefits.length > 4 && (
                            <p className="text-xs text-gray-500 italic pl-6">
                              + {pkg.benefits.length - 4} quyền lợi khác...
                            </p>
                          )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-2">
                          <Link to={`/natural-disaster/${pkg.id}`}>
                            <Button 
                              className={`w-full ${colors.badge} hover:opacity-90 text-white font-bold`}
                            >
                              Xem Chi Tiết
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                          <Link to={`/natural-disaster/application?package=${pkg.id}`}>
                            <Button 
                              variant="outline"
                              className={`w-full border-2 ${colors.border} ${colors.text} hover:${colors.bg}`}
                            >
                              Đăng Ký Ngay
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>

            {/* Info Banner */}
            <div className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Tại sao cần bảo hiểm thiên tai?</h3>
                  <ul className="space-y-1 text-blue-100">
                    <li>✓ Miền Bắc & Miền Trung thường xuyên chịu ảnh hưởng bão, lũ</li>
                    <li>✓ Thiệt hại tài sản có thể lên đến hàng trăm triệu đồng</li>
                    <li>✓ Giám định nhanh 24h, thanh toán trong 5-7 ngày</li>
                    <li>✓ Chỉ từ 1,2 triệu/năm - Bảo vệ toàn diện tài sản của bạn</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-trust-50 to-blue-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Shield className="w-16 h-16 text-trust-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Không chắc chọn gói bảo hiểm nào?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Để AI của VAM Insurance phân tích hồ sơ và đề xuất gói bảo hiểm phù hợp nhất cho bạn
              </p>
              <Link to="/">
                <Button size="lg" className="bg-trust-600 hover:bg-trust-700 text-white px-8">
                  Phân tích hồ sơ ngay
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
