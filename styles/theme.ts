import { StyleSheet } from 'react-native';
import { COLORS } from './constants';

export const createThemedStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: isDarkMode ? COLORS.DARKER_GREY_2 : COLORS.WHITE,
  },
  text: {
    color: isDarkMode ? COLORS.WHITE : COLORS.GREY,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: isDarkMode ? COLORS.PURPLE : COLORS.BLUE,
    padding: 10,
    borderRadius: 5,
    color: isDarkMode ? COLORS.WHITE : COLORS.BLACK,
  },
  tabbar: {
    position: 'absolute',
    bottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: isDarkMode ? COLORS.DARK_GREY : COLORS.WHITE,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderCurve: 'continuous',
    shadowColor: isDarkMode ? COLORS.BLACK : COLORS.DARK_GREY,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: isDarkMode ? 0.5 : 0.1
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    textAlign: 'center',
  },
  totalCard: {
    backgroundColor: isDarkMode ? COLORS.GREY : COLORS.WHITE,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: isDarkMode ? COLORS.DARKER_GREY_2 : COLORS.LIGHT_GREY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    backgroundColor: isDarkMode ? COLORS.GREY : COLORS.WHITE,
    borderRadius: 10,
    padding: 15,
    marginBottom: 50,
    shadowColor: isDarkMode ? COLORS.DARKER_GREY_2 : COLORS.LIGHT_GREY,
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
    color: isDarkMode ? COLORS.WHITE : COLORS.GREY,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardPR: {
    color: isDarkMode ? COLORS.PURPLE : COLORS.BLUE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalTitle: {
    color: isDarkMode ? COLORS.WHITE : COLORS.GREY,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  workoutCard: {
    backgroundColor: COLORS.PINK,
    borderRadius: 10,
    padding: 15,
    margin: 15,
  },
  workoutDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 10,
  },
  workoutText: {
    fontSize: 16,
    color: COLORS.WHITE,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  todayButton: {
    backgroundColor: COLORS.PINK,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    shadowColor: COLORS.DARK_GREY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  todayButtonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  colorlist: {
    width: '100%',
    height: 150,
    borderRadius: 25,
    borderCurve: 'continuous', 
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
},
colorlistcontainer: {
  paddingHorizontal: 20, 
  paddingVertical: 10, 
  height: '100%'
}
});

export const getCalendarTheme = (isDarkMode: boolean) => ({
  backgroundColor: isDarkMode ? COLORS.DARKER_GREY_2 : COLORS.WHITE,
  calendarBackground: isDarkMode ? COLORS.DARKER_GREY_2 : COLORS.WHITE,
  textSectionTitleColor: isDarkMode ? COLORS.WHITE : COLORS.GREY,
  dayTextColor: isDarkMode ? COLORS.WHITE : COLORS.GREY,
  todayTextColor: COLORS.PINK,
  selectedDayBackgroundColor: COLORS.PINK,
  selectedDayTextColor: COLORS.WHITE,
  monthTextColor: isDarkMode ? COLORS.WHITE : COLORS.GREY,
  arrowColor: isDarkMode ? COLORS.WHITE : COLORS.GREY,
  dotColor: COLORS.PINK,
  selectedDotColor: COLORS.WHITE,
  disabledArrowColor: isDarkMode ? COLORS.DARK_GREY : COLORS.LIGHT_GREY,
  textDisabledColor: isDarkMode ? COLORS.DARK_GREY : COLORS.LIGHT_GREY,
});