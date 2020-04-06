import React, { Component } from 'react';
import { View } from 'react-native';
import { Label, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Requester from './Requester';
import stores from '../../../stores';
import shadower from '../../shadower';
import ActionsMenu from './ActionsMenu';

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
                { <View style={this.container}>
                        <TouchableOpacity style={this.center} onPress={() => requestAnimationFrame(() => this.props.exitActivity())}>
                            <Icon style={{
                                color: "#1FABAB" ,
                                fontSize: this.fontSize,
                            }}
                            type="AntDesign" name={"arrowleft"}></Icon>
                            <Label style={{
                                fontSize: this.textSize,
                                color: "#1FABAB"
                            }}>{"Back"}</Label>
                        </TouchableOpacity>
                    </View>
                }
                {this.props.event_type === "relation" ? null :
                    <View style={{...this.container, height:20,}}>
                        <Icon style={{
                            color: "#1FABAB",
                            alignSelf: 'center',
                            marginTop: -6,
                            fontSize: 30,
                        }} onPress={() => {
                            this.refs.ActionMenu.showMenu()
                        }} name="dots-three-horizontal" type="Entypo"></Icon>
                          <ActionsMenu
                                ref={'ActionMenu'}
                                hideMenu={this.props.hideMenu}
                                sync={this.props.handleSync}
                                period={this.props.period}
                                calendared={this.props.calendared}
                                settings={this.props.openSettingsModal}
                                ckeckMyActivty={() => this.props.ShowMyActivity(stores.LoginStore.user.phone)}
                                event_type={this.props.event_type}
                                inviteContacts={this.inviteContacts.bind(this)}
                                publish={this.props.publish}
                                leave={this.props.leaveActivity}
                                members={this.props.showMembers}
                          ></ActionsMenu>
                    </View>
                }
            </View>
        )
    }
}