import React, {Component} from "react"
import BleashupModal from "../../../../mainComponents/BleashupModal";
import ChatRoom from "../../../eventChat/ChatRoom";
import stores from "../../../../../stores";
import {View} from "react-native"


export default class CommentsModal extends BleashupModal{

    modalHeight="100%"
    swipeToClose=false
    position="top"
    backdropOpacity=false
    modalBody(){
        return <View><ChatRoom
        isComment={true}
        roomName={this.props.title}
        opened={true}
        generallyMember={true}
        public_state={true}
        user={{ ...stores.LoginStore.user, phone: stores.LoginStore.user.phone.replace('00', '+') }}
        activity_name={this.props.activity_name}
        room_type={"comment"}
        newMessageNumber={0}
        firebaseRoom={this.props.id}
        newMessages={[]}
        creator={this.props.creator}
        >
        </ChatRoom></View>
    }
}