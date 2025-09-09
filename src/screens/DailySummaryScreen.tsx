import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { Adventure } from '../types/Adventure';
import { loadAdventures, addAdventure } from '../utils/storage';
import { formatDate, getAdventuresForToday } from '../utils/dateUtils';
import { AdventureCard } from '../components/AdventureCard';
import { AddAdventureForm } from '../components/AddAdventureForm';
import { SafeAreaView } from 'react-native-safe-area-context';

export const DailySummaryScreen: React.FC = () => {
  const [todayAdventures, setTodayAdventures] = useState<Adventure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const allAdventures = await loadAdventures();
      setTodayAdventures(getAdventuresForToday(allAdventures));
    } catch (error) {
      console.error('Error loading adventures:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddAdventure = async (
    title: string,
    icon: string,
    timestamp: Date,
  ) => {
    try {
      const newAdventure = await addAdventure({
        title,
        icon,
        timestamp,
      });

      setTodayAdventures(prev => [...prev, newAdventure]);
      setShowAddForm(false);
    } catch (error) {
      throw error;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const today = new Date();
  const todayCount = todayAdventures.length;

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading adventures...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.dateText}>{formatDate(today)}</Text>
          <Text style={styles.countText}>
            {todayCount} {todayCount === 1 ? 'Adventure' : 'Adventures'} Today
          </Text>
        </View>

        {todayAdventures.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🗺️</Text>
            <Text style={styles.emptyTitle}>No Adventures Yet!</Text>
            <Text style={styles.emptySubtitle}>
              Start your day by adding your first adventure
            </Text>
          </View>
        ) : (
          <View style={styles.timelineContainer}>
            <Text style={styles.timelineTitle}>Today's Journey</Text>
            <View style={styles.timeline}>
              {todayAdventures
                .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                .map((adventure, index) => (
                  <AdventureCard
                    key={adventure.id}
                    adventure={adventure}
                    index={index}
                  />
                ))}
            </View>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddForm(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={showAddForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddForm(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <AddAdventureForm
            onAddAdventure={handleAddAdventure}
            onCancel={() => setShowAddForm(false)}
          />
        </SafeAreaView>
      </Modal>
    </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  countText: {
    fontSize: 16,
    color: '#E3F2FD',
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
  timelineContainer: {
    padding: 20,
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeline: {
    paddingVertical: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingVertical: 34,
  },
});
