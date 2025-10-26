import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query'
import { Upload, FileText, Image, Loader2, X, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { documentApi } from '../api/client'
import { useDocumentStore } from '../store/document'

interface UploadedFileInfo {
  file: File
  previewUrl: string
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  documentId?: string
  error?: string
}

export const UploadPage: React.FC = () => {
  const navigate = useNavigate()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([])
  const [isProcessingBatch, setIsProcessingBatch] = useState(false)
  
  const { setProcessing, setCurrentDocumentId } = useDocumentStore()
  
  const uploadMutation = useMutation({
    mutationFn: documentApi.uploadDocument,
    onSuccess: (data) => {
      setCurrentDocumentId(data.document_id)
      // Processing handled per file
    },
    onError: (error) => {
      console.error('Upload failed:', error)
    }
  })
  
  const processFile = async (fileInfo: UploadedFileInfo, index: number) => {
    try {
      // Update status to uploading
      setUploadedFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'uploading', progress: 10 } : f
      ))
      
      // Upload file
      const uploadResult = await documentApi.uploadDocument(fileInfo.file)
      const documentId = uploadResult.document_id
      
      // Update status to processing
      setUploadedFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'processing', progress: 40, documentId } : f
      ))
      
      // Auto-analyze
      await documentApi.analyzeDocumentAuto(documentId)
      
      // Complete
      setUploadedFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'completed', progress: 100 } : f
      ))
      
      return documentId
    } catch (error) {
      console.error('Processing failed:', error)
      setUploadedFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' } : f
      ))
      throw error
    }
  }
  
  const handleAnalyzeAll = async () => {
    setIsProcessingBatch(true)
    
    try {
      // Process all files sequentially
      for (let i = 0; i < uploadedFiles.length; i++) {
        if (uploadedFiles[i].status === 'pending') {
          await processFile(uploadedFiles[i], i)
        }
      }
      
      // Navigate to first completed document
      const firstCompleted = uploadedFiles.find(f => f.status === 'completed' && f.documentId)
      if (firstCompleted?.documentId) {
        setTimeout(() => {
          navigate(`/document/${firstCompleted.documentId}`)
        }, 1000)
      }
    } catch (error) {
      console.error('Batch processing failed:', error)
    } finally {
      setIsProcessingBatch(false)
    }
  }
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: true, // ⭐ ENABLE MULTIPLE FILES
    onDrop: (acceptedFiles) => {
      const newFiles: UploadedFileInfo[] = acceptedFiles.map(file => ({
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'pending',
        progress: 0
      }))
      
      setUploadedFiles(prev => [...prev, ...newFiles])
    }
  })
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].previewUrl)
      updated.splice(index, 1)
      return updated
    })
  }
  
  const viewDocument = (documentId: string) => {
    navigate(`/document/${documentId}`)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              ADE Insurance
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Document Analysis System
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload multiple insurance documents for AI-powered analysis. Our system can extract text, 
            identify tables, signatures, and provide structured data insights.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload size={20} />
                  <span>Upload Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <Upload className="w-10 h-10 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                        {isDragActive ? 'Drop files here' : 'Choose files or drag here'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PDF, PNG, JPG • Multiple files supported
                      </p>
                    </div>
                  </div>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>{uploadedFiles.length} file(s) selected</span>
                      <Button
                        onClick={() => setUploadedFiles([])}
                        variant="ghost"
                        size="sm"
                      >
                        Clear All
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={handleAnalyzeAll}
                      className="w-full"
                      size="lg"
                      disabled={isProcessingBatch || uploadedFiles.every(f => f.status !== 'pending')}
                    >
                      {isProcessingBatch ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Analyze ${uploadedFiles.filter(f => f.status === 'pending').length} Document(s)`
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Files List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText size={20} />
                  <span>Files ({uploadedFiles.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {uploadedFiles.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {uploadedFiles.map((fileInfo, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-start gap-4">
                          {/* Preview Thumbnail */}
                          <div className="flex-shrink-0">
                            {fileInfo.file.type.includes('image') ? (
                              <img
                                src={fileInfo.previewUrl}
                                alt={fileInfo.file.name}
                                className="w-16 h-16 object-cover rounded border"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded border flex items-center justify-center">
                                <FileText className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {fileInfo.file.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {(fileInfo.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              
                              {/* Status Badge */}
                              <div className="flex items-center gap-2">
                                {fileInfo.status === 'pending' && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                    Pending
                                  </span>
                                )}
                                {fileInfo.status === 'uploading' && (
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Uploading
                                  </span>
                                )}
                                {fileInfo.status === 'processing' && (
                                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Processing
                                  </span>
                                )}
                                {fileInfo.status === 'completed' && (
                                  <>
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      Completed
                                    </span>
                                    {fileInfo.documentId && (
                                      <Button
                                        onClick={() => viewDocument(fileInfo.documentId!)}
                                        size="sm"
                                        variant="outline"
                                      >
                                        View
                                      </Button>
                                    )}
                                  </>
                                )}
                                {fileInfo.status === 'error' && (
                                  <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                                    Error
                                  </span>
                                )}
                                
                                {fileInfo.status === 'pending' && (
                                  <Button
                                    onClick={() => removeFile(index)}
                                    variant="ghost"
                                    size="sm"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            {(fileInfo.status === 'uploading' || fileInfo.status === 'processing') && (
                              <div className="mt-2">
                                <Progress value={fileInfo.progress} className="h-2" />
                                <p className="text-xs text-gray-500 mt-1">
                                  {fileInfo.progress}%
                                </p>
                              </div>
                            )}
                            
                            {/* Error Message */}
                            {fileInfo.status === 'error' && fileInfo.error && (
                              <p className="text-xs text-red-600 mt-2">
                                {fileInfo.error}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="text-center">
                      <FileText size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No files uploaded yet
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Drop files or click the upload area
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Batch Processing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload and analyze multiple documents simultaneously
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Image className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Visual Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Identifies tables, signatures, logos and document structure
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Real-time Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track processing status for each document in real-time
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}