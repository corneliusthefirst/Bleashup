import React, { Component } from "react"
import { View, TouchableOpacity, Text } from "react-native"
import MemberActions from "./MemberActions"
import ProfileView from '../invitations/components/ProfileView';
import Menu, { MenuDivider, MenuItem } from 'react-native-material-menu';
import emitter from '../../../services/eventEmiter';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import GState from '../../../stores/globalState/index';
import ColorList from "../../colorList";
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
    margin = { marginBottom: 'auto', marginTop: 'auto', }
    render() {
        return !this.state.hiden ? (
            <View style={{ width: "98%",alignSelf: 'center', }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '1%', marginBottom: '3%', }}>
                    <View style={{ width: '60%' }}>
                        <TouchableOpacity transparent style={{
                            width: '100%', ...this.margin,
                            alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between',
                        }}
                            onPress={() => requestAnimationFrame(() => !this.props.simplyMembers && this.selectContact())}
                        >
                            {!this.props.simplyMembers ? <View style={{ width: "20%",...this.margin }}>
                                {this.props.mainMaster && this.props.contact.phone !== this.props.creator ?
                                    <MaterialIcons style={{ ...GState.defaultIconSize ,color: ColorList.indicatorColor }} name={this.state.checked ? "radio-button-checked" :
                                        "radio-button-unchecked"}/> : null
                                }
                            </View> : null}
                            <View style={{ width: this.props.simplyMembers ? "100%" : "80%", color: ColorList.bodyIcon,...this.margin }}>
                                <ProfileView 
                                searchString={this.props.searchString} 
                                setContact={(con) => {
                                    this.setState({
                                        con: con
                                    })
                                }} 
                                delay={this.props.delay} 
                                hideMe={() => {
                                    this.setState({
                                        hiden: true
                                    })
                                }} phone={this.props.contact.phone}></ProfileView>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ ...this.margin, width: '40%', justifyContent: 'flex-end', }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
                            <Text note style={{
                                ...this.margin, marginRight: "10%", fontWeight: this.props.creator === this.props.contact.phone ? 'bold' : "normal", color:
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