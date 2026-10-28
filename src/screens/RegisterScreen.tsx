import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {UserPlus, User, Mail, Lock} from 'lucide-react-native';
import {colors} from '../theme/colors';
import {register, friendlyAuthError} from '../services/authService';

interface Props {
  navigation: any;
}

const RegisterScreen: React.FC<Props> = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    let error = '';
    if (!name.trim()) error = 'Vui lòng nhập họ tên';
    else if (!email.trim()) error = 'Vui lòng nhập email';
    else if (password.length < 6) error = 'Mật khẩu tối thiểu 6 ký tự';
    else if (password !== confirm) error = 'Mật khẩu nhập lại không khớp';
    if (error) {
      Alert.alert('Đăng ký', error);
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (e: any) {
      Alert.alert('Đăng ký thất bại', friendlyAuthError(e.code));
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.top}>
        <View style={styles.logoCircle}>
          <UserPlus size={36} color="#fff" />
        </View>
        <Text style={styles.appName}>Đăng ký</Text>
        <Text style={styles.subtitle}>Tạo tài khoản ChatApp</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputWrap}>
          <User size={18} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Họ tên"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputWrap}>
          <Mail size={18} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrap}>
          <Lock size={18} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputWrap}>
          <Lock size={18} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor={colors.textMuted}
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && {opacity: 0.6}]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}>
          <Text style={styles.buttonText}>{loading ? 'Đang đăng ký...' : 'Đăng ký'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.hint}>
            Đã có tài khoản? <Text style={styles.link}>Đăng nhập</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  top: {
    flex: 0.7,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 40,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
  },
  form: {
    flex: 1.6,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    height: 54,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  hint: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 18,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default RegisterScreen;
