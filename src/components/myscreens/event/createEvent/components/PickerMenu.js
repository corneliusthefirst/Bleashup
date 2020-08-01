import React, { Component } from "react";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import { View ,TouchableOpacity} from "react-native";
import ColorList from "../../../../colorList";
import shadower from "../../../../shadower";
import Octicons  from 'react-native-vector-icons/Octicons';
import EvilIcons  from 'react-native-vector-icons/EvilIcons';
import  MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import  AntDesign  from 'react-native-vector-icons/AntDesign';
import GState from "../../../../../stores/globalState";
export default class PickersMenu extends Component {
  constructor(props) {
    super(props);
  }
  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };
 icons = {
   Octicons: <Octicons style={{ ...GState.defaultIconSize,...this.iconStyle}} name={this.props.icon.name}></Octicons>,
   EvilIcons: <EvilIcons style={{ ...GState.defaultIconSize,...this.iconStyle}} name={this.props.icon.name}></EvilIcons>,
   MaterialIcons: <MaterialIcons style={{ ...GState.defaultIconSize,...this.iconStyle}} name={this.props.icon.name}></MaterialIcons>,
   AntDesign: <AntDesign style={{ ...GState.defaultIconSize,...this.iconStyle}} name={this.props.icon.name}></AntDesign>
 }
  iconStyle = {
    color: ColorList.bodyIcon,
    fontSize: this.props.fontSize ?this.props.fontSize: 30,
  }
  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    console.warn("showing menu")
    this._menu.show();
  };
  renderMenuItems() {
    return this.props.menu.map((ele) => {
      return (
        ele.condition && (
          <View>
            <MenuDivider color="#1FABAB" />
            <MenuItem
              textStyle={{ color:ColorList.headerIcon }}
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Menu
          ref={this.setMenuRef}
          button={
            <TouchableOpacity
            onPress={() => requestAnimationFrame(this.showMenu.bind(this))}
            >
             {this.icons[this.props.icon.type]}  
            </TouchableOpacity>
          }
        >
          {this.renderMenuItems()}
        </Menu>
      </View>
    );
  }
}
