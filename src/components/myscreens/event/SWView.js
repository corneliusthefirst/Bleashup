import React, { Component } from "react";
import { View, Animated, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import UpdateStateIndicator from "../currentevents/components/updateStateIndicator";
import { List, Icon, Label, Card, CardItem, Text, Header, Thumbnail, Title } from 'native-base';
import Image from 'react-native-scalable-image';
import InvitationModal from "../currentevents/components/InvitationModal";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import stores from "../../../stores";
import RouteView from "./RouteView";
import ActionsView from "./ActionsView";
import Commitee from "./Commitee";
const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
const HEADER_MAX_HEIGHT = 160;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
export default class SWView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scrollY: new Animated.Value(0),
        }
    }
    width = "9%"
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
        this.setState({
            openInviteModal: true
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
    actionColor = "#1FABAB"
    fontSize = 18
    textSize = 14
    actionHeight = "14.5%"
    height = "16%"
    original = "#1FABAB"
    transparent = "rgba(52, 52, 52, 0.0)";
    blinkerSize = 26;
    render() {
        return (
            <View>
                <ScrollView style={{ backgroundColor: "#FEFFDE", }} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
                    )}>
                    <View style={{
                        marginTop: HEADER_MAX_HEIGHT,
                        height: "100%", width: "100%", backgroundColor: "#FEFFDE",
                        display: 'flex',flexDirection: 'column',
                    }}>
                        <View style={{ heignt: "60%", display: "flex", flexDirection: 'row', backgroundColor: "#FEFFDE", }}>
                            <View style={{ marginTop: "2%", width: "25%", borderWidth: 2, borderColor: this.actionColor, borderRadius: 12 }}>
                                <ActionsView showMembers={() => this.props.showMembers()}></ActionsView>
                            </View>
                            <View style={{ width: "5%", }}></View>
                            <View style={{ width: "70%" }}>
                                <RouteView currentPage={this.props.currentPage}
                                    setCurrentPage={(page) => this.props.setCurrentPage(page)}></RouteView>
                            </View>
                        </View>
                        <View style={{ marginTop: "10%", height: "100%"}}>
                            <Commitee showSelectableMembers={() => this.props.showSelectableMembers()} event_id={this.props.event.id}></Commitee>
                        </View>
                    </View>
                </ScrollView>
                <Animated.View style={[{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#FEFFDE",
                    overflow: 'hidden',
                }, {
                    height: this.state.scrollY.interpolate({
                        inputRange: [0, HEADER_SCROLL_DISTANCE],
                        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
                        extrapolate: 'clamp',
                    })
                }]}>
                    <View style={{
                        height: "100%",
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}><Image style={{ width: this.props.width, height: 130 }}
                        source={{ uri: this.props.event.background }}></Image>
                    </View>
                </Animated.View>
            </View>
        );
    }
}