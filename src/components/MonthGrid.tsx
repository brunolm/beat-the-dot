import * as React from 'react';
import * as ahgora from '../services/ahgora';
import * as moment from 'moment';

import { ScrollView, Text, View } from 'react-native';

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
      monthYear: moment().format('MM-YYYY'),
    };
  }

  fetchDotMonth = async () => {
    this.setState({
      loading: true,
    });

    const filterDate = moment(this.state.monthYear, 'MM-YYYY');

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
        <ScrollView>
          <Text>{ this.state.grid }</Text>
        </ScrollView>

        <View style={ styles.fullWidthButton }>
          <TextField
            label="MM-YYYY"
            value={ this.state.monthYear }
            onChangeText={ (monthYear) => this.setState({ monthYear }) }
          />
          <RaisedTextButton onPress={ this.fetchDotMonth } raised={ true } title="Get beats" />
        </View>
      </View>
    );
  }
}
