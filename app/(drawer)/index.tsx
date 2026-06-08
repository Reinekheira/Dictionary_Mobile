import React, { useCallback, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useDictionary } from '@/hooks/useDictionary';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { DictionaryEntry } from '@/types/dictionary';
import { BookOpen } from 'lucide-react-native';

export default function SearchScreen() {
  const router = useRouter();
  const { entry, error, status, searchWord, reset } = useDictionary();
  const { addToHistory, history } = useSearchHistory();
  const lastSearchRef = useRef<string>('');

  const handleSearch = useCallback(
    async (word: string) => {
      lastSearchRef.current = word;
      const result = await searchWord(word);
      if (result) {
        addToHistory(word);
        router.push({
          pathname: '/(drawer)/word-detail',
          params: { word: word.toLowerCase().trim() },
        });
      }
    },
    [searchWord, addToHistory, router]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.heroSection}>
        <View style={styles.heroIconWrapper}>
          <BookOpen size={32} color={Colors.primary[500]} strokeWidth={1.5} />
        </View>
        <Text style={styles.heroTitle}>Find Any Word</Text>
        <Text style={styles.heroSubtitle}>
          Discover definitions, pronunciations, and usage examples
        </Text>
      </View>

      <SearchBar onSearch={handleSearch} isLoading={status === 'loading'} />

      {status === 'idle' && !entry && !error && <EmptyState />}

      {status === 'loading' && <LoadingIndicator />}

      {status === 'error' && error && (
        <ErrorMessage message={error} onRetry={() => handleSearch(lastSearchRef.current)} />
      )}

      {history.length > 0 && status === 'idle' && (
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent Searches</Text>
          <View style={styles.recentList}>
            {history.slice(0, 5).map((item) => (
              <RecentChip
                key={item.word}
                word={item.word}
                onPress={() => handleSearch(item.word)}
              />
            ))}
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

function RecentChip({ word, onPress }: { word: string; onPress: () => void }) {
  return (
    <View style={chipStyles.container}>
      <Text style={chipStyles.text} onPress={onPress}>
        {word}
      </Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  text: {
    ...Typography.bodySmall,
    color: Colors.primary[700],
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  heroIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    ...Typography.h2,
    color: Colors.neutral[900],
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    ...Typography.bodySmall,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  recentTitle: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  recentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
