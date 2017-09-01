import * as React from 'react';

import { Platform, StatusBar } from 'react-native';

import Beats from './Beats';
import MonthGrid from './MonthGrid';
import Settings from './Settings';
import { TabNavigator } from 'react-navigation';

const TabNav = TabNavigator({
  Beats: {
    screen: Beats,
    navigationOptions: {
      title: 'Beats',
    },
  },
  MonthGrid: {
    screen: MonthGrid,
    navigationOptions: {
      title: 'Month',
    },
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      title: 'Settings',
    },
  },
}, {
  tabBarPosition: 'top',
  swipeEnabled: true,
  tabBarOptions: {
    showIcon: false,
    activeTintColor: '#fff',
    inactiveTintColor: 'rgba(255,255,255,.5)',
    indicatorStyle: {
      backgroundColor: 'white',
    },
    style: {
      backgroundColor: 'black',
      paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    },
  },
});

export default class HeaderComponent extends React.Component<any, any> {
  render() {
    return (
      <TabNav />
    );
  }
}
