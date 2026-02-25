'use client';

import { useEffect, useState } from 'react';
import { localDB, Profile, generateId } from '@/lib/localDB';

const sampleProfiles = [
  {
    name: 'Nguyễn Mai Anh',
    age: 24,
    gender: 'female' as const,
    bio: 'Yêu thích du lịch và ẩm thực. Tìm người cùng khám phá Hà Nội 🍜',
    email: 'mai.anh@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mai.anh&backgroundColor=ffdfbf',
  },
  {
    name: 'Trần Minh Đức',
    age: 27,
    gender: 'male' as const,
    bio: 'Developer by day, guitarist by night 🎸',
    email: 'minh.duc@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minh.duc&backgroundColor=c0aede',
  },
  {
    name: 'Lê Hoàng Yến',
    age: 23,
    gender: 'female' as const,
    bio: 'Cat lover 🐱 | Bookworm 📚 | Coffee addict ☕',
    email: 'hoang.yen@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hoang.yen&backgroundColor=ffd5dc',
  },
  {
    name: 'Phạm Gia Hưng',
    age: 29,
    gender: 'male' as const,
    bio: 'Entrepreneur. Love hiking and photography 📷',
    email: 'gia.hung@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gia.hung&backgroundColor=d1d4f9',
  },
  {
    name: 'Đặng Thu Hà',
    age: 25,
    gender: 'female' as const,
    bio: 'Yoga instructor 🧘‍♀️ | Vegan | Plant mom 🌿',
    email: 'thu.ha@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thu.ha&backgroundColor=ffd5dc',
  },
  {
    name: 'Vũ Quang Huy',
    age: 26,
    gender: 'male' as const,
    bio: 'Chef wannabe 👨‍🍳 | Football fan ⚽ | Dog person 🐕',
    email: 'quang.huy@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=quang.huy&backgroundColor=c0aede',
  },
  {
    name: 'Hồ Ngọc Khuê',
    age: 22,
    gender: 'female' as const,
    bio: 'Art student 🎨 | Museum hopper | Vintage lover',
    email: 'ngoc.khue@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ngoc.khue&backgroundColor=ffd5dc',
  },
  {
    name: 'Lý Tuấn Kiệt',
    age: 28,
    gender: 'male' as const,
    bio: 'Fitness enthusiast 💪 | Tech geek | Night owl 🦉',
    email: 'tuan.kiet@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tuan.kiet&backgroundColor=c0aede',
  },
  {
    name: 'Bùi Thảo Linh',
    age: 24,
    gender: 'female' as const,
    bio: 'Marketing executive | K-pop fan 🎵 | Foodie 🍕',
    email: 'thao.linh@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thao.linh&backgroundColor=ffd5dc',
  },
  {
    name: 'Đinh Bảo Long',
    age: 30,
    gender: 'male' as const,
    bio: 'Architect | Travel bug ✈️ | Wine enthusiast 🍷',
    email: 'bao.long@example.com',
    password: '123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bao.long&backgroundColor=c0aede',
  },
];

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'seeding' | 'done'>('idle');
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Auto-seed on page load
    handleSeed();
  }, []);

  useEffect(() => {
    // Count existing profiles
    const profiles = localDB.getProfiles();
    setCount(profiles.length);
  }, [status]);

  const handleSeed = () => {
    setStatus('seeding');
    setMessage('Đang tạo profiles mẫu...');

    try {
      // Clear old data
      localDB.clear();

      // Create profiles with password
      sampleProfiles.forEach((data) => {
        const profile: Profile = {
          id: 'user_' + data.email,
          password: data.password,
          name: data.name,
          email: data.email,
          age: data.age,
          gender: data.gender,
          bio: data.bio,
          avatar: data.avatar,
          createdAt: new Date().toISOString(),
        };
        localDB.saveProfile(profile);
      });

      setStatus('done');
      setMessage(`✅ Đã tạo ${sampleProfiles.length} profiles thành công!`);
    } catch (error) {
      setStatus('idle');
      setMessage('❌ Có lỗi xảy ra khi tạo profiles');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Seed Data
        </h1>
        <p className="text-gray-600 mb-6">
          Tạo 10 profiles mẫu vào LocalStorage
        </p>

        {status === 'seeding' && (
          <div className="flex items-center justify-center gap-3 text-rose-600">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="font-medium">{message}</span>
          </div>
        )}

        {status === 'done' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 py-3 rounded-lg font-medium">
              {message}
            </div>
            <div className="bg-blue-50 border border-blue-200 text-blue-800 py-2 rounded-lg text-sm">
              📊 Hiện có <strong>{count}</strong> profiles trong hệ thống
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSeed}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                🔄 Seed lại
              </button>
              <a
                href="/login"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition font-medium"
              >
                🔐 Đăng nhập
              </a>
            </div>
          </div>
        )}

        {status === 'idle' && (
          <button
            onClick={handleSeed}
            className="w-full px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition font-medium"
          >
            🌱 Tạo profiles mẫu
          </button>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>Mật khẩu mặc định: <strong>123456</strong></p>
        </div>
      </div>
    </div>
  );
}
