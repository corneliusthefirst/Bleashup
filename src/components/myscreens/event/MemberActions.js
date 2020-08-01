import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import emitter from '../../../services/eventEmiter';
import ColorList from '../../colorList';
import  Entypo from 'react-native-vector-icons/Entypo';

export default class MemberActions extends Component {
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
            publi: this.props.public,
            opened: this.props.opened
        })
    }
    componentWillUnmount() {
        
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
            <View style={{}}>
                <Menu
                    style={{ backgroundColor: ColorList.bodyBackground }}
                    ref={this.setMenuRef}
                    button={<Entypo style={{
                        color: ColorList.headerIcon,
                        fontSize: 25,
                    }} onPress={this.showMenu} name="dots-three-vertical" type="Entypo"/>}
                >
                    <View><MenuItem textStyle={{ color: ColorList.headerIcon}} onPress={() => {
                        this.hideMenu()
                        this.props.checkActivity()
                    }}>{"Check Activites"}</MenuItem>
                        <MenuDivider color={ColorList.iconActive} /></View>
                     {this.props.mainMaster && this.props.creator !== this.props.phone ? <View>
                        <MenuItem textStyle={{ color: ColorList.headerIcon }} onPress={() => {
                            this.hideMenu()
                            this.props.changeMasterState()
                        }}>{this.props.master ? "Remove As Master" : "Add As Master"}</MenuItem>
                        <MenuDivider color={ColorList.iconActive} /></View> : null}
                    {this.props.currentPhone === this.props.phone && <View><MenuItem textStyle={{ color: "red" }} onPress={() => {
                        this.hideMenu()
                        this.props.leaveActivity()
                    }}>{"Leave Activites"}</MenuItem>
                        <MenuDivider color={ColorList.iconActive} /></View>}
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 