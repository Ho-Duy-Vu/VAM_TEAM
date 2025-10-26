import { createBrowserRouter } from 'react-router-dom'
import HomePage from '../pages/HomePage'
// Document analysis pages removed - not part of insurance workflow
// import { UploadPage } from '../pages/UploadPage'
// import { DocumentReviewLayout } from '../pages/DocumentReviewLayout'
import ProductsPage from '../pages/ProductsPage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProfilePage from '../pages/ProfilePage'
import MyDocumentsPage from '../pages/MyDocumentsPage'
import { InsuranceUploadPage } from '../pages/InsuranceUploadPage'
import { InsuranceApplicationFormPage } from '../pages/InsuranceApplicationFormPage'
import ImprovedInsuranceApplicationPage from '../pages/ImprovedInsuranceApplicationPage'
import { PaymentPage } from '../pages/PaymentPage'
import { SuccessPage } from '../pages/SuccessPage'
import { PackageDetailPage } from '../pages/PackageDetailPage'
import NaturalDisasterPackageDetailPage from '../pages/NaturalDisasterPackageDetailPage'
import NaturalDisasterApplicationPage from '../pages/NaturalDisasterApplicationPage'

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
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/my-documents',
    element: <MyDocumentsPage />,
  },
  // Document analysis routes removed - using insurance flow only
  // {
  //   path: '/upload',
  //   element: <UploadPage />,
  // },
  // {
  //   path: '/documents/:id',
  //   element: <DocumentReviewLayout />,
  // },
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
  // Insurance Purchase Flow - Main workflow
  {
    path: '/insurance/upload',
    element: <InsuranceUploadPage />,
  },
  {
    path: '/insurance/application',
    element: <ImprovedInsuranceApplicationPage />,
  },
  {
    path: '/insurance/application-old',
    element: <InsuranceApplicationFormPage />,
  },
  {
    path: '/insurance/payment',
    element: <PaymentPage />,
  },
  {
    path: '/insurance/success',
    element: <SuccessPage />,
  },
  {
    path: '/packages/:id',
    element: <PackageDetailPage />,
  },
  // Natural Disaster Insurance - Detailed pages
  {
    path: '/natural-disaster/:packageId',
    element: <NaturalDisasterPackageDetailPage />,
  },
  {
    path: '/natural-disaster/application',
    element: <NaturalDisasterApplicationPage />,
  },
])