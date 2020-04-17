import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon, } from "native-base"
import emitter from '../../../services/eventEmiter';
import ColorList from '../../colorList';

export default class MoreMembersMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            button: this.props.button,
            menuList: this.props.menuList,
            isMount: true,
            published: this.props.published,
            isPublisherModalOpened: false
        }
    }
    componentDidMount() {
        this.setState({
            publi: this.props.public,
            opened: this.props.opened
        })
        // emitter.on("open-close", (newState) => {
        //    console.warn("receiving closed !!")
        //    this.setState({
        //        opened: newState
        //    })
        // })
        //  emitter.on("publish-unpublish", (newState) => {
        //      this.setState({
        //          public: newState
        //      })
        //  })
    }
    componentWillUnmount() {
        //emitter.off('open-close')
        // emitter.off('publish-unpublish')
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
            <View style={{}}>
                <Menu
                    style={{ backgroundColor: ColorList.bodyBackground }}
                    ref={this.setMenuRef}
                    button={<Icon style={{
                        color: ColorList.headerIcon,
                        fontSize: 30,
                    }} onPress={this.showMenu} name="circle-with-plus" type="Entypo"></Icon>}
                >
                    {this.props.master && <View><MenuItem textStyle={{ color: ColorList.headerIcon }} onPress={() => {
                        this.hideMenu()
                        this.props.addMembers()
                    }}>{"Add Members"}</MenuItem>
                        <MenuDivider color={ColorList.iconActive} /></View>}

                    <View><MenuItem textStyle={{ color: ColorList.headerIcon }} onPress={() => {
                        this.hideMenu()
                        this.props.invite()
                    }}>{"Invite Members"}</MenuItem>
                        <MenuDivider color={ColorList.iconActive} /></View>
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 