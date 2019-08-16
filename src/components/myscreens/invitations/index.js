import React, { Component } from "react";
import {
  Header,
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Footer,
  BodyTabs,
  Tabs,
  Tab,
  Right,
  FooterTab,
  Button,
  Left,
  Body,
  ScrollableTab,
  Title,
  Icon
} from "native-base";
import SentInvitations from "../sent-invitations/index";
import ReceivedInvitations from "../received-invitations/index";

export default class InvitationView extends Component {
  render() {
    return (
      <Container>
        <Tabs
          locked
          tabBarPosition="overlayTop"
          tabBarUnderlineStyle={{
            borderBottomWidth: 0,
            backgroundColor: "transparent"
          }}
        >
          <Tab activeTextStyle={{ color: '#FEFFDE', fontWeight: 'bold' }} textStyle={{ color: '#7DD2D2' }} heading="Sent Invites">
            <SentInvitations {...this.props} />
          </Tab>

          <Tab activeTextStyle={{ color: '#FEFFDE', fontWeight: 'bold' }} textStyle={{ color: '#7DD2D2' }} heading="Received Invites">
            <ReceivedInvitations {...this.props} />
          </Tab>

        </Tabs>
      </Container>
    );
  }
}

