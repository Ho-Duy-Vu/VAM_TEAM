import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const productLinks = [
    { name: 'Bảo hiểm sức khỏe', href: '/products/health' },
    { name: 'Bảo hiểm tai nạn', href: '/products/accident' },
    { name: 'Bảo hiểm du lịch', href: '/products/travel' },
    { name: 'Bảo hiểm ô tô', href: '/products/car' },
    { name: 'Bảo hiểm nhà cửa', href: '/products/home' },
  ]

  const companyLinks = [
    { name: 'Về chúng tôi', href: '/about' },
    { name: 'Tin tức', href: '/news' },
    { name: 'Tuyển dụng', href: '/careers' },
    { name: 'Đối tác', href: '/partners' },
    { name: 'Liên hệ', href: '/contact' },
  ]

  const supportLinks = [
    { name: 'Trung tâm hỗ trợ', href: '/support' },
    { name: 'Hướng dẫn sử dụng', href: '/guide' },
    { name: 'Câu hỏi thường gặp', href: '/faq' },
    { name: 'Chính sách bảo mật', href: '/privacy' },
    { name: 'Điều khoản sử dụng', href: '/terms' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-12 h-12 bg-gradient-to-br from-trust-600 via-trust-700 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">VAM</span>
                  <span className="text-xl font-semibold text-gray-300">Insurance</span>
                </div>
                <div className="text-xs text-gray-400">AI-Powered Protection</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Giải pháp bảo hiểm thông minh với công nghệ AI tiên tiến, 
              giúp bạn dễ dàng tìm kiếm và lựa chọn gói bảo hiểm phù hợp nhất.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-5 h-5 text-trust-500 flex-shrink-0" />
                <span>20 Đường 904, Quận 9, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-5 h-5 text-trust-500 flex-shrink-0" />
                <a href="tel:0932694273" className="hover:text-trust-400 transition-colors">
                  +84932694273
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-5 h-5 text-trust-500 flex-shrink-0" />
                <a href="mailto:duyvu11092004@gmail.com" className="hover:text-trust-400 transition-colors">
                  duyvu11092004@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Sản phẩm bảo hiểm</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-trust-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Công ty</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-trust-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-trust-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-sm text-gray-400">Kết nối với chúng tôi:</span>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-gray-800 hover:bg-trust-600 rounded-lg flex items-center justify-center transition-all group"
                      aria-label={social.name}
                    >
                      <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <img 
                src="/images/dmca-badge.png" 
                alt="DMCA Protected" 
                className="h-8 opacity-60 hover:opacity-100 transition-opacity"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <img 
                src="/images/ssl-badge.png" 
                alt="SSL Secure" 
                className="h-8 opacity-60 hover:opacity-100 transition-opacity"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between text-xs text-gray-500">
            <p>© 2025 VAM Insurance. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <Link to="/privacy" className="hover:text-trust-400 transition-colors">
                Chính sách bảo mật
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-trust-400 transition-colors">
                Điều khoản sử dụng
              </Link>
              <span>•</span>
              <Link to="/cookies" className="hover:text-trust-400 transition-colors">
                Chính sách Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
