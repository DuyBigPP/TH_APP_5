import {
  ref,
  push,
  update,
  onValue,
  query,
  orderByChild,
  serverTimestamp,
  increment,
} from 'firebase/database';
import {auth, db} from './firebase';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  online: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  type: 'text' | 'location';
  text?: string;
  lat?: number;
  lng?: number;
  createdAt: number;
}

export interface ChatSummary {
  otherId: string;
  name: string;
  lastMessage: string;
  lastTime: number;
  unread: number;
}

export const chatId = (a: string, b: string) => [a, b].sort().join('_');

const myUid = () => auth.currentUser!.uid;
const myName = () => auth.currentUser?.displayName ?? 'Người dùng';

// Mọi hàm subscribe* trả về hàm hủy lắng nghe, gọi trong cleanup của useEffect
export function subscribeUsers(cb: (users: AppUser[]) => void) {
  return onValue(ref(db, 'users'), snap => {
    const list: AppUser[] = [];
    snap.forEach(child => {
      if (child.key !== myUid()) list.push({id: child.key!, ...child.val()});
    });
    cb(list);
  });
}

export function subscribeUser(uid: string, cb: (user: AppUser | null) => void) {
  return onValue(ref(db, `users/${uid}`), snap =>
    cb(snap.exists() ? {id: uid, ...snap.val()} : null),
  );
}

export function subscribeMessages(otherId: string, cb: (msgs: Message[]) => void) {
  const q = query(ref(db, `chats/${chatId(myUid(), otherId)}/messages`), orderByChild('createdAt'));
  return onValue(q, snap => {
    const list: Message[] = [];
    snap.forEach(child => {
      list.push({id: child.key!, ...child.val()});
    });
    cb(list);
  });
}

export function subscribeUserChats(cb: (chats: ChatSummary[]) => void) {
  return onValue(ref(db, `userChats/${myUid()}`), snap => {
    const list: ChatSummary[] = [];
    snap.forEach(child => {
      // bỏ qua node chỉ có unread (mở chat nhưng chưa ai nhắn)
      if (child.val().lastTime) list.push({otherId: child.key!, ...child.val()});
    });
    list.sort((a, b) => b.lastTime - a.lastTime);
    cb(list);
  });
}

async function send(otherId: string, otherName: string, msg: Omit<Message, 'id' | 'createdAt'>, preview: string) {
  const me = myUid();
  const cid = chatId(me, otherId);
  const key = push(ref(db, `chats/${cid}/messages`)).key;
  // Ghi tin + cập nhật 2 phía của userChats trong 1 lần update (atomic)
  await update(ref(db), {
    [`chats/${cid}/messages/${key}`]: {...msg, createdAt: serverTimestamp()},
    [`userChats/${me}/${otherId}/name`]: otherName,
    [`userChats/${me}/${otherId}/lastMessage`]: preview,
    [`userChats/${me}/${otherId}/lastTime`]: serverTimestamp(),
    [`userChats/${me}/${otherId}/unread`]: 0,
    [`userChats/${otherId}/${me}/name`]: myName(),
    [`userChats/${otherId}/${me}/lastMessage`]: preview,
    [`userChats/${otherId}/${me}/lastTime`]: serverTimestamp(),
    [`userChats/${otherId}/${me}/unread`]: increment(1),
  });
}

export function sendText(otherId: string, otherName: string, text: string) {
  return send(otherId, otherName, {senderId: myUid(), type: 'text', text}, text);
}

export function sendLocation(otherId: string, otherName: string, lat: number, lng: number) {
  return send(otherId, otherName, {senderId: myUid(), type: 'location', lat, lng}, '📍 Vị trí');
}

export function markRead(otherId: string) {
  return update(ref(db, `userChats/${myUid()}/${otherId}`), {unread: 0});
}

export function formatTime(ts?: number) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
