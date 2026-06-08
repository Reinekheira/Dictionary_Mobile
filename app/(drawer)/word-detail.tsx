import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SearchBar } from '@/components/SearchBar';
import { AudioSourcesList, DisabledAudioButton } from '@/components/AudioButton';
import { PartOfSpeechBadge } from '@/components/PartOfSpeechBadge';
import { DefinitionCard } from '@/components/DefinitionCard';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useDictionary } from '@/hooks/useDictionary';
import { useAudio } from '@/hooks/useAudio';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

export default function WordDetailScreen() {
  const { word } = useLocalSearchParams<{ word: string }>();
  const router = useRouter();
  const { entry, error, status, searchWord } = useDictionary();
  const {
    playbackState,
    activeAudioUrl,
    togglePlayPause,
    stop,
    hasAudio,
    getAudioSources,
  } = useAudio();
  const { addToHistory } = useSearchHistory();
  const [lastSearch, setLastSearch] = useState('');

  useEffect(() => {
    if (word && word !== lastSearch) {
      setLastSearch(word);
      searchWord(word).then((result) => {
        if (result) {
          addToHistory(word);
        }
      });
    }
  }, [word]);

  const handleSearch = useCallback(
    async (newWord: string) => {
      const trimmed = newWord.trim().toLowerCase();
      if (trimmed) {
        stop();
        router.setParams({ word: trimmed });
      }
    },
    [router, stop]
  );

  const handleRetry = useCallback(() => {
    if (lastSearch) {
      searchWord(lastSearch);
    }
  }, [lastSearch, searchWord]);

  const phoneticText = entry?.phonetic || entry?.phonetics?.find((p) => p.text)?.text;
  const audioSources = entry ? getAudioSources(entry.phonetics) : [];
  const hasPronunciation = entry ? hasAudio(entry.phonetics) : false;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SearchBar onSearch={handleSearch} isLoading={status === 'loading'} />

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {status === 'loading' && <LoadingIndicator />}

        {status === 'error' && error && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {status === 'success' && entry && (
          <View style={styles.resultContainer}>
            <View style={styles.wordHeader}>
              <View style={styles.wordInfo}>
                <Text style={styles.wordText}>{entry.word}</Text>
                {phoneticText && <Text style={styles.phoneticText}>{phoneticText}</Text>}
              </View>
              {hasPronunciation ? (
                <AudioSourcesList
                  sources={audioSources}
                  playbackState={playbackState}
                  activeAudioUrl={activeAudioUrl}
                  onToggle={togglePlayPause}
                />
              ) : (
                <DisabledAudioButton />
              )}
            </View>

            {/* Playback state indicator */}
            {playbackState !== 'idle' && activeAudioUrl && (
              <View style={styles.playbackIndicator}>
                <View style={styles.playbackDot} />
                <Text style={styles.playbackText}>
                  {playbackState === 'playing' ? 'Playing pronunciation...' : 'Paused'}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            {entry.meanings.map((meaning, mIndex) => (
              <View key={mIndex} style={styles.meaningSection}>
                <PartOfSpeechBadge partOfSpeech={meaning.partOfSpeech} />
                {meaning.definitions.map((def, dIndex) => (
                  <DefinitionCard key={dIndex} definition={def} index={dIndex} />
                ))}
                {meaning.synonyms && meaning.synonyms.length > 0 && (
                  <View style={styles.tagSection}>
                    <Text style={styles.tagLabel}>Synonyms: </Text>
                    <Text style={styles.tagText}>{meaning.synonyms.join(', ')}</Text>
                  </View>
                )}
                {meaning.antonyms && meaning.antonyms.length > 0 && (
                  <View style={styles.tagSection}>
                    <Text style={styles.tagLabel}>Antonyms: </Text>
                    <Text style={styles.tagText}>{meaning.antonyms.join(', ')}</Text>
                  </View>
                )}
              </View>
            ))}

            {entry.sourceUrls && entry.sourceUrls.length > 0 && (
              <View style={styles.sourceSection}>
                <Text style={styles.sourceLabel}>Source</Text>
                <Text style={styles.sourceText}>{entry.sourceUrls.join(', ')}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: Spacing.xxl,
  },
  resultContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  wordInfo: {
    flex: 1,
  },
  wordText: {
    ...Typography.h1,
    color: Colors.neutral[900],
    textTransform: 'lowercase',
  },
  phoneticText: {
    ...Typography.body,
    color: Colors.primary[500],
    marginTop: 2,
  },
  playbackIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  playbackDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success[500],
  },
  playbackText: {
    ...Typography.caption,
    color: Colors.neutral[500],
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[200],
    marginBottom: Spacing.lg,
  },
  meaningSection: {
    marginBottom: Spacing.lg,
  },
  tagSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
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
  sourceSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  sourceLabel: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.neutral[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sourceText: {
    ...Typography.bodySmall,
    color: Colors.primary[500],
  },
});
