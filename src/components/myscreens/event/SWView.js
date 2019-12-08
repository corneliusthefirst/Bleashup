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
import moment from "moment";
const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
const HEADER_MAX_HEIGHT = 140;
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
    displayDate(date) {
        let statDate = moment(date)
        let end = moment()
        let daysDiff = Math.floor(moment.duration(end.diff(statDate)).asDays())
        if (daysDiff == 0) {
            return "OnGoing Today from " + moment(date).format("h:mm a");
        } else if (daysDiff == 1) {
            return "Past Since Yesterday at " + moment(date).format("h:mm a")
        } else if (daysDiff > 1 && daysDiff < 7) {
            return `Past Since ${Math.abs(daysDiff)} Days Ago at ` + moment(date).format("h:mm a")
        } else if (daysDiff == 7) {
            return "Past Since 1 Week Ago at " + moment(date).format("h:mm a")
        } else if (daysDiff == -1) {
            return "Upcoming Tomorrow at" + moment(date).format("h:mm a");
        }
        else if (daysDiff < -1) {
            return `Upcoming in ${Math.abs(daysDiff)} Days at ` + moment(date).format("h:mm a");
        } else {
            return `Past since ${moment(date).format("dddd, MMMM Do YYYY")} at ${moment(date).format("h:mm a")}`
        }
    }
    dateDiff(date) {
        let statDate = moment(date)
        let end = moment()
        return daysDiff = Math.floor(moment.duration(end.diff(statDate)).asDays())
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
    refreshCommitees() {
        this.refs.Commitee.refreshCommitees()
    }
    render() {
        return (
            <TouchableWithoutFeedback onPressIn={() => {
                this.setState({
                    canScroll: true
                })
            }}>
                <View>
                    <ScrollView
                        style={{ backgroundColor: "#FEFFDE", }}
                        //scrollEnabled={true}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
                        )}>
                        <View style={{
                            marginTop: HEADER_MAX_HEIGHT,
                            height: "100%", width: "100%", backgroundColor: "#FEFFDE",
                            display: 'flex', flexDirection: 'column', //borderRightWidth: 1.25, borderColor: "#1FABAB",
                        }}>
                            <View style={{ marginLeft: 5, backgroundColor: "#FEFFDE", width: "100%", height: 44, }}><Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 2 }}>{this.props.event.about.title}</Text>
                                <Text style={{ alignSelf: 'flex-end', marginRight: "2%", fontStyle: 'italic',fontWeight: this.props.event.closed?"bold":"400", color: this.props.event.closed ? "red" : this.dateDiff(this.props.event.period) > 0 ? "gray" : "#54F5CA", fontSize: 14, }}>{this.props.event.closed ? "Closed" : this.displayDate(this.props.event.period)}</Text>

                            </View>
                            <View style={{ heignt: "60%", display: "flex", flexDirection: 'row', backgroundColor: "#FEFFDE", marginLeft: "1%", }}>
                                <View style={{ marginTop: "2%", width: "25%", borderWidth: 2, borderColor: this.actionColor, borderRadius: 12 }}>
                                    <ActionsView
                                        publish={() => this.props.publish()}
                                        leaveActivity={() => this.props.leaveActivity()}
                                        inviteContacts={() => this.props.inviteContacts()}
                                        openSettingsModal={() => this.props.openSettingsModal()}
                                        ShowMyActivity={(a) => this.props.ShowMyActivity(a)}
                                        showMembers={() => this.props.showMembers()}></ActionsView>
                                </View>
                                <View style={{ width: "5%", }}></View>
                                <View style={{ width: "70%" }}>
                                    <RouteView refreshCommitee={() => this.refreshCommitees()} event_id={this.props.event.id} currentPage={this.props.currentPage}
                                        setCurrentPage={(page) => this.props.setCurrentPage(page)}></RouteView>
                                </View>
                            </View>
                            <View style={{ marginTop: "10%", height: 300, }}>
                                <Commitee
                                    master={this.props.master}
                                    ref="Commitee"
                                    participant={this.props.event.participant}
                                    creator={this.props.creator}
                                    join={(id) => { this.props.join(id) }}
                                    showCreateCommiteeModal={() => this.props.showCreateCommiteeModal()}
                                    leave={(id) => { this.props.leave(id) }}
                                    removeMember={(id, members) => { this.props.removeMember(id, members) }}
                                    addMembers={(id, currentMembers) => { this.props.addMembers(id, currentMembers) }}
                                    publishCommitee={(id, state) => { this.props.publishCommitee(id, state) }}
                                    editName={(newName, id) => this.props.editName(newName, id)}
                                    swapChats={(commitee) => { this.props.swapChats(commitee) }} phone={this.props.phone}
                                    commitees={this.props.commitees}
                                    event_id={this.props.event.id}></Commitee>
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
                        }}><TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.showActivityPhotoAction())}><Image style={{ width: this.props.width, height: 130 }}
                                source={this.props.event.bacground ? { uri: this.props.event.background } : 
                            require('../../../../assets/default_event_image.jpeg')}></Image></TouchableOpacity>
                        </View>
                    </Animated.View>
                </View></TouchableWithoutFeedback>
        );
    }
}