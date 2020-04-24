import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon, } from "native-base"
import ColorList from '../../../../colorList';

export default class PostMenu extends Component {
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
                    style={{ backgroundColor: ColorList.bodyBackground }}
                    ref={this.setMenuRef}
                    button={<Icon style={{
                        color: ColorList.headerIcon,
                        fontSize: 22,
                        marginTop: '10%'
                    }} onPress={this.showMenu} name="dots-three-vertical" type="Entypo"></Icon>}
                >
                    <MenuItem textStyle={{ color: ColorList.headerIcon }} onPress={() => {
                        this.hideMenu()
                        return this.props.mention()
                    }
                    }>{"Reply"}</MenuItem>
                    {this.props.creator ?
                        <View><MenuDivider color="#1FABAB" /><MenuItem textStyle={{ color: ColorList.headerIcon }} onPress={() => {
                                this.hideMenu()
                                this.props.update()
                            }}>{"Update"}</MenuItem></View> : null}
                    {this.props.master || this.props.creator ?
                        <View><MenuDivider color="#1FABAB" /><MenuItem textStyle={{ color: "red" }} onPress={() => {
                            this.hideMenu()
                            this.props.delete()
                        }}>{"Delete"}</MenuItem></View> : null}
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 