import React,{Component} from "react"
import { View,TouchableOpacity } from 'react-native';
import {Icon,Label} from "native-base"
import { observer } from 'mobx-react';
import autobind from "autobind-decorator";
import UpdateStateIndicator from "./updateStateIndicator";
import stores from "../../../../stores";

@observer export default class Options extends Component {
    constructor(props){
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
        marginLeft: "5%",
        marginTop: "-7%",
    }
    svgStyle = {
    }
    width="17.75%"
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
    render(){
        return(
            <View style={{
                flexDirection: "row"
            }}>
                <View
                    style={{
                        width: this.width
                    }}
                >
                    <TouchableOpacity onPress={this.navigateToEventDetails}>
                        <View style={this.svgStyle}>
                            <Icon type="EvilIcons" name="calendar" style={
                                {
                                    color: "#1FABAB"
                                }
                            }></Icon>
                            <Label style={{
                                marginLeft: "-8%"
                            }}>details</Label>
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
                        </View>
                    </TouchableOpacity>
                </View>
                <View   style={{
                    width: this.width
                }}>
                <TouchableOpacity onPress={this.navigateToReminds}>
                    <View style={this.svgStyle}>
                        <Icon type="EvilIcons" name="bell" style={
                            {
                                color: "#1FABAB"
                            }
                        }></Icon>
                        <Label style={{
                            marginLeft: "-20%"
                        }} > reminds</Label>
                        {this.props.Event.remind_upated ? (
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
                <TouchableOpacity onPress={this.navigateToEventChat}>
                    <View style={this.svgStyle}>
                        <Icon name="comment" type="EvilIcons" style={
                            {
                                color: "#1FABAB"
                            }
                        }></Icon>
                        <Label style={{
                            marginLeft: "-5%"
                        }}>chats</Label>
                        {this.props.Event.chat_updated ? (
                            <View style={this.indicatorMargin}>
                                <UpdateStateIndicator size={22} />
                            </View>
                        ) : (
                                <View style={this.indicatorMargin}>
                                    <UpdateStateIndicator
                                        size={this.blinkerSize}
                                        color={this.transparent}
                                    />
                                </View>
                            )}
                    </View >
                </TouchableOpacity>
            </View>
            <View
                style={{
                    width: this.width
                }}
            >
                <TouchableOpacity onPress={this.navigateToHighLights}>
                    <View style={this.svgStyle}>
                        <Icon name="star" type="EvilIcons" style={
                            {
                                color: "#1FABAB"
                            }
                        }></Icon>
                        <Label style={{
                            marginLeft: "-12%"
                        }} >highlts</Label>
                        {this.props.Event.highlight_updated ? (
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
                <TouchableOpacity onPress={this.navigateToVotes}>
                    <View style={this.others}>
                        <Icon type="AntDesign" name="totop" style={
                            {
                                color: "#1FABAB"
                            }
                        }></Icon>
                        <Label>votes</Label>
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
                <TouchableOpacity onPress={this.navigateToContributions}>
                    <View style={this.others}>
                        <Icon type="Foundation" name="dollar" style={
                            {
                                color: "#1FABAB"
                            }
                        }></Icon>
                        <Label style={{
                            marginLeft: "-17%"
                        }}>contrbs</Label>
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
            </View>
        )
    }
}