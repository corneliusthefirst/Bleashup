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
import CurrentEventView from "../currentevents/index";
import PastEventView from "./../pastevents/index";
import Reminds from "./../myreminds/index";

export default class PersonalEventView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Container>
        <Tabs
          locked
          tabBarPosition="overlayBottom"
          tabBarUnderlineStyle={{
            borderBottomWidth: 0,
            backgroundColor: "transparent"
          }}
        >
          <Tab heading="Current Events">
            <CurrentEventView {...this.props} />
          </Tab>
          <Tab heading="Past Events">
            <PastEventView {...this.props} />
          </Tab>
          <Tab heading="My Reminds">
            <Reminds {...this.props} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
