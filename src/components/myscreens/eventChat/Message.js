import React, { Component, PureComponent } from "react";
import {
    View,
    TouchableOpacity,
    Vibration,
    TouchableWithoutFeedback,
    TouchableHighlight,
    Text,
} from "react-native";
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
import emitter from "../../../services/eventEmiter";
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
                this.props.message.sender &&
                this.props.message.sender.phone == this.props.user
            ),
            different:
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
            case message_types.text:
                return (
                    <TextMessage
                        //handleLongPress={() => this.handLongPress()}
                        searchString={this.props.searchString}
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
                    ></TextMessage>
                );
            case message_types.text_sender:
                return (
                    <TextMessageSnder
                        searchString={this.props.searchString}
                        //onLongPress={this.handLongPress.bind(this)}
                        sendMessage={(message) => this.props.sendMessage(message)}
                        firebaseRoom={this.props.firebaseRoom}
                        user={2}
                        sender={sender}
                        index={index}
                        creator={3}
                        message={data}
                    ></TextMessageSnder>
                );
            case message_types.photo:
                return (
                    <PhotoMessage
                        room={this.props.room}
                        searchString={this.props.searchString}
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
                    ></PhotoMessage>
                );
            case message_types.audio:
                return (
                    <AudioMessage
                        searchString={this.props.searchString}
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
                    ></AudioMessage>
                );
            case message_types.video:
                return (
                    <VideoMessage
                        searchString={this.props.searchString}
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
                    ></VideoMessage>
                );
            case message_types.file:
                return (
                    <FileAttarchementMessaege
                        searchString={this.props.searchString}
                        pressingIn={() => {
                            this.handlePressIn();
                        }}
                        //handleLongPress={() => this.handLongPress()}
                        room={this.props.room}
                        sender={sender}
                        index={index}
                        message={data}
                    ></FileAttarchementMessaege>
                );
            case message_types.photo_sender:
                return (
                    <PhotoUploader
                        searchString={this.props.searchString}
                        room={this.props.room}
                        //onLongPress={this.handLongPress.bind(this)}
                        showPhoto={(photo) => this.props.showPhoto(photo)}
                        replaceMessage={(data) => this.props.replaceMessage(data)}
                        sender={false}
                        index={index}
                        message={data}
                    ></PhotoUploader>
                );
            case message_types.video_sender:
                return (
                    <VideoUploader
                        searchString={this.props.searchString}
                        //onLongPress={this.handLongPress.bind(this)}
                        playVideo={(video) => this.props.playVideo(video)}
                        replaceMessage={(data) => this.props.replaceMessageVideo(data)}
                        message={data}
                        playVideo={(video) => this.props.playVideo(video)}
                        index={index}
                        sender={false}
                    ></VideoUploader>
                );
            case message_types.filesender:
                return (
                    <FileAttarchementUploader
                        searchString={this.props.searchString}
                        room={this.props.room}
                        index={index}
                        //onLongPress={this.handLongPress.bind(this)}
                        message={data}
                        replaceMessage={(data) => this.props.replaceMessageFile(data)}
                    ></FileAttarchementUploader>
                );
            case message_types.audio_sender:
                return (
                    <AudioUploader
                        searchString={this.props.searchString}
                        //onLongPress={this.handLongPress.bind(this)}
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
            this.setStatePure({
                loaded: true,
            });
        }, 5 * this.props.delay);

        setTimeout(() => {
            if (
                !stores.Messages.haveIseen(
                    this.props.message,
                    stores.LoginStore.user.phone
                )
            ) {
                Requester.seenMessage(
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
    event = "updated" + this.props.message.id;
    componentMounting() {
        emitter.on(this.event, () => {
            console.warn("receiving message update");
            this.refresh();
        });
    }
    unmountingComponent() {
        emitter.off(this.event);
    }
    iconStyles = {
        fontSize: 14,
        color: ColorList.indicatorColor,
        //marginTop: "-2%",
    };
    handLongPress() {
        this.replying = false;
        let reply = this.props.choseReply(this.props.message);
        this.props.showActions(this.props.message, reply, !this.state.sender);
        Vibrator.vibrateLong();
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
    handlePress() {
        switch (this.props.message.type) {
            case message_types.video:
                this.props.playVideo(this.props.message.source);
                break;
            case message_types.photo:
                this.props.showPhoto(this.props.message.photo);
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
    placeholderStyle = this.props.message.dimensions
        ? this.props.message.dimensions
        : this.props.messagelayouts &&
            this.props.messagelayouts[this.props.message.id]
            ? this.props.messagelayouts[this.props.message.id]
            : this.placeHolder[this.props.message.type];
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
                : ColorList.chatboxBorderRadius,
            backgroundColor: "transparent",
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
        return (
            <View
                onLayout={(e) => {
                    this.setStatePure({
                        containerDims: e.nativeEvent.layout,
                    });
                    this.props.setCurrentLayout &&
                        this.props.setCurrentLayout(e.nativeEvent.layout);
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
                                                        style={{
                                                            marginRight: "1%",
                                                            ...reactionContanerStyle,
                                                            alignItems: 'center',
                                                            marginBottom: null,
                                                        }}
                                                    >
                                                        <Text style={{ ...GState.defaultTextStyle, fontSize: 8, fontStyle: "italic" }}>
                                                            {this.state.time}
                                                        </Text>
                                                    </View>
                                                ) : null}
                                                {!this.state.sender && this.props.isfirst ? (
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "flex-end",
                                                            width:20,
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        <View>
                                                            {this.props.message.sent ? (
                                                                this.props.received ? (
                                                                    this.props.seen ? (
                                                                        <View
                                                                            style={{
                                                                                ...rounder(12, ColorList.indicatorColor),
                                                                                justifyContent: "center",
                                                                            }}
                                                                        >
                                                                            <Ionicons
                                                                                style={{
                                                                                    ...this.iconStyles,
                                                                                    color: ColorList.bodyBackground,
                                                                                    marginLeft: 0,
                                                                                    fontSize: 14,
                                                                                    marginBottom: 0,
                                                                                    paddingTop: 0,
                                                                                }}
                                                                                type="Ionicons"
                                                                                name="ios-done-all"
                                                                            />
                                                                        </View>
                                                                    ) : (
                                                                            <Ionicons
                                                                                style={this.iconStyles}
                                                                                type="Ionicons"
                                                                                name="ios-checkmark-circle"
                                                                            />
                                                                        )
                                                                ) : (
                                                                        <EvilIcons
                                                                            style={this.iconStyles}
                                                                            type={"EvilIcons"}
                                                                            name="check"
                                                                        />
                                                                    )
                                                            ) : (
                                                                    <MaterialIconCommunity
                                                                        style={{
                                                                            ...this.iconStyles,
                                                                            color: ColorList.darkGrayText,
                                                                        }}
                                                                        type="MaterialCommunityIcons"
                                                                        name="progress-check"
                                                                    />
                                                                )}
                                                        </View>
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
                                                                {"(forwarded)"}
                                                            </Text>
                                                        ) : null}
                                                        {this.state.different &&
                                                            this.state.sender &&
                                                            !this.props.isRelation ? (
                                                                <TouchableOpacity
                                                                    onPressIn={this.handlePressIn.bind(this)}
                                                                    ///onLongPress={this.handLongPress.bind(this)}
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
                                                                            maxWidth: 150,
                                                                            fontWeight: "bold",
                                                                            fontSize: 10,
                                                                        }}
                                                                        ellipsizeMode="tail"
                                                                        numberOfLines={1}
                                                                    >
                                                                        {`@${this.state.sender_name}`}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            ) : null}
                                                        <View>
                                                            {this.props.message.reply ? (
                                                                <View
                                                                    style={{
                                                                        alignItems: "center",
                                                                        alignSelf: "center",
                                                                        marginTop: ".4%",
                                                                        width:
                                                                            this.props.message &&
                                                                                (this.props.message.type ==
                                                                                    message_types.photo ||
                                                                                    this.props.message.type ==
                                                                                    message_types.video ||
                                                                                    this.props.message.type ==
                                                                                    message_types.video_sender ||
                                                                                    this.props.message.type ==
                                                                                    message_types.photo_sender)
                                                                                ? 248
                                                                                : "99%",
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
                                                            /*onLongPress={() => {
                                                                                          this.handLongPress();
                                                                                      }}*/
                                                            >
                                                                <View
                                                                    style={{
                                                                        marginLeft: "1%",
                                                                        marginRight: "1%",
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
                                                                ...rounder(17, ColorList.bodyBackground),
                                                                marginLeft: 5,
                                                            }}
                                                        >
                                                            <AntDesign
                                                                style={{
                                                                    fontSize: 15,
                                                                    color: "gray",
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
                                                            ...reactionContanerStyle,
                                                            width: 30,
                                                            marginBottom: null,
                                                            marginLeft: -10,
                                                        }}
                                                    >
                                                        <Text style={{ fontSize: 8, fontStyle: "italic" }}>
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
                                                width: 300,
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
