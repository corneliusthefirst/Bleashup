import React, { Component } from "react";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import { Icon } from "native-base";
import { View } from "react-native";
import ColorList from "../../../../colorList";
import shadower from "../../../../shadower";
export default class PickersMenu extends Component {
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
              textStyle={{ color: ColorList.headerIcon }}
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
            <View
              style={{
                height: 25,
                width: 25,
                borderRadius: 22,
                ...shadower(1),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                style={{
                  color: ColorList.bodyIcon,
                  fontSize: 15,
                }}
                onPress={this.showMenu}
                name={this.props.icon.name}
                type={this.props.icon.type}
              ></Icon>
            </View>
          }
        >
          {this.renderMenuItems()}
        </Menu>
      </View>
    );
  }
}
