import React, { Component } from "react";
import { InAppNotificationProvider } from "react-native-in-app-notification";
import { Platform, NativeModules } from "react-native"
import { createStackNavigator, createAppContainer } from "react-navigation";
import { navigationRef, isMountedRef } from './RootNave';
import ColorList from './components/colorList';
import LoginHomeRouter from "./LoginHomeRouter";
import GState from './stores/globalState/index';
require('moment/locale/cs.js');
require('moment/locale/es.js');
require('moment/locale/fr.js');
require('moment/locale/nl.js');
import moment from 'moment';
const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
    NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier;
const lan = deviceLanguage && deviceLanguage.includes('fr') ? 'fr' : 'en'
moment.locale([lan])
const AppNavigator = createStackNavigator(
  {
    LoginHomeRouter: { screen: LoginHomeRouter },
  },
  {
    initialRouteName: "LoginHomeRouter",
    headerMode: "none",
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default () => {
  GState.lang = "fr"

  return (
    <InAppNotificationProvider
      closeInterval={4000}
      height={80}
      openCloseDuration={1000}
      iconApp={GState.bleashupImage}
      backgroundColour={ColorList.indicatorInverted}
    >
      <AppContainer ref={navigationRef} />
    </InAppNotificationProvider>
  );
};

//console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
//console.disableYellowBox = true;
