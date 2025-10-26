/**
 * My Documents Page - Insurance Purchase History
 * Hiển thị tài liệu và lịch sử mua bảo hiểm của người dùng
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  Package,
  CreditCard,
  Shield,
  Car,
  Home,
  Heart,
  Download,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react'

interface InsurancePurchase {
  id: number
  package_name: string
  package_type: string
  insurance_company: string | null
  customer_name: string
  customer_phone: string
  customer_email: string | null
  coverage_amount: string | null
  premium_amount: string
  payment_frequency: string | null
  start_date: string | null
  end_date: string | null
  vehicle_type: string | null
  license_plate: string | null
  payment_method: string | null
  payment_status: string
  policy_number: string | null
  status: string
  created_at: string
  updated_at: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PACKAGE_TYPE_ICONS: Record<string, React.ComponentType<any>> = {
  'TNDS': Car,
  'Sức khỏe': Heart,
  'Thiên tai': Home,
  'Nhà cửa': Home,
  'Xe cộ': Car,
  'default': Shield
}

const PACKAGE_TYPE_COLORS: Record<string, string> = {
  'TNDS': 'bg-blue-100 text-blue-700 border-blue-200',
  'Sức khỏe': 'bg-pink-100 text-pink-700 border-pink-200',
  'Thiên tai': 'bg-orange-100 text-orange-700 border-orange-200',
  'Nhà cửa': 'bg-green-100 text-green-700 border-green-200',
  'Xe cộ': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'default': 'bg-gray-100 text-gray-700 border-gray-200'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STATUS_BADGES: Record<string, { label: string; className: string; icon: React.ComponentType<any> }> = {
  'ACTIVE': { label: 'Đang hiệu lực', className: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  'PENDING': { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  'EXPIRED': { label: 'Hết hạn', className: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle },
  'CANCELLED': { label: 'Đã hủy', className: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
}

const PAYMENT_STATUS_BADGES: Record<string, { label: string; className: string }> = {
  'PAID': { label: 'Đã thanh toán', className: 'bg-green-100 text-green-700 border-green-200' },
  'PENDING': { label: 'Chờ thanh toán', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'FAILED': { label: 'Thất bại', className: 'bg-red-100 text-red-700 border-red-200' }
}

export default function MyDocumentsPage() {
  const navigate = useNavigate()
  const [purchases, setPurchases] = useState<InsurancePurchase[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPurchase, setSelectedPurchase] = useState<InsurancePurchase | null>(null)
  
  const loadPurchaseHistory = async () => {
    try {
      // Get user from localStorage
      const storedUser = localStorage.getItem('user')
      if (!storedUser) {
        console.log('No user found, redirecting to login')
        navigate('/login')
        return
      }
      
      const userData = JSON.parse(storedUser)
      console.log('User data:', userData)
      
      // Load purchase history
      const response = await fetch(`http://localhost:8000/users/${userData.id}/insurance-purchases`)
      
      if (!response.ok) {
        throw new Error('Failed to load purchase history')
      }
      
      const data = await response.json()
      setPurchases(data.purchases || [])
      
      console.log(`Loaded ${data.total || 0} purchases for user ${userData.id}`)
      
    } catch (error) {
      console.error('Error loading purchase history:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadPurchaseHistory()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseInt(amount))
  }
  
  const getPackageIcon = (packageType: string) => {
    const Icon = PACKAGE_TYPE_ICONS[packageType] || PACKAGE_TYPE_ICONS['default']
    return <Icon className="w-5 h-5" />
  }
  
  const getPackageColor = (packageType: string) => {
    return PACKAGE_TYPE_COLORS[packageType] || PACKAGE_TYPE_COLORS['default']
  }
  
  const calculateDaysRemaining = (endDate: string | null) => {
    if (!endDate) return null
    
    const end = endDate.includes('/') 
      ? new Date(endDate.split('/').reverse().join('-'))
      : new Date(endDate)
    
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    
    return days
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải lịch sử mua bảo hiểm...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Hợp đồng bảo hiểm của tôi</h1>
          <p className="text-indigo-100">Quản lý và theo dõi tất cả hợp đồng bảo hiểm của bạn</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng hợp đồng</p>
                  <p className="text-3xl font-bold text-indigo-600">{purchases.length}</p>
                </div>
                <FileText className="w-10 h-10 text-indigo-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đang hiệu lực</p>
                  <p className="text-3xl font-bold text-green-600">
                    {purchases.filter(p => p.status === 'ACTIVE').length}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chờ xử lý</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {purchases.filter(p => p.status === 'PENDING').length}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng phí</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(
                      purchases.reduce((sum, p) => sum + parseInt(p.premium_amount), 0).toString()
                    )}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Purchase List */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Danh sách hợp đồng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {purchases.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có hợp đồng nào</h3>
                <p className="text-gray-500 mb-6">Bắt đầu mua bảo hiểm để bảo vệ bản thân và gia đình</p>
                <Button
                  onClick={() => navigate('/products')}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Khám phá sản phẩm bảo hiểm
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase) => {
                  const StatusBadge = STATUS_BADGES[purchase.status] || STATUS_BADGES['ACTIVE']
                  const StatusIcon = StatusBadge.icon
                  const PaymentBadge = PAYMENT_STATUS_BADGES[purchase.payment_status] || PAYMENT_STATUS_BADGES['PENDING']
                  const daysRemaining = calculateDaysRemaining(purchase.end_date)
                  
                  return (
                    <div
                      key={purchase.id}
                      className="border rounded-xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-indigo-300"
                      onClick={() => setSelectedPurchase(purchase)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-xl ${getPackageColor(purchase.package_type)} flex items-center justify-center flex-shrink-0 border`}>
                          {getPackageIcon(purchase.package_type)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{purchase.package_name}</h3>
                              <p className="text-sm text-gray-600">{purchase.insurance_company || 'ADE Insurance'}</p>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Phí bảo hiểm</p>
                              <p className="text-xl font-bold text-indigo-600">{formatCurrency(purchase.premium_amount)}</p>
                            </div>
                          </div>
                          
                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${StatusBadge.className} flex items-center gap-1 border`}>
                              <StatusIcon className="w-3 h-3" />
                              {StatusBadge.label}
                            </span>
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${PaymentBadge.className} border`}>
                              <CreditCard className="w-3 h-3 inline mr-1" />
                              {PaymentBadge.label}
                            </span>
                            
                            {purchase.policy_number && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                <FileText className="w-3 h-3 inline mr-1" />
                                {purchase.policy_number}
                              </span>
                            )}
                            
                            {daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30 && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                Còn {daysRemaining} ngày
                              </span>
                            )}
                          </div>
                          
                          {/* Info Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {purchase.start_date && (
                              <div>
                                <span className="text-gray-500">Hiệu lực từ:</span>
                                <span className="ml-2 font-medium">{purchase.start_date}</span>
                              </div>
                            )}
                            
                            {purchase.end_date && (
                              <div>
                                <span className="text-gray-500">Đến:</span>
                                <span className="ml-2 font-medium">{purchase.end_date}</span>
                              </div>
                            )}
                            
                            {purchase.coverage_amount && (
                              <div>
                                <span className="text-gray-500">Số tiền BH:</span>
                                <span className="ml-2 font-medium">{formatCurrency(purchase.coverage_amount)}</span>
                              </div>
                            )}
                            
                            {purchase.vehicle_type && (
                              <div>
                                <span className="text-gray-500">Phương tiện:</span>
                                <span className="ml-2 font-medium">{purchase.license_plate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Purchase Detail Modal */}
      {selectedPurchase && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          onClick={() => setSelectedPurchase(null)}
        >
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white sticky top-0 z-10">
              <CardTitle className="flex items-center justify-between">
                <span>Chi tiết hợp đồng #{selectedPurchase.policy_number || selectedPurchase.id}</span>
                <button 
                  onClick={() => setSelectedPurchase(null)}
                  className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Package Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Thông tin gói bảo hiểm
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Tên gói</p>
                    <p className="font-semibold">{selectedPurchase.package_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loại bảo hiểm</p>
                    <p className="font-semibold">{selectedPurchase.package_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Công ty</p>
                    <p className="font-semibold">{selectedPurchase.insurance_company || 'ADE Insurance'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số hợp đồng</p>
                    <p className="font-semibold">{selectedPurchase.policy_number || 'Đang cập nhật'}</p>
                  </div>
                </div>
              </div>
              
              {/* Financial Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Thông tin tài chính
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Phí bảo hiểm</p>
                    <p className="text-xl font-bold text-indigo-600">{formatCurrency(selectedPurchase.premium_amount)}</p>
                  </div>
                  {selectedPurchase.coverage_amount && (
                    <div>
                      <p className="text-sm text-gray-500">Số tiền bảo hiểm</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(selectedPurchase.coverage_amount)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                    <p className="font-semibold">{selectedPurchase.payment_method || 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${PAYMENT_STATUS_BADGES[selectedPurchase.payment_status]?.className || ''}`}>
                      {PAYMENT_STATUS_BADGES[selectedPurchase.payment_status]?.label || selectedPurchase.payment_status}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Coverage Period */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Thời hạn bảo hiểm
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                    <p className="font-semibold">{selectedPurchase.start_date || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày kết thúc</p>
                    <p className="font-semibold">{selectedPurchase.end_date || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Vehicle Info (if applicable) */}
              {selectedPurchase.vehicle_type && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Car className="w-5 h-5 text-indigo-600" />
                    Thông tin phương tiện
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Loại xe</p>
                      <p className="font-semibold">{selectedPurchase.vehicle_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Biển số</p>
                      <p className="font-semibold">{selectedPurchase.license_plate}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={() => setSelectedPurchase(null)} variant="outline" className="flex-1">
                  Đóng
                </Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  <Download className="w-4 h-4 mr-2" />
                  Tải hợp đồng
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Eye className="w-4 h-4 mr-2" />
                  Xem chi tiết
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Footer />
    </div>
  )
}
