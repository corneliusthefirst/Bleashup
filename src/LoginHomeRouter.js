import React, { Component } from 'react';
import {
  createStackNavigator,
  createNavigationContainer,
} from 'react-navigation';
import HomeNavigation from "./HomeNavigation";
import LoginView from './components/myscreens/login/index';
import LoginHomeView from './components/myscreens/loginhome/index';
import { enableScreens } from 'react-native-screens';
import SignInView from './components/myscreens/signIn';
import SignUpView from './components/myscreens/signUp/index';
import EmailVerificationView from './components/myscreens/signUp/EmailVerification';

enableScreens();
const HomeNavigator = createStackNavigator(
  {
    Home: { screen: HomeNavigation },
    Login: { screen: LoginView },
    SignIn: {screen:SignInView},
    SignUp:{screen:SignUpView},
    EmailVerification:{screen:EmailVerificationView},
    LoginHome: { screen: LoginHomeView },
  },
  {
    initialRouteName: 'LoginHome',
    headerMode: 'none',
  }
);
const HomeContainer = createNavigationContainer(HomeNavigator);

export default () => {
  return <HomeContainer id={1} />;
};
