import { Shield, Menu, X, Phone, User, LogIn, LogOut, Settings, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

interface UserData {
  email: string
  name: string
  token: string
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setUserMenuOpen(false)
    navigate('/')
  }

  const navigation = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sản phẩm bảo hiểm', href: '/products' },
    { name: 'Về chúng tôi', href: '/about' },
    { name: 'Liên hệ', href: '/contact' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-trust-600 via-trust-700 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-trust transition-all">
                <Shield className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black bg-gradient-to-r from-trust-700 via-trust-600 to-blue-700 bg-clip-text text-transparent">
                    VAM
                  </span>
                  <span className="text-lg font-semibold text-gray-700">Insurance</span>
                </div>
                <div className="text-xs text-gray-500 -mt-1">AI-Powered Protection</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-trust-50 text-trust-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-trust-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            <a
              href="tel:+84932694273"
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-trust-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">+84932694273</span>
            </a>
            
            <div className="w-px h-6 bg-gray-300" />
            
            {user ? (
              // User logged in - show dropdown
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-trust-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Thông tin cá nhân
                    </Link>
                    
                    <Link
                      to="/my-documents"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      Tài liệu của tôi
                    </Link>
                    
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Cài đặt
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // User not logged in - show login/register buttons
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700">
                    <User className="w-4 h-4 mr-2" />
                    Đăng nhập
                  </Button>
                </Link>
                
                <Link to="/register">
                  <Button size="sm" className="bg-trust-600 hover:bg-trust-700 text-white">
                    <LogIn className="w-4 h-4 mr-2" />
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 hover:text-trust-600"
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive(item.href)
                      ? 'bg-trust-50 text-trust-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-trust-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <a
                href="tel:+84932694273"
                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">+84932694273</span>
              </a>
              
              {user ? (
                // User logged in - mobile menu
                <>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-700">
                      <User className="w-5 h-5 mr-3" />
                      Thông tin cá nhân
                    </Button>
                  </Link>
                  
                  <Link to="/my-documents" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-700">
                      <FileText className="w-5 h-5 mr-3" />
                      Tài liệu của tôi
                    </Button>
                  </Link>
                  
                  <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-700">
                      <Settings className="w-5 h-5 mr-3" />
                      Cài đặt
                    </Button>
                  </Link>
                  
                  <Button 
                    onClick={handleLogout}
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Đăng xuất
                  </Button>
                </>
              ) : (
                // User not logged in - mobile menu
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-gray-700">
                      <User className="w-5 h-5 mr-3" />
                      Đăng nhập
                    </Button>
                  </Link>
                  
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-trust-600 hover:bg-trust-700 text-white">
                      <LogIn className="w-5 h-5 mr-3" />
                      Đăng ký
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
