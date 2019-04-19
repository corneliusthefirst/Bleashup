import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Text,
  Tabs,
  Tab,
  Right,
  Left,
  Body
} from "native-base";
import EventView from "./../events/index";
import Status from "./../status/index";
import VariableView from "./../variableview/index";
class Home extends Component {
  render() {
    return (
      <Container>
        <Header hasTabs>
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
          <Body>
            <Title> Bleashup </Title>
          </Body>
          <Right />
        </Header>
        <Tabs>
          <Tab heading="Events">
            <EventView />
          </Tab>
          <Tab heading="status">
            <Status />
          </Tab>
          <Tab heading="VariableName">
            <VariableView />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default Home;
