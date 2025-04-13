// App.js
import React, { useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserContext } from './components/UserContext';
import { Provider as PaperProvider } from 'react-native-paper';

import TritonChat from './components/TritonChat';
import Dashboard from './components/Dashboard';
import VoiceAI from './components/VoiceAI';
import WorkoutSelector from './components/Workoutselector';
import WorkoutLogger from './components/WorkoutLogger';
import ExerciseLoggerScreen from './components/ExerciseLoggerScreen';
import LoginScreen from './components/LoginScreen'; // ⬅️ Create this file (code shared earlier)

// Create context


const Stack = createNativeStackNavigator();

export default function App() {
  const [userId, setUserId] = useState(null); // Email or real user ID

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="TritonChat" component={TritonChat} />
          <Stack.Screen name="VoiceAI" component={VoiceAI} />
          <Stack.Screen name="WorkoutSelector" component={WorkoutSelector} />
          <Stack.Screen name="WorkoutLogger" component={WorkoutLogger} />
          <Stack.Screen name="ExerciseLoggerScreen" component={ExerciseLoggerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      </PaperProvider>
    </UserContext.Provider>
  );
}
