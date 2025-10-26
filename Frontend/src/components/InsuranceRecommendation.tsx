import { Shield, Heart, AlertCircle, CheckCircle2, ArrowRight, CloudRain, Wind, Droplets } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import type { DocumentJsonData } from '../api/types'

interface InsuranceRecommendationProps {
  jsonData: DocumentJsonData | null
  recommendationData?: {
    address?: {
      text: string
      type: string
      region: string
    }
    place_of_origin?: {
      text: string
      region: string
    }
    recommended_packages?: Array<{
      name: string
      reason: string
      priority: number
    }>
  }
}

interface Recommendation {
  id: string
  title: string
  reason: string
  benefits: string[]
  icon: React.ReactNode
  color: string
  bgColor: string
}

export default function InsuranceRecommendation({ jsonData, recommendationData }: InsuranceRecommendationProps) {
  // Debug logging
  console.log('🔍 InsuranceRecommendation props:', { 
    jsonData: jsonData ? 'present' : 'null', 
    recommendationData,
    hasRecommendations: recommendationData?.recommended_packages?.length
  })

  if (!jsonData) {
    return (
      <Card className="h-full flex items-center justify-center border-warning-200 bg-warning-50">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-warning-600" />
          <p className="text-warning-900 font-semibold">Chưa có dữ liệu phân tích</p>
        </CardContent>
      </Card>
    )
  }

  // Analyze document and generate recommendations
  const getRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = []
    
    // 🎯 PRIORITY 1: Use AI recommendation from backend (thiên tai, bão lũ)
    if (recommendationData?.recommended_packages && recommendationData.recommended_packages.length > 0) {
      console.log('✅ Using AI recommendations:', recommendationData.recommended_packages.length)
      recommendationData.recommended_packages.forEach((pkg) => {
        // Map package name to icon and benefits
        let icon = <Shield className="w-6 h-6" />
        let benefits: string[] = []
        
        if (pkg.name.toLowerCase().includes('ngập lụt') || pkg.name.toLowerCase().includes('lũ')) {
          icon = <Droplets className="w-6 h-6" />
          benefits = [
            'Bồi thường thiệt hại do ngập lụt, lũ quét',
            'Chi trả chi phí sửa chữa tài sản',
            'Hỗ trợ tái thiết sau thiên tai',
            'Bảo vệ tài sản trong mùa mưa bão'
          ]
        } else if (pkg.name.toLowerCase().includes('bão') || pkg.name.toLowerCase().includes('gió')) {
          icon = <Wind className="w-6 h-6" />
          benefits = [
            'Bảo vệ nhà cửa khỏi hư hại do bão',
            'Chi trả sửa chữa mái nhà, cửa sổ, tường',
            'Bồi thường thiệt hại do gió mạnh',
            'Hỗ trợ xây dựng lại sau bão'
          ]
        } else if (pkg.name.toLowerCase().includes('phương tiện') || pkg.name.toLowerCase().includes('xe')) {
          icon = <CloudRain className="w-6 h-6" />
          benefits = [
            'Bảo vệ xe máy, ô tô khỏi ngập nước',
            'Chi trả sửa chữa động cơ bị hư hỏng',
            'Bồi thường hệ thống điện bị ngấm nước',
            'Hỗ trợ cứu hộ khi xe bị ngập'
          ]
        }
        
        recommendations.push({
          id: `ai-${pkg.name.toLowerCase().replace(/\s+/g, '-')}`,
          title: pkg.name,
          reason: pkg.reason,
          benefits,
          icon,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        })
      })
      
      return recommendations
    }
    
    console.log('⚠️ No AI recommendations, checking recommendationData:', recommendationData)
    
    // If AI returned data but no packages (e.g., South region), still return empty to show region info
    if (recommendationData?.address || recommendationData?.place_of_origin) {
      console.log('ℹ️ AI analyzed region but no packages recommended')
      return []
    }
    
    // PRIORITY 2: Fallback to document type analysis
    const docType = jsonData.document_type?.toLowerCase() || ''
    
    // Personal Accident Insurance
    if (docType.includes('tai nạn') || docType.includes('accident') || docType.includes('lao động')) {
      recommendations.push({
        id: 'accident',
        title: 'Bảo hiểm tai nạn cá nhân',
        reason: 'Trong hồ sơ có: Lao động công trình / Rủi ro nghề nghiệp cao',
        benefits: [
          'Bồi thường tai nạn do nghề nghiệp',
          'Hỗ trợ viện phí và phẫu thuật',
          'Trợ cấp thu nhập khi nghỉ việc',
          'Bảo vệ 24/7 mọi lúc mọi nơi'
        ],
        icon: <Shield className="w-6 h-6" />,
        color: 'text-trust-600',
        bgColor: 'bg-trust-50'
      })
    }

    // Health Insurance
    if (docType.includes('sức khỏe') || docType.includes('health') || docType.includes('y tế')) {
      recommendations.push({
        id: 'health',
        title: 'Bảo hiểm sức khỏe toàn diện',
        reason: 'Phát hiện nhu cầu chăm sóc sức khỏe trong hồ sơ',
        benefits: [
          'Chi trả viện phí không giới hạn',
          'Khám chữa bệnh nội trú / ngoại trú',
          'Xét nghiệm và chẩn đoán hình ảnh',
          'Phẫu thuật và điều trị đặc biệt'
        ],
        icon: <Heart className="w-6 h-6" />,
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      })
    }

    // If no specific type detected, recommend based on extracted entities
    if (recommendations.length === 0) {
      // Check for high-risk indicators
      const people = jsonData.people || []
      const organizations = jsonData.organizations || []
      
      if (people.length > 0 || organizations.length > 0) {
        recommendations.push({
          id: 'general',
          title: 'Bảo hiểm bảo vệ toàn diện',
          reason: 'Dựa trên phân tích hồ sơ và thông tin cá nhân',
          benefits: [
            'Bảo vệ tài chính cho gia đình',
            'Hỗ trợ chi phí y tế',
            'Bảo vệ tài sản cá nhân',
            'Tư vấn và hỗ trợ 24/7'
          ],
          icon: <Shield className="w-6 h-6" />,
          color: 'text-trust-600',
          bgColor: 'bg-trust-50'
        })
      }
    }

    return recommendations
  }

  const recommendations = getRecommendations()
  
  // Display address/region info if available (prioritize place_of_origin)
  const regionInfo = recommendationData?.place_of_origin || recommendationData?.address
  
  console.log('📊 Recommendations:', recommendations.length, 'Region Info:', regionInfo)

  // If we have no recommendations but do have region analysis
  if (recommendations.length === 0 && regionInfo) {
    console.log('ℹ️ Showing region info without recommendations (likely South Vietnam)')
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-trust-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-trust-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Phân tích vùng miền</h2>
            <p className="text-gray-600">Dựa trên phân tích AI từ hồ sơ của bạn</p>
          </div>
        </div>

        {/* Region Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {recommendationData?.place_of_origin ? '🏡 Quê quán' : '📍 Địa chỉ thường trú'}: 
                  <span className="ml-2 text-blue-700">{regionInfo.text}</span>
                </p>
                <p className="text-xs text-gray-600">
                  Vùng miền: <span className="font-semibold">
                    {regionInfo.region === 'Bac' ? 'Miền Bắc' : 
                     regionInfo.region === 'Trung' ? 'Miền Trung' : 
                     regionInfo.region === 'Nam' ? 'Miền Nam' : 'Chưa xác định'}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-success-200 bg-success-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-success-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-success-900 mb-1">
                  Khu vực có mức độ rủi ro thấp
                </h3>
                <p className="text-sm text-success-700 mb-3">
                  Dựa trên phân tích, khu vực của bạn có mức độ rủi ro thiên tai thấp. 
                  Tuy nhiên, chúng tôi vẫn khuyến nghị bạn xem xét các gói bảo hiểm cơ bản 
                  để bảo vệ tài sản và gia đình.
                </p>
                <Button size="sm" className="bg-trust-600 hover:bg-trust-700 text-white">
                  Xem gói bảo hiểm cơ bản
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-trust-50 to-blue-50 border-trust-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Heart className="w-6 h-6 text-trust-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Cần tư vấn thêm về bảo hiểm?
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 để tìm gói bảo hiểm phù hợp nhất.
                </p>
                <Button size="sm" className="bg-trust-600 hover:bg-trust-700 text-white">
                  Chat với chuyên gia
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If no recommendations and no region info - show generic message
  if (recommendations.length === 0) {
    return (
      <Card className="border-warning-200 bg-warning-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-warning-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-warning-900 mb-1">
                Chưa có đủ thông tin để đưa ra gợi ý
              </h3>
              <p className="text-sm text-warning-700">
                AI cần thêm thông tin từ hồ sơ để đưa ra khuyến nghị bảo hiểm phù hợp. 
                Vui lòng kiểm tra lại tài liệu hoặc liên hệ với chúng tôi để được tư vấn trực tiếp.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-trust-100 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-trust-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gói bảo hiểm phù hợp</h2>
          <p className="text-gray-600">Dựa trên phân tích AI từ hồ sơ của bạn</p>
        </div>
      </div>

      {/* Region Info Card */}
      {regionInfo && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {recommendationData?.place_of_origin ? '🏡 Quê quán' : '📍 Địa chỉ thường trú'}: 
                  <span className="ml-2 text-blue-700">{regionInfo.text}</span>
                </p>
                <p className="text-xs text-gray-600">
                  Vùng miền: <span className="font-semibold">
                    {regionInfo.region === 'Bac' ? 'Miền Bắc' : 
                     regionInfo.region === 'Trung' ? 'Miền Trung' : 
                     regionInfo.region === 'Nam' ? 'Miền Nam' : 'Chưa xác định'}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {recommendations.map((rec) => (
          <Card 
            key={rec.id} 
            className="border-2 border-trust-200 hover:border-trust-400 hover:shadow-trust-lg transition-all duration-300"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${rec.bgColor} rounded-2xl flex items-center justify-center ${rec.color}`}>
                    {rec.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{rec.title}</CardTitle>
                      <span className="px-3 py-1 bg-trust-100 text-trust-700 text-xs font-medium rounded-full">
                        Khuyến nghị
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{rec.reason}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Phạm vi quyền lợi:</h4>
                <div className="space-y-2">
                  {rec.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button className="flex-1 bg-trust-600 hover:bg-trust-700 text-white">
                  Liên hệ tư vấn
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" className="flex-1 border-trust-300 text-trust-700 hover:bg-trust-50">
                  Xem chi tiết
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-trust-50 to-blue-50 border-trust-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Heart className="w-6 h-6 text-trust-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                Cần tư vấn thêm về bảo hiểm?
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 để tìm gói bảo hiểm phù hợp nhất.
              </p>
              <Button size="sm" className="bg-trust-600 hover:bg-trust-700 text-white">
                Chat với chuyên gia
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
