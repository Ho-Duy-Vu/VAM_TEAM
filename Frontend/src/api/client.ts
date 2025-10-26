import type { DocumentInfo, DocumentRegion, ProcessingStatus, DocumentJsonData, PersonInfo } from './types'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Authentication API
export const authApi = {
  // Register new user
  register: async (userData: {
    email: string
    full_name: string
    phone?: string
    password: string
  }) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        full_name: userData.full_name,
        phone: userData.phone,
        password: userData.password,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Registration failed')
    }
    
    return response.json()
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }
    
    return response.json()
  },

  // Get current user
  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_BASE}/auth/me?token=${token}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to get user info')
    }
    
    return response.json()
  },
}

export const documentApi = {
  // Upload document
  uploadDocument: async (file: File): Promise<{ document_id: string; status: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Upload failed')
    }
    
    const data = await response.json()
    return { document_id: data.document_id, status: 'uploaded' }
  },

  // Start document processing
  startProcessing: async (documentId: string): Promise<{ job_id: string; status: string }> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Processing failed')
    }
    
    return response.json()
  },

  // Get job processing status
  getJobStatus: async (jobId: string): Promise<ProcessingStatus> => {
    const response = await fetch(`${API_BASE}/jobs/${jobId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get job status')
    }
    
    return response.json()
  },

  // Get processing status (legacy method for compatibility)
  getProcessingStatus: async (documentId: string): Promise<ProcessingStatus> => {
    // For compatibility, return a mock status
    const response = await fetch(`${API_BASE}/documents/${documentId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get processing status')
    }
    
    const data = await response.json()
    return {
      status: data.status === 'DONE' ? 'DONE' : data.status === 'PROCESSING' ? 'PROCESSING' : 'PROCESSING',
      progress: data.status === 'DONE' ? 100 : data.status === 'PROCESSING' ? 50 : 0
    }
  },

  // Get document info
  getDocumentInfo: async (documentId: string): Promise<DocumentInfo> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}`)
    
    if (!response.ok) {
      throw new Error('Failed to get document info')
    }
    
    const data = await response.json()
    return {
      document_id: data.document_id,
      status: data.status,
      pages: data.pages
    }
  },

  // Get document regions
  getDocumentRegions: async (documentId: string): Promise<DocumentRegion[]> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/overlay`)
    
    if (!response.ok) {
      throw new Error('Failed to get document regions')
    }
    
    const data = await response.json()
    return data.regions || []
  },

  // Get document markdown
  getDocumentMarkdown: async (documentId: string): Promise<string> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/markdown`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return ''
      }
      throw new Error('Failed to get document markdown')
    }
    
    const data = await response.json()
    return data.markdown || ''
  },

  // Get document JSON data
  getDocumentJson: async (documentId: string): Promise<DocumentJsonData> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/json`)
    
    if (!response.ok) {
      throw new Error('Failed to get document JSON')
    }
    
    return response.json()
  },

  // Update document JSON data
  updateDocumentJson: async (documentId: string, data: DocumentJsonData): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update document JSON')
    }
    
    return response.json()
  },

  // Analyze document automatically with Gemini
  analyzeDocumentAuto: async (documentId: string): Promise<DocumentJsonData> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/analyze-auto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Auto analysis failed')
    }
    
    return response.json()
  },

  // Extract person information from document (CCCD/ID/Driver License)
  extractPersonInfo: async (documentId: string): Promise<PersonInfo> => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/extract-person-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Person info extraction failed')
    }
    
    const data = await response.json()
    return data.person_info
  },

  // Extract vehicle information from document (Giấy đăng ký xe / Cà vẹt)
  extractVehicleInfo: async (documentId: string) => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/extract-vehicle-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Vehicle info extraction failed')
    }
    
    const data = await response.json()
    return data.vehicle_info
  },

  // Get insurance recommendation based on address/region
  getInsuranceRecommendation: async (documentId: string) => {
    const response = await fetch(`${API_BASE}/documents/${documentId}/recommend-insurance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Insurance recommendation failed')
    }
    
    const data = await response.json()
    console.log('🔍 API Response:', data)
    // Backend returns full response with document_id, recommendation, message
    return data
  },
}