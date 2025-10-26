import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileText, Eye, FileCode, Download, Moon, Sun, ArrowLeft, EyeOff, SidebarOpen, SidebarClose, Shield, MessageSquare } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import { documentApi } from '../api/client'
import { useDocumentStore } from '../store/document'
import VisualView from './VisualView'
import { MarkdownView } from './MarkdownView'
import { StructuredDataView } from '../components/StructuredDataView'
import InsuranceRecommendation from '../components/InsuranceRecommendation'
import InsuranceChatbot from '../components/InsuranceChatbot'

export const DocumentReviewLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showVisual, setShowVisual] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  const {
    currentDocument,
    setCurrentDocument,
    setJsonData,
    setMarkdown,
    currentTab,
    setCurrentTab,
    theme,
    toggleTheme,
    currentPage,
    setCurrentPage,
    uploadedDocumentIds,
  } = useDocumentStore()
  
  // Fetch document info
  const { data: documentInfo } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentApi.getDocumentInfo(id!),
    enabled: !!id,
  })
  
  // Fetch JSON data
  const { data: jsonData } = useQuery({
    queryKey: ['document-json', id],
    queryFn: () => documentApi.getDocumentJson(id!),
    enabled: !!id,
    retry: 1,
  })
  
  // Fetch markdown
  const { data: markdown, isLoading: markdownLoading, error: markdownError } = useQuery({
    queryKey: ['document-markdown', id],
    queryFn: async () => {
      try {
        const result = await documentApi.getDocumentMarkdown(id!)
        console.log('✅ Markdown API response:', result)
        return result
      } catch (error) {
        console.error('❌ Markdown API error:', error)
        throw error
      }
    },
    enabled: !!id,
    retry: 1,
  })
  
  // Fetch insurance recommendation
  const { data: recommendationData } = useQuery({
    queryKey: ['document-recommendation', id],
    queryFn: async () => {
      try {
        const result = await documentApi.getInsuranceRecommendation(id!)
        console.log('✅ Insurance recommendation:', result)
        return result
      } catch (error) {
        console.error('❌ Recommendation API error:', error)
        return null
      }
    },
    enabled: !!id,
    retry: 1,
  })
  
  // Debug logging
  useEffect(() => {
    console.log('📊 Markdown state:', { 
      markdown, 
      markdownLoading, 
      markdownError,
      type: typeof markdown,
      length: markdown?.length 
    })
  }, [markdown, markdownLoading, markdownError])
  
  // Reset markdown when document ID changes
  useEffect(() => {
    console.log('🔄 Document ID changed to:', id)
    setMarkdown(null!) // Reset to null to show loading state
  }, [id, setMarkdown])
  
  useEffect(() => {
    if (documentInfo) setCurrentDocument(documentInfo)
  }, [documentInfo, setCurrentDocument])
  
  useEffect(() => {
    if (jsonData) setJsonData(jsonData)
  }, [jsonData, setJsonData])
  
  useEffect(() => {
    if (markdown !== undefined) {
      console.log('Setting markdown to store:', markdown)
      setMarkdown(markdown)
    }
  }, [markdown, setMarkdown])
  
  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab as 'visual' | 'markdown' | 'json')
  }
  
  const handleDownload = () => {
    if (currentTab === 'json' && jsonData) {
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentDocument?.document_id || 'document'}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else if (currentTab === 'markdown' && markdown) {
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentDocument?.document_id || 'document'}.md`
      a.click()
      URL.revokeObjectURL(url)
    }
  }
  
  const totalPages = currentDocument?.pages?.length || 1
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Back to Upload</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {currentDocument?.document_id ? `Document ${currentDocument.document_id}` : 'Document Analysis'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {currentDocument?.status && typeof currentDocument.status === 'string' ? currentDocument.status.toUpperCase() : 'UNKNOWN'} • {currentDocument?.pages?.length || 0} pages
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Page navigation for multi-page documents */}
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                </Button>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVisual(!showVisual)}
              className="flex items-center space-x-2"
            >
              {showVisual ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showVisual ? 'Hide' : 'Show'} Visual</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center space-x-2"
            >
              <Download size={16} />
              <span>Download</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Document Tabs - Hiển thị khi có nhiều documents */}
      {uploadedDocumentIds.length > 1 && (
        <div className="border-b border-border bg-card">
          <div className="flex items-center px-6 py-2 overflow-x-auto space-x-2">
            {uploadedDocumentIds.map((docId, index) => (
              <Button
                key={docId}
                variant={id === docId ? "default" : "outline"}
                size="sm"
                onClick={() => navigate(`/documents/${docId}`)}
                className="whitespace-nowrap"
              >
                <FileText className="w-4 h-4 mr-2" />
                Document {index + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Main Content - Split Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Visual Panel */}
        {showVisual && (
          <div className={`bg-card border-r border-border transition-all duration-300 ${
            sidebarCollapsed ? 'w-12' : 'w-1/2'
          }`}>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className={`font-semibold ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                Visual Document Analysis
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? <SidebarOpen size={16} /> : <SidebarClose size={16} />}
              </Button>
            </div>
            {!sidebarCollapsed && (
              <div className="p-4 h-full overflow-auto">
                <VisualView />
              </div>
            )}
          </div>
        )}
        
        {/* Analysis Content Panel */}
        <div className={`flex-1 bg-background transition-all duration-300 overflow-hidden ${
          !showVisual ? 'w-full' : showVisual && sidebarCollapsed ? 'w-full' : 'w-1/2'
        }`}>
          <div className="p-6 h-full flex flex-col overflow-hidden">
            {/* Tabs for different analysis views */}
            <Tabs value={currentTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-4 max-w-4xl mb-4 flex-shrink-0">
                <TabsTrigger value="json" className="flex items-center space-x-2">
                  <FileCode size={16} />
                  <span>Structured Data</span>
                </TabsTrigger>
                <TabsTrigger value="markdown" className="flex items-center space-x-2">
                  <FileText size={16} />
                  <span>Full Content</span>
                </TabsTrigger>
                <TabsTrigger value="recommendation" className="flex items-center space-x-2">
                  <Shield size={16} />
                  <span>Recommendations</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center space-x-2">
                  <MessageSquare size={16} />
                  <span>AI Advisor</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-hidden min-h-0">
                <TabsContent value="json" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
                  <div className="flex-1 overflow-auto">
                    <StructuredDataView jsonData={jsonData || null} />
                  </div>
                </TabsContent>
                
                <TabsContent value="markdown" className="h-full data-[state=active]:block">
                  <MarkdownView />
                </TabsContent>
                
                <TabsContent value="recommendation" className="h-full data-[state=active]:block">
                  <InsuranceRecommendation 
                    jsonData={jsonData || null} 
                    recommendationData={recommendationData || undefined}
                  />
                </TabsContent>
                
                <TabsContent value="chat" className="h-full data-[state=active]:flex data-[state=active]:flex-col">
                  <InsuranceChatbot documentId={id!} jsonData={jsonData || null} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Footer with document stats */}
      {currentDocument && (
        <footer className="border-t border-border bg-card px-6 py-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-6">
              <span>Document ID: {currentDocument.document_id}</span>
              <span>Status: {currentDocument.status}</span>
              <span>Pages: {currentDocument.pages?.length || 0}</span>
            </div>
            <div>
              Last Updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}