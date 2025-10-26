import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useInsuranceStore } from '../store/insurance';
import { formatPrice } from '../data/insurancePackages';

interface FormData {
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  so_cmnd: string;
  dia_chi: string;
  sdt: string;
  email: string;
  quoc_tich: string;
  noi_cap: string;
}

export const InsuranceApplicationFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedPackage, extractedData, setApplicationData, setCurrentStep } = useInsuranceStore();
  
  const [formData, setFormData] = useState<FormData>({
    ho_ten: '', ngay_sinh: '', gioi_tinh: 'Nam', so_cmnd: '',
    dia_chi: '', sdt: '', email: '', quoc_tich: 'Việt Nam', noi_cap: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (!selectedPackage) {
      navigate('/');
      return;
    }
    
    if (extractedData) {
      console.log('Auto-fill data:', extractedData);
      setFormData({
        ho_ten: (extractedData.fullName as string) || '',
        ngay_sinh: (extractedData.dateOfBirth as string) || '',
        gioi_tinh: (extractedData.gender as string) || 'Nam',
        so_cmnd: (extractedData.idNumber as string) || '',
        dia_chi: (extractedData.address as string) || '',
        sdt: (extractedData.phone as string) || '',
        email: (extractedData.email as string) || '',
        quoc_tich: (extractedData.nationality as string) || 'Việt Nam',
        noi_cap: (extractedData.placeOfOrigin as string) || ''
      });
    } else {
      setFormData({
        ho_ten: '', ngay_sinh: '', gioi_tinh: 'Nam', so_cmnd: '',
        dia_chi: '', sdt: '', email: '', quoc_tich: 'Việt Nam', noi_cap: ''
      });
    }
  }, [selectedPackage, extractedData, navigate]);
  
  if (!selectedPackage) return null;
  
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.ho_ten) newErrors.ho_ten = 'Vui lòng nhập họ tên';
    if (!formData.sdt) newErrors.sdt = 'Vui lòng nhập số điện thoại';
    if (!formData.email) newErrors.email = 'Vui lòng nhập email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    setIsSubmitting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setApplicationData(formData as any);
      setCurrentStep('payment');
      navigate('/insurance/payment');
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" onClick={() => navigate('/insurance/upload')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Đơn Đăng Ký Bảo Hiểm
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Vui lòng kiểm tra và bổ sung thông tin
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gói đã chọn:</p>
                <p className="text-lg font-bold text-blue-600">{selectedPackage.name}</p>
                <p className="text-sm text-gray-600">{formatPrice(selectedPackage.price)}</p>
              </div>
            </div>
            
            {extractedData && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Thông tin đã được tự động điền
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Dữ liệu được trích xuất từ tài liệu bạn tải lên. Vui lòng kiểm tra và bổ sung nếu cần.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {!extractedData && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-100">
                      Điền thông tin thủ công
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Vui lòng điền đầy đủ thông tin bên dưới
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <Card className="mb-6 bg-white border-2 border-gray-200">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Thông Tin Cá Nhân</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và Tên <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={formData.ho_ten || ''} onChange={(e) => handleChange('ho_ten', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nguyễn Văn A" />
                    {errors.ho_ten && <p className="text-red-500 text-sm mt-1">{errors.ho_ten}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày Sinh</label>
                    <input type="text" value={formData.ngay_sinh || ''} onChange={(e) => handleChange('ngay_sinh', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="DD/MM/YYYY" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giới Tính</label>
                    <select value={formData.gioi_tinh || 'Nam'} onChange={(e) => handleChange('gioi_tinh', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Số CMND/CCCD</label>
                    <input type="text" value={formData.so_cmnd || ''} onChange={(e) => handleChange('so_cmnd', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="001234567890" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa Chỉ</label>
                  <textarea value={formData.dia_chi || ''} onChange={(e) => handleChange('dia_chi', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số Điện Thoại <span className="text-red-500">*</span>
                    </label>
                    <input type="tel" value={formData.sdt || ''} onChange={(e) => handleChange('sdt', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0901234567" />
                    {errors.sdt && <p className="text-red-500 text-sm mt-1">{errors.sdt}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input type="email" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="example@email.com" />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Thông Tin Hợp Đồng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Sản phẩm:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedPackage.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Quyền lợi:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedPackage.coverage}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Phí bảo hiểm:</p>
                    <p className="font-semibold text-green-600 dark:text-green-400 text-lg">
                      {formatPrice(selectedPackage.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Thời hạn:</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedPackage.period}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={() => navigate('/insurance/upload')}
                className="border-2 border-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
              
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  setApplicationData(formData as any);
                  alert('Đã lưu nháp!');
                }} className="border-2 border-gray-300">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu nháp
                </Button>
                
                <Button type="submit" disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8">
                  {isSubmitting ? 'Đang xử lý...' : (
                    <>
                      Xác Nhận & Thanh Toán
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};