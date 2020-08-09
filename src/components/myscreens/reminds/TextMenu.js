import React, { Component } from "react";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import { View, TouchableOpacity,Text } from "react-native";
import ColorList from '../../colorList';
export default class TextMenu extends Component {
    constructor(props) {
        super(props);
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
    renderMenuItems() {
        return this.props.menu.map((ele) => {
            return (
                ele.condition && (
                    <View>
                        <MenuDivider color="#1FABAB" />
                        <MenuItem
                            textStyle={{ 
                                color: ColorList.headerIcon, 
                                textTransform: 'capitalize' 
                            }}
                            onPress={() => {
                                this.hideMenu();
                                ele.callback();
                            }}
                        >
                            {ele.title}
                        </MenuItem>
                    </View>
                )
            );
        });
    }
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Menu
                    ref={this.setMenuRef}
                    button={
                        <TouchableOpacity
                            onPress={() => requestAnimationFrame(this.showMenu)}
                        >
                        <Text ellipsizeMode={"tail"} numberOfLines={1} style={{fontWeight: 'bold',}}>{this.props.title}</Text>
                        </TouchableOpacity>
                    }
                >
                    {this.renderMenuItems()}
                </Menu>
            </View>
        );
    }
}
