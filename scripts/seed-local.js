// Seed data với 10 profiles mẫu vào localStorage
// Chạy file này trong browser console để tạo data mẫu

const sampleProfiles = [
  {
    name: 'Nguyễn Mai Anh',
    age: 24,
    gender: 'female',
    bio: 'Yêu thích du lịch và ẩm thực. Tìm người cùng khám phá Hà Nội 🍜',
    email: 'mai.anh@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mai.anh&backgroundColor=ffdfbf',
  },
  {
    name: 'Trần Minh Đức',
    age: 27,
    gender: 'male',
    bio: 'Developer by day, guitarist by night 🎸',
    email: 'minh.duc@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minh.duc&backgroundColor=c0aede',
  },
  {
    name: 'Lê Hoàng Yến',
    age: 23,
    gender: 'female',
    bio: 'Cat lover 🐱 | Bookworm 📚 | Coffee addict ☕',
    email: 'hoang.yen@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hoang.yen&backgroundColor=ffd5dc',
  },
  {
    name: 'Phạm Gia Hưng',
    age: 29,
    gender: 'male',
    bio: 'Entrepreneur. Love hiking and photography 📷',
    email: 'gia.hung@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gia.hung&backgroundColor=d1d4f9',
  },
  {
    name: 'Đặng Thu Hà',
    age: 25,
    gender: 'female',
    bio: 'Yoga instructor 🧘‍♀️ | Vegan | Plant mom 🌿',
    email: 'thu.ha@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thu.ha&backgroundColor=ffd5dc',
  },
  {
    name: 'Vũ Quang Huy',
    age: 26,
    gender: 'male',
    bio: 'Chef wannabe 👨‍🍳 | Football fan ⚽ | Dog person 🐕',
    email: 'quang.huy@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=quang.huy&backgroundColor=c0aede',
  },
  {
    name: 'Hồ Ngọc Khuê',
    age: 22,
    gender: 'female',
    bio: 'Art student 🎨 | Museum hopper | Vintage lover',
    email: 'ngoc.khue@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ngoc.khue&backgroundColor=ffd5dc',
  },
  {
    name: 'Lý Tuấn Kiệt',
    age: 28,
    gender: 'male',
    bio: 'Fitness enthusiast 💪 | Tech geek | Night owl 🦉',
    email: 'tuan.kiet@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tuan.kiet&backgroundColor=c0aede',
  },
  {
    name: 'Bùi Thảo Linh',
    age: 24,
    gender: 'female',
    bio: 'Marketing executive | K-pop fan 🎵 | Foodie 🍕',
    email: 'thao.linh@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thao.linh&backgroundColor=ffd5dc',
  },
  {
    name: 'Đinh Bảo Long',
    age: 30,
    gender: 'male',
    bio: 'Architect | Travel bug ✈️ | Wine enthusiast 🍷',
    email: 'bao.long@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bao.long&backgroundColor=c0aede',
  },
];

// Tạo data mẫu
function seedData() {
  const profiles = sampleProfiles.map(p => ({
    id: 'profile_' + p.email.split('@')[0],
    ...p,
    createdAt: new Date().toISOString(),
  }));

  localStorage.setItem('dating_profiles', JSON.stringify(profiles));
  localStorage.removeItem('dating_likes');
  localStorage.removeItem('dating_matches');
  localStorage.removeItem('dating_availabilities');
  localStorage.removeItem('dating_current_user');

  console.log('✅ Đã tạo 10 profiles mẫu vào localStorage!');
  console.log('📝 Password mặc khẩu: 123456');
  console.log('\nDanh sách profiles:');
  profiles.forEach(p => {
    console.log(`  - ${p.name} (${p.email})`);
  });
}

// Chạy seed
seedData();
