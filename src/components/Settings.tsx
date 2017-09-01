import * as React from 'react';
import * as settingsService from '../services/settings';

import { ScrollView, View } from 'react-native';

import { RaisedTextButton } from 'react-native-material-buttons';
import { TextField } from 'react-native-material-textfield';
import styles from '../styles';

export default class SettingsComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
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

  save = async () => {
    await settingsService.set({
      company: this.state.settingsCompany,
      user: this.state.settingsUser,
      pass: this.state.settingsPass,
    });
  }

  render() {
    return (
      <View style={ styles.flexCol }>
        <ScrollView>
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
        </ScrollView>

        <View style={ styles.fullWidthButton }>
          <RaisedTextButton onPress={ this.save } raised={ true } title="Save" />
        </View>
      </View>
    );
  }
}
