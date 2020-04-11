import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon, } from "native-base"
import emitter from '../../../services/eventEmiter';
import colorList from '../../colorList';
import shadower from '../../shadower';

export default class ActionsMenu extends Component {
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
        //this.props.hideMenu()
        this._menu.show();
    };
    render() {
        return this.state.isMount ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Menu
                    style={{ backgroundColor: colorList.popMenuBackground }}
                    ref={this.setMenuRef}
                    button={
                        <View style={{ height:50,width:50,borderRadius:30,...shadower(2),alignItems:"center",justifyContent:"center"}}>
                        <Icon style={{
                            color: colorList.bodyIcon,
                            fontSize: 30,
                        }} onPress={() => {
                            this.showMenu()
                        }} name="plus" type="AntDesign"></Icon>
                       </View>
                    }
                >
                    {this.props.event_type !== "relation" ? <View style={{flex:1}}><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.publish()
                    }}>{"Publish"}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View> : null}
                    <View>
                        {this.props.event_type !== "relation" ? <MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                            this.hideMenu()
                            this.props.inviteContacts()
                        }}>{"Invite Members"}</MenuItem> : null}
                        <MenuDivider color="#1FABAB" /></View>
                    {this.props.event_type !== "relation" ? <View style={{flex:1}}><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.members()
                    }}>{"Manage Members"}
                    </MenuItem>
                        <MenuDivider color="#1FABAB" /></View> : null}
                    <View style={{flex:1}}><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.ckeckMyActivty()
                    }}>{"My Activity"}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>
                    <View style={{flex:1}}><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.settings()
                    }}>{"Settings"}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>
                    {this.props.event_type !== 'relation' && this.props.period ? <View style={{flex:1}}><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.sync()
                    }}>{this.props.calendared ? "Unsync" : "Sync"}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View> : null}
                    {this.props.event_type !== 'relation'?<View style={{flex:1}}><MenuItem textStyle={{ color: "red" }} onPress={() => {
                        this.hideMenu()
                        this.props.leave()
                    }}>{"Leave Activity"}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>:null}
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 