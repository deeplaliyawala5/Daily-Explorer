import AsyncStorage from '@react-native-async-storage/async-storage';
import { Adventure } from '../types/Adventure';

const ADVENTURES_STORAGE_KEY = 'adventures';

export const saveAdventures = async (adventures: Adventure[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(adventures);
    await AsyncStorage.setItem(ADVENTURES_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving adventures:', error);
  }
};

export const loadAdventures = async (): Promise<Adventure[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ADVENTURES_STORAGE_KEY);
    if (jsonValue != null) {
      const adventures = JSON.parse(jsonValue);
      return adventures.map((adventure: any) => ({
        ...adventure,
        timestamp: new Date(adventure.timestamp),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading adventures:', error);
    return [];
  }
};

export const addAdventure = async (adventure: Omit<Adventure, 'id'>): Promise<Adventure> => {
  try {
    const adventures = await loadAdventures();
    const newAdventure: Adventure = {
      id: Date.now().toString(),
      ...adventure,
    };
    adventures.push(newAdventure);
    await saveAdventures(adventures);
    return newAdventure;
  } catch (error) {
    console.error('Error adding adventure:', error);
    throw error;
  }
};