import { useDocumentStore } from '../store/document'

export default function VisualView() {
  const { currentDocument, currentPage } = useDocumentStore()
  
  // Get current page image URL from document data
  const currentPageImage = currentDocument?.pages?.[currentPage]?.image_url || ''
  const imageUrl = currentPageImage.startsWith('http') ? currentPageImage : `http://localhost:8000${currentPageImage}`
  
  // Check if current page has a valid image
  const hasValidImage = currentPageImage && currentPageImage.length > 0
  
  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Document Preview */}
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Document Preview</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Original document image
          </p>
        </div>
        
        <div className="p-4 h-full overflow-auto">
          <div className="flex items-center justify-center min-h-[500px]">
            {hasValidImage ? (
              <img
                src={imageUrl}
                alt="Document preview"
                className="max-w-full h-auto rounded shadow-lg"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl)
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded p-8">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400">Document image loading...</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Ensure backend is running on http://localhost:8000
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Document Info */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Document Information</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Current Page:</span>
            <span className="font-medium">{currentPage + 1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Pages:</span>
            <span className="font-medium">{currentDocument?.pages?.length || 0}</span>
          </div>
          <div className="flex justify-between col-span-2">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className="font-medium">{currentDocument?.status || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}