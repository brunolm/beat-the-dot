import { AsyncStorage } from 'react-native';

const options = {
  lunchAt: '11:30',
  lunchTime: 60,
  tolerance: 10,
  verbose: true,
  workHours: '08:00',
};

export async function get() {
  return JSON.parse((await AsyncStorage.getItem('settings')) || '{}');
}

export async function set(settings) {
  await AsyncStorage.setItem('settings', JSON.stringify(Object.assign({}, options, settings)));
}
