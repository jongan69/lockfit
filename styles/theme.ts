import { StyleSheet } from 'react-native';

export const createThemedStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: isDarkMode ? '#121212' : '#F5F5F5',
  },
  text: {
    color: isDarkMode ? '#E0E0E0' : '#333333',
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: isDarkMode ? '#4f46e5' : '#0891b2',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  totalCard: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: isDarkMode ? '#000000' : '#888888',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 50,
    shadowColor: isDarkMode ? '#000000' : '#888888',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    color: isDarkMode ? '#E0E0E0' : '#333333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardPR: {
    color: isDarkMode ? '#4f46e5' : '#0891b2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalTitle: {
    color: isDarkMode ? '#E0E0E0' : '#333333',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});