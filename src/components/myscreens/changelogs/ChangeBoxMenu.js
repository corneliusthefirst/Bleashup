import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import ColorList from '../../colorList';
import  Entypo from 'react-native-vector-icons/Entypo';

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
                    style={{ backgroundColor: ColorList.bodyBackground }}
                    ref={this.setMenuRef}
                    button={<TouchableOpacity 
                        onPress={() => requestAnimationFrame(this.showMenu)} >
                        <Entypo style={{
                        color: ColorList.bodyIcon,
                        fontSize: 25,
                    }} 
                    name="dots-three-vertical"></Entypo>
                    </TouchableOpacity>}
                >
                <View>
                        <MenuItem textStyle={{ color: ColorList.bodyIcon }} onPress={() => {
                            this.hideMenu()
                            this.props.reply()
                        }}>{"Reply"}</MenuItem>
                </View>
                    {this.props.master ? 
                        this.props.change.updated === 'delete_remind' ||
                        this.props.change.updated === 'highlight_delete' 
                            ? <View><MenuDivider color={ColorList.bodyIcon} />
                            <MenuItem textStyle={{ color: ColorList.bodyIcon }} onPress={() => {
                            this.hideMenu()
                            this.props.restore()
                        }}>{"Restore"}</MenuItem></View> : null : null}
                    <View></View>
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 