import React, { Component } from "react";
import { Platform, ScrollView, BackHandler, ToastAndroid, View } from 'react-native';
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
} from "native-base";
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



@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    emitter.on("notify", (event) => {
      {
        this.props.showNotification({
          title: 'You pressed it!',
          message: 'The notification has been triggered ' + event,
          vibrate: false,
          onPress: () => Alert.alert('Alert', 'You clicked the notification!')
        });
      }
    })
    NetInfo.isConnected.addEventListener("connectionChange", this.handleConnectionChange);
    // BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton() {
    ToastAndroid.show("Back button is pressed", ToastAndroid.SHORT);
    // RNExitApp.exitApp();
    return true;
  }
  isCloseToBottom(nativeEvent) {
    return (
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - 20
    );
  }

  handleConnectionChange(connect) {
    //connect ? console.warn("connected") : console.warn("not connected")
  }

  ifCloseToTop(nativeEvent) {
    return nativeEvent.contentOffset.y == 0;
  }
  state = {
    scroll: true
  };
  @autobind
  settings() { }

  render() {
    return (
      <Container style={{ backgroundColor: "#FEFFDE" }}>
        <Header hasTabs>
          <Body>
            <Title
              style={{
                fontWeight: "bold"
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
              color: "#FEFFDE"
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
            <InvitationView {...this.props} />
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
