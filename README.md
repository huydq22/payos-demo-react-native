# PayOS React Native Demo

Ứng dụng demo tích hợp PayOS payment gateway với React Native.

## Cấu hình

### Step 1: Tạo file .env và cấu hình API
Tạo file `.env` trong thư mục gốc với nội dung:
```
SERVER_URL=https://your-payos-server.com
VIETQR_URL=https://api.vietqr.io/v2/banks
```

**Lưu ý:** Thay `https://your-payos-server.com` bằng URL server PayOS thực tế của bạn.

### Step 2: Cài đặt dependencies
```bash
npm install
```
hoặc
```bash
yarn install
```

### Step 3: Chạy ứng dụng
```bash
npx expo run:android
```

Nếu chưa cài expo globally:
```bash
npm install -g expo
```

## Tính năng

### 1. Trang Sản phẩm (ProductScreen)
- Hiển thị danh sách sản phẩm
- Khi chọn sản phẩm, tự động tạo thanh toán qua PayOS API
- Chuyển sang trang thanh toán với thông tin sản phẩm

### 2. Trang Thanh toán (PaymentScreen)
- Hiển thị thông tin thanh toán từ PayOS
- QR code và thông tin chuyển khoản
- Xử lý kết quả thanh toán

### 3. API PayOS
Đã tích hợp các endpoint PayOS:
- `POST /v1/payos/create-simple-payment` - Tạo thanh toán đơn giản
- `POST /v1/payos/create-payment` - Tạo thanh toán đầy đủ
- `GET /v1/payos/{orderCode}` - Lấy thông tin thanh toán
- `PUT /v1/payos/{orderCode}/cancel` - Hủy thanh toán
- `POST /v1/payos/confirm-webhook` - Xác nhận webhook

## Cấu trúc dự án

```
src/
├── api/
│   └── Api.ts          # PayOS API functions
├── components/          # React components
├── screens/
│   ├── ProductScreen.tsx    # Trang sản phẩm
│   ├── PaymentScreen.tsx    # Trang thanh toán
│   └── ResultScreen.tsx     # Trang kết quả
└── types/
    └── types.ts        # TypeScript types
```