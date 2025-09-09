import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Adventure } from '../types/Adventure';
import { loadAdventures } from '../utils/storage';
import { formatDate, formatTime, isSameDay } from '../utils/dateUtils';

const { width } = Dimensions.get('window');

interface DayGroup {
  date: Date;
  adventures: Adventure[];
}

export const TimelineScreen: React.FC = () => {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const allAdventures = await loadAdventures();
      setAdventures(allAdventures);
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

  // Group adventures by day
  const groupedAdventures: DayGroup[] = adventures
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .reduce((groups: DayGroup[], adventure) => {
      const existingGroup = groups.find(group =>
        isSameDay(group.date, adventure.timestamp),
      );

      if (existingGroup) {
        existingGroup.adventures.push(adventure);
      } else {
        groups.push({
          date: adventure.timestamp,
          adventures: [adventure],
        });
      }

      return groups;
    }, []);

  const TimelineNode: React.FC<{ adventure: Adventure; isLast: boolean }> = ({
    adventure,
    isLast,
  }) => (
    <View style={styles.nodeContainer}>
      <View style={styles.nodeLeft}>
        <Text style={styles.nodeTime}>{formatTime(adventure.timestamp)}</Text>
      </View>

      <View style={styles.nodeCenter}>
        <View style={styles.nodeIcon}>
          <Text style={styles.nodeIconText}>{adventure.icon}</Text>
        </View>
        {!isLast && <View style={styles.nodeLine} />}
      </View>

      <View style={styles.nodeRight}>
        <View style={styles.nodeCard}>
          <Text style={styles.nodeTitle}>{adventure.title}</Text>
        </View>
      </View>
    </View>
  );

  const MapPath: React.FC<{ dayIndex: number; adventureCount: number }> = ({
    dayIndex,
    adventureCount,
  }) => {
    const pathWidth = Math.min(adventureCount * 10 + 50, width * 0.8);
    const pathColor = dayIndex % 2 === 0 ? '#007AFF' : '#34C759';

    return (
      <View style={[styles.mapPath, { width: pathWidth }]}>
        <View style={[styles.pathLine, { backgroundColor: pathColor }]} />
        <View style={styles.pathDots}>
          {Array.from({ length: Math.min(adventureCount, 8) }).map(
            (_, index) => (
              <View
                key={index}
                style={[styles.pathDot, { backgroundColor: pathColor }]}
              />
            ),
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading timeline...</Text>
      </View>
    );
  }

  if (adventures.length === 0) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🗺️ Adventure Timeline</Text>
          <Text style={styles.headerSubtitle}>Your journey through time</Text>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🧭</Text>
          <Text style={styles.emptyTitle}>No Adventures to Map</Text>
          <Text style={styles.emptySubtitle}>
            Start exploring and create your adventure timeline!
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Adventure Timeline</Text>
        <Text style={styles.headerSubtitle}>Your journey through time</Text>
      </View>

      <View style={styles.timelineContainer}>
        {groupedAdventures.map((dayGroup, dayIndex) => (
          <View key={dayGroup.date.toISOString()} style={styles.daySection}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayDate}>{formatDate(dayGroup.date)}</Text>
              <Text style={styles.dayCount}>
                {dayGroup.adventures.length}{' '}
                {dayGroup.adventures.length === 1 ? 'Adventure' : 'Adventures'}
              </Text>
            </View>

            <MapPath
              dayIndex={dayIndex}
              adventureCount={dayGroup.adventures.length}
            />

            <View style={styles.dayTimeline}>
              {dayGroup.adventures
                .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                .map((adventure, index) => (
                  <TimelineNode
                    key={adventure.id}
                    adventure={adventure}
                    isLast={index === dayGroup.adventures.length - 1}
                  />
                ))}
            </View>
          </View>
        ))}

        <View style={styles.timelineEnd}>
          <Text style={styles.endText}>
            {adventures.length} Total Adventures Mapped!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  timelineContainer: {
    padding: 15,
  },
  daySection: {
    marginBottom: 30,
  },
  dayHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  dayDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dayCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  mapPath: {
    alignSelf: 'center',
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  pathLine: {
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  pathDots: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pathDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.8,
  },
  dayTimeline: {
    paddingLeft: 20,
  },
  nodeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  nodeLeft: {
    paddingTop: 5,
  },
  nodeTime: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  nodeCenter: {
    alignItems: 'center',
    marginHorizontal: 15,
  },
  nodeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  nodeIconText: {
    fontSize: 18,
  },
  nodeLine: {
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
    marginTop: 5,
  },
  nodeRight: {
    flex: 1,
    paddingTop: 5,
  },
  nodeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  nodeTitle: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  timelineEnd: {
    alignItems: 'center',
    marginTop: 30,
    padding: 20,
  },
  endText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
