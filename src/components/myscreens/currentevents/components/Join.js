import React, { Component } from "react"
import { View, TouchableWithoutFeedback, Animated } from 'react-native';
import { Text, Icon, Toast } from "native-base"
import stores from '../../../../stores';
import Requester from "../Requester"
import { observer } from "mobx-react";

@observer export default class Join extends Component {
    constructor(props) {
        super(props)
        this.state = {
            joint: this.props.joint,
            master: this.props.master
        }
    }
    join() {
        if(this.state.participant){
            Toast.show({text:"Joint Already !", buttonText:"ok"})
        }else{
            if (this.props.Event.new) {
                stores.Events.markAsSeen(this.props.event.id).then(() => {
                })
            }
            Requester.join(this.props.event.id, this.props.event.event_host).then((status) => {
                this.setState({ participant: true, });
                Toast.show({ text: "Event Successfully Joint !", type: "success", buttonText: "ok" })
            }).catch((error) => {
                Toast.show({
                    text: 'unable to connect to the server ',
                    buttonText: 'Okay'
                })
            })
        }
    }
    componentDidMount() {
        stores.Events.isParticipant(this.props.event.id, stores.Session.SessionStore.phone).then(status => {
            this.setState({
                participant : status,
                joint : status
            })
        })
    }
    componentWillReceiveProps(nextProps) {

    }
    render() {
        return (
            <View style={{ padding: "-5%", marginLeft: "-25%" }}>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableWithoutFeedback onPress={() => this.join()} >
                            <View >
                                <Icon
                                    name="universal-access"
                                    type="Foundation"
                                    style={{
                                        color: this.state.participant ? "#54F5CA" : "#bfc6ea",
                                        fontSize: 23
                                    }}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{ marginTop: 1 }}>
                            <Text style={{ color: this.state.participant ? "#54F5CA" : "#bfc6ea", 
                            fontSize: 15, }} note>{this.state.participant ? "joint" :"join"}</Text>
                        </View>
                    </View>
            </View>
        )
    }
}