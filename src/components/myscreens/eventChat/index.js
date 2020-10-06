import React, { Component } from 'react'
import {
  View,
} from 'react-native'
import ChatRoom from './ChatRoom';
import stores from '../../../stores';
import moment from 'moment';
import Waiter from '../loginhome/Waiter';
import BeComponent from '../../BeComponent';
import Spinner from '../../Spinner';
import Toaster from '../../../services/Toaster';
import Texts from '../../../meta/text';


export default class EventChat extends BeComponent {
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
  newMessageCount = 0
  componentDidMount() {
    let user = stores.LoginStore.user
    this.mountTimeout = setTimeout(() => {
      this.setStatePure({
        user: user,
        new_messages: [],
        loaded: true
      });
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
  }, {
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
  initReply(reply) {
    if (this.refs.room) {
      this.refs.room.fucussTextInput()
      this.refs.room && this.refs.room.replying(reply)
    } else {
      Toaster({ text: Texts.unable_to_reply })
    }
  }
  render() {
    return (this.state.loaded ? <View style={{ backgroundColor: "white", }}><ChatRoom
      roomName={this.props.roomName}
      closeMenu={this.props.closeMenu}
      user={{
        nickname: stores.LoginStore.user.nickname,
        phone: stores.LoginStore.user.phone.replace("00", "+")
      }}
      handleReplyExtern={(reply) => {
        this.props.handleReplyExtern(reply)
      }}
      ref={"room"}
      openPage={this.props.openPage}
      openSettings={this.props.openSettings}
      id={this.props.id}
      showActivityPhotoAction={this.props.showActivityPhotoAction}
      activityPhoto={this.props.activityPhoto}
      openMenu={this.props.openMenu}
      isComment={false}
      oponent={this.props.oponent}
      isRelation={this.props.isRelation}
      showLoader={this.props.showLoader}
      stopLoader={this.props.stopLoader}
      working={this.props.working}
      addStar={this.props.addStar}
      showDetailModal={this.props.showDetailModal}
      showProfile={(pro) => this.props.showProfile(pro)}
      activity_name={this.props.activity_name} // name_of_the_other_user
      close={() => this.props.close()}
      open={() => this.props.open()}
      goback={this.props.goback}
      showShare={this.props.showShare}
      replyPrivately={this.props.replyPrivately}
      getShareLink={this.props.getShareLink}
      addMembers={() => this.props.addMembers()}
      removeMembers={() => this.props.removeMembers()}
      leave={() => this.props.leave()}
      computedMaster={this.props.computedMaster}
      generallyMember={this.props.generallyMember}
      publish={() => this.props.publish()}
      openSettings={this.props.openSettings}
      editCommitteeName={this.props.editCommitteeName}
      room_type={this.props.room_type}
      master={this.props.master}
      public_state={this.props.public_state}
      opened={this.props.opened}
      remindThis={this.props.remindThis}
      startThis={this.props.startThis}
      newMessageNumber={this.state.new_messages.length}
      showContacts={this.props.showContacts}
      showMembers={() => this.props.showMembers()}
      addRemind={this.props.addRemind}
      firebaseRoom={this.props.roomID} // relation_id
      members={this.props.members} // relation_members
      activity_id={this.props.activity_id} //reloation
      navigatePage={(page) => { this.props.navigation.navigate(page) }}//to navigate
      newMessages={this.state.new_messages}
      creator={this.props.creator} ></ChatRoom></View> : <Waiter dontshowSpinner={true}></Waiter>)
  }
}
