import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '../../components/TabBar'
import { useTheme } from '../../context/ThemeContext';
import { createThemedStyles } from '../../styles/theme';

const _layout = () => {
    const { isDarkMode } = useTheme() || { isDarkMode: false };
    const styles = createThemedStyles(isDarkMode);
    return (
        <Tabs
            screenOptions={{
                headerTintColor: styles.text.color,
                headerStyle: {
                    backgroundColor: styles.tabbar.backgroundColor,
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
            tabBar={props => <TabBar {...props} />}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home"
                }}
            />
            <Tabs.Screen
                name="programs"
                options={{
                    title: "Programs"
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History"
                }}
            />
            <Tabs.Screen
                name="progress"
                options={{
                    title: "Progress"
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings"
                }}
            />
        </Tabs>
    )
}

export default _layout