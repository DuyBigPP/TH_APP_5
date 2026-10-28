// Dữ liệu chat đã chuyển sang Firebase (src/services). Chỉ giữ thông báo như Bài 4.
export interface AppNotification {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}

export const appNotifications: AppNotification[] = [
  {id: '1', title: 'Tin nhắn mới', content: 'Nguyen Van An đã gửi cho bạn 2 tin nhắn', time: '10:30', isRead: false},
  {id: '2', title: 'Nhắc họp', content: 'Cuộc họp nhóm lúc 3 giờ chiều hôm nay', time: '09:15', isRead: false},
  {id: '3', title: 'Tài liệu mới', content: 'Pham Thu Dung đã chia sẻ tài liệu với bạn', time: '08:45', isRead: false},
  {id: '4', title: 'Tin nhắn mới', content: 'Tran Thi Binh: Hẹn gặp lại ngày mai nhé!', time: 'Hôm qua', isRead: true},
  {id: '5', title: 'Cập nhật hệ thống', content: 'Ứng dụng đã được cập nhật lên phiên bản mới', time: 'Hôm qua', isRead: true},
];
