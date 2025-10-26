/**
 * Insurance Upload Page
 * Upload documents for insurance application with AI analysis
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { documentApi } from '../api/client'
import { useInsuranceStore } from '../store/insurance'
import { useDocumentStore } from '../store/document'
import { formatPrice } from '../data/insurancePackages'
import InsuranceRecommendationModal from '../components/InsuranceRecommendationModal'

export const InsuranceUploadPage: React.FC = () => {
  const navigate = useNavigate()
  const { selectedPackage, setExtractedData, setCurrentStep } = useInsuranceStore()
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  
  // Recommendation modal state
  const [showRecommendationModal, setShowRecommendationModal] = useState(false)
  const [recommendationData, setRecommendationData] = useState<{
    place_of_origin?: { text: string; region: string }
    address?: { text: string; region: string }
    recommended_packages?: Array<{ name: string; reason: string; priority: number }>
  } | null>(null)
  
  // Redirect if no package selected
  React.useEffect(() => {
    if (!selectedPackage) {
      navigate('/')
    }
  }, [selectedPackage, navigate])
  
  if (!selectedPackage) return null
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files)
      await handleFiles(files)
    }
  }
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      await handleFiles(files)
    }
  }
  
  const handleFiles = async (files: File[]) => {
    try {
      setUploading(true)
      setUploadedFiles(files)
      setUploadProgress(0)
      console.log(`📤 Uploading ${files.length} file(s) for insurance application...`)
      
      const documentIds: string[] = []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extractedDataArray: any[] = []
      
      // Process files sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log(`📤 [${i + 1}/${files.length}] Uploading:`, file.name)
        setUploadProgress(((i + 1) / files.length) * 50)
        
        // Step 1: Upload file
        const result = await documentApi.uploadDocument(file)
        console.log(`✅ [${i + 1}/${files.length}] Upload success:`, result)
        
        // Step 2: Detect document type from filename
        const fileName = file.name.toLowerCase()
        const isVehicleDoc = fileName.includes('cavet') || 
                            fileName.includes('cà vẹt') || 
                            fileName.includes('ca vet') ||
                            fileName.includes('xe') ||
                            fileName.includes('vehicle') ||
                            fileName.includes('dang_ky_xe') ||
                            fileName.includes('dang-ky-xe') ||
                            fileName.includes('dangkyxe') ||
                            fileName.includes('giay_dang_ky') ||
                            fileName.includes('giay-dang-ky') ||
                            fileName.includes('registration')
        
        console.log(`   🔍 Analyzing file: "${file.name}"`)
        console.log(`   🔍 Lowercase: "${fileName}"`)
        console.log(`   🔍 Is vehicle doc: ${isVehicleDoc}`)
        
        // 🎯 SMART LOGIC: If this is the 2nd+ file, also try vehicle extraction
        const shouldExtractVehicle = isVehicleDoc || i > 0
        
        if (shouldExtractVehicle) {
          // Extract vehicle info
          console.log(`🚗 [${i + 1}/${files.length}] Extracting vehicle info...`)
          try {
            const vehicleInfo = await documentApi.extractVehicleInfo(result.document_id)
            extractedDataArray.push({ ...vehicleInfo, isVehicle: true })
            console.log(`✅ [${i + 1}/${files.length}] Vehicle info extracted:`, vehicleInfo)
          } catch (error) {
            console.error(`❌ Vehicle extraction failed:`, error)
            // Fallback to person info
            const personInfo = await documentApi.extractPersonInfo(result.document_id)
            extractedDataArray.push({ ...personInfo, isVehicle: false })
          }
        } else {
          // Extract person info (CCCD/ID/Driver License)
          console.log(`� [${i + 1}/${files.length}] Extracting person info...`)
          const personInfo = await documentApi.extractPersonInfo(result.document_id)
          
          // Check for quota error
          if (personInfo.extractionStatus === 'quota_exceeded') {
            console.warn('⚠️ API quota exceeded:', personInfo.message)
            alert('⚠️ ' + personInfo.message)
          }
          
          extractedDataArray.push({ ...personInfo, isVehicle: false })
          console.log(`✅ [${i + 1}/${files.length}] Person info extracted:`, personInfo)
        }
        
        setUploadProgress(((i + 1) / files.length) * 100)
        documentIds.push(result.document_id)
      }
      
      setUploadProgress(100)
      
      // Store all document IDs and extracted data
      if (documentIds.length > 0) {
        useDocumentStore.getState().setUploadedDocumentIds(documentIds)
        
        // Merge all extracted data
        const mergedData = mergeExtractedData(extractedDataArray)
        setExtractedData(mergedData)
        
        console.log('✅ All files processed. Extracted data:', mergedData)
        
        // 🎯 NEW: Get insurance recommendation based on region
        try {
          console.log('🏠 Fetching insurance recommendations...')
          const recommendation = await documentApi.getInsuranceRecommendation(documentIds[0])
          console.log('✅ Recommendation received:', recommendation)
          
          if (recommendation && recommendation.recommendation) {
            console.log('📋 Setting recommendation data:', recommendation.recommendation)
            setRecommendationData(recommendation.recommendation)
            
            // Show modal if there are recommendations (Bắc/Trung region)
            if (recommendation.recommendation.recommended_packages?.length > 0) {
              console.log('🎯 Setting modal to OPEN with', recommendation.recommendation.recommended_packages.length, 'packages')
              console.log('📦 Packages:', recommendation.recommendation.recommended_packages)
              setShowRecommendationModal(true)
            } else {
              console.log('⚠️ No packages, going to form')
              // No recommendations (Nam region), proceed to form
              setCurrentStep('form')
              navigate('/insurance/application')
            }
          } else {
            console.log('❌ No recommendation object found')
            // No recommendation data, proceed to form
            setCurrentStep('form')
            navigate('/insurance/application')
          }
        } catch (error) {
          console.error('⚠️ Failed to get recommendations:', error)
          // Continue to form even if recommendation fails
          setCurrentStep('form')
          navigate('/insurance/application')
        }
      }
    } catch (error) {
      console.error('❌ Upload/Analysis failed:', error)
      alert('Tải tệp hoặc phân tích thất bại. Vui lòng thử lại.')
    } finally {
      setUploading(false)
    }
  }
  
  // Merge extracted data from multiple documents (CCCD, Driver License, Vehicle Registration, etc.)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergeExtractedData = (dataArray: any[]) => {
    // Priority: Take first non-null value from each field
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merged: any = {
      // Person info fields
      fullName: null,
      dateOfBirth: null,
      gender: null,
      idNumber: null,
      address: null,
      phone: null,
      email: null,
      placeOfOrigin: null,
      nationality: null,
      issueDate: null,
      expiryDate: null,
      documentType: null,
      
      // Vehicle info fields
      vehicleType: null,
      licensePlate: null,
      chassisNumber: null,
      engineNumber: null,
      brand: null,
      model: null,
      manufacturingYear: null,
      color: null,
      engineCapacity: null,
      registrationDate: null,
      ownerName: null,
      ownerAddress: null
    }
    
    // Merge all data (take first non-null value for each field)
    dataArray.forEach((data) => {
      if (data) {
        Object.keys(merged).forEach(key => {
          if (merged[key] === null && data[key] !== null && data[key] !== undefined) {
            merged[key] = data[key]
          }
        })
      }
    })
    
    console.log('📊 Merged data (person + vehicle):', merged)
    return merged
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại trang chủ
          </Button>
          
          {/* Selected Package Info */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {selectedPackage.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {formatPrice(selectedPackage.price)} / {selectedPackage.period}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          {/* Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tài Liệu Cần Thiết
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Vui lòng tải lên các tài liệu sau để chúng tôi có thể tự động điền thông tin vào đơn đăng ký:
              </p>
              <ul className="space-y-2">
                {selectedPackage.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Hình ảnh phải rõ nét, không bị mờ hoặc che khuất</li>
                      <li>Chấp nhận định dạng: JPG, PNG, PDF</li>
                      <li>Có thể tải lên nhiều file cùng lúc</li>
                      <li>Thông tin sẽ được bảo mật tuyệt đối</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Upload Area */}
          <Card>
            <CardContent className="p-8">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
                  ${dragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                  }
                  ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                `}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                
                <Upload className={`w-16 h-16 mx-auto mb-4 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
                
                {uploading ? (
                  <div className="space-y-4">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      Đang xử lý tài liệu...
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {uploadProgress}% hoàn thành
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Kéo thả file vào đây
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      hoặc nhấp để chọn file từ máy tính
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Hỗ trợ: JPG, PNG, PDF (Tối đa 10MB/file)
                    </p>
                  </>
                )}
              </div>
              
              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Tệp đã tải lên ({uploadedFiles.length}):
                  </h4>
                  <ul className="space-y-2">
                    {uploadedFiles.map((file, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{file.name}</span>
                        <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      
      {/* Insurance Recommendation Modal */}
      <InsuranceRecommendationModal
        isOpen={showRecommendationModal}
        onClose={() => {
          setShowRecommendationModal(false)
          setCurrentStep('form')
          navigate('/insurance/application', { replace: true })
        }}
        placeOfOrigin={recommendationData?.place_of_origin}
        address={recommendationData?.address}
        recommendedPackages={recommendationData?.recommended_packages}
        onSelectPackage={(packageName) => {
          console.log('📦 User selected package:', packageName)
          
          // Close modal first
          setShowRecommendationModal(false)
          
          // Determine if this is a natural disaster package and map to packageId
          const lowerName = packageName.toLowerCase()
          let targetPackageId = ''
          let isNaturalDisaster = false
          
          if (lowerName.includes('ngập lụt') || lowerName.includes('lũ')) {
            isNaturalDisaster = true
            targetPackageId = 'flood-basic'
          } else if (lowerName.includes('bão') || lowerName.includes('gió')) {
            isNaturalDisaster = true
            targetPackageId = 'storm-comprehensive'
          } else if (lowerName.includes('phương tiện') || lowerName.includes('xe')) {
            isNaturalDisaster = true
            targetPackageId = 'disaster-vehicle'
          }
          
          if (isNaturalDisaster) {
            // Route to natural disaster application form with packageId
            console.log('🌊 Routing to natural disaster application form with packageId:', targetPackageId)
            // Use replace to avoid stacking upload page in history
            setTimeout(() => {
              navigate(`/natural-disaster/application?package=${targetPackageId}`, { replace: true })
            }, 100)
          } else {
            // Route to regular insurance application form
            console.log('📝 Routing to regular insurance application form')
            setCurrentStep('form')
            setTimeout(() => {
              navigate('/insurance/application', { replace: true })
            }, 100)
          }
        }}
      />
    </div>
  )
}
