import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import emitter from '../../../services/eventEmiter';
import ColorList from '../../colorList';
import Entypo  from 'react-native-vector-icons/Entypo';

export default class RemoveMemberMenu extends Component {
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
            public: this.props.public,
            opened: this.props.opened
        })
    }
    componentWillUnmount() {
       
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
                    button={<TouchableOpacity onPress={() => requestAnimationFrame(this.showMenu)}><Entypo style={{
                        color: ColorList.headerIcon,
                        fontSize: 30,
                    }} name="circle-with-minus" type="Entypo"/></TouchableOpacity>}
                >
                    <View><MenuItem textStyle={{ color: ColorList.headerIcon }} onPress={() => {
                        this.hideMenu()
                        this.props.remove()
                    }}>{"Remove Members"}</MenuItem>
                        <MenuDivider color={ColorList.iconActive} /></View>
                </Menu>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 