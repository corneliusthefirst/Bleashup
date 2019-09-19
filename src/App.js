import React, { Component } from "react";
//import { AppLoading } from 'expo';
//import { Ionicons } from '@expo/vector-icons';
//import * as Font from 'expo-font';

import { Root, StyleProvider } from "native-base";

import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import getTheme from "./native-base-theme/components";
import Materials from "./native-base-theme/variables/material";
import CommonColor from "./native-base-theme/variables/commonColor";
import Home from "./components/myscreens/home/homePage";
import SettingView from "./components/myscreens/settings/index";
import PastEventView from "./components/myscreens/pastevents/index";
import CurrentEventView from "./components/myscreens/currentevents/index";
import InvitationView from "./components/myscreens/invitations/index";
import PersonalEventView from "./components/myscreens/personalevents/index";
import PotesChat from "./components/myscreens/poteschat/index";
import Status from "./components/myscreens/status/index";
import LoginView from "./components/myscreens/login/index";
import ForgotPasswordView from "./components/myscreens/forgotpassword/index";
import ResetCodeView from "./components/myscreens/forgotpassword/resetCode";
import ResetPasswordView from "./components/myscreens/forgotpassword/resetPassword";
import SignUpView from "./components/myscreens/signUp/index";
import EmailVerificationView from "./components/myscreens/signUp/EmailVerification";
import SignInView from "./components/myscreens/signIn/index";
import LoginHomeView from "./components/myscreens/loginhome/index";
import stores from "./stores";
import routerActions from "reazy-native-router-actions";
import reazy from "reazy";

import { Provider } from "mobx-react";
import Event from "./components/myscreens/event";
import Contributions from "./components/myscreens/contributions";
import Votes from "./components/myscreens/votes";
import Highlights from "./components/myscreens/highlights";
import ChangeLogs from "./components/myscreens/changelogs";
//import EventDetail from "./components/myscreens/eventDetails";
import EventChat from "./components/myscreens/eventDetails";
import Reminds from "./components/myscreens/reminds";
import CreateEventView from "./components/myscreens/invitations/components/createEvent/index"
import EventDetailView from "./components/myscreens/invitations/components/createEvent/components/EventDetails"
import SendInvitations from "./components/myscreens/sent-invitations/index";
import MyTasksView  from './components/myscreens/MyTasks/MyTasks'


/*
let {height, width} = Dimensions.get('window');
EStyleSheet.build({
  $rem: width > 340 ? 18 : 16
});*/


const AppNavigator = createStackNavigator(
  {
    Home: { screen: Home },
    CurrentEvent: { screen: CurrentEventView },
    PassEvent: { screen: PastEventView },
    Settings: { screen: SettingView },
    Status: { screen: Status },
    Invitation: { screen: InvitationView },
    PersonalEvent: { screen: PersonalEventView },
    PotesChat: { screen: PotesChat },
    Login: { screen: LoginView },
    ForgotPassword: { screen: ForgotPasswordView },
    ResetCode: { screen: ResetCodeView },
    ResetPassword: { screen: ResetPasswordView },
    SignUp: { screen: SignUpView },
    EmailVerification: { screen: EmailVerificationView },
    SignIn: { screen: SignInView },
    LoginHome: { screen: LoginHomeView },
    Event: { screen: Event },
    Contributions: { screen: Contributions },
    Votes: { screen: Votes },
    Highlights: { screen: Highlights },
    ChangeLogs: { screen: ChangeLogs },
   // EventDetails: { screen: EventDetail },
    EventChat: { screen: EventChat },
    Reminds: { screen: Reminds },
    CreateEventView:{screen: CreateEventView},
    SendInvitations:{screen:SendInvitations},
    MyTasksView:{screen:MyTasksView},
    EventDetailView:{screen:EventDetailView ,navigationOptions: {gesturesEnabled: false}}
  },
  {
    initialRouteName: "EventDetailView",
    headerMode: "none"
  }
);
const app = reazy();
app.use(routerActions(), "routerActions");

const AppContainer = createAppContainer(AppNavigator);

export default () => (
  <Root>
    <StyleProvider style={getTheme(CommonColor)}>
      <Provider app={app}>
        <AppContainer />
      </Provider>
    </StyleProvider>
  </Root>
);










//Todo : Expo app setup
/*export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <Container>
        <Text>Open up App.js to start working on your app!</Text>
      </Container>
    );
  }
}*/