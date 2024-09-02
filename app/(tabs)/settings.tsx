import React from 'react';
import { View, Text, useColorScheme, Alert } from 'react-native' // Import Button
import ColorList from '../../components/ColorList'
import { useTheme } from '../../context/ThemeContext'
import { createThemedStyles } from '../../styles/theme'
import Toast from "react-native-toast-message";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import { setPublicKey, toggleUnits } from '@/store/slices/users';
import { toggleNotifications, setLanguage } from '@/store/slices/app';
import { PublicKey } from '@solana/web3.js';
import Constants from 'expo-constants';// import { PublicKey } from "@solana/web3.js";

// export const STAKING_REWARD_PROGRAM_ID = new PublicKey(
//   "AXcjfnZMSdtM4yFPnrVbpJq7tAURYA4jXA3k9USMnmxc"
// );
const Settings = () => {
  const theme = useTheme();
  const isDarkMode = theme?.isDarkMode;
  const toggleTheme = theme?.toggleTheme ?? (() => { });
  const colorScheme = useColorScheme();
  const styles = createThemedStyles(isDarkMode ?? false);
  // const [publicKey, setPublicKey] = useState<string | null>(null);
  const dispatch = useDispatch();
  const publicKey = useSelector((state: RootState) => state.user.publicKey);
  const notificationsEnabled = useSelector((state: RootState) => state.app.notificationsEnabled);
  const language = useSelector((state: RootState) => state.app.language);

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
    },
    {
      id: 2,
      name: `Connect Apple Health Kit`,
      opacity: 1,
      action: () => Alert.alert("This feature is not available yet")
    },
    // {
    //   id: 3,
    //   name: `Connect Google Fit`,
    //   opacity: 1,
    //   action: () => console.log("Connect Google Fit Pressed")
    // },
    {
      id: 4,
      name: `Set Units: ${useSelector((state: RootState) => state.user.isImperial) ? 'Imperial' : 'Metric'}`,
      opacity: 1,
      action: () => dispatch(toggleUnits())
    },
    {
      id: 5,
      name: `Enable Notifications: ${notificationsEnabled ? 'On' : 'Off'}`,
      opacity: 1,
      action: () => dispatch(toggleNotifications())
    },
    // {
    //   id: 6,
    //   name: `Privacy Settings`,
    //   opacity: 1,
    //   action: () => console.log("Privacy Settings Pressed")
    // },
    {
      id: 7,
      name: `Language: ${language}`,
      opacity: 1,
      action: () => dispatch(setLanguage(language === 'English' ? 'Spanish' : 'English'))
    },
    // {
    //   id: 8,
    //   name: `Account Settings`,
    //   opacity: 1,
    //   action: () => console.log("Account Settings Pressed")
    // },
    {
      id: 9,
      name: `Help & Support`,
      opacity: 1,
      action: () => Alert.alert("This app is in dev, made with <3")
    }
  ];

  // Example authorization object and message
  // const authorization = {
  //   address: 'exampleAddress',
  //   publicKey: new PublicKey(publicKey),
  //   authToken: 'exampleAuthToken',
  // };
  // const message = 'Hello, Solana!';

  return (
    <View style={styles.container}>
      {publicKey && (
        <>
          <Text style={styles.text}>Staking Program Address:  {Constants?.expoConfig?.extra?.programAddress?.slice(0, 4)}...{Constants?.expoConfig?.extra?.programAddress?.slice(-4)}</Text>
          <Text style={styles.text}>Connected with PublicKey: {publicKey?.slice(0, 4)}...{publicKey.slice(-4)}</Text>

          {/* <RecordMessageButton authorization={authorization} message={message} /> */}
        </>
      )}
      <ColorList color={styles.button.backgroundColor} items={colorListItems} publicKey={publicKey} handleConnect={handleConnect} handleLogout={handleLogout} handleError={handleError} />
    </View>
  );
};

export default Settings;