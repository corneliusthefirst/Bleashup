import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon, } from "native-base"
import emitter from '../../../services/eventEmiter';
import ColorList from '../../colorList';

export default class RemindsTypeMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {}

    }
    state = {}
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
        return <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '10%', }}>
            <Menu
                style={{ backgroundColor: ColorList.bodyBackground }}
                ref={this.setMenuRef}
                button={<TouchableOpacity onPress={this.showMenu} style={{ flexDirection: 'row', }}>
                    <Text style={{ fontWeight: 'bold', color: ColorList.bodyText }}>{"Type: "}</Text>
                    <Text style={{ backgroundColor: ColorList.bodyDarkWhite, borderRadius: 10,paddingLeft: 10,paddingRight: 10, }}>{this.props.type}</Text>
                </TouchableOpacity>}
            >
                <View><MenuItem textStyle={{ color: ColorList.headerIcon }} onPress={() => {
                    this.hideMenu()
                    this.props.reminder()
                }}>{"Remind"}</MenuItem>
                    <MenuDivider color="#1FABAB" /></View>
                <View>
                    <MenuItem textStyle={{ color: ColorList.headerIcon }} onPress={() => {
                        this.hideMenu()
                        this.props.event()
                    }}>{"Event"}</MenuItem>
                </View>
            </Menu>
        </View>

    }
} 