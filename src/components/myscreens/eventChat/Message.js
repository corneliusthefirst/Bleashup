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
import { Left, Icon, Right, Text, Toast, Spinner } from 'native-base';
import ReplyText from './ReplyText';
import PhotoUploader from './PhotoUploader';
import VideoUploader from './VideoUploader';
import FileAttarchementUploader from './FileAttarchmantUploader';
import AudioUploader from './AudioUploader';
import Swipeout from '../../SwipeOut';
import TextMessageSnder from './TextMessageSender';
import DateView from './DateView';
import NewSeparator from './NewSeparator';
import moment from 'moment';
import shadower from '../../shadower';

export default class Message extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showTime: false,
            disabledSwipeout: true,
            openRight: true,
            time: "",
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            different: this.props.PreviousSenderPhone !== this.props.message.sender.phone
                && !(this.props.message.sender.phone == this.props.user),
            time: moment(this.props.message.created_at).format("HH:mm"),
            creator: (this.props.message.sender.phone == this.props.creator),
            replying: false,
            loaded: false
        }
    }
    chooseComponent(data, index, sender) {
        //console.warn(data.type)
        switch (data.type) {
            case "text":
                return <TextMessage handleLongPress={() => this.handLongPress()} pressingIn={() => {
                    this.replying = true
                }} firebaseRoom={this.props.firebaseRoom} user={2} sender={sender} index={index} creator={2} message={data}></TextMessage>
            case "text_sender":
                return <TextMessageSnder sendMessage={(message) => this.props.sendMessage(message)} firebaseRoom={this.props.firebaseRoom}
                    user={2} sender={sender} index={index} creator={3} message={data}></TextMessageSnder>
            case "photo":
                return <PhotoMessage handleLongPress={() => this.handLongPress()}  pressingIn={() => {
                    this.replying = true;
                    // this.props.hideAndshow()
                }} firebaseRoom={this.props.firebaseRoom} showPhoto={(url) => this.props.showPhoto(url)} user={2} sender={sender} index={index} creator={2} message={data}></PhotoMessage>
            case "audio":
                return <AudioMessage handleLongPress={() => this.handLongPress()} room={this.props.room} pressingIn={() => {
                    this.replying = true;
                    //this.props.hideAndshow()
                }} index={index} sender={sender} message={data}></AudioMessage>
            case "video":
                return <VideoMessage handleLongPress={() => this.handLongPress()} pressingIn={() =>{
                    this.replying = true
                }} room={this.props.room} index={index} sender={sender}
                    playVideo={(video) => { this.props.playVideo(video) }} message={data}></VideoMessage>
            case "attachement":
                return <FileAttarchementMessaege handleLongPress={() => this.handLongPress()} room={this.props.room} sender={sender} index={index} message={data}></FileAttarchementMessaege>;
            case "photo_upload":
                return <PhotoUploader room={this.props.room} showPhoto={(photo) => this.props.showPhoto(photo)}
                    replaceMessage={data => this.props.replaceMessage(data)} sender={false}
                    index={index} message={data}></PhotoUploader>
            case "video_upload":
                return <VideoUploader playVideo={(video) => this.props.playVideo(video)} replaceMessage={data =>
                    this.props.replaceMessageVideo(data)} message={data} playVideo={(video) => this.props.playVideo(video)}
                    index={index} sender={false}></VideoUploader>;
            case "attachement_upload":
                return <FileAttarchementUploader room={this.props.room} index={index} message={data}
                    replaceMessage={(data) => this.props.replaceMessageFile(data)}></FileAttarchementUploader>
            case "audio_uploader":
                return <AudioUploader room={this.props.room} message={data} index={data.id}
                    replaceMessage={(data) => this.props.replaceAudioMessage(data)}></AudioUploader>
            default:
                return null
        }
    }
    componentDidMount() {
        console.warn(this.props.message.sender.phone, this.props.user, this.props.PreviousSenderPhone)
        setTimeout(() => {
            this.setState({
                loaded: true
            })
        }, 50 * this.props.delay)
    }
    slept = false
    openingSwipeout() {
        this.closing++
        if (!this.slept) {
            setTimeout(() => {
                this.setState({
                    openRight: true
                })
            }, 1000)
            this.slept = true
        } else {
            this.setState({
                openRight: true
            })
        }
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
        return this.props.message.sent !== nextProps.message.sent ||
            this.props.received !== nextProps.received ||
            this.state.loaded !== nextState.loaded ||
            this.props.message.id !== nextProps.message.id
    }
    iconStyles = {
        fontSize: 12,
        color: "#018A62",
        marginLeft: 5,
        paddingTop: 1,
        //marginTop: "-2%",
        marginBottom: 3
    }
    handLongPress(){
        this.replying = false
        this.props.showActions(this.props.message)
        Vibration.vibrate(this.longPressDuration)
    }
    testForImoji(message) {
        let imoji = message.match(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug)
        return imoji && imoji.length == 1 && message.length == imoji[0].length
    }
    render() {
        topMostStyle = {
            marginLeft: this.state.sender ? '1%' : 0,
            marginRight: !this.state.sender ? '1%' : 0,
            marginTop: this.state.different ? "1.5%" : 0,
            marginBottom: "0.5%",
            alignSelf: this.state.sender ? 'flex-start' : 'flex-end',
        }
        let color = this.state.sender ? '#D0FEEB' : '#9EEDD3'
        GeneralMessageBoxStyle = {
            maxWidth: 300, flexDirection: 'column', minWidth: 120,
            minHeight: 10, overflow: 'hidden', borderBottomLeftRadius: 10, borderColor: color,
            borderTopLeftRadius: this.state.sender ? 0 : 10,// borderWidth: this.props.message.text && this.props.message.type === "text" ? this.testForImoji(this.props.message.text)?.7:0:0,
            backgroundColor: color, ...shadower(3),
            borderTopRightRadius: 10, borderBottomRightRadius: this.state.sender ? 10 : this.props.message.reply && this.props.message.reply.type_extern ? 10 : null,
        }
        senderNameStyle = {
            maxWidth: "100%",
            //margin: this.state.sender ? 0 : 4,
            borderBottomLeftRadius: 40,
        }
        subNameStyle = {
            paddingBottom: 0,
            flexDirection: "row",
            backgroundColor: this.props.message.text && this.props.message.type === "text" ? this.testForImoji(this.props.message.text) ? color : 'transparent' : 'transparent',
            // backgroundColor: color,
        }
        placeholderStyle = {
            ...topMostStyle, height: 100, backgroundColor: color, borderBottomLeftRadius: 10, borderColor: color,
            borderTopLeftRadius: this.state.sender ? 0 : 10,// borderWidth: this.props.message.text && this.props.message.type === "text" ? this.testForImoji(this.props.message.text)?.7:0:0,
            backgroundColor: color,
            alignSelf: this.state.sender ? 'flex-start' : 'flex-end',
            borderTopRightRadius: 10,

            width: 200
        }
        nameTextStyle = { fontSize: 14, fontWeight: 'bold', color: "#1FABAB" }
        return (this.props.message.type == 'date_separator' ? <View style={{ marginTop: '2%', marginBottom: '2%', }}>
            <DateView date={this.props.message.id}></DateView></View> :
            this.props.message.type == "new_separator" ? <View style={{
                marginTop: '2%',
                marginBottom: '2%'
            }}><NewSeparator data={this.props.message.id}></NewSeparator></View> :
                !this.state.loaded ? <View style={placeholderStyle}></View> : <View style={topMostStyle}>
                    <Swipeout isMessage onPress={this.openingSwipeout()}
                        ref={'chatSwipeOut'} onOpen={() => { this.openingSwipeout() }}
                        onClose={() => { this.closingSwipeout() }} autoClose={true} close={true}
                        left={[{
                            color: 'black', type: 'default', backgroundColor: "transparent", text: 'reply', onPress: () => {
                                Vibration.vibrate(this.duration)
                                this.handleReply()
                            }
                        }]}
                        style={{ backgroundColor: 'transparent', width: "100%" }}>
                        <View>
                            <View style={GeneralMessageBoxStyle}>
                                <View>
                                    <View style={senderNameStyle}>
                                        <TouchableWithoutFeedback onLongPress={() => {
                                           this.handLongPress()
                                        }} onPressIn={() => {
                                            this.replying = true
                                        }}><View style={subNameStyle}>{this.state.sender ?
                                             <TouchableOpacity onLongPress={() => {
                                            this.handLongPress()
                                        }} onPress={() => {
                                            this.props.showProfile(this.message.sender.phone)
                                        }}>{this.state.different ? <Text style={nameTextStyle}
                                            note>{" "}{this.state.sender_name}</Text> : <Text>{"         "}</Text>}</TouchableOpacity> : null}<Right>
                                                    {!this.state.sender ? <Text note
                                                        style={{
                                                            color: this.state.sender ? null : '#1FABAB',
                                                            fontSize: 13, marginRight: "2%", marginTop: "1%",
                                                        }}>
                                                        {this.state.time}{"    "}</Text> : null}</Right></View></TouchableWithoutFeedback>
                                        <View>
                                            {this.props.message.reply ? <View style={{ borderRadius: 10, padding: '1%', marginTop: ".4%", width: "100%" }}>
                                                <ReplyText handLongPress={() => this.handLongPress()} showProfile={(pro) => this.props.showProfile(pro)} pressingIn={() => {
                                                    this.replying = true
                                                }} openReply={(replyer) => {
                                                    replyer.isThisUser = !this.state.sender
                                                    this.props.message.reply && this.props.message.reply.type_extern ? this.props.handleReplyExtern(this.props.message.reply) : this.props.openReply(replyer)
                                                }} reply={this.props.message.reply}></ReplyText></View> : null}
                                            <TouchableWithoutFeedback onPressIn={() => {
                                                this.replying = true
                                            }} onPress={() => {
                                                this.replying = false
                                            }} onLongPress={() => {
                                                this.handLongPress()
                                            }} >
                                                <View>
                                                    {this.chooseComponent(this.props.message, this.props.message.id, this.state.sender)}
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>
                                        <TouchableWithoutFeedback onPressIn={() => {
                                            this.replying = true
                                        }} onLongPress={() => {
                                            this.handLongPress()
                                        }}>
                                        <View>
                                        <View style={{
                                            backgroundColor: this.props.message.text && this.props.message.type === "text" ? this.testForImoji(this.props.message.text) ? color : 'transparent' : 'transparent',

                                        }}>
                                            {this.state.sender ? <Text note
                                                style={{
                                                    marginLeft: "5%",
                                                    color: this.state.sender ? null : '#1FABAB',
                                                    fontSize: 13, marginRight: "2%", marginTop: "1%",
                                                }}>
                                                {this.state.time}{"    "}</Text> : null}
                                        </View>
                                        <View style={{
                                            backgroundColor: this.props.message.text && this.props.message.type === "text" ? this.testForImoji(this.props.message.text) ? color : 'transparent' : 'transparent',
                                        }}>{!this.state.sender ? this.props.message.sent ? this.props.received ?
                                            <Icon style={this.iconStyles} type="Ionicons" name="ios-checkmark-circle">
                                            </Icon> : <Icon style={this.iconStyles} type={"EvilIcons"} name="check">
                                            </Icon> : <Icon style={{ ...this.iconStyles, color: "#FFF" }} type="MaterialCommunityIcons"
                                                name="progress-check"></Icon> : null}</View>
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