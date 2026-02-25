'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './components/ToastProvider';

export default function Home() {
  const router = useRouter();
  const { showInfo, showSuccess } = useToast();
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const savedUser = localStorage.getItem('dating_current_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dating_current_user');
    showSuccess('Đã đăng xuất');
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 mt-4 text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  const demoAccounts = [
    { email: 'mai.anh@example.com', name: 'Mai Anh', age: 24, gender: 'Nữ' },
    { email: 'minh.duc@example.com', name: 'Minh Đức', age: 27, gender: 'Nam' },
    { email: 'hoang.yen@example.com', name: 'Hoàng Yến', age: 23, gender: 'Nữ' },
    { email: 'gia.hung@example.com', name: 'Gia Hưng', age: 29, gender: 'Nam' },
    { email: 'thu.ha@example.com', name: 'Thu Hà', age: 25, gender: 'Nữ' },
    { email: 'quang.huy@example.com', name: 'Quang Huy', age: 26, gender: 'Nam' },
    { email: 'ngoc.khue@example.com', name: 'Ngọc Khuê', age: 22, gender: 'Nữ' },
    { email: 'tuan.kiet@example.com', name: 'Tuấn Kiệt', age: 28, gender: 'Nam' },
    { email: 'thao.linh@example.com', name: 'Thảo Linh', age: 24, gender: 'Nữ' },
    { email: 'bao.long@example.com', name: 'Bảo Long', age: 30, gender: 'Nam' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
              Dating App
            </h1>
            {currentUser && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-700">{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            10+ profiles đang chờ bạn
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Tìm người yêu thương
            <span className="block bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
              Kết nối trái tim
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Ứng dụng hẹn hò đơn giản, chân thành. Tạo profile, like người bạn thích, 
            và tìm lịch hẹn phù hợp khi cả hai cùng match.
          </p>

          <div className="flex items-center justify-center gap-4">
            {currentUser ? (
              <button
                onClick={() => router.push('/browse')}
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-rose-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Khám phá ngay →
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-rose-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Tạo Profile →
                </button>
                <button
                  onClick={() => router.push('/seed')}
                  className="bg-white text-rose-600 border-2 border-rose-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-rose-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  🌱 Seed Data
                </button>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
              1️⃣
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Seed Data
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Vào /seed để tạo 10 profiles mẫu. Password mặc định: 123456
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
              2️⃣
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Tạo Profile
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Đăng ký tài khoản của bạn. Profile được lưu vào LocalStorage, không mất khi reload.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
              3️⃣
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Like & Match
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Like người bạn thích. Nếu họ cũng like bạn → Match! Lên lịch hẹn ngay.
            </p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              👥 Tài khoản Demo
            </h3>
            <p className="text-gray-600">
              Đăng nhập ngay để trải nghiệm (tất cả mật khẩu: <strong className="text-rose-600">123456</strong>)
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => {
                  navigator.clipboard.writeText(account.email);
                  showInfo(`Đã copy: ${account.email}`);
                }}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-rose-50 hover:to-pink-50 border border-gray-200 hover:border-rose-300 rounded-xl p-4 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {account.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate group-hover:text-rose-600 transition">
                      {account.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {account.age} tuổi • {account.gender}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 truncate font-mono bg-white rounded px-2 py-1">
                  {account.email}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              💡 <strong>Mẹo:</strong> Click vào email để copy nhanh
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-900 font-semibold">Dating App</p>
              <p className="text-sm text-gray-500 mt-1">
                Kết nối chân thành - Yêu thương bền vững
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Built with Next.js</span>
              <span>•</span>
              <span>MongoDB</span>
              <span>•</span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
