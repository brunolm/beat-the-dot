import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  beats: {
    fontSize: 22,
  },
  beatsContainer: {
    flex: 1,
    marginBottom: 20,
    marginTop: 20,
  },
  col: {
    backgroundColor: 'orange',
    flex: 1,
    flexDirection: 'column',
  },
  flexCol: {
    backgroundColor: '#eeeeee',
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 30,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 30,
  },
  fullWidthButton: {
    alignSelf: 'stretch',
  },
  gridFilterContainer: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-end',
  },
  main: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
});
