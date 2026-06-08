import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Clock, Trash2, BookOpen, Search } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useRouter } from 'expo-router';
import { useDictionary } from '@/hooks/useDictionary';

interface CustomDrawerContentProps {
  navigation: any;
}

export function CustomDrawerContent({ navigation }: CustomDrawerContentProps) {
  const { history, clearHistory, removeFromHistory } = useSearchHistory();
  const router = useRouter();

  const handleHistoryPress = async (word: string) => {
    navigation.closeDrawer();
    router.push({ pathname: '/(drawer)/word-detail', params: { word } });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <DrawerContentScrollView
      style={styles.drawerContent}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.headerIconWrapper}>
          <BookOpen size={28} color={Colors.primary[500]} strokeWidth={2} />
        </View>
        <Text style={styles.headerTitle}>LexiTech Dictionary</Text>
        <Text style={styles.headerSubtitle}>Search & Learn</Text>
      </View>

      <TouchableOpacity
        style={styles.searchNavItem}
        onPress={() => {
          navigation.closeDrawer();
          navigation.navigate('index');
        }}
        activeOpacity={0.7}
        accessibilityLabel="Start a new search"
        accessibilityRole="button"
      >
        <Search size={20} color={Colors.primary[500]} strokeWidth={2} />
        <Text style={styles.searchNavText}>New Search</Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Clock size={16} color={Colors.neutral[500]} strokeWidth={2} />
        <Text style={styles.sectionTitle}>Search History</Text>
        {history.length > 0 && (
          <TouchableOpacity
            onPress={clearHistory}
            hitSlop={8}
            style={styles.clearButton}
            accessibilityLabel="Clear all search history"
            accessibilityRole="button"
          >
            <Trash2 size={14} color={Colors.error[500]} strokeWidth={2} />
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyHistory}>
          <Text style={styles.emptyHistoryText}>No searches yet</Text>
          <Text style={styles.emptyHistorySubtext}>
            Words you look up will appear here
          </Text>
        </View>
      ) : (
        <View style={styles.historyList}>
          {history.map((item) => (
            <View key={item.word} style={styles.historyItemWrapper}>
              <TouchableOpacity
                style={styles.historyItem}
                onPress={() => handleHistoryPress(item.word)}
                activeOpacity={0.6}
                accessibilityLabel={`Search history item: ${item.word}`}
                accessibilityRole="button"
              >
                <Text style={styles.historyWord}>{item.word}</Text>
                <Text style={styles.historyTime}>{formatTime(item.searchedAt)}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromHistory(item.word)}
                hitSlop={8}
                accessibilityLabel={`Remove ${item.word} from search history`}
                accessibilityRole="button"
              >
                <Trash2 size={14} color={Colors.neutral[400]} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingTop: 0,
  },
  header: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    paddingTop: Spacing.xxl,
    alignItems: 'center',
  },
  headerIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.h3,
    fontWeight: '700',
    color: Colors.white,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  searchNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.md,
  },
  searchNavText: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primary[700],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearText: {
    ...Typography.caption,
    color: Colors.error[500],
    fontWeight: '600',
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  emptyHistoryText: {
    ...Typography.body,
    color: Colors.neutral[500],
    marginBottom: 4,
  },
  emptyHistorySubtext: {
    ...Typography.bodySmall,
    color: Colors.neutral[400],
  },
  historyList: {
    paddingHorizontal: Spacing.md,
  },
  historyItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
  },
  historyItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  historyWord: {
    ...Typography.body,
    fontWeight: '500',
    color: Colors.neutral[800],
    textTransform: 'capitalize',
  },
  historyTime: {
    ...Typography.caption,
    color: Colors.neutral[400],
  },
  removeButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
  },
});
