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

class InvitationView extends Component {
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
          <Tab heading="Sent Invites">
            <SentInvitations />
          </Tab>
          <Tab heading="Received Invites">
            <ReceivedInvitations />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default InvitationView;
