# SpotiSix — bổ sung khuyến nghị nhạc cá nhân hóa

## Các thay đổi
- Thêm `js/recommendation.js`: tính điểm đề xuất dựa trên mood, activity, tags, genre, nghệ sĩ và lịch sử nghe.
- Cập nhật `app.js`: ghi nhận lượt phát, thời gian nghe, bỏ qua và yêu thích; chuyển metadata mood/activity của nhạc cộng đồng vào mô hình đề xuất.
- Cập nhật `index.html`: nạp module khuyến nghị trước `app.js`.
- Cập nhật `style.css`: định dạng khu vực “Khám phá mới”.
- Home hiển thị “Nghe lại” và “Khám phá mới”; “Làm mới” xoay sang lô gợi ý kế tiếp và hiển thị trạng thái.
- Lượt hiển thị và làm mới gợi ý được ghi vào `recommendation_logs` qua Supabase; lịch sử nghe cá nhân vẫn chỉ nằm trong `localStorage`.

## Cách áp dụng vào repository hiện tại
1. Sao lưu repository hiện tại hoặc tạo một nhánh Git mới.
2. Chép đè các tệp `app.js`, `index.html`, `style.css` từ gói này vào repository.
3. Chép tệp mới `js/recommendation.js` vào đúng thư mục `js/`.
4. Chạy migration `supabase/migrations/20261105000000_recommendation_logs.sql` trên Supabase để bật API log với RLS theo tài khoản.
5. Commit và push lên GitHub, rồi kiểm tra website sau khi GitHub Pages triển khai xong.

## Cách hoạt động
- Lịch sử lưu trong `localStorage` của trình duyệt, tách theo ID tài khoản Supabase nếu phiên đăng nhập cung cấp ID; nếu không, dùng khóa riêng cho trình duyệt.
- Không gửi lịch sử nghe lên máy chủ.
- Ghi nhận lượt phát, thời gian nghe, bỏ qua sớm và lượt thích.
- Ưu tiên đề xuất bài chưa nghe, dựa trên những mood/activity/tags/genre/nghệ sĩ người dùng thường nghe.
- Nếu chưa có lịch sử, hiển thị danh sách khám phá ban đầu.

## Giới hạn cần biết
- Lịch sử không đồng bộ giữa các thiết bị vì đang lưu trong `localStorage`.
- Bảng `recommendation_logs` chỉ lưu các lần hiển thị/làm mới và danh sách bài được đề xuất; bảng này không lưu lịch sử phát, thời lượng nghe hoặc hành vi yêu thích.
- Việc tách lịch sử theo tài khoản dựa trên phiên Supabase hiện có của website; không thay đổi hệ thống đăng nhập.
- Thuật toán chỉ có thể dùng metadata mà SpotiSix cung cấp. Bài cộng đồng đang lấy `mood` và `activity` từ bảng `published_tracks`. Nếu trang quản trị lưu mood ở một nơi khác mà không ghi vào các trường này, cần nối dữ liệu quản trị với `published_tracks` để đề xuất tận dụng được nhãn đó.
- Đây là phiên bản thuật toán cơ bản, không phân tích trực tiếp tín hiệu âm thanh.
