import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import emitter from '../../../services/eventEmiter';
import colorList from "../../colorList";
import replies from './reply_extern';
import  EvilIcons  from 'react-native-vector-icons/EvilIcons';

export default class ChatroomMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            button: this.props.button,
            menuList: this.props.menuList,
            isMount: true,
            published: this.props.published,
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
    publish() {
        this._menu.hide();
        return this.props.publish()
    }
    showPublishers = () => {
        return this.props.showPublishers
        //this._menu.hide()

    }
    isGeneral = this.props.roomID == this.props.eventID
    render() {
        return this.state.isMount ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Menu
                    style={{ backgroundColor: colorList.popMenuBackground }}
                    ref={this.setMenuRef}
                    button={<TouchableOpacity 
                        onPress={ () => 
                            requestAnimationFrame(() => this.showMenu())
                    }><EvilIcons style={{
                        color: colorList.headerIcon,
                    }}
                     name="gear" 
                     type="EvilIcons">
                    </EvilIcons>
                    </TouchableOpacity>}
                >
                    {this.isGeneral?null: <View><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        return this.props.showMembers()
                    }
                    }>View Members</MenuItem></View>}
                    {/*<View><MenuDivider color="gray" /><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.showRoomMedia()
                    }}>Media</MenuItem><MenuDivider color="#1FABAB" /></View>*/}
                    {this.isGeneral ? null : !this.props.master ? null : <View>
                        <MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                            this.hideMenu()
                            this.props.removeMembers()
                        }}>Remove Members</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>}
                    {this.isGeneral ? null : !this.props.master ? null :
                        <View><MenuItem textStyle={{ color: this.props.opened ? "red" : "green" }} onPress={() => {
                            this.hideMenu()
                            this.props.opened ? this.props.closeCommitee() : this.props.openCommitee()
                        }}>{this.props.opened ? "Close Committee" : "Open Committee"}</MenuItem>
                            <MenuDivider color="#1FABAB" /></View>}
                    {this.isGeneral ? null : !this.props.master ? null :
                        <View><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                            this.hideMenu()
                            this.props.public ? this.props.publishCommitee() : this.props.publishCommitee()
                        }}>{this.isGeneral ? null : this.props.public ?
                            "Unpublish Committee" : "Publish Committee"}</MenuItem>
                            <MenuDivider color="#1FABAB" /></View>}
                    {this.isGeneral || (this.props.master) ? <View><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.settings()
                    }}>{this.isGeneral ?
                        "Activity Settings" : `Edit ${replies.committee} Name`}
                    </MenuItem>
                        <MenuDivider color="#1FABAB" /></View> : null}
                    {this.isGeneral ? null :
                        <View><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                            this.hideMenu()
                            this.props.leaveCommitee()
                        }}>{"Leave Committee"}</MenuItem>
                            <MenuDivider color="#1FABAB" /></View>}
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 