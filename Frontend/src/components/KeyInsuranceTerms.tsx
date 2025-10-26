import { CheckCircle2, HelpCircle, FileText, Calendar, Building, User, Shield, DollarSign } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import type { DocumentJsonData } from '../api/types'

interface KeyInsuranceTermsProps {
  jsonData: DocumentJsonData | null
}

interface InsuranceTerm {
  label: string
  value: string | null
  icon: React.ReactNode
  verified: boolean
}

export default function KeyInsuranceTerms({ jsonData }: KeyInsuranceTermsProps) {
  if (!jsonData) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>Chưa có dữ liệu phân tích</p>
        </CardContent>
      </Card>
    )
  }

  // Extract key terms from JSON data
  const terms: InsuranceTerm[] = [
    {
      label: 'Policy Number',
      value: extractPolicyNumber(jsonData),
      icon: <FileText className="w-5 h-5" />,
      verified: !!extractPolicyNumber(jsonData)
    },
    {
      label: 'Effective Date',
      value: extractEffectiveDate(jsonData),
      icon: <Calendar className="w-5 h-5" />,
      verified: !!extractEffectiveDate(jsonData)
    },
    {
      label: 'Insurer',
      value: extractInsurer(jsonData),
      icon: <Building className="w-5 h-5" />,
      verified: !!extractInsurer(jsonData)
    },
    {
      label: 'Policy Holder',
      value: extractPolicyHolder(jsonData),
      icon: <User className="w-5 h-5" />,
      verified: !!extractPolicyHolder(jsonData)
    },
    {
      label: 'Insurance Type',
      value: jsonData.document_type || null,
      icon: <Shield className="w-5 h-5" />,
      verified: !!jsonData.document_type
    },
    {
      label: 'Premium / Benefits',
      value: extractPremium(jsonData),
      icon: <DollarSign className="w-5 h-5" />,
      verified: !!extractPremium(jsonData)
    }
  ]

  return (
    <Card className="border-trust-200 shadow-trust">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Key Insurance Terms</h3>
          <p className="text-sm text-gray-600">Thông tin quan trọng trích xuất từ AI</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {terms.map((term, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border-2 transition-all ${
                term.verified
                  ? 'bg-success-50 border-success-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${term.verified ? 'bg-success-100 text-success-700' : 'bg-gray-200 text-gray-500'}`}>
                  {term.icon}
                </div>
                {term.verified ? (
                  <CheckCircle2 className="w-5 h-5 text-success-600" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <div className="text-sm font-medium text-gray-600 mb-1">{term.label}</div>
              <div className={`text-sm font-semibold ${term.verified ? 'text-gray-900' : 'text-gray-400'}`}>
                {term.value || 'Chưa xác định'}
              </div>
            </div>
          ))}
        </div>

        {jsonData.confidence && (
          <div className="mt-4 p-4 bg-trust-50 rounded-xl border border-trust-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Độ tin cậy phân tích AI:</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-trust-600 transition-all duration-500"
                    style={{ width: `${jsonData.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-trust-700">
                  {(jsonData.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Helper functions to extract data
function extractPolicyNumber(data: DocumentJsonData): string | null {
  // Try to find policy number in various places
  if (data.policy?.certificate_number) return data.policy.certificate_number
  
  // Search in numbers array
  const numbers = data.numbers || []
  for (const num of numbers) {
    const label = num.label?.toLowerCase() || ''
    const value = num.value?.toLowerCase() || ''
    if (label.includes('policy') || label.includes('hợp đồng') || 
        label.includes('certificate') || label.includes('số')) {
      return num.value
    }
    if (value.includes('policy') || value.includes('hợp đồng')) {
      return num.value
    }
  }
  
  return null
}

function extractEffectiveDate(data: DocumentJsonData): string | null {
  if (data.policy?.issue_date) return data.policy.issue_date
  if (data.policy?.validity_period) return data.policy.validity_period
  
  // Get first date from dates array or look for effective/issue date
  const dates = data.dates || []
  if (dates.length > 0) {
    // Try to find effective or issue date
    const effectiveDate = dates.find(d => {
      const label = d.label?.toLowerCase() || ''
      return label.includes('effective') || label.includes('issue') || 
             label.includes('hiệu lực') || label.includes('phát hành')
    })
    return effectiveDate ? effectiveDate.value : dates[0].value
  }
  return null
}

function extractInsurer(data: DocumentJsonData): string | null {
  if (data.policy?.carrier) return data.policy.carrier
  if (data.veterinary_certification?.clinic_name) return data.veterinary_certification.clinic_name
  
  // Get first organization
  const orgs = data.organizations || []
  return orgs.length > 0 ? orgs[0].name : null
}

function extractPolicyHolder(data: DocumentJsonData): string | null {
  // Get first person
  const people = data.people || []
  return people.length > 0 ? people[0].name : null
}

function extractPremium(data: DocumentJsonData): string | null {
  // Search in numbers for currency-like values
  const numbers = data.numbers || []
  for (const num of numbers) {
    const label = num.label?.toLowerCase() || ''
    const value = num.value || ''
    
    // Check if label or value contains currency indicators
    if (label.includes('premium') || label.includes('phí') || 
        label.includes('amount') || label.includes('benefit') || label.includes('quyền lợi')) {
      return value
    }
    if (value.includes('$') || value.includes('VND') || value.includes('USD') || 
        value.includes('đ') || value.includes('₫')) {
      return value
    }
  }
  
  return null
}
