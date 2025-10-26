import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { FileText, User, MapPin, Calendar, Hash, FileCheck } from 'lucide-react'
import type { DocumentJsonData } from '../api/types'

interface StructuredDataViewProps {
  jsonData: DocumentJsonData | null
}

export const StructuredDataView: React.FC<StructuredDataViewProps> = ({ jsonData }) => {
  if (!jsonData) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No structured data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Parse summary text into structured rows
  const parseTextToRows = (text: string): Array<{label: string, value: string}> => {
    if (!text) return []
    
    const rows: Array<{label: string, value: string}> = []
    
    // Split by "/" and clean each part
    const parts = text.split(/\s*\/\s*/).map(p => p.trim()).filter(p => p.length > 0)
    
    parts.forEach(part => {
      // Try to find "Label: Value" pattern
      const colonMatch = part.match(/^(.+?):\s*(.+)$/)
      if (colonMatch) {
        rows.push({ 
          label: colonMatch[1].trim(), 
          value: colonMatch[2].trim() 
        })
        return
      }
      
      // Try to find "Label Value" with clear separation
      const spaceMatch = part.match(/^([A-Za-zÀ-ỹ\s]+?)\s+([\d\w].+)$/)
      if (spaceMatch) {
        rows.push({ 
          label: spaceMatch[1].trim(), 
          value: spaceMatch[2].trim() 
        })
        return
      }
      
      // If no pattern, treat as standalone value
      rows.push({ 
        label: 'Information', 
        value: part 
      })
    })
    
    return rows
  }

  const summaryRows = jsonData.summary ? parseTextToRows(jsonData.summary) : []
  const titleRows = jsonData.title ? parseTextToRows(jsonData.title) : []
  const allTextRows = [...titleRows, ...summaryRows]

  return (
    <div className="space-y-6 pb-8">
      {/* Document Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Document Type</p>
              <p className="text-base font-semibold">{jsonData.document_type || 'Unknown'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Confidence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-trust-600 transition-all"
                    style={{ width: `${(jsonData.confidence || 0) * 100}%` }}
                  />
                </div>
                <span className="text-base font-semibold">
                  {((jsonData.confidence || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Parsed Text Content as Table */}
          {allTextRows.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">Extracted Content</p>
              <div className="overflow-x-auto rounded-lg border border-gray-300">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-100 to-indigo-100">
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wide border-r border-gray-300 w-1/3">
                        Field
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wide">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allTextRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200">
                          {row.label}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* People */}
      {jsonData.people && jsonData.people.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              People ({jsonData.people.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gradient-to-r from-trust-50 to-blue-50">
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Name</th>
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Role</th>
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">ID Number</th>
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Date of Birth</th>
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {jsonData.people.map((person, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{person.name || '-'}</td>
                      <td className="p-3 text-gray-600">{person.role || '-'}</td>
                      <td className="p-3 text-gray-600 font-mono text-sm">{person.id_number || '-'}</td>
                      <td className="p-3 text-gray-600">{person.date_of_birth || '-'}</td>
                      <td className="p-3 text-gray-600">{person.gender || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Organizations */}
      {jsonData.organizations && jsonData.organizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Organizations ({jsonData.organizations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gradient-to-r from-trust-50 to-blue-50">
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Name</th>
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Type</th>
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {jsonData.organizations.map((org, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{org.name || '-'}</td>
                      <td className="p-3 text-gray-600">{org.type || '-'}</td>
                      <td className="p-3 text-gray-600">{org.address || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Locations */}
      {jsonData.locations && jsonData.locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Locations ({jsonData.locations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gradient-to-r from-trust-50 to-blue-50">
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Label</th>
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {jsonData.locations.map((location, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{location.label || 'Location'}</td>
                      <td className="p-3 text-gray-600">{location.value || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dates */}
      {jsonData.dates && jsonData.dates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Dates ({jsonData.dates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gradient-to-r from-trust-50 to-blue-50">
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Label</th>
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {jsonData.dates.map((date, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{date.label || 'Date'}</td>
                      <td className="p-3 text-gray-600 font-mono">{date.value || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Numbers */}
      {jsonData.numbers && jsonData.numbers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Numbers & Values ({jsonData.numbers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gradient-to-r from-trust-50 to-blue-50">
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Label</th>
                    <th className="text-left p-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {jsonData.numbers.map((number, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{number.label || 'Number'}</td>
                      <td className="p-3 text-gray-600 font-mono">{number.value || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signature Detection */}
      {jsonData.signature_detected !== undefined && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Signature Detected:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                jsonData.signature_detected 
                  ? 'bg-success-100 text-success-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {jsonData.signature_detected ? 'Yes' : 'No'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
