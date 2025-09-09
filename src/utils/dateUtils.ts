import { Adventure, AdventureStats } from '../types/Adventure';

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

export const isInCurrentWeek = (date: Date): boolean => {
  const today = new Date();
  const weekStart = getWeekStart(today);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  return date >= weekStart && date <= weekEnd;
};

export const getAdventuresForToday = (adventures: Adventure[]): Adventure[] => {
  const today = new Date();
  return adventures.filter(adventure => isSameDay(adventure.timestamp, today));
};

export const calculateStats = (adventures: Adventure[]): AdventureStats => {
  // Get adventures from this week
  const thisWeekAdventures = adventures.filter(adventure => 
    isInCurrentWeek(adventure.timestamp)
  );
  
  // Count icon usage
  const iconCounts: { [key: string]: number } = {};
  thisWeekAdventures.forEach(adventure => {
    iconCounts[adventure.icon] = (iconCounts[adventure.icon] || 0) + 1;
  });
  
  // Find most used icon
  let mostUsedIcon = null;
  let maxCount = 0;
  
  Object.entries(iconCounts).forEach(([icon, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostUsedIcon = { icon, count };
    }
  });
  
  return {
    totalThisWeek: thisWeekAdventures.length,
    mostUsedIcon,
  };
};