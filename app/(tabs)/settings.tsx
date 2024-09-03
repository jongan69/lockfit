import React from 'react';
import { View, Text, useColorScheme, Alert } from 'react-native';
import ColorList from '../../components/ColorList';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles } from '../../styles/theme';
import Toast from "react-native-toast-message";
import Constants from 'expo-constants';
import { useUserStore } from '../../stores/UserStore';
import { useAppStore } from '../../stores/AppStore';
import { useAuthStore } from '@/stores/AuthStore';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme() || {};
  const colorScheme = useColorScheme();
  const styles = createThemedStyles(isDarkMode ?? false);

  const { isImperial, toggleUnits } = useUserStore();
  const { getSharedSecretUint8Array, session, getPublicKey, getDappKeyPair, setAuth, setNonce, getNonce } = useAuthStore();
  const { notificationsEnabled, toggleNotifications, language, setLanguage } = useAppStore();

  // const handleConnect = (key: string) => setPublicKey(key);
  // const handleLogout = () => setPublicKey("");
  const handleError = (error: any) => {
    console.log(error);
    const { errorCode, errorMessage } = JSON.parse(error);
    Toast.show({
      type: "error",
      text1: `Error Code: ${errorCode}`,
      text2: errorMessage,
    });
  };

  const colorListItems = [
    {
      id: 1,
      name: `Switch to ${isDarkMode ? 'Light' : 'Dark'} mode\nApp theme: ${isDarkMode ? 'Dark' : 'Light'}\nSystem theme: ${colorScheme ? colorScheme[0].toUpperCase() + colorScheme.slice(1) : 'Unknown'}`,
      action: toggleTheme
    },
    {
      id: 2,
      name: `Connect Apple Health Kit`,
      action: () => Alert.alert("This feature is not available yet")
    },
    {
      id: 4,
      name: `Set Units: ${isImperial ? 'Imperial' : 'Metric'}`,
      action: toggleUnits
    },
    {
      id: 5,
      name: `Enable Notifications: ${notificationsEnabled ? 'On' : 'Off'}`,
      action: toggleNotifications
    },
    {
      id: 7,
      name: `Language: ${language}`,
      action: () => setLanguage(language === 'English' ? 'Spanish' : 'English')
    },
    {
      id: 9,
      name: `Help & Support`,
      action: () => Alert.alert("This app is in dev, made with <3")
    }
  ];

  return (
    <View style={styles.container}>
      {getPublicKey() && (
        <>
          <Text style={styles.text}>Staking Program Address: {Constants?.expoConfig?.extra?.programAddress?.slice(0, 4)}...{Constants?.expoConfig?.extra?.programAddress?.slice(-4)}</Text>
          <Text style={styles.text}>Connected with PublicKey: {getPublicKey()?.slice(0, 4)}...{getPublicKey()?.slice(-4)}</Text>
        </>
      )}
      <ColorList 
        color={styles.button.backgroundColor} 
        items={colorListItems} 
        // publicKey={getPublicKey()} 
        // handleConnect={handleConnect} 
        // handleLogout={handleLogout} 
        // handleError={handleError} 
      />
    </View>
  );
};

export default Settings;