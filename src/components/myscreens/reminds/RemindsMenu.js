import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon, } from "native-base"
import emitter from '../../../services/eventEmiter';

export default class RemindsMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            button: this.props.button,
            menuList: this.props.menuList,
            isMount: true,
            isPublisherModalOpened: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hide) {
            this._menu.hide()
        }
    }
    _menu = null;

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };
    render() {
        return this.state.isMount ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Menu
                    style={{ backgroundColor: "#FEFFDE" }}
                    ref={this.setMenuRef}
                    button={<Icon style={{
                        color: "#0A4E52",
                        fontSize: 25,
                        marginTop: '10%'
                    }} onPress={this.showMenu} name="dots-three-vertical" type="Entypo"></Icon>}
                >
                    <MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.mention()
                    }
                    }>{"Mention"}</MenuItem> 
                    <View><MenuDivider color="#1FABAB" /><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        return this.props.updateRemind()
                    }}>{"View Configs"}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>
                    <View><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.showMembers()
                    }}>{"Concernees"}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>
                    {this.props.master?<View><MenuDivider color="#1FABAB" /><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.addMembers()
                    }}>{"Add Concernee"}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>:null}
                    <View>
                        <MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                            this.hideMenu()
                            this.props.removeMembers()
                        }}>Remove Concernee</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>
                    <View><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.viewDoneBy()
                    }}>{"Done By ..."}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>
                    <View><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.viewConfirmed()
                    }}>{"View Confirmed"}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>
                    {this.props.master?<View><MenuItem textStyle={{ color: "red" }} onPress={() => {
                        this.hideMenu()
                        this.props.deleteRemind()
                    }}>{"Delete"}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>:null}
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 