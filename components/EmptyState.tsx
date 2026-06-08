import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

export function EmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <BookOpen size={56} color={Colors.neutral[300]} strokeWidth={1.2} />
      </View>
      <Text style={styles.title}>Search for a word</Text>
      <Text style={styles.subtitle}>
        Type any English word in the search bar above to find its definition, pronunciation, and
        examples.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconWrapper: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h3,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.neutral[500],
    textAlign: 'center',
    maxWidth: 280,
  },
});
