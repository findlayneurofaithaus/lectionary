import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ReadingScreen from '../screens/ReadingScreen';
import NotesScreen from '../screens/NotesScreen';
import { COLORS } from '../utils/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Reading" component={ReadingScreen} />
      <Stack.Screen name="Notes" component={NotesScreen} />
    </Stack.Navigator>
  );
}

function CalendarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Reading" component={ReadingScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#E0D8CC',
            borderTopWidth: 0.5,
            paddingBottom: 4,
            height: 58,
          },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
          tabBarIcon: ({ focused, color }) => {
            let icon = '📖';
            if (route.name === 'Today') icon = focused ? '📖' : '📖';
            if (route.name === 'CalendarTab') icon = focused ? '📅' : '📅';
            return <Text style={{ fontSize: 20 }}>{icon}</Text>;
          },
        })}
      >
        <Tab.Screen name="Today" component={HomeStack} options={{ tabBarLabel: 'Today' }} />
        <Tab.Screen name="CalendarTab" component={CalendarStack} options={{ tabBarLabel: 'Calendar' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
