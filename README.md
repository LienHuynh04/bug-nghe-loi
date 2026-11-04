# Bug Nghe Lời

Game tương tác cho TikTok LIVE dùng **ảnh mèo thật của kênh (Bug)**: người xem gõ lệnh trong bình luận, Bug làm đúng động tác đó trên sân khấu. Cùng khung kỹ thuật với Lớp Toán / Phòng Tarot / Tính Toán IQ Cao. Sân khấu dọc 1080×1920 cho TikTok LIVE Studio.

## Cách chơi trên live

1. Người xem gõ một lệnh trong bình luận: **NHẢY · CHẠY · NGỦ · ĂN (HẠT) · KÊU (MEOW) · LĂN · ĐUỔI (BƯỚM) · GIẬN · THƯƠNG**. Gõ có dấu hay không dấu đều được.
2. Bug làm động tác ngay; đang bận thì lệnh xếp hàng (tối đa 6), làm lần lượt không sót. Mỗi bạn chờ 6 giây giữa hai lệnh.
3. Mỗi lệnh Bug hoàn thành việc bắt đầu làm được tính 1 điểm thân thiết, lên bảng **Bạn Thân Của Bug** ở chân sân khấu.
4. Đủ **100 tim** thì mưa tim quanh Bug. Quà chỉ được cảm ơn bằng lời, không đổi lấy bất kỳ lợi thế nào.
5. 30 giây không ai ra lệnh, Bug tự làm một động tác ngẫu nhiên cho vui (không tính điểm).

## Hình mèo

Bug trên sân khấu là **bản vẽ anime bằng SVG** (file `src/game/animeCat.ts`, không phải file ảnh): lông xám, mắt vàng, ngực và chân trắng, vòng cổ hoa xanh đúng đặc điểm Bug thật. Mèo tự đổi **9 biểu cảm** theo hành động: bình thường · vui · lấp lánh (nhảy) · ngủ · hài lòng (ăn) · há miệng kêu · tập trung rình bướm · giận cau mày · mắt trái tim (thương). Vì là file chữ nên đẩy lên GitHub trọn vẹn, không cần tải thêm ảnh nào.

## Chạy trên Mac

```bash
bash run.sh
```

Lần đầu tự cài thư viện (cần Node.js). Trang điều khiển: http://localhost:3010 · Link cho LIVE Studio: http://lvh.me:3010/?view=stage (1080×1920) · Cổng riêng **3010** (IQ 3009, Tarot 3008, Lớp Toán 3007, Lớp Học Chữ 3006). Trên Windows: chạy `BAT-LIVE.bat`.

## Cấu trúc

- `server.ts`: máy chủ chung (kết nối TikTok, giọng đọc Edge TTS + Google dự phòng, SSE). Ít khi phải sửa.
- `src/game/cat.ts`: lõi game (bảng lệnh, hàng chờ, chống spam, đếm bạn thân, mốc tim).
- `src/game/CatStage.tsx` + `cat.css`: sân khấu (phòng vẽ CSS/SVG, chuyển động của Bug theo từng lệnh).
- `src/game/CatControls.tsx`: nút điều khiển + giả lập ở trang điều khiển.
- `src/live/`: hạ tầng live dùng chung.

## Kiểm chứng

```bash
npm run check   # kiểm thử nhận diện lệnh + hàng chờ + chống spam + mốc tim
npm run lint
npm run build
```
