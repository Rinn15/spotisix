# **Scrum**

| Thành viên | Vai trò chính | Phụ Trách |
| :---- | :---- | :---- |
| Hoàng Mạnh Dũng | Product Owner | Product Backlog, phân tích nhu cầu người dùng, kiểm tra sản phẩm |
| Nguyễn Văn Định | ScrumMaster \+ Backend | Database, Bảo mật |
| Lê Nguyễn Mạnh Đạt | Frontend/UI | Giao diện, Giao diện trình phát nhạc |
| Phùng Nhật Hoàng | Backend \+ Music System | Search, playlist, hệ thống đề xuất nhạ |
| Nguyễn Dương Tấn Bình | Frontend \+ Testing | Các màn hình người dùng, testing, fix bug |

# **Chia Sprint**

| Sprint | Thời gian | Mục tiêu | Giá trị khách hàng nhận được |
| :---- | :---- | :---- | :---- |
| Sprint 1 | Tuần 1 | App nghe nhạc cơ bản | Người dùng có thể đăng nhập, tìm và nghe nhạc, tạo playlist, quản lý profile |
| Sprint 2 | Tuần 2 | Mood Discovery  | Giải quyết vấn đề không biết nghe gì (người dùng có thể nghe theo tâm trạng hoặc hoạt động đang làm) |
| Sprint 3 | Tuần 3 | Smart Tatse Control  | Giải quyết vấn đề thuật toán bị ảnh hưởng bởi bài nghe 1 lần |
| Sprint 4 | Tuần 4 | Pain Point \#3 – \[Theo khảo sát\] | Giải quyết vấn đề Đề xuất không đúng gu, không liên quan |
| Sprint 5 | Tuần 5 | Pain Point \#4 – \[Theo khảo sát\] | Giải quyết vấn đề thứ tư \+ hoàn thiện sản phẩm |

# **Product Backlog**

| Product Backlog Item | Mức độ ưu tiên | Sprint |
| :---- | :---- | :---- |
| Đăng ký / Đăng nhập | Nên có | 1 |
| Profile người dùng | Phải có | 1 |
| Trang chủ | Phải có | 1 |
| Tìm kiếm bài hát | Phải có | 1 |
| Xem thông tin bài hát | Phải có | 1 |
| Music Player: Play/Pause/Next/Previous | Phải có | 1 |
| Điều chỉnh âm lượng / thanh tiến trình | Phải có | 1 |
| Tạo Playlist | Phải có | 1 |
| Thêm/Xóa bài hát khỏi Playlist | Phải có | 1 |
| Like/Favorite bài hát | Phải có | 1 |
| Lịch sử nghe nhạc | Nên có | 1 |
| Mood Discovery  | Nên có | 2 |
| Smart Taste Control.  | Nên có | 3 |
|  |  | 4 |
|  |  | 5 |
| Bug fixing | Phải có | 5 |
| Final testing | Phải có | 5 |

# 

# **Sprint 1** 

\- Sprint Goal:

| Chức năng | Mô tả |
| :---- | :---- |
| Register/Login | Người dùng tạo tài khoản và đăng nhập |
| Profile | Xem/chỉnh sửa thông tin cá nhân |
| Home | Hiển thị bài hát/playlist đề xuất cơ bản |
| Search | Tìm kiếm bài hát, nghệ sĩ |
| Song Detail | Xem tên bài hát, artist, cover |
| Music Player | Play/Pause |
| Player Controls | Next/Previous/Progress/Volume |
| Create Playlist | Tạo playlist |
| Manage Playlist | Thêm/Xóa bài hát |
| Favorite | Like bài hát |
| History | Xem bài hát đã nghe |

\- Phân chia công việc trong Sprint 1

| Thành viên | Vai trò | Công việc chính |
| :---- | :---- | :---- |
| Hoàng Mạnh Dũng | Product Owner \+ Frontend/UI | Xác nhận yêu cầu Sprint 1; thiết kế giao diện Home và Profile; xây dựng Home Page, Profile Page; kiểm tra giao diện theo User Story |
| Nguyễn Văn Định | ScrumMaster \+ Backend | Thiết lập Backend và Database; xây dựng Register/Login; quản lý tài khoản và Profile |
| Lê Nguyễn Mạnh Đạt | Frontend Developer | Xây dựng Search; hiển thị danh sách bài hát; xây dựng Song Detail |
| Phùng Nhật Hoàng | Backend \+ Music Developer | Xây dựng Music Player; Play/Pause; Next/Previous; Volume; xử lý dữ liệu bài hát |
| Nguyễn Dương Tấn  | Frontend \+ Tester | Xây dựng Playlist; Create/Add/Remove Song; Favorite; Listening History; kiểm thử chức năng  |

# 

# **Phân tích nhu cầu người dùng – Sprint 1: App nghe nhạc cơ bản**

Sprint 1 tập trung xây dựng nền tảng chức năng cơ bản của ứng dụng nghe nhạc, giúp người dùng có thể tạo tài khoản, đăng nhập, quản lý thông tin cá nhân, tìm kiếm và nghe nhạc, đồng thời tạo và quản lý playlist.

| Vấn đề / nhu cầu | Nhu cầu người dùng | Định hướng giải pháp |
| ----- | ----- | ----- |
| Người dùng cần truy cập tài khoản | Muốn đăng ký và đăng nhập nhanh chóng | Register/Login |
| Người dùng cần quản lý thông tin cá nhân | Muốn xem và chỉnh sửa profile | Profile |
| Người dùng cần tìm nội dung | Muốn tìm bài hát/nghệ sĩ | Search |
| Người dùng cần biết thông tin bài hát | Muốn xem tên, artist, cover | Song Detail |
| Người dùng muốn nghe nhạc | Muốn phát và điều khiển bài hát | Music Player |
| Người dùng muốn chuyển bài | Muốn Next/Previous và điều chỉnh tiến trình | Player Controls |
| Người dùng muốn quản lý bài hát yêu thích | Muốn Like/Favorite bài hát | Favorite |
| Người dùng muốn tạo danh sách riêng | Muốn tạo playlist và thêm/xóa bài hát | Create/Manage Playlist |
| Người dùng muốn xem lại nội dung đã nghe | Muốn xem lịch sử nghe nhạc | Listening History |

# **Product Backlog Refinement cho Sprint 1**

Product Backlog của Sprint 1 được phân rã thành các PBI nhỏ hơn để xác định rõ phạm vi triển khai, yêu cầu và tiêu chí nghiệm thu.

| Product Backlog Item | Mức độ ưu tiên | Sprint | Trạng thái |
| ----- | ----- | ----- | ----- |
| Register / Login | Phải có | 1 | Đã refinement |
| Profile | Phải có | 1 | Đã refinement |
| Home | Phải có | 1 | Đã refinement |
| Search | Phải có | 1 | Đã refinement |
| Song Detail | Phải có | 1 | Đã refinement |
| Music Player | Phải có | 1 | Đã refinement |
| Player Controls | Phải có | 1 | Đã refinement |
| Create Playlist | Phải có | 1 | Đã refinement |
| Manage Playlist | Phải có | 1 | Đã refinement |
| Favorite | Phải có | 1 | Đã refinement |
| Listening History | Nên có | 1 | Đã refinement |

# **Luồng giải quyết vấn đề Sprint 1**

Người dùng mở ứng dụng  
 ↓  
Register / Login  
 ↓  
Home  
 ↓  
Tìm kiếm bài hát / nghệ sĩ  
 ↓  
Xem Song Detail  
 ↓  
Phát bài hát bằng Music Player  
 ↓  
Play / Pause / Next / Previous / Volume / Progress  
 ↓  
Like hoặc thêm bài hát vào Playlist  
 ↓  
Lưu lịch sử nghe  
 ↓  
Người dùng tiếp tục sử dụng ứng dụng

# **Acceptance Criteria – Sprint 1**

| ID | Acceptance Criteria | Kết quả mong đợi |
| ----- | ----- | ----- |
| AC1.1 | Register / Login | Người dùng có thể đăng ký tài khoản và đăng nhập bằng thông tin hợp lệ |
| AC1.2 | Login validation | Thông tin đăng nhập không hợp lệ phải được hệ thống thông báo lỗi |
| AC1.3 | Profile | Người dùng có thể xem và chỉnh sửa thông tin cá nhân |
| AC1.4 | Home | Trang Home hiển thị được nội dung âm nhạc cơ bản |
| AC1.5 | Search | Người dùng tìm kiếm được bài hát và nghệ sĩ |
| AC1.6 | Song Detail | Người dùng xem được tên bài hát, artist và cover |
| AC1.7 | Music Player | Người dùng có thể Play/Pause bài hát |
| AC1.8 | Player Controls | Next/Previous/Progress/Volume hoạt động đúng |
| AC1.9 | Playlist | Người dùng có thể tạo playlist và thêm/xóa bài hát |
| AC1.10 | Favorite | Người dùng có thể Like/Favorite bài hát |
| AC1.11 | History | Hệ thống ghi nhận và hiển thị lịch sử bài hát đã nghe |

# **Kiểm tra và nghiệm thu sản phẩm – Sprint 1**

| Test Case | Tình huống kiểm tra | Kết quả mong đợi | Trạng thái |
| ----- | ----- | ----- | ----- |
| AT1.1 | Đăng ký tài khoản hợp lệ | Tài khoản được tạo thành công | Chờ test thực tế |
| AT1.2 | Đăng nhập bằng tài khoản hợp lệ | Người dùng đăng nhập và vào Home | Chờ test thực tế |
| AT1.3 | Đăng nhập sai thông tin | Hệ thống hiển thị thông báo lỗi | Chờ test thực tế |
| AT1.4 | Chỉnh sửa Profile | Thông tin mới được lưu và hiển thị | Chờ test thực tế |
| AT1.5 | Tìm kiếm bài hát/nghệ sĩ | Kết quả phù hợp được hiển thị | Chờ test thực tế |
| AT1.6 | Mở Song Detail | Hiển thị đúng thông tin bài hát | Chờ test thực tế |
| AT1.7 | Play/Pause | Bài hát phát và tạm dừng đúng | Chờ test thực tế |
| AT1.8 | Next/Previous/Volume/Progress | Các điều khiển hoạt động đúng | Chờ test thực tế |
| AT1.9 | Tạo và quản lý Playlist | Có thể tạo, thêm và xóa bài hát | Chờ test thực tế |
| AT1.10 | Like/Favorite | Trạng thái yêu thích được lưu đúng | Chờ test thực tế |
| AT1.11 | Nghe bài hát và xem History | Bài hát được ghi nhận trong lịch sử | Chờ test thực tế |

# **Tiêu chí hoàn thành Sprint 1**

Sprint 1 được xem là đạt mục tiêu khi:

- Các PBI cốt lõi của ứng dụng nghe nhạc cơ bản đã được triển khai.  
- Acceptance Criteria của các PBI chính đạt yêu cầu.  
- Người dùng có thể đăng ký/đăng nhập và quản lý Profile.  
- Người dùng có thể tìm kiếm và xem thông tin bài hát.  
- Music Player và các Player Controls hoạt động ổn định.  
- Người dùng có thể tạo và quản lý Playlist.  
- Favorite và Listening History hoạt động theo yêu cầu.  
- Functional Test không phát hiện lỗi nghiêm trọng.  
- Product Owner kiểm tra và xác nhận các PBI đã hoàn thành.

# **Sprint 2**

\- Sprint Goal: Giải quyết vấn đề “Không biết nghe gì” bằng cách cho phép người dùng khám phá và nhận đề xuất bài hát dựa trên Mood hoặc Activity hiện tại.

| Chức năng | Mô tả |
| ----- | ----- |
| Mood Discovery | Người dùng lựa chọn tâm trạng hiện tại để nhận đề xuất bài hát phù hợp |
| Activity Discovery | Người dùng lựa chọn hoạt động hiện tại để nhận đề xuất bài hát phù hợp |
| Mood \+ Activity | Kết hợp Mood và Activity để đưa ra đề xuất phù hợp hơn |
| Recommendation Result | Hiển thị danh sách bài hát được đề xuất dựa trên lựa chọn của người dùng |
| Refresh Recommendation | Thay đổi Mood/Activity để cập nhật danh sách đề xuất |
| Play Recommendation | Phát trực tiếp bài hát từ danh sách đề xuất |

\- Luồng hoạt động:

+ Mở web → Hệ thống hiển thị một bảng UI/UX để người dùng lựa chọn Mood và/hoặc Activity.  
+ TH1: Người dùng chỉ chọn Mood → Hệ thống ghi nhận Mood → tạo và hiển thị danh sách bài hát phù hợp với Mood.  
+ TH2: Người dùng chỉ chọn Activity → Hệ thống ghi nhận Activity → tạo và hiển thị danh sách bài hát phù hợp với Activity.  
+ TH3: Người dùng chọn cả Mood và Activity → Hệ thống ghi nhận cả hai tiêu chí → kết hợp Mood và Activity để tạo và hiển thị danh sách bài hát phù hợp.  
+ TH4: Người dùng bỏ qua (Skip) hoặc nhấn X → Hệ thống đóng bảng UI/UX → người dùng được chuyển vào Home và sử dụng các chức năng bình thường.

\- Phân chia công việc trong Sprint 2

| Thành viên | Vai trò | Công việc chính |
| ----- | ----- | ----- |
| Hoàng Mạnh Dũng | Product Owner \+ Frontend/UI | Xác nhận yêu cầu Sprint 2; xây dựng User Story cho Mood Discovery và Activity Discovery; thiết kế giao diện Mood/Activity; xây dựng Mood Discovery Page; kiểm tra giao diện theo User Story |
| Nguyễn Văn Định | ScrumMaster \+ Backend | Thiết lập Backend cho Recommendation; xây dựng API nhận Mood/Activity; xử lý request và response; kết nối Database/Music Data; đảm bảo API hoạt động ổn định |
| Lê Nguyễn Mạnh Đạt | Frontend Developer | Xây dựng giao diện lựa chọn Mood/Activity; hiển thị danh sách bài hát đề xuất; xây dựng Recommendation Result; kết nối Frontend với Recommendation API |
| Phùng Nhật Hoàng | Backend \+ Music Developer | Xây dựng logic Recommendation; xử lý dữ liệu bài hát; xây dựng mapping Mood/Activity với thể loại/đặc điểm bài hát; xử lý việc phát bài hát từ danh sách đề xuất |
| Nguyễn Dương Tấn | Frontend \+ Tester | Xây dựng Refresh Recommendation; tích hợp Recommendation với Music Player; kiểm thử Mood/Activity/Recommendation; kiểm thử luồng từ lựa chọn đến phát bài hát |

# **Phân tích nhu cầu người dùng – Sprint 2: Mood Discovery**

Sprint 2 tập trung giải quyết pain point “Không biết nghe gì” bằng cách cho phép người dùng lựa chọn tâm trạng và/hoặc hoạt động hiện tại để nhận được danh sách bài hát phù hợp.

| Vấn đề | Nhu cầu người dùng | Định hướng giải pháp |
| ----- | ----- | ----- |
| Không biết nghe gì | Muốn tìm được nhạc phù hợp nhanh hơn | Mood Discovery |
| Muốn nghe theo tâm trạng | Muốn hệ thống hiểu trạng thái hiện tại | Mood Discovery |
| Muốn nghe theo hoàn cảnh | Muốn nhạc phù hợp với hoạt động đang làm | Activity Discovery |
| Muốn đề xuất sát hơn | Muốn kết hợp tâm trạng và hoạt động | Mood \+ Activity |
| Muốn đổi lựa chọn | Muốn thử một danh sách khác | Refresh Recommendation |
| Muốn nghe ngay | Muốn phát trực tiếp bài được đề xuất | Play Recommendation |

# **Product Backlog Refinement cho Sprint 2**

Product Backlog của Sprint 2 được phân rã từ PBI Mood Discovery thành các PBI nhỏ hơn để triển khai và nghiệm thu rõ ràng.

| Product Backlog Item | Mức độ ưu tiên | Sprint | Trạng thái |
| ----- | ----- | ----- | ----- |
| Mood Discovery | Phải có | 2 | Đã refinement |
| Activity Discovery | Phải có | 2 | Đã refinement |
| Mood \+ Activity | Phải có | 2 | Đã refinement |
| Recommendation Result | Phải có | 2 | Đã refinement |
| Refresh Recommendation | Nên có | 2 | Đã refinement |
| Play Recommendation | Phải có | 2 | Đã refinement |
| Regression Testing Sprint 1 | Phải có | 2 | Đã refinement |

# **User Story – Sprint 2**

| ID | User Story |
| ----- | ----- |
| US2.1 | Là người dùng, tôi muốn chọn Mood để nhận danh sách bài hát phù hợp với tâm trạng hiện tại. |
| US2.2 | Là người dùng, tôi muốn chọn Activity để nhận danh sách bài hát phù hợp với hoạt động đang làm. |
| US2.3 | Là người dùng, tôi muốn chọn cả Mood và Activity để nhận đề xuất sát với hoàn cảnh hơn. |
| US2.4 | Là người dùng, tôi muốn thay đổi Mood/Activity để nhận một danh sách đề xuất mới. |
| US2.5 | Là người dùng, tôi muốn phát trực tiếp bài hát được đề xuất. |
| US2.6 | Là người dùng, tôi muốn bỏ qua bảng Mood/Activity để tiếp tục sử dụng Home bình thường. |

# **Acceptance Criteria – Sprint 2**

| ID | Acceptance Criteria | Kết quả mong đợi |
| ----- | ----- | ----- |
| AC2.1 | Mood Selection | Người dùng có thể chọn Mood hợp lệ |
| AC2.2 | Activity Selection | Người dùng có thể chọn Activity hợp lệ |
| AC2.3 | Mood Recommendation | Chỉ chọn Mood → hệ thống trả về danh sách phù hợp với Mood |
| AC2.4 | Activity Recommendation | Chỉ chọn Activity → hệ thống trả về danh sách phù hợp với Activity |
| AC2.5 | Mood \+ Activity | Chọn cả hai → hệ thống kết hợp hai tiêu chí để tạo đề xuất |
| AC2.6 | Recommendation Result | Danh sách bài hát được hiển thị rõ ràng và có thể tương tác |
| AC2.7 | Refresh Recommendation | Thay đổi lựa chọn → danh sách đề xuất được cập nhật |
| AC2.8 | Play Recommendation | Người dùng có thể phát trực tiếp bài hát được đề xuất |
| AC2.9 | Skip / Close | Bỏ qua hoặc đóng bảng → người dùng được chuyển về Home và vẫn sử dụng ứng dụng bình thường |
| AC2.10 | Regression | Các chức năng quan trọng của Sprint 1 vẫn hoạt động sau khi tích hợp Sprint 2 |

# **Kiểm tra và nghiệm thu sản phẩm – Sprint 2**

| Test Case | Tình huống kiểm tra | Kết quả mong đợi | Trạng thái |
| ----- | ----- | ----- | ----- |
| AT2.1 | Chỉ chọn Mood | Hệ thống hiển thị danh sách phù hợp với Mood | Chờ test thực tế |
| AT2.2 | Chỉ chọn Activity | Hệ thống hiển thị danh sách phù hợp với Activity | Chờ test thực tế |
| AT2.3 | Chọn Mood \+ Activity | Hệ thống tạo đề xuất dựa trên cả hai tiêu chí | Chờ test thực tế |
| AT2.4 | Thay đổi Mood/Activity | Recommendation được cập nhật theo lựa chọn mới | Chờ test thực tế |
| AT2.5 | Phát bài được đề xuất | Bài hát được phát bằng Music Player | Chờ test thực tế |
| AT2.6 | Skip / Close | Bảng lựa chọn đóng và người dùng trở về Home | Chờ test thực tế |
| AT2.7 | Không chọn dữ liệu | Hệ thống không tạo đề xuất sai; người dùng có thể tiếp tục hoặc bỏ qua | Chờ test thực tế |
| AT2.8 | Regression Sprint 1 | Login, Search, Player, Playlist và các chức năng cũ vẫn hoạt động | Chờ test thực tế |

# **Tiêu chí hoàn thành Sprint 2**

Sprint 2 được xem là đạt mục tiêu khi:

- Các PBI liên quan đến Mood Discovery đã được triển khai và tích hợp.  
- Người dùng có thể chọn Mood và/hoặc Activity.  
- Hệ thống tạo và hiển thị Recommendation Result tương ứng.  
- Người dùng có thể Refresh Recommendation.  
- Người dùng có thể phát trực tiếp bài hát được đề xuất.  
- Luồng Skip/Close hoạt động đúng.  
- Acceptance Criteria của các PBI chính đạt yêu cầu.  
- Regression Test của Sprint 1 không phát hiện lỗi nghiêm trọng.  
- Product Owner kiểm tra và xác nhận các PBI đã hoàn thành.

# 

# **Sprint 3**

\- Sprint Goal: Giải quyết vấn đề bị ảnh hưởng quá nhiều bởi một bài hát được nghe một lần, bằng cách xây dựng cơ chế Smart Taste Control dựa trên lịch sử nghe và mức độ tương tác của người dùng.

| Chức năng | Mô tả |
| :---- | :---- |
| Listening Behavior Tracking | Ghi nhận hành vi nghe nhạc của người dùng |
| Repeat Listening | Nhận biết người dùng nghe lại một bài hát nhiều lần |
| Like/Save Feedback | Sử dụng Like/Save để xác định mức độ yêu thích bài hát |
| Skip Feedback | Ghi nhận việc Skip để giảm mức độ phù hợp của bài hát |
| Taste Profile | Xây dựng và cập nhật hồ sơ sở thích âm nhạc của người dùng |
| Smart Recommendation | Điều chỉnh đề xuất dựa trên sở thích ổn định thay vì chỉ dựa vào một lần nghe |
| Recommendation Weighting | Tăng trọng số cho hành vi lặp lại/Like/Save và hạn chế ảnh hưởng của một lần nghe đơn lẻ |

\- Phân chia công việc trong Sprint 3

| Thành viên | Vai trò | Công việc chính |
| :---- | :---- | :---- |
| Hoàng Mạnh Dũng | Product Owner \+ Frontend/UI | Xác nhận yêu cầu Sprint 3; xác định các User Story liên quan đến Smart Taste Control; thiết kế giao diện Feedback; xây dựng giao diện Like/Save/Skip và Listening History; kiểm tra chức năng theo User Story |
| Nguyễn Văn Định | ScrumMaster \+ Backend | Xây dựng API ghi nhận Listening Behavior; lưu lịch sử nghe; xử lý các Event như Play/Complete/Skip/Like/Save; xây dựng API Taste Profile; quản lý dữ liệu người dùng |
| Lê Nguyễn Mạnh Đạt | Frontend Developer | Xây dựng giao diện Like/Save/Skip; hiển thị trạng thái Feedback; xây dựng Listening History; kết nối Frontend với API ghi nhận hành vi người dùng |
| Phùng Nhật Hoàng | Backend \+ Music Developer | Xây dựng Recommendation Algorithm; tính toán Taste Score; xử lý trọng số của Listening/Repeat/Like/Save/Skip; giảm ảnh hưởng của một lần nghe; tích hợp thuật toán với hệ thống Recommendation |
| Nguyễn Dương Tấn | Frontend \+ Tester | Tích hợp Smart Recommendation với Home/Player; kiểm thử Listening Behavior; kiểm thử Like/Save/Skip; kiểm thử thuật toán Recommendation; kiểm thử Regression toàn bộ chức năng từ Sprint 1–3 |

# **Phân tích nhu cầu người dùng – Sprint 3**

Dựa trên kết quả khảo sát, một trong những vấn đề nổi bật là “Thuật toán bị ảnh hưởng bởi bài nghe một lần”. Vấn đề này xảy ra khi hệ thống có thể xem một lần nghe một bài hát mà hệ thống thay đổi hoặc tạo ra đề xuất mới, trong khi một lần nghe chưa chắc thể hiện sở thích ổn định của người dùng.

# **Nhu cầu người dùng**

| Vấn đề | Nhu cầu | Định hướng giải pháp |
| :---- | :---- | :---- |
| Thuật toán bị ảnh hưởng bởi bài nghe một lần | Người dùng muốn hệ thống hiểu gu âm nhạc ổn định hơn | Theo dõi nhiều loại hành vi nghe nhạc thay vì chỉ dựa vào một lần nghe |
| Người dùng nghe lại một bài nhiều lần | Hệ thống cần nhận biết đây là tín hiệu mạnh hơn một lần nghe | Tăng trọng số cho Repeat Listening |
| Người dùng Like/Save bài hát | Người dùng muốn thể hiện rõ bài hát mình yêu thích | Sử dụng Like/Save như tín hiệu ưu tiên |
| Người dùng Skip bài hát | Người dùng muốn hệ thống hạn chế các nội dung không phù hợp | Giảm mức độ phù hợp của bài hát khi bị Skip |
| Sở thích thay đổi theo thời gian | Hệ thống cần cập nhật gu âm nhạc thay vì giữ một trạng thái cố định | Cập nhật Taste Profile theo các hành vi mới |

# **Product Backlog Refinement cho Sprint 3**

Product Backlog của Sprint 3 được phân rã từ PBI Smart Taste Control thành các PBI nhỏ hơn để có thể triển khai và kiểm tra rõ ràng trong Sprint. Việc refinement giúp PBI có mô tả cụ thể hơn và xác định được các hạng mục cần thực hiện.

| Product Backlog Item | Mức độ ưu tiên | Sprint | Trạng thái |
| :---- | :---- | :---- | :---- |
| Listening Behavior Tracking | Phải có | 3 |  |
| Repeat Listening | Phải có | 3 |  |
| Like/Save Feedback | Phải có | 3 |  |
| Skip Feedback | Phải có | 3 |  |
| Taste Profile | Phải có | 3 |  |
| Recommendation Weighting | Phải có | 3 |  |
| Smart Recommendation | Phải có | 3 |  |
| Regression Testing Sprint 1–2 | Phải có | 3 |  |

# **Luồng giải quyết vấn đề Sprint 3**

Người dùng nghe nhạc  
        ↓  
Ghi nhận Listening Behavior  
        ↓  
Phân loại hành vi  
        ├─ Play / nghe một lần → tín hiệu yếu  
        ├─ Replay → tăng độ tin cậy  
        ├─ Like / Save → tín hiệu sở thích mạnh  
        └─ Skip → giảm mức độ phù hợp  
        ↓  
Cập nhật Taste Profile  
        ↓  
Recommendation Weighting  
        ↓  
Smart Recommendation  
        ↓  
Đề xuất bài hát  
        ↓  
Người dùng tiếp tục nghe  
        └──────────────→ Ghi nhận hành vi mới

# **Nguyên tắc xử lý**

Một lần nghe một bài hát không được xem là bằng chứng đủ mạnh để thay đổi đáng kể Taste Profile.

Các hành vi lặp lại như Replay cần có ảnh hưởng lớn hơn một lần nghe.

Like/Save được xem là tín hiệu thể hiện sở thích rõ ràng hơn.

Skip được sử dụng để giảm mức độ ưu tiên của nội dung không phù hợp.

Taste Profile cần được cập nhật từ tổng hợp nhiều hành vi, thay vì phụ thuộc vào một hành động đơn lẻ.

Smart Recommendation sử dụng Taste Profile và Recommendation Weighting để tạo đề xuất ổn định hơn.

# **Acceptance Criteria – Sprint 3**

| ID | Tiêu chí nghiệm thu | Kết quả mong đợi |
| :---- | :---- | :---- |
| AC3.1 | Ghi nhận hành vi nghe | Hệ thống ghi nhận được các hành vi cần thiết như Play/Complete/Replay/Skip/Like/Save |
| AC3.2 | Replay | Khi người dùng nghe lại bài hát, hệ thống ghi nhận đây là một tín hiệu bổ sung cho sở thích |
| AC3.3 | Like/Save | Like/Save được ghi nhận và ảnh hưởng đến mức độ ưu tiên của bài hát |
| AC3.4 | Skip | Skip được ghi nhận và làm giảm mức độ phù hợp của nội dung tương ứng |
| AC3.5 | Taste Profile | Taste Profile được tạo/cập nhật dựa trên nhiều hành vi của người dùng |
| AC3.6 | One-listen bias | Một bài hát chỉ được nghe một lần không làm thay đổi đề xuất quá mạnh |
| AC3.7 | Smart Recommendation | Đề xuất sử dụng Taste Profile thay vì chỉ dựa vào hành vi gần nhất |
| AC3.8 | Integration | Smart Recommendation hoạt động được cùng Home/Music Player/Recommendation |
| AC3.9 | Regression | Các chức năng quan trọng của Sprint 1 và Sprint 2 vẫn hoạt động sau khi tích hợp Sprint 3 |

# **Kiểm tra và nghiệm thu sản phẩm – Sprint 3**

Với vai trò Product Owner, công việc kiểm tra và nghiệm thu tập trung vào việc đối chiếu sản phẩm thực tế với Sprint Goal, User Story và Acceptance Criteria.

# **Quy trình nghiệm thu**

Dev hoàn thành PBI  
        ↓  
Kiểm tra theo Acceptance Criteria  
        ↓  
Functional Test  
        ↓  
Integration Test  
        ↓  
Regression Test  
        ↓  
Đạt?  
 ┌──────┴──────┐  
Có             Không  
↓               ↓  
Accept PBI      Ghi nhận lỗi  
↓               ↓  
Sprint Review   Developer sửa  
                ↓  
              Test lại

# **Tiêu chí hoàn thành Sprint 3**

Sprint 3 được xem là đạt mục tiêu khi:

Các PBI liên quan đến Smart Taste Control đã được triển khai và tích hợp.

Acceptance Criteria của các PBI chính đạt yêu cầu.

Hệ thống ghi nhận được các hành vi nghe nhạc cần thiết.

Taste Profile có thể được cập nhật từ nhiều hành vi.

Một lần nghe đơn lẻ không gây ảnh hưởng quá lớn đến đề xuất.

Smart Recommendation hoạt động với Music Player và các chức năng Recommendation đã có.

Regression Test của Sprint 1 và Sprint 2 không phát hiện lỗi nghiêm trọng.

Product Owner kiểm tra và xác nhận các PBI đã hoàn thành.

# **Quản lý Product Backlog Sprint 2 và Sprint 3**

| PBI | Sprint | Ưu tiên | Trạng thái PO | Mục đích |
| :---- | :---- | :---- | :---- | :---- |
| Mood Discovery | 2 | Phải có | Đã refinement | Giúp người dùng tìm nhạc theo tâm trạng. |
| Activity Discovery | 2 | Phải có | Đã refinement | Giúp người dùng tìm nhạc theo hoạt động. |
| Mood \+ Activity | 2 | Phải có | Đã refinement | Kết hợp ngữ cảnh để đề xuất phù hợp hơn. |
| Recommendation Result | 2 | Phải có | Đã refinement | Hiển thị danh sách bài hát được đề xuất. |
| Refresh Recommendation | 2 | Nên có | Đã refinement | Cho phép thay đổi lựa chọn và nhận đề xuất mới. |
| Play Recommendation | 2 | Phải có | Đã refinement | Phát trực tiếp bài hát được đề xuất. |
| Listening Behavior Tracking | 3 | Phải có | Ready for implementation | Ghi nhận hành vi nghe. |
| Repeat Listening | 3 | Phải có | Ready for implementation | Phân biệt tín hiệu nghe lặp lại. |
| Like/Save Feedback | 3 | Phải có | Ready for implementation | Thu thập tín hiệu yêu thích rõ ràng. |
| Skip Feedback | 3 | Phải có | Ready for implementation | Giảm ưu tiên nội dung không phù hợp. |
| Taste Profile | 3 | Phải có | Ready for refinement/implementation | Tổng hợp sở thích từ nhiều hành vi. |
| Recommendation Weighting | 3 | Phải có | Ready for refinement/implementation | Điều chỉnh ảnh hưởng của từng loại hành vi. |
| Smart Recommendation | 3 | Phải có | Ready for refinement/implementation | Hạn chế ảnh hưởng quá mức của một lần nghe. |
| Regression Testing Sprint 1–2 | 3 | Phải có | Ready for implementation | Đảm bảo chức năng cũ không bị ảnh hưởng. |

# **Acceptance Criteria do Product Owner xác định**

| ID | Acceptance Criteria | Kết quả mong đợi |
| :---- | :---- | :---- |
| AC3.1 | Ghi nhận hành vi nghe | Ghi nhận được Play/Complete/Replay/Skip/Like/Save. |
| AC3.2 | Replay | Nghe lại được ghi nhận là tín hiệu bổ sung cho sở thích. |
| AC3.3 | Like/Save | Like/Save ảnh hưởng tích cực đến mức độ ưu tiên. |
| AC3.4 | Skip | Skip làm giảm mức độ phù hợp của nội dung tương ứng. |
| AC3.5 | Taste Profile | Profile được tạo/cập nhật từ nhiều hành vi. |
| AC3.6 | One-listen bias | Một lần nghe không làm thay đổi đề xuất quá mạnh. |
| AC3.7 | Smart Recommendation | Đề xuất sử dụng Taste Profile, không chỉ hành vi gần nhất. |
| AC3.8 | Integration | Smart Recommendation hoạt động với Home/Music Player/Recommendation. |
| AC3.9 | Regression | Chức năng quan trọng của Sprint 1–2 vẫn hoạt động. |

# **Kiểm tra và nghiệm thu sản phẩm**

| Test Case | Tình huống kiểm tra | Kết quả mong đợi | Trạng thái |
| :---- | :---- | :---- | :---- |
| AT3.1 | Nghe một bài hát một lần | Taste Profile không thay đổi quá mạnh; recommendation vẫn ổn định. | Chờ test thực tế |
| AT3.2 | Replay cùng một bài nhiều lần | Tín hiệu sở thích của bài được tăng độ tin cậy. | Chờ test thực tế |
| AT3.3 | Like một bài hát | Bài hát được ghi nhận là tín hiệu tích cực. | Chờ test thực tế |
| AT3.4 | Save một bài hát | Bài hát được ghi nhận là tín hiệu tích cực. | Chờ test thực tế |
| AT3.5 | Skip nhiều nội dung | Nội dung bị Skip được giảm mức độ ưu tiên. | Chờ test thực tế |
| AT3.6 | Có nhiều hành vi khác nhau | Taste Profile phản ánh tổng hợp, không chỉ hành vi cuối cùng. | Chờ test thực tế |
| AT3.7 | Taste Profile được cập nhật | Recommendation thay đổi theo profile nhưng vẫn ổn định. | Chờ test thực tế |
| AT3.8 | Phát bài từ Smart Recommendation | Bài được phát và hành vi mới tiếp tục được ghi nhận. | Chờ test thực tế |
| AT3.9 | Regression Sprint 1–2 | Các chức năng cũ không bị lỗi sau tích hợp. | Chờ test thực tế |

#  **Kết quả và phạm vi trách nhiệm cá nhân**

Trong Sprint 3, phần việc của Product Owner được hoàn thiện theo chuỗi: phân tích nhu cầu người dùng → xác định Sprint Goal → refinement Product Backlog → xây dựng User Story → xác định Acceptance Criteria → kiểm tra sản phẩm → Acceptance Test và Regression Test → xác nhận PBI.

Sprint 2 được định hướng để giải quyết pain point “Không biết nghe gì”. Sprint 3 tiếp tục giải quyết pain point “Thuật toán bị ảnh hưởng bởi bài nghe một lần”. Sprint 4 và Sprint 5 chưa được gán cố định pain point trong tài liệu hiện tại; các vấn đề còn lại cần tiếp tục phân tích và ưu tiên trước khi refinement.

# **Sprint 4 \- Vấn đề 3**

Sprint Goal: Giải quyết vấn đề thứ ba được xác định từ kết quả khảo sát.

| Feature | Mô tả |
| :---- | :---- |
| Pain Point \#3 |  |
| Supporting features |  |

# **Sprint 5 \- Vấn đề 4**

Sprint Goal: Giải quyết pain point cuối cùng và hoàn thiện sản phẩm.

| Feature | Mô tả |
| :---- | :---- |
| Pain Point \#4 |  |
| Supporting features |  |
| Bug fixing |  |
| UI/UX improvement |  |
| Performance optimization |  |
| Final testing |  |

