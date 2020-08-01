import React, { Component } from "react"
import { View, TouchableWithoutFeedback, Animated, Dimensions, Text} from 'react-native';
import stores from '../../../../stores';
import Requester from "../Requester"
import emitter from '../../../../services/eventEmiter';
import request from '../../../../services/requestObjects';
import { findIndex } from 'lodash';
import Toaster from "../../../../services/Toaster";

let {height, width} = Dimensions.get('window');
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
            Toaster({ text: "Joint Already !", buttonText: "ok" })
        } else {
            if (this.props.event.new) {
                stores.Events.markAsSeen(this.props.event.id).then(() => {
                })
            }
            Requester.join(this.props.event.id, this.props.event.event_host).then((status) => {
                this.setState({ participant: true, });
            }).catch((error) => {
                Toaster({
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
    joinImage1 = require("../../../../../assets/join3.png")
    joinImage2 = require("../../../../../assets/join1.png")
    render() {
        return (
            
                <View style={{ alignItem:"flex-start" ,alignItem:"center",justifyContent:"center"}}>
                    <TouchableWithoutFeedback onPress={() => this.join()} >
                        <View>
                         {findIndex(this.props.event.participant, { phone: stores.Session.SessionStore.phone }) >= 0 ?
                         <Image resizeMode={"cover"} source={this.joinImage1} 
                         style={{height:height/15,width:70}}></Image>
                         :<Image resizeMode={"cover"} source={this.joinImage2} style={{height:height/15,width:70}}></Image>}   
                        </View>
                    </TouchableWithoutFeedback>

                </View>
        )
    }
}
