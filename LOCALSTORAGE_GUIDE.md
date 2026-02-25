# Dating App - Đã cập nhật LocalStorage

Toàn bộ dữ liệu được lưu vào **LocalStorage** của trình duyệt.

## ✅ Cách sử dụng:

### 1. Tạo dữ liệu mẫu (10 profiles)
👉 **http://localhost:3000/seed**

- Click nút hoặc trang sẽ tự động seed
- 10 profiles với password `123456`

### 2. Tạo profile của bạn
👉 **http://localhost:3000/login**

- Chọn tab "Tạo Profile"
- Điền thông tin: Tên, Email, Mật khẩu, Tuổi, Giới tính, Bio
- Profile được lưu vào LocalStorage

### 3. Like profiles
👉 **http://localhost:3000/browse**

- Click "Thích" để like
- Like được lưu vào LocalStorage

### 4. Test Match (2 tab)
**Tab 1:** `mai.anh@example.com` / `123456` → Like "Minh Đức"

**Tab 2 (Incognito):** `minh.duc@example.com` / `123456` → Like "Mai Anh"

→ **Match!** 🎉

### 5. Lên lịch hẹn
👉 **http://localhost:3000/matches**

- Chọn match
- Chọn ngày/giờ rảnh
- Hệ thống tự tìm slot trùng

## 📦 Dữ liệu LocalStorage:

| Key | Mô tả |
|-----|-------|
| `dating_profiles` | Danh sách profiles |
| `dating_likes` | Danh sách likes |
| `dating_matches` | Danh sách matches |
| `dating_availabilities` | Thời gian rảnh |
| `dating_current_user` | User đang đăng nhập |

## 🔄 Reset toàn bộ:

```javascript
localStorage.clear();
```

Hoặc vào **http://localhost:3000/seed** và click "Seed lại"
