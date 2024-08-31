import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeContext';
import { createThemedStyles } from '@/styles/theme';
import { LoginButton, LogoutButton } from './LoginButton';

const ColorList = ({color, items, publicKey, handleConnect, handleLogout, handleError}: {color: any, items: any, publicKey: any, handleConnect: any, handleLogout: any, handleError: any}) => {
  const theme = useTheme();
  const isDarkMode = theme?.isDarkMode;
  const styles = createThemedStyles(isDarkMode ?? false);
  return (
    <ScrollView 
      contentContainerStyle={styles.colorlistcontainer}>
         {publicKey ? (
        <LogoutButton onLogout={handleLogout} />
      ) : (
        <LoginButton onConnect={handleConnect} onError={handleError} />
      )}
      {
        items.map((item: any)=> (
          <TouchableOpacity
            key={item.index} 
            style={[styles.colorlist, {backgroundColor: color, opacity: item.opacity}]} 
            onPress={item.action}
          >
              <Text style={styles.cardTitle} key={item.id}>{item.name}</Text>
          </TouchableOpacity>
        ))
      }
    </ScrollView>
  )
}

// const styles = StyleSheet.create({
//     color: {
//         width: '100%',
//         height: 150,
//         borderRadius: 25,
//         borderCurve: 'continuous', 
//         marginBottom: 15,
//     },
//     container: {
//       paddingHorizontal: 20, 
//       paddingVertical: 10, 
//       height: '100%'
//     }
// })

export default ColorList;