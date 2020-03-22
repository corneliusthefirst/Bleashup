import React, { Component } from "react"
import { View,TouchableOpacity } from "react-native"
import { Button, Icon, Text } from "native-base"
import MemberActions from "./MemberActions"
import ProfileView from '../invitations/components/ProfileView';
import Menu, { MenuDivider, MenuItem } from 'react-native-material-menu';
import emitter from '../../../services/eventEmiter';
export default class SelectableProfileWithOptions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hide: false,
            checked: false,
            contact: this.props.contact
        }
    }
    state = {

    }
    changeMasterState() {
        this.props.changeMasterState({
            phone: this.props.contact.phone,
            master: !this.props.contact.master,
            status: this.props.contact.status ?
                this.props.contact.status : "invited",
            host: this.props.contact.host
        })
    }
    selectContact() {
        this.props.creator !== this.state.contact.phone ? this.state.checked ? this.props.unselected(this.props.contact.phone) : this.props.selected(this.state.contact) : null
        this.setState({
            checked: !this.state.checked
        })

    }
    render() {
        return !this.state.hiden ? (
            <View style={{ heigh: 100, width: "90%" }}>
                <View style={{ flexDirection: 'row', margin: 15, marginBottom: "10%", }}>
                    <TouchableOpacity transparent onPress={() => requestAnimationFrame(() => this.selectContact())}>
                        <View style={{ width: "90%", flexDirection: 'row', alignSelf: 'flex-start', }}>
                             <View style={{ width: "20%", marginTop: "5%", }}>
                                {this.props.mainMaster && this.state.contact.phone !== this.props.creator ? <Icon style={{color:'#1FABAB'}} name={this.state.checked ? "radio-button-checked" :
                                    "radio-button-unchecked"} type="MaterialIcons"></Icon> : null}
                            </View>
                            <View style={{ width: "80%", color: "#0A4E52" }}>
                                <ProfileView setContact={(con) => {
                                    this.setState({
                                        con: con
                                    })
                                }} delay={this.props.delay} hideMe={() => {
                                    this.setState({
                                        hiden: true
                                    })
                                }} phone={this.state.contact.phone}></ProfileView>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <View style={{ flexDirection: 'row', marginRight: "5%", }}>
                            <Text note style={{
                                marginTop: "12%", marginRight: "10%", fontWeight: this.props.creator === this.state.contact.phone ? 'bold' : "normal", color:
                                    this.props.creator === this.state.contact.phone ? "#54F5CA" : this.props.contact.master ? "#1FABAB" : "gray"
                            }}>{this.props.creator === this.state.contact.phone ? "Creator" : this.state.contact.master ? "Master " : "Member"}</Text><View style={{ alignItems: 'flex-end' }}>
                                <MemberActions
                                    changeMasterState={() => this.changeMasterState()}
                                    creator={this.props.creator}
                                    phone={this.state.contact.phone}
                                    checkActivity={() => this.props.checkActivity(this.state.con)}
                                    mainMaster={this.props.mainMaster}
                                    master={this.state.contact.master}>
                                </MemberActions>
                            </View></View>
                    </View>
                </View>
                <MenuDivider color="#1FABAB" />
            </View>
        ) : null

    }
}