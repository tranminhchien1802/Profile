# 🧪 Hướng dẫn Test nhanh

## ⚡ Quick Start (5 phút)

### Bước 1: Cài đặt
```bash
npm install
npm run dev
```

### Bước 2: Tạo dữ liệu mẫu
1. Mở: **http://localhost:3000/seed**
2. Đợi trang web tạo 10 profiles
3. Click **"🔐 Đăng nhập"**

### Bước 3: Tạo profile của bạn
1. URL: **http://localhost:3000/login**
2. Chọn tab **"Tạo Profile"**
3. Điền thông tin:
   - Tên: `Test User`
   - Email: `test@example.com`
   - Password: `123456`
   - Tuổi: `25`
   - Giới tính: Nam/Nữ
   - Bio: `Hello!`
4. Click **"Tạo Profile"**

### Bước 4: Like profiles
1. URL: **http://localhost:3000/browse**
2. Click **"Thích"** cho bất kỳ profile nào
3. Thấy thông báo **"Đã thích"** → Thành công!

---

## 🎯 Test Match (2 tab)

### Tab 1: User A
1. Mở tab thường
2. Đăng nhập: `mai.anh@example.com` / `123456`
3. Vào **Browse**
4. Like **"Minh Đức"**
5. Vào **Matches** → Thấy "Minh Đức" trong danh sách

### Tab 2: User B
1. Mở tab ẩn danh (Ctrl+Shift+N)
2. Đăng nhập: `minh.duc@example.com` / `123456`
3. Vào **Browse**
4. Like **"Mai Anh"**
5. **🎉 MATCH!** → Thấy thông báo
6. Vào **Matches** → Thấy "Mai Anh" trong danh sách

---

## 📅 Test lên lịch hẹn

### User A chọn giờ trước:
1. Vào **Matches**
2. Click vào match với "Minh Đức"
3. Chọn:
   - Ngày: **Ngày mai**
   - Từ: `14:00`
   - Đến: `18:00`
4. Click **"Lưu thời gian rảnh"**
5. Thấy: **"Đã lưu thời gian rảnh. Đợi Minh Đức chọn thời gian..."**

### User B chọn giờ sau:
1. Vào **Matches**
2. Click vào match với "Mai Anh"
3. Chọn **cùng ngày**, giờ **trong khoảng 14:00-18:00**:
   - Ngày: **Ngày mai** (giống User A)
   - Từ: `15:00`
   - Đến: `17:00`
4. Click **"Lưu thời gian rảnh"**
5. **✅ Kết quả:**
   ```
   ✅ Tìm thấy lịch hẹn phù hợp!
   📅 [ngày mai]
   ⏰ 15:00 - 17:00
   ```

---

## 🧪 Test các edge cases

### 1. Like chính mình (không được)
- Đăng nhập bằng tài khoản của bạn
- Vào Browse
- Profile của bạn **không hiển thị** → ✅ Đúng!

### 2. Like 2 lần (không được)
- Like 1 người lần 1 → "Đã thích"
- Like lại người đó → "Bạn đã like profile này rồi" → ✅ Đúng!

### 3. Giờ không hợp lệ
- Chọn: Từ `18:00` Đến `14:00`
- Click "Lưu" → "Giờ bắt đầu phải trước giờ kết thúc" → ✅ Đúng!

### 4. Khác ngày (không có slot)
- User A: Ngày 25/02, 14:00-18:00
- User B: Ngày 26/02, 14:00-18:00
- Kết quả: "Không tìm thấy thời gian trùng" → ✅ Đúng!

### 5. Không giao nhau (không có slot)
- User A: 09:00-12:00
- User B: 14:00-18:00
- Kết quả: "Không tìm thấy thời gian trùng" → ✅ Đúng!

---

## 📋 Checklist test

### PHẦN A - Tạo Profile
- [ ] Đăng ký thành công
- [ ] Đăng nhập thành công
- [ ] Email trùng → Báo lỗi
- [ ] Tuổi < 18 → Báo lỗi
- [ ] Profile lưu vào LocalStorage (F12 → Application → Local Storage)

### PHẦN B - Like & Match
- [ ] Browse thấy profiles
- [ ] Like thành công
- [ ] Không thể like 2 lần
- [ ] Không thể like chính mình
- [ ] Match khi like 2 chiều
- [ ] Thông báo match hiện lên

### PHẦN C - Lên lịch hẹn
- [ ] Chọn được availability
- [ ] Validation giờ (start < end)
- [ ] Tìm thấy slot trùng
- [ ] Hiển thị kết quả đúng
- [ ] Cập nhật match status

### UX/UI
- [ ] Loading skeletons hiện khi chờ data
- [ ] Toast notifications hiện đúng
- [ ] Empty states hiển thị khi không có data
- [ ] Form validation hoạt động
- [ ] Responsive trên mobile

---

## 🔍 Debug

### Kiểm tra LocalStorage
Mở Console (F12) và gõ:
```javascript
// Xem tất cả profiles
JSON.parse(localStorage.getItem('dating_profiles'))

// Xem tất cả likes
JSON.parse(localStorage.getItem('dating_likes'))

// Xem tất cả matches
JSON.parse(localStorage.getItem('dating_matches'))

// Xem user đang đăng nhập
JSON.parse(localStorage.getItem('dating_current_user'))
```

### Reset toàn bộ data
```javascript
localStorage.clear()
location.reload()
```

---

## 📞 Nếu gặp vấn đề

1. **Không thấy profiles?**
   - Vào `/seed` để tạo data mẫu

2. **Không đăng nhập được?**
   - Kiểm tra password: `123456`
   - Xóa localStorage và seed lại

3. **Không có match?**
   - Phải like nhau cả 2 chiều
   - Mở 2 tab để test

4. **Không tìm thấy slot?**
   - Chọn cùng ngày
   - Chọn giờ giao nhau

---

**Chúc bạn test vui vẻ! 🚀**
