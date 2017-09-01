import * as React from 'react';
import * as ahgora from './services/ahgora';
import * as moment from 'moment';
import * as settingsService from './services/settings';

import { AsyncStorage, KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';

import Header from './components/Header';
import { RaisedTextButton } from 'react-native-material-buttons';
import { TextField } from 'react-native-material-textfield';
import styles from './styles';

export default class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      grid: '',
      hoursWorkedToday: '',
      lastFetch: '',
      loaded: false,
      loading: false,
      message: '',
      monthYear: moment().format('MM-YYYY'),
      tabIndex: 0,
      todayBeats: '',
      settingsCompany: '',
      settingsUser: '',
      settingsPass: '',
    };
  }

  async componentWillMount() {
    const settings = await settingsService.get();

    this.setState({
      settingsCompany: settings.company,
      settingsUser: settings.user,
      settingsPass: settings.pass,
    });
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

  fetchDot = async (monthYear = '') => {
    this.setState({
      loading: true,
    });

    const result = await ahgora.getTimes();
    const today = ahgora.getToday(result.times);

    const message = await ahgora.parseResult(result.times);
    const hoursWorkedToday = ahgora.hoursWorkedToday(today.beats);

    const grid = await ahgora.parseGrid(result.times);

    this.setState({
      grid,
      hoursWorkedToday,
      lastFetch: moment().format('LT'),
      loaded: true,
      loading: false,
      message,
      todayBeats: today.beatsRaw,
    });
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

  tabChange = (tabIndex) => {
    this.setState({
      tabIndex,
    });
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

  save = async () => {
    await settingsService.set({
      company: this.state.settingsCompany,
      user: this.state.settingsUser,
      pass: this.state.settingsPass,
    });
  }

  render() {
    return (
      <View style={ styles.main }>
        <Header onTabChange={ this.tabChange } />
        { this.state.tabIndex === 0 &&
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
        }
        { this.state.tabIndex === 1 &&
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
        }
        { this.state.tabIndex === 2 &&
          <View style={ styles.flexCol }>
            <ScrollView>
              <TextField
                label="Company"
                value={ this.state.settingsCompany }
                onChangeText={ (settingsCompany) => this.setState({ settingsCompany }) }
              />

              <TextField
                label="User"
                value={ this.state.settingsUser }
                onChangeText={ (settingsUser) => this.setState({ settingsUser }) }
              />

              <TextField
                label="Pass"
                secureTextEntry
                value={ this.state.settingsPass }
                onChangeText={ (settingsPass) => this.setState({ settingsPass }) }
              />
            </ScrollView>

            <View style={ styles.fullWidthButton }>
              <RaisedTextButton onPress={ this.save } raised={ true } title="Save" />
            </View>
          </View>
        }
      </View>
    )
  }
}
