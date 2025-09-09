import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Adventure } from '../types/Adventure';
import { formatTime } from '../utils/dateUtils';

interface AdventureCardProps {
  adventure: Adventure;
  index: number;
}

export const AdventureCard: React.FC<AdventureCardProps> = ({
  adventure,
  index,
}) => {
  return (
    <View key={index.toString()} style={[styles.container]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{adventure.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{adventure.title}</Text>
        <Text style={styles.time}>{formatTime(adventure.timestamp)}</Text>
      </View>
      <View style={styles.connector} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    marginLeft: 15,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  connector: {
    position: 'absolute',
    left: 35,
    top: 50,
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
    zIndex: -1,
  },
});
