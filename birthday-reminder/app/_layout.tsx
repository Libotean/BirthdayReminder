import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { initDB } from '@/database/db';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { requestPermissions, scheduleAllNotifications, registerBackgroundTask, setupNotificationChannel } from '@/database/notifications';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  useEffect(() => {
    initDB();
    requestPermissions().then(async (granted) => {
        if (granted) {
            await setupNotificationChannel();
            await scheduleAllNotifications();
            registerBackgroundTask();
        }
    });
}, []);

  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="add_birthday" options={{ headerShown: false }} />
          <Stack.Screen name="info" options={{ headerShown: false }} />
          <Stack.Screen name="update_birthday" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
