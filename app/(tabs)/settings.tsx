import React, { useState } from 'react';
import { View, Text, useColorScheme } from 'react-native'
import ColorList from '../../components/ColorList'
import { useTheme } from '../../context/ThemeContext'
import { createThemedStyles } from '../../styles/theme'
import { LoginButton, LogoutButton } from '../../components/LoginButton'
import Toast from "react-native-toast-message";

const Settings = () => {
  const theme = useTheme();
  const isDarkMode = theme?.isDarkMode;
  const toggleTheme = theme?.toggleTheme ?? (() => { });
  const colorScheme = useColorScheme();
  const styles = createThemedStyles(isDarkMode ?? false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const handleConnect = (key: string) => {
    setPublicKey(key);
  };

  const handleLogout = () => {
    setPublicKey(null);
  };

  const handleError = (error: any) => {
    console.log(error);
    Toast.show({
      type: "error",
      text1: `Error Code: ${error.errorCode}`,
      text2: error.errorMessage,
    });
  };

  const colorListItems = [
    {
      id: 1,
      name: `Switch to ${isDarkMode ? 'Light' : 'Dark'} mode\nApp theme: ${isDarkMode ? 'Dark' : 'Light'}\nSystem theme: ${colorScheme ? colorScheme[0].toUpperCase() + colorScheme.slice(1) : 'Unknown'}`,
      opacity: 1,
      action: toggleTheme
    }
  ];

  return (
    <View style={styles.container}>
      {publicKey && (
        <Text style={styles.text}>Connected with PublicKey: {publicKey?.slice(0, 4)}...{publicKey.slice(-4)}</Text>
      )}
      <ColorList color={styles.button.backgroundColor} items={colorListItems} publicKey={publicKey} handleConnect={handleConnect} handleLogout={handleLogout} handleError={handleError} />

    </View>
  );
};

export default Settings;