import React, { Component } from "react";
import { Content, Card, CardItem, Text, Body, Icon, Header } from "native-base";
import GState from "../../../stores/globalState";
import { View } from "react-native"
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Swipeout from "react-native-swipeout";
var swipeoutBtns = [
  {
    text: 'Button'
  }
]
export default class Highlights extends Component {
  constructor(props) {
    super(props)
  }
  state = {
    scrollEnabled: true
  }
  _allowScroll(scrollEnabled) {
    this.setState({ scrollEnabled: scrollEnabled })
  }
  render() {
    return (
    <View>
    <Text>sample highlight page</Text>
    </View>
    );
  }
}
