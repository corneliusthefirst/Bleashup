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
import request from "../../../services/tcp-request";
import SentInvitations from "../sent-invitations";
import ReceivedInvitations from "../received-invitations";

class InvitationView extends Component {
  method() {
    return request();
  }
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
            heading="Sent Invites"
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
            <SentInvitations />
          </Tab>
          <Tab
            heading="Received Invites"
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
            <ReceivedInvitations />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default InvitationView;