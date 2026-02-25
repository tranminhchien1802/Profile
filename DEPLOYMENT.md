# 🚀 Hướng dẫn Deploy Dating App lên Vercel

## Bước 1: Chuẩn bị MongoDB Atlas (Cloud Database)

### 1.1 Tạo MongoDB Atlas Account
1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Đăng ký account miễn phí
3. Xác thực email

### 1.2 Tạo Cluster
1. Click **"Build a Database"**
2. Chọn **M0 (FREE)** - Shared RAM, 512MB storage
3. Chọn cloud provider (AWS/GCP/Azure) và region gần bạn nhất
4. Click **"Create Cluster"**

### 1.3 Tạo Database User
1. Vào **Database Access** (sidebar trái)
2. Click **"Add New Database User"**
3. Chọn **Password** authentication
4. Nhập username và password (lưu lại!)
5. Permission: **Read and write to any database**
6. Click **"Add User"**

### 1.4 Whitelist IP
1. Vào **Network Access** (sidebar trái)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.5 Lấy Connection String
1. Vào **Database** (sidebar trái)
2. Click **"Connect"** ở cluster của bạn
3. Chọn **"Connect your application"**
4. Copy connection string, ví dụ:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/
   ```
5. Replace `<password>` với password bạn đã tạo
6. Thêm tên database: `mini-dating-app`
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mini-dating-app
   ```

## Bước 2: Push code lên GitHub

### 2.1 Tạo repository trên GitHub
1. Vào https://github.com/new
2. Tạo repository mới (public hoặc private)
3. Không cần khởi tạo (không tick các option)

### 2.2 Push code
```bash
cd D:\mini-dating-app

# Initialize git
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit: Dating App with MongoDB"

# Đổi tên branch
git branch -M main

# Add remote (thay <your-username> và <repo-name>)
git remote add origin https://github.com/<your-username>/<repo-name>.git

# Push
git push -u origin main
```

## Bước 3: Deploy lên Vercel

### Cách A: Deploy trực tiếp từ Vercel Dashboard

1. **Truy cập Vercel**
   - Vào https://vercel.com
   - Đăng nhập bằng GitHub

2. **Import Project**
   - Click **"Add New Project"**
   - Chọn **"Import Git Repository"**
   - Chọn repository bạn vừa push

3. **Cấu hình Environment Variables**
   - Click **"Environment Variables"**
   - Add các variables sau:
   
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mini-dating-app` |
   | `JWT_SECRET` | Random string (ví dụ: `my-super-secret-key-123456`) |

4. **Deploy**
   - Click **"Deploy"**
   - Đợi build hoàn thành (~1-2 phút)

### Cách B: Deploy bằng Vercel CLI

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (chọn Yes cho các câu hỏi)
vercel

# Cấu hình Environment Variables
# Vercel sẽ hỏi, hoặc vào dashboard để add

# Deploy production
vercel --prod
```

## Bước 4: Seed data sau khi deploy

Sau khi deploy xong, cần chạy seed để có 10 profiles mẫu:

### Cách A: Chạy seed từ local (khuyến nghị)
```bash
# Copy .env.local.example thành .env.local
# Sửa MONGODB_URI thành MongoDB Atlas connection string

npm run seed
```

### Cách B: Deploy tự động seed
Thêm vào `package.json`:
```json
{
  "scripts": {
    "postinstall": "npm run seed"
  }
}
```

## Bước 5: Kiểm tra

1. Truy cập URL Vercel cung cấp (ví dụ: `https://your-app.vercel.app`)
2. Đăng nhập với 1 trong 10 accounts demo:
   - Email: `mai.anh@example.com`
   - Password: `123456`

## 🔧 Troubleshooting

### Lỗi: "MongoDB connection timeout"
- Kiểm tra Network Access đã whitelist 0.0.0.0/0
- Kiểm tra username/password đúng
- Đợi 1-2 phút sau khi tạo cluster

### Lỗi: "Module not found"
- Chạy `npm install` trước khi deploy
- Kiểm tra `package.json` có đủ dependencies

### Lỗi: "JWT_SECRET is required"
- Thêm Environment Variable trên Vercel Dashboard
- Restart deployment sau khi add variable

### App chạy nhưng không có profiles
- Chạy `npm run seed` để tạo data mẫu
- Kiểm tra MongoDB Atlas → Collections → mini-dating-app

## 📊 Monitoring

### Vercel Analytics
- Vào Vercel Dashboard → Project → Analytics
- Xem lượt truy cập, performance

### MongoDB Atlas Monitoring
- Vào Atlas → Clusters → Metrics
- Xem connections, operations

## 💡 Tips

1. **Custom Domain**: Vào Vercel → Project Settings → Domains
2. **Auto Deploy**: Mỗi lần push lên GitHub, Vercel tự deploy
3. **Preview Deployments**: Pull requests sẽ có preview URL riêng
4. **Rollback**: Có thể rollback về version trước trong Deployments tab

---

**Chúc mừng! App của bạn đã live! 🎉**
