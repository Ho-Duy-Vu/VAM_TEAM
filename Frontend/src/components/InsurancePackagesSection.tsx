/**
 * Insurance Packages Section
 * Displays all available insurance packages with beautiful cards
 */

import React, { useState } from 'react'
import { InsurancePackageCard } from './InsurancePackageCard'
import { insurancePackages, getFeaturedPackages, getPackagesByType } from '../data/insurancePackages'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Shield, Sparkles } from 'lucide-react'

type TabValue = 'all' | 'featured' | 'life' | 'health' | 'vehicle' | 'mandatory_health'

export const InsurancePackagesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('featured')
  
  const getPackagesToDisplay = () => {
    switch (activeTab) {
      case 'featured':
        return getFeaturedPackages()
      case 'all':
        return insurancePackages
      case 'life':
        return getPackagesByType('life')
      case 'health':
        return getPackagesByType('health')
      case 'vehicle':
        return getPackagesByType('vehicle')
      case 'mandatory_health':
        return getPackagesByType('mandatory_health')
      default:
        return insurancePackages
    }
  }
  
  const packages = getPackagesToDisplay()
  
  return (
    <section id="insurance-packages" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            <span>Các Gói Bảo Hiểm</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Lựa Chọn Gói Bảo Hiểm Phù Hợp
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Bảo vệ toàn diện cho bạn và gia đình với các gói bảo hiểm đa dạng, 
            quy trình đơn giản và quyền lợi vượt trội
          </p>
        </div>
        
        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="mb-12">
          <TabsList className="grid w-full grid-cols-6 max-w-4xl mx-auto h-auto">
            <TabsTrigger value="featured" className="flex items-center gap-2 py-3">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Nổi Bật</span>
            </TabsTrigger>
            <TabsTrigger value="all" className="py-3">
              Tất Cả
            </TabsTrigger>
            <TabsTrigger value="life" className="py-3">
              <span className="hidden sm:inline">Nhân Thọ</span>
              <span className="sm:hidden">NT</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="py-3">
              <span className="hidden sm:inline">Sức Khỏe</span>
              <span className="sm:hidden">SK</span>
            </TabsTrigger>
            <TabsTrigger value="vehicle" className="py-3">
              <span className="hidden sm:inline">Xe Cộ</span>
              <span className="sm:hidden">XC</span>
            </TabsTrigger>
            <TabsTrigger value="mandatory_health" className="py-3">
              <span className="hidden sm:inline">BHYT</span>
              <span className="sm:hidden">BH</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <InsurancePackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
        
        {/* Empty State */}
        {packages.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Không tìm thấy gói bảo hiểm nào
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
