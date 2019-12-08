/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App.js';
import { name as appName } from './app.json';
// ignore specific yellowbox warnings
AppRegistry.registerComponent(appName, () => App);

 