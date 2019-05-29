import React, { Component } from "react";
import { Image, View, TouchableHighlight, Platform } from "react-native";
import {
  Container,
  Header,
  Title,
  Button,
  Content,
  Icon,
  Text,
  Footer,
  FooterTab,
  Tabs,
  Tab,
  Right,
  Left,
  Body,
  TabHeading
} from "native-base";
import Status from "./../status/index";
import InvitationView from "./../invitations/index";
import PersonalEventView from "./../personalevents/index";
import Chats from "../poteschat";
import Settings from "./../settings/index";
class Home extends Component {
  render() {
    return (
      <Container
        style={{
          backgroundColor: "#1FABAB"
        }}
      >
        <Header
          style={{
            backgroundColor: "#1FABAB",
            height: 70
          }}
          hasTabs
        >
          <Body>
            <Title
              style={{
                color: "#FEFFDE",
                fontWeight: "bold"
              }}
            >
              Bleashup
            </Title>
          </Body>
          <Icon
            name="cog"
            active={true}
            type="FontAwesome"
            style={{
              padding: 15,
              paddingLeft: 100,
              color: "#FEFFDE"
            }}
          />
        </Header>
        <Tabs
          tabBarPosition="overlayBottom"
          tabBarUnderlineStyle={{
            borderBottomWidth: 0,
            backgroundColor: "transparent"
          }}
        >
          <Tab
            tabStyle={{
              borderRadius: 0
            }}
            heading={
              <TabHeading>
                <Icon name="calendar" />
              </TabHeading>
            }
          >
            <PersonalEventView />
          </Tab>
          <Tab
            heading={
              <TabHeading>
                <Icon name="sc-telegram" />
              </TabHeading>
            }
          >
            <InvitationView />
          </Tab>
          <Tab
            heading={
              <TabHeading>
                <Icon name="comment" />
              </TabHeading>
            }
          >
            <Chats />
          </Tab>
          <Tab
            heading={
              <TabHeading>
                <Icon name="user" />
              </TabHeading>
            }
          >
            <Status />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default Home;

/*
<Left>
<Icon
  active="true"
  style={{
    color: "antiquewhite"
  }}
  type="Foundation"
  name="home"
  onPress={() => this.props.navigation.openDrawer()}
/>
</Left>

 onPress = {this._onPressAdd}
*/
