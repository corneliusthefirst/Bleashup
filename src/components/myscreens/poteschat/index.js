import React, { Component } from "react";
import { Content, Card, CardItem, Text, Body, Icon,Header } from "native-base";
import GState from "../../../stores/globalState";
import {View} from "react-native"
import { ScrollView, TouchableOpacity } from "react-native";
import stores from "../../../stores";
var swipeoutBtns = [
  {
    text: 'Button'
  }
]
export default class PotesChat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    };
  }
  componentWillMount() {
    
  }

  render() {
    return <View style={{ display: 'flex', flexDirection: 'column', }}>
    </View>
  }
}
