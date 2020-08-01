import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import emitter from "../../../services/eventEmiter";
import ColorList from "../../colorList";
import  Entypo  from 'react-native-vector-icons/Entypo';

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
                        <TouchableOpacity onPress={() => requestAnimationFrame(this.showMenu)} ><Entypo
                            style={{
                                color: ColorList.bodyIcon,
                                fontSize: 25,
                                marginTop: "10%",
                            }}
                            name="dots-three-vertical"
                            type="Entypo"
                        /></TouchableOpacity>
                    }
                >
                    <View>
                        <MenuItem
                            textStyle={{ color: ColorList.bodyIcon }}
                            onPress={() => {
                                this.hideMenu();
                                this.props.reply();
                            }}
                        >
                            {"Reply"}
                        </MenuItem>
                        <MenuDivider color={ColorList.indicatorColor}/>
                    </View>
                    <View>
                        <MenuItem
                            textStyle={{ color: ColorList.bodyIcon }}
                            onPress={() => {
                                this.hideMenu();
                                this.props.members();
                            }}
                        >
                            {"Members"}
                        </MenuItem>
                        <MenuDivider color={ColorList.indicatorColor} />
                    </View>
                    {this.props.creator ? (
                        <View>
                            <MenuItem
                                textStyle={{ color: ColorList.bodyIcon }}
                                onPress={() => {
                                    this.hideMenu();
                                    this.props.addMembers();
                                }}
                            >
                                {"Assign"}
                            </MenuItem>
                            <MenuDivider color={ColorList.indicatorColor} />
                        </View>
                    ) : null}
                    <View>
                        <MenuItem
                            textStyle={{ color: ColorList.bodyIcon }}
                            onPress={() => {
                                this.hideMenu();
                                this.props.removeMembers();
                            }}
                        >
                            {"Unassign"}
                        </MenuItem>
                        <MenuDivider color={ColorList.indicatorColor} />
                    </View>
                    {this.props.creator ? (
                        <View>
                            <MenuItem
                                textStyle={{ color: ColorList.bodyIcon }}
                                onPress={() => {
                                    this.hideMenu();
                                    this.props.update();
                                }}
                            >
                                {"Update"}
                            </MenuItem>
                            <MenuDivider color={ColorList.indicatorColor} />
                        </View>
                    ) : null}
                    {this.props.creator ? (
                        <View>
                            <MenuItem
                                textStyle={{ color: ColorList.delete }}
                                onPress={() => {
                                    this.hideMenu();
                                    this.props.deleteRemind();
                                }}
                            >
                                {"Delete"}
                            </MenuItem>
                            <MenuDivider color={ColorList.indicatorColor} />
                        </View>
                    ) : null}
                </Menu>
            </View>
        ) : (
                <ImageActivityIndicator />
            );
    }
}
