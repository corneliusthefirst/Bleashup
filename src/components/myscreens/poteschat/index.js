import React, { Component } from "react";
import { Content, Card, CardItem, Text, Body, Icon,Header } from "native-base";
import GState from "../../../stores/globalState";
import {View} from "react-native"
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Draggable from 'react-native-draggable';
import Swipeout from "react-native-swipeout";
var swipeoutBtns = [
  {
    text: 'Button'
  }
]
export default class PotesChat extends Component {
  constructor(props){
    super(props)
  }
  state = {
    scrollEnabled:true
  }
  _allowScroll(scrollEnabled){
  this.setState({ scrollEnabled: scrollEnabled })
}
  render() {
    return (
      <Swipeout style={{display:"flex"}}  left={swipeoutBtns}>
      <View style={{padding: 3,height:"100%"}}>
      <Text> is my swipe-view</Text>
          <ScrollView nestedScrollEnabled  style={{ display: 'flex', height: 600 }}>
            <Card style={{}}>
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
            <Card style={{}}>
              <CardItem>
                <Body>
                  <Text>
                    NativeBase gives you the potential of building applications
                    that run on iOS and Android using a single codebase.
                </Text>
                </Body>
              </CardItem>
            </Card>
            <Card style={{}}>
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
            <Card style={{}}>
              <CardItem>
                <Body>
                  <Text>
                    NativeBase gives you the potential of building applications
                    that run on iOS and Android using a single codebase.
                </Text>
                </Body>
              </CardItem>
            </Card>
            <Card style={{}}>
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
            <Card style={{}}>
              <CardItem>
                <Body>
                  <Text>
                    NativeBase gives you the potential of building applications
                    that run on iOS and Android using a single codebase.
                </Text>
                </Body>
              </CardItem>
            </Card>
            <Card style={{}}>
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
            <Card style={{}}>
              <CardItem>
                <Body>
                  <Text>
                    NativeBase gives you the potential of building applications
                    that run on iOS and Android using a single codebase.
                </Text>
                </Body>
              </CardItem>
            </Card>
            <Card style={{}}>
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
            <Card style={{}}>
              <CardItem>
                <Body>
                  <Text>
                    NativeBase gives you the potential of building applications
                    that run on iOS and Android using a single codebase.
                </Text>
                </Body>
              </CardItem>
            </Card>
            <Card style={{}}>
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
            <Card style={{}}>
              <CardItem>
                <Body>
                  <Text>
                    NativeBase gives you the potential of building applications
                    that run on iOS and Android using a single codebase.
                </Text>
                </Body>
              </CardItem>
            </Card>
            <Card style={{}}>
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
            <Card style={{}}>
              <CardItem>
                <Body>
                  <Text>
                    NativeBase gives you the potential of building applications
                    that run on iOS and Android using a single codebase.
                </Text>
                </Body>
              </CardItem>
            </Card>
            <Card style={{}}>
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
            <Card style={{}}>
              <CardItem>
                <Body>
                  <Text>
                    NativeBase gives you the potential of building applications
                    that run on iOS and Android using a single codebase.
                </Text>
                </Body>
              </CardItem>
            </Card>
            <Card style={{}}>
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
            <Card style={{}}>
              <CardItem>
                <Body>
                  <Text>
                    NativeBase gives you the potential of building applications
                    that run on iOS and Android using a single codebase.
                </Text>
                </Body>
              </CardItem>
            </Card>
          </ScrollView>
      </View>
</Swipeout>
    );
  }
}
