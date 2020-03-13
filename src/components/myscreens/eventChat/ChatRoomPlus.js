import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon, } from "native-base"

export default class ChatRoomPlus extends Component {
    constructor(props) {
        super(props)
    }
    showMenu = () => {
        this._menu.show();
    };
    setMenuRef = ref => {
        this._menu = ref;
    };
    _menu = null;
    hideMenu = () => {
        this._menu.hide();
    };
    render() {
        return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <Menu style={{ backgroundColor: "#FEFFDE" }}
                ref={this.setMenuRef}
                button={<Icon style={{
                    color: "#1FABAB",
                    fontSize: 25,
                    marginTop: '10%'
                }} onPress={this.showMenu}
                    name="pluscircle" type="AntDesign"></Icon>}>
                <View><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                    this.hideMenu()
                    return this.props.showVote()
                }
                }>Votes</MenuItem></View>
                <View><MenuDivider color="#1FABAB" /><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                    this.hideMenu()
                    this.props.showReminds()
                }}>Reminds</MenuItem></View>
                {this.props.roomID == this.props.eventID ? null : !this.props.master ? null :
                    <View><MenuDivider color="#1FABAB" /><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.addMembers()
                    }}>Add Members</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>}
            </Menu>
        </View>
    }
}