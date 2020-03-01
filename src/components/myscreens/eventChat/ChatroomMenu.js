import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon, } from "native-base"
import emitter from '../../../services/eventEmiter';

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
    componentDidMount() {
        this.setState({
            public: this.props.public,
            opened: this.props.opened
        })
        emitter.on("open-close", (newState) => {
            console.warn("receiving closed !!")
            this.setState({
                opened: newState
            })
        })
        emitter.on("publish-unpublish", (newState) => {
            this.setState({
                public: newState
            })
        })
    }
    componentWillUnmount() {
        emitter.off('open-close')
        emitter.off('publish-unpublish')
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
                        return this.props.showMembers()
                    }
                    }>View Members</MenuItem>
                    {this.props.roomID == this.props.eventID ? null : !this.props.master ? null :
                        <View><MenuDivider color="#1FABAB" /><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                            this.hideMenu()
                            this.props.addMembers()
                        }}>Add Members</MenuItem>
                            <MenuDivider color="#1FABAB" /></View>}
                    {this.props.roomID == this.props.eventID ? null : !this.props.master ? null : <View>
                        <MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                            this.hideMenu()
                            this.props.removeMembers()
                        }}>Remove Members</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>}
                    {this.props.roomID == this.props.eventID ? null : !this.props.master ? null :
                        <View><MenuItem textStyle={{ color: this.state.opened ? "red" : "green" }} onPress={() => {
                            this.hideMenu()
                            this.state.opened ? this.props.closeCommitee() : this.props.openCommitee()
                        }}>{this.state.opened ? "Close Committee" : "Open Committee"}</MenuItem>
                            <MenuDivider color="#1FABAB" /></View>}
                    {this.props.roomID === this.props.eventID ? null : !this.props.master ? null :
                        <View><MenuItem textStyle={{ color: "green" }} onPress={() => {
                            this.hideMenu()
                            this.state.public ? this.props.publishCommitee() : this.props.publishCommitee()
                        }}>{this.props.roomID == this.props.eventID ? null : this.state.public ?
                            "Unpublish Committee" : "Publish Committee"}</MenuItem>
                            <MenuDivider color="#1FABAB" /></View>}
                    {this.props.roomID == this.props.eventID ? null :
                        <View><MenuItem textStyle={{ color: "green" }} onPress={() => {
                            this.hideMenu()
                            this.props.leaveCommitee()
                        }}>{"Leave Committee"}</MenuItem>
                            <MenuDivider color="#1FABAB" /></View>}
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 