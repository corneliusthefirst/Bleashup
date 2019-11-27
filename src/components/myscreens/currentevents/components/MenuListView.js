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
        this.state = {
            button: this.props.button,
            menuList: this.props.menuList,
            isMount: true,
            published: this.props.published,
            isPublisherModalOpened: false
        }
    }
    componentDidMount() {

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
                    button={<View  style={{flexDirection: 'column',}}><Icon
                        onPress={this.showMenu}
                        name="megaphone"
                        type="Entypo"
                        style={{
                            fontSize: 28,
                            color: "#0A4E52"
                        }}
                    /><Text onPress={this.showMenu}
                        style={{ color: "#0A4E52" }}>{this.state.published ? "Pubished" : "Publish"}</Text></View>}
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
                <PublishersModal event_id={this.props.event_id} onClosed={() => {
                    this.hideMenu()
                    return this.setState({ isPublisherModalOpened: false })
                }
                }
                    isOpen={this.state.isPublisherModalOpened}></PublishersModal>
            </View>
        ) : <ImageActivityIndicator />;
    }
} 