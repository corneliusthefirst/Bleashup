import React, { Component } from "react";
import { Content, Card, CardItem, Text, Body, Icon,Header } from "native-base";
import GState from "../../../stores/globalState";
import {View} from "react-native"
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GiftedChat } from 'react-native-gifted-chat'
import stores from "../../../stores";
import Swipeout from "react-native-swipeout";
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
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ]
    });
  }
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }
  render() {
    return <View style={{ display: 'flex', flexDirection: 'column', }}>
      <GiftedChat onSend={(message) => this.onSend(message)}
        user={{
          _id: stores.Session.SessionStore.phone, name: stores.LoginStore.user.name,
          avatar: stores.LoginStore.user.profile
        }} messages={this.state.messages}>

      </GiftedChat>
    </View>
  }
}
