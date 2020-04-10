import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon, } from "native-base"

export default class ChangeBoxMenu extends Component {
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
                    style={{ backgroundColor: "#9EEDD3" }}
                    ref={this.setMenuRef}
                    button={<Icon style={{
                        color: "#0A4E52",
                        fontSize: 25,
                        marginTop: '10%'
                    }} onPress={this.showMenu} name="dots-three-vertical" type="Entypo"></Icon>}
                >
                    {this.props.master ? 
                        this.props.change.updated === 'delete_remind' ||
                        this.props.change.updated === 'highlight_delete' 
                        ? <View><MenuDivider color="#1FABAB" /><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                            this.hideMenu()
                            this.props.restore()
                        }}>{"Restore"}</MenuItem></View> : null : null}
                    <View></View>
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 