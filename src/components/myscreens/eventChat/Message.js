import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Vibration,
    TouchableWithoutFeedback,
    TouchableHighlight
} from 'react-native';
import TextMessage from './TextMessage';
import PhotoMessage from './PhotoMessage';
import VideoMessage from './VideoMessage';
import FileAttarchementMessaege from './FileAttarchtmentMessage';
import AudioMessage from './AudioMessage';
import { Left, Icon, Right, Text, Toast } from 'native-base';
import ReplyText from './ReplyText';
import PhotoUploader from './PhotoUploader';
import VideoUploader from './VideoUploader';
import FileAttarchementUploader from './FileAttarchmantUploader';
import AudioUploader from './AudioUploader';
import Swipeout from '../../SwipeOut';

export default class Message extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showTime: false,
            disabledSwipeout: true,
            openRight: true,
            replying: false
        }
    }
    chooseComponent(data, index, sender) {
        //console.warn(data.type)
        switch (data.type) {
            case "text":
                return <TextMessage firebaseRoom={this.props.firebaseRoom} user={2} sender={sender} index={index} creator={2} message={data}></TextMessage>
            case "photo":
                return <PhotoMessage firebaseRoom={this.props.firebaseRoom} showPhoto={(url) => this.props.showPhoto(url)} user={2} sender={sender} index={index} creator={2} message={data}></PhotoMessage>
            case "audio":
                return <AudioMessage firebaseRoom={this.props.firebaseRoom} index={index} sender={sender} message={data}></AudioMessage>
            case "video":
                return <VideoMessage firebaseRoom={this.props.firebaseRoom} index={index} sender={sender}
                    playVideo={(video) => { this.props.playVideo(video) }} message={data}></VideoMessage>
            case "attachement":
                return <FileAttarchementMessaege firebaseRoom={this.props.firebaseRoom} sender={sender} index={index} message={data}></FileAttarchementMessaege>;
            case "photo_upload":
                return <PhotoUploader firebaseRoom={this.props.firebaseRoom} showPhoto={(photo) => this.props.showPhoto(photo)}
                    replaceMessage={data => this.props.replaceMessage(data)} sender={false}
                    index={index} message={data}></PhotoUploader>
            case "video_upload":
                return <VideoUploader firebaseRoom={this.props.firebaseRoom} playVideo={(video) => this.props.playVideo(video)} replaceMessage={data =>
                    this.props.replaceMessageVideo(data)} message={data} playVideo={(video) => this.props.playVideo(video)}
                    index={index} sender={false}></VideoUploader>;
            case "attachement_upload":
                return <FileAttarchementUploader firebaseRoom={this.props.firebaseRoom} index={index} message={data}
                    replaceMessage={(data) => this.props.replaceMessageFile(data)}></FileAttarchementUploader>
            case "audio_uploader":
                return <AudioUploader firebaseRoom={this.props.firebaseRoom} message={data} index={data.id}
                    replaceMessage={(data) => this.props.replaceAudioMessage(data)}></AudioUploader>
            default:
                return null
        }
    }
    componentWillMount() {
        this.setState({
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            creator: (this.props.message.sender.phone == this.props.creator)
        })
    }
    openingSwipeout() {
        this.closing++
        this.setState({
            openRight: true
        })
        if (this.replying) {
            if (!this.closed) {
                this.closing++
                this.closed = true
                this.handleReply()
                this.closing = 0
                Vibration.vibrate(this.duration)
                setTimeout(() => {
                    this.closed = false
                }, 1000)
            }
            this.replying = false
        }
    }
    timeoutID = null
    closing = 0
    perviousTime = 0
    closingSwipeout() {
        /*   if (this.replying) {
               if(!this.closed){
                   this.closing++
                   this.closed = true
   
                   this.closing = 0
                   Vibration.vibrate(this.duration)
                   setTimeout(() => {
                       this.closed = false
                   }, 1000)
               }
               this.replying = false
           }*/
    }
    duration = 10
    longPressDuration = 50
    pattern = [1000, 0, 0]
    handleReply() {
        //console.warn(this.props.message)
        let color = this.state.sender ? '#DEDEDE' : '#9EEDD3'
        switch (this.props.message.type) {
            case 'text':
                tempMessage = this.props.message
                tempMessage.replyer_name = this.props.message.sender.nickname;
                this.props.replying(tempMessage)
                break;
            case 'audio':
                tempMessage = this.props.message
                tempMessage.audio = true;
                tempMessage.replyer_name = this.props.message.sender.nickname;
                this.props.replying(tempMessage)
                break;
            case 'video':
                tempMessage = this.props.message
                tempMessage.video = true
                tempMessage.sourcer = this.props.message.thumbnailSource
                tempMessage.replyer_name = this.props.message.sender.nickname
                this.props.replying(tempMessage)
                break
            case 'attachement':
                tempMessage = this.props.message;
                tempMessage.replyer_name = this.props.message.sender.nickname
                tempMessage.file = true;
                let temp = this.props.message.file_name.split('.')
                let temper = tempMessage
                temper.typer = temp[temp.length - 1]
                this.props.replying(temper)
                //tempMessage = temper
                break;
            case 'photo':
                tempMessage = this.props.message
                tempMessage.replyer_name = this.props.message.sender.nickname;
                tempMessage.sourcer = this.props.message.photo
                this.props.replying(tempMessage)
                break;
            default:
                Toast.show({ text: 'unable to reply for unsent messages' })
                break
        }
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false
    }
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
            minHeight: 10, overflow: 'hidden', borderBottomLeftRadius: 20,
            borderTopLeftRadius: this.state.sender ? 0 : 20,
            backgroundColor: this.state.sender ? '#DEDEDE' : '#9EEDD3',
            borderTopRightRadius: 20, borderBottomRightRadius: this.state.sender ? 20 : 0,
        }
        senderNameStyle = {
            maxWidth: "100%",
            //margin: this.state.sender ? 0 : 4,
            borderBottomLeftRadius: 40,
        }
        subNameStyle = {
            paddingBottom: 0,
            flexDirection: "row"
        }
        nameTextStyle = { color: '#1EDEB6', fontSize: 13, }
        return (
            <View style={topMostStyle}>
                <Swipeout isMessage onPress={this.openingSwipeout()} ref={'chatSwipeOut'} onOpen={() => { this.openingSwipeout() }}
                    onClose={() => { this.closingSwipeout() }} autoClose={true} close={true}
                    left={[{ color: '#04FFB6', type: 'default', backgroundColor: "transparent", text: 'reply' }]}
                    style={{ backgroundColor: 'transparent', width: "100%" }}>
                    <View style={GeneralMessageBoxStyle}>
                        <View>
                            <View style={senderNameStyle}>
                                <View style={subNameStyle}>{this.state.sender ? <TouchableOpacity onPress={() => {
                                    console.warn('humm ! you want to know that contact !')
                                }}><Text style={nameTextStyle}
                                    note>@{this.state.sender_name}</Text></TouchableOpacity> : null}<Right><Text note
                                        style={{ color: this.state.sender ? null : '#1EDEB6', fontSize: 13, marginRight: "2%", marginTop: "1%", }}>{this.state.time}{"    "}</Text></Right></View>
                                <View>
                                    {this.props.message.reply ? <View style={{ paddingRight: "1%", marginTop: "2%", }}>
                                        <ReplyText openReply={(replyer) => {
                                            replyer.isThisUser = !this.state.sender
                                            return this.props.openReply(replyer)
                                        }} reply={this.props.message.reply}></ReplyText></View> : null}
                                    <TouchableWithoutFeedback onPressIn={() => {
                                        //console.warn('pressing in')
                                        this.replying = true
                                    }} onPress={() => {
                                        this.replying = false
                                    }} onLongPress={() => {
                                        this.replying = false
                                        this.props.showActions(this.props.message)
                                        Vibration.vibrate(this.longPressDuration)
                                    }} >
                                        <View>
                                            {this.chooseComponent(this.props.message, this.props.message.id, this.state.sender)}
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </View>
                    </View>
                </Swipeout>
            </View>
        )
    }
}