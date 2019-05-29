import React, { Component } from "react";
import { Image, View, TouchableHighlight } from "react-native";
import {
  Content,
  Tabs,
  Tab,
  Card,
  CardItem,
  Text,
  Body,
  Container
} from "native-base";
import CurrentEventView from "./../currentevents/index";
import PastEventView from "./../pastevents/index";
import PotesChat from "./../poteschat/index";

export default class PersonalEventView extends Component {
  render() {
    return (
      <Container>
        <Tabs
          tabBarPosition="overlayTop"
          tabBarUnderlineStyle={{
            borderBottomWidth: 0,
            backgroundColor: "transparent"
          }}
        >
          <Tab
            heading="Current Events"
            tabStyle={{
              borderRadius: 0,
              backgroundColor: "#1FABAB"
            }}
            textStyle={{
              color: "#FEFFDE"
            }}
            activeTabStyle={{
              backgroundColor: "#1FABAB"
            }}
            activeTextStyle={{
              color: "white",
              fontWeight: "bold"
            }}
          >
            <CurrentEventView />
          </Tab>
          <Tab
            heading="Past Events"
            tabStyle={{
              borderRadius: 0,
              backgroundColor: "#1FABAB"
            }}
            textStyle={{
              color: "#FEFFDE"
            }}
            activeTabStyle={{
              backgroundColor: "#1FABAB"
            }}
            activeTextStyle={{
              color: "white",
              fontWeight: "bold"
            }}
          >
            <PastEventView />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
