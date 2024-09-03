import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar';
import { useTheme } from '../../contexts/ThemeContext';
import { createThemedStyles } from '../../styles/theme';

const tabScreens = [
  { name: "index", title: "Home" },
  { name: "programs", title: "Programs" },
  { name: "history", title: "History" },
  { name: "progress", title: "Progress" },
  { name: "rewards", title: "Rewards" },
  { name: "settings", title: "Settings" },
];

const _layout = () => {
  const { isDarkMode } = useTheme() || { isDarkMode: false };
  const styles = createThemedStyles(isDarkMode);

  const screenOptions = {
    headerTintColor: styles.text.color,
    headerStyle: {
      backgroundColor: styles.tabbar.backgroundColor,
    },
    headerTitleStyle: {
      fontWeight: 'bold' as const,
    },
  };

  return (
    <Tabs
      screenOptions={screenOptions}
      tabBar={props => <TabBar {...props} />}
    >
      {tabScreens.map(({ name, title }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{ title }}
        />
      ))}
    </Tabs>
  );
};

export default _layout;