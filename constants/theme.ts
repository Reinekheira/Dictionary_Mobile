export const Colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a5f',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  white: '#ffffff',
  background: '#f8fafc',
  surface: '#ffffff',
};

export const Typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 38 },
  h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 29 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 24 },
  h4: { fontSize: 18, fontWeight: '500' as const, lineHeight: 22 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
