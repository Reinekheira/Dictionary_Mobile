import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <AlertCircle size={40} color={Colors.error[500]} strokeWidth={1.5} />
      </View>
      <Text style={styles.messageText}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
          <RefreshCw size={16} color={Colors.white} strokeWidth={2} />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    marginHorizontal: Spacing.md,
  },
  iconWrapper: {
    marginBottom: Spacing.md,
  },
  messageText: {
    ...Typography.body,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  retryText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.white,
  },
});
