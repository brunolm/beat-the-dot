import * as React from 'react';
import * as ahgora from '../services/ahgora';
import * as moment from 'moment';

import { Alert, ScrollView, Text, View } from 'react-native';

import { RaisedTextButton } from 'react-native-material-buttons';
import styles from '../styles';

export default class BeatsComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      hoursWorkedToday: '',
      lastFetch: '',
      loaded: false,
      loading: false,
      message: '',
      todayBeats: '',
    };
  }

  fetchDot = async () => {
    this.setState({
      loading: true,
    });

    try {
      const result = await ahgora.getTimes();
      const today = ahgora.getToday(result.times);

      const message = await ahgora.parseResult(result.times);
      const hoursWorkedToday = ahgora.hoursWorkedToday(today.beats);

      this.setState({
        hoursWorkedToday,
        lastFetch: moment().format('LT'),
        loaded: true,
        loading: false,
        message,
        todayBeats: today.beatsRaw,
      });
    }
    catch (err) {
      Alert.alert('Server error', 'Try again later');

      this.setState({
        loading: false,
      });
    }
  }

  renderByState() {
    if (this.state.loaded) {
      return (
        <View>
          <Text>Last fetch: { this.state.lastFetch }</Text>
          <View style={ styles.beatsContainer }>
            <Text>Today's beats</Text>
            <Text style={ styles.beats }>{ this.state.todayBeats }</Text>
            <Text>Hours today</Text>
            <Text style={ styles.beats }>{ this.state.hoursWorkedToday }</Text>
          </View>
          <Text>{ this.state.message }</Text>
        </View>
      );
    }

    return (
      <View>
        <Text>Click the button to load data</Text>
      </View>
    );
  }

  reset = () => {
    this.setState({
      hoursWorkedToday: '',
      lastFetch: '',
      loaded: false,
      loading: false,
      message: '',
      tabIndex: 0,
      todayBeats: '',
    });
  }

  render() {
    return (
      <View style={ styles.flexCol }>
        <ScrollView>
          { this.renderByState() }

          { this.state.loading &&
            <Text>Loading...</Text>
          }
        </ScrollView>

        <View style={ styles.fullWidthButton }>
          <RaisedTextButton onPress={ this.fetchDot } raised={ true } title="Get beats" />
          {/* <RaisedTextButton onPress={ this.reset } raised={ true } title="Reset" /> */}
        </View>
      </View>
    );
  }
}
