# Bug Nghe Lời — ghi chú cho Muse

Game TikTok LIVE: người xem gõ lệnh, mèo Bug THẬT (ảnh tách nền public/assets/cat.png) làm động tác tương ứng bằng animation CSS. Chung khung Lớp Toán/Tarot/IQ, cổng riêng **3010**.

- Engine thuần thời gian: `CatRoom` (src/game/cat.ts). Lệnh nhận diện bằng `findAction` (bỏ dấu, khớp theo từ). Đếm điểm thân thiết khi BẮT ĐẦU làm động tác (không phải lúc gõ), chống spam 6 giây/bạn, hàng chờ tối đa 6.
- Giọng dẫn là giọng nữ: mọi câu đọc bắt đầu "F: " (xem live/voice.ts). Quà chỉ cảm ơn, tim chỉ tạo mưa tim — không cơ chế đổi quà lấy lợi thế.
- Hình mèo: bộ ảnh anime 3x3 (9 biểu cảm) vẽ bằng AI theo ảnh Bug thật, tách nền + nén WebP + nhúng base64 trong src/game/catArt.ts (CAT_SHEET + CELL_BY_ACTION + cellPos); sân khấu hiện 1 ô bằng background-size 300%. Bản SVG vẽ tay (animeCat.ts) đã bị chủ kênh chê xấu và bị thay bằng bộ này — đừng quay lại SVG. Toàn bộ game là file chữ, push qua connector trọn vẹn.
- Thêm lệnh mới = thêm 1 mục vào ACTIONS (cat.ts) + 1 animation `cat-<key>` trong cat.css + nút demo tự sinh theo ACTIONS. Sửa cat.ts là PHẢI chạy `npm run check` + `npm run lint` + `npm run build`.
