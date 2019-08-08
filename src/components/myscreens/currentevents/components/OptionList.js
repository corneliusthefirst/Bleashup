import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import ImageActivityIndicator from "./imageActivityIndicator";
import { Icon, } from "native-base"

export default class OptionList extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        button: undefined,
        menuList: undefined,
        isMount: false
    }
    componentDidMount() {
        this.setState({
            button: this.props.button,
            menuList: this.props.menuList,
            isMount: true,
            published: this.props.published
        })
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
        this.props.publish
    }
    showPublishers() {
        this._menu.hide()
        this.props.showPublishers
    }
    _renderMenuItems() {
        return this.state.menuList.map(data => {
            return <MenuItem onPress={this.hideMenu}>{data}</MenuItem>
        })
    }
    render() {
        return this.state.isMount ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Menu
                    style={{ backgroundColor: "#FEFFDE" }}
                    ref={this.setMenuRef}
                    button={<Text onPress={this.showMenu} style={{ color: "#0A4E52" }}>Options</Text>}
                >
                    <MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => this.props.publish()}>Publish</MenuItem>
                    <MenuDivider color="#1FABAB" />
                    <MenuItem textStyle={{ color: "red" }} onPress={() => this.props.showPublishers()}>Delete</MenuItem>
                    <MenuDivider color="#1FABAB" />
                    <MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => this.props.hide()}>Hide</MenuItem>
                    <MenuDivider color="#1FABAB" />
                    <MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => this.props.showPublishers()}>Hide</MenuItem>
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 