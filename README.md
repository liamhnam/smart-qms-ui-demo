# 🚀 GoodM Smart QMS — NextGen UI/UX Showcase & Client Demo

> **Bộ giao diện Demo UI/UX Thế hệ mới cho Hệ thống Lấy số và Xếp hàng Thông minh (Queue Management System - QMS)**
> 
> Thiết kế chuẩn cho Trung tâm Phục vụ Hành chính công (Một cửa điện tử), Bệnh viện, Ngân hàng, và Trung tâm dịch vụ khách hàng.
> **100% Client-side • Dữ liệu Mock thông minh • Không cần Backend • Tích hợp âm thanh gọi số thực qua Web Audio API**.

---

## 🌟 Tính năng nổi bật & Các màn hình trong Demo

Hệ thống bao gồm đầy đủ **6 phân hệ giao diện chuyên biệt**, được liên kết và đồng bộ trạng thái thời gian thực thông qua Reactive State Engine:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOATING DEMO MASTER CONTROL BAR                         │
│  [Tổng quan] [Kiosk Lấy số] [Màn hình TV 7:3] [Bàn gọi số] [Bảng Quầy] [Tablet Đánh giá]   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
        ┌──────────────┬───────────────┼──────────────┬──────────────┐
        ▼              ▼               ▼              ▼              ▼
   🏛️ Dashboard    🖨️ Kiosk      🖥️ TV 7:3      👨‍💼 Teller     ⭐ Tablet
    Điều hành      Lấy số        Phòng chờ      Gọi số        Đánh giá & QR
```

### 1. 🏛️ Trung tâm Giám sát & Điều hành (`/dashboard` & `/`)
- **KPIs Trực quan:** Tổng số vé phát hành trong ngày, số công dân đang đợi, số quầy đang phục vụ, tỷ lệ giải quyết đúng hẹn, thời gian chờ trung bình, chỉ số hài lòng.
- **Biểu đồ lưu lượng:** Phân tích lưu lượng lấy số theo từng khung giờ cao điểm (07:30 - 16:30) bằng visualizer thuần CSS/SVG mượt mà.
- **Tỷ trọng lĩnh vực:** Phân bố cơ cấu thủ tục (Đất đai, Tư pháp, Đăng ký kinh doanh, Trả kết quả).
- **Bảng hiệu năng từng quầy:** Thống kê sản lượng giải quyết và điểm số đánh giá sao của từng cán bộ.
- **Nhật ký thời gian thực:** Stream sự kiện trực tiếp khi có vé mới, gọi số, hoàn tất.

### 2. 🖨️ Kiosk Cảm ứng Tự phục vụ Lấy số (`/kiosk`)
- **Giao diện Touchscreen hiện đại:** Tối ưu cho màn hình cảm ứng kích thước lớn (đứng hoặc ngang), phím bấm to, nhận diện màu sắc theo lĩnh vực.
- **Lấy số thường:** Chạm chọn lĩnh vực để nhận vé ngay trong 1 chạm.
- **Quét CCCD gắn chíp:** Mô phỏng đọc thẻ chíp định danh điện tử với tia laser quét, tự động trích xuất Họ tên, Số CCCD, Năm sinh, Địa chỉ.
- **Check-in Lịch hẹn Online:** Quét mã QR đặt trước từ Zalo Mini App / Cổng Dịch vụ công để nhận số ưu tiên.
- **Chế độ Ưu tiên:** Dành cho người cao tuổi, phụ nữ có con nhỏ, người khuyết tật.
- **Mô phỏng In Vé Nhiệt:** Popup phiếu lấy số chân thực với hiệu ứng in, mã QR tra cứu số thứ tự trên di động, số người đang đợi và thời gian dự kiến.

### 3. 🖥️ Màn hình LED / TV Điều tiết Phòng chờ (`/display`)
- **Bố cục chuẩn 7:3:** 70% bên trái hiển thị danh sách quầy đang gọi số lớn nổi bật; 30% bên phải hiển thị video tuyên truyền, dự báo thời tiết, thông báo hành chính.
- **Hỗ trợ chuyển đổi nhanh:** Bố cục 7:3, Bố cục 5:5, hoặc Toàn màn hình (Fullscreen).
- **Âm thanh Chuông gọi số:** Bộ tổng hợp âm thanh **Ding-Dong 2 nốt** qua **Web Audio API** nguyên bản (không phụ thuộc file mp3 ngoài, không lo lỗi 404, chạy mượt trên mọi thiết bị).
- **Đọc loa phát thanh tiếng Việt:** Tự động đọc bằng Text-To-Speech: *"Xin mời số thứ tự A-102 đến Quầy số 01"*.
- **Danh sách sắp đến lượt & Bản tin Marquee:** Chạy chữ thông báo liên tục ở cạnh dưới màn hình.

### 4. 👨‍💼 Bàn điều khiển Gọi số tại Quầy của Cán bộ (`/teller`)
- **Khu vực phục vụ trung tâm:** Hiển thị số thứ tự to rõ, họ tên công dân, số CCCD, phân loại ưu tiên, và **đồng hồ đếm thời lượng phục vụ** theo giây.
- **Phím chức năng tác nghiệp:**
  - 🟢 **GỌI TIẾP THEO:** Lấy vé kế tiếp trong hàng đợi (ưu tiên khách hẹn trước/người già), kích hoạt chuông TV.
  - 🔊 **GỌI LẠI:** Phát lại âm thanh chuông và thông báo gọi số.
  - ✅ **HOÀN THÀNH:** Kết thúc lượt phục vụ và tự động gửi phiếu đánh giá sang máy tính bảng tại quầy.
  - ⏭️ **BỎ QUA / VẮNG MẶT:** Đưa vé vào danh sách vắng mặt.
  - 🔄 **CHUYỂN QUẦY:** Chuyển công dân sang quầy nghiệp vụ khác (tự động chuyển thành diện ưu tiên).
  - ➕ **CẤP VÉ TẠI QUẦY:** Cấp trực tiếp vé cho khách vãng lai.
- **Quản lý hàng đợi theo Tabs:** Danh sách đang chờ, Danh sách đã bỏ qua, Lịch sử phục vụ trong ca.
- **Trạng thái ca làm việc:** Nhận ca, Tạm nghỉ, Kết thúc ca.

### 5. 🏷️ Bảng Thông tin Điện tử tại Quầy (`/counter-sign`)
- Bảng hiển thị kỹ thuật số đặt trước từng quầy giao dịch.
- Hiển thị thông tin Cán bộ thụ lý (Ảnh đại diện, Họ tên, Chức vụ, Điểm đánh giá sao).
- Hiển thị số thứ tự đang phục vụ cực to (nhìn rõ từ khoảng cách 10m).
- Trạng thái quầy: Đang phục vụ, Sẵn sàng đón tiếp, Tạm nghỉ.

### 6. ⭐ Máy tính bảng Khảo sát Ý kiến & Thanh toán QR (`/rating`)
- Tablet cảm ứng đặt trên bàn giao tiếp diện đối diện công dân.
- **5 Mức độ cảm xúc Emoji:** 🤩 Rất hài lòng, 😊 Hài lòng, 😐 Bình thường, 🙁 Chưa hài lòng, 😡 Rất không hài lòng.
- **Bộ nhãn phản hồi nhanh:** Thái độ niềm nở, Nghiệp vụ thành thạo, Thủ tục nhanh gọn, v.v.
- **Hiệu ứng pháo hoa Confetti:** Bắn pháo hoa rực rỡ khi công dân gửi đánh giá thành công.
- **Tích hợp VietQR:** Mô phỏng quét mã QR thanh toán lệ phí hành chính (30.000 VNĐ) nhanh chóng.

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mục đích |
|---|---|
| **Next.js 15 (App Router)** | Framework chuẩn hiện đại, tương thích 100% với Next.js 15 của dự án gốc |
| **React 19 / TypeScript** | Đảm bảo type-safe và tương thích phiên bản React của dự án gốc |
| **Tailwind CSS** | Styling utility-first hiện đại, giao diện Dark Slate cao cấp |
| **Lucide Icons** | Bộ icon vector sắc nét cho y tế, hành chính, kiosk, điều khiển |
| **Web Audio API** | Tự sinh âm thanh chuông Ding-Dong bằng hàm toán học dao động âm |
| **Canvas Confetti** | Hiệu ứng chúc mừng tương tác trên màn hình đánh giá |
| **LocalStorage State Store** | Lưu trữ và đồng bộ trạng thái liên tục giữa các tab trình duyệt |

---

## 🚀 Hướng dẫn Cài đặt & Chạy cục bộ

```bash
# 1. Cài đặt thư viện
npm install

# 2. Chạy môi trường phát triển (Port 3000)
npm run dev

# 3. Mở trình duyệt
http://localhost:3000
```

---

## 📖 Hướng dẫn Trình chiếu Demo cho Khách hàng

1. Mở màn hình **Màn hình LED TV** (`/display`) trên 1 tab hoặc màn hình thứ 2.
2. Mở màn hình **Kiosk Lấy số** (`/kiosk`) để khách hàng trải nghiệm chạm màn hình lấy số hoặc bấm **"Quét CCCD gắn chíp"**.
3. Chuyển sang màn hình **Bàn gọi số Cán bộ** (`/teller`) và bấm nút **"GỌI TIẾP THEO"**.
4. Lắng nghe âm thanh chuông **Ding-dong** phát ra và quan sát số vé vừa gọi sáng bừng trên màn hình LED TV!
5. Bấm **"HOÀN THÀNH"** tại bàn gọi số và chuyển sang **Tablet Đánh giá** (`/rating`) để khách chấm 5 sao và nhận pháo hoa ăn mừng!
6. Thanh **Floating Demo Bar** ở trên cùng cho phép chuyển đổi tức thì giữa các màn hình bất cứ lúc nào.

---

## 🔄 Hướng dẫn Tích hợp lại vào Dự án gốc (`qms/onprem/frontend`)

Xem chi tiết trong tài liệu [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md).

Mọi component đều được thiết kế dưới dạng React Modular Components độc lập, sử dụng Tailwind CSS chuẩn. Các kỹ sư có thể tái sử dụng ngay:
- `src/components/kiosk/*` ➔ thay thế giao diện `/lay-so` cũ.
- `src/app/display/page.tsx` ➔ nâng cấp cho `/man-hinh-dieu-tiet-chung`.
- `src/app/teller/page.tsx` ➔ nâng cấp cho `/user/dieu-khien-quay`.
- `src/app/rating/page.tsx` ➔ nâng cấp cho `/danh-gia/[counterId]`.
- `src/utils/audio.ts` ➔ thay thế file audio wav/mp3 tĩnh bằng Web Audio API synthesizer.

---

## 🛡️ Cam kết Bản quyền & Bảo mật

- Repository này chỉ chứa **mã nguồn UI/UX Demo** và **dữ liệu Mock giả lập**.
- **KHÔNG** chứa bất kỳ mã nguồn backend độc quyền, token bảo mật, chứng chỉ số Step-CA, API keys, hoặc dữ liệu công dân thực tế từ hệ thống gốc của GoodM.
