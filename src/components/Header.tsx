import * as React from 'react';

import { Platform, StatusBar } from 'react-native';

import Beats from './Beats';
import MonthGrid from './MonthGrid';
import Settings from './Settings';
import { TabNavigator } from 'react-navigation';

const TabNav = TabNavigator({
  Beats: {
    navigationOptions: {
      title: 'Beats',
    },
    screen: Beats,
  },
  MonthGrid: {
    navigationOptions: {
      title: 'Month',
    },
    screen: MonthGrid,
  },
  Settings: {
    navigationOptions: {
      title: 'Settings',
    },
    screen: Settings,
  },
}, {
  swipeEnabled: true,
  tabBarOptions: {
    activeTintColor: '#fff',
    inactiveTintColor: 'rgba(255,255,255,.5)',
    indicatorStyle: {
      backgroundColor: 'white',
    },
    showIcon: false,
    style: {
      backgroundColor: 'black',
      paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    },
  },
  tabBarPosition: 'top',
});

export default class HeaderComponent extends React.Component<any, any> {
  render() {
    return (
      <TabNav />
    );
  }
}
