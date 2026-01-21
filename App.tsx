import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import MiniPlayer from './src/components/MiniPlayer';
import { initPlayerSync } from './src/services/playerSync';
import { usePlayerStore } from './src/store/playerStore';

export default function App() {
  useEffect(() => {
    initPlayerSync();
    usePlayerStore.getState().restoreQueue();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
      <MiniPlayer />
    </NavigationContainer>
  );
}
