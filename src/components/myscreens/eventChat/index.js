import React, { Component } from "react";
import { Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import stores from "../../../stores";
import { observer } from "mobx-react";

@observer export default class EventChat extends Component {
  constructor(props){
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
    return <View style={{display:'flex'}}>
      <GiftedChat onSend={(message) => this.onSend(message)}
        user={{
          _id: stores.Session.SessionStore.phone, name: stores.LoginStore.user.name,
          avatar: stores.LoginStore.user.profile
        }} messages={this.state.messages}>

      </GiftedChat>
      </View>
  }
}
