import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {Bell} from 'lucide-react-native';
import {appNotifications, AppNotification} from '../data/mockData';
import {colors} from '../theme/colors';

const NotificationsScreen: React.FC = () => {
  const [data, setData] = useState<AppNotification[]>(appNotifications);

  const markAsRead = (id: string) => {
    setData(prev => prev.map(n => (n.id === id ? {...n, isRead: true} : n)));
  };

  const markAllAsRead = () => {
    setData(prev => prev.map(n => ({...n, isRead: true})));
  };

  const unreadCount = data.filter(n => !n.isRead).length;

  const renderItem = ({item}: {item: AppNotification}) => (
    <TouchableOpacity
      style={[styles.item, !item.isRead && styles.itemUnread]}
      activeOpacity={0.7}
      onPress={() => markAsRead(item.id)}>
      <View style={[styles.iconWrap, !item.isRead && styles.iconWrapUnread]}>
        <Bell size={20} color={!item.isRead ? colors.primary : colors.textMuted} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !item.isRead && styles.titleUnread]}>
          {item.title}
        </Text>
        <Text style={styles.text} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {!item.isRead && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Thông báo</Text>
          <Text style={styles.headerCount}>
            {unreadCount > 0 ? `${unreadCount} chưa đọc` : 'Đã đọc tất cả'}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAll}>Đọc tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {fontSize: 26, fontWeight: '800', color: colors.text},
  headerCount: {fontSize: 13, color: colors.textSecondary, marginTop: 2},
  markAll: {color: colors.primary, fontSize: 14, fontWeight: '700'},
  list: {paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8},
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemUnread: {
    backgroundColor: colors.unreadBg,
    borderColor: '#BFDBFE',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapUnread: {backgroundColor: '#DBEAFE'},
  content: {flex: 1, marginLeft: 12},
  title: {fontSize: 15, fontWeight: '600', color: colors.text},
  titleUnread: {fontWeight: '800'},
  text: {fontSize: 14, color: colors.textSecondary, marginTop: 2, lineHeight: 20},
  time: {fontSize: 12, color: colors.textMuted, marginTop: 6},
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginLeft: 8,
  },
});

export default NotificationsScreen;
