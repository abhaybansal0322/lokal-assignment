import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { initPlayerSync } from './src/services/playerSync';
import MiniPlayer from './src/components/MiniPlayer';


export default function App() {
  useEffect(() => {
    initPlayerSync();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
      <MiniPlayer />
    </NavigationContainer>
  );
}



