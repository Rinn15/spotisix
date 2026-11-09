# SpotiSix – Sprint 5: Listen Together

# 1. Mục tiêu Sprint

Cho phép người dùng SpotiSix tạo phòng nghe nhạc chung, mời bạn bè tham gia bằng mã/link, xem danh sách người nghe và cùng nghe một luồng nhạc được điều khiển bởi Host.

Phạm vi Sprint 5 theo Product Backlog:

- Create Listening Room
- Share Code/Link
- Join Room
- Room Capacity: 2–6 người
- Distance Limit: 600 km
- Playback Sync
- Host Controls
- Participant List
- Reconnect & Resync
- Regression Testing Sprint 1–4

# 2. Phân tích repository hiện tại

Các thành phần đã tìm thấy trên nhánh `main`:

- `index.html`: đã có `#shared-listening-banner` và `#shared-room-indicator`.
- `nearby.js`: tìm người dùng online; có nút mời nghe chung và gọi `window.inviteForSharedListening(...)`.
- `shared-listening.js`: đã xử lý lời mời, Host/Guest, Supabase Realtime Presence, WebRTC, broadcast trạng thái phát, nhận trạng thái phát và rời phòng.
- `style.css`: có CSS cho banner và room indicator.

# Những gì đã có

1. Người dùng có thể gửi lời mời nghe chung tới người đang online qua luồng Nearby.
2. Người nhận có thể chấp nhận hoặc từ chối lời mời.
3. Khi lời mời được chấp nhận, Host/Guest tham gia một Supabase Realtime channel.
4. Presence được dùng để theo dõi thành viên; Host tạo WebRTC peer connection.
5. Host phát snapshot trạng thái bài hát và Guest áp dụng snapshot.
6. Có banner thông báo đang nghe chung và nút rời phòng.

# Những gì chưa thể xác nhận là hoàn thành

1. Không thấy UI tạo phòng độc lập với thao tác mời một người đang online.
2. Chưa có mã phòng và link mời công khai có thể mở để tham gia.
3. Chưa có màn hình phòng riêng hiển thị avatar, vai trò, trạng thái kết nối và số lượng thành viên.
4. Chưa xác nhận giới hạn cứng 2–6 thành viên.
5. Chưa xác nhận kiểm tra khoảng cách 600 km ở Backend.
6. Chưa xác nhận reconnect/resync qua kiểm thử nhiều thiết bị.
7. Chưa có bằng chứng test regression Sprint 1–4 trong phạm vi audit này.

# 3. User Story Sprint 5

| ID    | User Story                                                                                           | Ưu tiên |
| ----- | ---------------------------------------------------------------------------------------------------- | ------- |
| US5.1 | Là người dùng, tôi muốn tạo phòng nghe chung để trở thành Host và bắt đầu nghe nhạc cùng bạn bè.     | Must    |
| US5.2 | Là Host, tôi muốn có mã phòng và link mời để chia sẻ cho bạn bè.                                     | Must    |
| US5.3 | Là người được mời, tôi muốn nhập mã hoặc mở link để tham gia phòng nhanh chóng.                      | Must    |
| US5.4 | Là người dùng, tôi muốn nhìn thấy danh sách người trong phòng, vai trò và trạng thái kết nối.        | Should  |
| US5.5 | Là người dùng, tôi muốn rời phòng khi cần và danh sách thành viên được cập nhật.                     | Should  |
| US5.6 | Là Host, tôi muốn điều khiển Play/Pause/Next/Previous/Seek để mọi người nghe cùng nội dung.          | Must    |
| US5.7 | Là người nghe, tôi muốn tự đồng bộ lại khi mất mạng hoặc lệch thời gian phát.                        | Should  |
| US5.8 | Là người dùng, tôi muốn được xin phép trước khi chia sẻ vị trí để hệ thống kiểm tra giới hạn 600 km. | Must    |

# 4. Acceptance Criteria cần dùng khi nghiệm thu

| ID     | Tiêu chí       | Kết quả mong đợi                                                                              |
| ------ | -------------- | --------------------------------------------------------------------------------------------- |
| AC5.1  | Tạo phòng      | Tạo thành công; người tạo có vai trò Host.                                                    |
| AC5.2  | Mã/link        | Backend trả về mã phòng và link hợp lệ; nút sao chép có phản hồi thành công.                  |
| AC5.3  | Tham gia       | Mã/link hợp lệ vào đúng phòng; mã sai/hết hạn hiển thị lỗi dễ hiểu.                           |
| AC5.4  | Sức chứa       | Tổng số người trong phòng từ 2 đến 6; người thứ 7 bị từ chối.                                 |
| AC5.5  | Khoảng cách    | Người cách Host ≤600 km được phép; >600 km bị từ chối.                                        |
| AC5.6  | Đồng bộ phát   | Guest phát cùng bài và vị trí với Host trong ngưỡng sai lệch đã thống nhất (đề xuất ≤2 giây). |
| AC5.7  | Host Controls  | Play/Pause/Next/Previous/Seek của Host cập nhật cho Guest.                                    |
| AC5.8  | Thành viên     | Danh sách đúng với Presence; rời phòng thì danh sách cập nhật.                                |
| AC5.9  | Reconnect      | Guest mất mạng rồi kết nối lại được đồng bộ theo snapshot mới nhất của Host.                  |
| AC5.10 | Quyền riêng tư | Xin quyền vị trí trước khi truy cập; không hiển thị tọa độ cho thành viên khác.               |
| AC5.11 | Integration    | Hoạt động với Music Player, Playlist và Recommendation hiện tại.                              |
| AC5.12 | Regression     | Chức năng quan trọng Sprint 1–4 vẫn hoạt động.                                                |

# 5. Đặc tả giao diện đề xuất

# 5.1 Điểm truy cập

- Thêm mục/nút **Nghe cùng bạn bè** ở khu vực điều hướng hoặc topbar.
- Không thay thế nút **Ở gần** hiện có: Nearby là cơ chế tìm người online; Listen Together là trải nghiệm quản lý phòng.
- Khi đã ở trong phòng, hiển thị room indicator và trạng thái nghe chung.

# 5.2 Màn hình Listen Together

Màn hình gồm hai trạng thái chính:

**A. Chưa ở trong phòng**

- Tiêu đề: “Nghe nhạc cùng bạn bè”.
- Nút chính: “Tạo phòng nghe chung”.
- Khu vực tham gia: input “Nhập mã phòng” + nút “Tham gia”.
- Link mời có thể tự điền mã phòng nếu người dùng mở URL dạng invite.
- Hiển thị hướng dẫn ngắn: phòng 2–6 người, khoảng cách tối đa 600 km.

**B. Đang ở trong phòng**

- Tên phòng và badge vai trò Host/Thành viên.
- Mã phòng và nút “Sao chép mã”.
- Link mời và nút “Sao chép link”.
- Thẻ bài hát hiện tại: cover, tên bài, nghệ sĩ, trạng thái phát.
- Danh sách thành viên: avatar/initial, tên hiển thị, badge Host, trạng thái kết nối.
- Bộ đếm `n/6 người`.
- Nút “Mời bạn bè”.
- Nút “Rời phòng”.
- Chỉ Host được hiển thị hoặc kích hoạt quyền điều khiển phòng nếu kiến trúc hiện tại quy định Host-only.

# 5.3 Trạng thái và thông báo

- Loading: “Đang tạo phòng…” / “Đang tham gia phòng…”.
- Thành công: “Đã tạo phòng”, “Đã tham gia phòng”.
- Sai mã: “Mã phòng không hợp lệ hoặc đã hết hạn”.
- Phòng đầy: “Phòng đã đủ 6 người”.
- Quá xa: “Bạn đang ở ngoài phạm vi 600 km của Host”.
- Chưa cấp quyền vị trí: hướng dẫn cấp quyền hoặc không cho tiếp tục nếu kiểm tra khoảng cách là điều kiện bắt buộc.
- Mất kết nối: hiển thị “Đang kết nối lại…”; sau khi phục hồi hiển thị “Đã đồng bộ lại”.
- Lỗi máy chủ: thông báo có thể thử lại, không để UI ở trạng thái loading vô hạn.

# 5.4 Responsive và accessibility

- Desktop: nội dung phòng ở vùng chính; danh sách thành viên ở panel bên phải.
- Mobile: xếp dọc; danh sách thành viên có thể cuộn; các nút quan trọng đủ lớn để chạm.
- Dùng `button` cho hành động, `label` cho input, `role="status"`/`aria-live="polite"` cho thông báo.
- Không hiển thị tọa độ hoặc khoảng cách chính xác của thành viên.

# 6. Hợp đồng Frontend – Backend cần thống nhất

Các endpoint dưới đây là **đề xuất hợp đồng**, không phải khẳng định API hiện tại đã tồn tại. Cần thống nhất với Nguyễn Văn Định trước khi gắn fetch thật.

| Method | Endpoint đề xuất                               | Mục đích                                                                               |
| ------ | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| POST   | `/api/listening-rooms`                         | Tạo phòng; trả `roomId`, `roomCode`, `inviteUrl`, `host`, `expiresAt`.                 |
| POST   | `/api/listening-rooms/join`                    | Tham gia bằng `roomCode`; nhận lỗi `ROOM_NOT_FOUND`, `ROOM_FULL`, `DISTANCE_LIMIT`.    |
| GET    | `/api/listening-rooms/{roomId}`                | Lấy thông tin phòng và participants.                                                   |
| POST   | `/api/listening-rooms/{roomId}/leave`          | Rời phòng.                                                                             |
| POST   | `/api/listening-rooms/{roomId}/location-check` | Kiểm tra khoảng cách sau khi người dùng cấp quyền vị trí; không trả tọa độ người khác. |

# Response tạo phòng đề xuất

```json
{
  "roomId": "server-generated-id",
  "roomCode": "AB12CD",
  "inviteUrl": "https://rinn15.github.io/spotisix/?room=AB12CD",
  "role": "host",
  "memberCount": 1,
  "capacity": 6,
  "expiresAt": "2026-11-09T15:00:00Z"
}
```

# 7. Test Case cho Product Owner

| TC ID  | Tình huống                              | Kết quả mong đợi                                                          | AC            |
| ------ | --------------------------------------- | ------------------------------------------------------------------------- | ------------- |
| TC5.01 | Tạo phòng khi đã đăng nhập              | Phòng được tạo; người tạo là Host.                                        | AC5.1         |
| TC5.02 | Tạo phòng khi chưa phát bài             | UI hướng dẫn phát một bài trước hoặc xử lý theo quy tắc sản phẩm.         | AC5.1         |
| TC5.03 | Sao chép mã phòng                       | Clipboard nhận đúng mã; UI báo đã sao chép.                               | AC5.2         |
| TC5.04 | Sao chép link mời                       | Link mở đúng ứng dụng và giữ mã phòng.                                    | AC5.2         |
| TC5.05 | Tham gia bằng mã đúng                   | Người dùng vào đúng phòng.                                                | AC5.3         |
| TC5.06 | Nhập mã sai/hết hạn                     | Không tham gia; hiển thị lỗi rõ ràng.                                     | AC5.3         |
| TC5.07 | Người thứ 6 tham gia                    | Tham gia thành công; số lượng là 6/6.                                     | AC5.4         |
| TC5.08 | Người thứ 7 tham gia                    | Bị từ chối; UI báo phòng đã đầy.                                          | AC5.4         |
| TC5.09 | Người cách Host 600 km                  | Được tham gia nếu các điều kiện khác hợp lệ.                              | AC5.5         |
| TC5.10 | Người cách Host trên 600 km             | Bị từ chối; không tiết lộ tọa độ của Host.                                | AC5.5, AC5.10 |
| TC5.11 | Từ chối quyền vị trí                    | Không tự ý truy cập vị trí; hiển thị hướng xử lý.                         | AC5.10        |
| TC5.12 | Host Play/Pause                         | Guest nhận đúng trạng thái.                                               | AC5.6, AC5.7  |
| TC5.13 | Host Next/Previous/Seek                 | Guest chuyển đúng bài/vị trí.                                             | AC5.6, AC5.7  |
| TC5.14 | Thành viên rời phòng                    | Participant list và bộ đếm cập nhật.                                      | AC5.8         |
| TC5.15 | Guest mất mạng rồi kết nối lại          | Guest nhận snapshot mới nhất và phát đúng vị trí.                         | AC5.9         |
| TC5.16 | Host rời phòng                          | Phòng kết thúc hoặc chuyển Host theo quy tắc đã thống nhất; UI thông báo. | AC5.8         |
| TC5.17 | Dùng Listen Together với Playlist       | Chức năng playlist hiện tại không bị hỏng.                                | AC5.11        |
| TC5.18 | Dùng Listen Together với Recommendation | Có thể phát bài đề xuất và đồng bộ trong phòng.                           | AC5.11        |
| TC5.19 | Regression Search/Player/Favorite       | Các chức năng Sprint 1–4 vẫn hoạt động.                                   | AC5.12        |

# 8. Phân chia trách nhiệm và dependency

| Issue | Thành viên            | Dependency cần cung cấp                                                    |
| ----- | --------------------- | -------------------------------------------------------------------------- |
| #41   | Hoàng Mạnh Dũng       | User Story, UI/UX, giao diện tạo/chia sẻ/quản lý phòng, PO testing         |
| #42   | Nguyễn Văn Định       | API create/join/leave, room code/link, participant data, capacity          |
| #43   | Lê Nguyễn Mạnh Đạt    | UI nhập mã/link, participant list, lỗi join, realtime frontend integration |
| #44   | Phùng Nhật Hoàng      | Playback sync, latency compensation, resync, distance validation           |
| #45   | Nguyễn Dương Tấn Bình | Integration và regression test                                             |

# Điều kiện để Issue #41 được nghiệm thu

- [ ] User Story và AC được nhóm thống nhất.
- [ ] UI trạng thái chưa có phòng và đang ở trong phòng đã được thiết kế.
- [ ] Có UI tạo phòng và tham gia bằng mã/link.
- [ ] Có UI chia sẻ mã/link.
- [ ] Có participant list và trạng thái kết nối.
- [ ] Có loading, empty, error, full-room, distance-limit và reconnect states.
- [ ] Frontend tích hợp API thật từ issue #42/#43.
- [ ] Không làm hỏng Nearby, Music Player, Playlist, Recommendation.
- [ ] Test case được chạy trên ít nhất hai tài khoản/thiết bị; capacity cần test 6 và 7 người.
- [ ] Kết quả test được ghi nhận; lỗi chưa đạt được chuyển thành issue/bug riêng.
