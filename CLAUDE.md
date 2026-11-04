# Bug Nghe Lời — ghi chú cho Muse

Game TikTok LIVE: người xem gõ lệnh, mèo Bug THẬT (ảnh tách nền public/assets/cat.png) làm động tác tương ứng bằng animation CSS. Chung khung Lớp Toán/Tarot/IQ, cổng riêng **3010**.

- Engine thuần thời gian: `CatRoom` (src/game/cat.ts). Lệnh nhận diện bằng `findAction` (bỏ dấu, khớp theo từ). Đếm điểm thân thiết khi BẮT ĐẦU làm động tác (không phải lúc gõ), chống spam 6 giây/bạn, hàng chờ tối đa 6.
- Giọng dẫn là giọng nữ: mọi câu đọc bắt đầu "F: " (xem live/voice.ts). Quà chỉ cảm ơn, tim chỉ tạo mưa tim — không cơ chế đổi quà lấy lợi thế.
- Ảnh cat.png là file NHỊ PHÂN: connector push_files không đẩy được; user tự upload qua web GitHub hoặc copy thư mục về Mac. Sân khấu có fallback emoji 🐱 khi thiếu ảnh — đừng bỏ fallback này.
- Thêm lệnh mới = thêm 1 mục vào ACTIONS (cat.ts) + 1 animation `cat-<key>` trong cat.css + nút demo tự sinh theo ACTIONS. Sửa cat.ts là PHẢI chạy `npm run check` + `npm run lint` + `npm run build`.
