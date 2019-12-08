import React, { Component } from "react";
import { Platform, ScrollView, BackHandler, ToastAndroid, View, StatusBar, AppState, } from 'react-native';
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
  Card,
  Toast
} from 'native-base';
import NetInfo from "@react-native-community/netinfo";
import StatusView from "./../status/index";
import InvitationView from "./../invitations/index";
import Chats from "../poteschat";
import SettingView from "./../settings/index";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import { groupBy, map, findIndex, reject } from "lodash"
import RNExitApp from "react-native-exit-app";
import { withInAppNotification } from 'react-native-in-app-notification';
import stores from "../../../stores";
import CurrentEventView from '../currentevents';
import emitter from "../../../services/eventEmiter";
import firebase from 'react-native-firebase';
import GState from '../../../stores/globalState';
import CalendarServe from '../../../services/CalendarService';
import ForeignEventsModal from "./ForeignEventsModal";



@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: 'active',
      currentTab: 0
    };
    this.permisssionListener()
  }
  state = {

  }
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
  componentWillMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    NetInfo.isConnected.addEventListener("connectionChange", this.handleConnectionChange);
    //BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));
  }
  /*[{ "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2019-04-20T00:00:00.000Z", "startDate": "2019-04-19T00:00:00.000Z", "description": "", "title": "Good Friday", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "12" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2019-05-02T00:00:00.000Z", "startDate": "2019-05-01T00:00:00.000Z", "description": "", "title": "Labour Day", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "13" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2019-05-21T00:00:00.000Z", "startDate": "2019-05-20T00:00:00.000Z", "description": "", "title": "National Day", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "14" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2019-05-31T00:00:00.000Z", "startDate": "2019-05-30T00:00:00.000Z", "description": "", "title": "Ascension Day", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "15" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2019-08-16T00:00:00.000Z", "startDate": "2019-08-15T00:00:00.000Z", "description": "", "title": "Assumption of Mary", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "17" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2019-10-02T00:00:00.000Z", "startDate": "2019-10-01T00:00:00.000Z", "description": "", "title": "Independence of Southern British Cameroons from UK", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "18" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2019-11-11T00:00:00.000Z", "startDate": "2019-11-10T00:00:00.000Z", "description": "", "title": "The Prophet's Birthday", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "19" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2019-12-26T00:00:00.000Z", "startDate": "2019-12-25T00:00:00.000Z", "description": "", "title": "Christmas Day", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "20" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2020-01-02T00:00:00.000Z", "startDate": "2020-01-01T00:00:00.000Z", "description": "", "title": "New Year's Day", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "21" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2020-02-12T00:00:00.000Z", "startDate": "2020-02-11T00:00:00.000Z", "description": "", "title": "Youth Day", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "22" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2020-08-01T00:00:00.000Z", "startDate": "2020-07-31T00:00:00.000Z", "description": "", "title": "Eid al-Adha", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "27" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2019-11-12T00:00:00.000Z", "startDate": "2019-11-11T00:00:00.000Z", "description": "", "title": "The Prophet's Birthday observed", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "28" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2019-06-05T00:00:00.000Z", "startDate": "2019-06-04T00:00:00.000Z", "description": "", "title": "Eid al-Fitr", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "29" }, { "alarms": [], "attendees": [], "availability": "free", "location": "", "allDay": true, "endDate": "2020-05-26T00:00:00.000Z", "startDate": "2020-05-25T00:00:00.000Z", "description": "", "title": "Eid al-Fitr observed", "calendar": { "allowsModifications": false, "isPrimary": false, "color": "#16A765", "type": "com.google", "allowedAvailabilities": ["busy", "free"], "source": "gf.694765457@gmail.com", "title": "Holidays in Cameroon", "id": "11" }, "id": "31" }, { "location": null, "allDay": false, "calendar": { "allowsModifications": true, "isPrimary": true, "color": "#4CB5DE", "type": "LOCAL", "allowedAvailabilities": ["busy", "free"], "source": "My calendar", "title": "My calendar", "id": "1" }, "id": "36", "recurrenceRule": { "interval": 1, "duration": "P3600S", "frequency": "monthly" }, "alarms": [{ "date": "2019-12-05T02:10:00.000Z" }], "attendees": [], "availability": "free", "endDate": "2019-12-05T03:00:00.000Z", "startDate": "2019-12-05T02:00:00.000Z", "description": "", "title": "Do to the  gymhttps://sigonews.com/2019/08/oracle", "recurrence": "monthly" }, { "alarms": [], "attendees": [], "availability": "busy", "location": "ertegdfbertertre", "allDay": false, "endDate": "2019-11-24T04:03:30.000Z", "startDate": "2019-11-24T03:03:30.000Z", "description": "Job Description Writing Process\n\t\tThe process of w...", "title": "Dancing Pinko Pinka Event", "calendar": { "allowsModifications": true, "isPrimary": true, "color": "#4CB5DE", "type": "LOCAL", "allowedAvailabilities": ["busy", "free"], "source": "My calendar", "title": "My calendar", "id": "1" }, "id": "61" }]*/


  componentDidMount() {
    CalendarServe.fetchAllCalendarEvents().then(calendar => {
      let calen = groupBy(calendar, 'title')
      calen = map(calen, (value, key) => value[0])
      calen = reject(calen, ele => findIndex(stores.Events.events, e => ele.title === e.about.title) >= 0)
      if (calen.length > 0) {
        this.setState({
          foreignEvents: calen,
          isForeignEventsModalOpened: true
        })
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
      this.props.navigation.back()
      return false
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

  render() {
    return (
      <Container style={{ backgroundColor: "#FEFFDE" }}>
        <StatusBar backgroundColor="#FEFFDE" barStyle="dark-content"></StatusBar>
        <Header style={{ backgroundColor: "#FEFFDE", borderBottomWidth: 1, borderColor: "#1FABAB", }} hasTabs>
          <Body>
            <Title
              style={{
                marginLeft: "2%",
                fontWeight: "bold",
                fontStyle: 'normal',
                color: "#0A4E52",
                //fontStyle: 'italic',
                fontSize: 25,
              }}
            >
              Bleashup
                </Title>
          </Body>

          <Icon
            name="gear"
            active={true}
            type="EvilIcons"
            style={{
              padding: 15,
              paddingLeft: 100,
              color: "#1FABAB"
            }}
            onPress={this.settings()}
          />
        </Header>
        <Tabs
          locked
          elevation={5}
          tabContainerStyle={{ height: 45, backgroundColor: "#FEFFDE", borderTopWidth: 1, borderColor: "#1FABAB", borderRadius: 4, }}
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
            heading={
              <TabHeading>
                <Icon name="sc-telegram" type="EvilIcons" style={{ fontSize: this.state.currentTab == 0 ? 60 : 20, }} />
              </TabHeading>
            }
          >
            <InvitationView {...this.props} />
          </Tab>
          <Tab
            tabStyle={{
              borderRadius: 0
            }}
            heading={
              <TabHeading>
                <View style={{ display: 'flex', }}>
                  <Icon name="ios-pulse" type="Ionicicons" style={{ fontSize: this.state.currentTab == 1 ? 45 : 15, }} />
                </View>
              </TabHeading>
            }
          >
            <CurrentEventView {...this.props}></CurrentEventView>
          </Tab>
          <Tab
            heading={
              <TabHeading>
                <Icon name="ios-people" type="Ionicons" style={{ fontSize: this.state.currentTab == 2 ? 50 : 15, }} />
              </TabHeading>
            }
          >
            <Chats {...this.props} />
          </Tab>
          <Tab
            heading={
              <TabHeading>
                <Icon name="user-alt" type="FontAwesome5" style={{ fontSize: this.state.currentTab == 3 ? 35 : 15, }} />
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
      </Container>
    );
  }
}

export default withInAppNotification(Home);
