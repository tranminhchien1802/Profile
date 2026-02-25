'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/ToastProvider';
import { localDB, Profile, generateId } from '@/lib/localDB';

export default function LoginPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'male' as 'male' | 'female' | 'other',
    bio: '',
  });

  useEffect(() => {
    // Check if user already has a profile saved
    const savedProfile = localStorage.getItem('dating_current_user');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setCurrentUser(profile);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      if (!formData.name || !formData.email || !formData.password || !formData.age) {
        showError('Vui lòng điền đầy đủ thông tin');
        setLoading(false);
        return;
      }

      if (parseInt(formData.age) < 18) {
        showError('Bạn phải từ 18 tuổi trở lên');
        setLoading(false);
        return;
      }

      // Check if email already exists
      const existingProfile = localDB.getProfileByEmail(formData.email);
      if (existingProfile) {
        showError('Email này đã được đăng ký');
        setLoading(false);
        return;
      }

      // Create avatar based on gender
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}&backgroundColor=${
        formData.gender === 'female' ? 'ffd5dc' : 'c0aede'
      }`;

      // Create profile
      const profile: Profile = {
        id: 'user_' + Date.now(),
        name: formData.name,
        email: formData.email,
        password: formData.password, // Lưu password để verify khi login
        age: parseInt(formData.age),
        gender: formData.gender,
        bio: formData.bio || '',
        avatar,
        createdAt: new Date().toISOString(),
      };

      // Save to LocalStorage
      localDB.saveProfile(profile);
      localStorage.setItem('dating_current_user', JSON.stringify(profile));

      showSuccess('Tạo profile thành công!');
      setTimeout(() => {
        router.push('/browse');
        router.refresh();
      }, 500);
    } catch (err: any) {
      showError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        showError('Vui lòng nhập email và mật khẩu');
        setLoading(false);
        return;
      }

      // Find profile by email
      const profile = localDB.getProfileByEmail(formData.email);
      if (!profile) {
        showError('Email chưa được đăng ký');
        setLoading(false);
        return;
      }

      // Check password
      if ((profile as any).password !== formData.password) {
        showError('Mật khẩu không đúng');
        setLoading(false);
        return;
      }

      // Save current user
      localStorage.setItem('dating_current_user', JSON.stringify(profile));
      setCurrentUser(profile);

      showSuccess('Đăng nhập thành công!');
      setTimeout(() => {
        router.push('/browse');
        router.refresh();
      }, 500);
    } catch (err: any) {
      showError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dating_current_user');
    setCurrentUser(null);
    showSuccess('Đã đăng xuất');
    router.refresh();
  };

  if (currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
            {currentUser.name.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Xin chào, {currentUser.name}!
          </h2>
          <p className="text-gray-600 mb-6">{currentUser.email}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/browse')}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-rose-600 hover:to-pink-700 transition"
            >
              💕 Khám phá profiles
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
            Dating App
          </h1>
          <p className="text-gray-600 mt-2 text-sm">Kết nối những trái tim</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <div className="flex mb-6 border-b">
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 font-medium transition-all relative ${
                !isLogin
                  ? 'text-rose-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Tạo Profile
              {!isLogin && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 font-medium transition-all relative ${
                isLogin
                  ? 'text-rose-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Đăng nhập
              {isLogin && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
              )}
            </button>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tuổi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                      placeholder="25"
                      min="18"
                      max="100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition resize-none"
                    placeholder="Sở thích, tính cách, điều bạn tìm kiếm..."
                    rows={3}
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {formData.bio.length}/500
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang xử lý...
                </>
              ) : isLogin ? 'Đăng nhập' : 'Tạo Profile'}
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  localStorage.removeItem('dating_current_user');
                  router.refresh();
                }}
                className="text-sm text-rose-600 hover:text-rose-700 transition"
              >
                Quên mật khẩu? Xóa dữ liệu và tạo lại
              </button>
            </div>
          )}
        </div>

        {/* Demo accounts */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">👥 Profiles mẫu (password: <strong className="text-rose-600">123456</strong>):</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 rounded p-2">mai.anh@example.com</div>
            <div className="bg-gray-50 rounded p-2">minh.duc@example.com</div>
            <div className="bg-gray-50 rounded p-2">hoang.yen@example.com</div>
            <div className="bg-gray-50 rounded p-2">gia.hung@example.com</div>
            <div className="bg-gray-50 rounded p-2">thu.ha@example.com</div>
            <div className="bg-gray-50 rounded p-2">quang.huy@example.com</div>
            <div className="bg-gray-50 rounded p-2">ngoc.khue@example.com</div>
            <div className="bg-gray-50 rounded p-2">tuan.kiet@example.com</div>
            <div className="bg-gray-50 rounded p-2">thao.linh@example.com</div>
            <div className="bg-gray-50 rounded p-2">bao.long@example.com</div>
          </div>
          <p className="text-xs text-gray-500 mt-3">💡 <strong>Lưu ý:</strong> Vào /seed trước để tạo các profiles này</p>
        </div>
      </div>
    </div>
  );
}
