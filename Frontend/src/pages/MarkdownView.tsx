import React from 'react'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { useDocumentStore } from '../store/document'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FileText, Loader2 } from 'lucide-react'

// Component to convert plain text to table format for ID cards and similar documents
const TextToTableConverter: React.FC<{ content: string }> = ({ content }) => {
  // Parse content into structured data
  const parseContentToTable = (text: string) => {
    // Split by common separators and patterns
    const lines = text.split('\n').filter(line => line.trim())
    const rows: { field: string; value: string }[] = []
    
    lines.forEach(line => {
      // Try to match pattern: "Field: Value" or "Field / Value"
      const colonMatch = line.match(/^(.+?):\s*(.+)$/)
      const slashMatch = line.match(/^(.+?)\s*\/\s*(.+)$/)
      
      if (colonMatch) {
        rows.push({ field: colonMatch[1].trim(), value: colonMatch[2].trim() })
      } else if (slashMatch) {
        rows.push({ field: slashMatch[1].trim(), value: slashMatch[2].trim() })
      } else if (line.length > 0) {
        // If no pattern match, treat whole line as value
        rows.push({ field: 'Information', value: line.trim() })
      }
    })
    
    return rows
  }
  
  const tableData = parseContentToTable(content)
  
  if (tableData.length === 0) {
    return <p className="text-gray-600">{content}</p>
  }
  
  return (
    <div className="overflow-x-auto mb-6 shadow-md rounded-lg border border-gray-300 dark:border-gray-600">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600 border-collapse">
        <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide border-r border-gray-300 dark:border-gray-600 bg-gradient-to-b from-transparent to-blue-50/30 w-1/3">
              Field
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide bg-gradient-to-b from-transparent to-blue-50/30">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {tableData.map((row, idx) => (
            <tr key={idx} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150">
              <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                {row.field}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const MarkdownView: React.FC = () => {
  const { markdown } = useDocumentStore()
  
  // Show loading state if markdown is null or undefined
  if (markdown === null || markdown === undefined) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">Loading markdown content...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Show empty state if markdown is empty string
  if (markdown === '') {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 dark:text-gray-400">No markdown content available</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Please analyze the document first
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Check if content contains markdown tables (has | characters in structured way)
  const hasMarkdownTable = markdown.includes('|') && markdown.includes('---')
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center space-x-2">
          <FileText size={20} />
          <span>Full Document Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="max-w-none">
          {hasMarkdownTable ? (
            // If markdown already has tables, render normally
            <MarkdownRenderer content={markdown} />
          ) : (
            // If plain text, convert to table format
            <TextToTableConverter content={markdown} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}