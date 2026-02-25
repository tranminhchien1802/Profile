# 🚀 Hướng dẫn test nhanh Dating App

## Cách 1: Test với MongoDB Atlas (Recommended)

### Bước 1: Tạo MongoDB Atlas Free Account
1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Đăng ký (có thể dùng Google login cho nhanh)
3. Xác thực email

### Bước 2: Tạo Cluster
1. Click "Build a Database"
2. Chọn **M0 FREE** tier
3. Chọn region (Singapore hoặc Tokyo cho gần VN)
4. Click "Create" (đợi 2-3 phút)

### Bước 3: Tạo User
1. Vào **Database Access** (menu trái)
2. "Add New Database User"
3. Nhập username/password (ví dụ: `testuser` / `Test123456`)
4. Permission: "Read and write to any database"
5. Click "Add User"

### Bước 4: Whitelist IP
1. Vào **Network Access** (menu trái)
2. "Add IP Address"
3. "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

### Bước 5: Lấy Connection String
1. Vào **Database** (menu trái)
2. Click "Connect" ở cluster
3. "Connect your application"
4. Copy connection string
5. Replace `<password>` bằng password bạn tạo
6. Thêm tên database: `mini-dating-app`

Ví dụ: `mongodb+srv://testuser:Test123456@cluster0.xxxxx.mongodb.net/mini-dating-app`

### Bước 6: Chạy app
```bash
cd D:\mini-dating-app

# Tạo file .env.local
notepad .env.local

# Dán vào:
MONGODB_URI=mongodb+srv://testuser:Test123456@cluster0.xxxxx.mongodb.net/mini-dating-app
JWT_SECRET=my-super-secret-key-123456

# Lưu file (Ctrl+S)

# Seed data
npm run seed

# Chạy app
npm run dev
```

### Bước 7: Truy cập
Mở trình duyệt: http://localhost:3000

---

## Cách 2: Test với MongoDB Local

### Cài đặt MongoDB
1. Tải: https://www.mongodb.com/try/download/community
2. Cài đặt với default settings
3. Chạy MongoDB:
```bash
# Mở Command Prompt
mongod
```

### Chạy app
```bash
cd D:\mini-dating-app

# Tạo .env.local
echo MONGODB_URI=mongodb://localhost:27017/mini-dating-app > .env.local
echo JWT_SECRET=my-super-secret-key-123456 >> .env.local

# Seed data
npm run seed

# Chạy app
npm run dev
```

---

## 🧪 Test Flow

Sau khi app chạy, test các tính năng:

### Test 1: Đăng nhập
- Email: `mai.anh@example.com`
- Password: `123456`

### Test 2: Like và Match
1. Mở tab thường: Login `mai.anh@example.com` / `123456`
2. Mở tab Incognito: Login `minh.duc@example.com` / `123456`
3. Tab 1: Like "Minh Đức"
4. Tab 2: Like "Mai Anh" → Match!

### Test 3: Chọn lịch hẹn
1. Vào Matches
2. Chọn match với "Minh Đức"
3. Chọn ngày (bất kỳ ngày nào trong 3 tuần tới)
4. Chọn giờ: 14:00 - 16:00
5. Tab kia cũng chọn → Hệ thống tìm slot trùng

---

## ❌ Troubleshooting

### Lỗi: "MongoNetworkError"
- Kiểm tra connection string đúng
- Kiểm tra IP đã whitelist chưa
- Đợi 1-2 phút sau khi tạo cluster

### Lỗi: "seed failed"
- Xóa database cũ trên Atlas và chạy lại
- Kiểm tra .env.local có đúng không

### App chạy nhưng không có profiles
```bash
npm run seed
```

---

**📝 Note:** App đang chạy tại http://localhost:3000
