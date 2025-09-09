import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Adventure, AdventureStats } from '../types/Adventure';
import { loadAdventures } from '../utils/storage';
import { calculateStats, isInCurrentWeek } from '../utils/dateUtils';
import { SafeAreaView } from 'react-native-safe-area-context';

export const StatsScreen: React.FC = () => {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [stats, setStats] = useState<AdventureStats>({
    totalThisWeek: 0,
    mostUsedIcon: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const allAdventures = await loadAdventures();
      setAdventures(allAdventures);
      setStats(calculateStats(allAdventures));
    } catch (error) {
      console.error('Error loading adventures:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const weeklyAdventures = adventures.filter(adventure =>
    isInCurrentWeek(adventure.timestamp),
  );

  const getWeeklyIconStats = () => {
    const iconCounts: { [key: string]: number } = {};
    weeklyAdventures.forEach(adventure => {
      iconCounts[adventure.icon] = (iconCounts[adventure.icon] || 0) + 1;
    });

    return Object.entries(iconCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  };

  const iconStats = getWeeklyIconStats();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading stats...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Adventure Stats</Text>
          <Text style={styles.headerSubtitle}>Your exploration insights</Text>
        </View>

        <View style={styles.statsContainer}>
          {/* Total Adventures This Week */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>📅</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>{stats.totalThisWeek}</Text>
              <Text style={styles.statLabel}>Adventures This Week</Text>
            </View>
          </View>

          {/* Most Used Icon */}
          {stats.mostUsedIcon && (
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>{stats.mostUsedIcon.icon}</Text>
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>
                  {stats.mostUsedIcon.count}
                </Text>
                <Text style={styles.statLabel}>Most Popular Adventure</Text>
                <Text style={styles.statSubtext}>
                  {stats.mostUsedIcon.icon} adventures logged{' '}
                  {stats.mostUsedIcon.count} times
                </Text>
              </View>
            </View>
          )}

          {/* Total All Time */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>🏆</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>{adventures.length}</Text>
              <Text style={styles.statLabel}>Total Adventures</Text>
              <Text style={styles.statSubtext}>All time explorer count</Text>
            </View>
          </View>

          {/* Weekly Breakdown */}
          {iconStats.length > 0 && (
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>
                This Week's Adventure Types
              </Text>
              {iconStats.map(([icon, count], index) => (
                <View key={index} style={styles.breakdownItem}>
                  <View style={styles.breakdownIconContainer}>
                    <Text style={styles.breakdownIcon}>{icon}</Text>
                  </View>
                  <View style={styles.breakdownContent}>
                    <View style={styles.breakdownBar}>
                      <View
                        style={[
                          styles.breakdownProgress,
                          { width: `${(count / stats.totalThisWeek) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.breakdownCount}>{count}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {weeklyAdventures.length === 0 && (
            <View style={styles.emptyWeekCard}>
              <Text style={styles.emptyWeekIcon}>📍</Text>
              <Text style={styles.emptyWeekTitle}>No Adventures This Week</Text>
              <Text style={styles.emptyWeekText}>
                Start exploring and add your first adventure of the week!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E3F2FD',
  },
  statsContainer: {
    padding: 15,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statIcon: {
    fontSize: 24,
  },
  statContent: {
    flex: 1,
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#666',
  },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  breakdownIcon: {
    fontSize: 20,
  },
  breakdownContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 10,
  },
  breakdownProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  breakdownCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 20,
  },
  emptyWeekCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyWeekIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyWeekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyWeekText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
