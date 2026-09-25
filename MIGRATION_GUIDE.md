# 📘 Hướng dẫn Chuyển giao & Tích hợp UI sang Dự án Gốc (`onprem/frontend`)

Tài liệu này hướng dẫn đội ngũ kỹ sư GoodM cách chuyển giao các màn hình và component đã được re-design từ repository demo này vào repo chính `qms/onprem/frontend`.

---

## 1. Bản đồ ánh xạ Màn hình (Route Mapping)

| Màn hình Demo (Mới) | Tuyến đường Demo | Đường dẫn trong `onprem/frontend` | Hook / API Tương ứng trong dự án gốc |
|---|---|---|---|
| **Citizen Kiosk** | `/kiosk` | `src/app/lay-so/page.tsx` | `useOrganizationData()`, `apiClient.post('/api/v1/tickets')` |
| **TV Điều tiết 7:3** | `/display` | `src/app/man-hinh-dieu-tiet/7-3/[id]/page.tsx` | `SevenThreeLayout`, Socket.io `serving-tickets` event |
| **Bàn gọi số Cán bộ** | `/teller` | `src/app/user/dieu-khien-quay/page.tsx` | `useTicketOperationsDirect()`, `useCounterOperations()` |
| **Bảng hiển thị quầy** | `/counter-sign` | `src/app/thong-tin-quay/[counterId]/page.tsx` | `apiClient.get('/api/v1/counters/:id')` |
| **Tablet Đánh giá** | `/rating` | `src/app/danh-gia/[counterId]/page.tsx` | `useSubmitEvaluate()`, `useQuestionnaireById()` |
| **Executive Dashboard**| `/dashboard` | `src/app/admin/dashboard/page.tsx` | `useDashboardReport()` |

---

## 2. Các bước tích hợp thành phần

### Bước 1: Chuông gọi số Web Audio API
- **Vấn đề ở dự án gốc:** Thường cần tải file âm thanh mp3 hoặc powershell script (`PlayTicketAudio.ps1`) gây chậm trễ hoặc lỗi đường dẫn trên một số client Android/Kiosk.
- **Giải pháp:** Copy file [`src/utils/audio.ts`](./src/utils/audio.ts) vào `onprem/frontend/src/utils/audio.ts`.
- **Sử dụng:**
  ```typescript
  import { announceTicketCalling } from '@/utils/audio';

  // Khi cán bộ gọi số:
  announceTicketCalling('A-102', 'Quầy số 01');
  ```

### Bước 2: Tích hợp Giao diện Kiosk Lấy số
- Thay vì sử dụng PrimeReact Card và custom CSS module phức tạp, sao chép cấu trúc layout từ [`src/app/kiosk/page.tsx`](./src/app/kiosk/page.tsx).
- Thay thế hàm `issueTicket(...)` mock bằng hàm gọi API thực tế:
  ```typescript
  const response = await apiClient.post('/api/v1/tickets', {
    categoryId: selectedCategory.id,
    citizenName: citizen.name,
    isPriority: isPriorityMode,
  });
  ```
- Sử dụng component [`TicketReceiptModal.tsx`](./src/components/kiosk/TicketReceiptModal.tsx) để hiển thị và kích hoạt lệnh in `window.print()` hoặc gửi sang máy in ESC/POS USB.

### Bước 3: Tích hợp Màn hình TV 7:3
- Sao chép khối render hiển thị số gọi từ [`src/app/display/page.tsx`](./src/app/display/page.tsx).
- Kết nối với Socket.io hiện có:
  ```typescript
  socket.on('serving-tickets', (data) => {
    // Cập nhật servingTicket vào state
  });
  ```

### Bước 4: Tích hợp Bàn điều khiển Quầy (Teller Console)
- Bố cục 2 cột (Khu vực phục vụ lớn ở giữa + Hàng đợi phân tab bên phải) từ [`src/app/teller/page.tsx`](./src/app/teller/page.tsx) thay thế cho `src/app/user/dieu-khien-quay/page.tsx`.
- Gắn các handler có sẵn của `useTicketOperationsDirect()`:
  - `handleCallNext` ➔ `callTicket()`
  - `handleRecall` ➔ `callTicket()` hoặc `callMultipleTickets()`
  - `handleComplete` ➔ `solveTicket()`
  - `handleSkip` ➔ `skipTicket()`
  - `handleTransfer` ➔ `moveTicket()`

---

## 3. Lợi ích sau khi áp dụng

1. **Giao diện đồng nhất & Hiện đại:** Chuẩn thiết kế Tailwind CSS hiện đại, sắc sảo, tạo ấn tượng chuyên nghiệp với các cơ quan ban ngành và doanh nghiệp.
2. **Loại bỏ phụ thuộc nặng nề:** Giảm tải các thư viện PrimeReact cồng kềnh ở những màn hình công cộng (Kiosk, TV, Tablet), giúp ứng dụng khởi động tức thì và chạy mượt trên các thiết bị Android nhúng cấu hình thấp.
3. **Trải nghiệm người dùng vượt trội:** Âm thanh rõ ràng, thông tin bố trí khoa học, hạn chế tối đa nhầm lẫn cho người dân khi đến giao dịch.
