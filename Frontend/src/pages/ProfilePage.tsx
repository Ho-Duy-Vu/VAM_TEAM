import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard,
  Shield,
  FileText,
  LogOut,
  Edit,
  Save,
  X
} from 'lucide-react';

interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  created_at?: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setEditedUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedUser(user);
      setIsEditing(false);
    } else {
      // Start editing
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!editedUser) return;

    setIsSaving(true);
    try {
      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify(editedUser));
      setUser(editedUser);
      setIsEditing(false);
      
      // TODO: Update user in backend
      // await fetch(`http://localhost:8000/users/${editedUser.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editedUser)
      // });
      
      alert('✅ Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error saving user data:', error);
      alert('❌ Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [field]: value });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Trang Cá Nhân</h1>
          <p className="text-gray-600">Quản lý thông tin và tài khoản của bạn</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{user.full_name}</CardTitle>
                  <CardDescription className="text-blue-100">{user.email}</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    onClick={handleEditToggle}
                    variant="outline"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                    <Button
                      onClick={handleEditToggle}
                      variant="outline"
                      className="bg-white text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Họ và tên
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser?.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{user.full_name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  Email
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedUser?.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                    {user.phone || 'Chưa cập nhật'}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  Địa chỉ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser?.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Nhập địa chỉ"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                    {user.address || 'Chưa cập nhật'}
                  </p>
                )}
              </div>

              {/* Created At */}
              {user.created_at && (
                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Ngày tham gia
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                    {new Date(user.created_at).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/my-documents')}
          >
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Hợp đồng của tôi</h3>
              <p className="text-sm text-gray-600">Xem lịch sử mua bảo hiểm</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/products')}
          >
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Sản phẩm bảo hiểm</h3>
              <p className="text-sm text-gray-600">Khám phá gói bảo hiểm</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/insurance/upload')}
          >
            <CardContent className="p-6 text-center">
              <CreditCard className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Mua bảo hiểm mới</h3>
              <p className="text-sm text-gray-600">Bắt đầu quy trình mua</p>
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <Card className="border-red-200">
          <CardContent className="p-6">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Đăng xuất
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
