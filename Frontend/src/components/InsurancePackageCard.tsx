/**
 * Insurance Package Card Component
 * Beautiful card display for insurance packages with hover effects
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Heart, 
  Shield, 
  Users, 
  Plane, 
  Car, 
  LifeBuoy,
  Check,
  ArrowRight,
  Sparkles,
  Droplets,
  Wind,
  CloudRain
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import type { InsurancePackage } from '../types/insurance'
import { formatPrice } from '../data/insurancePackages'
import { useInsuranceStore } from '../store/insurance'

interface InsurancePackageCardProps {
  package: InsurancePackage
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Shield,
  Users,
  Plane,
  Car,
  LifeBuoy,
  Droplets,
  Wind,
  CloudRain
}

// Color mapping for gradients
const colorMap: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  green: 'from-green-500 to-green-600',
  indigo: 'from-indigo-500 to-indigo-600',
  red: 'from-red-500 to-red-600',
  orange: 'from-orange-500 to-orange-600',
  teal: 'from-teal-500 to-teal-600',
  cyan: 'from-cyan-500 to-cyan-600',
  slate: 'from-slate-500 to-slate-600',
}

export const InsurancePackageCard: React.FC<InsurancePackageCardProps> = ({ package: pkg }) => {
  const navigate = useNavigate()
  const { setSelectedPackage } = useInsuranceStore()
  
  const Icon = iconMap[pkg.icon] || Shield
  const gradientClass = colorMap[pkg.color] || colorMap.blue
  
  // Color for icon background and accents
  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
    slate: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
  }
  
  const colors = colorClasses[pkg.color] || colorClasses.blue
  
  const handleViewDetails = () => {
    // For natural disaster packages, use special detail page
    if (pkg.type === 'natural_disaster') {
      navigate(`/natural-disaster/${pkg.id}`)
    } else {
      navigate(`/packages/${pkg.id}`)
    }
  }
  
  const handleBuyNow = () => {
    setSelectedPackage(pkg)
    // For natural disaster packages, go to specialized form
    if (pkg.type === 'natural_disaster') {
      navigate(`/natural-disaster/application?package=${pkg.id}`)
    } else {
      navigate('/insurance/upload')
    }
  }
  
  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 border-gray-200 hover:border-gray-300 bg-white dark:bg-gray-900"
    >
      {/* Featured Badge */}
      {pkg.featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            <Sparkles className="w-3 h-3" />
            <span>Nổi Bật</span>
          </div>
        </div>
      )}
      
      <CardHeader className="relative z-10 pb-4 pt-8">
        {/* Icon Circle */}
        <div className="flex justify-center mb-4">
          <div className={`w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center shadow-lg border-2 ${colors.border} group-hover:scale-110 transition-all duration-300`}>
            <Icon className={`w-10 h-10 ${colors.text}`} />
          </div>
        </div>
        
        {/* Package Name */}
        <CardTitle className="text-center text-gray-900 dark:text-white text-xl font-bold">
          {pkg.name}
        </CardTitle>
        
        {/* Period */}
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-1 font-medium">
          {pkg.period}
        </p>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4">
        {/* Price */}
        <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatPrice(pkg.price)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
            Quyền lợi: <span className="font-semibold text-gray-900 dark:text-white">{pkg.coverage}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed min-h-[60px] font-medium">
          {pkg.description}
        </p>
        
        {/* Benefits List */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
            <Check className={`w-4 h-4 ${colors.text}`} />
            Quyền lợi nổi bật:
          </h4>
          <ul className="space-y-2">
            {pkg.benefits.slice(0, 4).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                <Check className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          {pkg.benefits.length > 4 && (
            <p className="text-xs text-gray-600 dark:text-gray-400 italic pl-6 font-medium">
              + {pkg.benefits.length - 4} quyền lợi khác...
            </p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-4">
          <Button
            onClick={handleBuyNow}
            className={`w-full bg-gradient-to-r ${gradientClass} hover:opacity-90 text-white font-bold shadow-lg group/btn transition-all duration-300 h-11`}
          >
            <span>Mua Ngay</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
          
          <Button
            onClick={handleViewDetails}
            variant="outline"
            className="w-full border-2 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold h-11"
          >
            Xem Chi Tiết
          </Button>
        </div>
      </CardContent>
      
      {/* Hover Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${gradientClass} rounded-lg blur opacity-0 group-hover:opacity-10 transition duration-300 -z-10`} />
    </Card>
  )
}
