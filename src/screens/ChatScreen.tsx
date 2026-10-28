import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import {ArrowLeft, Send, MapPin} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import {auth} from '../services/firebase';
import {
  subscribeMessages,
  subscribeUser,
  sendText,
  sendLocation,
  markRead,
  formatTime,
  Message,
  AppUser,
} from '../services/chatService';
import {colors} from '../theme/colors';
import Avatar from '../components/Avatar';

interface Props {
  route: any;
  navigation: any;
}

async function requestLocationPermission() {
  if (Platform.OS !== 'android') return true;
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

const ChatScreen: React.FC<Props> = ({route, navigation}) => {
  const insets = useSafeAreaInsets();
  const {otherId, name} = route.params;
  const myId = auth.currentUser!.uid;
  const listRef = useRef<FlatList<Message>>(null);

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [other, setOther] = useState<AppUser | null>(null);
  const [sendingLocation, setSendingLocation] = useState(false);

  // return unsubscribe -> cleanup, tránh lắng nghe trùng làm tin hiện lặp
  useEffect(
    () =>
      subscribeMessages(otherId, msgs => {
        setMessages(msgs);
        markRead(otherId);
      }),
    [otherId],
  );
  useEffect(() => subscribeUser(otherId, setOther), [otherId]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendText(otherId, name, text).catch(e => Alert.alert('Lỗi gửi tin', e.message));
  };

  const shareLocation = async () => {
    if (!(await requestLocationPermission())) {
      Alert.alert('Không có quyền vị trí', 'Hãy cho phép ứng dụng truy cập vị trí để gửi vị trí.');
      return;
    }
    setSendingLocation(true);
    Geolocation.getCurrentPosition(
      pos => {
        sendLocation(otherId, name, pos.coords.latitude, pos.coords.longitude)
          .catch(e => Alert.alert('Lỗi gửi vị trí', e.message))
          .finally(() => setSendingLocation(false));
      },
      err => {
        setSendingLocation(false);
        Alert.alert('Không lấy được vị trí', err.message);
      },
      {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
    );
  };

  const openMap = (lat: number, lng: number) =>
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);

  const renderMessage = ({item}: {item: Message}) => {
    const isMe = item.senderId === myId;
    const isLocation = item.type === 'location';
    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowRight : styles.msgRowLeft]}>
        {!isMe && <Avatar name={name} size={32} />}
        <TouchableOpacity
          disabled={!isLocation}
          activeOpacity={0.8}
          onPress={() => openMap(item.lat!, item.lng!)}
          style={[
            styles.bubble,
            isMe ? styles.bubbleMe : styles.bubbleOther,
            isLocation && styles.bubbleLocation,
          ]}>
          {isLocation ? (
            <>
              <View style={styles.locationRow}>
                <MapPin size={18} color={colors.danger} />
                <Text style={styles.locationTitle}>Vị trí hiện tại</Text>
              </View>
              <Text style={styles.locationCoords}>
                {item.lat!.toFixed(5)}, {item.lng!.toFixed(5)}
              </Text>
              <Text style={styles.locationLink}>Nhấn để mở Google Maps</Text>
            </>
          ) : (
            <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>
              {item.text}
            </Text>
          )}
          <Text
            style={[
              styles.msgTime,
              isMe && !isLocation ? styles.msgTimeMe : styles.msgTimeOther,
            ]}>
            {formatTime(item.createdAt)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <View style={[styles.header, {paddingTop: insets.top + 12}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <View>
          <Avatar name={name} size={40} />
          <View
            style={[
              styles.onlineDot,
              {backgroundColor: other?.online ? colors.success : colors.textMuted},
            ]}
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{name}</Text>
          <Text style={styles.headerStatus}>
            {other?.online ? 'Đang hoạt động' : 'Không hoạt động'}
          </Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({animated: true})}
        onLayout={() => listRef.current?.scrollToEnd({animated: false})}
      />

      <View style={[styles.inputBar, {paddingBottom: insets.bottom + 12}]}>
        <TouchableOpacity
          style={[styles.locationBtn, sendingLocation && styles.sendBtnDisabled]}
          onPress={shareLocation}
          disabled={sendingLocation}
          accessibilityLabel="Gửi vị trí"
          activeOpacity={0.8}>
          <Text style={styles.locationBtnText}>📍</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim()}
          activeOpacity={0.8}>
          <Send size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  backBtn: {padding: 4},
  headerInfo: {flex: 1},
  headerName: {fontSize: 17, fontWeight: '800', color: '#fff'},
  headerStatus: {fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 1},
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  list: {padding: 16, paddingBottom: 8},
  msgRow: {flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end', gap: 8},
  msgRowRight: {justifyContent: 'flex-end'},
  msgRowLeft: {justifyContent: 'flex-start'},
  bubble: {maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18},
  bubbleMe: {backgroundColor: colors.primary, borderBottomRightRadius: 4},
  bubbleOther: {backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border},
  bubbleLocation: {backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FCD34D'},
  locationRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  locationTitle: {fontSize: 15, fontWeight: '700', color: colors.text},
  locationCoords: {fontSize: 13, color: colors.textSecondary, marginTop: 4},
  locationLink: {fontSize: 12, color: colors.primary, marginTop: 4, fontWeight: '600'},
  msgText: {fontSize: 15, lineHeight: 21},
  msgTextMe: {color: '#fff'},
  msgTextOther: {color: colors.text},
  msgTime: {fontSize: 10, marginTop: 4, alignSelf: 'flex-end'},
  msgTimeMe: {color: 'rgba(255,255,255,0.7)'},
  msgTimeOther: {color: colors.textMuted},
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  locationBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationBtnText: {fontSize: 20},
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 46,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {opacity: 0.5},
});

export default ChatScreen;
