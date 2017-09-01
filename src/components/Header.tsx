import * as React from 'react';

import { Text, View } from 'react-native';

import MaterialTabs from 'react-native-material-tabs';
import styles from '../styles';

interface Props {
  onTabChange: (tabIndex: number) => void;
}

export default class HeaderComponent extends React.Component<Props, any> {
  constructor(props) {
    super(props);

    this.state = {
      selectedTabIndex: 0,
    };
  }

  setTab = (tabIndex) => {
    this.setState({ selectedTabIndex: tabIndex })

    this.props.onTabChange(tabIndex);
  }

  render() {
    return (
      <View style={ styles.header }>
        <MaterialTabs
          items={ ['Beats', 'Month', 'Settings'] }
          selectedIndex={ this.state.selectedTabIndex }
          onChange={ this.setTab }
          barColor="#1fbcd2"
          indicatorColor="#1fbcfa"
          activeTextColor="white"
        />
      </View>
    );
  }
}
