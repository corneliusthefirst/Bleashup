import React, { Component } from "react";
import { Platform, ScrollView, BackHandler, ToastAndroid, View, StatusBar } from 'react-native';
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
  Right,
  Toast
} from 'native-base';
import NetInfo from "@react-native-community/netinfo";
import StatusView from "./../status/index";
import InvitationView from "./../invitations/index";
import Chats from "../poteschat";
import SettingView from "./../settings/index";
import { observer } from "mobx-react";
import autobind from "autobind-decorator";
import RNExitApp from "react-native-exit-app";
import { withInAppNotification } from 'react-native-in-app-notification';
import stores from "../../../stores";
import CurrentEventView from '../currentevents';
import emitter from "../../../services/eventEmiter";
import firebase from 'react-native-firebase';
import GState from '../../../stores/globalState';
import CreateEvent from '../event/createEvent/CreateEvent';


@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.permisssionListener()
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
            tab:"EventChat",
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
  componentDidMount() {
    emitter.on("notify", (event) => {
      {
        if(GState.currentRoom !== event.data.room_key){
          this.props.showNotification({
            title: event.title,
            message: event.body,
            vibrate: false,
            onPress: () => this.handleNotifications(event.data)

          });
        }
      }
    })
    NetInfo.isConnected.addEventListener("connectionChange", this.handleConnectionChange);
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  exiting = false
  timeout = null
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    this.removeNotificationDisplayedListener()
    this.removeNotificationListener()
    this.removeNotificationOpenedListener()
  }
  handleBackButton() {
    if (this.exiting) {
      clearTimeout(this.timeout)
      //this.props.navigation.back()
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
    scroll: true
  };
  @autobind
  settings() { }

 @autobind
 setCreateButton(){

 }


  render() {
    return (
      <Container style={{ backgroundColor: "#FEFFDE" }}>
        <StatusBar backgroundColor="#FEFFDE" barStyle="dark-content"></StatusBar>
        <Header style={{ backgroundColor: "#FEFFDE",}} hasTabs>
          <Body>
            <Title
              style={{
                marginLeft: "10%",
                fontWeight: "bold",
                color:"#0A4E52",
                fontSize: 30,
              }}
            >
              Bleashup
                </Title>
                <Right>
                <CreateEvent Parentprops={this.props} ></CreateEvent>
                </Right>
          </Body>

          <Icon
            name="gear"
            active={true}
            type="EvilIcons"
            style={{
              padding: 15,
              paddingLeft: 100,
              color: "#0A4E52"
            }}
            onPress={this.settings()}
          />
        </Header>
        <Tabs
          locked
          tabContainerStyle={{ height: 45 }}
          tabBarPosition="bottom"
          tabBarUnderlineStyle={{
            borderBottomWidth: 0,
            backgroundColor: "transparent"
          }}
        >
          <Tab
            heading={
              <TabHeading>
                <Icon name="sc-telegram" type="EvilIcons" />
              </TabHeading>
            }
          >
            <InvitationView {...this.props} ref={"invitation_view"} />
          </Tab>
          <Tab
            tabStyle={{
              borderRadius: 0
            }}
            heading={
              <TabHeading>
                <View style={{ display: 'flex', }}>
                  <Icon name="calendar" type="EvilIcons" />
                </View>
              </TabHeading>
            }
          >
            <CurrentEventView {...this.props}></CurrentEventView>
          </Tab>

          <Tab
            tabStyle={{
              borderRadius: 0
            }}
            heading={
              <TabHeading>
                <View style={{ display: 'flex'}}>
                  <Icon name="slack-square" type="AntDesign" onPress={this.setCreateButton} />
                </View>
              </TabHeading>
            }
          >      
          </Tab>

          <Tab
            heading={
              <TabHeading>
                <Icon name="ios-people" type="Ionicons" />
              </TabHeading>
            }
          >
            <Chats {...this.props} />
          </Tab>
          <Tab
            heading={
              <TabHeading>
                <Icon name="user" type="EvilIcons" />
              </TabHeading>
            }
          >
            <StatusView {...this.props} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default withInAppNotification(Home);
