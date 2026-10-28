import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Switch, Alert} from 'react-native';
import {LogOut, Bell, Volume2, ChevronRight} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {currentUser} from '../data/mockData';
import {colors} from '../theme/colors';
import Avatar from '../components/Avatar';

interface Props {
  navigation: any;
}

const SettingsScreen: React.FC<Props> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      {text: 'Hủy', style: 'cancel'},
      {text: 'Đăng xuất', style: 'destructive', onPress: () => navigation.replace('Login')},
    ]);
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top + 12}]}>
      <Text style={styles.headerTitle}>Cài đặt</Text>

      <View style={styles.profileCard}>
        <Avatar name={currentUser.name} index={0} size={64} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.email}>minh.tran@example.com</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>Đang hoạt động</Text>
          </View>
        </View>
        <ChevronRight size={20} color={colors.textMuted} />
      </View>

      <Text style={styles.sectionTitle}>Tùy chọn</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Bell size={18} color={colors.primary} />
            </View>
            <Text style={styles.label}>Thông báo đẩy</Text>
          </View>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Volume2 size={18} color={colors.primary} />
            </View>
            <Text style={styles.label}>Âm thanh</Text>
          </View>
          <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
        <LogOut size={18} color="#fff" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 16},
  headerTitle: {fontSize: 26, fontWeight: '800', color: colors.text, marginLeft: 4, marginBottom: 14},
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileInfo: {flex: 1, marginLeft: 14},
  name: {fontSize: 18, fontWeight: '800', color: colors.text},
  email: {fontSize: 13, color: colors.textSecondary, marginTop: 2},
  statusRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6},
  onlineDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success},
  statusText: {fontSize: 12, color: colors.success, fontWeight: '600'},
  sectionTitle: {fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginTop: 24, marginBottom: 10, marginLeft: 4},
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14},
  rowLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  rowIcon: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center'},
  label: {fontSize: 15, fontWeight: '600', color: colors.text},
  divider: {height: 1, backgroundColor: colors.border},
  logoutButton: {
    flexDirection: 'row',
    marginTop: 24,
    backgroundColor: colors.danger,
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {color: '#fff', fontSize: 16, fontWeight: '700'},
});

export default SettingsScreen;
