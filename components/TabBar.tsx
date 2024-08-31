import { View } from 'react-native'
import React from 'react'
import TabBarButton from './TabBarButton';
import { useTabBarVisibility } from '../context/TabBarVisibilityContext'
import { COLORS } from '../styles/constants';
import { useTheme } from '../context/ThemeContext'
import { createThemedStyles } from '../styles/theme'


const TabBar = ({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) => {
  const { isDarkMode } = useTheme() || { isDarkMode: false };
  const { isTabBarVisible } = useTabBarVisibility() || { isTabBarVisible: true };
  const styles = createThemedStyles(isDarkMode);

  const primaryColor = COLORS.BLUE;
  const greyColor = COLORS.LIGHT_GREY;

  if (!isTabBarVisible) return null;
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            style={styles.tabbar}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? primaryColor : greyColor}
            label={label}
          />
        )
      })}
    </View>
  )
}

export default TabBar