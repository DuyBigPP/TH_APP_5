export const colors = {
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  primaryLight: '#EFF6FF',
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  success: '#22C55E',
  danger: '#EF4444',
  unreadBg: '#EFF6FF',
};

export const avatarColors = [
  '#2563EB',
  '#7C3AED',
  '#DB2777',
  '#059669',
  '#EA580C',
  '#0891B2',
  '#4F46E5',
  '#BE123C',
];

export function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}
