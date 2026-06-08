import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { Definition } from '@/types/dictionary';

interface DefinitionCardProps {
  definition: Definition;
  index: number;
}

export function DefinitionCard({ definition, index }: DefinitionCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.definitionText}>{definition.definition}</Text>
        {definition.example && (
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleLabel}>Example</Text>
            <Text style={styles.exampleText}>&ldquo;{definition.example}&rdquo;</Text>
          </View>
        )}
        {definition.synonyms && definition.synonyms.length > 0 && (
          <View style={styles.tagRow}>
            <Text style={styles.tagLabel}>Synonyms: </Text>
            <Text style={styles.tagText}>{definition.synonyms.join(', ')}</Text>
          </View>
        )}
        {definition.antonyms && definition.antonyms.length > 0 && (
          <View style={styles.tagRow}>
            <Text style={styles.tagLabel}>Antonyms: </Text>
            <Text style={styles.tagText}>{definition.antonyms.join(', ')}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  numberText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.neutral[600],
  },
  content: {
    flex: 1,
  },
  definitionText: {
    ...Typography.body,
    color: Colors.neutral[800],
  },
  exampleContainer: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary[300],
  },
  exampleLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.primary[600],
    marginBottom: 2,
  },
  exampleText: {
    ...Typography.bodySmall,
    color: Colors.neutral[700],
    fontStyle: 'italic',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.xs,
  },
  tagLabel: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.neutral[500],
  },
  tagText: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
  },
});
