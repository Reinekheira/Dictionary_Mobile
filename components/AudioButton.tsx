import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { PlaybackState } from '@/hooks/useAudio';

interface AudioButtonProps {
  audioUrl: string;
  label?: string;
  playbackState: PlaybackState;
  isActiveUrl: boolean;
  onToggle: (audioUrl: string) => void;
}

export function AudioButton({
  audioUrl,
  label,
  playbackState,
  isActiveUrl,
  onToggle,
}: AudioButtonProps) {
  const isPlaying = isActiveUrl && playbackState === 'playing';
  const isPaused = isActiveUrl && playbackState === 'paused';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPlaying && styles.buttonPlaying,
        isPaused && styles.buttonPaused,
      ]}
      onPress={() => onToggle(audioUrl)}
      activeOpacity={0.7}
    >
      {isPlaying ? (
        <Pause size={20} color={Colors.white} strokeWidth={2.5} />
      ) : isPaused ? (
        <Play size={20} color={Colors.primary[600]} strokeWidth={2.5} fill={Colors.primary[600]} />
      ) : (
        <Volume2 size={20} color={Colors.primary[600]} strokeWidth={2} />
      )}
    </TouchableOpacity>
  );
}

interface DisabledAudioButtonProps {}

export function DisabledAudioButton({}: DisabledAudioButtonProps) {
  return (
    <View style={[styles.button, styles.buttonDisabled]}>
      <VolumeX size={20} color={Colors.neutral[300]} strokeWidth={2} />
    </View>
  );
}

interface AudioSourcesListProps {
  sources: { label: string; url: string }[];
  playbackState: PlaybackState;
  activeAudioUrl: string | null;
  onToggle: (audioUrl: string) => void;
}

export function AudioSourcesList({
  sources,
  playbackState,
  activeAudioUrl,
  onToggle,
}: AudioSourcesListProps) {
  if (sources.length === 0) return null;

  // If only one source, show a single button
  if (sources.length === 1) {
    return (
      <AudioButton
        audioUrl={sources[0].url}
        playbackState={playbackState}
        isActiveUrl={activeAudioUrl === sources[0].url}
        onToggle={onToggle}
      />
    );
  }

  // Multiple sources: show each with its label
  return (
    <View style={styles.sourcesList}>
      {sources.map((source) => (
        <View key={source.url} style={styles.sourceRow}>
          <AudioButton
            audioUrl={source.url}
            label={source.label}
            playbackState={playbackState}
            isActiveUrl={activeAudioUrl === source.url}
            onToggle={onToggle}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary[100],
  },
  buttonPlaying: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[600],
  },
  buttonPaused: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[300],
  },
  buttonDisabled: {
    backgroundColor: Colors.neutral[100],
    borderColor: Colors.neutral[200],
  },
  sourcesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
