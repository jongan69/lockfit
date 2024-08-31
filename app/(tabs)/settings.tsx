import React from 'react';
import { View, Text, useColorScheme } from 'react-native'
import ColorList from '../../components/ColorList'
import { useTheme } from '../../context/ThemeContext'
import { createThemedStyles } from '../../styles/theme'
import Toast from "react-native-toast-message";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import { setPublicKey } from '@/store/slices/users';


const Settings = () => {
  const theme = useTheme();
  const isDarkMode = theme?.isDarkMode;
  const toggleTheme = theme?.toggleTheme ?? (() => { });
  const colorScheme = useColorScheme();
  const styles = createThemedStyles(isDarkMode ?? false);
  // const [publicKey, setPublicKey] = useState<string | null>(null);
  const dispatch = useDispatch();
  const publicKey = useSelector((state: RootState) => state.user.publicKey);

  const handleConnect = (key: string) => {
    // setPublicKey(key);
    dispatch(setPublicKey(key));
  };

  const handleLogout = () => {
    dispatch(setPublicKey(""));
  };

  const handleError = (error: any) => {
    console.log(error);
    Toast.show({
      type: "error",
      text1: `Error Code: ${JSON.parse(error).errorCode}`,
      text2: JSON.parse(error).errorMessage,
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