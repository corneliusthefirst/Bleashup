import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import colorList from "../../colorList";
import replies from './reply_extern';
import Entypo from 'react-native-vector-icons/Entypo';
import GState from "../../../stores/globalState";
import ColorList from "../../colorList";
import Texts from '../../../meta/text';
import ActivityPages from './chatPages';
import rounder from "../../../services/rounder";
import { constructActivityLink } from './services';
import BeComponent from '../../BeComponent';

export default class ChatroomMenu extends BeComponent {
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
    shouldComponentUpdate() {
        return false
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
    gotToPage(page) {
        this.props.openPage(page)
    }
    isGeneral = this.props.roomID == this.props.eventID
    render() {
        return this.state.isMount ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Menu
                    style={{ backgroundColor: colorList.popMenuBackground }}
                    ref={this.setMenuRef}
                    button={<TouchableOpacity
                        style={{
                            ...rounder(35, ColorList.bodyBackground),
                            justifyContent: 'center',
                        }}
                        onPress={() => this.showMenu()}><Entypo style={{
                            ...GState.defaultIconSize,
                            color: colorList.headerIcon,
                        }}
                            name="dots-three-vertical">
                        </Entypo>
                    </TouchableOpacity>}
                >
                    <View>
                        <MenuItem textStyle={{ color: ColorList.bodyText }} onPress={() => {
                            this.hideMenu()
                            this.gotToPage(ActivityPages.reminds)
                        }}>{Texts.remind}</MenuItem>
                        <MenuDivider color={ColorList.bodyText} /></View>
                    <View><MenuItem textStyle={{ color: ColorList.bodyText }} onPress={() => {
                        this.hideMenu()
                        this.gotToPage(ActivityPages.starts)
                    }}>{Texts.star}</MenuItem>
                        <MenuDivider color={ColorList.bodyText} /></View>
                    <View><MenuItem textStyle={{ color: ColorList.bodyText }} onPress={() => {
                        this.hideMenu()
                        this.gotToPage(ActivityPages.logs)
                    }}>{Texts.logs}</MenuItem>
                        <MenuDivider color={ColorList.bodyIcon} /></View>
                    {!this.props.isRelation ? <View><MenuItem textStyle={{ color: ColorList.bodyText }} onPress={() => {
                        this.hideMenu()
                        this.props.settings()
                    }}>{Texts.settings}
                    </MenuItem>
                        <MenuDivider color={ColorList.bodyText} /></View> : null}
                    {!this.props.isRelation ? <View><MenuItem textStyle={{ color: ColorList.bodyText }} onPress={() => {
                        this.hideMenu()
                        this.props.openDescription()
                    }}>{Texts.show_activity_description}
                    </MenuItem>
                        <MenuDivider color={ColorList.bodyText} /></View> : null}
                    {!this.props.isRelation ? <View><MenuItem textStyle={{ color: ColorList.bodyText }} onPress={() => {
                        this.hideMenu()
                        this.props.getShareLink(constructActivityLink(this.props.activity_id))
                    }}>{Texts.get_share_link}
                    </MenuItem>
                        <MenuDivider color={ColorList.bodyText} /></View> : null}
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 