// Seed data với 10 profiles mẫu
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { Profile } from '@/lib/models/Profile';
import bcrypt from 'bcryptjs';

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

async function seed() {
  try {
    await connectDB();
    
    // Xóa data cũ
    await User.deleteMany({});
    await Profile.deleteMany({});
    
    console.log('🗑️  Deleted old data');

    // Tạo users và profiles
    const defaultPassword = await bcrypt.hash('123456', 10);
    
    for (const data of sampleProfiles) {
      const user = await User.create({
        email: data.email,
        password: defaultPassword,
        name: data.name,
      });

      await Profile.create({
        userId: user._id,
        ...data,
      });

      console.log(`✅ Created: ${data.name}`);
    }

    console.log('🎉 Seed completed! 10 profiles created.');
    console.log('📝 Default password: 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
