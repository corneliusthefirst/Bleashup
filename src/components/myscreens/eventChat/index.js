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
import stores from '../../../stores';
import moment from 'moment';
import firebase from 'react-native-firebase';
import { values } from 'lodash';
import Waiter from '../loginhome/Waiter';


export default class EventChat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      loadEarlier: true,
      loaded: false,
      typingText: null,
      isLoadingEarlier: false,
    };
  }
  state = {}
  activity = {}
  newMessageCount=0
  componentDidMount() {
    let user = stores.LoginStore.user
    let phone = user.phone.replace("00", "+")
    firebase.database().ref(`new_message/${this.props.activity_id}/${phone}/${this.props.roomID}/new_messages`).once('value', snapshoot => {
      this.newMessageCount = snapshoot.val() ? snapshoot.val().length : 0
      if (this.props.newMessageCount > 0) {
        firebase.database().ref(`${this.props.roomID}`).limitToLast(this.newMessageCount).once('value', snapshoot => {
          firebase.database().ref(`new_message/${this.props.activity_id}/${phone}/${this.props.roomID}/new_messages`).set([])
          setTimeout(() => {
            this.setState({
              user: user,
              new_messages: values(snapshoot.val()),
              loaded: true
            });
          }, 1)
        })
      } else {
        setTimeout(() => {
          this.setState({
            user: user,
            new_messages: [],
            loaded: true
          });
        }, 12)
      }
    })
  }
  newMessages = [{
    id: Math.random().toString(),
    source: 'http://192.168.43.32:8555/sound/get/p2.mp3',
    file_name: 'p2.mp3',
    total: 0,
    received: 0,
    user: 2,
    creator: 2,
    type: 'audio',
    sender: {
      phone: 3,
      nickname: "Sokeng Kamga"
    },
    duration: Math.floor(0),
    created_at: moment().format(),
  }, {
    id: Math.random().toString(),
    //source: 'http://192.168.43.32:8555/sound/get/p2.mp3',
    file_name: 'p2.mp3',
    total: 0,
    received: 0,
    user: 1,
    creator: 2,
    type: 'text',
    text: `hello`,
    sender: {
      phone: 3,
      nickname: "Sokeng Kamga"
    },
    duration: Math.floor(0),
    created_at: moment().format(),
  }, {
    id: Math.random().toString(),
    sender: {
      phone: 2,
      nickname: "Sokeng Kamga"
    },
    user: 1,
    reply: {
      id: 3,
      user: 2,
      text: `Hello!  Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>`,
      video: true,
      replyer_name: "Santers Gipson",
      source: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg"
    },
    creator: 3,
    type: "photo",
    photo: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg",
    file_name: 'bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg',
    created_at: moment().format(),
    text: `Hello!`
  }, {
    id: Math.random().toString(),
    source: 'http://192.168.43.32:8555/video/get/bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0.mp4',
    file_name: 'bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0_thumbnail.jpeg',
    thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0_thumbnail.jpeg',
    sender: {
      phone: 3,
      nickname: "Sokeng Kamga"
    },
    user: 2,
    creator: 3,
    type: "video",
    received: 0,
    total: 0,
    reply: {
      id: 2,
      user: 3,
      text: `Hello!  Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>`,
      video: true,
      replyer_name: "Santers Gipson",
      source: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg"
    },
    text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.`,
    duration: Math.floor(0),
    created_at: moment().format(),
  }, {
    id: Math.random().toString(),
    source: 'http://192.168.43.32:8555/video/get/bm6lgk013ult9gc75vmg_bm6lgk013ult9gc75vn0_bm6lgk013ult9gc75vng.mp4',
    file_name: 'Black M - Le prince Aladin (Clip officiel) ft. Kev Adams.mp4',
    thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bm7sd5813ulrbjp7u1sg_bm7sd5813ulrbjp7u1t0_bm7sd5813ulrbjp7u1tg_thumbnail.jpeg',
    sender: {
      phone: 3,
      nickname: "Sokeng Kamga"
    },
    user: 2,
    creator: 2,
    type: "attachement",
    received: 0,
    total: 0,
    text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.

`,
    duration: Math.floor(0),
    created_at: moment().format(),
  },
    , {
    id: Math.random().toString(),
    source: 'http://192.168.43.32:8555/video/get/Black M - Le prince Aladin (Clip officiel) ft. Kev Adams.mp4',
    file_name: 'bm6lgk013ult9gc75vmg_bm6lgk013ult9gc75vn0_bm6lgk013ult9gc75vng.mp4',
    thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bm7sd5813ulrbjp7u1sg_bm7sd5813ulrbjp7u1t0_bm7sd5813ulrbjp7u1tg_thumbnail.jpeg',
    sender: {
      phone: 3,
      nickname: "Sokeng Kamga"
    },
    type: "video",
    user: 3,
    creator: 2,
    received: 0,
    total: 0,
    text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.

`,
    duration: Math.floor(0),
    created_at: moment().format(),
  }]
  render() {
    return (this.state.loaded ? <View style={{ backgroundColor: "white", }}><ChatRoom
      roomName={this.props.roomName}
      user={{
        ...this.state.user,
        phone: this.state.user.phone.replace("00", "+")
      }}
      handleReplyExtern={(reply) => {
        this.props.handleReplyExtern(reply)
      }}
      openMenu={this.props.openMenu}
      showLoader={this.props.showLoader}
      stopLoader={this.props.stopLoader}
      showProfile={(pro) => this.props.showProfile(pro)}
      activity_name={this.props.activity_name} // name_of_the_other_user
      close={() => this.props.close()}
      open={() => this.props.open()}
      addMembers={() => this.props.addMembers()}
      removeMembers={() => this.props.removeMembers()}
      leave={() => this.props.leave()}
      computedMaster={this.props.computedMaster}
      generallyMember={this.props.generallyMember}
      publish={() => this.props.publish()}
      room_type={this.props.room_type}
      master={this.props.master}
      public_state={this.props.public_state}
      opened={this.props.opened}
      newMessageNumber={this.state.new_messages.length}
      showContacts={this.props.showContacts}
      showMembers={() => this.props.showMembers()}
      addRemind={this.props.addRemind}
      firebaseRoom={this.props.roomID} // relation_id
      members={this.props.members} // relation_members
      activity_id={this.props.activity_id} //reloation
      navigatePage={(page)=>{this.props.navigation.navigate(page)}}//to navigate
      newMessages={this.state.new_messages}
      creator={this.props.creator} ></ChatRoom></View> : <Waiter dontshowSpinner={true}></Waiter>)
  }
}
