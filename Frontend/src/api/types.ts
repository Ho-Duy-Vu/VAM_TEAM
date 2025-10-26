export interface DocumentRegion {
  id: string
  type: 'text' | 'table' | 'signature' | 'handwriting' | 'logo' | 'highlight'
  page: number
  bbox: [number, number, number, number] // [x, y, width, height]
  text: string
  confidence?: number
}

export interface DocumentPage {
  page_index: number
  image_url: string
}

export interface DocumentInfo {
  document_id: string
  status: string
  pages: DocumentPage[]
}

export interface ProcessingStatus {
  status: 'PROCESSING' | 'DONE' | 'ERROR'
  progress: number
}

// Person information extracted from CCCD/ID/Driver License
export interface PersonInfo {
  fullName: string | null
  dateOfBirth: string | null
  gender: string | null
  idNumber: string | null
  address: string | null
  phone: string | null
  email: string | null
  placeOfOrigin: string | null
  nationality: string | null
  issueDate: string | null
  expiryDate: string | null
  documentType: string | null
  extractionStatus?: string
  message?: string
}

// Individual page result from backend
export interface PageResult {
  page_number: number
  document_type: string
  confidence: number
  title?: string
  summary?: string
  people?: Array<{ name: string; role?: string | null }> | string[]
  organizations?: Array<{ name: string }> | string[]
  locations?: Array<{ name: string }> | string[]
  dates?: Array<{ label?: string | null; value: string }> | string[]
  numbers?: Array<{ label?: string | null; value: string }> | string[]
  signature_detected?: boolean
  [key: string]: unknown // Allow additional fields
}

// Merged multi-page document JSON data
export interface DocumentJsonData {
  // Summary fields (from merge_page_results)
  document_type?: string
  confidence?: number
  title?: string
  summary?: string
  total_pages?: number
  
  // Merged extracted data
  people?: Array<{ 
    name: string
    role?: string | null
    id_number?: string | null
    date_of_birth?: string | null
    gender?: string | null
  }>
  organizations?: Array<{ 
    name: string
    type?: string | null
    address?: string | null
  }>
  locations?: Array<{ 
    name?: string
    label?: string | null
    value?: string
  }>
  dates?: Array<{ label?: string | null; value: string }>
  numbers?: Array<{ label?: string | null; value: string }>
  signature_detected?: boolean
  
  // Individual page results
  pages?: PageResult[]
  
  // Legacy fields (for backward compatibility)
  policy?: {
    carrier?: string
    issue_date?: string
    certificate_number?: string
    validity_period?: string
    purpose?: string
  }
  animals?: Array<{
    species?: string
    name?: string
    microchip_id?: string | null
    rabies_vaccination?: string
    vaccination_year?: string
    health_status?: string
    special_markings?: string
  }>
  veterinary_certification?: {
    veterinarian_name?: string
    clinic_name?: string
    address?: string
    certification_date?: string
    license_number?: string
    signature_verified?: boolean
    official_seal?: boolean
  }
  attestation?: {
    health_examination_completed?: boolean
    disease_testing_current?: boolean
    vaccination_records_verified?: boolean
    transport_authorization?: boolean
    veterinarian_signature?: boolean
    regulatory_compliance?: string
    special_notes?: string
  }
  risk_assessment?: {
    disease_risk?: string
    quarantine_required?: boolean
    movement_restrictions?: string
    follow_up_required?: boolean
    contact_tracing?: string
  }
  compliance?: {
    state_regulations?: string
    federal_requirements?: string
    destination_approval?: string
    transport_protocol?: string
  }
  metadata?: {
    document_id?: string
    pages_total?: number
    confidence_score?: number
    processing_time?: string
    ai_model_version?: string
    extraction_timestamp?: string
  }
  
  // Allow any additional fields from various document types
  [key: string]: unknown
}