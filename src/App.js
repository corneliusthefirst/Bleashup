import React, { Component } from "react";
//import { AppLoading } from 'expo';
//import { Ionicons } from '@expo/vector-icons';
//import * as Font from 'expo-font';
import { InAppNotificationProvider } from "react-native-in-app-notification";
import { Root, StyleProvider } from "native-base";

import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import { navigationRef, isMountedRef } from './RootNave';
import getTheme from "./native-base-theme/components";
import Materials from "./native-base-theme/variables/material";
import CommonColor from "./native-base-theme/variables/commonColor";
import Home from "./components/myscreens/home/homePage";
import SettingView from "./components/myscreens/settings/index";
import ProfileView from "./components/myscreens/settings/profile";
import ActuView from "./components/myscreens/settings/editActu";
import CurrentEventView from "./components/myscreens/currentevents/index";
import InvitationView from "./components/myscreens/invitations/index";
import PotesChat from "./components/myscreens/poteschat/index";
import StatusView from "./components/myscreens/status/index";
import ContactView from "./components/myscreens/Contacts/Contact";
import NewContactView from "./components/myscreens/Contacts/NewContact";

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
import ChangeLogs from "./components/myscreens/changelogs/index";
import EventDetail from "./components/myscreens/eventDetails";
import EventChat from "./components/myscreens/eventDetails";
import Reminds from "./components/myscreens/reminds/index";
import CreateEventView from "./components/myscreens/event/createEvent/index"
import EventDetailView from "./components/myscreens/eventDetails/index"
import SendInvitations from "./components/myscreens/sent-invitations/index";
import MyTasksView from './components/myscreens/MyTasks/MyTasks'
import HighLightsDetails from './components/myscreens/highlights_details';
import LocalTasksCreation from './components/myscreens/MyTasks/localTasksCreation'
import TasksCreation from './components/myscreens/reminds/TasksCreation'
import QRCode from "./components/myscreens/QR"
import SearchView from './components/myscreens/event/searchView';
import MessageBox from './components/myscreens/eventChat/messageBox';
import CommentsPage from './components/myscreens/event/createEvent/components/CommentsPage';
import SearchUser from './components/myscreens/Contacts/searchUser'
import ColorList from './components/colorList';

/*
let {height, width} = Dimensions.get('window');
EStyleSheet.build({ 
  $rem: width > 340 ? 18 : 16
});*/

const AppNavigator = createStackNavigator(
  {

    Home: { screen: Home },
    CurrentEvent: { screen: CurrentEventView },
    QR: { screen: QRCode },
    Settings: { screen: SettingView },
    Contacts: { screen: ContactView },
    NewContact: { screen: NewContactView },
    Profile: { screen: ProfileView },
    Actu: { screen: ActuView },
    Status: { screen: StatusView },
    Invitation: { screen: InvitationView },
    PotesChat: { screen: PotesChat },
    Login: { screen: LoginView },
    Comment: { screen: CommentsPage },
    ForgotPassword: { screen: ForgotPasswordView },
    ResetCode: { screen: ResetCodeView },
    ResetPassword: { screen: ResetPasswordView },
    SignUp: { screen: SignUpView },
    EmailVerification: { screen: EmailVerificationView },
    SignIn: { screen: SignInView },
    LoginHome: { screen: LoginHomeView },
    Event: { screen: Event },
    HighLightsDetails: { screen: HighLightsDetails },
    Contributions: { screen: Contributions },
    Votes: { screen: Votes },
    Highlights: { screen: Highlights },
    ChangeLogs: { screen: ChangeLogs },
    EventDetails: { screen: EventDetail },
    EventChat: { screen: EventChat },
    Reminds: { screen: Reminds },
    CreateEventView: { screen: CreateEventView },
    SendInvitations: { screen: SendInvitations },
    MyTasksView: { screen: MyTasksView },
    EventDetailView: { screen: EventDetailView },
    LocalTasksCreation: { screen: LocalTasksCreation },
    TasksCreation: { screen: TasksCreation },
    SearchView  : {screen: SearchView },
    MessageBox  : {screen: MessageBox },
    SearchUser  : {screen: SearchUser },
  },
  {
    initialRouteName: "LoginHome",
    headerMode: "none"
  }
);
const app = reazy();
app.use(routerActions(), "routerActions");

const AppContainer = createAppContainer(AppNavigator);

export default () => {
  React.useEffect(() => {
    isMountedRef.current = true;

    return () => (isMountedRef.current = false);
  }, []);
  return <Root>
    <InAppNotificationProvider closeInterval={4000} height={80} openCloseDuration={1000}
      iconApp={require('../assets/BleashupIcon.png')} backgroundColour={ColorList.indicatorInverted}>
      <StyleProvider style={getTheme(CommonColor)}>
        <Provider app={app}>
          <AppContainer ref={navigationRef} />
        </Provider>
      </StyleProvider>
    </InAppNotificationProvider>
  </Root>
};

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
