import React, { Component } from "react"
import {
    View, Text, TouchableOpacity
} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import ImageActivityIndicator from "./imageActivityIndicator";
import { Icon, } from "native-base"
import PublishersModal from "../../../PublishersModal"
import stores from '../../../../stores';
import { findIndex } from "lodash"
export default class PublishersView extends Component {
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
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.count !== nextState.count
    }
    componentDidMount() {
        stores.Publishers.getPublishers(this.props.event_id).then(publishers => {
            this.setState({
                count: (publishers && publishers.length > 0) && publishers !== 'empty' ? publishers.length : 0,
                ipublished: findIndex(publishers, { phone: stores.LoginStore.user.phone }) >= 0 ? true : false
            })
            console.warn(this.state.ipublished && this.state.count > 0)
        })
    }
    _menu = null;

    showPublishers = () => {
        return this.props.showPublishers
        //this._menu.hide()

    }
    render() {
        console.warn(this.state.ipublished && this.state.count > 0)
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => requestAnimationFrame(this.props.showPublishers())}>
                    <View style={{ flexDirection: 'row', }}>
                        {this.state.count > 0 ? <Text style={{fontStyle: 'italic',color:"#1FABAB",fontWeight: 'bold',}} note>{"Shared By"}</Text> : null}
                        {this.state.ipublished == true ? <Text style={{ fontWeight: 'bold', color: "#1FABAB" }} note>{"You " + this.state.count > 1 ? "and  " : null}</Text> : null}
                        {this.state.count > 0 ? <Text note>{this.state.ipublished ? this.state.count - 1 : this.state.count}{this.state.ipublished ? " Others" : this.state.count <= 1 ? " Person" : " People"}</Text> : null}
                    </View>
                </TouchableOpacity>
                <PublishersModal event_id={this.props.event_id} onClosed={() => {
                    this.hideMenu()
                    return this.setState({ isPublisherModalOpened: false })
                }
                }
                    isOpen={this.state.isPublisherModalOpened}></PublishersModal>
            </View>
        )
    }
} 