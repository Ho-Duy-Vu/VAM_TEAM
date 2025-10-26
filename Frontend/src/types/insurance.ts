/**
 * Insurance Types & Interfaces
 * Defines all types for insurance packages and applications
 */

// Insurance Package Types
export type InsuranceType = 'life' | 'health' | 'vehicle' | 'mandatory_health' | 'natural_disaster'

// Detailed benefits structure for natural disaster insurance
export interface DetailedBenefitCategory {
  title: string
  items: Array<{
    name: string
    coverage: string
    description: string
  }>
}

export interface InsurancePackage {
  id: string
  type: InsuranceType
  name: string
  shortName: string
  description: string
  price: number
  period: string // e.g., "1 năm", "6 tháng"
  benefits: string[]
  coverage: string
  icon: string
  color: string // for theming
  featured: boolean
  requiredDocuments: string[]
  // For natural disaster packages
  detailedBenefits?: {
    propertyDamage?: DetailedBenefitCategory
    emergencySupport?: DetailedBenefitCategory
    additionalServices?: DetailedBenefitCategory
  }
  exclusions?: string[]
}

// Application Form Types based on your JSON structure
export interface PersonalInfo {
  ho_ten: string
  ngay_sinh: string
  gioi_tinh: 'Nam' | 'Nu' | 'Khac'
  giay_to: {
    loai: 'CMND' | 'CCCD' | 'Ho_chieu'
    so: string
    ngay_cap?: string
    noi_cap?: string
  }
  quoc_tich?: string
  nghe_nghiep?: string
  noi_lam_viec?: string
}

export interface ContactInfo {
  dia_chi_thuong_tru: string
  dia_chi_lien_lac: string
  dia_chi_nhan_thu?: string
  sdt: string
  email: string
}

export interface FinancialInfo {
  nguon_thu_nhap_chinh?: string
  thu_nhap_trung_binh_thang?: string
}

export interface HealthInfo {
  suc_khoe_hien_tai: 'Binh_thuong' | 'Co_van_de'
  benh_da_tung_mac?: string
  lich_su_dieu_tri_5_nam?: string
  hut_thuoc?: 'Co' | 'Khong'
  ruou_bia?: 'Co' | 'Khong'
  chieu_cao?: string
  can_nang?: string
}

export interface VehicleInfo {
  loai_xe: string
  bien_kiem_soat: string
  so_khung: string
  so_may: string
  nam_san_xuat: string
  nuoc_san_xuat?: string
  trong_tai?: string
  so_cho_ngoi?: string
  gia_tri_thi_truong: string
}

// Life Insurance Application
export interface LifeInsuranceApplication {
  ben_mua_bao_hiem: {
    thong_tin_ca_nhan: PersonalInfo
    thong_tin_lien_he: ContactInfo
    thong_tin_tai_chinh?: FinancialInfo
  }
  nguoi_duoc_bao_hiem: {
    thong_tin_ca_nhan: PersonalInfo
    tinh_trang_suc_khoe: HealthInfo
  }
  thong_tin_hop_dong: {
    san_pham: string
    so_tien_bao_hiem: string
    thoi_han_bao_hiem: string
    thoi_han_dong_phi: string
    san_pham_bo_sung?: string[]
  }
  nguoi_thu_huong?: Array<{
    ho_ten: string
    moi_quan_he: string
    ti_le_thu_huong: string
  }>
}

// Health Insurance Application
export interface HealthInsuranceApplication {
  thong_tin_nguoi_duoc_bao_hiem: PersonalInfo & ContactInfo & {
    nghe_nghiep: string
  }
  goi_bao_hiem: {
    ten_goi: string
    khu_vuc_bao_lanh: string
    thoi_han_tu: string
    thoi_han_den: string
    phi_bao_hiem: string
  }
  khai_bao_suc_khoe: {
    benh_dac_biet?: string
    lich_su_dieu_tri?: string
    mang_thai?: 'Co' | 'Khong'
  }
  thong_tin_dong_phi: {
    phuong_thuc: 'Tien_mat' | 'Chuyen_khoan' | 'The_tin_dung'
  }
}

// Vehicle Insurance Application
export interface VehicleInsuranceApplication {
  chu_xe: {
    loai_chu_the: 'Ca_nhan' | 'To_chuc'
    ten: string
    giay_to: {
      loai: 'CMND' | 'CCCD' | 'MST'
      so: string
    }
    dia_chi_lien_lac: string
    sdt: string
    email: string
  }
  phuong_tien: VehicleInfo
  loai_bao_hiem: {
    tnds_bat_buoc: boolean
    vat_chat_tu_nguyen: boolean
    dieu_khoan_bo_sung?: string[]
  }
  thoi_han_bao_hiem: {
    tu_ngay: string
    den_ngay: string
  }
}

// Mandatory Health Insurance Application
export interface MandatoryHealthInsuranceApplication {
  thong_tin_ca_nhan: PersonalInfo & {
    dia_chi_ho_khau: string
    dia_chi_lien_he: string
  }
  noi_dung_dang_ky: {
    hinh_thuc: 'Tham_gia_moi' | 'Dieu_chinh_thong_tin'
    doi_tuong: 'Ho_gia_dinh' | 'Hoc_sinh' | 'Lao_dong'
    noi_dang_ky_kham_chua_benh: string
  }
  thong_tin_bo_sung?: {
    quan_he_voi_chu_ho?: string
    ma_so_bhxh?: string
  }
}

// Natural Disaster Insurance Application
export interface PropertyInfo {
  loai_tai_san: 'Nha_o' | 'Can_ho' | 'Phuong_tien' | 'Hang_hoa'
  dia_chi_tai_san: string
  dien_tich?: string
  gia_tri_uoc_tinh: string
  nam_xay_dung?: string
  kieu_nha?: string
  vat_lieu_xay_dung?: string
  so_tang?: string
  tinh_trang_hien_tai: string
}

export interface NaturalDisasterInsuranceApplication {
  chu_tai_san: {
    loai_chu_the: 'Ca_nhan' | 'To_chuc'
    thong_tin_ca_nhan: PersonalInfo
    thong_tin_lien_he: ContactInfo
  }
  thong_tin_tai_san: PropertyInfo
  goi_bao_hiem: {
    loai_bao_hiem: 'Ngap_lut' | 'Bao' | 'Phuong_tien_thien_tai' | 'Toan_dien'
    muc_bao_hiem: string
    thoi_han_tu: string
    thoi_han_den: string
    phi_bao_hiem: string
  }
  danh_sach_tai_san_chi_tiet?: Array<{
    ten_tai_san: string
    mo_ta: string
    gia_tri: string
    hinh_anh?: string[]
  }>
  lich_su_thiet_hai?: {
    da_gap_thien_tai: 'Co' | 'Khong'
    mo_ta_thiet_hai?: string
    nam_xay_ra?: string
    da_boi_thuong?: 'Co' | 'Khong'
  }
  phuong_thuc_thanh_toan: {
    phuong_thuc: 'Tien_mat' | 'Chuyen_khoan' | 'The_tin_dung' | 'Vi_dien_tu'
    chu_ky_dong_phi?: 'Mot_lan' | 'Hang_nam' | 'Hang_quy'
  }
}

// Union type for all application types
export type InsuranceApplication = 
  | LifeInsuranceApplication 
  | HealthInsuranceApplication 
  | VehicleInsuranceApplication 
  | MandatoryHealthInsuranceApplication
  | NaturalDisasterInsuranceApplication

// Contract/Policy
export interface InsuranceContract {
  id: string
  application_id: string
  package_id: string
  user_id?: string
  status: 'pending' | 'active' | 'expired' | 'cancelled'
  contract_number: string
  start_date: string
  end_date: string
  premium_amount: number
  payment_status: 'pending' | 'paid' | 'failed'
  created_at: string
  contract_file_url?: string
}

// Simplified contract for frontend use
export interface SimpleContract {
  id: string
  packageId: string
  applicationData: Partial<InsuranceApplication>
  createdAt: string
  status: 'active' | 'pending' | 'expired'
  paymentInfo: {
    method: 'qr_code' | 'credit_card'
    amount: number
    transactionId: string
    paidAt: string
    status: 'completed' | 'pending'
  }
}

// Payment
export interface PaymentInfo {
  contract_id: string
  amount: number
  method: 'qr_code' | 'bank_transfer' | 'credit_card'
  status: 'pending' | 'completed' | 'failed'
  qr_code_url?: string
  transaction_id?: string
  paid_at?: string
}
