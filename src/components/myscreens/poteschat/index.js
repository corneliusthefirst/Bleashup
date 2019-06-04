import React, { Component } from "react";
import { Content, Card, CardItem, Text, Body } from "native-base";
import NestedScrollView from "react-native-nested-scroll-view";
import GState from "../../../stores/globalState";
export default class PotesChat extends Component {
  render() {
    return (
      <NestedScrollView
        onScroll={nativeEvent => {
          GState.scrollOuter = true;
        }}
        alwaysBounceHorizontal={true}
        scrollEventThrottle={16}
      >
        <Content padder style={{ marginTop: 0 }}>
          <Card style={{ flex: 0 }}>
            <CardItem>
              <Body>
                <Text>
                  NativeBase is a free and open source framework that enables
                  developers to build high-quality mobile apps using React
                  Native iOS and Android apps with a fusion of ES6.
                </Text>
              </Body>
            </CardItem>
          </Card>
          <Card style={{ flex: 0 }}>
            <CardItem>
              <Body>
                <Text>
                  NativeBase gives you the potential of building applications
                  that run on iOS and Android using a single codebase.
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </NestedScrollView>
    );
  }
}
