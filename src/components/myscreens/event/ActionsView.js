import React, { Component } from 'react';
import { View } from 'react-native';
import { Label, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ActionsView extends Component {
    constructor(props) {
        super(props)
    }
    actionColor = "#1FABAB"
    fontSize = 18
    textSize = 14
    actionHeight = "17%"
    height = "16%"
    original = "#1FABAB"
    render() {
        return (
            <View style={{ height: 333, display: 'flex', flexDirection: 'column', }}>
                <View style={{ height: this.actionHeight }}>
                    <TouchableOpacity>
                        <Icon style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} type="Entypo" name="megaphone"></Icon>
                        <Label style={{ marginLeft: "13%", fontSize: this.textSize, color: this.actionColor }}>Publish</Label>
                    </TouchableOpacity>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <TouchableOpacity>
                        <Icon type="FontAwesome" style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} name="telegram"></Icon>
                        <Label style={{ marginLeft: "23%", fontSize: this.textSize, color: this.actionColor }}>Invite</Label>
                    </TouchableOpacity>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <TouchableOpacity onPress={() => this.props.showMembers()}>
                        <Icon style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} type="FontAwesome" name="users"></Icon>
                        <Label style={{ marginLeft: "5%", fontSize: this.textSize, color: this.actionColor }}>Members</Label>
                    </TouchableOpacity>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.ShowMyActivity()
                    })}>
                        <Icon style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} type="FontAwesome" name="user"></Icon>
                        <Label style={{ marginLeft: "30%", fontSize: this.textSize, color: this.actionColor }}>Me</Label>
                    </TouchableOpacity>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <TouchableOpacity>
                        <Icon style={{ marginLeft: "30%", color: "red", fontSize: this.fontSize, }} type="AntDesign" name="poweroff"></Icon>
                        <Label style={{ marginLeft: "20%", fontSize: this.textSize, color: "red" }}>Leave</Label>
                    </TouchableOpacity>
                </View>
                <View style={{ height: this.actionHeight }}>
                    <TouchableOpacity>
                        <Icon style={{ marginLeft: "30%", color: this.actionColor, fontSize: this.fontSize, }} type="Entypo" name="cog"></Icon>
                        <Label style={{ marginLeft: "15%", fontSize: this.textSize, color: this.actionColor }}>Settings</Label>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}