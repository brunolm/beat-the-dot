import { Platform, StatusBar, StyleSheet } from 'react-native';

export default StyleSheet.create({
  flexCol: {
    backgroundColor: '#eeeeee',
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 30,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 30,
  },
  main: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    backgroundColor: '#1fbcd2',
  },
  fullWidthButton: {
    alignSelf: 'stretch',
  },
  beatsContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
  },
  beats: {
    fontSize: 22,
  },
});
