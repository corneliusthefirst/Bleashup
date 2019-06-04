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
import Reminds from "./../myreminds/index";

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
          <Tab heading="Current Events">
            <CurrentEventView />
          </Tab>
          <Tab heading="Past Events">
            <PastEventView />
          </Tab>
          <Tab heading="My Reminds">
            <Reminds />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
