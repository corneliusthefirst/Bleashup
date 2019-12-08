import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { Icon, } from "native-base"
import emitter from '../../../services/eventEmiter';

export default class MemberActions extends Component {
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
    publish() {
        this._menu.hide();
        return this.props.publish()
    }
    showPublishers = () => {
        return this.props.showPublishers
        //this._menu.hide()

    }
    render() {
        return this.state.isMount ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Menu
                    style={{ backgroundColor: "#FEFFDE" }}
                    ref={this.setMenuRef}
                    button={<Icon style={{
                        color: "#0A4E52",
                        fontSize: 25,
                        marginTop: '10%'
                    }} onPress={this.showMenu} name="dots-three-vertical" type="Entypo"></Icon>}
                >
                    <View><MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                        this.hideMenu()
                        this.props.checkActivity()
                    }}>{"Check Activites"}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View>
                     {this.props.mainMaster && this.props.creator !== this.props.phone ? <View>
                        <MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                            this.hideMenu()
                            this.props.changeMasterState()
                        }}>{this.props.master ? "Remove As Master" : "Add As Master"}</MenuItem>
                        <MenuDivider color="#1FABAB" /></View> : null}
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 