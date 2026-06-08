import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

export function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary[500]} />
      <Text style={styles.text}>Looking up definition...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  text: {
    ...Typography.bodySmall,
    color: Colors.neutral[500],
  },
});
