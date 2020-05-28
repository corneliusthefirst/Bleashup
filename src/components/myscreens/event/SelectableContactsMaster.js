import React, { Component } from 'react';
import { View, TouchableHighlight } from 'react-native';
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import ProfileView from '../invitations/components/ProfileView';
import { Icon, Text, Button } from 'native-base';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

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
    margin={marginTop: 'auto',marginBottom: 'auto',}
    render() {
        return !this.state.hiden ? (
            <View style={{ flexDirection: 'column', margin: '2%', }}>
                <Button transparent onPress={() => requestAnimationFrame(() => this.selectContact())}>
                    <View style={{ width: "90%", flexDirection: 'row', alignSelf: 'flex-start', }}>
                        <View style={{ width: "20%", ...this.margin }}>
                            <Icon name={this.props.checked ? "radio-button-checked" :
                                "radio-button-unchecked"} type="MaterialIcons"></Icon>
                        </View>
                        <View style={{ width: "80%", color: "#0A4E52",...this.margin }}>
                            <ProfileView delay={this.props.delay} hideMe={() => {
                                this.setState({
                                    hiden: true
                                })
                            }} phone={this.props.contact.phone}></ProfileView>
                        </View>
                    </View>
                </Button>
                <View>
                    <View style={{ alignItems: 'flex-end', marginLeft: "60%", }}>
                        <Button onPress={() => requestAnimationFrame(() => this.setMaster())} transparent>
                            <View>
                                <View style={{ width: "90%", alignSelf: 'flex-end', flexDirection: 'row', }}>
                                    <Icon name={this.props.masterchecked ? "radio-button-checked" :
                                        "radio-button-unchecked"} type="MaterialIcons"></Icon>
                                    <Text style={{
                                        fontStyle: 'italic',
                                        fontWeight: 'bold', color: "#0A4E52", marginTop: "3%"
                                    }}>master</Text>
                                </View>
                            </View>
                        </Button>
                    </View>
                </View>
                <MenuDivider color="#1FABAB" />
            </View>
        ) : null
    };
} 