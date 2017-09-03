import * as React from 'react';
import * as settingsService from '../services/settings';

import { Alert, KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';

import DatePicker from 'react-native-datepicker';
import HourMinuteInput from './HourMinuteInput';
import { RaisedTextButton } from 'react-native-material-buttons';
import { TextField } from 'react-native-material-textfield';
import styles from '../styles';

export default class SettingsComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      settingsCompany: '',
      settingsLunchAt: '11:30',
      settingsLunchAt2: undefined,
      settingsLunchTime: 60,
      settingsPass: '',
      settingsTolerance: 10,
      settingsUser: '',
      settingsWorkHours: '08:00',
    };
  }

  async componentDidMount() {
    await this.loadSettings();
  }

  async loadSettings() {
    const settings = await settingsService.get();

    this.setState({
      settingsCompany: settings.company,
      settingsLunchAt: settings.lunchAt,
      settingsLunchTime: settings.lunchTime,
      settingsPass: settings.pass,
      settingsTolerance: settings.tolerance,
      settingsUser: settings.user,
      settingsWorkHours: settings.workHours,
    });
  }

  save = async () => {
    await settingsService.set({
      company: this.state.settingsCompany,
      lunchAt: this.state.settingsLunchAt,
      lunchTime: +this.state.settingsLunchTime,
      pass: this.state.settingsPass,
      tolerance: +this.state.settingsTolerance,
      user: this.state.settingsUser,
      workHours: this.state.settingsWorkHours,
    });

    Alert.alert('Settings saved!', 'Successfuly saved settings.');
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={ 64 } style={ { flex: 1 } }>
        <ScrollView style={ styles.flexCol }>
          <TextField
            autoCapitalize="none"
            autoCorrect={ false }
            label="Company"
            value={ this.state.settingsCompany }
            onChangeText={ (settingsCompany) => this.setState({ settingsCompany }) }
          />

          <TextField
            keyboardType="numeric"
            label="User"
            maxlength={ 10 }
            value={ this.state.settingsUser }
            onChangeText={ (settingsUser) => this.setState({ settingsUser }) }
          />

          <TextField
            keyboardType="numeric"
            label="Pass"
            maxlength={ 10 }
            secureTextEntry
            value={ this.state.settingsPass }
            onChangeText={ (settingsPass) => this.setState({ settingsPass }) }
          />

          <TextField
            keyboardType="numeric"
            label="Tolerance (minutes)"
            maxlength={ 3 }
            value={ this.state.settingsTolerance.toString() }
            onChangeText={ (settingsTolerance) => this.setState({ settingsTolerance }) }
          />

          <TextField
            keyboardType="numeric"
            label="Lunch interval (minutes)"
            maxlength={ 3 }
            value={ this.state.settingsLunchTime.toString() }
            onChangeText={ (settingsLunchTime) => this.setState({ settingsLunchTime }) }
          />

          <HourMinuteInput
            label="Lunch at"
            onChangeText={ (settingsLunchAt) => this.setState({ settingsLunchAt }) }
            value={ this.state.settingsLunchAt }
          />

          <HourMinuteInput
            label="Work time"
            onChangeText={ (settingsWorkHours) => this.setState({ settingsWorkHours }) }
            value={ this.state.settingsWorkHours }
          />

          <View style={ styles.fullWidthButton }>
            <RaisedTextButton onPress={ this.save } raised={ true } title="Save" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
