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
            <View style={{ height: 70, width: "100%" }}>
                <View style={{ flexDirection: 'row',justifyContent: 'space-between', marginTop: 10, }}>
                    <TouchableOpacity transparent onPress={() => requestAnimationFrame(() => !this.props.simplyMembers && this.selectContact())}>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', }}>
                             {!this.props.simplyMembers && <View style={{ width: "6%", marginTop: '3.5%', }}>
                                {this.props.mainMaster && this.props.contact.phone !== this.props.creator ? <Icon style={{color:'#1FABAB'}} name={this.state.checked ? "radio-button-checked" :
                                    "radio-button-unchecked"} type="MaterialIcons"></Icon> : null}
                            </View>}
                            <View style={{ width: "80%", color: "#0A4E52" }}>
                                <ProfileView setContact={(con) => {
                                    this.setState({
                                        con: con
                                    })
                                }} delay={this.props.delay} hideMe={() => {
                                    this.setState({
                                        hiden: true
                                    })
                                }} phone={this.props.contact.phone}></ProfileView>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{margin: '2%',}}>
                        <View style={{ flexDirection: 'row',  }}>
                            <Text note style={{
                                marginTop: "12%", marginRight: "10%", fontWeight: this.props.creator === this.props.contact.phone ? 'bold' : "normal", color:
                                    this.props.creator === this.props.contact.phone ? "#54F5CA" : this.props.contact.master ? "#1FABAB" : "gray"
                            }}>{this.props.creator === this.props.contact.phone ? "Creator" : this.props.contact.master ? "Master " : "Member"}</Text><View style={{ alignItems: 'flex-end' }}>
                                {this.props.simplyMembers && <MemberActions
                                    changeMasterState={() => this.changeMasterState()}
                                    creator={this.props.creator}
                                    leaveActivity={this.props.leaveActivity}
                                    currentPhone={this.props.currentPhone}
                                    phone={this.props.contact.phone}
                                    checkActivity={() => this.props.checkActivity(this.props.contact)}
                                    mainMaster={this.props.mainMaster}
                                    master={this.props.contact.master}>
                                </MemberActions>}
                            </View></View>
                    </View>
                </View>
                <MenuDivider color="#1FABAB" />
            </View>
        ) : null

    }
}