/**
 * Improved Insurance Application Form
 * Multi-step form with specific fields for each insurance type
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  ArrowRight, 
  User,
  Heart,
  Car,
  Shield,
  CheckCircle,
  Users,
  FileText,
  Camera
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useInsuranceStore } from '../store/insurance'
import { formatPrice } from '../data/insurancePackages'
import type { InsuranceType } from '../types/insurance'

export default function ImprovedInsuranceApplicationPage() {
  const navigate = useNavigate()
  const { selectedPackage, extractedData, setApplicationData, setCurrentStep } = useInsuranceStore()
  
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({})
  const [filePreviews, setFilePreviews] = useState<Record<string, string[]>>({})
  const [familyMembers, setFamilyMembers] = useState<Array<{
    ho_ten: string
    quan_he: string
    ngay_sinh: string
    cmnd: string
  }>>([{ ho_ten: '', quan_he: '', ngay_sinh: '', cmnd: '' }])

  useEffect(() => {
    if (!selectedPackage) {
      navigate('/')
      return
    }

    // Initialize form with extracted data
    if (extractedData) {
      setFormData({
        ho_ten: extractedData.fullName || '',
        ngay_sinh: extractedData.dateOfBirth || '',
        gioi_tinh: extractedData.gender || 'Nam',
        so_cmnd: extractedData.idNumber || '',
        dia_chi: extractedData.address || '',
        sdt: extractedData.phone || '',
        email: extractedData.email || '',
        quoc_tich: extractedData.nationality || 'Việt Nam',
        noi_cap: extractedData.placeOfOrigin || '',
        package_id: selectedPackage.id,
        insurance_type: selectedPackage.type,
        
        // Vehicle info (for vehicle insurance)
        bien_so: extractedData.licensePlate || '',
        so_khung: extractedData.chassisNumber || '',
        so_may: extractedData.engineNumber || '',
        hang_xe: extractedData.brand || '',
        dong_xe: extractedData.model || '',
        nam_san_xuat: extractedData.manufacturingYear || '',
        mau_xe: extractedData.color || '',
        dung_tich_xy_lanh: extractedData.engineCapacity || '',
        loai_xe: extractedData.vehicleType || ''
      })
    } else {
      setFormData({
        gioi_tinh: 'Nam',
        quoc_tich: 'Việt Nam',
        package_id: selectedPackage.id,
        insurance_type: selectedPackage.type
      })
    }
  }, [selectedPackage, extractedData, navigate])

  if (!selectedPackage) return null

  const insuranceType = selectedPackage.type as InsuranceType

  // Define sections based on insurance type
  const getSections = () => {
    const baseSections = [
      { id: 0, title: 'Thông tin cá nhân', icon: User }
    ]

    switch (insuranceType) {
      case 'life':
        return [
          ...baseSections,
          { id: 1, title: 'Nghề nghiệp & Thu nhập', icon: FileText },
          { id: 2, title: 'Người thụ hưởng', icon: Users },
          { id: 3, title: 'Tình trạng sức khỏe', icon: Heart },
          { id: 4, title: 'Xác nhận', icon: CheckCircle }
        ]
      
      case 'health':
        return [
          ...baseSections,
          { id: 1, title: 'Lịch sử bệnh', icon: Heart },
          { id: 2, title: 'Thành viên gia đình', icon: Users },
          { id: 3, title: 'Xác nhận', icon: CheckCircle }
        ]
      
      case 'vehicle':
        return [
          ...baseSections,
          { id: 1, title: 'Thông tin xe', icon: Car },
          { id: 2, title: 'Giấy phép lái xe', icon: FileText },
          { id: 3, title: 'Lịch sử BH & Tai nạn', icon: Shield },
          { id: 4, title: 'Hình ảnh & Xác nhận', icon: Camera }
        ]
      
      case 'mandatory_health':
        return [
          ...baseSections,
          { id: 1, title: 'Thông tin công việc', icon: FileText },
          { id: 2, title: 'Đăng ký KCB', icon: Heart },
          { id: 3, title: 'Hồ sơ & Xác nhận', icon: Camera }
        ]
      
      default:
        return [
          ...baseSections,
          { id: 1, title: 'Xác nhận', icon: CheckCircle }
        ]
    }
  }

  const sections = getSections()

  const validateCurrentSection = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Section 0: Basic personal info (all types)
    if (currentSection === 0) {
      if (!formData.ho_ten) newErrors.ho_ten = 'Vui lòng nhập họ tên'
      if (!formData.sdt) newErrors.sdt = 'Vui lòng nhập số điện thoại'
      else if (!/^0\d{9}$/.test(formData.sdt as string)) {
        newErrors.sdt = 'Số điện thoại không hợp lệ (phải có 10 số, bắt đầu bằng 0)'
      }
      if (!formData.email) newErrors.email = 'Vui lòng nhập email'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email as string)) {
        newErrors.email = 'Email không hợp lệ'
      }
      if (!formData.so_cmnd) newErrors.so_cmnd = 'Vui lòng nhập số CMND/CCCD'
      else if (!/^\d{9}$|^\d{12}$/.test((formData.so_cmnd as string).replace(/\s/g, ''))) {
        newErrors.so_cmnd = 'CMND phải có 9 số hoặc CCCD phải có 12 số'
      }
    }

    // Type-specific validation
    if (insuranceType === 'life') {
      if (currentSection === 1) {
        if (!formData.nghe_nghiep) newErrors.nghe_nghiep = 'Vui lòng nhập nghề nghiệp'
        if (!formData.noi_lam_viec) newErrors.noi_lam_viec = 'Vui lòng nhập nơi làm việc'
        if (!formData.thu_nhap_hang_thang) newErrors.thu_nhap = 'Vui lòng nhập thu nhập'
      }
      if (currentSection === 2) {
        if (!formData.nguoi_thu_huong_ho_ten) newErrors.beneficiary = 'Vui lòng nhập người thụ hưởng'
        if (!formData.nguoi_thu_huong_quan_he) newErrors.beneficiary_relation = 'Vui lòng chọn quan hệ'
      }
      if (currentSection === 3) {
        if (formData.co_benh_nen === 'Co' && !formData.mo_ta_benh) {
          newErrors.health_description = 'Vui lòng mô tả bệnh nền'
        }
      }
    }

    if (insuranceType === 'health') {
      if (currentSection === 3) {
        if (!formData.benh_vien_uu_tien) {
          newErrors.hospital = 'Vui lòng chọn bệnh viện ưu tiên'
        }
        if (formData.benh_vien_uu_tien === 'Khac' && !formData.benh_vien_khac) {
          newErrors.hospital_other = 'Vui lòng nhập tên bệnh viện'
        }
      }
    }

    if (insuranceType === 'vehicle') {
      if (currentSection === 1) {
        if (!formData.bien_so) newErrors.bien_so = 'Vui lòng nhập biển số xe'
        else if (!/^\d{2}[A-Z]-\d{4,5}$/.test((formData.bien_so as string).toUpperCase())) {
          newErrors.bien_so = 'Biển số không đúng định dạng (VD: 30A-12345)'
        }
        if (!formData.hang_xe) newErrors.hang_xe = 'Vui lòng nhập hãng xe'
        if (!formData.gia_tri_xe) newErrors.gia_tri = 'Vui lòng nhập giá trị xe'
      }
      if (currentSection === 2) {
        if (!formData.so_bang_lai) newErrors.so_bang_lai = 'Vui lòng nhập số bằng lái'
      }
      if (currentSection === 3) {
        if (formData.da_gap_tai_nan === 'Co' && !formData.mo_ta_tai_nan) {
          newErrors.accident_description = 'Vui lòng mô tả tai nạn đã xảy ra'
        }
      }
    }

    if (insuranceType === 'mandatory_health') {
      if (currentSection === 1) {
        if (!formData.noi_lam_viec) newErrors.noi_lam_viec = 'Vui lòng nhập nơi làm việc'
      }
      if (currentSection === 2) {
        if (!formData.tinh_thanh_dang_ky) newErrors.tinh_thanh = 'Vui lòng chọn tỉnh/thành'
        if (!formData.co_so_dang_ky_kcb) newErrors.co_so_kcb = 'Vui lòng nhập cơ sở KCB'
      }
      if (currentSection === 3) {
        if (!formData.so_ho_khau) newErrors.so_ho_khau = 'Vui lòng nhập số hộ khẩu'
        if (!formData.dia_chi_ho_khau) newErrors.dia_chi_ho_khau = 'Vui lòng nhập địa chỉ hộ khẩu'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateCurrentSection()) {
      if (currentSection < sections.length - 1) {
        setCurrentSection(prev => prev + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc')
    }
  }

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentSection()) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setIsSubmitting(true)
    try {
      // Prepare form data with files and family members
      const completeData = {
        ...formData,
        family_members: familyMembers,
        uploaded_files: uploadedFiles
      }

      // TODO: Upload files to server
      // const formDataToSend = new FormData()
      // Object.entries(uploadedFiles).forEach(([field, files]) => {
      //   files.forEach(file => formDataToSend.append(field, file))
      // })
      // await uploadFiles(formDataToSend)

      setApplicationData(completeData as Record<string, unknown>)
      setCurrentStep('payment')
      navigate('/insurance/payment')
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const validFiles: File[] = []
    const previews: string[] = []
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file size
      if (file.size > maxSize) {
        alert(`File "${file.name}" vượt quá 5MB. Vui lòng chọn file nhỏ hơn.`)
        continue
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" không đúng định dạng. Chỉ chấp nhận JPG, PNG.`)
        continue
      }

      validFiles.push(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          previews.push(e.target.result as string)
          if (previews.length === validFiles.length) {
            setFilePreviews((prev) => ({
              ...prev,
              [fieldName]: [...(prev[fieldName] || []), ...previews]
            }))
          }
        }
      }
      reader.readAsDataURL(file)
    }

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldName]: [...(prev[fieldName] || []), ...validFiles]
      }))
    }
  }

  const removeFile = (fieldName: string, index: number) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }))
    setFilePreviews((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }))
  }

  const addFamilyMember = () => {
    if (familyMembers.length >= 5) {
      alert('Tối đa 5 thành viên gia đình')
      return
    }
    setFamilyMembers([...familyMembers, { ho_ten: '', quan_he: '', ngay_sinh: '', cmnd: '' }])
  }

  const removeFamilyMember = (index: number) => {
    if (familyMembers.length <= 1) {
      alert('Phải có ít nhất 1 thành viên')
      return
    }
    setFamilyMembers(familyMembers.filter((_, i) => i !== index))
  }

  const updateFamilyMember = (index: number, field: string, value: string) => {
    const updated = [...familyMembers]
    updated[index] = { ...updated[index], [field]: value }
    setFamilyMembers(updated)
  }

  const renderSectionContent = () => {
    // Section 0: Basic Personal Info (all types)
    if (currentSection === 0) {
      return renderPersonalInfoSection()
    }

    // Type-specific sections
    switch (insuranceType) {
      case 'life':
        return renderLifeInsuranceSections()
      case 'health':
        return renderHealthInsuranceSections()
      case 'vehicle':
        return renderVehicleInsuranceSections()
      case 'mandatory_health':
        return renderMandatoryHealthSections()
      default:
        return renderConfirmationSection()
    }
  }

  const renderPersonalInfoSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Thông Tin Cá Nhân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Họ và Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={(formData.ho_ten as string) || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, ho_ten: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nguyễn Văn A"
            />
            {errors.ho_ten && <p className="text-red-500 text-sm mt-1">{errors.ho_ten}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ngày Sinh</label>
            <input
              type="text"
              value={(formData.ngay_sinh as string) || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, ngay_sinh: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="DD/MM/YYYY"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Giới Tính</label>
            <select
              value={(formData.gioi_tinh as string) || 'Nam'}
              onChange={(e) => setFormData(prev => ({ ...prev, gioi_tinh: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Nam">Nam</option>
              <option value="Nu">Nữ</option>
              <option value="Khac">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Số CMND/CCCD <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={(formData.so_cmnd as string) || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, so_cmnd: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="001234567890"
            />
            {errors.so_cmnd && <p className="text-red-500 text-sm mt-1">{errors.so_cmnd}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Địa Chỉ</label>
          <textarea
            value={(formData.dia_chi as string) || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, dia_chi: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Số Điện Thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={(formData.sdt as string) || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, sdt: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0901234567"
            />
            {errors.sdt && <p className="text-red-500 text-sm mt-1">{errors.sdt}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={(formData.email as string) || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderLifeInsuranceSections = () => {
    if (currentSection === 1) {
      // Occupation & Income
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nghề Nghiệp & Thu Nhập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nghề nghiệp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={(formData.nghe_nghiep as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nghe_nghiep: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Kỹ sư, Bác sĩ, Giáo viên..."
                />
                {errors.nghe_nghiep && <p className="text-red-500 text-sm mt-1">{errors.nghe_nghiep}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nơi làm việc <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={(formData.noi_lam_viec as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, noi_lam_viec: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Công ty ABC, Bệnh viện XYZ..."
                />
                {errors.noi_lam_viec && <p className="text-red-500 text-sm mt-1">{errors.noi_lam_viec}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Thu nhập hàng tháng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={(formData.thu_nhap_hang_thang as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, thu_nhap_hang_thang: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="20.000.000 VNĐ"
                />
                {errors.thu_nhap && <p className="text-red-500 text-sm mt-1">{errors.thu_nhap}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )
    } else if (currentSection === 2) {
      // Beneficiary
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Người Thụ Hưởng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Họ tên người thụ hưởng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={(formData.nguoi_thu_huong_ho_ten as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nguoi_thu_huong_ho_ten: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                {errors.beneficiary && <p className="text-red-500 text-sm mt-1">{errors.beneficiary}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quan hệ</label>
                <select
                  value={(formData.nguoi_thu_huong_quan_he as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nguoi_thu_huong_quan_he: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">-- Chọn --</option>
                  <option value="Vo_Chong">Vợ/Chồng</option>
                  <option value="Con">Con</option>
                  <option value="Cha_Me">Cha/Mẹ</option>
                  <option value="Anh_Chi_Em">Anh/Chị/Em</option>
                  <option value="Khac">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số CMND/CCCD</label>
                <input
                  type="text"
                  value={(formData.nguoi_thu_huong_cmnd as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nguoi_thu_huong_cmnd: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={(formData.nguoi_thu_huong_sdt as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nguoi_thu_huong_sdt: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )
    } else if (currentSection === 3) {
      // Health Declaration
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Khai Báo Sức Khỏe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Chiều cao (cm)</label>
                <input
                  type="text"
                  value={(formData.chieu_cao as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, chieu_cao: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="170"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cân nặng (kg)</label>
                <input
                  type="text"
                  value={(formData.can_nang as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, can_nang: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="65"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bạn có bệnh nền không?</label>
              <select
                value={(formData.co_benh_nen as string) || 'Khong'}
                onChange={(e) => setFormData(prev => ({ ...prev, co_benh_nen: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Khong">Không</option>
                <option value="Co">Có</option>
              </select>
            </div>

            {formData.co_benh_nen === 'Co' && (
              <div>
                <label className="block text-sm font-medium mb-2">Mô tả bệnh nền</label>
                <textarea
                  value={(formData.mo_ta_benh as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, mo_ta_benh: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Tiểu đường, huyết áp cao..."
                />
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hút thuốc lá?</label>
                <select
                  value={(formData.hut_thuoc as string) || 'Khong'}
                  onChange={(e) => setFormData(prev => ({ ...prev, hut_thuoc: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="Khong">Không</option>
                  <option value="Co">Có</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Uống rượu bia?</label>
                <select
                  value={(formData.uong_ruou as string) || 'Khong'}
                  onChange={(e) => setFormData(prev => ({ ...prev, uong_ruou: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="Khong">Không</option>
                  <option value="Thuong_xuyen">Thường xuyên</option>
                  <option value="Thỉnh thoảng">Thỉnh thoảng</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    } else {
      return renderConfirmationSection()
    }
  }

  const renderHealthInsuranceSections = () => {
    if (currentSection === 1) {
      // Medical History
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lịch Sử Bệnh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bệnh hiện có (có thể chọn nhiều)</label>
              <div className="grid grid-cols-2 gap-2">
                {['Tiểu đường', 'Huyết áp cao', 'Tim mạch', 'Hen suyễn', 'Dạ dày', 'Khác'].map(disease => (
                  <label key={disease} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      value={disease}
                      onChange={(e) => {
                        const current = (formData.benh_hien_co as string[]) || []
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, benh_hien_co: [...current, disease] }))
                        } else {
                          setFormData(prev => ({ ...prev, benh_hien_co: current.filter(d => d !== disease) }))
                        }
                      }}
                    />
                    <span className="text-sm">{disease}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Đã phẫu thuật?</label>
              <select
                value={(formData.da_phau_thuat as string) || 'Khong'}
                onChange={(e) => setFormData(prev => ({ ...prev, da_phau_thuat: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Khong">Không</option>
                <option value="Co">Có</option>
              </select>
            </div>

            {formData.da_phau_thuat === 'Co' && (
              <div>
                <label className="block text-sm font-medium mb-2">Mô tả phẫu thuật</label>
                <textarea
                  value={(formData.mo_ta_phau_thuat as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, mo_ta_phau_thuat: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Loại phẫu thuật, thời gian..."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Đang dùng thuốc thường xuyên?</label>
              <select
                value={(formData.dang_dung_thuoc as string) || 'Khong'}
                onChange={(e) => setFormData(prev => ({ ...prev, dang_dung_thuoc: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Khong">Không</option>
                <option value="Co">Có</option>
              </select>
            </div>

            {formData.dang_dung_thuoc === 'Co' && (
              <div>
                <label className="block text-sm font-medium mb-2">Tên thuốc và mục đích</label>
                <input
                  type="text"
                  value={(formData.ten_thuoc as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, ten_thuoc: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="VD: Metformin - điều trị tiểu đường"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Dị ứng thuốc/thực phẩm</label>
              <input
                type="text"
                value={(formData.di_ung as string) || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, di_ung: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Penicilin, hải sản, phấn hoa..."
              />
            </div>
          </CardContent>
        </Card>
      )
    } else if (currentSection === 2) {
      // Family Members (for family package)
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thành Viên Gia Đình</CardTitle>
            <p className="text-sm text-gray-600">Chỉ áp dụng cho gói bảo hiểm gia đình</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-900">
                Bạn có thể thêm tối đa 5 thành viên gia đình (vợ/chồng, con cái, cha mẹ)
              </p>
            </div>

            {familyMembers.map((member, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-blue-600">Thành viên {index + 1}</h4>
                  {familyMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFamilyMember(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      ✕ Xóa
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Họ tên</label>
                    <input
                      type="text"
                      value={member.ho_ten}
                      onChange={(e) => updateFamilyMember(index, 'ho_ten', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white"
                      placeholder="Nguyễn Văn B"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Quan hệ</label>
                    <select
                      value={member.quan_he}
                      onChange={(e) => updateFamilyMember(index, 'quan_he', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white"
                    >
                      <option value="">-- Chọn --</option>
                      <option value="Vo_Chong">Vợ/Chồng</option>
                      <option value="Con">Con</option>
                      <option value="Cha">Cha</option>
                      <option value="Me">Mẹ</option>
                      <option value="Anh_Chi_Em">Anh/Chị/Em</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày sinh</label>
                    <input
                      type="text"
                      value={member.ngay_sinh}
                      onChange={(e) => updateFamilyMember(index, 'ngay_sinh', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Số CMND/CCCD</label>
                    <input
                      type="text"
                      value={member.cmnd}
                      onChange={(e) => updateFamilyMember(index, 'cmnd', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white"
                      placeholder="12 số"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed border-2 py-6"
              onClick={addFamilyMember}
              disabled={familyMembers.length >= 5}
            >
              + Thêm thành viên {familyMembers.length >= 5 ? '(Đã đủ 5 người)' : ''}
            </Button>
          </CardContent>
        </Card>
      )
    } else if (currentSection === 3) {
      // Preferred Hospital
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bệnh Viện Ưu Tiên</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Chọn bệnh viện đăng ký ban đầu</label>
              <select
                value={(formData.benh_vien_uu_tien as string) || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, benh_vien_uu_tien: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">-- Chọn bệnh viện --</option>
                <option value="BV Bạch Mai">Bệnh viện Bạch Mai</option>
                <option value="BV Việt Đức">Bệnh viện Việt Đức</option>
                <option value="BV 108">Bệnh viện 108</option>
                <option value="BV E">Bệnh viện E</option>
                <option value="BV Chợ Rẫy">Bệnh viện Chợ Rẫy</option>
                <option value="BV Thống Nhất">Bệnh viện Thống Nhất</option>
                <option value="BV Đại học Y">Bệnh viện Đại học Y Hà Nội</option>
                <option value="Khac">Khác</option>
              </select>
            </div>

            {formData.benh_vien_uu_tien === 'Khac' && (
              <div>
                <label className="block text-sm font-medium mb-2">Nhập tên bệnh viện</label>
                <input
                  type="text"
                  value={(formData.benh_vien_khac as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, benh_vien_khac: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Tên bệnh viện..."
                />
              </div>
            )}
          </CardContent>
        </Card>
      )
    } else {
      return renderConfirmationSection()
    }
  }

  const renderVehicleInsuranceSections = () => {
    if (currentSection === 1) {
      // Vehicle Information
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông Tin Xe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Loại xe</label>
                <select
                  value={(formData.loai_xe as string) || 'O_to'}
                  onChange={(e) => setFormData(prev => ({ ...prev, loai_xe: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="O_to">Ô tô</option>
                  <option value="Xe_may">Xe máy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Biển số <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={(formData.bien_so as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bien_so: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="30A-12345"
                />
                {errors.bien_so && <p className="text-red-500 text-sm mt-1">{errors.bien_so}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Hãng xe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={(formData.hang_xe as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, hang_xe: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Toyota, Honda, Yamaha..."
                />
                {errors.hang_xe && <p className="text-red-500 text-sm mt-1">{errors.hang_xe}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dòng xe</label>
                <input
                  type="text"
                  value={(formData.dong_xe as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, dong_xe: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Vios, City, Vision..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Năm sản xuất</label>
                <input
                  type="text"
                  value={(formData.nam_san_xuat as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nam_san_xuat: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="2022"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Giá trị xe <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={(formData.gia_tri_xe as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, gia_tri_xe: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="500.000.000 VNĐ"
                />
                {errors.gia_tri && <p className="text-red-500 text-sm mt-1">{errors.gia_tri}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )
    } else if (currentSection === 2) {
      // Driver License
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Giấy Phép Lái Xe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Số bằng lái <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={(formData.so_bang_lai as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, so_bang_lai: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                {errors.so_bang_lai && <p className="text-red-500 text-sm mt-1">{errors.so_bang_lai}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hạng bằng</label>
                <select
                  value={(formData.hang_bang_lai as string) || 'B1'}
                  onChange={(e) => setFormData(prev => ({ ...prev, hang_bang_lai: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="A1">A1 (Xe máy {'<'} 175cc)</option>
                  <option value="A2">A2 (Xe máy)</option>
                  <option value="B1">B1 (Ô tô {'<'} 9 chỗ)</option>
                  <option value="B2">B2 (Ô tô {'<'} 3.5 tấn)</option>
                  <option value="C">C (Ô tô tải)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ngày cấp</label>
                <input
                  type="text"
                  value={(formData.ngay_cap_bang_lai as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, ngay_cap_bang_lai: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="DD/MM/YYYY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nơi cấp</label>
                <input
                  type="text"
                  value={(formData.noi_cap_bang_lai as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, noi_cap_bang_lai: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Sở GTVT Hà Nội"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )
    } else if (currentSection === 3) {
      // Insurance & Accident History
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lịch Sử Bảo Hiểm & Tai Nạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Đã mua bảo hiểm xe trước đây?</label>
              <select
                value={(formData.da_mua_bao_hiem as string) || 'Khong'}
                onChange={(e) => setFormData(prev => ({ ...prev, da_mua_bao_hiem: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Khong">Không</option>
                <option value="Co">Có</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Đã từng gặp tai nạn?</label>
              <select
                value={(formData.da_gap_tai_nan as string) || 'Khong'}
                onChange={(e) => setFormData(prev => ({ ...prev, da_gap_tai_nan: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Khong">Không</option>
                <option value="Co">Có</option>
              </select>
            </div>

            {formData.da_gap_tai_nan === 'Co' && (
              <div>
                <label className="block text-sm font-medium mb-2">Mô tả tai nạn</label>
                <textarea
                  value={(formData.mo_ta_tai_nan as string) || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, mo_ta_tai_nan: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )
    } else {
      return renderConfirmationSection()
    }
  }

  const renderMandatoryHealthSections = () => {
    if (currentSection === 1) {
      // Work Information
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông Tin Công Việc</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nơi làm việc <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={(formData.noi_lam_viec as string) || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, noi_lam_viec: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Công ty, tổ chức..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mã BHXH (nếu có)</label>
              <input
                type="text"
                value={(formData.ma_bhxh as string) || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ma_bhxh: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="10 chữ số"
                maxLength={10}
              />
              <p className="text-xs text-gray-500 mt-1">
                Mã BHXH giúp tra cứu và quản lý hồ sơ nhanh hơn
              </p>
            </div>
          </CardContent>
        </Card>
      )
    } else if (currentSection === 2) {
      // Healthcare Registration
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Đăng Ký Khám Chữa Bệnh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tỉnh/Thành phố đăng ký <span className="text-red-500">*</span>
              </label>
              <select
                value={(formData.tinh_thanh_dang_ky as string) || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, tinh_thanh_dang_ky: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">-- Chọn tỉnh/thành --</option>
                <option value="Ha Noi">Hà Nội</option>
                <option value="Ho Chi Minh">TP. Hồ Chí Minh</option>
                <option value="Da Nang">Đà Nẵng</option>
                <option value="Hai Phong">Hải Phòng</option>
                <option value="Can Tho">Cần Thơ</option>
                <option value="Nghe An">Nghệ An</option>
                <option value="Thanh Hoa">Thanh Hóa</option>
                <option value="Dong Nai">Đồng Nai</option>
                <option value="Binh Duong">Bình Dương</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cơ sở đăng ký KCB ban đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={(formData.co_so_dang_ky_kcb as string) || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, co_so_dang_ky_kcb: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Bệnh viện, Trạm y tế..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Cơ sở y tế gần nơi bạn sinh sống, nơi bạn sẽ đi khám định kỳ
              </p>
            </div>
          </CardContent>
        </Card>
      )
    } else if (currentSection === 3) {
      // Household Registration
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông Tin Hộ Khẩu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Số hộ khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={(formData.so_ho_khau as string) || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, so_ho_khau: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Số ghi trên sổ hộ khẩu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Địa chỉ hộ khẩu <span className="text-red-500">*</span>
              </label>
              <textarea
                value={(formData.dia_chi_ho_khau as string) || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, dia_chi_ho_khau: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
                rows={2}
                placeholder="Địa chỉ ghi trên sổ hộ khẩu"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">📄 Tài liệu cần chuẩn bị:</h4>
              <ul className="text-sm text-yellow-800 space-y-1 ml-4">
                <li>• CMND/CCCD (2 mặt)</li>
                <li>• Sổ hộ khẩu (trang có thông tin cá nhân)</li>
                <li>• Ảnh 4x6 (2 ảnh)</li>
                <li>• Giấy khai sinh (nếu dưới 14 tuổi)</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Upload ảnh CCCD (2 mặt)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e, 'cccd_images')}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {filePreviews.cccd_images && filePreviews.cccd_images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {filePreviews.cccd_images.map((preview, idx) => (
                    <div key={idx} className="relative">
                      <img src={preview} alt={`CCCD ${idx + 1}`} className="w-full h-32 object-cover rounded-lg border" />
                      <button
                        type="button"
                        onClick={() => removeFile('cccd_images', idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                      <p className="text-xs text-gray-600 mt-1">
                        {uploadedFiles.cccd_images?.[idx]?.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Upload ảnh sổ hộ khẩu</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e, 'household_images')}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {filePreviews.household_images && filePreviews.household_images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {filePreviews.household_images.map((preview, idx) => (
                    <div key={idx} className="relative">
                      <img src={preview} alt={`Hộ khẩu ${idx + 1}`} className="w-full h-32 object-cover rounded-lg border" />
                      <button
                        type="button"
                        onClick={() => removeFile('household_images', idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                      <p className="text-xs text-gray-600 mt-1">
                        {uploadedFiles.household_images?.[idx]?.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )
    } else {
      return renderConfirmationSection()
    }
  }

  const renderConfirmationSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
          Xác Nhận Thông Tin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
          <h3 className="font-semibold mb-2">Thông tin gói bảo hiểm:</h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Gói bảo hiểm:</span>
              <span className="font-semibold ml-2">{selectedPackage.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Quyền lợi:</span>
              <span className="font-semibold ml-2">{selectedPackage.coverage}</span>
            </div>
            <div>
              <span className="text-gray-600">Phí bảo hiểm:</span>
              <span className="font-semibold ml-2 text-green-600">
                {formatPrice(selectedPackage.price)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Thời hạn:</span>
              <span className="font-semibold ml-2">{selectedPackage.period}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <input type="checkbox" id="agree-terms" className="mt-1" required />
            <label htmlFor="agree-terms" className="text-gray-700">
              Tôi đồng ý với các điều khoản và điều kiện của hợp đồng bảo hiểm
            </label>
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" id="agree-info" className="mt-1" required />
            <label htmlFor="agree-info" className="text-gray-700">
              Tôi xác nhận các thông tin trên là chính xác và trung thực
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/insurance/upload')} 
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Đơn Đăng Ký Bảo Hiểm
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedPackage.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phí bảo hiểm:</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(selectedPackage.price)}
                </p>
              </div>
            </div>

            {/* Auto-fill notification */}
            {extractedData && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      Thông tin đã được tự động điền
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Vui lòng kiểm tra và bổ sung thông tin còn thiếu
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <div 
                    key={section.id} 
                    className={`flex items-center gap-2 ${
                      index < currentSection ? 'text-green-600' :
                      index === currentSection ? 'text-blue-600' :
                      'text-gray-400'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index < currentSection ? 'bg-green-100' :
                      index === currentSection ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium hidden md:block">{section.title}</span>
                  </div>
                )
              })}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Section Content */}
          {renderSectionContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentSection === 0}
              className="border-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>

            {currentSection < sections.length - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8"
              >
                Tiếp tục
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8"
              >
                {isSubmitting ? 'Đang xử lý...' : (
                  <>
                    Xác Nhận & Thanh Toán
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
