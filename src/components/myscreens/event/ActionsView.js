import React, { Component } from 'react';
import { View } from 'react-native';
import { Label, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Requester from './Requester';
import stores from '../../../stores';
import shadower from '../../shadower';

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
    saveContacts() {
        Requester.saveContacts()
    }
    inviteContacts() {
        this.props.inviteContacts()
    }
    center = { alignSelf: 'center', alignItems: 'center'}
    container = {
        height: this.actionHeight,
        marginBottom: this.padding,
        backgroundColor: '#FEFFDE',
        borderRadius: 5, ...shadower(2),
        marginBottom: '15%',
        padding: '1%',
        alignSelf: 'center', width: 55, height: 50
    }
    padding = '20%'
    render() {

        return (
            <View style={{
                height: 300,
                display: 'flex',
                flexDirection: 'column',
                marginTop: "6%", alignSelf: 'center', alignItems: 'center',
            }}>
                {this.props.event_type === "relation" ? null :
                    <View style={this.container}>
                        <TouchableOpacity style={this.center} onPress={() => requestAnimationFrame(() => this.props.publish())}>
                            <Icon style={{ color: this.actionColor, fontSize: this.fontSize, }} type="Entypo" name="megaphone"></Icon>
                            <Label style={{ fontSize: this.textSize, color: this.actionColor }}>Publish</Label>
                        </TouchableOpacity>
                    </View>
                }
                {this.props.event_type === "relation" ? null :
                    <View style={this.container}>
                        <TouchableOpacity style={this.center} onPress={() => requestAnimationFrame(() => this.inviteContacts())}>
                            <Icon style={{ color: this.actionColor, fontSize: this.fontSize, }} type={"EvilIcons"} name="sc-telegram"></Icon>
                            <Label style={{ fontSize: this.textSize, color: this.actionColor }}>Invite</Label>
                        </TouchableOpacity>
                    </View>
                }
                {this.props.event_type === "relation" ? null :
                    <View style={this.container}>
                        <TouchableOpacity style={this.center} onPress={() => requestAnimationFrame(() => this.props.showMembers())}>
                            <Icon style={{ color: this.actionColor, fontSize: this.fontSize, }} type="FontAwesome" name="users"></Icon>
                            <Label style={{ fontSize: this.textSize, color: this.actionColor }}>Membs.</Label>
                        </TouchableOpacity>
                    </View>
                }

                <View style={this.container}>
                    <TouchableOpacity style={this.center} onPress={() => requestAnimationFrame(() => {
                        this.props.ShowMyActivity(stores.LoginStore.user.phone)
                    })}>
                        <Icon style={{ color: this.actionColor, fontSize: this.fontSize, }} type="FontAwesome" name="user"></Icon>
                        <Label style={{ fontSize: this.textSize, color: this.actionColor }}>Me</Label>
                    </TouchableOpacity>
                </View>
                {this.props.event_type === "relation" ? null :
                    <View style={this.container}>
                        <TouchableOpacity style={this.center} onPress={() => requestAnimationFrame(() => this.props.openSettingsModal())}>
                            <Icon style={{ color: this.actionColor, fontSize: this.fontSize, }} type="Entypo" name="cog"></Icon>
                            <Label style={{ fontSize: this.textSize, color: this.actionColor }}>Settings</Label>
                        </TouchableOpacity>
                    </View>
                }
                {this.props.event_type === "relation" ? null :
                    <View style={this.container}>
                        <TouchableOpacity style={this.center} onPress={() => requestAnimationFrame(() => this.props.handleSync())}>
                            <Icon style={{
                                color: this.props.period ?
                                    this.props.calendared ? 'green' : 'red' :
                                    'gray', fontSize: this.fontSize,
                            }}
                                type="MaterialIcons" name={this.props.calendared ? "sync" : "sync-problem"}></Icon>
                            <Label style={{
                                fontSize: this.textSize,
                                color: this.props.period ?
                                    this.props.calendared ? 'green' : 'red' :
                                    'gray',
                            }}>{this.props.calendared ? "Synced" : null}</Label>
                        </TouchableOpacity>
                    </View>
                }
                {this.props.event_type === 'relation' ? null : <View style={this.container}>
                    <TouchableOpacity style={this.center} onPress={() => requestAnimationFrame(() => this.props.leaveActivity())}>
                        <Icon style={{ color: "red", fontSize: this.fontSize, }} type="AntDesign" name="poweroff"></Icon>
                        <Label style={{ fontSize: this.textSize, color: "red" }}>Leave</Label>
                    </TouchableOpacity>
                </View>}
                {this.props.event_type === "relation" ? null :
                    <View style={this.container}>
                        <TouchableOpacity style={this.center} onPress={() => requestAnimationFrame(() => this.props.exitActivity())}>
                            <Icon style={{
                                color: "#1FABAB" ,
                                fontSize: this.fontSize,
                            }}
                                type="AntDesign" name={"closecircle"}></Icon>
                            <Label style={{
                                fontSize: this.textSize,
                                color: "#1FABAB"
                            }}>{"Exit"}</Label>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}