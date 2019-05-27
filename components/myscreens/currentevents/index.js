import React, { Component } from "react";
import { Content, Card, CardItem, Text, Body } from "native-base";

export default class CurrentEventView extends Component {
  render() {
    return (
      <Content>
        <Card style={{ padding: 10 }}>
          <CardItem
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 0,
              paddingBottom: 10
            }}
          >
            <Body>
              <Text>what a fuck!!!!</Text>
            </Body>
          </CardItem>
        </Card>
        <Card>
          <CardItem>
            <Body>
              <Text>
                NativeBase gives you the potential of building applications that
                run on iOS and Android using a single codebase.
              </Text>
            </Body>
          </CardItem>
        </Card>
      </Content>
    );
  }
}
