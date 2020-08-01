/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { View, Text , TouchableOpacity} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import ColorList from '../colorList';
import Entypo from 'react-native-vector-icons/Entypo';
import GState from "../../stores/globalState";

export default class SwipeMenu extends React.PureComponent {
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
    return (
      <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center',height:'100%' }}>
        <Menu
          ref={this.setMenuRef}
          button={
              <TouchableOpacity onPress={this.showMenu}>
                <View style={{width:30,height:'100%', justifyContent: 'center',alignItems:'center'}}>
                 <Entypo
                   name="dots-three-vertical"
                   type="Entypo"
                   style={{...GState.defaultIconSize, color: 'white', fontSize: 16 }}
                   onPress={this.showMenu}
                 />
                </View>
              </TouchableOpacity>
          }
        >
          {/*<MenuItem onPress={this.hideMenu}>All Medias</MenuItem>*/}
          {/*<MenuItem onPress={this.hideMenu}>Define as ...</MenuItem>*/}
          <MenuItem onPress={() => {
            this.hideMenu()
            this.props.forward()
          }
          }>Forward</MenuItem>
          <MenuItem onPress={() => {
            this.hideMenu()
            this.props.reply()
          }}>Reply</MenuItem>

        </Menu>
      </View>
    );
  }
}

/*
export default class ChangeBoxMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      button: this.props.button,
      menuList: this.props.menuList,
      isMount: true,
      isPublisherModalOpened: false,
    };
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
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Menu
          style={{ backgroundColor: ColorList.bodyBackground }}
          ref={this.setMenuRef}
          button={
            <Icon
              name="dots-three-vertical"
              type="Entypo"
              style={{ color: 'white', fontSize: 20 }}
              onPress={() => requestAnimationFrame(this.showMenu)}
            />
          }
        />
        <MenuItem onPress={this.hideMenu}>All Medias</MenuItem>
        <MenuItem onPress={this.hideMenu}>Define as ...</MenuItem>
        <MenuItem onPress={this.hideMenu}>Share</MenuItem>
        <MenuItem onPress={this.hideMenu}>delete</MenuItem>
      </View>
    );
  }
}
*/
