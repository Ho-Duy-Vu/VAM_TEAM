/**
 * Updated Routes with Insurance Flow
 */

import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import { UploadPage } from '../pages/UploadPage'
import { DocumentReviewLayout } from '../pages/DocumentReviewLayout'
import ProductsPage from '../pages/ProductsPage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import { InsuranceUploadPage } from '../pages/InsuranceUploadPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/upload',
    element: <UploadPage />,
  },
  {
    path: '/documents/:id',
    element: <DocumentReviewLayout />,
  },
  {
    path: '/products',
    element: <ProductsPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  // Insurance flow routes
  {
    path: '/insurance/upload',
    element: <InsuranceUploadPage />,
  },
  // Placeholder routes - will be implemented next
  {
    path: '/insurance/application',
    element: <div>Application Form Page - Coming Soon</div>,
  },
  {
    path: '/insurance/payment',
    element: <div>Payment Page - Coming Soon</div>,
  },
  {
    path: '/insurance/success',
    element: <div>Success Page - Coming Soon</div>,
  },
  {
    path: '/packages/:id',
    element: <div>Package Detail Page - Coming Soon</div>,
  },
])
