import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom heading styles
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-8 border-b border-gray-200 dark:border-gray-700 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-6">
              {children}
            </h3>
          ),
          
          // Custom paragraph styles
          p: ({ children }) => (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {children}
            </p>
          ),
          
          // Custom list styles
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 dark:text-gray-300">
              {children}
            </li>
          ),
          
          // Custom table styles - Enhanced for better readability
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6 shadow-md rounded-lg border border-gray-300 dark:border-gray-600">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600 border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide border-r border-gray-300 dark:border-gray-600 last:border-r-0 bg-gradient-to-b from-transparent to-blue-50/30">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
              <div className="max-w-xs overflow-hidden text-ellipsis">
                {children}
              </div>
            </td>
          ),
          
          // Custom blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-4 rounded-r-lg mb-4">
              {children}
            </blockquote>
          ),
          
          // Custom code styles
          code: ({ children, className }) => {
            const isInline = !className?.includes('language-')
            return isInline ? (
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                {children}
              </code>
            ) : (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                <code>{children}</code>
              </pre>
            )
          },
          
          // Custom hr styles
          hr: () => (
            <hr className="border-gray-200 dark:border-gray-700 my-8" />
          ),
          
          // Custom strong/em styles
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 dark:text-gray-100">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800 dark:text-gray-200">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}