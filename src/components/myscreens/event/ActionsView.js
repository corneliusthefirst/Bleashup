 import React, { Component } from 'react';
import { View } from 'react-native';
import { Label, Icon } from 'native-base';

export default class ActionsView extends Component {
    constructor(props){
        super(props)
    }
    actionColor = "#1FABAB"
    fontSize = 18
    textSize = 14
    actionHeight = "14.5%"
    height = "16%"
    original = "#1FABAB"
    render(){
        return (
            <View style={{ display: 'flex', flexDirection: 'column',}}>
                <View style={{ height: this.actionHeight }}>
                    <Icon style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} type="Entypo" name="megaphone"></Icon>
                    <Label style={{ marginLeft: "13%", fontSize: this.textSize, color: this.actionColor }}>Publish</Label>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <Icon type="FontAwesome" style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} name="telegram"></Icon>
                    <Label style={{ marginLeft: "23%", fontSize: this.textSize, color: this.actionColor }}>Invite</Label>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <Icon style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} type="AntDesign" name="like1"></Icon>
                    <Label style={{ marginLeft: "30%", fontSize: this.textSize, color: this.actionColor }}>Like</Label>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <Icon style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} type="FontAwesome" name="users"></Icon>
                    <Label style={{ marginLeft: "5%", fontSize: this.textSize, color: this.actionColor }}>Members</Label>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <Icon style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} type="FontAwesome" name="user"></Icon>
                    <Label style={{ marginLeft: "30%", fontSize: this.textSize, color: this.actionColor }}>Me</Label>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <Icon style={{ marginLeft: "30%", color: "red", fontSize: this.fontSize, }} type="AntDesign" name="poweroff"></Icon>
                    <Label style={{ marginLeft: "20%", fontSize: this.textSize, color: "red" }}>Leave</Label>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <Icon style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} type="Entypo" name="cog"></Icon>
                    <Label style={{ marginLeft: "15%", fontSize: this.textSize, color: this.actionColor }}>Settings</Label>
                </View>
            </View>
        )
    }
}