import { toastConfig } from '@/components/ToastConfig';
import { TabBarVisibilityProvider } from '@/contexts/TabBarVisibilityContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router/stack';
import Toast from 'react-native-toast-message';

export default function Layout() {
    return (
        <ThemeProvider>
            <TabBarVisibilityProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
                <Toast config={toastConfig} />
            </TabBarVisibilityProvider>
        </ThemeProvider>
    );
}
