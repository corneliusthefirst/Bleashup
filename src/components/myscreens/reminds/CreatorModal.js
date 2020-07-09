import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'native-base';
import ProfileModal from '../invitations/components/ProfileModal';
import moment from 'moment';
import ModalBox from 'react-native-modalbox';
import { format } from '../../../services/recurrenceConfigs';
import BleashupModal from '../../mainComponents/BleashupModal';
import ColorList from '../../colorList';

export default class CreatorModal extends BleashupModal {
    initialize() {
        this.state = {}
    }
    state = {}
    onClosedModal() {
        this.props.onClosed()
    }
    position = "bottom"
    entry = 'bottom'
    modalBackground = this.props.color ? this.props.color : ColorList.bodyBackground
    modalHeight = 76
    unmountingComponent(){
        clearTimeout(this.closeTimeout)
    }
    modalBody() {
        return <View>
            <View><TouchableOpacity onPress={() => {
                this.setStatePure({
                    showProfileModal: true
                })
            }}>
                <Text style={{ fontWeight: 'bold', fontSize: 11, margin: '1%', }} note>{this.props.intro && this.props.intro}</Text>
                {this.props.creator.nickname ? <Text style={{ margin: "1%", fontSize: 11, fontStyle: 'normal', }} note>by {this.props.creator.nickname} </Text> : null}
                <Text style={{ margin: "1%", fontSize: 11, color: "gray" }} >{"On "}{moment(this.props.created_at).format(format)}</Text>
            </TouchableOpacity>
                {this.state.showProfileModal && this.props.creator.profile ? <ProfileModal isOpen={this.state.showProfileModal} onClosed={() => {
                    this.setStatePure({
                        showProfileModal: false
                    })
                    this.closeTimeout = setTimeout(() => {
                        this.onClosedModal()
                    },100)
                }} profile={this.props.creator} color={this.props.color} ></ProfileModal> : null}
            </View>
        </View>
    }
}