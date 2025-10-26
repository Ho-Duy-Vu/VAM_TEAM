import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsuranceStore } from '../store/insurance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  ArrowLeft,
  Package,
  Calendar,
  DollarSign,
  Shield
} from 'lucide-react';
import { formatPrice } from '../data/insurancePackages';

// Interface for application data with Vietnamese field names
interface ApplicationFormData {
  ho_ten?: string;
  so_dien_thoai?: string;
  email?: string;
  dia_chi_thuong_tru?: string;
  so_cccd?: string;
  loai_xe?: string;
  bien_so?: string;
  [key: string]: unknown; // Allow other dynamic fields
}

// Interface for Natural Disaster application data
interface NaturalDisasterFormData {
  chu_tai_san?: {
    thong_tin_ca_nhan?: {
      ho_ten?: string;
      giay_to?: {
        so?: string;
      };
    };
    thong_tin_lien_he?: {
      sdt?: string;
      email?: string;
      dia_chi_thuong_tru?: string;
    };
  };
  [key: string]: unknown;
}

export const PaymentPage = () => {
  const navigate = useNavigate();
  const { selectedPackage, applicationData, setCurrentContract, setCurrentStep } = useInsuranceStore();
  const [selectedMethod, setSelectedMethod] = useState<'qr' | 'card'>('qr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Redirect if no package selected
    if (!selectedPackage) {
      navigate('/');
      return;
    }

    // Redirect if no application data
    if (!applicationData) {
      navigate('/insurance/application');
      return;
    }

    // Set current step
    setCurrentStep('payment');
  }, [selectedPackage, applicationData, navigate, setCurrentStep]);

  const handlePaymentConfirm = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      
      // Generate contract and transaction IDs
      const contractId = `BH${Date.now().toString().slice(-8)}`;
      const transactionId = `TX${Date.now().toString().slice(-10)}`;
      const paymentMethod: 'qr_code' | 'credit_card' = selectedMethod === 'qr' ? 'qr_code' : 'credit_card';
      
      const contract = {
        id: contractId,
        packageId: selectedPackage!.id,
        applicationData: applicationData!,
        createdAt: new Date().toISOString(),
        status: 'active' as const,
        paymentInfo: {
          method: paymentMethod,
          amount: selectedPackage!.price,
          transactionId: transactionId,
          paidAt: new Date().toISOString(),
          status: 'completed' as const
        }
      };

      setCurrentContract(contract);
      setCurrentStep('success');

      // ✅ LƯU LỊCH SỬ MUA BẢO HIỂM VÀO DATABASE
      try {
        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        if (user && user.id) {
          // Get document ID if exists
          const uploadedDocIdsStr = localStorage.getItem('uploadedDocumentIds');
          const uploadedDocIds = uploadedDocIdsStr ? JSON.parse(uploadedDocIdsStr) : [];
          const documentId = uploadedDocIds.length > 0 ? uploadedDocIds[0] : null;
          
          // Format dates
          const today = new Date();
          const startDate = today.toLocaleDateString('vi-VN');
          const endDate = new Date(today.setFullYear(today.getFullYear() + 1)).toLocaleDateString('vi-VN');
          
          // Create purchase record
          // Check if this is Natural Disaster application (has chu_tai_san field)
          const isNaturalDisaster = applicationData && 'chu_tai_san' in applicationData;
          
          let customerName, customerPhone, customerEmail, customerAddress, customerIdNumber;
          let vehicleType = null, licensePlate = null;
          
          if (isNaturalDisaster) {
            // Natural Disaster Application format
            const ndData = applicationData as NaturalDisasterFormData;
            customerName = ndData.chu_tai_san?.thong_tin_ca_nhan?.ho_ten || user.full_name;
            customerPhone = ndData.chu_tai_san?.thong_tin_lien_he?.sdt || user.phone || '';
            customerEmail = ndData.chu_tai_san?.thong_tin_lien_he?.email || user.email;
            customerAddress = ndData.chu_tai_san?.thong_tin_lien_he?.dia_chi_thuong_tru || '';
            customerIdNumber = ndData.chu_tai_san?.thong_tin_ca_nhan?.giay_to?.so || '';
          } else {
            // Normal Application format
            const formData = applicationData as ApplicationFormData;
            customerName = formData.ho_ten || user.full_name;
            customerPhone = formData.so_dien_thoai || user.phone || '';
            customerEmail = formData.email || user.email;
            customerAddress = formData.dia_chi_thuong_tru || '';
            customerIdNumber = formData.so_cccd || '';
            vehicleType = formData.loai_xe || null;
            licensePlate = formData.bien_so || null;
          }
          
          const purchaseData = {
            user_id: user.id,
            package_name: selectedPackage!.name,
            package_type: selectedPackage!.name.includes('TNDS') ? 'TNDS' : 
                         selectedPackage!.name.includes('Sức khỏe') ? 'Sức khỏe' :
                         selectedPackage!.name.includes('Thiên tai') ? 'Thiên tai' : 'Bảo hiểm',
            insurance_company: 'ADE Insurance',
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_email: customerEmail,
            customer_address: customerAddress,
            customer_id_number: customerIdNumber,
            coverage_amount: selectedPackage!.coverage,
            premium_amount: selectedPackage!.price.toString(),
            payment_frequency: 'Năm',
            start_date: startDate,
            end_date: endDate,
            vehicle_type: vehicleType,
            license_plate: licensePlate,
            payment_method: paymentMethod === 'qr_code' ? 'Quét mã QR' : 'Thẻ tín dụng',
            payment_status: 'PAID',
            transaction_id: transactionId,
            document_id: documentId,
            policy_number: contractId,
            status: 'ACTIVE',
            additional_data: isNaturalDisaster ? JSON.stringify(applicationData) : null
          };
          
          console.log('💾 Saving purchase history:', purchaseData);
          
          const response = await fetch('http://localhost:8000/insurance-purchases', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(purchaseData)
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('✅ Purchase saved successfully:', result);
          } else {
            console.error('❌ Failed to save purchase:', await response.text());
          }
        } else {
          console.warn('⚠️ No user logged in, purchase not saved to database');
        }
      } catch (saveError) {
        console.error('❌ Error saving purchase to database:', saveError);
        // Don't block user flow even if save fails
      }

      // Navigate to success page after short delay
      setTimeout(() => {
        navigate('/insurance/success');
      }, 1500);
      
    } catch (error) {
      console.error('❌ Payment failed:', error);
      setIsProcessing(false);
      alert('Thanh toán thất bại. Vui lòng thử lại.');
    }
  };

  if (!selectedPackage || !applicationData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/insurance/application')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh Toán</h1>
            <p className="text-gray-600">Hoàn tất thanh toán để kích hoạt hợp đồng bảo hiểm</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods & QR Code */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Phương Thức Thanh Toán</CardTitle>
                <CardDescription>Chọn phương thức thanh toán phù hợp với bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Code Method */}
                <button
                  onClick={() => setSelectedMethod('qr')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === 'qr'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedMethod === 'qr' ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                      <QrCode className={`w-6 h-6 ${selectedMethod === 'qr' ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900">Quét Mã QR</h3>
                      <p className="text-sm text-gray-600">Thanh toán qua ví điện tử</p>
                    </div>
                    {selectedMethod === 'qr' && (
                      <CheckCircle2 className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                </button>

                {/* Credit Card Method */}
                <button
                  onClick={() => setSelectedMethod('card')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === 'card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedMethod === 'card' ? 'bg-blue-500' : 'bg-gray-200'
                    }`}>
                      <CreditCard className={`w-6 h-6 ${selectedMethod === 'card' ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900">Thẻ Tín Dụng/Ghi Nợ</h3>
                      <p className="text-sm text-gray-600">Thanh toán bằng thẻ ngân hàng</p>
                    </div>
                    {selectedMethod === 'card' && (
                      <CheckCircle2 className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* QR Code Display */}
            {selectedMethod === 'qr' && (
              <Card>
                <CardHeader>
                  <CardTitle>Quét Mã QR Để Thanh Toán</CardTitle>
                  <CardDescription>Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm mx-auto">
                      {/* Placeholder QR Code */}
                      <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <div className="bg-white p-4 rounded-lg">
                          <QrCode className="w-48 h-48 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="text-center space-y-2">
                        <p className="text-sm text-gray-600">Số tiền cần thanh toán</p>
                        <p className="text-2xl font-bold text-gray-900">{formatPrice(selectedPackage.price)}</p>
                        <p className="text-xs text-gray-500">
                          Nội dung: BH {selectedPackage.id.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600 mb-2">Hỗ trợ các ví điện tử</p>
                      <div className="flex justify-center gap-4">
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-semibold text-blue-600">
                          MoMo
                        </div>
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-semibold text-red-600">
                          ZaloPay
                        </div>
                        <div className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-semibold text-green-600">
                          VNPay
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Hướng dẫn thanh toán:</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Mở ứng dụng ngân hàng hoặc ví điện tử trên điện thoại</li>
                      <li>Chọn chức năng quét mã QR</li>
                      <li>Quét mã QR phía trên</li>
                      <li>Xác nhận thông tin và hoàn tất thanh toán</li>
                      <li>Nhấn nút "Đã Thanh Toán" bên dưới sau khi chuyển khoản thành công</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Credit Card Form */}
            {selectedMethod === 'card' && (
              <Card>
                <CardHeader>
                  <CardTitle>Thông Tin Thẻ</CardTitle>
                  <CardDescription>Nhập thông tin thẻ tín dụng/ghi nợ của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số thẻ
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày hết hạn
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên chủ thẻ
                    </label>
                    <input
                      type="text"
                      placeholder="NGUYEN VAN A"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Confirm Payment Button */}
            <Button
              onClick={handlePaymentConfirm}
              disabled={isProcessing || showSuccess}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Đang xử lý...
                </>
              ) : showSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Thanh toán thành công!
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Đã Thanh Toán
                </>
              )}
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Thông Tin Đơn Hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Package Info */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedPackage.color} flex items-center justify-center flex-shrink-0`}>
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{selectedPackage.name}</h3>
                      <p className="text-sm text-gray-600">{selectedPackage.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <Calendar className="w-4 h-4" />
                    <span>Thời hạn: {selectedPackage.period}</span>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí bảo hiểm</span>
                    <span className="font-semibold">{formatPrice(selectedPackage.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí dịch vụ</span>
                    <span className="font-semibold">0 ₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá</span>
                    <span className="font-semibold text-green-600">0 ₫</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        {formatPrice(selectedPackage.price)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Đã bao gồm VAT</p>
                    </div>
                  </div>
                </div>

                {/* Coverage Info */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Quyền lợi bảo hiểm</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{selectedPackage.coverage}</p>
                </div>

                {/* Security Note */}
                <div className="pt-4 border-t">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                      <div className="text-xs text-green-800">
                        <p className="font-semibold mb-1">Thanh toán an toàn</p>
                        <p>Thông tin của bạn được mã hóa và bảo mật tuyệt đối</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
