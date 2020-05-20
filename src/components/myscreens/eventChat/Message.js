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
import Voter from './Voter';
import { find } from 'lodash';
import { isEqual } from 'lodash';
import formVoteOptions from '../../../services/formVoteOptions';
import ColorList from '../../colorList';
import ReactionModal from './ReactionsModal';

export default class Message extends Component {

    constructor(props) {
        super(props)
        let isDiff = this.props.message.sender && this.props.PreviousMessage && this.props.PreviousMessage.sender && this.props.PreviousMessage.sender.phone !== this.props.message.sender.phone
        this.state = {
            showTime: false,
            disabledSwipeout: true,
            openRight: true,
            sender_name: this.props.message &&
                this.props.message.sender &&
                this.props.message.sender.nickname,
            sender: !(this.props.message.sender && this.props.message.sender.phone == this.props.user),
            different: isDiff,
            time: !isDiff && this.props.PreviousMessage &&
                this.props.PreviousMessage.type !== "date_separator" &&
                this.props.message &&
                moment(this.props.message.created_at).format('X') - moment(this.props.PreviousMessage.created_at).format('X') < 1 ? "" :
                moment(this.props.message.created_at).format("HH:mm"),
            creator: (this.props.message.sender && this.props.message.sender.phone == this.props.creator),
            replying: false,
            loaded: false
        }
    }
    placeHolder = {
        'audio': {
            height: 150,
            width: 250
        },
        'photo': {
            height: 250,
            width: 250
        },
        'video': {
            height: 250,
            width: 250
        },
        'attachement': {
            height: 150,
            width: 250
        },
        'vote': {
            height: 300,
            width: 250
        },
        'text': {
            height: 50,
            width: 100
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
                return <PhotoMessage room={this.props.room} handleLongPress={() => this.handLongPress()} pressingIn={() => {
                    this.replying = true;
                    // this.props.hideAndshow()
                }} firebaseRoom={this.props.firebaseRoom} showPhoto={(url) => this.props.showPhoto(url)} user={2} sender={sender} index={index} creator={2} message={data}></PhotoMessage>
            case "audio":
                return <AudioMessage handleLongPress={() => this.handLongPress()} room={this.props.room} pressingIn={() => {
                    this.replying = true;
                    //this.props.hideAndshow()
                }} index={index} sender={sender} message={data}></AudioMessage>
            case "video":
                return <VideoMessage handleLongPress={() => this.handLongPress()} pressingIn={() => {
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
            case "vote":
                return <Voter computedMaster={this.props.computedMaster}
                    mention={() => this.handleReply()} takeCreator={(creator) => {
                        this.voteCreator = creator
                    }} vote={(index, vote) => this.props.voteItem(index, this.props.message)}
                    pressingIn={() => {
                        this.replying = true
                    }}
                    placeHolder={this.placeholderStyle}
                    showVoters={this.props.showVoters}
                    message={{
                        ...data,
                        vote: {
                            ...this.props.votes &&
                            find(this.props.votes, { id: data.vote.id }), voter: data.vote.voter
                        }
                    }}
                    room={this.props.room} index={data.id}></Voter>
            default:
                return null
        }
    }
    voteCreator = null
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loaded: true
            })
        }, 20 * this.props.delay)
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
        setTimeout(() => {
            if (this.replying) {
                if (!this.closed) {
                    this.closing++
                    this.closed = true
                    this.handleReply()
                    this.closing = 0
                    setTimeout(() => {
                        this.closed = false
                    }, 1000)
                }
                this.replying = false
            }
        }, 50)
    }
    timeoutID = null
    closing = 0
    perviousTime = 0
    closingSwipeout() {

    }
    duration = 10
    longPressDuration = 50
    pattern = [1000, 0, 0]
    handleReply() {
        Vibration.vibrate(this.duration)
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
            case 'vote':
                let vote = this.props.votes && this.props.votes.length > 0 && this.props.message.vote &&
                    find(this.props.votes, { id: this.props.message.vote.id })
                this.props.replying({
                    id: vote.id,
                    type_extern: 'Votes',
                    title: `${vote.title} : \n ${vote.description} \n\n ${formVoteOptions(vote)}`,
                    replyer_phone: this.props.user.phone,
                })
                break;
            default:
                Toast.show({ text: 'unable to reply for unsent messages' })
                break
        }
    }

    prevVote = null
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        peVote = this.prevVote ? JSON.parse(this.prevVote) : this.props.votes
            && this.props.votes.length > 0 && this.props.message.vote &&
            find(this.props.votes, { id: this.props.message.vote.id })
        newVote = nextProps.votes && nextProps.votes.length > 0 && nextProps.message.vote &&
            find(nextProps.votes, { id: nextProps.message.vote.id })
        let voter = (peVote && newVote && peVote.voter && newVote.voter &&
            newVote.voter.length !== peVote.voter.length)
        let votePeriod = (peVote && newVote && peVote.period !== newVote.period)
        if (voter || votePeriod) {
            this.prevVote = JSON.stringify(newVote)
        }
        return this.props.message.sent !== nextProps.message.sent ||
            this.props.received !== nextProps.received ||
            voter || votePeriod ||
            this.state.loaded !== nextState.loaded ||
            this.props.messagelayouts && this.props.messagelayouts[this.props.message.id] !== nextProps.messagelayouts[nextProps.message.id] ||
            this.props.message.id !== nextProps.message.id ||
            this.state.isReacting !== nextState.isReacting
    }
    iconStyles = {
        fontSize: 12,
        color: "#1FABAB",
        marginLeft: 5,
        paddingTop: 1,
        //marginTop: "-2%",
        marginBottom: 3
    }
    handLongPress() {
        this.replying = false
        this.props.showActions(this.props.message)
        Vibration.vibrate(this.longPressDuration)
    }
    testForImoji(message) {
        let imoji = message.match(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug)
        return imoji && imoji.length == 1 && message.length == imoji[0].length
    }
    isVote() {
        return this.props.message.type === 'vote'
    }
    openReaction() {
        requestAnimationFrame(() => {
            this.setState({
                isReacting: true
            })
        })
    }
    placeholderStyle = this.props.messagelayouts && this.props.messagelayouts[this.props.message.id] ?
        this.props.messagelayouts[this.props.message.id] :
        this.placeHolder[this.props.message.type]
    render() {
        //console.warn("here",this.props.message.sent,this.props.received);

        topMostStyle = {
            marginLeft: this.state.sender ? '1%' : 0,
            marginRight: !this.state.sender ? '1%' : 0,
            marginTop: this.state.different ? "4%" : '1.2%',
            marginBottom: this.props.index <= 0 ? '2%' : 0,
            alignSelf: this.state.sender ? 'flex-start' : 'flex-end',
        }
        let color = this.state.sender ? ColorList.receivedBox : ColorList.senTBoxColor
        GeneralMessageBoxStyle = {
            maxWidth: 300, flexDirection: 'column', minWidth: 60,
            minHeight: 20, overflow: 'hidden', borderBottomLeftRadius: 5, borderColor: color,
            borderTopLeftRadius: this.state.sender ? 0 : 5,
            // borderWidth: this.props.message.text && this.props.message.type === "text" ? this.testForImoji(this.props.message.text)?.7:0:0,
            backgroundColor: color, ...shadower(1),
            borderTopRightRadius: 5,
            borderBottomRightRadius: this.state.sender ? 5 :
                this.props.message.reply && this.props.message.reply.type_extern ? 5 : null,
        }
        subNameStyle = {
            paddingBottom: 0,
            flexDirection: "row",
            margin: '2%',
            backgroundColor: this.props.message.text && this.props.message.type === "text" ? this.testForImoji(this.props.message.text) ? color : 'transparent' : 'transparent',
            // backgroundColor: color,
        }
        placeholderStyle = {
            ...topMostStyle, ...this.placeholderStyle,
            backgroundColor: color, borderBottomLeftRadius: 5, borderColor: color,
            borderTopLeftRadius: this.state.sender ? 0 : 5,// borderWidth: this.props.message.text && this.props.message.type === "text" ? this.testForImoji(this.props.message.text)?.7:0:0,
            backgroundColor: color, ...shadower(1),
            alignSelf: this.state.sender ? 'flex-start' : 'flex-end',
            borderTopRightRadius: 5,
        }
        reactionContanerStyle = {
            marginTop: 'auto',
            marginBottom: 'auto',
            width: 20,
            justifyContent: 'center',
        }
        nameTextStyle = { fontSize: 14, fontWeight: 'bold', color: ColorList.bodyText }
        return (this.props.message.type == 'date_separator' ? <View style={{ marginTop: '2%', marginBottom: '2%', }}>
            <DateView date={this.props.message.id}></DateView></View> :
            this.props.message.type == "new_separator" ? <View style={{
                marginTop: '2%',
                marginBottom: '2%'
            }}><NewSeparator newCount={this.props.newCount} data={this.props.message.id}></NewSeparator></View> :
                !this.state.loaded ? <View style={placeholderStyle}></View> : <View><View style={topMostStyle}>
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

                        <View style={{ flexDirection: 'row', }}>
                            {!this.state.sender ? <TouchableOpacity onLongPress={this.handLongPress.bind(this)} onPress={() => this.openReaction()} style={reactionContanerStyle}><Icon
                                style={{ fontSize: 12, color: 'gray' }}
                                type={"AntDesign"}
                                name={"meh"}></Icon></TouchableOpacity> : null}
                            <View onLayout={(e) => {
                                this.setState({
                                    containerDims : e.nativeEvent.layout
                                })
                                this.props.setCurrentLayout && this.props.setCurrentLayout(e.nativeEvent.layout)
                            }
                            } style={GeneralMessageBoxStyle}>
                                <View>
                                    {this.state.sender && this.state.different ? <TouchableOpacity onLongPress={this.handLongPress.bind(this)} onPress={() => requestAnimationFrame(() => {
                                        this.props.showProfile(this.props.message.sender.phone)
                                    })}><Text style={{ marginLeft: '2%', color: ColorList.iconActive }} note ellipsizeMode="tail" numberOfLines={1}>{this.state.sender_name}</Text></TouchableOpacity> : null}
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
                                            <View style={{ marginLeft: this.state.sender ? "2%" : 0, marginRight: this.state.sender ? 0 : "2%", }}>
                                                {this.chooseComponent(this.props.message, this.props.message.id, this.state.sender)}
                                            </View>
                                        </TouchableWithoutFeedback>

                                    </View>
                                    <TouchableWithoutFeedback onPressIn={() => {
                                        this.replying = true
                                    }} onLongPress={() => {
                                        this.handLongPress()
                                    }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <View>{!this.state.sender ? this.props.message.sent ? this.props.received ?
                                                <Icon style={this.iconStyles} type="Ionicons" name="ios-checkmark-circle">
                                                </Icon> : <Icon style={this.iconStyles} type={"EvilIcons"} name="check">
                                                </Icon> : <Icon style={{ ...this.iconStyles, color: "#FFF" }} type="MaterialCommunityIcons"
                                                    name="progress-check"></Icon> : null}
                                            </View>{this.state.time ? <View style={{ marginRight: "4%", }}><Text note>{this.state.time}</Text></View> : null}
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                            {this.state.sender ? <TouchableOpacity onLongPress={this.handLongPress.bind(this)} onPress={this.openReaction.bind(this)} style={{ ...reactionContanerStyle }}><Icon
                                style={{ fontSize: 12, color: 'gray', alignSelf: 'flex-end', }}
                                type={"AntDesign"}
                                name={"meh"}></Icon></TouchableOpacity> : null}
                        </View>

                    </Swipeout>
                </View>
                    <View style={{ position: 'absolute', width:  '100%', height: this.state.containerDims ? this.state.containerDims.height+10 : 40 }}>
                        <ReactionModal isOpen={this.state.isReacting} onClosed={() => {
                            this.setState({
                                isReacting: false
                            })
                        }}></ReactionModal>
                    </View>
                </View>
        )
    }
}