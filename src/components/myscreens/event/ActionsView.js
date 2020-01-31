import React, { Component } from 'react';
import { View } from 'react-native';
import { Label, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Requester from './Requester';
import stores from '../../../stores';

export default class ActionsView extends Component {
    constructor(props) {
        super(props)
    }
    actionColor = "#1FABAB"
    fontSize = 30
    textSize = 12
    actionHeight = "17%"
    height = "16%"
    original = "#1FABAB"
    saveContacts(){
        Requester.saveContacts()
    }
    inviteContacts(){
        this.props.inviteContacts()
    }
    render() {
        return (
            <View style={{ height: 300, display: 'flex', flexDirection: 'column', marginTop: "6%", ...shadower() }}>
                <View style={{ height: this.actionHeight }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.publish())}>
                        <Icon style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} type="Entypo" name="megaphone"></Icon>
                        <Label style={{ marginLeft: "25%", fontSize: this.textSize, color: this.actionColor }}>Publish</Label>
                    </TouchableOpacity>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.inviteContacts() )}>
                        <Icon type="EvilIcons" style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} name="sc-telegram"></Icon>
                        <Label style={{ marginLeft: "30%", fontSize: this.textSize, color: this.actionColor }}>Invite</Label>
                    </TouchableOpacity>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.showMembers())}>
                        <Icon style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} type="FontAwesome" name="users"></Icon>
                        <Label style={{ marginLeft: "22%", fontSize: this.textSize, color: this.actionColor }}>Members</Label>
                    </TouchableOpacity>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.ShowMyActivity(stores.LoginStore.user.phone)
                    })}>
                        <Icon style={{ marginLeft: "35%", color: this.actionColor, fontSize: this.fontSize, }} type="FontAwesome" name="user"></Icon>
                        <Label style={{ marginLeft: "38%", fontSize: this.textSize, color: this.actionColor }}>Me</Label>
                    </TouchableOpacity>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <TouchableOpacity  onPress={()=>requestAnimationFrame(()=> this.props.openSettingsModal())}>
                        <Icon style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} type="Entypo" name="cog"></Icon>
                        <Label style={{ marginLeft: "25%", fontSize: this.textSize, color: this.actionColor }}>Settings</Label>
                    </TouchableOpacity>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.leaveActivity())}>
                        <Icon style={{ marginLeft: "30%", color: "red", fontSize: this.fontSize, }} type="AntDesign" name="poweroff"></Icon>
                        <Label style={{ marginLeft: "30%", fontSize: this.textSize, color: "red" }}>Leave</Label>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}