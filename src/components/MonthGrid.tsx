import * as React from 'react';
import * as ahgora from '../services/ahgora';
import * as moment from 'moment';

import { ScrollView, Text, View } from 'react-native';

import MonthYearInput from './MonthYearInput';
import { RaisedTextButton } from 'react-native-material-buttons';
import styles from '../styles';

interface State {
  grid: string;
  loaded: boolean;
  loading: boolean;
  monthYear: string;
}

export default class MonthGridComponent extends React.Component<any, State> {
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

    const [month, year] = this.state.monthYear.split('-');

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
          <View style={ { paddingBottom: 10 } }>

            <View style={ styles.fullWidthButton }>
              <MonthYearInput
                label="Year"
                onChangeText={ (value) => this.setState({ monthYear: value }) }
                value={ this.state.monthYear }
              />
              <RaisedTextButton onPress={ this.fetchDotMonth } raised={ true } title="Get beats" />
            </View>
          </View>

          <Text>{ this.state.grid }</Text>
        </ScrollView>
      </View>
    );
  }
}
