import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Save, Edit3, EyeOff, ChevronDown, ChevronRight } from 'lucide-react'
import type { DocumentJsonData } from '../api/types'

interface JsonEditorProps {
  data: DocumentJsonData
  onSave: (data: DocumentJsonData) => void
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ 
  data, 
  onSave
}) => {
  const [editableData, setEditableData] = useState<DocumentJsonData>(data)
  const [isEditing, setIsEditing] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['summary', 'main', 'pages'])
  )
  
  useEffect(() => {
    setEditableData(data)
  }, [data])
  
  const handleSave = () => {
    onSave(editableData)
    setIsEditing(false)
  }
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }
  
  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">N/A</span>
    }
    
    if (typeof value === 'boolean') {
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          value ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    }
    
    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <span className="text-gray-900 dark:text-gray-100">
          {value || 'N/A'}
        </span>
      )
    }
    
    if (Array.isArray(value)) {
      return <span className="text-blue-600 dark:text-blue-400">Array ({value.length} items)</span>
    }
    
    return <span className="text-purple-600 dark:text-purple-400">Object</span>
  }
  
  const renderArrayValues = (arr: unknown[]): React.ReactNode => {
    if (!arr || arr.length === 0) {
      return <span className="text-gray-400 text-sm">None</span>
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        {arr.map((item, idx) => (
          <span 
            key={idx} 
            className="px-2 py-1 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100 rounded text-sm"
          >
            {typeof item === 'object' ? JSON.stringify(item) : String(item)}
          </span>
        ))}
      </div>
    )
  }
  
  // Document Summary Section
  const SummarySection = () => (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" 
        onClick={() => toggleSection('summary')}
      >
        <CardTitle className="flex items-center space-x-2">
          {expandedSections.has('summary') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>Document Summary</span>
        </CardTitle>
      </CardHeader>
      {expandedSections.has('summary') && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Document Type:</label>
              <p className="text-lg font-semibold mt-1">{editableData.document_type || 'Unknown'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Confidence:</label>
              <p className="text-lg font-semibold mt-1">
                {((editableData.confidence || 0) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          
          {editableData.title && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Title:</label>
              <p className="text-gray-900 dark:text-gray-100 mt-1">{editableData.title}</p>
            </div>
          )}
          
          {editableData.summary && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Summary:</label>
              <p className="text-gray-900 dark:text-gray-100 mt-1 text-sm">{editableData.summary}</p>
            </div>
          )}
          
          {editableData.total_pages && editableData.total_pages > 1 && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pages:</label>
              <p className="text-lg font-semibold mt-1 text-blue-600 dark:text-blue-400">
                {editableData.total_pages} pages
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
  
  // Main Information Section
  const MainInfoSection = () => (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" 
        onClick={() => toggleSection('main')}
      >
        <CardTitle className="flex items-center space-x-2">
          {expandedSections.has('main') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>Extracted Information</span>
        </CardTitle>
      </CardHeader>
      {expandedSections.has('main') && (
        <CardContent className="space-y-4">
          {editableData.people && editableData.people.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                People ({editableData.people.length}):
              </label>
              {renderArrayValues(editableData.people)}
            </div>
          )}
          
          {editableData.organizations && editableData.organizations.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                Organizations ({editableData.organizations.length}):
              </label>
              {renderArrayValues(editableData.organizations)}
            </div>
          )}
          
          {editableData.locations && editableData.locations.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                Locations ({editableData.locations.length}):
              </label>
              {renderArrayValues(editableData.locations)}
            </div>
          )}
          
          {editableData.dates && editableData.dates.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                Dates ({editableData.dates.length}):
              </label>
              {renderArrayValues(editableData.dates)}
            </div>
          )}
          
          {editableData.numbers && editableData.numbers.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                Numbers ({editableData.numbers.length}):
              </label>
              {renderArrayValues(editableData.numbers)}
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Signature Detected:</label>
            <div className="mt-1">{renderValue(editableData.signature_detected)}</div>
          </div>
        </CardContent>
      )}
    </Card>
  )
  
  // Individual Pages Section (for multi-page documents)
  const PagesSection = () => {
    if (!editableData.pages || editableData.pages.length === 0) {
      return null
    }
    
    return (
      <Card className="mb-4">
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" 
          onClick={() => toggleSection('pages')}
        >
          <CardTitle className="flex items-center space-x-2">
            {expandedSections.has('pages') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span>Individual Pages ({editableData.pages.length})</span>
          </CardTitle>
        </CardHeader>
        {expandedSections.has('pages') && (
          <CardContent className="space-y-4">
            {editableData.pages.map((page: Record<string, unknown>, index: number) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-700">
                <CardHeader 
                  className="cursor-pointer bg-gray-50 dark:bg-gray-800"
                  onClick={() => toggleSection(`page-${index}`)}
                >
                  <CardTitle className="flex items-center space-x-2 text-base">
                    {expandedSections.has(`page-${index}`) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span>Page {(page.page_number as number) || index + 1}</span>
                    <span className="text-sm font-normal text-gray-500">
                      ({(page.document_type as string) || 'Unknown'})
                    </span>
                  </CardTitle>
                </CardHeader>
                {expandedSections.has(`page-${index}`) && (
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Type:</span>
                          <p className="font-medium">{(page.document_type as string) || 'Unknown'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Confidence:</span>
                          <p className="font-medium">{(((page.confidence as number) || 0) * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                      
                      {page.title ? (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Title:</span>
                          <p className="text-sm">{String(page.title)}</p>
                        </div>
                      ) : null}
                      
                      {page.summary ? (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Summary:</span>
                          <p className="text-sm">{String(page.summary)}</p>
                        </div>
                      ) : null}
                      
                      {page.signature_detected ? (
                        <div className="pt-2 border-t">
                          <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                            ✓ Signature detected on this page
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Extracted Data</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <EyeOff className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? 'View' : 'Edit'}
          </Button>
          {isEditing && (
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <SummarySection />
        <MainInfoSection />
        <PagesSection />
      </div>

      {/* Raw JSON Toggle */}
      <Card>
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" 
          onClick={() => toggleSection('raw')}
        >
          <CardTitle className="flex items-center space-x-2">
            {expandedSections.has('raw') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span>Raw JSON Data</span>
          </CardTitle>
        </CardHeader>
        {expandedSections.has('raw') && (
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(editableData, null, 2)}
            </pre>
          </CardContent>
        )}
      </Card>
    </div>
  )
}