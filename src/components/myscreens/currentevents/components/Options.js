import React, { Component } from "react"
import { View, TouchableOpacity } from 'react-native';
import { Icon, Label, Toast, Text } from "native-base"
import { observer } from 'mobx-react';
import autobind from "autobind-decorator";
import UpdateStateIndicator from "./updateStateIndicator";
import stores from "../../../../stores";

export default class Options extends Component {
    constructor(props) {
        super(props)
    }
    @autobind navigateToContributions() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: "Contributions"
                });
            } else {
                Toast.show({
                    text: "please join the event to see the updates about !",
                    buttonText: "ok"
                })
            }
            this.props.seen()
        })
    }
    blinkerSize = 26;
    transparent = "rgba(52, 52, 52, 0.0)";
    indicatorMargin = {
        marginLeft: "5%",
        marginTop: "-7%",
        position: 'absolute',

    };
    others = {
        alignSelf: 'center',
    }

    width = "50%"
    @autobind navigateToHighLights() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then((status) => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: "Highlights"
                });
            } else {
                Toast.show({
                    text: "please join the event to see the updates about !",
                    buttonText: "ok"
                })
            }
            this.props.seen()
        })
    }

    @autobind navigateToEventDetails() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: "EventDetails"
                });
            } else {
                this.setState({ isDetailsModalOpened: true })
            }
            this.props.seen()
        })
    }
    @autobind navigateToReminds() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: "Reminds"
                });
            } else {
                Toast.show({
                    text: "please join the event to see the updates about !",
                    buttonText: "ok"
                })
            }
            this.props.seen()
        })
    }
    @autobind navigateToEventChat() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: "EventChat"
                });
            } else {
                Toast.show({
                    text: "please join the event to see the updates about !",
                    buttonText: "ok"
                })
            }
            this.props.seen()
        })
    }
    @autobind navigateToVotes() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then((status) => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: "Votes"
                });
            } else {
                Toast.show({
                    text: "please join the event to see the updates about !",
                    buttonText: "ok"
                })
            }
            this.props.seen()
        })
    }
    render() {
        return (

            <View style={{
                flexDirection: "row",
                width: '100%',
                height: "100%",
            }}>
                <TouchableOpacity style={{ width: "50%", height: "100%", justifyContent: "center" }} onPress={() => requestAnimationFrame(() => this.navigateToReminds())}>

                    <View style={{ alignSelf: 'flex-end', }}>
                        <Text style={{
                            color: "#1FABAB",
                            fontSize: 17, fontStyle: 'italic',
                            fontWeight: 'bold',
                            alignSelf: 'center',
                        }} note>reminds</Text>

                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ width: "50%", height: "100%", justifyContent: "center", }} onPress={() => requestAnimationFrame(() => this.navigateToEventChat())} >
                    <View style={{ alignSelf: "flex-end" }}>
                        <Label style={{
                            marginLeft: "-13%",
                            fontSize: 17, fontStyle: 'italic',
                            alignSelf: 'center',
                            fontWeight: 'bold',
                            color: "#1FABAB"
                        }}>chats</Label>
                    </View>
                </TouchableOpacity>


            </View>
        )
    }
}





























































/**
 *                <View
                    style={{
                        width: this.width
                    }}
                  >
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.navigateToVotes())}>
                        <View style={this.others}>
                            <Icon type="FontAwesome5" name="poll" style={
                                {
                                    color: "#1FABAB",
                                    marginLeft: "2%",
                                }
                            }></Icon>
                            <Label style={{ color: "#1FABAB", fontSize: 12, fontStyle: 'italic' }}>Votes</Label>
                            {this.props.Event.vote_updated ? (
                                <View style={this.indicatorMargin}>
                                    <UpdateStateIndicator size={this.blinkerSize} />
                                </View>
                            ) : (
                                    <View style={this.indicatorMargin}>
                                        <UpdateStateIndicator
                                            size={this.blinkerSize}
                                            color={this.transparent}
                                        />
                                    </View>
                                )}
                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: this.width
                    }}
                >
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.navigateToContributions())}>
                        <View style={this.others}>
                            <Icon type="MaterialIcons" name="monetization-on" style={
                                {
                                    marginLeft: "30%",
                                    color: "#1FABAB"
                                }
                            }></Icon>
                            <Label style={{
                                color: "#1FABAB",
                                fontSize: 12, fontStyle: 'italic'
                            }}>Contributions</Label>
                            {this.props.Event.contribution_updated ? (
                                <View style={this.indicatorMargin}>
                                    <UpdateStateIndicator size={this.blinkerSize} />
                                </View>
                            ) : (
                                    <View style={this.indicatorMargin}>
                                        <UpdateStateIndicator
                                            size={this.blinkerSize}
                                            color={this.transparent}
                                        />
                                    </View>
                                )}
                        </View>
                    </TouchableOpacity>
                </View>
                            */
