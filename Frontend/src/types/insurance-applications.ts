/**
 * Type definitions for different insurance application forms
 * Each insurance type has specific required fields
 */

// Base personal information (common for all)
export interface BasePersonalInfo {
  ho_ten: string
  ngay_sinh: string
  gioi_tinh: 'Nam' | 'Nu' | 'Khac'
  so_cmnd: string
  dia_chi: string
  sdt: string
  email: string
  quoc_tich: string
  noi_cap: string
  ngay_cap?: string
}

// Life Insurance Application
export interface LifeInsuranceApplication extends BasePersonalInfo {
  insurance_type: 'life'
  nghe_nghiep: string
  noi_lam_viec: string
  thu_nhap_hang_thang: string
  
  // Beneficiary information
  nguoi_thu_huong: {
    ho_ten: string
    quan_he: string
    so_cmnd: string
    sdt: string
  }
  
  // Health declaration
  tinh_trang_suc_khoe: {
    chieu_cao: string
    can_nang: string
    benh_nen: string[]
    dang_dieu_tri: 'Co' | 'Khong'
    mo_ta_benh: string
    hut_thuoc: 'Co' | 'Khong'
    uong_ruou: 'Co' | 'Khong'
  }
  
  package_id: string
}

// Health Insurance Application
export interface HealthInsuranceApplication extends BasePersonalInfo {
  insurance_type: 'health'
  nghe_nghiep: string
  
  // Health history
  lich_su_benh: {
    benh_hien_co: string[]
    phau_thuat: 'Co' | 'Khong'
    mo_ta_phau_thuat: string
    dang_dung_thuoc: 'Co' | 'Khong'
    ten_thuoc: string
    di_ung: string
  }
  
  // Family members (if family package)
  thanh_vien_gia_dinh?: Array<{
    ho_ten: string
    quan_he: string
    ngay_sinh: string
    so_cmnd: string
  }>
  
  // Preferred hospital
  benh_vien_uu_tien?: string
  
  package_id: string
}

// Vehicle Insurance Application
export interface VehicleInsuranceApplication extends BasePersonalInfo {
  insurance_type: 'vehicle'
  
  // Vehicle information
  thong_tin_xe: {
    loai_xe: 'Xe_may' | 'O_to'
    bien_so: string
    so_khung: string
    so_may: string
    hang_xe: string
    dong_xe: string
    nam_san_xuat: string
    mau_xe: string
    gia_tri_xe: string
    muc_dich_su_dung: 'Ca_nhan' | 'Kinh_doanh'
  }
  
  // Driver information
  giay_phep_lai_xe: {
    so_bang: string
    hang: string
    ngay_cap: string
    noi_cap: string
  }
  
  // Insurance history
  lich_su_bao_hiem: {
    da_mua_bao_hiem: 'Co' | 'Khong'
    cong_ty_cu?: string
    thoi_han_cu?: string
    da_boi_thuong: 'Co' | 'Khong'
    mo_ta_boi_thuong?: string
  }
  
  // Accident history
  lich_su_tai_nan: {
    da_gap_tai_nan: 'Co' | 'Khong'
    so_lan?: number
    mo_ta?: string
  }
  
  package_id: string
}

// Mandatory Health Insurance Application
export interface MandatoryHealthApplication extends BasePersonalInfo {
  insurance_type: 'mandatory_health'
  
  // Employment information
  noi_lam_viec: string
  ma_bhxh?: string
  
  // Registration information
  co_so_dang_ky_kcb: string
  tinh_thanh_dang_ky: string
  
  // Household information
  so_ho_khau: string
  dia_chi_ho_khau: string
  
  // Documents
  hinh_anh_can_cuoc?: string[]
  hinh_anh_ho_khau?: string[]
  
  package_id: string
}

// Union type for all application types
export type InsuranceApplicationData = 
  | LifeInsuranceApplication 
  | HealthInsuranceApplication 
  | VehicleInsuranceApplication 
  | MandatoryHealthApplication
