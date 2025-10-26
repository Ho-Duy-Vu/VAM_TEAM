import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Shield, 
  Home, 
  Droplets, 
  Wind, 
  CloudRain, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Phone,
  Clock,
  TrendingUp,
  FileText,
  ChevronRight,
  MapPin
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { getPackageById, formatPrice } from '../data/insurancePackages'

export default function NaturalDisasterPackageDetailPage() {
  const { packageId } = useParams<{ packageId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const packageData = packageId ? getPackageById(packageId) : undefined

  if (!packageData || packageData.type !== 'natural_disaster') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Không tìm thấy gói bảo hiểm</h1>
            <Button onClick={() => navigate('/products')}>Quay lại</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getPackageIcon = () => {
    if (packageData.id.includes('flood')) return <Droplets className="w-12 h-12" />
    if (packageData.id.includes('storm')) return <Wind className="w-12 h-12" />
    if (packageData.id.includes('vehicle')) return <CloudRain className="w-12 h-12" />
    return <Shield className="w-12 h-12" />
  }

  const getColorClasses = () => {
    const colorMap: Record<string, { bg: string; text: string; border: string; accent: string }> = {
      blue: { 
        bg: 'bg-blue-50 dark:bg-blue-950/30', 
        text: 'text-blue-600 dark:text-blue-400', 
        border: 'border-blue-200 dark:border-blue-800',
        accent: 'bg-blue-600'
      },
      cyan: { 
        bg: 'bg-cyan-50 dark:bg-cyan-950/30', 
        text: 'text-cyan-600 dark:text-cyan-400', 
        border: 'border-cyan-200 dark:border-cyan-800',
        accent: 'bg-cyan-600'
      },
      slate: { 
        bg: 'bg-slate-50 dark:bg-slate-950/30', 
        text: 'text-slate-600 dark:text-slate-400', 
        border: 'border-slate-200 dark:border-slate-800',
        accent: 'bg-slate-600'
      }
    }
    return colorMap[packageData.color] || colorMap.blue
  }

  const colors = getColorClasses()

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: FileText },
    { id: 'benefits', label: 'Quyền lợi chi tiết', icon: CheckCircle2 },
    { id: 'exclusions', label: 'Loại trừ', icon: XCircle },
    { id: 'documents', label: 'Hồ sơ yêu cầu', icon: FileText },
    { id: 'claims', label: 'Quy trình bồi thường', icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-cyan-950/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <Card className={`mb-8 border-2 ${colors.border} overflow-hidden`}>
          <div className={`${colors.bg} p-8`}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className={`p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ${colors.text}`}>
                {getPackageIcon()}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 ${colors.accent} text-white text-xs font-semibold rounded-full`}>
                    BẢO HIỂM THIÊN TAI
                  </span>
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    PHỔ BIẾN
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {packageData.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  {packageData.description}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`w-5 h-5 ${colors.text}`} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phí bảo hiểm</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(packageData.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className={`w-5 h-5 ${colors.text}`} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Thời hạn</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{packageData.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className={`w-5 h-5 ${colors.text}`} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Mức bảo hiểm</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{packageData.coverage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-5 h-5 ${colors.text}`} />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Áp dụng</p>
                      <p className="font-semibold text-gray-900 dark:text-white">Toàn quốc</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg"
                  className={`${colors.accent} hover:opacity-90 text-white font-semibold px-8`}
                  onClick={() => navigate(`/insurance/application?package=${packageData.id}`)}
                >
                  Đăng ký ngay
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2"
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Tư vấn miễn phí
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Navigation */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? `${colors.accent} text-white shadow-lg`
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Shield className={`w-6 h-6 ${colors.text}`} />
                  Quyền lợi chính
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {packageData.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <CheckCircle2 className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} />
                      <span className="text-gray-700 dark:text-gray-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'benefits' && packageData.detailedBenefits && (
            <div className="space-y-6">
              {packageData.detailedBenefits.propertyDamage && (
                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Home className={`w-6 h-6 ${colors.text}`} />
                      {packageData.detailedBenefits.propertyDamage.title}
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {packageData.detailedBenefits.propertyDamage.items.map((item, idx) => (
                        <div key={idx} className={`p-4 border-2 ${colors.border} rounded-lg hover:shadow-md transition-shadow`}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                            <span className={`${colors.accent} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                              {item.coverage}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {packageData.detailedBenefits.emergencySupport && (
                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <AlertCircle className={`w-6 h-6 ${colors.text}`} />
                      {packageData.detailedBenefits.emergencySupport.title}
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {packageData.detailedBenefits.emergencySupport.items.map((item, idx) => (
                        <div key={idx} className={`p-4 border-2 ${colors.border} rounded-lg hover:shadow-md transition-shadow`}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                            <span className={`${colors.accent} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                              {item.coverage}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {packageData.detailedBenefits.additionalServices && (
                <Card>
                  <CardHeader>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <CheckCircle2 className={`w-6 h-6 ${colors.text}`} />
                      {packageData.detailedBenefits.additionalServices.title}
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {packageData.detailedBenefits.additionalServices.items.map((item, idx) => (
                        <div key={idx} className={`p-4 border-2 ${colors.border} rounded-lg hover:shadow-md transition-shadow`}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                              {item.coverage}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'exclusions' && packageData.exclusions && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
                  <XCircle className="w-6 h-6" />
                  Trường hợp không được bồi thường
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Các trường hợp sau đây không thuộc phạm vi bảo hiểm. Vui lòng đọc kỹ trước khi đăng ký.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {packageData.exclusions.map((exclusion, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-r-lg">
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-200">{exclusion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'documents' && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileText className={`w-6 h-6 ${colors.text}`} />
                  Hồ sơ cần chuẩn bị
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Vui lòng chuẩn bị đầy đủ các giấy tờ sau để quá trình đăng ký diễn ra nhanh chóng
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {packageData.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-4 border-2 ${colors.border} rounded-lg`}>
                      <CheckCircle2 className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} />
                      <span className="text-gray-700 dark:text-gray-200">{doc}</span>
                    </div>
                  ))}
                </div>
                
                <div className={`mt-6 p-4 ${colors.bg} border-2 ${colors.border} rounded-lg`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <AlertCircle className={`w-5 h-5 ${colors.text}`} />
                    Lưu ý quan trọng
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-7">
                    <li>• Tất cả giấy tờ phải là bản gốc hoặc sao y công chứng</li>
                    <li>• Hình ảnh tài sản phải rõ nét, chụp từ nhiều góc độ</li>
                    <li>• Giấy tờ quyền sở hữu phải còn hiệu lực</li>
                    <li>• Có thể nộp hồ sơ trực tuyến hoặc tại văn phòng</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'claims' && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className={`w-6 h-6 ${colors.text}`} />
                  Quy trình bồi thường
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Quy trình nhanh chóng, minh bạch, thanh toán trong 5-7 ngày làm việc
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      step: '01',
                      title: 'Báo cáo thiệt hại',
                      description: 'Gọi hotline 1900-xxxx hoặc báo qua app trong vòng 24h kể từ khi xảy ra sự cố',
                      time: 'Ngay lập tức'
                    },
                    {
                      step: '02',
                      title: 'Giám định hiện trường',
                      description: 'Chuyên viên giám định sẽ đến tận nơi để đánh giá thiệt hại và chụp ảnh hiện trường',
                      time: '24-48h'
                    },
                    {
                      step: '03',
                      title: 'Nộp hồ sơ bồi thường',
                      description: 'Cung cấp hồ sơ: Giấy tờ nhà, ảnh thiệt hại, biên bản sự cố, báo cáo giám định',
                      time: '3-5 ngày'
                    },
                    {
                      step: '04',
                      title: 'Thẩm định hồ sơ',
                      description: 'Bộ phận thẩm định xem xét hồ sơ, xác minh thông tin và tính toán mức bồi thường',
                      time: '2-3 ngày'
                    },
                    {
                      step: '05',
                      title: 'Thanh toán bồi thường',
                      description: 'Chuyển khoản trực tiếp vào tài khoản của bạn sau khi phê duyệt hồ sơ',
                      time: '1-2 ngày'
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${colors.accent} text-white rounded-full flex items-center justify-center font-bold text-lg`}>
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Cam kết của chúng tôi
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-7">
                    <li>✓ Giám định nhanh chóng trong vòng 24-48h</li>
                    <li>✓ Thanh toán bồi thường trong 5-7 ngày làm việc</li>
                    <li>✓ Hỗ trợ 24/7 qua hotline và app</li>
                    <li>✓ Miễn phí tư vấn pháp lý và thủ tục</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* CTA Section */}
        <Card className={`mt-8 ${colors.bg} border-2 ${colors.border}`}>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Bảo vệ tài sản của bạn ngay hôm nay!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Chỉ từ {formatPrice(packageData.price)}/năm - Bảo vệ trọn vẹn, an tâm tuyệt đối
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/contact')}
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Tư vấn miễn phí
                </Button>
                <Button 
                  size="lg"
                  className={`${colors.accent} hover:opacity-90 text-white font-semibold px-8`}
                  onClick={() => navigate(`/insurance/application?package=${packageData.id}`)}
                >
                  Đăng ký ngay
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
