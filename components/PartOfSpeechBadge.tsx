import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

const PART_OF_SPEECH_COLORS: Record<string, string> = {
  noun: Colors.primary[500],
  verb: '#22c55e',
  adjective: '#f59e0b',
  adverb: '#ec4899',
  preposition: '#8b5cf6',
  conjunction: '#06b6d4',
  interjection: '#f97316',
  pronoun: '#6366f1',
  article: '#14b8a6',
};

function getColor(partOfSpeech: string): string {
  return PART_OF_SPEECH_COLORS[partOfSpeech.toLowerCase()] || Colors.neutral[500];
}

interface PartOfSpeechBadgeProps {
  partOfSpeech: string;
}

export function PartOfSpeechBadge({ partOfSpeech }: PartOfSpeechBadgeProps) {
  const color = getColor(partOfSpeech);

  return (
    <View style={[styles.badge, { backgroundColor: color + '18', borderLeftColor: color }]}>
      <Text style={[styles.text, { color }]}>{partOfSpeech}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderLeftWidth: 3,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  text: {
    ...Typography.h4,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});
