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
import StatusView from "./../status/index";
import InvitationView from "./../invitations/index";
import Chats from "../poteschat";
import SettingView from "./../settings/index";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { groupBy, map, findIndex, reject } from "lodash"
import { withInAppNotification } from 'react-native-in-app-notification';
import stores from "../../../stores";
import CurrentEventView from '../currentevents';
import emitter from "../../../services/eventEmiter";
import firebase from 'react-native-firebase';
import GState from '../../../stores/globalState';
import CreateEvent from '../event/createEvent/CreateEvent';



import { find, forEach } from "lodash"
import CalendarServe from '../../../services/CalendarService';
import ForeignEventsModal from "./ForeignEventsModal";
import DeepLinking from 'react-native-deep-linking';
import Requester from '../event/Requester';
import shadower from "../../shadower";
import TabModal from "./TabModal";


let { height, width } = Dimensions.get('window');

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: 'active',
      isTabModalOpened: false,
      currentTab: 0
    };
    this.permisssionListener()
  }
  state = {

  }
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
  handleNotifications(data) {
    switch (data.type) {
      case "new_message_activity": {
        stores.Events.loadCurrentEvent(data.activity_id).then(event => {
          //console.warn(event)
          this.props.navigation.navigate('Event', {
            tab: "EventChat",
            Event: event,
            isOpen: true
          })
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
  initializeNotificationListeners() {
    this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notifiation) => {
      console.warn(notifiation)
    })
    this.removeNotificationListener = firebase.notifications().onNotification(notification => {
      console.warn(notification._data)
      emitter.emit("notify", { body: notification._body, title: notification._title, action: "new_message", data: notification._data })
    })
    this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed(notification => {
      console.warn(notification)
    })
  }
  navigateToEventDetails(id) {
    let event = find(stores.Events.events, { id: id })
    console.warn(event, id)
    if (event) {
      this.props.navigation.navigate("Event", {
        Event: event,
        tab: "EventDetails"
      });
    }
  }
  componentWillMount() {
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
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));
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
  componentDidMount() {
    //CalendarServe.saveEvent().then(() => {})
    stores.Highlights.initializeGetHighlightsListener()
    CalendarServe.fetchAllCalendarEvents().then(calendar => {
      let calen = groupBy(calendar, 'title')
      let idsMapper = map(calen, (value, key) => { return { title: key, ids: map(value, ele => ele.id) } })
      calen = map(calen, (value, key) => { return { ...value[0], key: key } })
      calen = reject(calen, ele => findIndex(stores.Events.events, e => e.about && ele.title === e.about.title) >= 0 || ele.title.includes('reminder'))
      if (calen.length > 0) {
        let i = 0
        forEach(calen, element => {
          idsmap = find(idsMapper, { title: element.key })
          let event = find(stores.Events.events, ele => idsmap.ids.indexOf(ele.calendar_id) >= 0)
          if (event) {
            Requester.updateTitle(event, element.key).then((state) => {
              if (i === calen.length - 1) {
                if (this.realNew.length > 0)
                  this.setState({
                    foreignEvents: calen,
                    isForeignEventsModalOpened: true
                  })
              }
              i = i + 1
            })
          } else {
            this.realNew.unshift(element)
            if (i === calen.length - 1) {
              this.setState({
                foreignEvents: calen,
                isForeignEventsModalOpened: true
              })
            }
            i = i + 1
          }
        })
        /**/
      }
    })
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
      setTimeout(() => {
        this.setState({
          currentTab: 0
        })
      }, 300)
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
    console.warn('home unmounting')
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton.bind(this));
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
  @autobind
  settings() { }

  /*
  @autobind
  setCreateButton(){
   
   if(this.refs.invitation_view.state.create==false){
      this.refs.invitation_view.setState({create:true});
      this.setState({color:"salmon"});
      
   }else{
     this.refs.invitation_view.setState({create:false});
     this.setState({color:"#1FABAB"});
   }
  }*/



  handleURL = ({ url }) => {
    console.warn("responding to links")
    Linking.canOpenURL(url).then(support => {
      if (support) {
        DeepLinking.evaluateUrl(url)
      }
    })
  }
  navigateToInvitations() {
    this.props.navigation.navigate("Invitation")
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
    StatusBar.setBackgroundColor("#FEFFDE", true)
    StatusBar.setBarStyle('dark-content', true)
    StatusBar.setHidden(false, true)
    return (
      <Container style={{ backgroundColor: "#FEFFDE" }}>
        <View style={{
          height: 40, width: "98%",
          backgroundColor: "#FEFFDE",
          borderBottomRightRadius: 5,
          borderBottomLeftRadius: 5,
          ...shadower(6), alignSelf: 'center', marginLeft: "1%", marginRight: "1%",
        }}>
          <View style={{
            flex: 1, backgroundColor: "#FEFFDE", flexDirection: "row",
            justifyContent: "space-between", marginLeft: "3%", marginRight: "3%"
          }}>
            <View style={{
              // transform: [{ rotate: spin }]
            }}>
              <Thumbnail small source={require("../../../../assets/ic_launcher_round.png")}></Thumbnail>
            </View>
            <View style={{ marginTop: '2%', }}>
              <View style={{ alignSelf: "flex-end", display: 'flex', flexDirection: 'row', }}>
                <Icon name="sc-telegram" active={true} type="EvilIcons" style={{ color: "#1FABAB", }} onPress={() => this.navigateToInvitations()} />
                <Icon name="gear" active={true} type="EvilIcons" style={{ color: "#1FABAB", }} onPress={() => this.settings()} />
              </View>
            </View>
          </View>

        </View>
        <Tabs
          locked
          tabContainerStyle={{
            borderWidth: 1,
            borderRadius: 8,
            borderColor: '#ddd',
            borderBottomWidth: 0,
            alignSelf: 'center',
            ...shadower(20),
            margin: "1%", height: 45, backgroundColor: "#1FABAB", borderRadius: 4,
          }}
          tabBarPosition="bottom"
          tabBarUnderlineStyle={{
            backgroundColor: "transparent"
          }}
          onChangeTab={({ i }) => {
            this.setState({
              currentTab: i
            })
          }}
        >
          <Tab
            tabStyle={{
              borderRadius: 0
            }}
            heading={
              <TabHeading>
                <View style={{ display: 'flex', }}>
                  <Icon name="ios-pulse" type="Ionicons" style={{ fontSize: this.state.currentTab == 0 ? 40 : 15, }} />
                </View>
              </TabHeading>
            }
          >
            <CurrentEventView {...this.props}></CurrentEventView>
          </Tab>

          <Tab
            heading={
              <TabHeading>
                <View>
                  <Icon name="ios-people" type="Ionicons" style={{ fontSize: this.state.currentTab == 1 ? 50 : 15, }} />
                </View>
              </TabHeading>
            }
          >
            <Chats {...this.props} />
          </Tab>
          <Tab
            heading={
              <TabHeading>
                <View>
                  <Icon name="user-alt" type="FontAwesome5" style={{ fontSize: this.state.currentTab == 2 ? 30 : 10, }} />
                </View>
              </TabHeading>
            }
          >
            <StatusView {...this.props} />
          </Tab>
        </Tabs>
        {this.state.isForeignEventsModalOpened ? <ForeignEventsModal isOpen={this.state.isForeignEventsModalOpened} onClosed={() => {
          this.setState({
            isForeignEventsModalOpened: false,
            foreignEvents: null
          })
        }} events={this.state.foreignEvents}>
        </ForeignEventsModal> : null}
        <TabModal isOpen={this.state.isTabModalOpened} closed={() => {
          this.setState({
            isTabModalOpened: false
          })
        }}></TabModal>
      </Container>
    );
  }
}

export default withInAppNotification(Home);
