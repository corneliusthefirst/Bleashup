import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Button,
  Icon,
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
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>

          <Body>
            <Title>BleashUp</Title>
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
