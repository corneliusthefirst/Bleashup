import React, { Component } from 'react';
import { View } from 'react-native';
import { Label, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Requester from './Requester';
import stores from '../../../stores';
import shadower from '../../shadower';
import ActionsMenu from './ActionsMenu';
import colorList from '../../colorList';

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
    

    render() {

        return (
            <View style={{
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'center', alignItems: 'center',
            }}>
        
                {this.props.event_type === "relation" ? null :
                    <View style={{ height:50,width:50,borderRadius:30,...shadower(2),alignItems:"center",justifyContent:"center"}}>
                        <Icon style={{
                            color: colorList.bodyIcon,
                            fontSize: 30,
                        }} onPress={() => {
                            this.refs.ActionMenu.showMenu()
                        }} name="plus" type="AntDesign"></Icon>


                    </View>
                }
                        <View>
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
            </View>
        )
    }
}