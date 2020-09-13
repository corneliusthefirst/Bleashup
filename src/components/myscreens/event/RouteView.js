import React, { Component } from "react"
import { TouchableOpacity, View, Dimensions, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';
import GState from '../../../stores/globalState';
import emitter from '../../../services/eventEmiter';
import firebase from 'react-native-firebase';
import stores from '../../../stores';
import ColorList from '../../colorList';

const screenWidth = Math.round(Dimensions.get('window').width);

import shadower from "../../shadower";
import  AntDesign  from 'react-native-vector-icons/AntDesign';
import  FontAwesome from 'react-native-vector-icons/FontAwesome';
import  Entypo  from 'react-native-vector-icons/Entypo';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import rounder from "../../../services/rounder";
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
    centerer = {
        height: this.height, alignItems: 'center',
        borderRadius: 6, marginBottom: '6%',
        justifyContent: 'center'
    }
    componentDidMount() {
        this.setState({
            updating: !this.state.updating
        })

    };
    width = screenWidth * .15
    render() {


        if (this.props.currentPage == "EventChat" || this.props.isChat) GState.generalNewMessages = []
        return (
            <View style={{ width: this.width, height: '100%' }} transparent >

                <TouchableOpacity style={{
                    ...this.centerer, backgroundColor: this.props.currentPage == "EventDetails" && !this.props.isChat ? ColorList.bodyDarkWhite : ColorList.bodyBackground,
                    width: "100%", ...shadower(2)
                }} onPress={() => requestAnimationFrame(() => {
                    this.props.setCurrentPage("EventDetails")
                }
                )}>
                    <View style={{ display: 'flex', width: "100%", marginTop: '10%', }}>
                        <AntDesign type="AntDesign" style={{
                            alignSelf: 'center', fontSize: this.fontSize, color: ColorList.post
                        }} name="star"/>
                        {/*<Text style={{ padding: "1%", color: this.props.currentPage == "EventDetails" ? "#0A4E52" : "gray", width: "100%" }}>Details</Text>*/}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    ...this.centerer, width: '100%',
                    backgroundColor: this.props.currentPage == "EventChat" || this.props.isChat ? ColorList.bodyDarkWhite : ColorList.bodyBackground,
                    ...shadower(2)
                }} onPress={() => requestAnimationFrame(() => {
                    this.props.setCurrentPage("EventChat")
                    //this.resetCommiteeForGeneral()
                })
                }>
                    <View style={{ width: "100%", marginTop: '10%', }}>
                        <View style={{}}><MaterialIcons type="FontAwesome" style={{
                            alignSelf: 'center',
                            fontSize: this.fontSize,
                            color: ColorList.bodyIcon
                        }} name="chat-bubble"/>
                            {/*<Text style={{ padding: "1%", color: this.props.currentPage == "EventChat" ? "#0A4E52" : "gray", width: "100%" }}>Discusion</Text>*/}</View>
                        {GState.generalNewMessages.length > 0 ? <View style={styles.badge}
                            primary><Text style={{ marginTop: "30%", }}>{GState.generalNewMessages.length}</Text></View> : <View></View>}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    ...this.centerer, width: '100%',
                    backgroundColor: this.props.currentPage == "Reminds" && !this.props.isChat ? ColorList.bodyDarkWhite : ColorList.bodyBackground,
                    ...shadower(2)
                }} onPress={() => requestAnimationFrame(() => {
                    this.props.setCurrentPage("Reminds")
                })}>
                    <View style={{ width: "100%", marginTop: '10%', }}>
                        <Entypo type="Entypo" style={{
                            alignSelf: 'center',
                            fontSize: this.fontSize,
                            color: ColorList.reminds
                        }} name="bell"/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: '100%',
                    ...this.centerer, backgroundColor: this.props.currentPage == "ChangeLogs" && !this.props.isChat ? ColorList.bodyDarkWhite : ColorList.bodyBackground,
                    ...shadower(2)
                }} onPress={() => requestAnimationFrame(() => {
                    this.props.setCurrentPage("ChangeLogs")
                }
                )}>
                    <View style={{ marginTop: '10%', width: "100%" }}>
                        <MaterialIcons type="MaterialIcons" style={{
                            alignSelf: 'center',
                            fontSize: this.fontSize,
                            color: ColorList.darkGrayText
                        }} name="history"/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
} 
const styles = StyleSheet.create({
    badge:{
        position: 'absolute',
        ...rounder(30,ColorList.indicatorColor),
        ...shadower(3),
        justifyContent: 'center',
        textAlign:'center'
    }
})