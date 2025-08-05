# Khắc phục lỗi kết nối Expo với máy ảo

## Các lỗi thường gặp và cách khắc phục

### 1. Lỗi "Unable to connect to development server"

**Nguyên nhân:** Máy ảo không thể kết nối đến development server

**Cách khắc phục:**

#### Cách 1: Sử dụng Tunnel
```bash
npm run start:tunnel
```

#### Cách 2: Sử dụng LAN
```bash
npm run start:lan
```

#### Cách 3: Kiểm tra IP address
```bash
# Trên Windows
ipconfig

# Trên macOS/Linux
ifconfig
```

### 2. Lỗi "Metro bundler has encountered an error"

**Cách khắc phục:**
```bash
# Xóa cache
npm run clear

# Reset hoàn toàn
npm run reset
```

### 3. Lỗi "Network request failed"

**Cách khắc phục:**

#### Bước 1: Kiểm tra firewall
- Tắt Windows Defender Firewall tạm thời
- Hoặc thêm exception cho port 3000

#### Bước 2: Kiểm tra antivirus
- Tắt antivirus tạm thời
- Hoặc thêm exception cho thư mục project

#### Bước 3: Kiểm tra network adapter
- Đảm bảo máy ảo và host cùng network

### 4. Lỗi "Expo Go app not found"

**Cách khắc phục:**

#### Bước 1: Cài đặt Expo Go
- Tải Expo Go từ Google Play Store
- Hoặc từ App Store (iOS)

#### Bước 2: Kiểm tra version
- Đảm bảo Expo Go version tương thích với Expo SDK

### 5. Lỗi "QR code not working"

**Cách khắc phục:**

#### Bước 1: Sử dụng URL trực tiếp
- Copy URL từ terminal
- Paste vào Expo Go app

#### Bước 2: Sử dụng tunnel
```bash
npm run start:tunnel
```

### 6. Lỗi "Development build required"

**Cách khắc phục:**

#### Bước 1: Build development version
```bash
npx expo install expo-dev-client
```

#### Bước 2: Tạo development build
```bash
npx expo run:android
```

## Các lệnh hữu ích

### Khởi động với các mode khác nhau:
```bash
# Normal mode
npm start

# Tunnel mode (khuyến nghị cho máy ảo)
npm run start:tunnel

# LAN mode
npm run start:lan

# Web mode
npm run web
```

### Xóa cache:
```bash
# Xóa cache đơn giản
npm run clear

# Reset hoàn toàn
npm run reset
```

### Kiểm tra kết nối:
```bash
# Kiểm tra port 3000
netstat -an | findstr :3000

# Kiểm tra process
tasklist | findstr node
```

## Cấu hình máy ảo

### Android Studio AVD:
1. Mở AVD Manager
2. Edit AVD
3. Advanced Settings
4. Đảm bảo "Use Host GPU" được bật
5. Network: "NAT"

### Genymotion:
1. Settings > Network
2. Adapter: "NAT"
3. Đảm bảo "Use Host Network" được bật

## Kiểm tra kết nối

### Bước 1: Kiểm tra IP
```bash
# Trên host machine
ipconfig

# Trên máy ảo
adb shell ip addr show
```

### Bước 2: Test ping
```bash
# Từ máy ảo ping host
ping [host-ip]

# Từ host ping máy ảo
ping [vm-ip]
```

### Bước 3: Test port
```bash
# Kiểm tra port 3000
telnet [host-ip] 3000
```

## Lưu ý quan trọng

1. **Firewall:** Đảm bảo port 3000 được mở
2. **Antivirus:** Tạm thời tắt hoặc thêm exception
3. **Network:** Host và VM phải cùng network
4. **Expo Go:** Cài đặt version mới nhất
5. **Cache:** Xóa cache nếu gặp lỗi
6. **Tunnel:** Sử dụng tunnel mode cho máy ảo 