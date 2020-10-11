
import React from "react"
import BeComponent from './BeComponent';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { View } from 'react-native';
import ColorList from "./colorList";
import rounder from "../services/rounder";
import { TouchableOpacity } from 'react-native';
import  Entypo  from 'react-native-vector-icons/Entypo';
import GState from "../stores/globalState";

export default class BeMenu extends BeComponent {
    constructor(props) {
        super(props)
    }
    _menu = null;

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        //this.props.hideMenu()
        this._menu.show();
    };
    renderMenuList(){
        return this.props.items && this.props.items().map(ele => {
            return ele.condition && <View key={ele.title} style={{ flex: 1 }}><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                this.hideMenu()
                ele && ele.action() 
            }}>{ele.title}</MenuItem>
                <MenuDivider color={ColorList.indicatorColor} /></View>
        })
    }
    render() {
        return <View>
            <Menu
                style={{ backgroundColor: ColorList.popMenuBackground }}
                ref={this.setMenuRef}
                button={
                    <TouchableOpacity
                    onPress={this.showMenu.bind(this)}
                    style={{
                        ...rounder(this.props.size||40,ColorList.bodyDarkWhite),
                        justifyContent: 'center',
                    }}>
                    <Entypo name={"dots-three-vertical"} style={{
                        ...GState.defaultIconSize
                    }}></Entypo>
                    </TouchableOpacity>
                }
            >
            {this.renderMenuList()}
            </Menu>
        </View>
    }
}