import React, { Component, PureComponent } from "react";
import {
    View,
    TouchableOpacity,
    Vibration,
    TouchableHighlight,
    Text,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import TextMessage from "./TextMessage";
import PhotoMessage from "./PhotoMessage";
import VideoMessage from "./VideoMessage";
import FileAttarchementMessaege from "./FileAttarchtmentMessage";
import AudioMessage from "./AudioMessage";
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
import ColorList from "../../colorList";
import ReactionModal from "./ReactionsModal";
import stores from "../../../stores";
import rounder from "../../../services/rounder";
import { SwipeRow } from "react-native-swipe-list-view";
import BeComponent from "../../BeComponent";
import Vibrator from "../../../services/Vibrator";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialIconCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import BleashupShapes from "../../mainComponents/BleashupShapes";
import message_types from "./message_types";
import Requester from "./Requester";
import GState from "../../../stores/globalState";
import ChatUser from './ChatUser';
import { showHighlightForScrollToIndex } from './highlightServices';
import RemindMessage from "./RemindMessage";
import StarMessage from "./StarMessage";
import RelationMessage from "./RelationMessage";
import MessageState from "./MessageState";
import Texts from '../../../meta/text';

export default class Message extends BeComponent {
    constructor(props) {
        super(props);
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
                this.props.message && this.props.message.sender &&
                this.props.message.sender.phone == this.props.user
            ),
            different:
                this.props.PreviousMessage.sender &&
                this.props.message.sender &&
                this.props.PreviousMessage.sender.phone !==
                this.props.message.sender.phone,
            time: /*!isDiff &&
                    this.props.PreviousMessage &&
                    this.props.PreviousMessage.type !== "date_separator" &&
                    moment(this.props.message.created_at).format("x") -
                    moment(this.props.PreviousMessage.created_at).format("x") <
                    1000 * 60
                    ? ""
                    : */ moment(
                this.props.message.created_at
            ).format("HH:mm"),
            creator:
                this.props.message.sender &&
                this.props.message.sender.phone == this.props.creator,
            replying: false,
            loaded: true,
        };
    }
    chooseComponent(data, index, sender) {
        const types = {
            [message_types.text]: <TextMessage
                //handleLongPress={() => this.handLongPress()}
                animate={this.props.animate}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                pressingIn={() => {
                    this.handlePressIn();
                    this.replying = true;
                }}
                firebaseRoom={this.props.firebaseRoom}
                user={2}
                sender={sender}
                index={index}
                creator={2}
                message={data}
            ></TextMessage>,
            [message_types.text_sender]: <TextMessageSnder
                animate={this.props.animate}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                //onLongPress={this.handLongPress.bind(this)}
                sendMessage={(message) => this.props.sendMessage(message)}
                firebaseRoom={this.props.firebaseRoom}
                user={2}
                sender={sender}
                index={index}
                creator={3}
                message={data}
            ></TextMessageSnder>,
            [message_types.photo]: <PhotoMessage
                animate={this.props.animate}
                room={this.props.room}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                //handleLongPress={() => this.handLongPress()}
                pressingIn={() => {
                    this.replying = true;
                    this.handlePressIn();
                }}
                firebaseRoom={this.props.firebaseRoom}
                showPhoto={(url) => this.props.showPhoto(url)}
                user={2}
                sender={sender}
                index={index}
                creator={2}
                message={data}
            ></PhotoMessage>,
            [message_types.audio]: <AudioMessage
                animate={this.props.animate}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                //handleLongPress={() => this.handLongPress()}
                allplayed={this.props.allplayed}
                room={this.props.room}
                pressingIn={() => {
                    this.replying = true;
                    this.handlePressIn();
                }}
                activity_id={this.props.activity_id}
                index={index}
                sender={sender}
                message={data}
            ></AudioMessage>,
            [message_types.video]: <VideoMessage
                animate={this.props.animate}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                //handleLongPress={() => this.handLongPress()}
                pressingIn={() => {
                    this.replying = true;
                    this.handlePressIn();
                }}
                room={this.props.room}
                index={index}
                sender={sender}
                playVideo={(video) => {
                    this.props.playVideo(video);
                }}
                message={data}
            ></VideoMessage>,
            [message_types.file]: <FileAttarchementMessaege
                animate={this.props.animate}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                pressingIn={() => {
                    this.handlePressIn();
                }}
                //handleLongPress={() => this.handLongPress()}
                room={this.props.room}
                sender={sender}
                index={index}
                message={data}
            ></FileAttarchementMessaege>,
            [message_types.photo_sender]: <PhotoUploader
                animate={this.props.animate}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                room={this.props.room}
                //onLongPress={this.handLongPress.bind(this)}
                showPhoto={(photo) => this.props.showPhoto(photo)}
                replaceMessage={(data) => this.props.replaceMessage(data)}
                sender={false}
                index={index}
                message={data}
            ></PhotoUploader>,
            [message_types.video_sender]: <VideoUploader
                animate={this.props.animate}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                //onLongPress={this.handLongPress.bind(this)}
                playVideo={(video) => this.props.playVideo(video)}
                replaceMessage={(data) => this.props.replaceMessageVideo(data)}
                message={data}
                playVideo={(video) => this.props.playVideo(video)}
                index={index}
                sender={false}
            ></VideoUploader>,
            [message_types.filesender]: <FileAttarchementUploader
                animate={this.props.animate}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                room={this.props.room}
                index={index}
                //onLongPress={this.handLongPress.bind(this)}
                message={data}
                replaceMessage={(data) => this.props.replaceMessageFile(data)}
            ></FileAttarchementUploader>,
            [message_types.audio_sender]: <AudioUploader
                animate={this.props.animate}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                //onLongPress={this.handLongPress.bind(this)}
                room={this.props.room}
                message={data}
                index={data.id}
                replaceMessage={(data) => this.props.replaceAudioMessage(data)}
            ></AudioUploader>,
            [message_types.remind_message]: <RemindMessage
                onPress={this.props.showRemindMessage}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                message={data}>
            </RemindMessage>,
            [message_types.star_message]: <StarMessage
                onPress={this.props.showStarMessage}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                message={data}
            >
            </StarMessage>,
            [message_types.relation_message]: <RelationMessage
                onPress={this.props.showRelation}
                searchString={this.props.searchString}
                foundString={this.props.foundString}
                message={data}
            >
            </RelationMessage>
        }
        return types[data.type]
    }

    voteCreator = null;
    componentDidMount() {
        setTimeout(() => {
            this.setStatePure({
                loaded: true,
            });
        }, 5 * this.props.delay);
        let showHighlight = showHighlightForScrollToIndex.bind(this)
        showHighlight()
        setTimeout(() => {
            if (
                !stores.Messages.haveIseen(
                    this.props.message,
                    stores.LoginStore.user.phone
                )
            ) {
                //console.warn("sending seen message ", this.props.message.id)
                this.props.message.id && Requester.seenMessage(
                    this.props.message.id,
                    this.props.firebaseRoom,
                    this.props.activity_id
                );
            }
        }, this.props.delay * 1000);
    }
    slept = false;
    timeoutID = null;
    closing = 0;
    perviousTime = 0;
    longPressDuration = 50;
    pattern = [1000, 0, 0];
    handleReply() {
        this.props.replying(this.props.message);
    }
    testReactions = [];
    renderMessageReactions(sender) {
        return this.props.message.reaction
            ? this.props.message.reaction.map((ele, index) => this.reaction(sender, ele, index))
            : this.testReactions.map((ele, index) => this.reaction(sender, ele, index));
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
    reaction(sender, element, index) {
        return (
            <View key={element.reaction + index} style={{ flexDirection: "column" }}>
                <TouchableOpacity
                    onPress={() =>
                        requestAnimationFrame(() => {
                            this.props.showReacters(element.reaction, element.reacters);
                        })
                    }
                    style={{
                        ...rounder(20, ColorList.transparent),
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
        let shoulUpdate =
            this.props.state !== nextProps.state ||
                this.state.refresh !== nextState.refresh ||
                this.state.isReacting !== nextState.isReacting
                ? true
                : false;
        return shoulUpdate;
    }
    refresh() {
        this.setStatePure({
            refresh: !this.state.refresh,
        });
    }
    handLongPress() {
        this.replying = false;
        let reply = this.props.choseReply(this.props.message);
        this.props.showActions(this.props.message, reply, !this.state.sender);
        Vibrator.vibrateLong();
    }
    isVote() {
        return this.props.message.type === "vote";
    }
    handlePress() {
        switch (this.props.message.type) {
            case message_types.video:
                this.props.playVideo(this.props.message.source);
                break;
            case message_types.photo:
                this.props.showPhoto(this.props.message.photo);
                break;
            case message_types.remind_message:
                this.props.handleRemindPress()
                break;
            case message_types.star_message:
                this.props.handleStarPress()
                break;
            default:
                null; //console.warn("message pressed")
        }
    }
    startReactionShowTimer() {
        this.reactionsTimer && clearInterval(this.reactionsTimer);
        this.setStatePure({
            isReacting: true,
        });
        this.reactionsTimer = setTimeout(() => {
            this.setStatePure({
                isReacting: false,
            });
            clearTimeout(this.reactionsTimer);
        }, this.reactionTiming);
    }
    reactionTiming = 3000;
    openReaction() {
        requestAnimationFrame(() => {
            this.startReactionShowTimer();
        });
    }
    handlePressIn() {
        if (this.showReactionInterval) clearInterval(this.showReactionInterval);
        this.setStatePure({
            refresh: !this.state.refresh,
            showReacter: true,
        });
        this.showReactionInterval = setInterval(() => {
            this.setStatePure({
                refresh: !this.state.refresh,
                showReacter: false,
            });
        }, 2000);
    }
    rendermessageState(color) {
        return <MessageState
            color={this.state.color}
            sent={this.props.message.sent}
            received={this.props.received}
            seen={this.props.seen}
        >
        </MessageState>

    }
    render() {
        let showName = this.state.sender && this.state.different;
        let topMostStyle = {
            marginLeft: this.state.sender ? "1%" : 0,
            opacity: this.props.isPointed ? 0.4 : 1,
            marginRight: !this.state.sender ? "1%" : 0,
            marginTop: this.state.different ? "4%" : "1.2%",
            marginBottom: this.props.index <= 0 ? "2%" : 0,
            alignSelf: this.state.sender ? "flex-start" : "flex-end",
        };
        let color = this.state.sender
            ? ColorList.receivedBox
            : ColorList.senTBoxColor[ColorList.sendRand()];
        let timeColor = !this.state.sender ? 
        ColorList.transparentReceivedBox:
        ColorList.transparentReceivedBox
        let GeneralMessageBoxStyle = {
            maxWidth: GState.width * .78,
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
            margin: "2%"
            // backgroundColor: color,
        };
        placeholderStyle = {
            ...topMostStyle,
            backgroundColor: color,
            borderBottomLeftRadius: ColorList.chatboxBorderRadius,
            borderColor: color,
            borderTopLeftRadius: this.state.sender
                ? 0
                : ColorList.chatboxBorderRadius,
            backgroundColor: "transparent",
            alignSelf: this.state.sender ? "flex-start" : "flex-end",
            borderTopRightRadius: ColorList.chatboxBorderRadius,
        };
        let reactionContanerStyle = {
            marginTop: "auto",
            marginBottom: "auto",
            width: 30,
            justifyContent: "center",
        };
        let nameTextStyle = {
            fontSize: 14,
            fontWeight: "bold",
            color: ColorList.bodyText,
        };
        let timeContainerStyle = {
            marginRight: "1%",
            padding: 2,
            ...reactionContanerStyle,
            borderRadius: 20,
            backgroundColor: timeColor,
            ...shadower(1),
            alignItems: 'center',
            marginBottom: null,
        }
        let timestyle = {
            ...GState.defaultTextStyle,
            fontSize: 9, fontStyle: "italic", fontWeight: '500',
        }
        return (
            <View
                onLayout={(e) => {
                    this.setStatePure({
                        containerDims: e.nativeEvent.layout,
                    });
                }}
            >
                {this.props.message.type == message_types.date_separator ? (
                    <View style={{ marginTop: "2%", marginBottom: "2%" }}>
                        <DateView date={this.props.message.id}></DateView>
                    </View>
                ) : this.props.message.type == message_types.new_separator ? (
                    <View
                        style={{
                            marginTop: "2%",
                            width: "100%",
                            marginBottom: "2%",
                        }}
                    >
                        <NewSeparator
                            room={this.props.room}
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
                                                    this.handleReply();
                                                } else if (data.translateX <= -50) {
                                                    Vibrator.vibrateLong();
                                                    this.handLongPress();
                                                }
                                            }}
                                            leftOpenValue={0}
                                            rightOpenValue={0}
                                            swipeToClosePercent={50}
                                            style={{ backgroundColor: "transparent", width: "100%" }}
                                        >
                                            <View
                                                style={{
                                                    marginTop: "auto",
                                                    marginBottom: "auto",
                                                    alignSelf: "center",
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    width: "90%",
                                                }}
                                            ></View>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignSelf: !this.state.sender ? "flex-end" : "flex-start",
                                                }}
                                            >
                                                {this.state.time && !this.state.sender ? (
                                                    <View
                                                        style={timeContainerStyle}
                                                    >
                                                        <Text style={timestyle}>
                                                            {this.state.time}
                                                        </Text>
                                                    </View>
                                                ) : null}
                                                {!this.state.sender && this.props.isfirst ? (
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "flex-end",
                                                            width: 20,
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        {this.rendermessageState(color)}
                                                    </View>
                                                ) : null}
                                                <View style={GeneralMessageBoxStyle}>
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
                                                                {'(' + Texts.forwarded + ') ' + (this.props.message.report ? ('(' + Texts.report + ')'):'')}
                                                            </Text>
                                                        ) : null}
                                                        {this.state.different &&
                                                            this.state.sender &&
                                                            !this.props.isRelation ? (
                                                                <ChatUser
                                                                    searchString={this.props.searchString}
                                                                    foundString={this.props.foundString}
                                                                    phone={this.props.message && this.props.message.sender &&
                                                                        this.props.message.sender.phone}
                                                                    onPressIn={this.handlePressIn.bind(this)}
                                                                    showProfile={() => {
                                                                        requestAnimationFrame(() => {
                                                                            this.props.showProfile(
                                                                                this.props.message.sender.phone
                                                                            );
                                                                        })
                                                                    }}
                                                                />
                                                            ) : null}
                                                        <View>
                                                            {this.props.message.reply ? (
                                                                <View
                                                                    style={{
                                                                        alignItems: "center",
                                                                        alignSelf: "center",
                                                                        marginTop: ".4%",
                                                                        width: "99%",
                                                                    }}
                                                                >
                                                                    <ReplyText
                                                                        //handLongPress={() => this.handLongPress()}
                                                                        showProfile={(pro) => this.props.showProfile(pro)}
                                                                        pressingIn={() => {
                                                                            this.handlePressIn();
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
                                                                onPressIn={this.handlePressIn.bind(this)}
                                                                //onPress={this.handlePress.bind(this)}
                                                                style={{ flex: 1 }}
                                                                onLongPress={() => {
                                                                    this.handLongPress();
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        marginLeft: "1%",
                                                                        marginRight: "1%",
                                                                        flex: 1,
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
                                                        {this.state.sender ? (
                                                            <View style={{ alignSelf: "flex-start" }}>
                                                                {this.reactions(this.state.sender)}
                                                            </View>
                                                        ) : null}
                                                    </View>
                                                </View>
                                                {this.state.sender && this.state.showReacter ? (
                                                    <TouchableOpacity
                                                        //onLongPress={this.handLongPress.bind(this)}
                                                        onPress={this.openReaction.bind(this)}
                                                    >
                                                        <View
                                                            style={{
                                                                ...reactionContanerStyle,
                                                                ...rounder(17, color),
                                                                marginLeft: 5,
                                                            }}
                                                        >
                                                            <AntDesign
                                                                style={{
                                                                    fontSize: 15,
                                                                    color: ColorList.indicatorColor,
                                                                    alignSelf: "flex-end",
                                                                }}
                                                                type={"AntDesign"}
                                                                name={"meh"}
                                                            />
                                                        </View>
                                                    </TouchableOpacity>
                                                ) : null}
                                                {this.state.time && this.state.sender ? (
                                                    <View
                                                        style={{
                                                            alignItems: "flex-end",
                                                            marginLeft: 5,
                                                            ...timeContainerStyle
                                                        }}
                                                    >
                                                        <Text style={timestyle}>
                                                            {this.state.time}
                                                        </Text>
                                                    </View>
                                                ) : null}
                                            </View>
                                        </SwipeRow>
                                    </View>
                                    {this.state.isReacting ? (
                                        <View
                                            style={{
                                                position: "absolute",
                                                width: GState.width * .90,
                                                alignSelf: "center",
                                                height: this.state.containerDims
                                                    ? this.state.containerDims.height + 10
                                                    : 40,
                                                justifyContent: "center",
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
                                                    this.setStatePure({
                                                        isReacting: false,
                                                    });
                                                    clearInterval(this.reactionsTimer);
                                                }}
                                            ></ReactionModal>
                                        </View>
                                    ) : null}
                                </View>
                            )}
            </View>
        );
    }
}
