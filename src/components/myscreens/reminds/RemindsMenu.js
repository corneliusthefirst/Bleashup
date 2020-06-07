import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import { Icon } from "native-base";
import emitter from "../../../services/eventEmiter";
import ColorList from "../../colorList";

export default class RemindsMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            button: this.props.button,
            menuList: this.props.menuList,
            isMount: true,
            isPublisherModalOpened: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hide) {
            this._menu.hide();
        }
    }
    _menu = null;

    setMenuRef = (ref) => {
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
            <View>
                <Menu
                    style={{ backgroundColor: ColorList.bodyBackground }}
                    ref={this.setMenuRef}
                    button={
                        <TouchableOpacity onPress={() => requestAnimationFrame(this.showMenu)} ><Icon
                            style={{
                                color: ColorList.bodyIcon,
                                fontSize: 25,
                                marginTop: "10%",
                            }}
                            name="dots-three-vertical"
                            type="Entypo"
                        ></Icon></TouchableOpacity>
                    }
                >
                    <View>
                        <MenuItem
                            textStyle={{ color: "#0A4E52" }}
                            onPress={() => {
                                this.hideMenu();
                                this.props.reply();
                            }}
                        >
                            {"Reply"}
                        </MenuItem>
                        <MenuDivider color="#1FABAB" />
                    </View>
                    <View>
                        <MenuItem
                            textStyle={{ color: "#0A4E52" }}
                            onPress={() => {
                                this.hideMenu();
                                this.props.members();
                            }}
                        >
                            {"Members"}
                        </MenuItem>
                        <MenuDivider color="#1FABAB" />
                    </View>
                    {this.props.creator ? (
                        <View>
                            <MenuItem
                                textStyle={{ color: "#0A4E52" }}
                                onPress={() => {
                                    this.hideMenu();
                                    this.props.addMembers();
                                }}
                            >
                                {"Assign"}
                            </MenuItem>
                            <MenuDivider color="#1FABAB" />
                        </View>
                    ) : null}
                    <View>
                        <MenuItem
                            textStyle={{ color: "#0A4E52" }}
                            onPress={() => {
                                this.hideMenu();
                                this.props.removeMembers();
                            }}
                        >
                            {"Unassign"}
                        </MenuItem>
                        <MenuDivider color="#1FABAB" />
                    </View>
                    {this.props.creator ? (
                        <View>
                            <MenuItem
                                textStyle={{ color: "#0A4E52" }}
                                onPress={() => {
                                    this.hideMenu();
                                    this.props.update();
                                }}
                            >
                                {"Update"}
                            </MenuItem>
                            <MenuDivider color="#1FABAB" />
                        </View>
                    ) : null}
                    {this.props.creator ? (
                        <View>
                            <MenuItem
                                textStyle={{ color: "red" }}
                                onPress={() => {
                                    this.hideMenu();
                                    this.props.deleteRemind();
                                }}
                            >
                                {"Delete"}
                            </MenuItem>
                            <MenuDivider color="#1FABAB" />
                        </View>
                    ) : null}
                </Menu>
            </View>
        ) : (
                <ImageActivityIndicator />
            );
    }
}
