import { X, Shield, Droplets, Wind, CloudRain, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'

interface RecommendationPackage {
  name: string
  reason: string
  priority: number
}

interface InsuranceRecommendationModalProps {
  isOpen: boolean
  onClose: () => void
  placeOfOrigin?: {
    text: string
    region: string
  }
  address?: {
    text: string
    region: string
  }
  recommendedPackages?: RecommendationPackage[]
  onSelectPackage?: (packageName: string) => void
}

export default function InsuranceRecommendationModal({
  isOpen,
  onClose,
  placeOfOrigin,
  address,
  recommendedPackages = [],
  onSelectPackage
}: InsuranceRecommendationModalProps) {
  // Debug logs
  console.log('🎯 Modal render - isOpen:', isOpen, 'packages:', recommendedPackages?.length)
  console.log('📦 Modal props:', { placeOfOrigin, address, recommendedPackages })
  
  if (!isOpen) return null

  const regionInfo = placeOfOrigin || address
  const hasRecommendations = recommendedPackages.length > 0

  // Map package name to icon
  const getPackageIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('ngập lụt') || lowerName.includes('lũ')) {
      return <Droplets className="w-8 h-8" />
    } else if (lowerName.includes('bão') || lowerName.includes('gió')) {
      return <Wind className="w-8 h-8" />
    } else if (lowerName.includes('phương tiện') || lowerName.includes('xe')) {
      return <CloudRain className="w-8 h-8" />
    }
    return <Shield className="w-8 h-8" />
  }

  // Get package color
  const getPackageColor = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('ngập lụt') || lowerName.includes('lũ')) {
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700'
      }
    } else if (lowerName.includes('bão') || lowerName.includes('gió')) {
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        border: 'border-indigo-200',
        button: 'bg-indigo-600 hover:bg-indigo-700'
      }
    } else if (lowerName.includes('phương tiện') || lowerName.includes('xe')) {
      return {
        bg: 'bg-cyan-50',
        text: 'text-cyan-600',
        border: 'border-cyan-200',
        button: 'bg-cyan-600 hover:bg-cyan-700'
      }
    }
    return {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      border: 'border-gray-200',
      button: 'bg-gray-600 hover:bg-gray-700'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <Card className="border-2 border-blue-200 shadow-2xl animate-in slide-in-from-bottom duration-300">
          {/* Header with warning banner */}
          {hasRecommendations && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 animate-pulse" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold">⚠️ CẢNH BÁO RỦI RO THIÊN TAI</h3>
                  <p className="text-sm opacity-90">
                    Khu vực của bạn thuộc vùng có nguy cơ cao về bão lũ và thiên tai
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          <CardContent className="p-6">
            {/* Region Info */}
            {regionInfo && (
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Thông tin đã phân tích</h4>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">
                    {placeOfOrigin ? '🏡 Quê quán:' : '📍 Địa chỉ:'}
                  </span>{' '}
                  {regionInfo.text}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Vùng miền:</span>{' '}
                  <span className="font-bold text-blue-600">
                    {regionInfo.region === 'Bac' ? 'Miền Bắc' :
                     regionInfo.region === 'Trung' ? 'Miền Trung' :
                     regionInfo.region === 'Nam' ? 'Miền Nam' : 'Chưa xác định'}
                  </span>
                </p>
              </div>
            )}

            {/* Recommendations */}
            {hasRecommendations ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🎯 Gói bảo hiểm được đề xuất cho bạn
                </h2>
                <p className="text-gray-600 mb-6">
                  Dựa trên phân tích AI về khu vực của bạn, chúng tôi khuyến nghị các gói bảo hiểm sau:
                </p>

                <div className="space-y-4">
                  {recommendedPackages.map((pkg, index) => {
                    const colors = getPackageColor(pkg.name)
                    const icon = getPackageIcon(pkg.name)

                    return (
                      <Card
                        key={index}
                        className={`border-2 ${colors.border} hover:shadow-xl transition-all duration-300 animate-in slide-in-from-left`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`${colors.bg} ${colors.text} p-4 rounded-2xl flex-shrink-0`}>
                              {icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {pkg.name}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span className="font-medium">
                                      Độ ưu tiên: {(pkg.priority * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <p className="text-gray-700 mb-4 leading-relaxed">
                                {pkg.reason}
                              </p>

                              {/* Key Benefits */}
                              <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span>Bảo vệ toàn diện</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span>Bồi thường nhanh</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span>Hỗ trợ 24/7</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  <span>Giá ưu đãi</span>
                                </div>
                              </div>

                              {/* CTA Button */}
                              <Button
                                className={`w-full ${colors.button} text-white font-semibold py-6 text-lg`}
                                onClick={() => {
                                  onSelectPackage?.(pkg.name)
                                  // onClose is handled by parent onSelectPackage callback
                                }}
                              >
                                🛡️ Đăng ký ngay - Bảo vệ tài sản
                                <ArrowRight className="w-5 h-5 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Footer CTA */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        💡 Bảo vệ ngay hôm nay - Yên tâm mọi ngày mai
                      </p>
                      <p className="text-sm text-gray-600">
                        Đừng để thiên tai làm bạn bất ngờ. Đăng ký ngay để được bảo vệ!
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Khu vực có mức độ rủi ro thấp
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Dựa trên phân tích, khu vực của bạn có mức độ rủi ro thiên tai thấp.
                  </p>
                  <Button onClick={onClose} className="bg-trust-600 hover:bg-trust-700">
                    Đóng
                  </Button>
                </div>
              </>
            )}

            {/* Close button at bottom */}
            {hasRecommendations && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="text-gray-600"
                >
                  Xem sau
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
