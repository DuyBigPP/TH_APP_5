import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {avatarColors, getInitials} from '../theme/colors';

interface AvatarProps {
  name: string;
  index?: number;
  size?: number;
}

// không truyền index -> màu tính theo tên, cùng một người luôn cùng màu
const hashName = (name: string) =>
  [...name].reduce((h, c) => (h * 17 + c.charCodeAt(0)) | 0, 0) >>> 0;

const Avatar: React.FC<AvatarProps> = ({name, index, size = 52}) => {
  const bgColor = avatarColors[(index ?? hashName(name)) % avatarColors.length];
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: bgColor, width: size, height: size, borderRadius: size / 2},
      ]}>
      <Text style={[styles.text, {fontSize: size * 0.36}]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default Avatar;
