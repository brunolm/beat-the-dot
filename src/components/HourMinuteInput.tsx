import * as React from 'react';

import { Picker, Text, View } from 'react-native';

import styles from '../styles';

interface Props {
  label: string;
  onChangeText: (value: string) => void;
  value: string;
}

interface State {
  hour: string;
  minute: string;
}

export default class HourMinuteInputComponent extends React.Component<Props, State> {
  hours: any[];
  minutes: any[];
  constructor(props) {
    super(props);

    this.state = this.getStateFromProps(this.props);

    this.hours = Array.from({ length: 23 }, (_, i) => i + 1).map((val) => {
      const value = `0${val}`.slice(-2);
      return (<Picker.Item key={ `${val}` } label={ value } value={ value } />);
    });

    this.minutes = Array.from({ length: 60 }, (_, i) => i).map((val) => {
      const value = `0${val}`.slice(-2);
      return (<Picker.Item key={ `${val}` } label={ value } value={ value } />);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.value) {
      this.setState(this.getStateFromProps(nextProps));
    }
  }

  getStateFromProps(props) {
    const [hour, minute] = props.value.split(':');

    return {
      hour,
      minute,
    };
  }

  onChangeValue = ({ hour, minute }: { hour?: string; minute?: string; }) => {
    if (hour) {
      this.setState({ hour });
    }
    else if (minute) {
      this.setState({ minute });
    }

    const time = `${hour || this.state.hour}:${minute || this.state.minute}`;
    this.props.onChangeText(time);
  }

  render() {
    return (
      <View style={ { flex: 1, flexDirection: 'row' } }>
        <View style={ { flex: 1, flexDirection: 'column', marginRight: 10 } }>
          <Text style={ styles.materialLabel }>{ this.props.label } (hour)</Text>
          <Picker
            onValueChange={ (hour) => this.onChangeValue({ hour }) }
            selectedValue={ this.state.hour }
          >
            { this.hours }
          </Picker>
        </View>
        <View style={ { flex: 1, flexDirection: 'column' } }>
          <Text style={ styles.materialLabel }>{ this.props.label } (minute)</Text>
          <Picker
            onValueChange={ (minute) => this.onChangeValue({ minute }) }
            selectedValue={ this.state.minute }
          >
            { this.minutes }
          </Picker>
        </View>
      </View>
    );
  }
}
