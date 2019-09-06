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
          tabBarUnderlineStyle={{
            borderBottomWidth: 0,
            backgroundColor: "transparent"
          }}
        >
          <Tab textStyle={{ color: '#7DD2D2' }} activeTextStyle={{ color: '#FEFFDE', fontWeight: 'bold' }} heading="Current Events">
            <CurrentEventView {...this.props} />
          </Tab>
          <Tab textStyle={{ color: '#7DD2D2' }} activeTextStyle={{ color: '#FEFFDE', fontWeight: 'bold' }} heading="Past Events">
            <PastEventView {...this.props} />
          </Tab>
          <Tab activeTextStyle={{ color: '#FEFFDE', fontWeight: 'bold' }} textStyle={{ color: '#7DD2D2' }} heading="My Reminds">
            <Reminds {...this.props} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
