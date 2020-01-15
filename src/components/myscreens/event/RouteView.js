import React, { Component } from "react"
import { TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Card, CardItem, Text, Icon } from 'native-base';
import GState from '../../../stores/globalState';
import emitter from '../../../services/eventEmiter';
import firebase from 'react-native-firebase';
import stores from '../../../stores';
import { Badge } from "native-base"
import { MenuDivider } from 'react-native-material-menu';
import shadower from "../../shadower";
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
            GState.previousCommitee = GState.currentCommitee
            GState.currentCommitee = null;
            emitter.emit("current_commitee_changed", GState.previousCommitee)
        } else {
            emitter.emit("current_commitee_changed", GState.previousCommitee)
        }
    }
    resetCommiteeForGeneral() {
        GState.currentCommitee = GState.previousCommitee;
        emitter.emit("current_commitee_changed_by_main", GState.previousCommitee)
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
            <Card style={{ height: 300, width:"100%",marginTop: "20%", }} transparent >
                <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "EventDetails" ? "#54F5CA" : "#FEFFDE",
                    width: "100%", borderTopLeftRadius: 12, ...shadower(3)
                }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("EventDetails")
                        this.resetSelectedCommitee()
                    }
                    )}>
                        <View style={{ display: 'flex', flexDirection: 'row', width: "100%"}}>
                            <Icon type="AntDesign" style={{ color: this.props.currentPage == "EventDetails" ? "#0A4E52" :  this.original }} name="appstore1"></Icon>
                            <Text style={{ padding: "1%", color: this.props.currentPage == "EventDetails" ? "#0A4E52":"gray", width: "100%" }}>Activity Details</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "ChangeLogs" ? "#54F5CA" : "#FEFFDE", ...shadower(3) }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("ChangeLogs")
                        this.resetSelectedCommitee()
                    }
                    )}>
                        <View style={{ display: 'flex', flexDirection: 'row', width: "100%"}}>
                            <Icon type="Entypo" style={{ color: this.props.currentPage == "ChangeLogs" ? "#0A4E52" : this.original }} name="clock"></Icon>
                            <Text style={{ padding: "1%", color: this.props.currentPage == "ChangeLogs" ? "#0A4E52" : "gray", width: "100%"}}>History Logs</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
               <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "EventChat" ? "#54F5CA" : "#FEFFDE",
                    ...shadower(3)
                }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("EventChat")
                        this.resetCommiteeForGeneral()
                    })
                    }>
                        <View style={{ display: 'flex', flexDirection: 'row', width: "100%"}}>
                            <View style={{ width: "85%", display: 'flex', flexDirection: 'row', }}><Icon type="FontAwesome" style={{ color: this.props.currentPage == "EventChat" ? "#0A4E52" : this.original }} name="group"></Icon>
                                <Text style={{ padding: "1%", color: this.props.currentPage == "EventChat" ? "#0A4E52" : "gray", width: "100%" }}>Discusion</Text></View>
                            {GState.generalNewMessages.length > 0 ? <Badge primary><Text style={{ marginTop: "30%", }}>{GState.generalNewMessages.length}</Text></Badge> : <View></View>}
                        </View>
                    </TouchableOpacity>
                </CardItem>
                {/*<CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "Highlights" ? "#54F5CA" : "#FEFFDE", shadowOpacity: 1,
                    shadowOffset: {
                        height: 1,
                    },
                    shadowRadius: 10, elevation: 6 }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("Highlights")
                        this.resetSelectedCommitee()
                    })}>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <Icon type="AntDesign" style={{ color: this.props.currentPage == "Highlights" ? "#0A4E52" : this.original }} name="star"></Icon>
                            <Text style={{ padding: "1%", fontWeight: this.props.currentPage == "Highlights" ? "bold" : 'bold', }}>HighLights</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>*/}
                <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "Reminds" ? "#54F5CA" : "#FEFFDE",
                    ...shadower(3)
                }} >
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("Reminds")
                        this.resetSelectedCommitee()
                    })}>
                        <View style={{ display: 'flex', flexDirection: 'row', width:"100%"}}>
                            <Icon type="Entypo" style={{ color: this.props.currentPage == "Reminds" ? "#0A4E52" : this.original }} name="bell"></Icon>
                            <Text style={{ padding: "1%", color: this.props.currentPage == "Reminds" ? "#0A4E52" : "gray", width: "100%" }}>Reminds/Tasks</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{
                    height: this.height, ...shadower(3),
                    backgroundColor: this.props.currentPage == "Votes" ? "#54F5CA" : "#FEFFDE", width: "100%"
                }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("Votes")
                        this.resetSelectedCommitee()
                    })}>
                        <View style={{ display: 'flex', flexDirection: 'row', width: "100%"}}>
                            <Icon type="FontAwesome5" style={{ color: this.props.currentPage == "Votes" ? "#0A4E52" : this.original }} name="poll"></Icon>
                            <Text style={{ padding: "1%", color: this.props.currentPage == "Votes" ? "#0A4E52" : "gray", width: "100%"}}>Polls/Votes</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "Contributions" ? "#54F5CA" : "#FEFFDE",
                    ...shadower(3), borderBottomLeftRadius: 12, 
                }}>
                    <TouchableWithoutFeedback onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("Contributions")
                        this.resetSelectedCommitee()
                    })}>
                        <View style={{ display: 'flex', flexDirection: 'row', width: "100%" }}>
                            <Icon type="MaterialIcons" style={{ color: this.props.currentPage == "Contributions" ? "#0A4E52" : this.original }} name="monetization-on"></Icon>
                            <Text style={{ padding: "1%", color: this.props.currentPage == "Contributions" ? "#0A4E52" : "gray", width: "100%"}}>Contributions</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </CardItem>
            </Card>
        )
    }
} 