import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { Trash2, TrendingDown, Calendar, PieChart } from 'lucide-react-native';
import Colors from '../constants/colors';
import GlassCard from '../components/GlassCard';
import { useWasteTracking } from '../providers/WasteTrackingProvider';
import CategoryChip from '../components/CategoryChip';

export default function WasteStatsScreen() {
  const { entries, stats, removeWasteEntry } = useWasteTracking();

  const handleDelete = (id: string) => {
    Alert.alert('Delete Entry', 'Remove this waste entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeWasteEntry(id) },
    ]);
  };

  const topCategories = Object.entries(stats.byCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          title: 'Waste Statistics',
          headerShown: true,
          headerTransparent: true,
        }}
      />
      <LinearGradient
        colors={[Colors.palette.gradientStart, Colors.palette.gradientEnd]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statsGrid}>
            <GlassCard style={styles.statCard}>
              <Trash2 size={32} color={Colors.palette.danger} />
              <Text style={styles.statNumber}>{stats.totalItems}</Text>
              <Text style={styles.statLabel}>Total Wasted</Text>
            </GlassCard>

            <GlassCard style={styles.statCard}>
              <Calendar size={32} color={Colors.palette.warning} />
              <Text style={styles.statNumber}>{stats.last30Days}</Text>
              <Text style={styles.statLabel}>Last 30 Days</Text>
            </GlassCard>
          </View>

          {topCategories.length > 0 && (
            <GlassCard style={styles.card}>
              <View style={styles.cardHeader}>
                <PieChart size={24} color={Colors.palette.textPrimary} />
                <Text style={styles.cardTitle}>Top Wasted Categories</Text>
              </View>
              <View style={styles.categoryList}>
                {topCategories.map(([category, count]) => (
                  <View key={category} style={styles.categoryRow}>
                    <CategoryChip category={category as any} />
                    <Text style={styles.categoryCount}>{count} items</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}

          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <TrendingDown size={24} color={Colors.palette.textPrimary} />
              <Text style={styles.cardTitle}>Waste Reasons</Text>
            </View>
            <View style={styles.reasonList}>
              {Object.entries(stats.byReason).map(([reason, count]) => (
                <View key={reason} style={styles.reasonRow}>
                  <Text style={styles.reasonLabel}>
                    {reason === 'expired' ? '⏰ Expired' : reason === 'spoiled' ? '🦠 Spoiled' : '❓ Other'}
                  </Text>
                  <Text style={styles.reasonCount}>{count}</Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {entries.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Waste Entries</Text>
              {entries.slice(0, 10).map((entry) => (
                <GlassCard key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryContent}>
                    <View style={styles.entryInfo}>
                      <Text style={styles.entryName}>{entry.itemName}</Text>
                      <Text style={styles.entryMeta}>
                        {entry.quantity} {entry.unit} • {entry.reason}
                      </Text>
                      <Text style={styles.entryDate}>
                        {new Date(entry.wastedAt).toLocaleDateString()}
                      </Text>
                      <View style={{ marginTop: 8 }}>
                        <CategoryChip category={entry.category as any} />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDelete(entry.id)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={20} color={Colors.palette.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              ))}
            </View>
          )}

          {entries.length === 0 && (
            <View style={styles.emptyState}>
              <Trash2 size={64} color={Colors.palette.textSecondary} />
              <Text style={styles.emptyTitle}>No Waste Tracked</Text>
              <Text style={styles.emptySubtitle}>
                Great job! You haven&apos;t wasted any food yet.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 120,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.palette.textSecondary,
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
  },
  categoryList: {
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryCount: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
  },
  reasonList: {
    gap: 12,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  reasonLabel: {
    fontSize: 16,
    color: Colors.palette.textPrimary,
  },
  reasonCount: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
    marginBottom: 16,
  },
  entryCard: {
    marginBottom: 12,
    padding: 16,
  },
  entryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.palette.textPrimary,
    marginBottom: 4,
  },
  entryMeta: {
    fontSize: 14,
    color: Colors.palette.textSecondary,
    marginBottom: 2,
  },
  entryDate: {
    fontSize: 12,
    color: Colors.palette.textSecondary,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.palette.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.palette.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
  },
});
