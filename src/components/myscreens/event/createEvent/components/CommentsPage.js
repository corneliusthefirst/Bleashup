import React, { Component } from "react"
import ChatRoom from "../../../eventChat/ChatRoom";
import stores from "../../../../../stores";
import { View, BackHandler, Text } from "react-native"
import CreationHeader from "./CreationHeader";


export default class CommentsPage extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton.bind(this));
    }
    componentWillMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));
    }
    handleBackButton() {
        this.goback()
        return true;
    }
    state={}
    title = this.props.navigation.getParam('title')
    activity_name = this.props.navigation.getParam('activity_name')
    id = this.props.navigation.getParam('id')
    creator = this.props.navigation.getParam('creator')
    activity_id = this.props.navigation.getParam('activity_id');
    goback(){
        this.props.navigation.goBack()
    }

    setTyper(){
        this.typingTimeout && clearTimeout(this.typingTimeout)
        // console.warn(this.currentTyper)
        this.setState({
            typing: true
        })
        this.typingTimeout = setTimeout(() => {
            this.setState({
                typing: false
            })
        }, 1000)
    }
    render() {
        return <View style={{ height: '100%',justifyContent: 'space-between', }}>
            <View style={{height:'7%'}}>
            <CreationHeader
            title={`${this.title} | comments`}
            back={this.goback.bind(this)}
            extra={ this.state.typing && <Text style={{marginBottom: 'auto',marginTop: 'auto',}} note>{'commenting ...'}</Text>}
            ></CreationHeader>
            </View>
            <View style={{height:'92%'}}>
                <ChatRoom
                setTyper={this.setTyper.bind(this)}
                    isComment={true}
                    roomName={this.title}
                    opened={true}
                    generallyMember={true}
                    activity_id={this.activity_id}
                    public_state={true}
                    user={{ ...stores.LoginStore.user, phone: stores.LoginStore.user.phone.replace('00', '+') }}
                    activity_name={this.activity_name}
                    room_type={"comment"}
                    newMessageNumber={0}
                    firebaseRoom={this.id}
                    newMessages={[]}
                    creator={this.creator}
                >
                </ChatRoom></View></View>
    }
}