import React, { Component } from 'react'
import {
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  FlatList,
  StatusBar,
  ImageBackground,
  Platform,
  View,
  TouchableOpacity,
} from 'react-native'
import ChatRoom from './ChatRoom';
import { Spinner } from 'native-base';


export default class EventChat extends Component {
  constructor(props){
    super(props)
    this.state = {
      messages: [],
      loadEarlier: true,
      loaded:false,
      typingText: null,
      isLoadingEarlier: false,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loaded: true
      });
    }, 100)
  }
  render() {
    return (this.state.loaded ? <ChatRoom newMessageNumber={10} firebaseRoom={"message"} ></ChatRoom> : <ImageBackground 
    resizeMode={"contain"} source={require("../../../../assets/Bleashup.png")} 
    style={{ width: "100%", height: "100%", backgroundColor: "#FEFFDE", }}>
        <Spinner color="#FEFFDE" style={{ color: "#FEFFDE", marginTop: "96%", marginLeft: "8%", }} />
    </ImageBackground>)
  }
}
