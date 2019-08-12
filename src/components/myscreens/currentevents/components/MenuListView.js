import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import ImageActivityIndicator from "./imageActivityIndicator";
import { Icon, } from "native-base"
import PublishersModal from "../../../PublishersModal"

export default class MenuListView extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        button: undefined,
        menuList: undefined,
        isMount: false,
        isPublisherModalOpened: false
    }
    componentDidMount() {
        this.setState({
            button: this.props.button,
            menuList: this.props.menuList,
            isMount: true,
            published: this.props.published,
            isPublisherModalOpened: false
        })
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
        return this.props.publish
    }
    showPublishers = () => {
        return this.props.showPublishers
        //this._menu.hide()

    }
    _renderMenuItems() {
        return this.state.menuList.map(data => {
            return <MenuItem onPress={this.hideMenu}>{data}</MenuItem>
        })
    }
    render() {
        return this.state.isMount ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Menu
                    style={{ backgroundColor: "#FEFFDE" }}
                    ref={this.setMenuRef}
                    button={<Text onPress={this.showMenu} style={{ color: "#0A4E52" }}>{this.state.published ? "Pubished" : "Publish"}</Text>}
                >
                    <MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => this.publish()}>Publish</MenuItem>
                    {this.state.published ? <View>
                        <MenuDivider color="#1FABAB" />
                        <MenuItem textStyle={{ color: "#0A4E52" }} onPress={() => {
                            this.hideMenu()
                            return this.setState({ isPublisherModalOpened: true })
                        }
                        }>View Publshers</MenuItem>
                    </View> : null}
                </Menu>
                <PublishersModal onClosed={() => {
                    this.hideMenu()
                    return this.setState({ isPublisherModalOpened: false })
                }
                }
                    isOpen={this.state.isPublisherModalOpened}></PublishersModal>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 