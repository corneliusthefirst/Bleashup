import React, { Component } from 'react';
import { View, TouchableOpacity, Vibration,TouchableWithoutFeedback } from "react-native"
import TextMessage from './TextMessage';
import PhotoMessage from './PhotoMessage';
import VideoMessage from './VideoMessage';
import FileAttarchementMessaege from './FileAttarchtmentMessage';
import AudioMessage from './AudioMessage';
import { Left, Icon, Right,Text } from 'native-base';
import ReplyText from './ReplyText';
import PhotoUploader from './PhotoUploader';

export default class Message extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showTime: false
        }
    }
    chooseComponent(data, index,sender) {
        //console.warn(data.type)
        switch (data.type) {
            case "text":
                return <TextMessage user={2} sender={sender} index={index} creator={2} message={data}></TextMessage>
            case "photo":
                return <PhotoMessage showPhoto={(url)=> this.props.showPhoto(url)} user={2} sender={sender} index={index} creator={2} message={data}></PhotoMessage>
            case "audio":
                return <AudioMessage index={index} sender={sender}  message={data}></AudioMessage>
            case "video":
                return <VideoMessage index={index} sender={sender} 
                playVideo={(video) => { this.props.playVideo(video) }} message={data}></VideoMessage>
            case "attachement":
                return <FileAttarchementMessaege sender={sender} index={index} message={data}></FileAttarchementMessaege>;
            case "photo_upload":
                return <PhotoUploader showPhoto={(photo) => this.props.showPhoto(photo)} 
                replaceMessage={data => this.props.replaceMessage(data)} sender={false} 
                index={index} message={data}></PhotoUploader>
            default:
                return null
        }
    }
    componentDidMount() {
        this.setState({
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            creator: (this.props.message.sender.phone == this.props.creator)
        })
    }
    duration = 10
    pattern = [1000, 0, 0]
    render() {
        topMostStyle = {
            marginLeft: this.state.sender ? '1%' : 0,
            marginRight: !this.state.sender ? '1%' : 0,
            marginTop: "1%",
            marginBottom: "0.5%",
            alignSelf: this.state.sender ? 'flex-start' : 'flex-end',
        }
        GeneralMessageBoxStyle = {
            maxWidth: 300, flexDirection: 'column', minWidth: "10%",
            minHeight: 10, overflow: 'hidden', borderBottomLeftRadius:  20,
            borderTopLeftRadius: this.state.sender ? 0 : 20, backgroundColor: this.state.sender ? '#DEDEDE' : '#9EEDD3',
            borderTopRightRadius: 20, borderBottomRightRadius: this.state.sender ? 20 : 0,
        }
        senderNameStyle = {
            maxWidth:  "100%",
            //margin: this.state.sender ? 0 : 4,
            borderBottomLeftRadius: 40,
        }
        subNameStyle = {
            marginTop: -3, paddingBottom: 5,
            flexDirection: "column"
        }
        nameTextStyle = { color: '#1EDEB6', fontSize: 13, }
        return (
            <View style={topMostStyle}>
                <View style={GeneralMessageBoxStyle}>
                    <View>
                        <View style={senderNameStyle} >
                            {this.state.sender ? <View style={subNameStyle}><TouchableOpacity onPress={() => {
                                console.warn('humm ! you want to know that contact !')
                            }}><Text style={nameTextStyle}
                                note>@{this.state.sender_name}</Text></TouchableOpacity></View> : null}
                                <View>
                                {this.props.message.reply ? <View style={{ paddingRight: "1%",marginTop: "2%", }}><ReplyText openReply={(replyer) => {
                                    this.props.message.reply.isThisUser = !this.state.sender
                                    return this.props.openReply(this.props.message.reply)
                                }} reply={this.props.message.reply}></ReplyText></View> : null}
                                <TouchableWithoutFeedback onLongPress={() => {
                                    Vibration.vibrate(this.duration)
                                    this.setState({
                                        showTime: !this.state.showTime
                                    })
                                }}>
                                    <View>
                                        {this.chooseComponent(this.props.message, this.props.message.id,this.state.sender)}
                                    </View>
                                </TouchableWithoutFeedback>
                                </View>
                        </View>
                    </View>
                </View>
                {this.state.showTime ? <Text note style={{ marginLeft: "5%", fontSize: 12, }}>{this.state.time}</Text> : false}
            </View>
        )
    }
}