import * as React from 'react';

import Header from './components/Header';
import { View } from 'react-native';
import styles from './styles';

export default class App extends React.Component<any, any> {
  render() {
    return (
      <View style={ styles.main }>
        <Header />
      </View>
    );
  }
}
