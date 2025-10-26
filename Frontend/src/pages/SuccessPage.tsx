import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsuranceStore } from '../store/insurance';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  CheckCircle2, 
  Download, 
  Home, 
  FileText,
  Calendar,
  CreditCard,
  Package,
  Shield,
  Sparkles,
  Mail,
  Phone
} from 'lucide-react';
import { formatPrice } from '../data/insurancePackages';

export const SuccessPage = () => {
  const navigate = useNavigate();
  const { currentContract, selectedPackage, resetFlow } = useInsuranceStore();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Redirect if no contract
    if (!currentContract || !selectedPackage) {
      navigate('/');
      return;
    }

    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [currentContract, selectedPackage, navigate]);

  const handleDownloadContract = () => {
    // Simulate PDF download
    const blob = new Blob([`Hợp Đồng Bảo Hiểm #${currentContract?.id}`], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HopDong_BaoHiem_${currentContract?.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleBackHome = () => {
    resetFlow();
    navigate('/');
  };

  if (!currentContract || !selectedPackage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <Sparkles className={`w-4 h-4 ${
                ['text-yellow-400', 'text-blue-400', 'text-green-400', 'text-purple-400', 'text-pink-400'][Math.floor(Math.random() * 5)]
              }`} />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-lg animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Chúc Mừng! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Bạn đã mua bảo hiểm thành công
          </p>
          <p className="text-sm text-gray-500">
            Hợp đồng của bạn đã được kích hoạt và có hiệu lực ngay lập tức
          </p>
        </div>

        {/* Contract ID Card */}
        <Card className="mb-6 border-2 border-green-200 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Mã Hợp Đồng</p>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-4 tracking-wider">
                {currentContract.id}
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Ngày tạo: {new Date(currentContract.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Package Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedPackage.color} flex items-center justify-center flex-shrink-0`}>
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 mb-1">Gói Bảo Hiểm</p>
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedPackage.name}</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4" />
                      <span>Quyền lợi: {selectedPackage.coverage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Thời hạn: {selectedPackage.period}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 mb-1">Thông Tin Thanh Toán</p>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {formatPrice(currentContract.paymentInfo.amount)}
                  </h3>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600">
                      Phương thức: <span className="font-medium">
                        {currentContract.paymentInfo.method === 'qr_code' ? 'Quét mã QR' : 'Thẻ tín dụng'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Mã GD: <span className="font-medium">{currentContract.paymentInfo.transactionId}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Đã thanh toán</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Quyền Lợi Bảo Hiểm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedPackage.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Các Bước Tiếp Theo</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Kiểm tra email</p>
                  <p className="text-sm text-gray-600">
                    Chúng tôi đã gửi hợp đồng bảo hiểm và giấy chứng nhận đến email của bạn
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tải xuống hợp đồng</p>
                  <p className="text-sm text-gray-600">
                    Lưu trữ hợp đồng PDF để tiện tra cứu khi cần thiết
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Liên hệ hỗ trợ</p>
                  <p className="text-sm text-gray-600">
                    Nếu có thắc mắc, vui lòng liên hệ hotline hoặc email hỗ trợ
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Thông Tin Liên Hệ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hotline</p>
                  <p className="font-semibold text-gray-900">1900 xxxx</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">support@insurance.vn</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownloadContract}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Tải Xuống Hợp Đồng
          </Button>
          <Button
            onClick={handleBackHome}
            variant="outline"
            className="flex-1 border-2 border-gray-300 hover:bg-gray-50 font-semibold py-6 text-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Về Trang Chủ
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              Mã hợp đồng <span className="font-semibold text-gray-900">{currentContract.id}</span> đã được lưu vào tài khoản của bạn
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
};
