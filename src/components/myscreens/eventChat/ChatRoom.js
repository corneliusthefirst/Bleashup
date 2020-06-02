import React, { Component } from "react";
import {
    Left,
    Right,
    Icon,
    Text,
    Spinner,
    Toast,
    Title,
    ActionSheet,
    Button,
    Item,
} from "native-base";
import {
    View,
    TouchableOpacity,
    Dimensions,
    BackHandler,
    Keyboard,
    Platform,
    TextInput,
    KeyboardAvoidingView,
    PermissionsAndroid,
    StatusBar,
    ImageBackground,
    Vibration,
    Clipboard,
} from "react-native";

import VideoPlayer from "./VideoController";
import Image from "react-native-scalable-image";
import Orientation from "react-native-orientation-locker";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import BleashupFlatList from "../../BleashupFlatList";
import Message from "./Message";
import {
    find,
    orderBy,
    reject,
    findIndex,
    map,
    uniqBy,
    groupBy,
    values,
} from "lodash";
import moment from "moment";
import { PulseIndicator } from "react-native-indicators";
import ReplyText from "./ReplyText";
import firebase from "react-native-firebase";
import ChatStore from "../../../stores/ChatStore";
import {
    TouchableWithoutFeedback,
    ScrollView,
} from "react-native-gesture-handler";
import stores from "../../../stores";
import VerificationModal from "../invitations/components/VerificationModal";
import GState from "../../../stores/globalState";
import EmojiSelector from "react-native-emoji-selector";
import ChatroomMenu from "./ChatroomMenu";
import uuid from "react-native-uuid";
import dateDisplayer from "../../../services/dates_displayer";
import {
    SendNotifications,
    LoadMoreComments,
    AddMembers,
} from "../../../services/cloud_services";
import Pickers from "../../../services/Picker";
import converToHMS from "../highlights_details/convertToHMS";
import Waiter from "../loginhome/Waiter";
import MediaTabModal from "./MediaTabModal";
import testForURL from "../../../services/testForURL";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import Votes from "../votes";
import emitter from "../../../services/eventEmiter";
import ChatRoomPlus from "./ChatRoomPlus";
import ContactsModal from "../../ContactsModal";
import AudioRecorder from "./AudioRecorder";
import TypingIndicator from "./TypingIndicator";
import colorList from "../../colorList";
import { PrivacyRequester } from "../settings/privacy/Requester";
import { observer } from "mobx-react";
import PublishersModal from "../../PublishersModal";
import Requester from "./Requester";
import ProfileSimple from "../currentevents/components/ProfileViewSimple";
import globalFunctions from "../../globalFunctions";
import toTitleCase from "../../../services/toTitle";
import ShareWithYourContacts from "./ShareWithYourContacts";
import MessageActions from "./MessageActons";
import rounder from "../../../services/rounder";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenheight = Math.round(Dimensions.get("window").height);
@observer
class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.authObserver();
        this.state = {
            sender: false,
            user: 2,
            splicer: 500,
            creator: true,
            newMessage: false,
            hideStatusBar: false,
            showEmojiInput: false,
            showAudioRecorder: false,
            recordTime: 0,
            keyboardOpened: false,
            textValue: "",
            image: null,
            tagging: false,
            isModalOpened: false,
            showHeader: !this.props.isComment,
            previousMessageHeight: this.formHeight(
                (screenheight - 67) / screenheight
            ),
            previousTextHeight: this.formHeight(67 / screenheight),
            replying: false,
            recording: false,
            captionText: "",
            textHeight: screenheight * 0.1,
            photoHeight: screenheight * 0.9,
            showCaption: false,
            showEmojiInputCaption: false,
            replyerOffset: 0.1,
            messageListHeight: this.formHeight((screenheight - 70) / screenheight),
            textInputHeight: this.formHeight(67 / screenheight),
            inittialTextInputHeightFactor: 67 / screenheight,
            initialMessaListHeightFactor: (screenheight - 67) / screenheight,
            showRepliedMessage: false,
            showVideo: false,
            showPhoto: false,
            playing: true,
            replyContent: null,
        };
        this.BackHandler = null;
    }
    saveNotificationToken() {
        firebase
            .messaging()
            .requestPermission()
            .then((staus) => {
                firebase
                    .messaging()
                    .getToken()
                    .then((token) => {
                        PrivacyRequester.saveToken(token);
                        firebase
                            .database()
                            .ref(`notifications_tokens/${this.user.phone}`)
                            .set(token);
                    })
                    .catch((error) => {
                        console.warn(error);
                    });
            });
    }
    authObserver() {
        firebase.auth().onAuthStateChanged(this.bootstrap.bind(this));
    }
    getUID() {
        return (firebase.auth().currentUser || {}).uid;
    }
    getRef(firebaseRoom) {
        return firebase.database().ref(firebaseRoom);
    }
    room = null;
    getTimestamp() {
        return firebase.database().serverValue.TIMESTAMP;
    }
    bootstrap(user) {
        if (!user) {
            firebase
                .auth()
                .signInWithPhoneNumber(this.props.user.phone)
                .then((confirmCode) => {
                    this.setState({
                        isModalOpened: true,
                    });
                    stores.TempLoginStore.confirmCode = confirmCode;
                })
                .catch((e) => {
                    switch (e.code) {
                        case "auth/operation-not-allowed":
                            console.warn("Enable anonymous in your firebase console.");
                            break;
                        default:
                            console.warn(e);
                            break;
                    }
                });
        } else {
        }
    }
    formPercentage(height) {
        return height / screenWidth;
    }
    messageListFactor = 0.5;
    textInputFactor = 0.15;
    fireRef = null;
    newMessages = [];
    roomID = this.props.firebaseRoom;
    informRemote(newMessage, newKey, received) {
        firebase
            .database()
            .ref(`${this.props.firebaseRoom}/${newKey}/received`)
            .set(received);
    }

    insetDateSeparator(messages, newMessage) {
        return new Promise((resolve, reject) => {
            let separator = {
                ...newMessage,
                id: "New Messages",
                type: "new_separator",
            };
            index = findIndex(messages, { id: separator.id });
            let result = index >= 0 ? messages : [separator].concat(messages);
            resolve(result);
        });
    }
    removeMessage(message) {
        stores.Messages.addAndReadFromStore(this.roomID, message).then((value) => {
            stores.Messages.removeMessage(this.roomID, value.id).then(() => {
                firebase
                    .database()
                    .ref(`${this.props.firebaseRoom}/${message.key}`)
                    .remove((error) => {
                        this.setState({
                            newMessage: true,
                        });
                    });
            });
        });
    }
    toastStyle = {
        marginTop: "-10%",
        paddingTop: "3%",
    };
    toastTextStyles = {
        color: "#0A4E52",
    };
    typingRef = null;
    setTypingRef(room) {
        this.typingRef = firebase.database().ref(`typing/${room}`);
    }
    currentTyper = null;
    showTypingToast(newTyper) {
        if (newTyper[0]) {
            this.currentTyper = newTyper[0].nickname + " is ";
        } else if (newTyper.phone !== undefined) {
            console.warn("phone found");
            this.currentTyper = newTyper.nickname;
        } else {
            if (this.currentTyper === null) {
                this.currentTyper = "You are";
            }
        }
        this.typingTimeout && clearTimeout(this.typingTimeout);
        // console.warn(this.currentTyper)
        this.setState({
            typing: true,
        });
        this.typingTimeout = setTimeout(() => {
            this.setState({
                typing: false,
            });
        }, 1000);
        //Toast.show({ text: `typing ...`, position: "top", textStyle: this.toastTextStyles, style: this.toastStyle })
    }
    setTyingState(typer) {
        this.typingRef.set([typer, moment().format()]);
    }
    formStorableData(messages) {
        messages = uniqBy(messages, "id").sort(this.dateSorter);
        let result = [];
        return new Promise((resolve, reject) => {
            stores.Messages.readFromStore().then((data) => {
                messages.forEach((element) => {
                    let date = moment(element.created_at).format("YYYY/MM/DD");
                    index =
                        data[this.roomID] && findIndex(data[this.roomID], { id: date });
                    index2 = findIndex(result, { id: date });
                    if ((!index && index2 < 0) || (index < 0 && index2 < 0)) {
                        result.unshift({ ...element, id: date, type: "date_separator" });
                        result.unshift(element);
                    } else {
                        result.unshift(element);
                    }
                });
                resolve(result);
            });
        });
    }
    showMessage = [];
    loadComments() {
        if (
            !stores.Messages.messages[this.roomID] ||
            stores.Messages.messages[this.roomID].length <= 0
        ) {
            this.fireRef
                .orderByKey()
                .limitToLast(50)
                .once("value", (snapshot) => {
                    if (snapshot.val()) {
                        this.formStorableData(values(snapshot.val())).then((newVal) => {
                            stores.Messages.messages[this.roomID] = newVal;
                            this.setState({
                                newMessage: !this.state.newMessage,
                                commentLoaded: true,
                                loaded: true,
                            });
                            this.adjutRoomDisplay();
                        });
                    } else {
                        this.setState({
                            commentLoaded: true,
                            loaded: true,
                        });
                        this.adjutRoomDisplay();
                    }
                });
        } else {
            LoadMoreComments(
                this.props.firebaseRoom,
                stores.Messages.messages[this.roomID].length,
                stores.Messages.messages[this.roomID].length + 50
            ).then((res) => {
                res.json().then((data) => {
                    data &&
                        data.length > 0 &&
                        this.formStorableData(data).then((mess) => {
                            stores.Messages.messages[this.roomID] = uniqBy(
                                stores.Messages.messages[this.roomID].concat(mess),
                                "id"
                            );
                            this.setState({
                                newMessage: !this.state.newMessage,
                                loaded: true,
                            });
                            this.adjutRoomDisplay();
                        });
                });
            });
        }
    }
    initializeNewMessageForRoom() {
        return new Promise((resolve, reject) => {
            this.formStorableData(this.props.newMessages).then((news) => {
                this.newMessages = news;
                this.newMessages =
                    this.newMessages.length > 0
                        ? [
                            ...this.newMessages,
                            {
                                id: "New Messages",
                                type: "new_separator",
                                sender: {
                                    phone: 3,
                                    nickname: "Sokeng Kamga",
                                },
                                duration: Math.floor(0),
                                created_at: "2014-03-30 12:32",
                            },
                        ]
                        : [];
                setTimeout(() => {
                    GState.reply
                        ? this.replying(GState.reply, null)
                        : this.setState({
                            loaded: true,
                        });
                    this.adjutRoomDisplay();
                }, 100);
                if (this.props.newMessages.length > 0) {
                    stores.Messages.insertBulkMessages(
                        this.roomID,
                        this.newMessages
                    ).then(() => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    }
    dateSorter(a, b) {
        let acreated = moment(a.created_at).format("X");
        let bcreated = moment(b.created_at).format("X");
        return acreated < bcreated ? -1 : bcreated < acreated ? 1 : 0;
    }
    initializeRoomListeners() {
        this.typingRef.on("child_changed", (newChild) => {
            //console.warn(newChild)
            let typer = newChild.phone ? newChild.nickname : newChild;
            this.props.setTyper && this.props.setTyper();
            this.showTypingToast(typer);
        });
    }
    componentDidMount() {
        this.saveNotificationToken();
        GState.currentRoom = this.props.firebaseRoom;
        if (this.props.isComment) {
            this.loadComments();
            this.initializeRoomListeners();
        } else {
            this.initializeNewMessageForRoom().then(() => {
                this.initializeRoomListeners();
            });
        }
    }
    adjutRoomDisplay(dontToggle) {
        setTimeout(() => {
            GState.reply && !this.alreadyFocussed && this.fucussTextInput();
            this.alreadyFocussed = true;
            this.refs.scrollViewRef.scrollToEnd({ animated: true, duration: 200 });
            this.state.showCaption &&
                this.refs.captionScrollViewRef.scrollToEnd({
                    animated: true,
                    duration: 200,
                });
            this.temp ? (GState.reply = JSON.parse(this.temp)) : null;
        }, 30);
    }
    markAsRead() {
        stores.Messages.deleteNewMessageIndicator(this.roomID).then(() => { });
        if (this.newMessages.length > 0) {
            stores.Messages.messages[this.roomID] = this.newMessages.concat(
                stores.Messages.messages[this.roomID]
            );
            stores.Messages.messages[this.roomID] = uniqBy(
                stores.Messages.messages[this.roomID],
                "id"
            );
            this.newMessages = [];
            this.showMessage = [];
            this.setState({
                newMessage: true,
            });
        }
    }
    componentWillMount() {
        this.formSerachableMembers();
        this.fireRef = this.getRef(this.props.firebaseRoom);
        this.setTypingRef(this.props.firebaseRoom);
        this.props.isComment ? (stores.Messages.messages[this.roomID] = []) : null;
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
        //if (this.BackHandler) this.BackHandler.remove();
        //this.BackHandler = BackHandler.addEventListener(
          //  "hardwareBackPress",
          //  this.handleBackButton.bind(this)
      //  );
        Orientation.lockToPortrait();
    }
    componentWillUnmount() {
        Pickers.CleanAll();
        this.fireRef.off();
        this.typingRef.off();
        this.keyboardDidHideSub.remove()
        this.keyboardDidShowSub.remove()
        this.markAsRead();
        GState.currentRoom = null;
        //this.BackHandler.remove();
    }

    handleKeyboardDidShow = (event) => {
        this.adjutRoomDisplay()
        this.setState({
            showEmojiInput: false,
            showEmojiInputCaption: false
        })
        this.openedKeyboard = true
    };

    handleKeyboardDidHide = () => {
        this.openedKeyboard = false
    };
    convertPercentageToInt(data) {
        return parseInt(data.split("%")[0]) / 100;
    }

    /*handleBackButton() {
        if (this.state.showEmojiInput) {
            //this.fucussTextInput();
            this.setState({
                showEmojiInput: false,
            });
            return true;
        } else if (this.state.showRepliedMessage) {
            this.setState({
                showRepliedMessage: false,
            });
            return true;
        } /*else if (this.state.showVideo) {
            this.setState({
                showVideo: false,
                showCaption: false,
            });
            Orientation.lockToPortrait();
            return true;
        } else if (this.state.showPhoto) {
            this.setState({
                showPhoto: false,
                showCaption: false,
            });
            return true;
        } else if (this.state.showEmojiInputCaption) {
            //this._captionTextInput.focus();
            this.setState({
                showEmojiInputCaption: false,
            });
            return true;
        } else if (this.state.showCaption) {
            this.setState({
                showCaption: false,
                showVideo: false,
            });
            return true;
        } /*else if (this.state.showAudioRecorder) {
            this.refs.AudioRecorder.stopRecord(true);
            return true;
        } else {
        }
    }*/
    state = {
        sender: false,
        showTime: true,
    };
    formHeight(factor) {
        return factor * screenheight;
    }
    playVideo(video) {
        this.setState({
            video: video,
            showVideo: true,
        });
    }
    hideVideo() {
        Orientation.lockToPortrait();
        this.setState({
            showVideo: false,
            hideStatusBar: false,
            showCaption: false,
        });
    }
    showActions() {
        this.setState({
            showActions: true,
        });
        setTimeout(() => {
            this.setState({
                showActions: false,
            });
        }, 5000);
    }
    buffering() {
        this.setState({
            buffering: true,
        });
        setTimeout(() => {
            this.setState({
                buffering: false,
            });
        }, 5000);
    }

    renderMessages(data) {
        data = {
            ...data,
            received: [{ phone: this.user.phone, time: moment().format() }],
        };
        return data.map((element) => this.chooseComponent(element));
    }
    enterFullscreen() {
        Keyboard.dismiss();
        this.state.fullScreen
            ? Orientation.lockToPortrait()
            : Orientation.lockToLandscapeLeft(); //this will unlock the view to all Orientations
        this.setState({
            fullScreen: !this.state.fullScreen,
        });
    }
    togglePlay() {
        this.setState({
            playing: !this.state.playing,
        });
    }
    _onChange(event) {
        let text = event.nativeEvent.text;
        this.setState({ textValue: text || "" });
        if (text.split("@").length > 1) {
            this.setState({
                tagging: true,
            });
        }
        this.setTyingState(this.sender);
        this.adjutRoomDisplay();
    }
    filterFunctionByUnicode = (emoji) => {
        return emoji.lib.added_in === "6.0" || emoji.lib.added_in === "6.1";
    };
    _resetTextInput() {
        this._textInput.clear();
    }
    _resetCaptionInput() { }
    handleEmojieSectionCaption(e) {
        this.setState({
            textValue: this.state.textValue + e,
        });
    }
    handleEmojiSelected(e) {
        this.setState({
            textValue: this.state.textValue + e,
        });
    }
    received = [{ phone: this.props.user.phone, date: moment().format() }];
    logOutZoomState = (event, gestureState, zoomableViewEventObject) => { };
    sendToOtherActivity(message) {
        return new Promise((resolve, reject) => {
            Requester.sendMessage(
                message,
                message.from_committee,
                message.from_activity, true).
                then((response) => {
                    resolve
                })
        })
    }
    sendMessage(messager) {
        return new Promise((resolve, reject) => {
            if (messager) {
                GState.reply = null;
                this.fireRef.push(messager).then((key) => {
                    messager = { ...messager, key: key.key, sent: true };
                    Requester.sendMessage(
                        messager,
                        this.roomID,
                        this.props.activity_id
                    ).then((response) => {
                        resolve(messager);
                    });
                });
            } else {
                resolve(messager);
            }
        });
    }
    sending = false;
    sendTextMessage(newMessage) {
        if (GState.connected) {
            this.scrollToEnd();
            newMessage = { ...newMessage, received: this.received, sent: true };
            this.sendMessage(newMessage).then((mess) => {
                stores.Messages.replaceMessage(this.roomID, mess).then(() => {
                    this.initRoom();
                });
            });
        }
    }
    sendMessageText(message) {
        if (this.state.showAudioRecorder) {
            this.refs.AudioRecorder.stopRecord();
        } else if (this.state.textValue !== "" && message !== "") {
            this.initialzeFlatList();
            let messager = {
                id: uuid.v1(),
                type: "text_sender",
                tags: this.tags,
                text: message,
                sender: this.sender,
                reply: this.state.replyContent,
                creator: this.creator,
                created_at: moment().format(),
            };
            this.scrollToEnd();
            stores.Messages.addMessageToStore(this.roomID, messager).then((data) => {
                this._resetTextInput();
                this.tags = null;
                this.setState({
                    textValue: "",
                    replying: false,
                    replyContent: null,
                });
            });
        } else {
        }
    }
    user = this.props.user;
    creator = 1;
    showPhoto(photo) {
        this.setState({
            photo: photo,
            showPhoto: true,
            //hideStatusBar: true
        });
        Keyboard.dismiss();
    }
    captionMessages = [];
    sendingCaptionMessages = false;
    uselessSentCount = 0;
    captionSender() {
        if (this.uselessSentCount <= 20) {
            if (this.captionMessages.length <= 0) {
                setTimeout(() => {
                    this.uselessSentCount = this.uselessSentCount + 1;
                    this.captionSender();
                }, 1000);
            } else {
                this.sendingCaptiomMessages = true;
                this.uselessSentCount = 0;
                this.scrollToEnd();
                let tobeSent = [...this.captionMessages];
                this.captionMessages = [];
                tobeSent.map((newMessage) => {
                    newMessage = { ...newMessage, received: this.received, sent: true };
                    this.sendMessage({ ...newMessage, photo: newMessage.source }).then(
                        (mess) => {
                            stores.Messages.replaceMessage(this.roomID, {
                                ...newMessage,
                                key: mess.key,
                            }).then(() => { });
                        }
                    );
                });
                this.captionSender();
            }
        } else {
            this.sendingCaptiomMessages = false;
        }
    }
    openCamera() {
        Pickers.SnapPhoto("all").then((snap) => {
            let isVideo = snap.content_type.includes("video") ? true : false;
            this.setState({
                video: snap.source,
                image: snap.source,
                showCaption: true,
                imageSelected: isVideo ? false : true,
                filename: snap.filename,
                showVideo: isVideo ? true : false,
                content_type: snap.content_type,
                size: snap.size,
            });
            this.markAsRead();
            this.adjutRoomDisplay();
        });
    }

    sender = {
        phone: this.props.user.phone,
        nickname: this.props.user.name,
    };
    openPhotoSelector() {
        this.scrollToEnd();
        Pickers.TakeManyPhotos()
            .then((response) => {
                response.map((res) => {
                    message = {
                        id: uuid.v1(),
                        type: "photo" + "_upload",
                        source: res.source,
                        sender: this.sender,
                        //user: this.user,
                        creator: this.creator,
                        created_at: moment().format(),
                        total: res.size,
                        send: 0,
                        // data: this.state.base64,
                        content_type: res.content_type,
                        filename: res.filename,
                        text: this.state.captionText,
                    };
                    stores.Messages.addMessageToStore(this.roomID, message).then(() => {
                        this.setState({
                            newMessage: true,
                        });
                        this.initialzeFlatList();
                        this.markAsRead();
                    });
                });
                this.setState({
                    captionText: "",
                });
            })
            .catch((error) => {
                console.warn(error);
            });
    }
    informMembers() { }
    _sendCaptionMessage() {
        this.scrollToEnd();
        let message = {
            id: uuid.v1(),
            type: (this.state.imageSelected ? "photo" : "video") + "_upload",
            source: this.state.imageSelected ? this.state.image : this.state.video,
            sender: this.sender,
            tags: this.tags,
            reply: this.state.replyContent,
            creator: this.creator,
            created_at: moment().format(),
            total: this.state.size,
            send: 0,
            content_type: this.state.content_type,
            filename: this.state.filename,
            text: this.state.textValue,
        };
        stores.Messages.addMessageToStore(this.roomID, message).then(() => {
            this.setState({
                newMessage: true,
            });
            this.tags = null;
            this.initialzeFlatList();
        });
        this._resetCaptionInput();
        let offset = this.state.replying ? 0.1 : 0;
        this.setState({
            captionText: "",
            textValue: "",
            replyContent: null,
            replying: false,
            showEmojiInputCaption: false,
            showCaption: false,
            showVideo: false,
        });
        this.fucussTextInput();
    }
    initRoom() {
        console.warn("initing room");
        this.setState({
            newMessage: !this.state.newMessage,
        });
    }
    replaceMessage(newMessage) {
        newMessage = { ...newMessage, received: this.received, sent: true };
        this.sendMessage({ ...newMessage, photo: newMessage.source }).then(
            (mess) => {
                stores.Messages.replaceMessage(this.roomID, {
                    ...newMessage,
                    key: mess.key,
                }).then(() => {
                    this.initRoom();
                });
            }
        );
    }
    replaceMessageVideo(newMessage) {
        newMessage = { ...newMessage, received: this.received, sent: true };
        this.sendMessage({
            ...newMessage,
            source: newMessage.temp,
            cancled: undefined,
        }).then((mess) => {
            stores.Messages.replaceMessage(this.roomID, {
                ...newMessage,
                key: mess.key,
            }).then(() => {
                this.initRoom();
            });
        });
    }
    replaceMessageFile(newMessage) {
        newMessage = { ...newMessage, received: this.received, sent: true };
        this.sendMessage({ ...newMessage, source: newMessage.temp }).then(
            (mess) => {
                stores.Messages.replaceMessage(this.roomID, {
                    ...newMessage,
                    key: mess.key,
                }).then(() => {
                    this.initRoom();
                });
            }
        );
    }
    replaceAudioMessage(newMessage) {
        newMessage = { ...newMessage, received: this.received, sent: true };
        this.sendMessage({ ...newMessage, source: newMessage.temp }).then(
            (mess) => {
                stores.Messages.replaceMessage(this.roomID, {
                    ...newMessage,
                    key: mess.key,
                }).then((messages) => {
                    this.initRoom();
                });
            }
        );
    }
    verboseLoggingFunction(error) { }
    async openAudioPicker() {
        const res = await Pickers.TakeAudio();
        let temp = this.filename;
        this.filename = res.uri;
        this.duration = 0;
        this.sendAudioMessge(temp, this.duration);
        this.filename = temp;
    }
    async openFilePicker() {
        const res = await Pickers.TakeFile();
        this.scrollToEnd();
        message = {
            id: uuid.v1(),
            source: res.uri,
            file_name: res.name,
            reply: this.state.replyContent,
            sender: this.sender,
            //user: this.user,
            creator: 2,
            type: "attachement_upload",
            received: 0,
            total: res.size,
            created_at: moment().format(),
        };
        stores.Messages.addMessageToStore(this.roomID, message).then((data) => {
            this.initialzeFlatList();
        });
        this.setState({
            replyContent: null,
            replying: false,
        });
    }
    duration = 0;
    _onChangeCaption(event) {
        let text = event.nativeEvent.text;
        this.setTyingState(this.sender);
        this.setState({
            tagging: text.split("@").length > 1 ? true : false,
            textValue: text || "",
        });
        this.adjutRoomDisplay();
    }
    toggleAudioRecorder() {
        this.setState({
            showAudioRecorder: !this.state.showAudioRecorder,
        });
        if (this.state.showAudioRecorder) {
            this.refs.AudioRecorder.stopRecordSimple();
        } else {
            this._textInput.focus();
            this.refs.AudioRecorder.startRecorder();
        }
    }
    cancleReply() {
        GState.reply = null;
        this.setState({
            replying: false,
            replyContent: null,
            //messageListHeight: this.state.previousMessageHeight,
            //textInputHeight: this.state.previousTextHeight,
            //textHeight: screenheight * 0.1,
            //photoHeight: screenheight * 0.9,
        });
        this.adjutRoomDisplay();
    }
    sendAudioMessge(filename, duration, dontsend) {
        this.setState({
            showAudioRecorder: false,
        });
        if (!dontsend) {
            this.scrollToEnd();
            let message = {
                id: uuid.v1(),
                source: "file://" + (filename || this.filename),
                duration: duration || this.duration,
                type: "audio_uploader",
                text: this.state.textValue,
                reply: this.state.replyContent,
                tags: this.tags,
                sender: this.sender,
                content_type: "audio/mp3",
                total: 0,
                received: 0,
                file_name: "test.mp3",
                created_at: moment().format(),
            };
            stores.Messages.addMessageToStore(this.roomID, message).then(() => {
                this.setState({
                    newMessage: true,
                    textValue: "",
                    replying: false,
                    replyContent: null,
                });
                this.tags = null
                this.initialzeFlatList();
            });
        }
    }
    toggleEmojiKeyboard() {
        offset = this.state.replying ? 0.1 : 0;
        this.temp = GState.reply ? JSON.stringify(GState.reply) : null;
        GState.reply = null;
        //!this.state.showEmojiInput ?
        Keyboard.dismiss();
        //: this.fucussTextInput()
        setTimeout(
            () => {
                this.setState({
                    showEmojiInput: !this.state.showEmojiInput,
                });
                this.adjutRoomDisplay(true);
            },
            this.state.keyboardOpened ? 200 : 0
        );
    }
    scrollToEnd() {
        this.refs.bleashupSectionListOut.scrollToEnd();
    }
    initialzeFlatList() {
        this.refs.bleashupSectionListOut.resetItemNumbers();
        this.adjutRoomDisplay();
    }
    createVote(vote) {
        let message = {
            id: uuid.v1(),
            text: vote.title,
            type: "vote",
            sent: true,
            vote: { ...vote },
            created_at: moment().format(),
            received: [{ phone: stores.LoginStore.phone, date: moment().format() }],
            sender: this.sender,
        };
        stores.Messages.addMessageToStore(this.roomID, message).then(() => {
            this.setState({
                //isVoteCreationModalOpened: false,
                newMessage: true,
            });

            this.initialzeFlatList();
        });
        this.sendMessage(message);
    }
    verifyNumber(code) {
        stores.TempLoginStore.confirmCode.confirm(code).then((success) => {
            this.setState({
                isModalOpened: false,
            });
        });
    }
    replying(replyer, color) {
        // this.fucussTextInput()
        offset = this.state.replying ? 0.2 : 0;
        this.setState({
            loaded: true,
            replying: true,
            replyContent: replyer,
            replyerBackColor: color,
            photoHeight: screenheight * 0.8,
        });
        this.adjutRoomDisplay();
    }
    deleteMessageAction() {
        this.deleteMessage(this.state.currentMessage.id);
    }
    showReceived() {
        this.props.showContacts(
            this.state.currentMessage.received.map((ele) =>
                ele.phone.replace("+", "00")
            ),
            "Seen by"
        );
    }
    copyMessage() {
        Clipboard.setString(this.state.currentMessage.text);
        Vibration.vibrate(10);
        Toast.show({ text: "copied !", type: "success" });
    }
    options = ["Remove message", "Seen Report", "Copy to clipboard", "Cancel"];
    showMessageAction(message,reply) {
        this.tempReply = reply
        this.setState({
            currentMessage: message,
            showMessageActions: true,
        });
    }
    hideAndShowHeader() {
        this.setState({
            showHeader: false,
        });
        // this.replying = true
        setTimeout(
            () =>
                this.setState({
                    showHeader: true,
                }),
            5000
        );
    }
    initializeVotes(votes) {
        this.setState({
            votes: votes,
        });
    }
    showMembers() {
        this.props.showMembers(this.props.members);
    }
    formSerachableMembers() {
        stores.TemporalUsersStore.getUsers(
           this.props.members?
           this.props.members.map((ele) => ele.phone):
           [],
            [],
            (users) => {
                this.searchableMembers = users;
            }
        );
    }
    searchableMembers = [];
    messagelayouts = {};
    showRoomMedia() {
        this.setState({
            isMediaModalOpened: true,
            messages: stores.Messages.messages[this.roomID]
                ? JSON.stringify(stores.Messages.messages[this.roomID])
                : JSON.stringify([]),
        });
    }
    showVoters(voters) {
        this.setState({
            showContacts: true,
            voters: voters,
            title: "Voters list ",
        });
    }
    transparent = "rgba(50, 51, 53, 0.8)";
    shareWithContacts(message) {
        this.setState({
            isShareWithContactsOpened: true,
        });
    }
    scrollToIndex(index) {
        console.warn(index)
        this.refs.bleashupSectionListOut.scrollToIndex(index)
    }
    render() {
        headerStyles = {
            flexDirection: "row",
            ...(!this.state.showVideo &&
                !this.state.showPhoto &&
                !this.state.showRepliedMessage &&
                !this.state.showCaption),
        };
        return (
            <View style={{ height: "100%", justifyContent: "flex-end" }}>
                {
                    // **********************Header************************ //
                    this.state.showHeader ? (
                        <View style={{ height: "7.5%" }}>{this.header()}</View>
                    ) : null
                }

                <View style={{ height: this.state.showHeader ? "92.5%" : "100%" }}>
                    <View style={{ height: "100%", justifyContent: "flex-end" }}>
                        <KeyboardAvoidingView
                            behavior={Platform.Os == "ios" ? "padding" : "height"}
                            style={{ flex: 1 }}
                        >
                            {!this.state.loaded ? (
                                <Waiter></Waiter>
                            ) : (
                                    <View style={{}}>
                                        <View style={{ width: "100%", alignSelf: "center" }}>
                                            <ScrollView
                                                onScroll={() => {
                                                    this.adjutRoomDisplay();
                                                }}
                                                inverted={false}
                                                keyboardShouldPersistTaps={"always"}
                                                showsVerticalScrollIndicator={false}
                                                scrollEnabled={false}
                                                inverted
                                                nestedScrollEnabled
                                                ref="scrollViewRef"
                                            >
                                                <View
                                                    style={{
                                                        height: this.state.messageListHeight,
                                                        marginBottom: "0.5%",
                                                    }}
                                                >
                                                    <TouchableWithoutFeedback
                                                        onPressIn={() => {
                                                            this.scrolling = false;
                                                            this.adjutRoomDisplay();
                                                            !this.openedKeyboard && this._textInput.blur()
                                                        }}
                                                    >
                                                        {this.messageList()}
                                                    </TouchableWithoutFeedback>
                                                </View>
                                                <View>
                                                    {!this.props.opened || !this.props.generallyMember ? (
                                                        <Text
                                                            style={{ fontStyle: "italic", marginLeft: "3%" }}
                                                            note
                                                        >
                                                            {"This commitee has been closed for you"}
                                                        </Text>
                                                    ) : (
                                                            // ***************** KeyBoard Displayer *****************************

                                                            this.keyboardView()
                                                        )}
                                                </View>
                                            </ScrollView>
                                        </View>

                                        {
                                            // **********************New Message Indicator *****************//
                                            // this.newMessages.length > 0 ? this.newMessageIndicator() : null
                                        }
                                        {
                                            // **************Captions messages handling ***********************//

                                            this.state.showCaption ? this.captionMessageHandler() : null
                                        }
                                        {
                                            //******  Reply Message onClick See Reply handler View ********/

                                            this.state.showRepliedMessage
                                                ? this.replyMessageViewer()
                                                : null
                                        }
                                        {
                                            // ******************Photo Viewer View ***********************//
                                            this.state.showPhoto ? this.PhotoShower() : null
                                        }
                                        {
                                            //** ####### Vidoe PLayer View ################ */

                                            this.state.showVideo ? this.VideoShower() : null
                                        }
                                        {}
                                    </View>
                                )}
                            <VerificationModal
                                isOpened={this.state.isModalOpened}
                                verifyCode={(code) => this.verifyNumber(code)}
                                phone={this.props.user.phone}
                            ></VerificationModal>
                            {this.state.isMediaModalOpened ? (
                                <MediaTabModal
                                    video={this.groupByWeek(
                                        JSON.parse(this.state.messages).filter(
                                            (ele) =>
                                                ele && ele.type === "video" && !testForURL(ele.source)
                                        )
                                    )}
                                    photo={this.groupByWeek(
                                        JSON.parse(this.state.messages).filter(
                                            (ele) => ele && ele.type === "photo"
                                        )
                                    )}
                                    file={this.groupByWeek(
                                        JSON.parse(this.state.messages).filter(
                                            (ele) =>
                                                ele &&
                                                ele.type === "attachement" &&
                                                !testForURL(ele.source)
                                        )
                                    )}
                                    isOpen={this.state.isMediaModalOpened}
                                    closed={() => {
                                        this.setState({
                                            isMediaModalOpened: false,
                                        });
                                    }}
                                ></MediaTabModal>
                            ) : null}
                            {this.state.isShareWithContactsOpened ? (
                                <ShareWithYourContacts
                                    activity_id={this.props.activity_id}
                                    sender={this.sender}
                                    committee_id={this.roomID}
                                    isOpen={this.state.isShareWithContactsOpened}
                                    message={{
                                        ...this.state.currentMessage,
                                        id: uuid.v1(),
                                        created_at: moment().format(),
                                        sender: this.sender,
                                        reply: null,
                                        forwarded: true,
                                        from_activity: !this.state.currentMessage.from_activity
                                            ? this.props.activity_id
                                            : this.state.currentMessage.from_activity,
                                        from_committee: !this.state.currentMessage.from_committee
                                            ? this.roomID
                                            : this.state.currentMessage.committee_id,
                                        from: this.state.currentMessage.from
                                            ? this.state.currentMessage.from
                                            : this.state.currentMessage.sender,
                                    }}
                                    onClosed={() => {
                                        this.setState({
                                            isShareWithContactsOpened: false,
                                        });
                                    }}
                                ></ShareWithYourContacts>
                            ) : null}
                            {this.state.showMessageActions ? (
                                <MessageActions
                                    isOpen={this.state.showMessageActions}
                                    onClosed={() => {
                                        this.setState({
                                            showMessageActions: false,
                                        });
                                    }}
                                    deleteMessage={this.deleteMessageAction.bind(this)}
                                    copyMessage={this.copyMessage.bind(this)}
                                    // addToVote={this.addVote.bind(this)}
                                    // starThis={this.addStar.bind(this)}
                                    // remindThis={this.remindThis.bind(this)}
                                    forwardToContacts={this.forwardToContacts.bind(this)}
                                    replyMessage={this.replyMessage.bind(this)}
                                    seenBy={this.showReceived.bind(this)}
                                ></MessageActions>
                            ) : null}
                            {
                                <Votes
                                    takeVotes={(votes) => {
                                        this.initializeVotes(votes);
                                    }}
                                    shared={false}
                                    share={{
                                        id: "45xerfds",
                                        date: moment().format(),
                                        sharer: stores.LoginStore.user.phone,
                                        item_id: "6d1d14f0-8d1a-11ea-9234-8b09069818ca",
                                        event_id: this.props.activity_id,
                                    }}
                                    replying={(reply) => {
                                        this.fucussTextInput();
                                        this.replying(reply, null);
                                        //Keyboard.show()
                                        Vibration.vibrate(this.duration);
                                        setTimeout(() => {
                                            this.setState({
                                                isVoteCreationModalOpened: false,
                                            });
                                        }, 200);
                                    }}
                                    computedMaster={this.props.computedMaster}
                                    takeVote={(vote) => this.createVote(vote)}
                                    voteItem={(mess) => {
                                        this.perviousId = mess.id;
                                        this.replaceVote(mess);
                                    }}
                                    working={this.props.working}
                                    isSingleVote={this.state.single_vote}
                                    vote_id={this.state.vote_id}
                                    startLoader={this.props.showLoader}
                                    roomName={this.props.roomName}
                                    showVoters={(voters) => {
                                        this.showVoters(voters);
                                    }}
                                    stopLoader={this.props.stopLoader}
                                    activity_name={this.props.activity_name}
                                    committee_id={this.props.firebaseRoom}
                                    event_id={this.props.activity_id}
                                    isOpen={this.state.isVoteCreationModalOpened}
                                    sender={this.sender}
                                    onClosed={() => {
                                        this.setState({
                                            isVoteCreationModalOpened: false,
                                        });
                                    }}
                                ></Votes>
                            }
                            {this.state.showContacts ? (
                                <ContactsModal
                                    title={this.state.title}
                                    contacts={this.state.voters}
                                    isOpen={this.state.showContacts}
                                    onClosed={() => {
                                        this.setState({
                                            showContacts: false,
                                        });
                                    }}
                                ></ContactsModal>
                            ) : null}
                            {this.state.showReacters ? (
                                <PublishersModal
                                    isOpen={this.state.showReacters}
                                    onClosed={() => {
                                        this.setState({
                                            showReacters: false,
                                        });
                                    }}
                                    reaction={this.state.currentReaction}
                                    reacters={this.state.currentReacters}
                                ></PublishersModal>
                            ) : null}
                            {
                                //</ImageBackground>
                            }
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </View>
        );
    }

    groupByWeek(media) {
        let groupedDates = groupBy(media, (ele) =>
            moment(ele.created_at).startOf("week")
        );
        let keys = Object.keys(groupedDates);
        let result = [];
        for (let i = 0; i < keys.length; i++) {
            result = [
                ...result,
                { type: "date_separator", id: keys[i] },
                ...groupedDates[keys[i]],
            ];
        }
        return result;
    }
    addStar() { }
    forwardToContacts() {
        this.state.currentMessage.sent
            ? this.setState({
                isShareWithContactsOpened: true,
            })
            : Toast.show({ text: "cannot forward unsent messages" });
    }
    replyMessage() {
        setTimeout(() => {
            Vibration.vibrate(40);
            this._textInput.focus();
            this.replying(this.tempReply);
        }, 50);
    }
    remindThis() { }
    voteShare(vote) {
        console.warn(vote)
        stores.Messages.replaceMessage(this.roomID, vote).then(() => {
            this.initializeRoom()
            //this.sendToOtherActivity({ ...vote }).then(() => {
                /*this.sendMessage(vote).then(() => {

                })*/
           // })
        })

    }
    initializeRoom() {
        this.initialzeFlatList();
        this.setState({
            newMessage: !this.state.newMessage,
        });
    }
    replaceVote(vote) {
        vote = {
            ...vote, received: this.received, sent: true, id: uuid.v1(),
            created_at: moment().format()
        };
        stores.Messages.replaceNewMessage(this.roomID, vote).then(() => {
            this.sendMessage(vote);

        });
        //  })
    }
    reactToMessage(messageID, reaction) {
        Requester.reactMessage(
            messageID,
            this.roomID,
            reaction,
            this.props.activity_id
        ).then(() => { });
    }
    openVoteCreation() {
        this.setState({
            isVoteCreationModalOpened: true,
            single_vote: false,
        });
    }
    fucussTextInput() {
        this._textInput.focus();
    }
    persistMessageLayout(id, layout) {
        stores.Messages.setMessageDimessions(this.roomID, id, layout);
    }
    showReacters(reaction, reacters) {
        this.setState({
            showReacters: true,
            currentReaction: reaction,
            currentReacters: reacters,
        });
    }
    deleteMessage(messageID) {
        Requester.deleteMessage(
            messageID,
            this.props.activity_id,
            this.roomID
        ).then(() => { });
    }
    delay = 1;
    addVote() { }
    getItemLayout(item, index) {
        let offset = stores.Messages.messages[this.roomID]
            ? stores.Messages.messages[this.roomID]
                .slice(0, index)
                .reduce(
                    (a, b) =>
                        a + (b.dimensions
                            ? b.dimensions.height
                            : 70),
                    0
                )
            : index * 70
        return {
            length: item.dimensions ? item.dimensions.height : 70,
            offset: offset,
            index: index,
        };
    }
    messageList() {
        return (
            <BleashupFlatList
                keyboardShouldPersistTaps={'handled'}
                marginTop
                firstIndex={0}
                ref="bleashupSectionListOut"
                inverted={true}
                loadMoreFromRemote={() => this.props.isComment && this.loadComments()}
                renderPerBatch={20}
                initialRender={20}
                numberOfItems={
                    stores.Messages.messages[this.roomID]
                        ? stores.Messages.messages[this.roomID].length
                        : 0
                }
                getItemLayout={this.getItemLayout.bind(this)}
                keyExtractor={(item, index) => (item ? item.id : null)}
                renderItem={(item, index) => {
                    this.delay =
                        this.delay >= 20 || (item && !item.sent) ? 0 : this.delay + 1;
                    return item ? (
                        <Message
                            voteShare={this.voteShare.bind(this)}
                            voteItem={(index, vote) => {
                                console.warn(vote)
                                emitter.emit("vote-me", index, vote);
                            }}
                            react={this.reactToMessage.bind(this)}
                            showReacters={this.showReacters.bind(this)}
                            messagelayouts={this.messagelayouts}
                            setCurrentLayout={(layout) => {
                                this.messagelayouts[item.id] = layout;
                                // (!item.dimensions || item.dimensions.height < layout.height) &&
                                stores.Messages.persistMessageDimenssions(
                                    layout,
                                    index,
                                    this.roomID
                                );
                            }}
                            newCount={this.props.newMessages.length}
                            index={index}
                            scrolling={this.scrolling}
                            computedMaster={this.props.computedMaster}
                            showVoters={(voters) => this.showVoters(voters)}
                            votes={stores.Votes.votes[this.props.activity_id]}
                            activity_id={this.props.activity_id}
                            showProfile={(pro) => this.props.showProfile(pro)}
                            delay={this.delay}
                            room={this.roomID}
                            PreviousMessage={
                                stores.Messages.messages[this.roomID] &&
                                stores.Messages.messages[this.roomID]
                                [index >= 0 ? index + 1 : 0]
                            }
                            showActions={(message,reply) => this.showMessageAction(message,reply)}
                            firebaseRoom={this.props.firebaseRoom}
                            roomName={this.props.roomName}
                            sendMessage={(message) => this.sendTextMessage(message)}
                            received={
                                item.received && this.props.members
                                    ? item.received.length >= this.props.members.length
                                    : false
                            }
                            replaceMessageVideo={(data) => this.replaceMessageVideo(data)}
                            showPhoto={(photo) => this.showPhoto(photo)}
                            replying={(replyer, color) => {
                                this.fucussTextInput();
                                this.replying(replyer, color);
                            }}
                            replaceMessage={(data) => this.replaceMessage(data)}
                            replaceAudioMessage={(data) => this.replaceAudioMessage(data)}
                            handleReplyExtern={(reply) => {
                                this.handleReplyExtern(reply);
                            }}
                            message={item}
                            openReply={(replyer) => {
                                /*this.setState({
                                    replyer: replyer,
                                    showRepliedMessage: true,
                                });*/
                                this.scrollToIndex(findIndex(stores.Messages.messages[this.roomID], { id: replyer.id }))
                            }}
                            user={this.props.user.phone}
                            creator={this.props.creator}
                            replaceMessageFile={(data) => this.replaceMessageFile(data)}
                            playVideo={(source) => this.playVideo(source)}
                        ></Message>
                    ) : null;
                }}
                dataSource={
                    stores.Messages.messages[this.roomID] &&
                        stores.Messages.messages[this.roomID].length > 0
                        ? stores.Messages.messages[this.roomID]
                        : []
                }
                newData={this.showMessage}
                newDataLength={this.showMessage.length}
            ></BleashupFlatList>
        );
    }
    handleReplyExtern(replyer) {
        if (replyer.type_extern === "Votes") {
            this.setState({
                isVoteCreationModalOpened: true,
                single_vote: true,
                vote_id: replyer.id,
            });
        } else {
            this.props.handleReplyExtern(replyer);
        }
    }
    showAudio() {
        this.toggleAudioRecorder();
        this.markAsRead();
        this.adjutRoomDisplay()
    }
    tags = null;
    chooseItem(item) {
        let element = {
            phone: item.phone,
            nickname: "@" + toTitleCase(item.nickname),
        };
        this.tags ? this.tags.push(element) : (this.tags = [element]);
        let currentText = this.state.textValue;
        currentText = currentText.split("@");
        currentText[currentText.length - 1] = toTitleCase(item.nickname) + " ";
        this.setState({
            textValue: currentText.join("@"),
        });
    }
    tagger() {
        return (
            <View
                style={{
                    width: "100%",
                    backgroundColor: colorList.bottunerLighter,
                    borderTopLeftRadius: 5,
                    maxHeight: 200,
                    minHeight: 0,
                    borderTopRightRadius: 5,
                    padding: "2%",
                }}
            >
                <BleashupFlatList
                    fit
                    empty={() => {
                        this.setState({
                            tagging: false,
                        });
                    }}
                    backgroundColor={"transparent"}
                    keyboardShouldPersistTaps={"always"}
                    firstIndex={0}
                    renderPerBatch={20}
                    initialRender={7}
                    keyExtractor={(ele) => ele.phone}
                    dataSource={globalFunctions.returnUserSearch(
                        this.searchableMembers,
                        this.state.textValue && this.state.textValue.split("@").length > 1
                            ? this.state.textValue.split("@")[
                            this.state.textValue.split("@").length - 1
                            ]
                            : "~-pz"
                    )}
                    numberOfItems={this.searchableMembers.length}
                    renderItem={(item) => (
                        <TouchableOpacity
                            onPress={() => requestAnimationFrame(() => this.chooseItem(item))}
                        >
                            <View style={{ width: 150, alignSelf: "flex-start" }}>
                                <ProfileSimple
                                    searching
                                    searchString={
                                        this.state.textValue.split("@")[
                                        this.state.textValue.split("@").length - 1
                                        ]
                                    }
                                    profile={item}
                                ></ProfileSimple>
                            </View>
                        </TouchableOpacity>
                    )}
                ></BleashupFlatList>
            </View>
        );
    }
    keyboardView() {
        return (
            <View
                style={{
                    alignItems: "center",
                    borderColor: "gray",
                    padding: "1%",
                    width: "99%",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignSelf: "center",
                        alignSelf: "center",
                        width: colorList.containerWidth - 8,
                    }}
                >
                    <View
                        style={{
                            width: "86%",
                            fontSize: 17,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderColor: "#1FABAB",
                            borderWidth: 0,
                            borderRadius: 10,
                        }}
                    >
                        <View
                            style={{
                                width: "12%",
                                marginTop: "auto",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "1%",
                            }}
                        >
                            <Icon
                                onPress={() => this.openCamera()}
                                style={{ color: "#696969" }}
                                type={"MaterialCommunityIcons"}
                                name={"image-filter"}
                            ></Icon>
                        </View>
                        <View
                            style={{
                                width: "88%",
                                flexDirection: "column",
                                borderRadius: 20,
                                borderWidth: 0.2,
                                borderColor: "grey",
                                borderTopLeftRadius:
                                    this.state.replying ||
                                        this.state.tagging ||
                                        this.state.showAudioRecorder
                                        ? 5
                                        : 20,
                                borderTopRightRadius:
                                    this.state.replying ||
                                        this.state.tagging ||
                                        this.state.showAudioRecorder
                                        ? 5
                                        : 20,
                            }}
                        >
                            {
                                //* Reply Message caption */
                                this.state.replying ? this.replyMessageCaption() : null
                            }
                            {
                                //* Tagger component @Giles e.g *//
                                this.state.tagging ? this.tagger() : null
                            }
                            {
                                // ******************** Audio Recorder Input ************************//

                                this.audioRecorder()
                            }
                            <TextInput
                                value={this.state.textValue}
                                onChange={(event) => this._onChange(event)}
                                placeholder={"Your Message"}
                                style={{
                                    alignSelf: "flex-start",
                                    width: "84%",
                                    maxHeight: 300,
                                    minHeight: 15,
                                    marginLeft: "3%",
                                }}
                                placeholderTextColor="#66737C"
                                multiline={true}
                                ref={(r) => {
                                    this._textInput = r;
                                }}
                            />
                            <View
                                style={{
                                    marginTop: "auto",
                                    marginBottom: "auto",
                                    width: "16%",
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                }}
                            >
                                <Icon
                                    onPress={() => {
                                        this.toggleEmojiKeyboard();
                                        this.markAsRead();
                                    }}
                                    style={{
                                        color: "gray",
                                        marginBottom: 11,
                                        alignSelf: "flex-end",
                                        marginRight: "8%",
                                    }}
                                    type="Entypo"
                                    name="emoji-flirt"
                                ></Icon>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            width: "12%",
                            marginTop: "auto",
                            padding: "1%",
                        }}
                    >
                        {!this.state.textValue && !this.state.showAudioRecorder ? (
                            <Icon
                                style={{
                                    color: colorList.bodyIcon,
                                    alignSelf: "flex-end",
                                }}
                                onPress={() => {
                                    this.showAudio();
                                }}
                                type={"FontAwesome5"}
                                name={"microphone-alt"}
                            ></Icon>
                        ) : (
                                <Icon
                                    onPress={() => {
                                        requestAnimationFrame(() => {
                                            return this.sendMessageText(this.state.textValue);
                                        });
                                    }}
                                    style={{ color: colorList.bodyIcon, alignSelf: "flex-end" }}
                                    name="md-send"
                                    type="Ionicons"
                                ></Icon>
                            )}
                    </View>
                </View>
                {
                    // ***************** Emoji keyBoard Input ***********************//
                    this.state.showEmojiInput ? this.imojiInput() : null
                }
            </View>
        );
    }

    replyMessageCaption() {
        return (
            <View
                style={{
                    backgroundColor: this.state.replyerBackColor,
                    alignSelf: "center",
                    width: "100%",
                }}
            >
                <ReplyText
                    compose={true}
                    openReply={(replyer) => {
                        replyer.type_extern
                            ? this.handleReplyExtern(replyer)
                            : this.setState({
                                replyer: replyer,
                                showRepliedMessage: true,
                            });
                    }}
                    pressingIn={() => { }}
                    showProfile={(pro) => this.props.showProfile(pro)}
                    reply={this.state.replyContent}
                ></ReplyText>
                <TouchableOpacity
                    onPress={() => requestAnimationFrame(this.cancleReply.bind(this))}
                    style={{
                        ...rounder(30, colorList.buttonerBackground),
                        position: "absolute",
                        marginRight: 6,
                        marginTop: 1,
                        alignSelf: "flex-end",
                    }}
                >
                    <Icon
                        name={"close"}
                        type={"EvilIcons"}
                        style={{
                            alignSelf: "center",
                            color: colorList.bodyBackground,
                        }}
                    ></Icon>
                </TouchableOpacity>
            </View>
        );
    }

    audioRecorder() {
        return (
            <AudioRecorder
                justHideMe={() => {
                    this.setState({
                        showAudioRecorder: false,
                    });
                    this.refs.AudioRecorder.stopRecordSimple();
                }}
                showAudioRecorder={this.state.showAudioRecorder}
                sendAudioMessge={(file, duration, dontsend) =>
                    this.sendAudioMessge(file, duration, dontsend)
                }
                ref={"AudioRecorder"}
                toggleAudioRecorder={() => this.toggleAudioRecorder()}
            ></AudioRecorder>
        );
    }

    imojiInput() {
        return (
            <View style={{ marginLeft: "-1.5%", width: "100%", height: 300 }}>
                <EmojiSelector
                    onEmojiSelected={(emoji) => this.handleEmojiSelected(emoji)}
                    enableSearch={false}
                    ref={(emojiInput) => (this._emojiInput = emojiInput)}
                    resetSearch={this.state.reset}
                    showSearchBar={false}
                    loggingFunction={this.verboseLoggingFunction.bind(this)}
                    verboseLoggingFunction={true}
                    filterFunctions={[this.filterFunctionByUnicode]}
                ></EmojiSelector>
            </View>
        );
    }
    header() {
        return (
            <View>
                <View
                    style={{
                        ...bleashupHeaderStyle,
                        width: colorList.containerWidth,
                        height: colorList.headerHeight,
                        backgroundColor: colorList.headerBackground,
                        flexDirection: "row",
                        headerStyles,
                    }}
                >
                    <View
                        style={{
                            width: "65%",
                            height: colorList.headerHeight,
                            flexDirection: "row",
                            alignSelf: "flex-start",
                            alignItems: "center",
                        }}
                    >
                        <Icon
                            onPress={this.props.goback}
                            style={{
                                color: colorList.headerIcon,
                                marginLeft: "6%",
                                marginRight: "7%",
                            }}
                            type={"MaterialIcons"}
                            name={"arrow-back"}
                        ></Icon>
                        <View>
                            <Title
                                style={{
                                    color: colorList.headerText,
                                    fontSize: colorList.headerFontSize,
                                    fontWeight: colorList.headerFontweight,
                                }}
                            >
                                {this.roomID === this.props.activity_id?this.props.activity_name:this.props.roomName}
                            </Title>
                            <View style={{ height: 10, position: "absolute" }}>
                                {this.state.typing && <TypingIndicator></TypingIndicator>}
                            </View>
                        </View>

                        {
                            //!! you can add the member last seen here if the room has just one member */
                        }
                    </View>

                    <View
                        style={{
                            width: "35%",
                            flexDirection: "row",
                            alignSelf: "flex-end",
                            alignItems: "center",
                            justifyContent: "space-between",
                            height: 50,
                        }}
                    >
                        <View style={{ height: colorList.headerHeight, marginLeft: "10%" }}>
                            <ChatRoomPlus
                                computedMaster={this.props.computedMaster}
                                master={this.props.master}
                                eventID={this.props.activity_id}
                                roomID={this.props.firebaseRoom}
                                public={this.props.public_state}
                                addAudio={() => {
                                    this.openAudioPicker();
                                    this.markAsRead();
                                }}
                                addFile={() => this.openFilePicker()}
                                showVote={() => this.openVoteCreation()}
                                showReminds={() => {
                                    this.props.addRemind(this.props.members);
                                }}
                                addPhotos={() => this.openPhotoSelector()}
                                addMembers={() => this.props.addMembers()}
                            ></ChatRoomPlus>
                        </View>
                        <View style={{ height: colorList.headerHeight }}>
                            <ChatroomMenu
                                showMembers={() => this.showMembers()}
                                addMembers={() => this.props.addMembers()}
                                closeCommitee={() => this.props.close()}
                                openCommitee={() => this.props.open()}
                                leaveCommitee={() => this.props.leave()}
                                showRoomMedia={() => this.showRoomMedia()}
                                removeMembers={() => this.props.removeMembers()}
                                publishCommitee={() => this.props.publish()}
                                master={this.props.master}
                                eventID={this.props.activity_id}
                                roomID={this.props.firebaseRoom}
                                public={this.props.public_state}
                                opened={this.props.opened}
                            ></ChatroomMenu>
                        </View>
                        <View
                            style={{
                                height: colorList.headerHeight,
                                justifyContent: "center",
                                marginRight: "10%",
                            }}
                        >
                            <Icon
                                onPress={() => {
                                    this.props.openMenu();
                                }}
                                style={{ color: colorList.headerIcon, fontSize: 35 }}
                                type={"Ionicons"}
                                name={"ios-menu"}
                            ></Icon>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    newMessageIndicator() {
        return (
            <View
                style={{
                    position: "absolute",
                    height: 40,
                    marginTop: "5%",
                    alignSelf: "center",
                }}
            >
                <View
                    style={{
                        alignSelf: "center",
                        borderRadius: 10,
                        margin: "2%",
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <Text style={{ fontSize: 19, fontWeight: "bold", color: "#00BE71" }}>
                        {this.props.newMessages.length}
                        {" new messages"}
                    </Text>
                    <Icon
                        type="EvilIcons"
                        style={{ color: "#00BE71", marginTop: "3%", fontSize: 19 }}
                        name="arrow-up"
                    ></Icon>
                </View>
            </View>
        );
    }
    handleCaptionImojiOnPress() {
        offset = this.state.replying ? 0.1 : 0;
        this.temp = GState.reply ? JSON.stringify(GState.reply) : null;
        //!this.state.showEmojiInputCaption ?
        Keyboard.dismiss();
        this.adjutRoomDisplay();
        //: this._captionTextInput.focus();
        this.setState({
            showEmojiInputCaption: !this.state.showEmojiInputCaption,
        });
        this.adjutRoomDisplay();
    }
    captionMessageHandler() {
        captionExtraStyles = {
            backgroundColor: colorList.bodyBackground,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            margin: "1%",
        };
        return (
            <View
                style={{
                    position: "absolute",
                    width: screenWidth,
                    height: screenheight,
                    backgroundColor: "black",
                    display: "flex",
                    width: "100%",
                    height: "100%",
                }}
            >
                {this.darkStatus()}
                <ScrollView
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps={"always"}
                    ref={"captionScrollViewRef"}
                >
                    <View style={{ height: this.state.photoHeight, width: "100%" }}>
                        {this.state.image ? (
                            <ReactNativeZoomableView
                                maxZoom={1.5}
                                minZoom={0.5}
                                zoomStep={0.5}
                                initialZoom={1}
                                bindToBorders={true}
                                onZoomAfter={this.logOutZoomState}
                            >
                                {this.state.imageSelected ? (
                                    <Image
                                        resizeMode={"contain"}
                                        width={screenWidth}
                                        style={{ flex: 1 }}
                                        source={{ uri: this.state.image }}
                                    ></Image>
                                ) : null}
                            </ReactNativeZoomableView>
                        ) : null}
                    </View>
                    {
                        //* Reply Message caption */
                        this.state.replying ? (
                            <View
                                style={{
                                    marginLeft: "-1%",
                                    ...captionExtraStyles,
                                }}
                            >
                                <ReplyText
                                    openReply={(replyer) => {
                                        this.setState({
                                            replyer: replyer,
                                            showRepliedMessage: true,
                                        });
                                    }}
                                    showProfile={(prop) => {
                                        this.showProfile(pro);
                                    }}
                                    pressingIn={() => { }}
                                    reply={this.state.replyContent}
                                ></ReplyText>
                            </View>
                        ) : null
                    }
                    {this.state.tagging ? (
                        <View style={{ ...captionExtraStyles }}>{this.tagger()}</View>
                    ) : null}
                    <View
                        style={{
                            backgroundColor: "#1FABAB",
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        <Icon
                            onPress={() => {
                                this.handleCaptionImojiOnPress();
                            }}
                            type="Entypo"
                            name="emoji-flirt"
                            style={{ color: "#0A4E52", marginTop: "3%", width: "8%" }}
                        ></Icon>
                        <TextInput
                            multiline={true}
                            enableScrollToCaret
                            ref={(r) => {
                                this._captionTextInput = r;
                            }}
                            value={this.state.textValue}
                            onChange={(data) => this._onChangeCaption(data)}
                            style={{
                                left: 0,
                                right: 0,
                                minHeight: 50,
                                maxHeight: 200,
                                width: "84%",
                            }}
                            placeholder={"Type your message!"}
                        />
                        <Icon
                            style={{
                                color: colorList.bodyIcon,
                                marginTop: "3%",
                                width: "8%",
                            }}
                            onPress={() => this._sendCaptionMessage()}
                            type={"Ionicons"}
                            name={"md-send"}
                        ></Icon>
                    </View>
                    {
                        //********** Caption Emoji Keyboard *******************************/
                        this.state.showEmojiInputCaption ? this.captionImojiInput() : null
                    }
                    <View style={{ position: "absolute", margin: "3%" }}>
                        <Icon
                            style={{ color: "#FEFFDE" }}
                            onPress={() => {
                                this.setState({
                                    showCaption: false,
                                    showPhoto: false,
                                    showVideo: false,
                                });
                                //this._resetTextInput()
                            }}
                            name="close"
                            type={"EvilIcons"}
                        ></Icon>
                    </View>
                </ScrollView>
            </View>
        );
    }

    captionImojiInput() {
        return (
            <View style={{ width: "100%", height: 300 }}>
                <EmojiSelector
                    onEmojiSelected={(emoji) => this.handleEmojieSectionCaption(emoji)}
                    //enableSearch={false}
                    ref={(emojiInput) => (this._emojiInputCaption = emojiInput)}
                    resetSearch={this.state.reset}
                    showSearchBar={false}
                    loggingFunction={this.verboseLoggingFunction.bind(this)}
                    verboseLoggingFunction={true}
                    filterFunctions={[this.filterFunctionByUnicode]}
                ></EmojiSelector>
            </View>
        );
    }
    duration = 10;
    replyMessageViewer() {
        let message =
            stores.Messages.messages[this.roomID] &&
            find(stores.Messages.messages[this.roomID], {
                id: this.state.replyer.id,
            });
        return (
            <View
                style={{
                    height: 1000,
                    position: "absolute",
                    backgroundColor: this.transparent,
                    width: "100%",
                }}
            >
                <View
                    style={{ display: "flex", flexDirection: "row", marginTop: "3%" }}
                >
                    {this.state.replyer.sender.phone == this.sender.phone ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    showRepliedMessage: false,
                                });
                            }}
                        >
                            <Icon
                                type="EvilIcons"
                                style={{ margin: "7%", fontSize: 35, color: "#FEFFDE" }}
                                name={"close"}
                            ></Icon>
                        </TouchableOpacity>
                    ) : null}
                    <ScrollView style={{ top: 0, bottom: 0, height: screenheight - 60 }}>
                        <View style={{ display: "flex" }}>
                            <Text
                                style={{
                                    color: "#FEFFDE",
                                    alignSelf: "center",
                                    fontWeight: "bold",
                                }}
                            >
                                {dateDisplayer(
                                    moment(message && message.created_at).format("YYYY/MM/DD")
                                )}
                            </Text>
                            {
                                <Message
                                    computedMaster={this.props.computedMaster}
                                    openReply={(replyer) => {
                                        console.warn("replying", replyer);
                                        this.setState({
                                            replyer: replyer,
                                            showRepliedMessage: true,
                                        });
                                    }}
                                    handleReplyExtern={(reply) => {
                                        this.props.handleReplyExtern(reply);
                                    }}
                                    showProfile={(pro) => this.props.showProfile(pro)}
                                    replying={() => { }}
                                    received={
                                        this.state.replyer.received && this.props.members
                                            ? this.state.replyer.received.length >=
                                            this.props.members.length
                                            : false
                                    }
                                    showPhoto={(photo) => this.showPhoto(photo)}
                                    playVideo={(source) => this.playVideo(source)}
                                    creator={2}
                                    user={this.sender.phone}
                                    message={message || {}}
                                />
                            }
                        </View>
                    </ScrollView>
                    {!(this.state.replyer.sender.phone == this.sender.phone) ? (
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    showRepliedMessage: false,
                                });
                            }}
                        >
                            <Icon
                                type="EvilIcons"
                                style={{
                                    margin: "2%",
                                    marginTop: "8%",
                                    fontSize: 35,
                                    color: "#FEFFDE",
                                }}
                                name={"close"}
                            ></Icon>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        );
    }
    darkStatus = () => (
        <StatusBar
            hidden={this.state.hideStatusBar}
            animated={true}
            barStyle="light-content"
            backgroundColor="#000"
        ></StatusBar>
    );
    VideoShower() {
        return (
            <View
                style={{
                    height: this.state.fullScreen
                        ? "100%"
                        : this.state.keyboardOpened ||
                            this.state.showEmojiInput ||
                            this.state.showEmojiInputCaption
                            ? this.state.replying
                                ? 255
                                : 300
                            : 400,
                    position: "absolute",
                    width: this.state.fullScreen ? "100%" : screenWidth,
                    backgroundColor: this.transparent,
                    alignSelf: "center",
                }}
            >
                {this.darkStatus()}
                <VideoPlayer
                    source={{ uri: this.state.video }} // Can be a URL or a local file.
                    ref={(ref) => {
                        this.videoPlayer = ref;
                    }}
                    onBuffer={() => this.buffering()} // Callback when remote video is buffering
                    onError={(error) => {
                        console.error(error);
                    }}
                    toggleResizeModeOnFullscreen={false}
                    //pictureInPicture={true}
                    resizeMode={"contain"}
                    disableVolume={true}
                    seekColor="#1FABAB"
                    controlTimeout={null}
                    //disablePlayPause={true}
                    //disableFullscreen={true}
                    onBack={() => this.hideVideo()}
                    onEnterFullscreen={() => this.enterFullscreen()}
                    onExitFullscreen={() => this.enterFullscreen()}
                    fullscreenOrientation={"landscape"}
                    //fullscreen={true}
                    //controls={true}
                    style={{
                        backgroundColor: this.transparent,
                    }}
                    videoStyle={{
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                    }} // Callback when video cannot be loaded
                />
            </View>
        );
    }

    PhotoShower() {
        return (
            <View
                style={{
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    backgroundColor: "black",
                }}
            >
                {this.darkStatus()}
                <View style={{ alignSelf: "center" }}>
                    <ReactNativeZoomableView
                        maxZoom={1.5}
                        minZoom={0.5}
                        zoomStep={0.5}
                        initialZoom={1}
                        bindToBorders={true}
                        onZoomAfter={this.logOutZoomState}
                    >
                        <Image
                            resizeMode={"contain"}
                            width={screenWidth}
                            height={screenheight}
                            source={{ uri: this.state.photo }}
                        ></Image>
                    </ReactNativeZoomableView>
                    <Icon
                        type="EvilIcons"
                        onPress={() => {
                            this.setState({
                                showPhoto: false,
                                showCaption: false,
                                //hideStatusBar: false
                            });
                        }}
                        style={{
                            margin: "1%",
                            position: "absolute",
                            fontSize: 30,
                            color: "#FEFFDE",
                        }}
                        name={"close"}
                    ></Icon>
                </View>
            </View>
        );
    }
}
export default ChatRoom;
