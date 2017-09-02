import * as React from 'react';
import * as ahgora from '../services/ahgora';
import * as moment from 'moment';

import { ScrollView, Text, View } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RaisedTextButton } from 'react-native-material-buttons';
import { TextField } from 'react-native-material-textfield';
import styles from '../styles';

export default class MonthGridComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      grid: '',
      loaded: false,
      loading: false,
      month: moment().format('MM'),
      year: moment().format('YYYY'),
    };
  }

  fetchDotMonth = async () => {
    this.setState({
      loading: true,
    });

    const filterDate = moment(`${this.state.month}-${this.state.year}`, 'MM-YYYY');

    const month = filterDate.format('MM');
    const year = filterDate.format('YYYY');

    const result = await ahgora.getTimes({ month, year });
    const grid = await ahgora.parseGrid(result.times);

    this.setState({
      grid,
      loaded: true,
      loading: false,
    });
  }

  render() {
    return (
      <View style={ styles.flexCol }>
        {/* <KeyboardAwareScrollView> */ }
        <ScrollView style={ styles.col }>
          <Text>{ this.state.grid }</Text>
        </ScrollView>

        <View>
          <View>
            <View>
              <TextField
                autoCorret={ false }
                keyboardType="numeric"
                label="MM"
                value={ this.state.month }
                onChangeText={ (month) => this.setState({ month }) }
              />
            </View>
            <View>
              <TextField
                autoCorret={ false }
                keyboardType="numeric"
                label="YYYY"
                value={ this.state.year }
                onChangeText={ (year) => this.setState({ year }) }
              />
            </View>
          </View>
          <View style={ styles.fullWidthButton }>
            <RaisedTextButton onPress={ this.fetchDotMonth } raised={ true } title="Get beats" />
          </View>
        </View>
        {/* </KeyboardAwareScrollView> */ }
      </View>
    );
  }
}
