import * as React from 'react';
import * as moment from 'moment';

import { Picker, View } from 'react-native';

import { TextField } from 'react-native-material-textfield';

interface Props {
  label: string;
  onChangeText: (value: string) => void;
  value: string;
}

interface State {
  month: string;
  year: string;
}

interface Value {
  stateMonth?: string;
  stateYear?: string;
}

export default class MonthYearInputComponent extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = this.getStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.value) {
      this.setState(this.getStateFromProps(nextProps));
    }
  }

  getStateFromProps(props) {
    const [monthPart, yearPart] = props.value.split('-');

    return {
      month: monthPart ? monthPart : moment().format('MM'),
      year: yearPart ? yearPart : moment().format('YYYY'),
    };
  }

  formatDate({ stateMonth, stateYear }: Value) {
    const month = `0${stateMonth || this.state.month}`.slice(-2);
    const year = `${stateYear || this.state.year}`;

    return `${month}-${year}`;
  }

  onChangeMonth = (value) => {
    this.setState({
      month: value,
    });

    this.props.onChangeText(this.formatDate({ stateMonth: value }));
  }

  onChangeYear = (value) => {
    this.setState({
      year: value,
    });

    this.props.onChangeText(this.formatDate({ stateYear: value }));
  }

  render() {
    const monthItems = moment.months().map((monthName, i) => {
      const value = `0${ i + 1}`.slice(-2);
      return (<Picker.Item key={ i } label={ `${monthName} (${value})` } value={ value } />);
    });

    return (
      <View>
        <Picker
          selectedValue={ this.state.month }
          onValueChange={ this.onChangeMonth }
        >
          { monthItems }
        </Picker>
        <TextField
          keyboardType="numeric"
          label={ `${this.props.label}` }
          maxLength={ 4 }
          onChangeText={ this.onChangeYear }
          value={ this.state.year }
        />
      </View>
    );
  }
}
