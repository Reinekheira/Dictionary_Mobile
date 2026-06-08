import { useState, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { Phonetic } from '@/types/dictionary';

export type PlaybackState = 'idle' | 'playing' | 'paused';

interface UseAudioReturn {
  playbackState: PlaybackState;
  activeAudioUrl: string | null;
  play: (audioUrl: string) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  togglePlayPause: (audioUrl: string) => Promise<void>;
  hasAudio: (phonetics: Phonetic[]) => boolean;
  getAudioSources: (phonetics: Phonetic[]) => { label: string; url: string }[];
}

export function useAudio(): UseAudioReturn {
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const unloadSound = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {
        // Sound may already be unloaded
      }
      soundRef.current = null;
    }
  }, []);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
      } catch {
        // Ignore
      }
      await unloadSound();
    }
    setPlaybackState('idle');
    setActiveAudioUrl(null);
  }, [unloadSound]);

  const play = useCallback(
    async (audioUrl: string) => {
      // If a different URL is playing, stop it first
      if (activeAudioUrl && activeAudioUrl !== audioUrl) {
        await stop();
      }

      // If same URL is paused, just resume
      if (activeAudioUrl === audioUrl && playbackState === 'paused') {
        try {
          await soundRef.current?.playAsync();
          setPlaybackState('playing');
          return;
        } catch {
          // Fall through to reload
        }
      }

      // Stop any existing sound
      await unloadSound();

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
        soundRef.current = sound;
        setActiveAudioUrl(audioUrl);
        setPlaybackState('playing');

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setPlaybackState('idle');
            setActiveAudioUrl(null);
            sound.unloadAsync();
            soundRef.current = null;
          }
        });

        await sound.playAsync();
      } catch {
        setPlaybackState('idle');
        setActiveAudioUrl(null);
        await unloadSound();
      }
    },
    [activeAudioUrl, playbackState, stop, unloadSound]
  );

  const pause = useCallback(async () => {
    if (soundRef.current && playbackState === 'playing') {
      try {
        await soundRef.current.pauseAsync();
        setPlaybackState('paused');
      } catch {
        // If pause fails, just stop
        await stop();
      }
    }
  }, [playbackState, stop]);

  const resume = useCallback(async () => {
    if (soundRef.current && playbackState === 'paused') {
      try {
        await soundRef.current.playAsync();
        setPlaybackState('playing');
      } catch {
        await stop();
      }
    }
  }, [playbackState, stop]);

  const togglePlayPause = useCallback(
    async (audioUrl: string) => {
      if (playbackState === 'idle' || activeAudioUrl !== audioUrl) {
        await play(audioUrl);
      } else if (playbackState === 'playing' && activeAudioUrl === audioUrl) {
        await pause();
      } else if (playbackState === 'paused' && activeAudioUrl === audioUrl) {
        await resume();
      }
    },
    [playbackState, activeAudioUrl, play, pause, resume]
  );

  const hasAudio = useCallback(
    (phonetics: Phonetic[]) => phonetics.some((p) => p.audio && p.audio.length > 0),
    []
  );

  const getAudioSources = useCallback((phonetics: Phonetic[]) => {
    const sources: { label: string; url: string }[] = [];
    const seen = new Set<string>();

    for (const p of phonetics) {
      if (p.audio && p.audio.length > 0 && !seen.has(p.audio)) {
        seen.add(p.audio);
        const url = new URL(p.audio);
        const filename = url.pathname.split('/').pop() || 'pronunciation';
        const label = filename.replace(/\.mp3$/i, '').replace(/-/g, ' ');
        sources.push({ label, url: p.audio });
      }
    }

    return sources;
  }, []);

  return {
    playbackState,
    activeAudioUrl,
    play,
    pause,
    resume,
    stop,
    togglePlayPause,
    hasAudio,
    getAudioSources,
  };
}
