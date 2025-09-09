/**
 * Adventure Log - Daily Explorer App
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Platform, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DailySummaryScreen } from './src/screens/DailySummaryScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { TimelineScreen } from './src/screens/TimelineScreen';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#007AFF"
          translucent={false}
        />
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E5E5EA',
              paddingBottom: Platform.OS === 'ios' ? 20 : 5,
              paddingTop: 5,
              height: Platform.OS === 'ios' ? 85 : 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '500',
            },
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Today"
            component={DailySummaryScreen}
            options={{
              tabBarIcon: ({ size }) => <TabIcon icon="📅" size={size} />,
            }}
          />
          <Tab.Screen
            name="Timeline"
            component={TimelineScreen}
            options={{
              tabBarIcon: ({ size }) => <TabIcon icon="🗺️" size={size} />,
            }}
          />
          <Tab.Screen
            name="Stats"
            component={StatsScreen}
            options={{
              tabBarIcon: ({ size }) => <TabIcon icon="📊" size={size} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

interface TabIconProps {
  icon: string;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, size }) => {
  return <Text style={{ fontSize: size * 0.8 }}>{icon}</Text>;
};

export default App;
