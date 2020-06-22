import React, { Component, PureComponent } from "react";
import {
    View,
    TouchableOpacity,
    Vibration,
    TouchableWithoutFeedback,
    TouchableHighlight,
} from "react-native";
import TextMessage from "./TextMessage";
import PhotoMessage from "./PhotoMessage";
import VideoMessage from "./VideoMessage";
import FileAttarchementMessaege from "./FileAttarchtmentMessage";
import AudioMessage from "./AudioMessage";
import { Left, Icon, Right, Text, Toast, Spinner } from "native-base";
import ReplyText from "./ReplyText";
import PhotoUploader from "./PhotoUploader";
import VideoUploader from "./VideoUploader";
import FileAttarchementUploader from "./FileAttarchmantUploader";
import AudioUploader from "./AudioUploader";
import TextMessageSnder from "./TextMessageSender";
import DateView from "./DateView";
import NewSeparator from "./NewSeparator";
import moment from "moment";
import shadower from "../../shadower";
import Voter from "./Voter";
import { find } from "lodash";
import { isEqual } from "lodash";
import formVoteOptions from "../../../services/formVoteOptions";
import ColorList from "../../colorList";
import ReactionModal from "./ReactionsModal";
import stores from "../../../stores";
import rounder from "../../../services/rounder";
import emitter from "../../../services/eventEmiter";
import { SwipeRow } from 'react-native-swipe-list-view';
import Votes from "../votes";

export default class Message extends Component {
    constructor(props) {
        super(props);
        let isDiff =
            this.props.message.sender &&
            this.props.PreviousMessage &&
            this.props.PreviousMessage.sender &&
            this.props.PreviousMessage.sender.phone !==
            this.props.message.sender.phone;
        this.state = {
            showTime: false,
            refresh: false,
            disabledSwipeout: true,
            openRight: true,
            sender_name:
                this.props.message &&
                this.props.message.sender &&
                this.props.message.sender.nickname,
            sender: !(
                this.props.message.sender &&
                this.props.message.sender.phone == this.props.user
            ),
            different: isDiff,
            time:
                /*!isDiff &&
                    this.props.PreviousMessage &&
                    this.props.PreviousMessage.type !== "date_separator" &&
                    moment(this.props.message.created_at).format("x") -
                    moment(this.props.PreviousMessage.created_at).format("x") <
                    1000 * 60
                    ? ""
                    : */moment(this.props.message.created_at).format("HH:mm"),
            creator:
                this.props.message.sender &&
                this.props.message.sender.phone == this.props.creator,
            replying: false,
            loaded: true,
        };
    }
    placeHolder = {
        audio: {
            height: 150,
            width: 250,
        },
        photo: {
            height: 250,
            width: 250,
        },
        video: {
            height: 250,
            width: 250,
        },
        attachement: {
            height: 150,
            width: 250,
        },
        vote: {
            height: 300,
            width: 250,
        },
        text: {
            height: 50,
            width: 100,
        },
    };
    chooseComponent(data, index, sender) {
        switch (data.type) {
            case "text":
                return (
                    <TextMessage
                        handleLongPress={() => this.handLongPress()}
                        pressingIn={() => {
                            this.replying = true;
                        }}
                        firebaseRoom={this.props.firebaseRoom}
                        user={2}
                        sender={sender}
                        index={index}
                        creator={2}
                        message={data}
                    ></TextMessage>
                );
            case "text_sender":
                return (
                    <TextMessageSnder
                        sendMessage={(message) => this.props.sendMessage(message)}
                        firebaseRoom={this.props.firebaseRoom}
                        user={2}
                        sender={sender}
                        index={index}
                        creator={3}
                        message={data}
                    ></TextMessageSnder>
                );
            case "photo":
                return (
                    <PhotoMessage
                        room={this.props.room}
                        handleLongPress={() => this.handLongPress()}
                        pressingIn={() => {
                            this.replying = true;
                            // this.props.hideAndshow()
                        }}
                        firebaseRoom={this.props.firebaseRoom}
                        showPhoto={(url) => this.props.showPhoto(url)}
                        user={2}
                        sender={sender}
                        index={index}
                        creator={2}
                        message={data}
                    ></PhotoMessage>
                );
            case "audio":
                return (
                    <AudioMessage
                        handleLongPress={() => this.handLongPress()}
                        room={this.props.room}
                        pressingIn={() => {
                            this.replying = true;
                            //this.props.hideAndshow()
                        }}
                        index={index}
                        sender={sender}
                        message={data}
                    ></AudioMessage>
                );
            case "video":
                return (
                    <VideoMessage
                        handleLongPress={() => this.handLongPress()}
                        pressingIn={() => {
                            this.replying = true;
                        }}
                        room={this.props.room}
                        index={index}
                        sender={sender}
                        playVideo={(video) => {
                            this.props.playVideo(video);
                        }}
                        message={data}
                    ></VideoMessage>
                );
            case "attachement":
                return (
                    <FileAttarchementMessaege
                        handleLongPress={() => this.handLongPress()}
                        room={this.props.room}
                        sender={sender}
                        index={index}
                        message={data}
                    ></FileAttarchementMessaege>
                );
            case "photo_upload":
                return (
                    <PhotoUploader
                        room={this.props.room}
                        showPhoto={(photo) => this.props.showPhoto(photo)}
                        replaceMessage={(data) => this.props.replaceMessage(data)}
                        sender={false}
                        index={index}
                        message={data}
                    ></PhotoUploader>
                );
            case "video_upload":
                return (
                    <VideoUploader
                        playVideo={(video) => this.props.playVideo(video)}
                        replaceMessage={(data) => this.props.replaceMessageVideo(data)}
                        message={data}
                        playVideo={(video) => this.props.playVideo(video)}
                        index={index}
                        sender={false}
                    ></VideoUploader>
                );
            case "attachement_upload":
                return (
                    <FileAttarchementUploader
                        room={this.props.room}
                        index={index}
                        message={data}
                        replaceMessage={(data) => this.props.replaceMessageFile(data)}
                    ></FileAttarchementUploader>
                );
            case "audio_uploader":
                return (
                    <AudioUploader
                        room={this.props.room}
                        message={data}
                        index={data.id}
                        replaceMessage={(data) => this.props.replaceAudioMessage(data)}
                    ></AudioUploader>
                );
            default:
                return null;
        }
    }
    voteCreator = null;
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loaded: true,
            });
        }, 5 * this.props.delay);
    }
    slept = false;
    timeoutID = null;
    closing = 0;
    perviousTime = 0;
    duration = 10;
    longPressDuration = 50;
    pattern = [1000, 0, 0];
    choseReply() {
        let nickname = this.props.message.sender && this.props.message.sender.nickname
        switch (this.props.message.type) {
            case "text":
                tempMessage = this.props.message;
                tempMessage.replyer_name = nickname;
                return tempMessage;
            case "audio":
                tempMessage = this.props.message;
                tempMessage.audio = true;
                tempMessage.replyer_name = nickname;
                return tempMessage;
            case "video":
                tempMessage = this.props.message;
                tempMessage.video = true;
                tempMessage.sourcer = this.props.message.thumbnailSource;
                tempMessage.replyer_name = nickname;
                return tempMessage;
            case "attachement":
                tempMessage = this.props.message;
                tempMessage.replyer_name = nickname;
                tempMessage.file = true;
                let temp = this.props.message.file_name.split(".");
                let temper = tempMessage;
                temper.typer = temp[temp.length - 1];
                return temper;
            //tempMessage = temper
            case "photo":
                tempMessage = this.props.message;
                tempMessage.replyer_name = nickname;
                tempMessage.sourcer = this.props.message.source;
                return tempMessage;
            /*case "vote":
                let vote =
                    this.props.message.vote &&
                        this.props.votes &&
                        this.props.votes.length > 0
                        ? this.props.votes[this.props.message.vote.index] &&
                            this.props.votes[this.props.message.vote.index].id ===
                            this.props.message.id
                            ? this.props.votes[this.props.message.vote.index]
                            : find(this.props.votes, { id: this.props.message.vote.id })
                        : null;
                return {
                    id: vote.id,
                    type_extern: "Votes",
                    title: `${vote.title} : \n ${vote.description} \n\n ${formVoteOptions(
                        vote
                    )}`,
                    replyer_phone: this.props.user.phone,
                };*/
            default:
                Toast.show({ text: "unable to reply for unsent messages" });
                return null
        }
    }
    handleReply() {
        Vibration.vibrate(this.duration);
        let color = this.state.sender ? "#DEDEDE" : "#9EEDD3";
        let reply = this.choseReply()
        reply && this.props.replying(reply)
    }
    testReactions = [];
    renderMessageReactions(sender) {
        return this.props.message.reaction
            ? this.props.message.reaction.map((ele) => this.reaction(sender, ele))
            : this.testReactions.map((ele) => this.reaction(sender, ele));
    }
    reactions(sender) {
        return (
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}
            >
                {this.renderMessageReactions(sender)}
            </View>
        );
    }
    reaction(sender, element) {
        return (
            <View style={{ flexDirection: "column" }}>
                <TouchableOpacity
                    onPress={() =>
                        requestAnimationFrame(() => {
                            this.props.showReacters(element.reaction, element.reacters);
                        })
                    }
                    style={{
                        ...rounder(20, true),
                        marginTop: sender ? "-25%" : 0,
                        marginBottom: !sender ? "-25%" : 0,
                        borderWidth: 1,
                        borderColor: sender
                            ? ColorList.senTBoxColor
                            : ColorList.receivedBox,
                        flexDirection: "row",
                    }}
                >
                    <View>
                        <Text style={{ textAlign: "center" }}>{element.reaction}</Text>
                    </View>
                    {element.count > 1 ? (
                        <View
                            style={{
                                position: "absolute",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 7,
                                    fontWeight: "italic",
                                    fontWeight: "bold",
                                    color: ColorList.indicatorColor,
                                }}
                                note
                            >{`+${element.count}`}</Text>
                        </View>
                    ) : null}
                </TouchableOpacity>
            </View>
        );
    }
    prevVote = null;
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (
            this.props.message.sent !== nextProps.message.sent ||
            this.props.received !== nextProps.received ||
            this.props.isfirst !== nextProps.isfirst ||
            this.state.loaded !== nextState.loaded ||
            /*(this.props.messagelayouts &&
                this.props.messagelayouts[this.props.message.id] !==
                nextProps.messagelayouts[nextProps.message.id]) ||*/
            this.state.refresh !== nextState.refresh ||
            this.state.isReacting !== nextState.isReacting
        );
    }
    refresh() {
        this.setState({
            refresh: !this.state.refresh,
        });
    }
    event = "updated" + this.props.message.id;
    componentWillMount() {
        emitter.on(this.event, () => {
            console.warn("receiving message update")
            this.refresh();
        });
    }
    componentWillUnmount() {
        emitter.off(this.event);
    }
    iconStyles = {
        fontSize: 12,
        color: "#1FABAB",
        marginLeft: 5,
        paddingTop: 1,
        //marginTop: "-2%",
        marginBottom: 3,
    };
    handLongPress() {
        this.replying = false;
        let reply = this.choseReply()
        this.props.showActions(this.props.message, reply);
        Vibration.vibrate(this.longPressDuration);
    }
    testForImoji(message) {
        let imoji = message.match(
            /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu
        );
        return imoji && imoji.length == 1 && message.length == imoji[0].length;
    }
    isVote() {
        return this.props.message.type === "vote";
    }
    handlePress(){
        switch(this.props.message.type){
            case "video":
                this.props.playVideo(this.props.message.source)
                break;
            case "photo":
                this.props.showPhoto(this.props.message.photo)
                break;
            default:
             console.warn("message pressed")
        }
    }
    startReactionShowTimer() {
        this.reactionsTimer && clearInterval(this.reactionsTimer);
        this.setState({
            isReacting: true,
        });
        this.reactionsTimer = setTimeout(() => {
            this.setState({
                isReacting: false,
            });
        }, this.reactionTiming);
    }
    reactionTiming = 3000;
    openReaction() {
        requestAnimationFrame(() => {
            this.startReactionShowTimer();
        });
    }
    placeholderStyle = this.props.message.dimensions
        ? this.props.message.dimensions
        : this.props.messagelayouts &&
            this.props.messagelayouts[this.props.message.id]
            ? this.props.messagelayouts[this.props.message.id]
            : this.placeHolder[this.props.message.type];
    render() {
        let topMostStyle = {
            marginLeft: this.state.sender ? "1%" : 0,
            marginRight: !this.state.sender ? "1%" : 0,
            marginTop: this.state.different ? "4%" : "1.2%",
            marginBottom: this.props.index <= 0 ? "2%" : 0,
            alignSelf: this.state.sender ? "flex-start" : "flex-end",
        };
        let color = this.state.sender
            ? ColorList.receivedBox
            : ColorList.senTBoxColor;
        let GeneralMessageBoxStyle = {
            maxWidth: 300,
            flexDirection: "column",
            minWidth: 60,
            minHeight: 20,
            overflow: "hidden",
            borderBottomLeftRadius: ColorList.chatboxBorderRadius,
            borderColor: color,
            borderTopLeftRadius: this.state.sender
                ? 0
                : ColorList.chatboxBorderRadius,
            backgroundColor: color,
            ...shadower(1),
            borderTopRightRadius: ColorList.chatboxBorderRadius,
            borderBottomRightRadius: this.state.sender
                ? ColorList.chatboxBorderRadius
                : this.props.message.reply && this.props.message.reply.type_extern
                    ? ColorList.chatboxBorderRadius
                    : null,
        };
        let subNameStyle = {
            paddingBottom: 0,
            flexDirection: "row",
            margin: "2%",
            backgroundColor:
                this.props.message.text && this.props.message.type === "text"
                    ? this.testForImoji(this.props.message.text)
                        ? color
                        : "transparent"
                    : "transparent",
            // backgroundColor: color,
        };
        placeholderStyle = {
            ...topMostStyle,
            ...this.placeholderStyle,
            backgroundColor: color,
            borderBottomLeftRadius: ColorList.chatboxBorderRadius,
            borderColor: color,
            borderTopLeftRadius: this.state.sender
                ? 0
                : ColorList.chatboxBorderRadius, // borderWidth: this.props.message.text && this.props.message.type === "text" ? this.testForImoji(this.props.message.text)?.7:0:0,
            backgroundColor: 'transparent',
            alignSelf: this.state.sender ? "flex-start" : "flex-end",
            borderTopRightRadius: ColorList.chatboxBorderRadius,
        };
        let reactionContanerStyle = {
            marginTop: "auto",
            marginBottom: "auto",
            width: 20,
            justifyContent: "center",
        };
        let nameTextStyle = {
            fontSize: 14,
            fontWeight: "bold",
            color: ColorList.bodyText,
        };
        return <View onLayout={(e) => {
            this.setState({
                containerDims: e.nativeEvent.layout,
            });
            this.props.setCurrentLayout &&
                this.props.setCurrentLayout(e.nativeEvent.layout);
        }}>{this.props.message.type == "date_separator" ? (
            <View style={{ marginTop: "2%", marginBottom: "2%" }}>
                <DateView date={this.props.message.id}></DateView>
            </View>
        ) : this.props.message.type == "new_separator" ? (
            <View
                style={{
                    marginTop: "2%",
                    marginBottom: "2%",
                }}
            >
                <NewSeparator
                    newCount={this.props.newCount}
                    data={this.props.message.id}
                ></NewSeparator>
            </View>
        ) : !this.state.loaded ? (
            <View style={placeholderStyle}></View>
        ) : (
                        <View>
                            <View style={topMostStyle}>
                                {!this.state.sender ? (
                                    <View style={{ alignSelf: "flex-end" }}>
                                        {this.reactions(this.state.sender)}
                                    </View>
                                ) : null}
                                <SwipeRow
                                    swipeGestureEnded={(key, data) => {
                                        if (data.translateX >= 50) {
                                            this.handleReply()
                                        } else if (data.translateX <= -50) {
                                            Vibration.vibrate([100, 0, 0, 100])
                                            this.props.forwardMessage()
                                        }
                                    }}
                                    leftOpenValue={0}
                                    rightOpenValue={0}
                                    swipeToClosePercent={50}
                                    style={{ backgroundColor: "transparent", width: "100%" }}
                                >
                                    <View
                                        style={{
                                            marginTop: 'auto',
                                            marginBottom: 'auto',
                                            alignSelf: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            width: "90%",
                                        }}>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignSelf: !this.state.sender ? "flex-end" : "flex-start",
                                        }}
                                    >
                                        {this.state.time && !this.state.sender ? (
                                            <View style={{ margin: '1%', ...reactionContanerStyle, width: 30, marginBottom: null, }}>
                                                <Text note>{this.state.time}</Text>
                                            </View>
                                        ) : null}
                                        <View

                                            style={GeneralMessageBoxStyle}
                                        >
                                            <View>
                                                {this.props.message.forwarded ? (
                                                    <Text
                                                        style={{
                                                            fontStyle: "italic",
                                                            marginLeft: "2%",
                                                            fontSize: 10,
                                                        }}
                                                        note
                                                    >
                                                        {"(forwarded)"}
                                                    </Text>
                                                ) : null}
                                                {this.state.sender && this.state.different ? (
                                                    <TouchableOpacity
                                                        onLongPress={this.handLongPress.bind(this)}
                                                        onPress={() =>
                                                            requestAnimationFrame(() => {
                                                                this.props.showProfile(
                                                                    this.props.message.sender.phone
                                                                );
                                                            })
                                                        }
                                                    >
                                                        <Text
                                                            style={{
                                                                marginLeft: "2%",
                                                                color: ColorList.iconActive,
                                                            }}
                                                            note
                                                            ellipsizeMode="tail"
                                                            numberOfLines={1}
                                                        >
                                                            {this.state.sender_name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ) : null}
                                                <View>
                                                    {this.props.message.reply ? (
                                                        <View
                                                            style={{
                                                                padding: "1%",
                                                                alignItems: 'center',
                                                                alignSelf: 'center',
                                                                marginTop: ".4%",
                                                                width: this.props.message && 
                                                                (this.props.message.type == "photo" ||
                                                                    this.props.message.type == "video" ||
                                                                    this.props.message.type == "video_upload" ||
                                                                    this.props.message.type == "photo_upload") ? 250 : "100%",
                                                            }}
                                                        >
                                                            <ReplyText
                                                                handLongPress={() => this.handLongPress()}
                                                                showProfile={(pro) => this.props.showProfile(pro)}
                                                                pressingIn={() => {
                                                                    this.replying = true;
                                                                }}
                                                                openReply={(replyer) => {
                                                                    replyer.isThisUser = !this.state.sender;
                                                                    this.props.message.reply &&
                                                                        this.props.message.reply.type_extern
                                                                        ? this.props.handleReplyExtern(
                                                                            this.props.message.reply
                                                                        )
                                                                        : this.props.openReply(replyer);
                                                                }}
                                                                reply={this.props.message.reply}
                                                            ></ReplyText>
                                                        </View>
                                                    ) : null}
                                                    <TouchableWithoutFeedback
                                                    onPress={this.handlePress.bind(this)}
                                                        onLongPress={() => {
                                                            this.handLongPress();
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                marginLeft: '1%',
                                                                marginRight: '1%',
                                                            }}
                                                        >
                                                            {this.chooseComponent(
                                                                this.props.message,
                                                                this.props.message.id,
                                                                this.state.sender
                                                            )}
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                    }}
                                                >
                                                    <View>
                                                        {!this.state.sender && this.props.isfirst ? (
                                                            this.props.message.sent ? (
                                                                this.props.received ? (
                                                                    <Icon
                                                                        style={this.iconStyles}
                                                                        type="Ionicons"
                                                                        name="ios-checkmark-circle"
                                                                    ></Icon>
                                                                ) : (
                                                                        <Icon
                                                                            style={this.iconStyles}
                                                                            type={"EvilIcons"}
                                                                            name="check"
                                                                        ></Icon>
                                                                    )
                                                            ) : (
                                                                    <Icon
                                                                        style={{ ...this.iconStyles, color: "#FFF" }}
                                                                        type="MaterialCommunityIcons"
                                                                        name="progress-check"
                                                                    ></Icon>
                                                                )
                                                        ) : null}
                                                    </View>
                                                </View>
                                                {this.state.sender ? <View style={{ alignSelf: 'flex-start', }}>{this.reactions(this.state.sender)}</View> : null}
                                            </View>
                                        </View>
                                        {this.state.sender ? (
                                            <TouchableOpacity
                                                onLongPress={this.handLongPress.bind(this)}
                                                onPress={this.openReaction.bind(this)}
                                                style={{
                                                    ...reactionContanerStyle,
                                                    ...rounder(13, ColorList.bodyBackground),
                                                    marginLeft: 5,
                                                }}
                                            >
                                                <Icon
                                                    style={{
                                                        fontSize: 12,
                                                        color: "gray",
                                                        alignSelf: "flex-end",
                                                    }}
                                                    type={"AntDesign"}
                                                    name={"meh"}
                                                ></Icon>
                                            </TouchableOpacity>
                                        ) : null}
                                        {this.state.time && this.state.sender ? (
                                            <View style={{ alignItems: 'flex-end', ...reactionContanerStyle, width: 30, marginBottom: null, marginLeft: -10, }}>
                                                <Text note>{this.state.time}</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                </SwipeRow>
                            </View>
                            {this.state.isReacting ? (
                                <View
                                    style={{
                                        ...shadower(2),
                                        position: "absolute",
                                        width: 300,
                                        alignSelf: "flex-end",
                                        height: this.state.containerDims
                                            ? this.state.containerDims.height + 10
                                            : 40,
                                        justifyContent: "flex-end",
                                        margin: "2%",
                                    }}
                                >
                                    <ReactionModal
                                        pressingIn={() => {
                                            this.startReactionShowTimer();
                                        }}
                                        react={(reaction) =>
                                            this.props.react(this.props.message.id, reaction)
                                        }
                                        isOpen={this.state.isReacting}
                                        onClosed={() => {
                                            this.setState({
                                                isReacting: false,
                                            });
                                            clearInterval(this.reactionsTimer);
                                        }}
                                    ></ReactionModal>
                                </View>
                            ) : null}
                        </View>
                    )}</View>;
    }
}
