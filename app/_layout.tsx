import { toastConfig } from '@/components/ToastConfig';
import { TabBarVisibilityProvider } from '@/context/TabBarVisibilityContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Stack } from 'expo-router/stack';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';

export default function Layout() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider>
                    <TabBarVisibilityProvider>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        </Stack>
                        <Toast config={toastConfig} />
                    </TabBarVisibilityProvider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}
