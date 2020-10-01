import React, { Component } from 'react';
import { View, TouchableHighlight, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import ProfileView from '../invitations/components/ProfileView';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GState from '../../../stores/globalState';
import ColorList from '../../colorList';
import Texts from '../../../meta/text';

export default class SelectableContactsMaster extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false,
            hiden: false,
            masterchecked: false
        }
    }
    componentDidMount() {
        //console.warn(this.props.contact)
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.checked !== nextProps.checked ||
            this.props.searchString !== nextProps.searchString ||
            this.props.masterchecked !== nextProps.masterchecked
    }
    state = {}
    selectContact() {
        this.props.checked && this.props.masterchecked ? this.props.toggleMaster(this.props.contact.phone) : null
        this.props.checked ? this.props.unselected(this.props.contact.phone) :
            this.props.selected({ phone: this.props.contact.phone, master: false, host: this.props.contact.host, status: "invited" })
        //this.setState({
        //    checked: !this.props.checked,
        //   masterchecked: this.props.checked && this.props.masterchecked ? !this.props.masterchecked : this.masterchecked
        //  })
    }
    setMaster() {
        //this.props.checked && this.props.masterchecked ? this.props.unselected(this.props.contact.phone) : null
        this.props.master ? !this.props.checked && !this.props.masterchecked ? this.props.selected({
            phone: this.props.contact.phone,
            master: true, host: this.props.contact.host, status: "invited"
        }) :
            this.props.toggleMaster(this.props.contact.phone) : null
        this.props.master ? this.setState({
            masterchecked: !this.props.masterchecked,
            checked: (!this.props.checked && !this.props.masterchecked) ? !this.props.checked : this.props.checked
        }) : null
    }
    margin = { marginTop: 'auto', marginBottom: 'auto', }
    render() {
        return !this.state.hiden ? (
            <View style={{ flexDirection: 'column', margin: '2%', }}>
                <TouchableOpacity transparent onPress={() => requestAnimationFrame(() => this.selectContact())}>
                    <View style={{ width: "90%", flexDirection: 'row', alignSelf: 'flex-start', }}>
                        <View style={{ width: "20%", ...this.margin }}>
                            <MaterialIcons style={{ ...GState.defaultIconSize }} name={this.props.checked ? "radio-button-checked" :
                                "radio-button-unchecked"} type="MaterialIcons" />
                        </View>
                        <View style={{ width: "80%", color: "#0A4E52", ...this.margin }}>
                            <ProfileView searchString={this.props.searchString} delay={this.props.delay} hideMe={() => {
                                this.setState({
                                    hiden: true
                                })
                            }} phone={this.props.contact.phone}></ProfileView>
                        </View>
                    </View>
                </TouchableOpacity>
                <View>
                    <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'flex-end', }}>
                        <TouchableOpacity onPress={() => requestAnimationFrame(() => this.setMaster())} transparent>
                            <View>
                                <View style={{
                                    alignSelf: 'flex-end',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <MaterialIcons style={{ ...GState.defaultIconSize, color: ColorList.indicatorColor }} name={this.props.masterchecked ? "radio-button-checked" :
                                        "radio-button-unchecked"} type="MaterialIcons" />
                                    <Text style={{
                                        fontStyle: 'italic',
                                        fontWeight: 'bold', color: ColorList.indicatorColor, marginTop: "3%"
                                    }}>{Texts.masters}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <MenuDivider color="#1FABAB" />
            </View>
        ) : null
    };
} 