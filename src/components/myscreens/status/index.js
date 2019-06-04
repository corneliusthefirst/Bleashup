import React, { Component } from "react";
import { Content, Card, CardItem, Text, Body } from "native-base";
import NestedScrollView from "react-native-nested-scroll-view";
import GState from "../../../stores/globalState";
export default class Status extends Component {
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
                  NativeBase builds a layer on top of React Native that provides
                  you with basic set of components for mobile application
                  development. This helps you to build world-class application
                  experiences on native platforms.
                </Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </NestedScrollView>
    );
  }
}
