import React, { Component } from "react"
import { TouchableOpacity, View, Dimensions, } from 'react-native';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Card, CardItem, Text, Icon, Button } from 'native-base';
import GState from '../../../stores/globalState';
import emitter from '../../../services/eventEmiter';
import firebase from 'react-native-firebase';
import stores from '../../../stores';
import { Badge } from "native-base"
import colorList from '../../colorList';

const screenWidth = Math.round(Dimensions.get('window').width);

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
            this.props.isChat !== nextProps.isChat ||
            this.props.master !== nextProps.master
    }
    actionColor = "#1FABAB"
    fontSize = 28
    textSize = 14
    actionHeight = "14.5%"
    height = 50
    original = "#1FABAB"
    previous = this.props.event_id
    // This function resetSelectedCommitee will emite an event to the currently listening commiteeItem to adjust its highlightColor
    // because the selected tab has changed
    resetSelectedCommitee() {
    GState.reply = null
        if (GState.currentCommitee !== null) {
            GState.previousCommitee = GState.currentCommitee
            GState.currentCommitee = null;
            emitter.emit("current_commitee_changed", GState.previousCommitee)
        } else {
            emitter.emit("current_commitee_changed", GState.previousCommitee)
        }
    }
    centerer = {
        height: this.height, alignItems: 'center',
        borderRadius: 6, marginBottom: '6%',
        justifyContent: 'center'
    }
    resetCommiteeForGeneral() {
        GState.currentCommitee = GState.previousCommitee;
        emitter.emit("current_commitee_changed_by_main", GState.previousCommitee)
        this.setState({
            newMessagesCount: 0,
            updating: !this.state.updating
        })
    }
    componentWillMount() {
        emitter.on('mentioning', () => {
            this.resetCommiteeForGeneral()
        })
        emitter.on("leave-chat", () => {
            //emitted when a new remind is added from the chat
            this.resetSelectedCommitee()
        })
    }
    componentWillUnmount() {
        emitter.off('mentioning')
        emitter.off("leave-chat")
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
    width = screenWidth * .15
    render() {


        if (this.props.currentPage == "EventChat" || this.props.isChat) GState.generalNewMessages = []
        return (
            <View style={{ width: this.width, height: '100%' }} transparent >

                <TouchableOpacity style={{
                    ...this.centerer, backgroundColor: this.props.currentPage == "EventDetails" && !this.props.isChat ? ColorList.bodyDarkWhite : colorList.bodyBackground,
                    width: "100%", ...shadower(2)
                }} onPress={() => requestAnimationFrame(() => {
                    this.props.setCurrentPage("EventDetails")
                    this.resetSelectedCommitee()
                }
                )}>
                    <View style={{ display: 'flex', width: "100%", marginTop: '10%', }}>
                        <Icon type="AntDesign" style={{
                            alignSelf: 'center', fontSize: this.fontSize, color:colorList.bodyIcon
                        }} name="appstore-o"></Icon>
                        {/*<Text style={{ padding: "1%", color: this.props.currentPage == "EventDetails" ? "#0A4E52" : "gray", width: "100%" }}>Details</Text>*/}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    ...this.centerer, width: '100%',
                    backgroundColor: this.props.currentPage == "EventChat" || this.props.isChat ? ColorList.bodyDarkWhite : colorList.bodyBackground,
                    ...shadower(2)
                }} onPress={() => requestAnimationFrame(() => {
                    this.props.setCurrentPage("EventChat")
                    //this.resetCommiteeForGeneral()
                })
                }>
                    <View style={{ width: "100%", marginTop: '10%', }}>
                        <View style={{}}><Icon type="FontAwesome" style={{
                            alignSelf: 'center',
                            fontSize: this.fontSize,
                            color: colorList.bodyIcon
                        }} name="comments-o"></Icon>
                            {/*<Text style={{ padding: "1%", color: this.props.currentPage == "EventChat" ? "#0A4E52" : "gray", width: "100%" }}>Discusion</Text>*/}</View>
                        {GState.generalNewMessages.length > 0 ? <Badge style={{ position: 'absolute' }}
                            primary><Text style={{ marginTop: "30%", }}>{GState.generalNewMessages.length}</Text></Badge> : <View></View>}
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={{
                    ...this.centerer, width: '100%',
                    backgroundColor: this.props.currentPage == "Reminds" && !this.props.isChat ? ColorList.bodyDarkWhite : colorList.bodyBackground,
                    ...shadower(2)
                }} onPress={() => requestAnimationFrame(() => {
                    this.props.setCurrentPage("Reminds")
                    this.resetSelectedCommitee()
                })}>
                    <View style={{ width: "100%", marginTop: '10%', }}>
                        <Icon type="FontAwesome" style={{ alignSelf: 'center', 
                            fontSize: this.fontSize,
                             color: colorList.bodyIcon }} name="bell-o"></Icon>
                        {/*<Text style={{ padding: "1%", color: this.props.currentPage == "Reminds" ? "#0A4E52" : "gray", width: "100%" }}>Reminds</Text>*?/}
                    </View>
                </Button>
                <Button style={{ ...this.centerer, height: this.height, backgroundColor: this.props.currentPage == "ChangeLogs" ? "#54F5CA" : "#FEFFDE", ...shadower(2) }} onPress={() => requestAnimationFrame(() => {
                    this.props.setCurrentPage("ChangeLogs")
                    this.resetSelectedCommitee()
                }
                )}>
                    <View style={{ display: 'flex', flexDirection: 'row', width: "100%" }}>
                        <Icon type="Entypo" style={{ color: this.props.currentPage == "ChangeLogs" ? "#0A4E52" : this.original }} name="clock"></Icon>
                        {/*<Text style={{ padding: "1%", color: this.props.currentPage == "ChangeLogs" ? 
                "#0A4E52" : "gray", width: "100%" }}>{"Logs"}</Text>*/}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: '100%',
                    ...this.centerer, backgroundColor: this.props.currentPage == "ChangeLogs" && !this.props.isChat ? ColorList.bodyDarkWhite : colorList.bodyBackground, 
                    ...shadower(2)
                }} onPress={() => requestAnimationFrame(() => {
                    this.props.setCurrentPage("ChangeLogs")
                    this.resetSelectedCommitee()
                }
                )}>
                    <View style={{ marginTop: '10%', width: "100%" }}>
                        <Icon type="AntDesign" style={{ 
                            alignSelf: 'center', 
                            fontSize: this.fontSize, 
                            color: colorList.bodyIcon }} name="clockcircleo"></Icon>
                        {/*<Text style={{ padding: "1%", color: this.props.currentPage == "ChangeLogs" ? "#0A4E52" : "gray", width: "100%" }}>{"Logs"}</Text>*/}
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
} 