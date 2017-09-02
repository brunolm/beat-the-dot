import * as React from 'react';

import { TextField } from 'react-native-material-textfield';
import { View } from 'react-native';

interface Props {
  label: string;
  onChangeText: (value: string) => void;
  value: string;
}

interface State {
  hour: number;
  minute: number;
}

interface HourMinuteValue {
  stateHour?: number;
  stateMinute?: number;
}

export default class HourMinuteInputComponent extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const [hourPart, minutePart] = this.props.value.split(':');
    this.state = {
      hour: hourPart ? +hourPart : 0,
      minute: minutePart ? +minutePart : 0,
    };
  }

  formatTime({ stateHour, stateMinute }: HourMinuteValue) {
    const hour = `0${stateHour || this.state.hour}`.slice(-2);
    const minute = `0${stateMinute || this.state.minute}`.slice(-2);

    return `${hour}:${minute}`;
  }

  onChangeHour = (value) => {
    this.setState({
      hour: value > 23 ? 23 : value < 0 ? 0 : value,
    });

    this.props.onChangeText(this.formatTime({ stateHour: value }));
  }

  onChangeMinute = (value) => {
    this.setState({
      minute: value > 59 ? 59 : value < 0 ? 0 : value,
    });

    this.props.onChangeText(this.formatTime({ stateMinute: value }));
  }

  render() {
    const { hour, minute } = this.state;

    return (
      <View style={ { flex: 1, flexDirection: 'row' } }>
        <View style={ { flex: 1, flexDirection: 'column', marginRight: 10 } }>
          <TextField
            keyboardType="numeric"
            label={ `${this.props.label} (HH)` }
            onChangeText={ this.onChangeHour }
            value={ (hour || '').toString() }
          />
        </View>
        <View style={ { flex: 1, flexDirection: 'column' } }>
          <TextField
            keyboardType="numeric"
            label={ `${this.props.label} (MM)` }
            onChangeText={ this.onChangeMinute }
            value={ (minute || '').toString() }
          />
        </View>
      </View>
    );
  }
}
