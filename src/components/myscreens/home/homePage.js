import React, { Component } from "react";
import {
  Platform,
  ScrollView,
  BackHandler,
  ToastAndroid,
  View,
  StatusBar,
  AppState,
  Linking,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import {
  Container,
  Header,
  Title,
  Icon,
  Text,
  Tabs,
  Tab,
  Body,
  TabHeading,
  Toast,
  Thumbnail
} from 'native-base';
import NetInfo from "@react-native-community/netinfo";
//import StatusView from "./../Viewer/index";
import SettingView from "./../settings/index";
import autobind from "autobind-decorator";
import {
  find
} from "lodash"
import { withInAppNotification } from 'react-native-in-app-notification';
import stores from "../../../stores";
import CurrentEventView from '../currentevents';
import emitter from "../../../services/eventEmiter";
import firebase from 'react-native-firebase';
import GState from '../../../stores/globalState';
import CreateEvent from '../event/createEvent/CreateEvent';

import ForeignEventsModal from "./ForeignEventsModal";
import DeepLinking from 'react-native-deep-linking';
import shadower from "../../shadower";
//import TabModal from "./TabModal";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import colorList from "../../colorList";
import BeNavigator from '../../../services/navigationServices';
import { PrivacyRequester, shared_post } from '../settings/privacy/Requester';
import EventListener from '../../../services/severEventListener';

let { height, width } = Dimensions.get('window');


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: 'active',
      isTabModalOpened: false,
      currentTab: 0,
      setting: false
    };
    this.permisssionListener()
  }
  state = {

  }
  //initialise menu
  _menu = null;


  spinValue = new Animated.Value(0)
  permisssionListener() {
    firebase.messaging().hasPermission().then(status => {
      if (status) {
        this.initializeNotificationListeners()
      } else {
        firebase.messaging().requestPermission().then(permission => {
          if (permission) {
            this.permisssionListener()
          } else {
            console.warn("unable to get permission !")
          }
        })
      }
    })
  }
  navigateToChat(data) {
    this.handleNotif(data)
  }
  handleNotif(data) {
    switch (data.type) {
      case "new_message_activity": {
        stores.Events.loadCurrentEvent(data.activity_id).then(event => {
          BeNavigator.navigateToActivity('EventChat', event)
        })
        break;
      }
      case "relation": {
        break
      }
      //break;
      default:
        console.warn('defaulting.=------')
        break
    }
  }
  handleNotifications(data) {
    this.handleNotif(data)
  }
  initializeNotificationListeners() {
    this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notifiation) => {
      this.navigateToChat(notifiation.notification._data)
      firebase.notifications().removeAllDeliveredNotifications()
    })
    this.removeNotificationListener = firebase.notifications().onNotification(notification => {
      console.warn(notification._data)
      GState.currentCommitee !== notification._data.room_key && emitter.emit(notification._data.activity_id + '_refresh-commitee')
      emitter.emit("notify", { body: notification._body, title: notification._title, action: "new_message", data: notification._data })
    })
    this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed(notification => {
      console.warn(notification)
    })
  }
  navigateToEventDetails(id) {
    let event = find(stores.Events.events, { id: id })
    if (event) {
      BeNavigator.navigateToActivity("EventChat", event);
    }
  }
  componentWillMount() {
    //EventListener.stopConnection()
    Linking.addEventListener('url', this.handleURL)
    DeepLinking.addScheme(GState.DeepLinkURL);
    DeepLinking.addRoute('/tester', response => {
      console.warn('responding to this nice test', response);
    })
    DeepLinking.addRoute('/event/:id', response => {
      this.navigateToEventDetails(response.id)
    })
    Linking.getInitialURL().then((url) => {
      if (url) {
        Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
    AppState.addEventListener('change', this._handleAppStateChange);
    NetInfo.isConnected.addEventListener("connectionChange", this.handleConnectionChange);
    //BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));
  }
  animating = false
  launchAnimation() {
    if (!this.animating)
      Animated.timing(
        this.spinValue,
        {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear
        }
      ).start()
    this.animating = true
  }
  realNew = []
  testers(){
    setTimeout(() => {
      PrivacyRequester.shareWithSome("vKgCzYsA6iOzc2SJBujwSnlHlETWjhAbIa7",
      "740a5530-8b20-11ea-9234-9b01561bce6b",
      shared_post,
      "Pink Pink","Filbee","",[{phone:'002375465643933',host:""},{phone:'00335345645323',host:""}]).then((res) => {
        console.warn("privacy test response", res)
      })
    },1000)
  }
  componentDidMount() {
    stores.Events.initSearch()
    emitter.on("notify", (event) => {
      {
        if (GState.currentRoom !== event.data.room_key) {
          this.props.showNotification({
            title: event.title,
            message: event.body,
            vibrate: false,
            onPress: () => this.handleNotifications(event.data)

          });
        } else {
          //let phone = stores.LoginStore.user.phone.replace("00", "+");
          // firebase.database().ref(`new_message/${phone}/${event.data.room_key}/new_messages`).set([])
        }
      }
      stores.LoginStore.getUser().then((user) => {
        firebase.messaging().requestPermission().then(staus => {
          firebase.messaging().getToken().then(token => {
            //console.warn(token)
            //GState.socket.close()
            firebase.database().ref(`notifications_tokens/${user.phone.replace('00', '+')}`).set(token)
          }).catch(error => {
            console.warn(error)
          })
        })
      })
    })
  }
  exiting = false
  timeout = null
  componentWillUnmount() {

    //BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton.bind(this));
    this.removeNotificationDisplayedListener()
    Linking.removeEventListener('url', this.handleUrl);
    this.removeNotificationListener()
    AppState.removeEventListener('change', this._handleAppStateChange);
    this.removeNotificationOpenedListener()
  }
  _handleAppStateChange = (nextAppState) => {
    if (nextAppState !== 'active') {
      firebase.database().ref(`current_room/${stores.LoginStore.user.phone.replace("00", "+")}`).set(null)
    }
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      firebase.database().ref(`current_room/${stores.LoginStore.user.phone.replace("00", "+")}`).set(GState.currentRoom)
      console.log('App has come to the foreground!');
    } else {
      //firebase.database().ref(`current_room/${stores.LoginStore.user.phone.replace("00","+")}`).set(null)
    }
    this.setState({ appState: nextAppState });
  };
  handleBackButton() {
    //BackHandler.exitApp()
    if (this.exiting) {
      clearTimeout(this.timeout)
      BackHandler.exitApp()
      return true
    } else {
      this.exiting = true
      Toast.show({ text: "Press again to leave" });
      this.timeout = setTimeout(() => {
        this.exiting = false
      }, 2000)
    }
    return true;
  }
  handleConnectionChange(connect) {
    //connect ? console.warn("connected") : console.warn("not connected")
  }
  state = {
    scroll: true,
    currentTab: 0
  };


  settings = () => {
    BeNavigator.navigateTo("Settings");
  };

  handleURL = ({ url }) => {
    console.warn("responding to links")
    Linking.canOpenURL(url).then(support => {
      if (support) {
        DeepLinking.evaluateUrl(url)
      }
    })
  }
  navigateToInvitations() {
    BeNavigator.navigateTo("voteCard");
  }
  render() {
    const { concat, cos } = Animated
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 95]
    })
    setTimeout(() => {
      //this.launchAnimation()
    }, 1000)
    StatusBar.setBackgroundColor(colorList.headerBackground, true)
    StatusBar.setBarStyle('dark-content', true)
    StatusBar.setHidden(false, true)

    return (
      <View style={{ height: colorList.containerHeight, backgroundColor: colorList.containerBackground, width: colorList.containerWidth }}>

        <View style={{ height: colorList.headerHeight, backgroundColor: colorList.headerBackground, width: "100%",marginBottom:5 }}>


          <View style={{ ...bleashupHeaderStyle, backgroundColor: colorList.headerBackground, flexDirection: "row", justifyContent: "space-between", width: "100%", }}>

            <View style={{ alignSelf: "flex-start", justifyContent: "center", height: "95%" }}>
              <Thumbnail source={require("../../../../assets/bleashuptitle1.png")} style={{ width: 120 }}></Thumbnail>
            </View>


            <View style={{ height: "100%", alignSelf: "flex-end", display: 'flex', flexDirection: 'row', marginRight: "2%" }}>

              <TouchableOpacity style={{ height: 40, alignItems: "center", justifyContent: "center" }} onPress={() => this.navigateToInvitations()}>
                <Icon name="sc-telegram" active={true} type="EvilIcons" style={{ color: colorList.headerIcon, }} onPress={() => this.navigateToInvitations()} />
              </TouchableOpacity>

              <TouchableOpacity style={{ height: 40, alignItems: "center", justifyContent: "center" }} onPress={this.settings} >
                  <Icon name="gear" active={true} type="EvilIcons" style={{ color: colorList.headerIcon, marginLeft: width / 35 }} onPress={this.settings}/>
              </TouchableOpacity>

            </View>



          </View>
          
        </View>

        <View style={{ marginBottom: 100 }}>
          <CurrentEventView {...this.props}></CurrentEventView>
        </View>

      </View>
    );
  }
}

export default withInAppNotification(Home);
