import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { JsonEditor } from '../components/JsonEditor'
import { useDocumentStore } from '../store/document'
import { documentApi } from '../api/client'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { FileCode, Loader2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import type { DocumentJsonData } from '../api/types'

export const JsonView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { jsonData } = useDocumentStore()
  
  const updateMutation = useMutation({
    mutationFn: (data: DocumentJsonData) => documentApi.updateDocumentJson(id!, data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['document-json', id] })
    }
  })
  
  const handleSave = (data: DocumentJsonData) => {
    updateMutation.mutate(data)
  }
  
  if (!jsonData) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">Loading JSON data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center space-x-2">
          <FileCode size={20} />
          <span>Extracted Data (JSON)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <JsonEditor
          data={jsonData}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  )
}