/**
 * Insurance Store
 * Manages insurance purchase flow state
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { InsurancePackage, InsuranceApplication, SimpleContract } from '../types/insurance'

interface ExtractedData {
  people?: Array<{
    name?: string
    value?: string
    [key: string]: unknown
  }>
  locations?: Array<{
    value?: string
    label?: string
    [key: string]: unknown
  }>
  dates?: Array<{
    value?: string
    label?: string
    [key: string]: unknown
  }>
  [key: string]: unknown
}

interface InsuranceState {
  // Selected package
  selectedPackage: InsurancePackage | null
  
  // Application data
  applicationData: Partial<InsuranceApplication> | null
  
  // Extracted data from AI
  extractedData: ExtractedData | null
  
  // Contract info
  currentContract: SimpleContract | null
  
  // Flow step
  currentStep: 'select' | 'upload' | 'form' | 'payment' | 'success'
  
  // Actions
  setSelectedPackage: (pkg: InsurancePackage) => void
  setApplicationData: (data: Partial<InsuranceApplication>) => void
  setExtractedData: (data: ExtractedData | null) => void
  setCurrentContract: (contract: SimpleContract) => void
  setCurrentStep: (step: InsuranceState['currentStep']) => void
  resetFlow: () => void
  
  // Helper to merge extracted data into application
  mergeExtractedData: () => void
}

export const useInsuranceStore = create<InsuranceState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedPackage: null,
      applicationData: null,
      extractedData: null,
      currentContract: null,
      currentStep: 'select',
      
      // Actions
      setSelectedPackage: (pkg) => set({ 
        selectedPackage: pkg,
        currentStep: 'upload'
      }),
      
      setApplicationData: (data) => set({ applicationData: data }),
      
      setExtractedData: (data) => set({ extractedData: data }),
      
      setCurrentContract: (contract) => set({ currentContract: contract }),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      resetFlow: () => set({
        selectedPackage: null,
        applicationData: null,
        extractedData: null,
        currentContract: null,
        currentStep: 'select'
      }),
      
      // Merge AI extracted data into application form
      mergeExtractedData: () => {
        const { extractedData, selectedPackage, applicationData } = get()
        
        if (!extractedData || !selectedPackage) return
        
        // This is a smart merge based on package type and extracted data
        // We'll implement detailed mapping logic based on document type
        const merged = { ...applicationData }
        
        // Basic mapping from extracted JSON data
        // The actual mapping is done in InsuranceApplicationFormPage
        // This is just a placeholder for future enhancement
        
        set({ applicationData: merged })
      }
    }),
    {
      name: 'insurance-flow-storage',
      partialize: (state) => ({
        selectedPackage: state.selectedPackage,
        applicationData: state.applicationData,
        currentStep: state.currentStep,
      })
    }
  )
)
