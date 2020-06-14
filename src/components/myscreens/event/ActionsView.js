import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Label, Icon } from 'native-base';
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
            <View style={{ height: 55, alignSelf: 'center' }}>

                {this.props.event_type === "relation" ? null :
                    <View>
                        <ActionsMenu
                            openSettings={this.props.openSettingsModal}
                            ref={'ActionMenu'}
                        ></ActionsMenu>
                    </View>
                }


            </View>
        )
    }
}