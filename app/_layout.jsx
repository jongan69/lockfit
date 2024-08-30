import React from 'react'
import { Tabs } from 'expo-router'
import TabBar from '../components/TabBar'
import { ThemeProvider } from '../context/ThemeContext'
import { TabBarVisibilityProvider } from '../context/TabBarVisibilityContext'

const _layout = () => {
    return (
        <ThemeProvider>
            <TabBarVisibilityProvider>

                <Tabs
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
            </TabBarVisibilityProvider>
        </ThemeProvider>
    )
}

export default _layout