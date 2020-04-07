import React, { Component } from "react"
import { View, TouchableWithoutFeedback, Animated } from 'react-native';
import { Text, Icon, Toast } from "native-base"
import stores from '../../../../stores';
import Requester from "../Requester"
import emitter from '../../../../services/eventEmiter';
import request from '../../../../services/requestObjects';
import { findIndex } from 'lodash';
export default class Join extends Component {
    constructor(props) {
        super(props)
        this.state = {
            joint: this.props.joint,
            master: this.props.master
        }
    }
    join() {
        if (this.state.participant) {
            Toast.show({ text: "Joint Already !", buttonText: "ok" })
        } else {
            if (this.props.event.new) {
                stores.Events.markAsSeen(this.props.event.id).then(() => {
                })
            }
            Requester.join(this.props.event.id, this.props.event.event_host).then((status) => {
                this.setState({ participant: true, });
            }).catch((error) => {
                Toast.show({
                    text: 'unable to Perform This Action',
                    buttonText: 'Okay'
                })
            })
        }
    }
    componentDidMount() {
        stores.Events.isParticipant(this.props.event.id, stores.Session.SessionStore.phone).then(status => {
            this.setState({
                participant: status,
                joint: status
            })
            emitter.on(`left_${this.props.event.id}`, () => {
                stores.Events.isParticipant(this.props.event.id, stores.Session.SessionStore.phone).then(status => {
                    this.setState({
                        participant: status,
                        joint: status
                    })
                })
            })
        })
    }
    componentWillReceiveProps(nextProps) {

    }
    render() {
        return (
            <View style={{}}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableWithoutFeedback onPress={() => this.join()} >
                        <View >
                            <Icon
                                name="account-group"
                                type="MaterialCommunityIcons"
                                style={{
                                    color: findIndex(this.props.event.participant, { phone: stores.Session.SessionStore.phone }) >= 0 ? "#54F5CA" : "#bfc6ea",
                                    fontSize: 40
                                }}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    {/*<View style={{ marginTop: 5 }}>
                            <Text style={{ color: this.state.participant ? "#54F5CA" : "#bfc6ea", 
                            fontSize: 15, }} note>{this.state.participant ? " Joint" :" Join"}</Text>
                                </View>*/}
                </View>
            </View>
        )
    }
}