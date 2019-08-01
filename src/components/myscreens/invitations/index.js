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
          tabBarPosition="overlayBottom"
          tabBarUnderlineStyle={{
            borderBottomWidth: 0,
            backgroundColor: "transparent"
          }}
        >
          <Tab heading="Received Invites">
            <ReceivedInvitations {...this.props} />
          </Tab>
          <Tab heading="Sent Invites">
            <SentInvitations {...this.props} />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

