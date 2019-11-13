import React, { Component } from "react";
import { View } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import UpdateStateIndicator from "./updateStateIndicator";
import { List, ListItem, Icon, Label } from 'native-base';
import InvitationModal from "./InvitationModal";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import stores from "../../../../stores";

export default class SwipeOutView extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    width = "11.25%"
    padding = "9%"
    indicatorMargin = {
        marginLeft: "5%",
        marginTop: "-7%",
        position: 'absolute',

    };

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
    @autobind navigateToLogs() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("ChangeLogs", { ...this.props })
            } else {
                this.setState({ isDetailsModalOpened: true })
            }
            this.props.seen()
        })
    }
    invite() {
        this.props.openInvitationModal()
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
    transparent = "rgba(52, 52, 52, 0.0)";
    blinkerSize = 26;
    render() {
        return (
            <View style={{ width: "100%", backgroundColor: 'white',  borderRadius: 10, borderLeftColor: "#7DD2D2", }}>
                <View style={{ display: 'flex', flexDirection: 'column', marginLeft: "30%", }}>
                    <View style={{ height: this.width, marginBottom: "10%", alignSelf: 'flex-start' }}>
                        <TouchableOpacity onPress={() => {
                            this.props.publish()
                        }}>
                            <Icon style={{ fontSize: 20, color: this.props.Event.public || this.props.master ? "#7DD2D2" : "#bfc6ea" }} name="megaphone" type="Entypo">
                            </Icon>
                            <Label style={{ fontSize: 12, color: this.props.Event.public || this.props.master ? "#7DD2D2" : "#bfc6ea" }}>Publish</Label>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: this.width, marginBottom: "10%", alignSelf: 'flex-start' }}>
                        {<TouchableOpacity onPress={() => {
                            this.invite()
                        }}>
                            <Icon style={{ fontSize: 20, color: this.props.master ? "#7DD2D2" : "#bfc6ea" }} name="sc-telegram" type="EvilIcons">
                            </Icon>
                            <Label style={{ fontSize: 14, color: this.props.master ? "#7DD2D2" : "#bfc6ea" }}>Invite</Label>
                        </TouchableOpacity>}
                    </View>
                    <View style={{ height: this.width, marginBottom: "10%" }}>
                        {<TouchableOpacity onPress={() => {
                            this.props.join()
                        }}>
                            <Icon style={{ fontSize: 20, color: this.props.Event.joint ? "#7DD2D2" : "#bfc6ea" }} name="account-group"
                                type="MaterialCommunityIcons">
                            </Icon>
                            <Label style={{
                                color: this.props.Event.joint ? "#7DD2D2" : "#bfc6ea",
                                fontSize: 14
                            }}
                            >
                                Join
              </Label>
                        </TouchableOpacity>}

                    </View>
                    <View style={{ height: this.width, marginBottom: "10%", alignSelf: 'flex-start' }}>
                        <TouchableOpacity onPress={() => {
                            this.navigateToEventDetails()
                        }}>
                            <Icon style={{ fontSize: 20, color: "#1FABAB" }} name="calendar" type="EvilIcons">
                            </Icon>
                            {this.props.Event.updated ? (
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
                            <Label style={{ fontSize: 14, color: "#1FABAB" }}>Detail</Label>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: this.width, marginBottom: "10%", alignSelf: 'flex-start' }}>
                        <TouchableOpacity onPress={() => {
                            this.navigateToEventChat()
                        }}>
                            <Icon style={{ fontSize: 20, color: "#1FABAB" }} name="comment" type="EvilIcons">
                            </Icon>
                            {this.props.Event.chat_upated ? (
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
                            <Label style={{ fontSize: 14, color: "#1FABAB" }}>chat</Label>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: this.width, marginBottom: "10%", alignSelf: 'flex-start' }}>
                        <TouchableOpacity onPress={() => {
                            this.navigateToLogs()
                        }}>
                            <Icon style={{ fontSize: 20, color: "#1FABAB" }} name="exclamation" type="EvilIcons">
                            </Icon>
                            {this.props.Event.upated ? (
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
                            <Label style={{ fontSize: 14, color: "#1FABAB" }}>Logs</Label>
                        </TouchableOpacity>
                    </View >
                    <View style={{ height: this.width, marginBottom: "10%", alignSelf: 'flex-start' }}>
                        <TouchableOpacity onPress={() => {
                            return this.props.hide()
                        }}>
                            <Icon style={{ fontSize: 20, color: "#1FABAB" }} name="archive" type="EvilIcons">
                            </Icon>
                            <Label style={{ fontSize: 14, color: "#1FABAB" }}>Hide</Label>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: this.width, marginBottom: "10%", }}>
                        <TouchableOpacity onPress={() => {
                            return this.props.delete()
                        }}>
                            <Icon name="trash" style={{ fontSize: 20, color: "red" }} type="EvilIcons">
                            </Icon>
                            <Label style={{ fontSize: 14, color: "red" }} >Delete</Label>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}