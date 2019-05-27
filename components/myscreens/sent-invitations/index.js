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

class InvitationView extends Component {
  method() {
    return request();
  }
  render() {
    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem>
              <Body>
                <Text> {this.method()} </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text> Platform specific codebase for components </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  Any native third - party libraries can be included along with
                  NativeBase.
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  Single file to theme your app and NativeBase components.
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  Gives an ease to include different font types in your app.
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

export default InvitationView;
