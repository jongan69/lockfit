import { View, Text, Button, useColorScheme } from 'react-native'
import ColorList from '../components/ColorList'
import { useTheme } from '../context/ThemeContext'
import { createThemedStyles } from '../styles/theme'

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const colorScheme = useColorScheme();
  const styles = createThemedStyles(isDarkMode);

  return (
    <View style={styles.container}>
       <Text style={styles.text}>Current theme: {isDarkMode ? 'Dark' : 'Light'}</Text>
       <Text style={styles.text}>System theme: {colorScheme}</Text>
       <Button 
        title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} mode`}
        onPress={toggleTheme}
        color={styles.button.color}
      />
      <ColorList color="#4f46e5" />
     
      
    </View>
  );
};

export default Settings;