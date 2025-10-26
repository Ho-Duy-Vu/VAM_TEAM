import { create } from 'zustand'
import type { DocumentInfo, DocumentJsonData } from '../api/types'

interface DocumentState {
  // Current document data
  currentDocument: DocumentInfo | null
  currentDocumentId: string | null
  jsonData: DocumentJsonData | null
  markdown: string | null
  
  // Multiple documents state
  uploadedDocumentIds: string[]
  
  // UI state
  isProcessing: boolean
  processingProgress: number
  currentPage: number
  currentTab: 'visual' | 'markdown' | 'json'
  theme: 'light' | 'dark'
  
  // Actions
  setCurrentDocument: (doc: DocumentInfo) => void
  setCurrentDocumentId: (id: string) => void
  setJsonData: (data: DocumentJsonData) => void
  setMarkdown: (markdown: string) => void
  setProcessing: (processing: boolean, progress?: number) => void
  setCurrentPage: (page: number) => void
  setCurrentTab: (tab: 'visual' | 'markdown' | 'json') => void
  toggleTheme: () => void
  
  // Multiple documents actions
  setUploadedDocumentIds: (ids: string[]) => void
  addUploadedDocumentId: (id: string) => void
  clearUploadedDocumentIds: () => void
  
  // Reset state
  resetDocument: () => void
}

export const useDocumentStore = create<DocumentState>((set) => ({
  // Initial state
  currentDocument: null,
  currentDocumentId: null,
  jsonData: null,
  markdown: null,
  uploadedDocumentIds: [],
  isProcessing: false,
  processingProgress: 0,
  currentPage: 0,
  currentTab: 'markdown',  // Default to markdown tab
  theme: 'light',
  
  // Actions
  setCurrentDocument: (doc) => set({ currentDocument: doc }),
  setCurrentDocumentId: (id) => set({ currentDocumentId: id }),
  setJsonData: (data) => set({ jsonData: data }),
  setMarkdown: (markdown) => set({ markdown }),
  setProcessing: (processing, progress = 0) => 
    set({ isProcessing: processing, processingProgress: progress }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  
  // Multiple documents actions
  setUploadedDocumentIds: (ids) => {
    set({ uploadedDocumentIds: ids })
    // Persist to localStorage for chatbot access
    localStorage.setItem('uploadedDocumentIds', JSON.stringify(ids))
  },
  addUploadedDocumentId: (id) => set((state) => {
    const newIds = [...state.uploadedDocumentIds, id]
    // Persist to localStorage for chatbot access
    localStorage.setItem('uploadedDocumentIds', JSON.stringify(newIds))
    return { uploadedDocumentIds: newIds }
  }),
  clearUploadedDocumentIds: () => {
    set({ uploadedDocumentIds: [] })
    // Clear from localStorage
    localStorage.removeItem('uploadedDocumentIds')
  },
  
  resetDocument: () => set({
    currentDocument: null,
    currentDocumentId: null,
    jsonData: null,
    markdown: null,
    isProcessing: false,
    processingProgress: 0,
    currentPage: 0,
    currentTab: 'json',
  }),
}))