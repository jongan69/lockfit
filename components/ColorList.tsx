import { Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@/contexts/ThemeContext';
import { createThemedStyles } from '@/styles/theme';
import LoginButton from './PhantomLoginButton';
import { useTabBarVisibility } from '@/contexts/TabBarVisibilityContext';
import { handleScroll } from '@/utils/handleScroll';

const ColorList = ({color, items}: {color: any, items: any}) => {
  const theme = useTheme();
  const isDarkMode = theme?.isDarkMode;
  const styles = createThemedStyles(isDarkMode ?? false);
  const { setTabBarVisible } = useTabBarVisibility() ?? {};
  return (
    <ScrollView 
      onScroll={(event) => handleScroll(event, setTabBarVisible)}
      scrollEventThrottle={16}
      contentContainerStyle={styles.colorlistcontainer}>
      <LoginButton />
      {
        items.map((item: any, index: number)=> (
          <TouchableOpacity
            key={index} 
            style={[styles.colorlist, {backgroundColor: color, opacity: item.opacity}]} 
            onPress={item.action}
          >
              <Text style={styles.cardTitle} key={index}>{item.name}</Text>
          </TouchableOpacity>
        ))
      }
    </ScrollView>
  )
}

export default ColorList;