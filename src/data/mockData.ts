export interface User {
  id: string;
  name: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: Message[];
}

export interface AppNotification {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}

export const currentUser: User = {
  id: 'me',
  name: 'Minh Tran',
  isOnline: true,
};

export const users: User[] = [
  {id: '1', name: 'Nguyen Van An', isOnline: true},
  {id: '2', name: 'Tran Thi Binh', isOnline: false},
  {id: '3', name: 'Le Minh Chau', isOnline: true},
  {id: '4', name: 'Pham Thu Dung', isOnline: true},
  {id: '5', name: 'Hoang Van Em', isOnline: false},
  {id: '6', name: 'Vu Thi Phuong', isOnline: true},
  {id: '7', name: 'Do Quoc Bao', isOnline: false},
  {id: '8', name: 'Ngo Thi Hoa', isOnline: true},
];

export const conversations: Conversation[] = [
  {
    id: '1',
    user: users[0],
    lastMessage: 'Ok, mai mình gửi file cho bạn nhé',
    time: '10:30',
    unreadCount: 2,
    messages: [
      {id: 'm1', text: 'Chào bạn, dự án tới đâu rồi?', sender: 'other', time: '10:00'},
      {id: 'm2', text: 'Mình vừa xong phần giao diện', sender: 'me', time: '10:05'},
      {id: 'm3', text: 'Tốt quá, còn phần API thì sao?', sender: 'other', time: '10:10'},
      {id: 'm4', text: 'Ok, mai mình gửi file cho bạn nhé', sender: 'other', time: '10:30'},
    ],
  },
  {
    id: '2',
    user: users[1],
    lastMessage: 'Hẹn gặp lại ngày mai nhé!',
    time: '09:15',
    unreadCount: 0,
    messages: [
      {id: 'm5', text: 'Chị ơi em gửi báo cáo rồi ạ', sender: 'me', time: '09:00'},
      {id: 'm6', text: 'Chị nhận được rồi, cảm ơn em', sender: 'other', time: '09:05'},
      {id: 'm7', text: 'Hẹn gặp lại ngày mai nhé!', sender: 'other', time: '09:15'},
    ],
  },
  {
    id: '3',
    user: users[2],
    lastMessage: 'Cuộc họp dời sang 3 giờ chiều',
    time: '08:45',
    unreadCount: 1,
    messages: [
      {id: 'm8', text: 'Cuộc họp lúc mấy giờ vậy anh?', sender: 'me', time: '08:30'},
      {id: 'm9', text: 'Cuộc họp dời sang 3 giờ chiều', sender: 'other', time: '08:45'},
    ],
  },
  {
    id: '4',
    user: users[3],
    lastMessage: 'Mình đã gửi tài liệu qua mail',
    time: 'Hôm qua',
    unreadCount: 0,
    messages: [
      {id: 'm10', text: 'Bạn gửi giúp mình tài liệu nhé', sender: 'me', time: '14:00'},
      {id: 'm11', text: 'Mình đã gửi tài liệu qua mail', sender: 'other', time: '14:30'},
    ],
  },
  {
    id: '5',
    user: users[4],
    lastMessage: 'Cảm ơn bạn đã giúp đỡ!',
    time: 'Hôm qua',
    unreadCount: 3,
    messages: [
      {id: 'm12', text: 'Bạn rảnh không giúp mình chút', sender: 'other', time: '16:00'},
      {id: 'm13', text: 'Ok, bạn nói đi', sender: 'me', time: '16:10'},
      {id: 'm14', text: 'Cảm ơn bạn đã giúp đỡ!', sender: 'other', time: '16:30'},
    ],
  },
];

export const appNotifications: AppNotification[] = [
  {id: '1', title: 'Tin nhắn mới', content: 'Nguyen Van An đã gửi cho bạn 2 tin nhắn', time: '10:30', isRead: false},
  {id: '2', title: 'Nhắc họp', content: 'Cuộc họp nhóm lúc 3 giờ chiều hôm nay', time: '09:15', isRead: false},
  {id: '3', title: 'Tài liệu mới', content: 'Pham Thu Dung đã chia sẻ tài liệu với bạn', time: '08:45', isRead: false},
  {id: '4', title: 'Tin nhắn mới', content: 'Tran Thi Binh: Hẹn gặp lại ngày mai nhé!', time: 'Hôm qua', isRead: true},
  {id: '5', title: 'Cập nhật hệ thống', content: 'Ứng dụng đã được cập nhật lên phiên bản mới', time: 'Hôm qua', isRead: true},
];
