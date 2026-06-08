import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface SearchBarProps {
  onSearch: (word: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function SearchBar({ onSearch, isLoading, placeholder = 'Search for a word...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Search size={20} color={Colors.neutral[400]} strokeWidth={2} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={Colors.neutral[400]}
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          editable={!isLoading}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && !isLoading && (
          <TouchableOpacity onPress={handleClear} hitSlop={8}>
            <X size={18} color={Colors.neutral[400]} strokeWidth={2} />
          </TouchableOpacity>
        )}
        {isLoading && <ActivityIndicator size="small" color={Colors.primary[500]} />}
      </View>
      <TouchableOpacity
        style={[styles.searchButton, !query.trim() && styles.searchButtonDisabled]}
        onPress={handleSubmit}
        disabled={!query.trim() || isLoading}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <Search size={20} color={Colors.white} strokeWidth={2.5} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 52,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.neutral[900],
    paddingVertical: 0,
    height: 52,
  },
  searchButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: Colors.primary[300],
  },
});
