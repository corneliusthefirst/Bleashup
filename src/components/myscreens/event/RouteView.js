import React, { Component } from "react"
import { TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Card, CardItem, Text, Icon } from 'native-base';
import GState from '../../../stores/globalState';
import emitter from '../../../services/eventEmiter';
import firebase from 'react-native-firebase';
import stores from '../../../stores';
import { Badge } from "native-base"
export default class RouteView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newMessagesCount: 0,
            updating: false
        }
    }
    state = {
        updating: false
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.updating !== nextState.updating ||
            this.props.currentPage !== nextProps.currentPage ||
            this.props.master !== nextProps.master
    }
    actionColor = "#1FABAB"
    fontSize = 18
    textSize = 14
    actionHeight = "14.5%"
    height = "16%"
    original = "#1FABAB"
    previous = this.props.event_id
    // This function resetSelectedCommitee will emite an event to the currently listening commiteeItem to adjust its highlightColor
    // because the selected tab has changed
    resetSelectedCommitee() {
        if (GState.currentCommitee !== null) {
            this.previous = GState.currentCommitee
            GState.currentCommitee = null;
            emitter.emit("current_commitee_changed", this.previous)
        } else {
            emitter.emit("current_commitee_changed", this.previous)
        }
    }
    resetCommiteeForGeneral() {
        GState.currentCommitee = this.previous;
        emitter.emit("current_commitee_changed_by_main", this.previous)
        this.setState({
            newMessagesCount: 0,
            updating: !this.state.updating
        })
    }
    componentDidMount() {
        let phone = stores.LoginStore.user.phone.replace("00", "+");
        firebase.database().ref(`new_message/${phone}/${this.props.event_id}/new_messages`).once('value', snapshoot => {
            GState.generalNewMessages = snapshoot.val() !== null ? snapshoot.val() : []
            this.setState({
                updating: !this.state.updating
            })
            if (this.props.currentPage !== "EventChat") {
                this.resetSelectedCommitee()
            } else {
                this.resetCommiteeForGeneral()
            }
        })
    };

    render() {
        if (this.props.currentPage == "EventChat") GState.generalNewMessages = []
        return (
            <Card style={{ height: 300, width: 200, }} transparent>
                <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "EventDetails" ? "#54F5CA" : "#FEFFDE",
                    width: "100%", borderTopLeftRadius: 12, borderTopWidth: 2, borderLeftWidth: 2, borderTopColor: "#1FABAB", borderLeftColor: "#1FABAB",
                }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("EventDetails")
                        this.resetSelectedCommitee()
                    }
                    )}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Icon type="AntDesign" style={{ color: this.original }} name="appstore1"></Icon>
                            <Text style={{ padding: "1%", }}>Activity Details</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{ height: this.height, backgroundColor: this.props.currentPage == "ChangeLogs" ? "#54F5CA" : "#FEFFDE", borderLeftColor: "#1FABAB", borderLeftWidth: 2, }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("ChangeLogs")
                        this.resetSelectedCommitee()
                    }
                    )}>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <Icon type="Entypo" style={{ color: this.original }} name="clock"></Icon>
                            <Text style={{ padding: "1%", }}>History Logs</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "EventChat" ? "#54F5CA" : "#FEFFDE",
                    borderLeftColor: "#1FABAB", borderLeftWidth: 2,
                }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("EventChat")
                        this.resetCommiteeForGeneral()
                    })
                    }>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <View style={{ width: "85%", display: 'flex', flexDirection: 'row', }}><Icon type="FontAwesome" style={{ color: this.original }} name="group"></Icon>
                                <Text style={{ padding: "1%", }}>Discusion</Text></View>
                            {GState.generalNewMessages.length > 0 ? <Badge primary><Text style={{ marginTop: "30%", }}>{GState.generalNewMessages.length}</Text></Badge> : null}
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{ height: this.height, backgroundColor: this.props.currentPage == "Highlights" ? "#54F5CA" : "#FEFFDE", borderLeftColor: "#1FABAB", borderLeftWidth: 2, }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("Highlights")
                        this.resetSelectedCommitee()
                    })}>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <Icon type="AntDesign" style={{ color: this.original }} name="star"></Icon>
                            <Text style={{ padding: "1%" }}>HighLights</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "Reminds" ? "#54F5CA" : "#FEFFDE",
                    borderLeftColor: "#1FABAB", borderLeftWidth: 2
                }} >
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("Reminds")
                        this.resetSelectedCommitee()
                    })}>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <Icon type="Entypo" style={{ color: this.original }} name="bell"></Icon>
                            <Text style={{ padding: "1%" }}>Reminds/Tasks</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{
                    height: this.height, borderLeftColor: "#1FABAB", borderLeftWidth: 2,
                    backgroundColor: this.props.currentPage == "Votes" ? "#54F5CA" : "#FEFFDE", width: "100%"
                }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("Votes")
                        this.resetSelectedCommitee()
                    })}>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <Icon type="FontAwesome5" style={{ color: this.original }} name="poll"></Icon>
                            <Text style={{ padding: "1%", }}>Polls/Votes</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "Contributions" ? "#54F5CA" : "#FEFFDE",
                    borderBottomColor: "#1FABAB", borderBottomWidth: 2, borderBottomLeftRadius: 12, borderLeftColor: "#1FABAB",
                    borderLeftWidth: 2,
                }}>
                    <TouchableWithoutFeedback onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("Contributions")
                        this.resetSelectedCommitee()
                    })}>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <Icon type="MaterialIcons" style={{ color: this.original }} name="monetization-on"></Icon>
                            <Text style={{ padding: "1%", }}>Contributions</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </CardItem>
            </Card>
        )
    }
} 