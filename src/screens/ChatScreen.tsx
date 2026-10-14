import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {ArrowLeft, Send} from 'lucide-react-native';
import {conversations} from '../data/mockData';
import {colors} from '../theme/colors';
import Avatar from '../components/Avatar';

interface Props {
  route: any;
  navigation: any;
}

const ChatScreen: React.FC<Props> = ({route, navigation}) => {
  const {conversationId} = route.params ?? {};
  const conversation = conversations.find(c => c.id === conversationId) ?? conversations[0];

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(conversation.messages);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages(prev => [
      ...prev,
      {id: `m${Date.now()}`, text: input.trim(), sender: 'me', time},
    ]);
    setInput('');
  };

  const renderMessage = ({item}: {item: (typeof messages)[0]}) => {
    const isMe = item.sender === 'me';
    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowRight : styles.msgRowLeft]}>
        {!isMe && <Avatar name={conversation.user.name} index={Number(conversation.user.id)} size={32} />}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>
            {item.text}
          </Text>
          <Text style={[styles.msgTime, isMe ? styles.msgTimeMe : styles.msgTimeOther]}>
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Avatar name={conversation.user.name} index={Number(conversation.user.id)} size={40} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{conversation.user.name}</Text>
          <Text style={styles.headerStatus}>
            {conversation.user.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
          </Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputBar}>
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
  list: {padding: 16, paddingBottom: 8},
  msgRow: {flexDirection: 'row', marginBottom: 10, alignItems: 'flex-end', gap: 8},
  msgRowRight: {justifyContent: 'flex-end'},
  msgRowLeft: {justifyContent: 'flex-start'},
  bubble: {maxWidth: '75%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18},
  bubbleMe: {backgroundColor: colors.primary, borderBottomRightRadius: 4},
  bubbleOther: {backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border},
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
