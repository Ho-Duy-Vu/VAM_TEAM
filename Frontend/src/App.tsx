import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { router } from './routes'
import FloatingChatWidget from './components/FloatingChatWidget'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="ade-ui-theme">
        <div className="min-h-screen bg-background text-foreground">
          <RouterProvider router={router} />
          {/* Global Floating Chat Widget - Available on all pages */}
          <FloatingChatWidget />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
