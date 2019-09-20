import React, { Component } from 'react'
import {
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  FlatList,
  StatusBar,
  Platform,
  View,
  TouchableOpacity
} from 'react-native'
import { observer } from "mobx-react";
import SoftInputMode from "react-native-set-soft-input-mode";
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { Icon } from 'native-base'
import stores from '../../../stores';
import Message from './Message'


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
  componentDidMount() {
    if (Platform.OS === 'android') {
      SoftInputMode.set(SoftInputMode.ADJUST_RESIZE);
    }
  }
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: "1",
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: "2",
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
  _renderMessageItem(message) {
    isOtherSender = message.user.id !== stores.Session.SessionStore.phone

    return <Message otherSender={isOtherSender} message={message} key={message._id} />
  }

  render() {
    const { history } = this.props
    const { messageValue, inProgress } = this.state

    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'white' }}
        behavior={Platform.OS === 'ios' ? "padding" : null}
        keyboardVerticalOffset={0}>
        {inProgress && <ActivityIndicator style={styles.activityIndicator} size="small" color="blue" />}
        <FlatList inverted
          data={this.state.messages}
          keyExtractor={item => item._id}
          renderItem={({ item }) => this._renderMessageItem(item)}
        />
        <View style={styles.container}>
          <AutoGrowingTextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={messageValue}
            onChangeText={this.onTypeMessage}
            maxHeight={170}
            minHeight={50}
            enableScrollToCaret />
          <TouchableOpacity style={styles.button} onPress={this.sendMessage}>
            <Icon name="send" type="MaterialIcons" size={32} color="blue" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
    padding: 12
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    paddingTop: 25
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '300',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 14 : 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    backgroundColor: 'whitesmoke'
  },
  button: {
    width: 40,
    height: 50,
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const mapStateToProps = (state) => ({
  history: state.messages,
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  fetchMessages: history => dispatch(fetchMessages(history)),
  pushMessage: message => dispatch(pushMessage(message)),
  sortDialogs: message => dispatch(sortDialogs(message)),
  setSelected: dialog => dispatch(setSelected(dialog)),
  removeSelected: () => dispatch(removeSelected())
})

