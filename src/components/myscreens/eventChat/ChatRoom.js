/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    Keyboard,
    StatusBar,
    KeyboardAvoidingView,
    ImageBackground,
    Vibration,
    Clipboard,
    Linking,
} from 'react-native';
import VideoPlayer from './VideoController';
import BleashupFlatList from '../../BleashupFlatList';
import Message from './Message';
import {
    find,
    orderBy,
    reject,
    findIndex,
    map,
    uniqBy,
    groupBy,
    values,
} from 'lodash';
import moment from 'moment';
import firebase from 'react-native-firebase';
import stores from '../../../stores';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import VerificationModal from '../invitations/components/VerificationModal';
import GState from '../../../stores/globalState';
import {
    LoadMoreComments,
} from '../../../services/cloud_services';
import Waiter from '../loginhome/Waiter';
import MediaTabModal from './MediaTabModal';
import testForURL from '../../../services/testForURL';
import emitter from '../../../services/eventEmiter';
import colorList from '../../colorList';
import { PrivacyRequester } from '../settings/privacy/Requester';
import { observer } from 'mobx-react';
import PublishersModal from '../../PublishersModal';
import Requester, { deleteMes } from './Requester';
import globalFunctions from '../../globalFunctions';
import MessageActions from './MessageActons';
import replies from './reply_extern';
import ChatKeyboard from './ChatKeyboard';
import ChatRoomHeader from './ChatRoomHeader';
import shadower from '../../shadower';
import InChatVideoPlayer from './InChatVideoPlayer';
import {
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native';
import CacheImages from '../../CacheImages';
import BeNavigator from '../../../services/navigationServices';
import AnimatedComponent from '../../AnimatedComponent';
import ColorList from '../../colorList';
import { Platform } from 'react-native';
import request from '../../../services/requestObjects';
import Options from './optionsModal';
import { BackHandler } from 'react-native';
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import SideButton from '../../sideButton';
import Toaster from '../../../services/Toaster';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import IDMaker from '../../../services/IdMaker';
import FileExachange from '../../../services/FileExchange';
import Texts from '../../../meta/text';
import { sayTyping, copyText } from './services';
import { typing } from '../../../meta/events';
import { reply_me } from '../../../meta/events';
import message_types from './message_types';
import Vibrator from '../../../services/Vibrator';
import MessageInfoModal from './messageInfoModal';
import { search, computeSearch, startSearching, cancelSearch, finish, pushSearchDown, pushSearchUp } from './searchServices';
import messagePreparer from './messagePreparer';
import active_types from './activity_types';
import UserService from '../../../services/userHttpServices';
import EventListener from '../../../services/severEventListener';
import rounder from '../../../services/rounder';
import dateDisplayer from '../../../services/dates_displayer';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
@observer
class ChatRoom extends AnimatedComponent {
    initialize() {
        this.authObserver();
        this.state = {
            isModalOpened: false,
            showOptions: false,
            searchString: "",
            currentSearchIndex: -1,
            foundIndex: -1,
            dontShowKeyboard: false,
            searchResult: [],
            showHeader: !this.props.isComment,
            messageListHeight: this.formHeight(120 / screenheight),
        };
        this.filterFunc = globalFunctions.filterMessages
        this.search = search.bind(this)
        this.computeSearch = computeSearch.bind(this)
        this.startSearching = startSearching.bind(this)
        this.cancelSearch = cancelSearch.bind(this)
        this.finish = finish.bind(this)
        this.pushSearchDown = pushSearchDown.bind(this)
        this.pushSearchUp = pushSearchUp.bind(this)
        this.renderMessage = this.renderMessage.bind(this)
        this.keyExtractor = this.keyExtractor.bind(this)
        this.onScroll = this.onScroll.bind(this)
        this.getItemLayout = this.getItemLayout.bind(this)
        this.defaultItem = this.defaultItem.bind(this)
        this.onFlatlistItemsChange = this.onFlatlistItemsChange.bind(this)
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
                    })
                    .catch((error) => {
                        console.warn(error);
                    });
            });
    }
    authObserver() {
        firebase.auth().onAuthStateChanged(this.bootstrap.bind(this));
    }
    room = null;
    bootstrap(user) {
        if (!user) {
            firebase
                .auth()
                .signInWithPhoneNumber(this.props.user.phone)
                .then((confirmCode) => {
                    this.setStatePure({
                        isModalOpened: true,
                    });
                    stores.TempLoginStore.confirmCode = confirmCode;
                })
                .catch((e) => {
                    switch (e.code) {
                        case 'auth/operation-not-allowed':
                            console.warn('Enable anonymous in your firebase console.');
                            break;
                        default:
                            console.warn(e);
                            break;
                    }
                });
        } else {
        }
    }

    roomID = this.props.firebaseRoom;

    toastStyle = {
        marginTop: '-10%',
        paddingTop: '3%',
    };
    typingRef = null;
    currentTyper = null;
    typingListener = this.props.isRelation ? this.props.oponent : this.props.firebaseRoom
    showTypingToast(newTyper) {
        console.warn("receving say typing")
        !this.sayTyping ? this.sayTyping = sayTyping.bind(this) : null
        this.sayTyping(newTyper)
    }
    setTyingState() {
        return Requester.sayTyping(this.typingListener,
            this.props.activity_id)
    }
    formStorableData() {
        let result = [];
        return new Promise((resolve, reject) => {
            stores.Messages.addNewSeparator(this.roomID)
        });
    }
    checkForReply() {
        setTimeout(() => {
            GState.reply &&
                GState.reply.activity_id === this.props.activity_id
                && this.replying(GState.reply, null)
        }, GState.waitToReply)
    }
    removeNewIndicator() {
        return new Promise((resovle, reject) => {
            GState.currentCommitee = this.roomID
            GState.currentRoom = this.roomID
            if (this.findI(Texts.new_messages)) {
                stores.States.removeNewMessage(this.roomID)
                stores.Messages.removeNewIndicator(this.roomID)
            }
        })
    }

    showMessage = [];
    initializeNewMessageForRoom() {
        stores.Messages.addNewSeparator(this.roomID)
        this.initTimeout = setTimeout(() => {
            this.setStatePure({
                loaded: true,
            }, () => {
                this.checkForReply()
                this.adjutRoomDisplay();
                this.scrollToMessage()
            });
            clearTimeout(this.initTimeout)
        });
    }
    componentDidMount() {
        this.saveNotificationToken();
        this.initializeNewMessageForRoom()
    }
    scrollToNewMessage() {
        const recentID = stores.States.getMostRecentMessage(this.roomID)
        const index = recentID ? this.findI(recentID) : stores.States.getNewMessagesCount(this.roomID)
        if (index) {
            this.scrollToIndex(index)
        }
    }
    findI(id) {
        return findIndex(stores.Messages.messages[this.props.firebaseRoom], { id })
    }
    scrollToMessage() {
        if (this.props.id) {
            return new Promise(() => {
                let index = this.findI(this.props.id)
                if (index >= 0) {
                    setTimeout(() => {
                        this.scrollToIndex(index)
                    })
                } else {
                    Toaster({ text: Texts.not_found_item })
                }
            })
        } else {
            this.scrollToNewMessage()
        }
    }
    adjutRoomDisplay(dontToggle) {
        this.adjustDisplayTimeout = setTimeout(() => {
            GState.reply &&
                GState.reply.activity_id === this.props.activity_id &&
                !this.alreadyFocussed && this.fucussTextInput();
            this.alreadyFocussed = true;
            clearTimeout(this.adjustDisplayTimeout)
        }, 30);
    }
    showImoji() {
        this.setStatePure({ showingImoji: true })
    }
    hideImoji() {
        this.setStatePure({ showingImoji: false })
    }
    handleBackButton() {
        if (this.state.fullScreen) {
            this.enterFullscreen()
            return true
        } else if (this.state.showVideo) {
            this.hideVideo()
            return true
        } else if (this.state.showingImoji) {
            this.hideImoji()
            return true
        } else if (this.state.showOptions) {
            this.setStatePure({
                showOptions: false
            })
            return true
        } else if (this.state.showAudioRecorder) {
            this.refs.keyboard && this.refs.keyboard.toggleAudioRecorder()
            return true
        } else if (this.refs.keyboard && this.refs.keyboard.state.showCaption) {
            this.refs.keyboard.hideCaption()
            return true
        } /*else if (this.refs.keyboard && this.refs.keyboard.state.replying) {
            //this.refs.keyboard.cancleReply()
            return true
        }*/ else {
            return false
        }
    }
    startReplyListener() {
        emitter.on(this.reply_me_event, (rep) => {
            this.props.closeMenu && this.props.closeMenu()
            this.replying(rep, null)
            this.focusInputTimeout = setTimeout(() => {
                this.alreadyFocussed = false;
                this.fucussTextInput()
                clearTimeout(this.focusInputTimeout)
            }, 400)
        })
    }
    startTypingListener() {
        emitter.on(this.typing_event, (typer) => {
            this.showTypingToast(typer);
        })
    }
    startKeyboardListeners() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow.bind(this));
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide.bind(this));
    }
    addBackListener() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));
    }
    componentMounting() {
        PrivacyRequester.makeOnline()
        this.startKeyboardListeners()
        this.addBackListener()
        this.startReplyListener()
        this.startTypingListener()
        this.props.isComment ? (stores.Messages.messages[this.roomID] = []) : null;
    }
    saveMostRecentMessage() {
        if (stores.Messages.messages[this.roomID] &&
            stores.Messages.messages[this.roomID][0])
            stores.States.setMostRecentMessage(this.roomID,
                stores.Messages.messages[this.roomID][0].id)

    }
    reply_me_event = reply_me
    typing_event = typing(this.typingListener)
    hide_keyboard_event = "hide_keyboard"
    unmountingComponent() {
        PrivacyRequester.makeOffline()
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton.bind(this));
        this.keyboardDidHideSub.remove();
        this.keyboardDidShowSub.remove();
        this.saveMostRecentMessage()
        emitter.off(this.typing_event)
        emitter.off(this.reply_me_event);
        this.removeNewIndicator()
        GState.currentRoom = null;
    }
    handleKeyboardDidShow = (event) => {
        //this.removeNewIndicator()
        this.openedKeyboard = true;
    };

    handleKeyboardDidHide = () => {
        this.openedKeyboard = false;
    };

    convertPercentageToInt(data) {
        return parseInt(data.split('%')[0]) / 100;
    }
    formHeight(factor) {
        return (1 - factor) * screenheight;
    }
    concludePlay(video, message, index) {
        this.setStatePure({
            playingMessage: message,
            playingIndex: index,
            video: video,
            fullScreen: true,
            showPhoto: false,
            showVideo: true,
        });
        this.animateKeyboard()
    }
    playVideo(video, message, index) {
        if (testForURL(video)) {
            this.concludePlay(video, message, index)
        } else {
            (new FileExachange()).doFileExists(video).then(status => {
                if (status) {
                    this.concludePlay(video, message, index)
                } else {
                    Toaster({ text: Texts.not_available_video })
                }
            })
        }
    }
    hideVideo() {
        this.setStatePure({
            showVideo: false,
            hideStatusBar: false,
            fullScreen: false,
            showCaption: false,
        });
        this.animateKeyboard()
    }
    animateKeyboard() {
        this.refs.keyboard && this.refs.keyboard.animateLayout();
    }
    buffering() {
        this.setStatePure({
            buffering: true,
        });
        this.bufferingTimeout = setTimeout(() => {
            this.setStatePure({
                buffering: false,
            }, () => {
                clearTimeout(this.bufferingTimeout)
            });
        }, 5000);
    }

    renderMessages(data) {
        data = {
            ...data,
            receive: [{ phone: this.user.phone, time: moment().format() }],
        };
        return data.map((element) => this.chooseComponent(element));
    }
    enterFullscreen(exit) {
        this.setStatePure({
            fullScreen: exit ? false : !this.state.fullScreen
        })
    }
    togglePlay() {
        this.setStatePure({
            playing: !this.state.playing,
        });
    }

    _resetCaptionInput() { }

    received = [{ phone: this.props.user.phone, date: moment().format() }];
    sendMessage(messager) {
        return new Promise((resolve, reject) => {
            if (messager) {
                GState.reply = null;
                messager = { ...messager, sent: true };
                Requester.sendMessage(
                    messager,
                    this.roomID,
                    this.props.activity_id
                    , false, this.props.isRelation ? false : this.props.activity_name).then((response) => {
                        setTimeout(() => {
                            resolve(messager);
                        }, 100)
                    });
            } else {
                resolve(messager);
                this.removeNewIndicator()
            }
        });
    }
    sending = false;
    sendTextMessage(newMessage) {
        if (GState.connected) {
            this.scrollToEnd();
            newMessage = {
                ...newMessage, receive: this.received, sent: true, type:
                    message_types.text
            };
            this.sendMessage(newMessage).then((mess) => {
                stores.Messages.replaceMessage(this.roomID, mess).then(() => {
                    this.initRoom();
                });
            });
        }
    }

    user = this.props.user;
    creator = 1;
    showPhoto(photo, item) {
        setTimeout(() => {
            this.navigateToFullView(item);
        }, this.openedKeyboard ? this.timeToDissmissKeyboard : 0)
        Keyboard.dismiss()
    }
    captionMessages = [];
    sendingCaptionMessages = false;
    uselessSentCount = 0;
    openPhotoSelector() {
        this.scrollToEnd();
        this.refs.keyboard && this.refs.keyboard.pickMultiplePhotos();
    }
    informMembers() { }

    initRoom() {
        this.setStatePure({
            newMessage: !this.state.newMessage,
        });
    }
    replaceMessage(newMessage) {
        newMessage = { ...newMessage, receive: this.received, sent: true };
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
        newMessage = { ...newMessage, receive: this.received, sent: true };
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
        newMessage = { ...newMessage, receive: this.received, sent: true };
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
        newMessage = { ...newMessage, receive: this.received, sent: true };
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
    openAudioPicker() {
        this.refs.keyboard && this.refs.keyboard.pickAudio();
    }
    openFilePicker() {
        this.refs.keyboard &&
            this.refs.keyboard.pickFile();
    }
    duration = 0;

    scrollToEnd() {
        if (this.newCount) {
            this.scrollToNewMessage()
        } else {
            this.refs &&
                this.refs.bleashupSectionListOut &&
                this.refs.bleashupSectionListOut.scrollToEnd();
        }
    }
    initialzeFlatList() {
        this.refs &&
            this.refs.bleashupSectionListOut &&
            this.refs.bleashupSectionListOut.resetItemNumbers();
        this.adjutRoomDisplay();
    }
    verifyNumber(code) {
        stores.TempLoginStore.confirmCode.confirm(code).then((success) => {
            this.setStatePure({
                isModalOpened: false,
            });
        });
    }
    replying(replyer, color) {
        Vibration.vibrate(this.duration);
        this.refs.keyboard && this.refs.keyboard.replying(replyer, color);
    }
    deleteMessageAction() {
        this.deleteMessage(this.state.currentMessage.id);
    }
    showReceived() {
        this.state.currentMessage.sent ? this.setStatePure({
            showMessageInfo: true
        }) : Toaster({ text: Texts.this_message_was_never_sent });
    }
    copyMessage() {
        copyText(this.state.currentMessage.text)
    }
    showMessageAction(message, reply, sender) {
        this.tempReply = reply
        this.removeNewIndicator()
        this.setStatePure({
            sender: sender,
            currentMessage: message,
            showMessageActions: true,
        });
    }
    showMembers() {
        this.props.showMembers(this.props.members);
    }
    messagelayouts = {};
    showRoomMedia() {
        this.setStatePure({
            isMediaModalOpened: true,
            messages: stores.Messages.messages[this.roomID]
                ? JSON.stringify(stores.Messages.messages[this.roomID])
                : JSON.stringify([]),
        });
    }
    showVoters(voters) {
        this.setStatePure({
            showContacts: true,
            voters: voters,
            title: 'Voters list ',
        });
    }
    shareWithContacts(message) {
        this.forwardToContacts(this.state.currentMessage)
    }
    scrollToIndex(index) {
        this.refs.bleashupSectionListOut &&
            this.refs.bleashupSectionListOut.scrollToIndex(index);
        this.refs.bleashupSectionListOut &&
            this.refs.bleashupSectionListOut.scrollToIndex(index);
    }
    startSendingRelation(item) {
        this.refs.keyboard &&
            this.refs.keyboard.starSendingRelation &&
            this.refs.keyboard.starSendingRelation(item)
    }
    messageActions = () => [
        {
            title: Texts.message_report,
            iconName: "info-circle",
            condition: () => this.state.sender,
            iconType: "FontAwesome",
            color: ColorList.replyColor,
            callback: () => this.showReceived()
        },
        {
            title: Texts.reply,
            iconName: "reply",
            condition: () => true,
            iconType: "Entypo",
            callback: () => this.replyMessage()
        },
        {
            title: Texts.reply_privately,
            iconName: "reply",
            condition: () => !this.props.isRelation || this.props.members.length > 1,
            iconType: "Entypo",
            callback: () => this.replyPrivately()
        },
        {
            title: Texts.share,
            iconName: "forward",
            condition: () => true,
            iconType: "Entypo",
            color: ColorList.darkGrayText,
            callback: () => this.forwardToContacts(this.state.currentMessage)
        }
        ,
        {
            title: Texts.remind,
            iconName: "bell",
            condition: () => true,
            iconType: "Entypo",
            color: ColorList.reminds,
            callback: () => this.remindThis(this.state.currentMessage)
        }
        ,
        {
            title: Texts.star,
            iconName: "star",
            condition: () => true,
            iconType: "AntDesign",
            color: ColorList.post,
            callback: () => this.addStar(this.state.currentMessage)
        }
        ,
        {
            title: Texts.copy,
            condition: () => true,
            iconName: "copy",
            iconType: "Feather",
            color: ColorList.copy,
            callback: () => this.copyMessage()
        }
        ,
        {
            title: Texts.delete_,
            condition: () => true,
            iconName: "delete-circle-outline",
            iconType: "MaterialCommunityIcons",
            color: ColorList.delete,
            callback: () => this.deleteMessageAction()
        }
    ]
    hideMessageInfo() {
        this.setStatePure({
            showMessageInfo: false
        })
    }
    currentDayDate() {
        return <View style={{
            position: 'absolute',
            alignSelf: 'center',
            height: 50,
            width: 100,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}><View style={{
            ...shadower(2),
                minWidth: 80,
                minHeight: 30,
                justifyContent: 'center',
                alignItems: 'center',
            backgroundColor: ColorList.descriptionBody,
            borderRadius: 10,
        }}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{
                    ...GState.defaultTextStyle,
                    color: ColorList.indicatorColor,
                    fontSize: 12,
                    textAlign:'center'
                }}>
                    {dateDisplayer(this.state.day_date)}
                </Text>
            </View>
        </View>
    }
    blurTextInput() {
        this.refs.keyboard && this.refs.keyboard.blur();
    }
    writeNewMessageCount() {
        this.newCount = stores.States.getNewMessagesCount(this.roomID)
        return this.newCount && <View style={{
            ...rounder(20, ColorList.reminds)
        }}>
            <Text ellipsizeMode={'tail'} numberOfLines={1} style={{
                fontSize: 8,
                fontWeight: 'bold',
                color: ColorList.bodyBackground
            }}>
                {this.newCount}
            </Text>
        </View>
    }
    render() {
        let canShowHeder = this.state.showHeader && !this.state.showCaption && !this.state.fullScreen
        return (
            <ImageBackground style={GState.imageBackgroundContainer} source={GState.backgroundImage}>
                <View style={{ height: '100%', justifyContent: 'flex-end' }}>
                    {
                        // **********************Header************************ //
                        canShowHeder ? (
                            <View style={{ height: '7.5%' }}>{this.header()}</View>
                        ) : null
                    }

                    <View style={{ height: canShowHeder ? '92.5%' : '100%' }}>
                        <View style={{ height: '100%', justifyContent: 'flex-end' }}>
                            {!this.state.loaded ? (
                                <Waiter />
                            ) : (
                                    <KeyboardAvoidingView behavior={Platform.OS == 'android' ? null : 'padding'} style={{
                                        width: '100%',
                                        height: '100%',

                                    }}>
                                        <View style={{
                                            height: this.state.messageListHeight,
                                            flexDirection: 'column',
                                            justifyContent: 'flex-end',
                                            marginHorizontal: 2,
                                            flex: 1,
                                        }}>
                                            <TouchableWithoutFeedback
                                                onPressIn={() => {
                                                    this.scrolling = false;
                                                    console.warn('pressing in');
                                                    this.adjutRoomDisplay();
                                                    !this.openedKeyboard && this.blurTextInput()
                                                }}
                                            ><View>
                                                    {this.messageList()}
                                                </View>
                                                {this.state.showDownScroller && <SideButton
                                                    buttonColor={'rgba(52, 52, 52, 0.8)'}
                                                    position={"right"}
                                                    //text={"D"}
                                                    renderIcon={() => {
                                                        return <TouchableOpacity onPress={() => requestAnimationFrame(() => { this.scrollToEnd() })}
                                                            style={{
                                                                backgroundColor: ColorList.bodyBackground,
                                                                height: 40,
                                                                width: 40,
                                                                borderRadius: 30,
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                ...shadower(4)
                                                            }}>
                                                            <SimpleLineIcons name="arrow-down"
                                                                type="SimpleLineIcons" style={{
                                                                    color: ColorList.bodyIcon,
                                                                    fontSize: 22
                                                                }} />
                                                            <View style={{
                                                                position: 'absolute',
                                                                height: 30,
                                                                width: 30,
                                                                paddingLeft: 'auto',
                                                                paddingRight: 1,
                                                                alignSelf: 'flex-start',
                                                            }}>
                                                                {this.writeNewMessageCount()}
                                                            </View>
                                                        </TouchableOpacity>
                                                    }}
                                                    action={() => requestAnimationFrame(() => { this.scrollToEnd() })}
                                                    //buttonTextStyle={{color:colorList.bodyBackground}}
                                                    offsetX={15}
                                                    size={20}
                                                //offsetY={20}
                                                />}

                                                {this.state.showCurrentDay ? this.currentDayDate() : null}
                                            </TouchableWithoutFeedback>
                                        </View>
                                        <View style={{
                                            //height:"3%",
                                            justifyContent: 'flex-end',
                                            flexDirection: 'column',
                                            width: "100%",
                                            alignSelf: 'flex-end',
                                            alignItems: 'flex-end',
                                            marginTop: 'auto',
                                            //marginBottom: "1%",
                                        }}>
                                            {!this.props.opened || !this.props.generallyMember ? (
                                                <Text
                                                    style={{
                                                        ...GState.defaultTextStyle,
                                                        fontStyle: 'italic',
                                                        textAlign: "center",
                                                        marginLeft: "auto",
                                                        marginRight: "auto",
                                                    }}
                                                    note
                                                >
                                                    {Texts.closed_activity}
                                                </Text>
                                            ) : (
                                                    // ***************** KeyBoard Displayer *****************************

                                                    !this.state.searching && <View style={{ justifyContent: 'flex-start', width: '100%' }}>{this.keyboardView()}</View>
                                                )}
                                        </View>
                                    </KeyboardAvoidingView>
                                )}
                            {this.state.showMessageInfo ? <MessageInfoModal
                                isOpen={this.state.showMessageInfo}
                                closed={() => this.hideMessageInfo()}
                                item={this.state.currentMessage}
                            >

                            </MessageInfoModal> : null}
                            {/*<VerificationModal
                                isOpened={this.state.isModalOpened}
                                verifyCode={(code) => this.verifyNumber(code)}
                                phone={this.props.user.phone}
                            />*/}
                            {
                                this.state.showOptions && <Options
                                    addStar={this.props.addStar}
                                    activity_id={this.props.activity_id}
                                    select={this.startSendingRelation.bind(this)}
                                    timeToDissmissKeyboard={this.timeToDissmissKeyboard}
                                    openAudioPicker={this.openAudioPicker.bind(this)}
                                    openFilePicker={this.openFilePicker.bind(this)}
                                    addRemind={this.props.addRemind}
                                    openPhotoSelector={this.openPhotoSelector.bind(this)}
                                    onClosed={() => {
                                        this.setStatePure({
                                            showOptions: false
                                        })
                                        Keyboard.dismiss()
                                    }}></Options>
                            }
                            {this.state.showMessageActions ? <MessageActions
                                title={"message actions"}
                                actions={this.messageActions}
                                isOpen={this.state.showMessageActions}
                                onClosed={() => {
                                    this.setStatePure({
                                        showMessageActions: false,
                                    });
                                }}
                            ></MessageActions> : null}
                            {this.state.showReacters ? <PublishersModal
                                isOpen={this.state.showReacters}
                                onClosed={() => {
                                    this.setStatePure({
                                        showReacters: false,
                                    });
                                }}
                                reaction={this.state.currentReaction || {}}
                                reacters={this.state.currentReacters || []}
                            /> : null}
                        </View>
                        {/*
                             ******************Photo Viewer View ***********************
                            this.state.showPhoto ? this.PhotoShower() : null
                        */}
                        {
                            //** ####### Vidoe PLayer View ################ */

                            this.state.showVideo ? this.VideoShower() : null
                        }
                    </View>
                </View>
            </ImageBackground >
        );
    }

    groupByWeek(media) {
        let groupedDates = groupBy(media, (ele) =>
            moment(ele.created_at).startOf('week')
        );
        let keys = Object.keys(groupedDates);
        let result = [];
        for (let i = 0; i < keys.length; i++) {
            result = [
                ...result,
                { type: 'date_separator', id: keys[i] },
                ...groupedDates[keys[i]],
            ];
        }
        return result;
    }
    addStar(message) {
        const star = messagePreparer.formStarFromMessage(message, this.props.activity_id)
        this.props.startThis(star);

    }
    forwardToContacts(message) {
        if (message && message.sent) {
            this.props.showShare && this.props.showShare({
                id: IDMaker.make(),
                created_at: moment().format(),
                sender: this.props.user,
                type: message.type === 'image' ? 'photo' :
                    message.type,
                reply: null,
                forwarded: true,
                from_activity: !message.from_activity
                    ? this.props.activity_id
                    : message.from_activity,
                from_committee: !message.from_committee
                    ? this.roomID
                    : message.committee_id,
                from: message.from
                    ? message.from
                    : message.sender,
            })
        } else {
            Toaster({ text: 'cannot forward unsent messages' });
        }

    }
    replyMessage() {
        this.replyTimout = setTimeout(() => {
            this.refs.keyboard.focus();
            this.replying(this.tempReply);
            clearTimeout(this.replyTimout)
        }, 50);
    }
    replyPrivately() {
        if (this.tempReply) {
            GState.reply = this.tempReply
            GState.reply.private = true
            GState.reply.activity_name = this.props.activity_name
            GState.reply.from_activity = this.props.activity_id
            this.props.replyPrivately && this.props.
                replyPrivately(null, this.state.currentMessage.sender &&
                    this.state.currentMessage.sender.phone.replace("+", "00"))
        }
    }
    remindThis(message) {
        const star = messagePreparer.formRemindFromMessage(message, this.props.activity_id)
        this.props.remindThis(star);
    }
    initializeRoom() {
        this.initialzeFlatList();
        this.setStatePure({
            newMessage: !this.state.newMessage,
        });
    }
    reactToMessage(messageID, reaction) {
        Requester.reactMessage(
            messageID,
            this.roomID,
            reaction,
            this.props.activity_id,
            this.props.isRelation ? false :
                this.props.activity_name
        ).then(() => { });
    }
    openVoteCreation() {
        this.setStatePure({
            isVoteCreationModalOpened: true,
            single_vote: false,
        });
    }
    fucussTextInput() {
        this.refs.keyboard && this.refs.keyboard.focus();
    }
    showReacters(reaction, reacters) {
        this.setStatePure({
            showReacters: true,
            currentReaction: reaction,
            currentReacters: reacters,
        });
        this.animateKeyboard()
    }
    deleteMessage(messageID) {
        if (this.state.currentMessage.sent && this.state.sender) {
            Requester.deleteMessage(
                messageID,
                this.props.activity_id,
                this.roomID
            ).then(() => {
                this.animateKeyboard()
            });
        } else {
            stores.Messages.removeMessage(this.roomID, messageID)
            Requester.cancelMessageSent(messageID)
        }
    }
    delay = 1;
    getItemLayout(item, index) {
        return GState.getItemLayout(item, index,
            stores.Messages.messages[this.roomID], 100)
    }
    choseReply(message) {
        let nickname = message.sender && message.sender.nickname;
        let tempMessage = {
            ...message,
            replyer_name: nickname,
            played: null,
            receive: null,
            received: null,
            sender: null,
            replyer_phone: message.sender &&
                message.sender.phone &&
                message.sender.phone.replace("+", "00"),
            change_date: message.created_at,
            seen: null
        }
        switch (message.type) {
            case message_types.text:
                return tempMessage;
            case message_types.audio:
                tempMessage.audio = true;
                return tempMessage;
            case message_types.video:
                tempMessage.video = true;
                tempMessage.sourcer = message.thumbnailSource;
                return tempMessage;
            case message_types.file:
                tempMessage.file = true;
                let temp = message.file_name.split('.');
                let temper = tempMessage;
                temper.typer = temp[temp.length - 1];
                return temper;
            case message_types.photo:
                tempMessage.sourcer = message.source;
                return tempMessage;
            case message_types.image:
                tempMessage.sourcer = message.source;
                return tempMessage;
            case message_types.remind_message:
                return {
                    ...tempMessage, change_date:
                        message.remind_date
                }
            case message_types.star_message:
                return tempMessage
            case message_types.relation_message:
                return {
                    ...tempMessage,
                    text: '(' + (message.relation_type ==
                        active_types.activity ? Texts.activity : Texts.contacts) + ') ' +
                        message.name + (message.text ? ('\n' + message.text) : "")
                }
            default:
                Toaster({ text: Texts.cannot_reply_unsent_message });
                return null;
        }
    }
    storesLayouts(layout, index) {
        stores.Messages.persistMessageDimenssions(
            layout,
            index,
            this.roomID
        );
    }
    initReply(replyer) {
        this.cancelSearch()
        setTimeout(() => {
            this.fucussTextInput();
            replyer = this.choseReply(replyer);
            replyer && this.replying(replyer);
        })
    }
    handleReply(replyer) {
        this.cancelSearch()
        setTimeout(() => {
            if (replyer.from_activity && replyer.from_activity !== this.props.activity_id) {
                stores.Events.isParticipant(replyer.from_activity,
                    stores.LoginStore.user.phone).then((act) => {
                        if (act) {
                            BeNavigator.goToChatWithIndex(act, replyer.id)
                        } else {
                            this.props.showDetailModal(replyer.from_activity,
                                { message_id: replyer.id })
                        }
                    })
            } else {
                this.handleReplyLocal(replyer)
            }
        }, this.timeToDissmissKeyboard)
    }
    handleReplyLocal(replyer) {
        GState.toggleCurrentIndex(replyer.id, 4000)
        let index = findIndex(stores.Messages.messages[this.roomID], { id: replyer.id });
        index >= 0 && this.scrollToIndex(index);
    }
    toggleDownScroller(val) {
        this.setStatePure({
            showDownScroller: val
        })
    }
    onScroll(event) {
        //this.removeNewIndicator()
        // Check if the user is scrolling up or down by confronting the new scroll position with your own one
        const currentOffset = event.nativeEvent.contentOffset.y
        const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
            ? 'down'
            : 'up'
        // If the user is scrolling down (and the action-button is still visible) hide it
        if (currentOffset > 100) {
            this.toggleDownScroller(true)
        } else {
            this.toggleDownScroller(false)
        }
        this._listViewOffset = currentOffset
    }
    setCurrentLayout(layout, item, index) {
        this.messagelayouts[item.id] = layout;
        GState.itemDebounce(item, () => {
            this.storesLayouts(layout, index)
        }, 500)

    }
    handleForward(item) {
        this.setStatePure({
            currentMessage: item
        }, () => {
            this.shareWithContacts(item)
        })
    }
    showStar(item) {
        setTimeout(() => {
            stores.Events.isParticipant(item.activity_id,
                stores.LoginStore.user.phone).then((event) => {
                    if (event) {
                        BeNavigator.pushActivityWithIndex(event, { post_id: item.star_id }, true)
                    } else {
                        BeNavigator.gotoStarDetail(item.star_id, item.activity_id, {
                            forward: () => this.handleForward(item),
                            room: this.roomID,
                            reply: () => this.checkForReply(),
                            reply_privately: (members, creator) => this.props.replyPrivately([...members,
                            ...this.props.members], creator)
                        })
                    }
                })
        }, this.openedKeyboard ? 0 : this.timeToDissmissKeyboard)
    }
    showRemind(item) {
        setTimeout(() => {
            stores.Events.isParticipant(item.activity_id,
                stores.LoginStore.user.phone).then(event => {
                    if (event) {
                        BeNavigator.pushActivityWithIndex(event, { remind_id: item.remind_id }, true)
                    } else {
                        BeNavigator.goToRemindDetail(item.remind_id, item.activity_id, {
                            forward: () => this.handleForward(item),
                            room: this.roomID,
                            reply: () => this.checkForReply(),
                            reply_privately: (members, creator) => this.props.replyPrivately([...members,
                            ...this.props.members], creator)
                        })
                    }
                })
        }, this.openedKeyboard ? 0 : this.timeToDissmissKeyboard)
    }
    renderMessage(item, index) {
        const lastIndex = this.lastIndex
        let delay =
            delay >= 20 || (item && !item.sent) ? 0 : delay + 1;
        let played = item.type == message_types.audio
            && item.played && item.played.length >=
            this.props.members.length
        let recieved =
            item.receive && this.props.members
                ? item.receive.length >= this.props.members.length
                : false
        let seen = item.seen && this.props.members &&
            item.seen.length >= this.props.members.length ? true : false
        let sent = item.sent
        let pointed = item.id === GState.currentID
        let found = this.state.foundIndex == index ? true : false
        let isFirst = index === 0
        let state = Number(found) +
            Number(recieved) +
            Number(played) +
            Number(sent) +
            Number(pointed) +
            Number(isFirst) +
            Number(seen) + moment(item.updated_at).format("x") +
            this.state.searchString.length

        return <View onLayout={e => this.setCurrentLayout(e.nativeEvent.layout, item, index)} >
            <Message
                showRelation={this.showRelation.bind(this)}
                showStarMessage={() => this.showStar(item)}
                showRemindMessage={() => this.showRemind(item)}
                animate={this.animateUI.bind(this)}
                searchString={this.state.searchString}
                foundString={found ? this.state.searchString : null}
                state={state}
                seen={seen}
                isPointed={pointed}
                isfirst={isFirst}
                received={recieved}
                allplayed={played}
                isRelation={this.props.isRelation}
                react={this.reactToMessage.bind(this)}
                showReacters={this.showReacters.bind(this)}
                messagelayouts={this.messagelayouts}
                forwardMessage={() => {
                    this.forwardToContacts(item);
                }}
                index={index}
                key={item.id}
                scrolling={this.scrolling}
                computedMaster={this.props.computedMaster}
                activity_id={this.props.activity_id}
                showProfile={(pro) => pro && this.props.showProfile(pro.replace("+", "00"))}
                delay={delay}
                room={this.roomID}
                PreviousMessage={
                    stores.Messages.messages[this.roomID] &&
                    stores.Messages.messages[this.roomID][index >= lastIndex ? lastIndex : index + 1]
                }
                showActions={(message, reply, sender) => this.showMessageAction(message, reply, sender)}
                firebaseRoom={this.props.firebaseRoom}
                roomName={this.props.roomName}
                sendMessage={(message) => this.sendTextMessage(message)}
                replaceMessageVideo={(data) => this.replaceMessageVideo(data)}
                showPhoto={(photo) => this.showPhoto(photo, item)}
                replying={(replyer, color) => {
                    this.initReply(replyer);
                }}
                choseReply={this.choseReply}
                replaceMessage={(data) => this.replaceMessage(data)}
                replaceAudioMessage={(data) => this.replaceAudioMessage(data)}
                handleReplyExtern={(reply) => {
                    this.handleReplyExtern(reply);
                }}
                message={item}
                openReply={(replyer) => {
                    this.handleReply(replyer);
                }}
                user={this.props.user.phone}
                creator={this.props.creator}
                replaceMessageFile={(data) => this.replaceMessageFile(data)}
                playVideo={(source) => this.playVideo(source, item, index)}
            />
        </View>
    }
    whatCanBeDoneWithChatRoom = [
        Texts.send_a_message,
        Texts.send_message_as_emoticons,
        Texts.send_multimedia_messages,
        Texts.share_thinks_like,
        Texts.mention_everything,
        Texts.turn_a_message_a_highlight,
        Texts.turn_a_message_into_a_program,
        Texts.react_to_a_message,
        Texts.delete_a_message,
        Texts.see_message_info
    ]
    featuresLister() {
        return this.whatCanBeDoneWithChatRoom.map((ele, index) => <View style={{
            flexDirection: 'row', alignItems: 'center', width: '100%'
        }}>
            <View style={{
                marginRight: '2%',
            }}><Text style={{
                ...GState.defaultTextStyle,
                fontWeight: 'bold',
            }}>{`${index + 1}`}</Text></View>
            <View style={{
                flex: 1,
            }}><Text style={{ ...GState.defaultTextStyle }}>{ele}</Text></View>
        </View>)
    }
    defaultItem() {
        return <View style={GState.descriptBoxStyle}>
            <View style={{
                alignSelf: 'center',
                marginBottom: '3%',
            }}>
                <Text style={GState.featureBoxTitle}>{Texts.b_up_chatroom}</Text>
            </View>
            <View style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}>
                <Text style={{
                    ...GState.defaultTextStyle,
                    fontWeight: 'bold',
                }}>{Texts.use_it_to}</Text>
                {this.featuresLister()}
            </View>
        </View>
    }
    keyExtractor(item, index) {
        return item ? item.id : index.toString()
    }
    showCurrentDay(day) {
        this.setStatePure({
            showCurrentDay: true,
            day_date: day.id
        })
        if (this.showdayTimeoute) clearTimeout(this.showdayTimeoute)
        this.showdayTimeoute = setTimeout(() => {
            this.setStatePure({
                showCurrentDay: false,
                day_date: day.id
            })
        }, 3000)
    }
    onFlatlistItemsChange(info) {
        console.warn("executing show current date")
        if (this.itemChangeTimeout) clearImmediate(this.itemChangeTimeout)
        this.itemChangeTimeout = setTimeout(() => {
            this.viewableItems = info.viewableItems
            this.currentSeparator = this.viewableItems && this.viewableItems.forEach(element => {
                console.warn(element)
                if (element.item.type == message_types.date_separator) {
                    console.warn("trying to show current date")
                    this.showCurrentDay(element.item)
                }
                clearTimeout(this.itemChangeTimeout)
                this.itemChangeTimeout = null
            });
        }, 500)

    }
    messageList() {
        this.data = stores.Messages.messages[this.roomID]
            ? stores.Messages.messages[this.roomID] : []
        this.lastIndex = this.data ?
            (this.data.length - 1) : 0
        return (
            <BleashupFlatList
                onViewableItemsChanged={this.onFlatlistItemsChange}
                onScroll={this.onScroll}
                windowSize={21}
                backgroundColor={'transparent'}
                keyboardShouldPersistTaps={'handled'}
                disableVirtualization={false}
                firstIndex={0}
                ref="bleashupSectionListOut"
                inverted={true}
                defaultItem={this.defaultItem}
                //loadMoreFromRemote={() => this.props.isComment && this.loadComments()}
                renderPerBatch={20}
                initialRender={30}
                numberOfItems={this.data.length}
                getItemLayout={this.getItemLayout}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderMessage}
                dataSource={this.data}
                newData={this.showMessage}
                newDataLength={this.showMessage.length}
            />
        );
    }
    handleReplyExtern(replyer) {
        if (replyer.type_extern === 'Votes') {
            this.setStatePure({
                isVoteCreationModalOpened: true,
                single_vote: true,
                vote_id: replyer.id,
            });
        } else {
            Keyboard.dismiss()
            setTimeout(() => {
                this.props.handleReplyExtern(replyer);
            }, this.openedKeyboard ? this.timeToDissmissKeyboard : 0)
        }
    }
    timeToDissmissKeyboard = 200
    openOptions(shouldClose) {
        this.setStatePure({
            showOptions: shouldClose ? false : !this.state.showOptions
        })
    }
    toggleAudio() {
        this.setStatePure({
            showAudioRecorder: !this.state.showAudioRecorder,
        });
    }
    openPhone(phone) {
        return Linking.openURL(`tel:${phone.replace("00", "+")}`)
    }
    showRelation(item) {
        if (item.type == active_types.activity) {
            stores.Events.isParticipant(item.item, stores.LoginStore.user.phone).then(act => {
                if (act) {
                    BeNavigator.pushToChat(act)
                } else {
                    this.props.showDetailModal(item.item)
                }
            })
        } else {
            stores.TemporalUsersStore.getUser(item.item).then(user => {
                if (user && user.nickname && !user.response) {
                    this.props.showProfile(user.phone)
                } else {
                    this.openPhone(item.item)
                }
            }).catch(() => {
                this.openPhone(item.item)
            })
        }
    }
    keyboardView() {
        return (
            <ChatKeyboard
                activity_name={this.props.activity_name}
                showRelation={this.showRelation.bind(this)}
                dontShowKeyboard={this.state.dontShowKeyboard}
                openedKeyboard={() => this.openedKeyboard}
                timeToDissmissKeyboard={this.timeToDissmissKeyboard}
                toggleAudio={this.toggleAudio.bind(this)}
                showAudioRecorder={this.state.showAudioRecorder}
                showImoji={this.showImoji.bind(this)}
                hideImoji={this.hideImoji.bind(this)}
                showingImoji={this.state.showingImoji}
                openOptions={this.openOptions.bind(this)}
                sender={this.props.user}
                showOptions={this.state.showOptions}
                ref={'keyboard'}
                initialzeFlatList={this.initialzeFlatList.bind(this)}
                scrollToEnd={this.scrollToEnd.bind(this)}
                roomID={this.roomID}
                setTyingState={this.setTyingState.bind(this)}
                adjutRoomDisplay={this.adjutRoomDisplay.bind(this)}
                members={this.props.members}
                handleReplyExtern={this.handleReplyExtern.bind(this)}
                handleReply={this.handleReply.bind(this)}
                showProfile={this.props.showProfile}
            />
        );
    }

    header() {
        return (
            <ChatRoomHeader
                openDescription={this.props.openDescription}
                getShareLink={this.props.getShareLink}
                openPage={this.props.openPage}
                openSettings={this.props.openSettings}
                showActivityPhotoAction={this.props.showActivityPhotoAction}
                background={this.props.activityPhoto}
                searching={this.state.searching}
                pushUp={this.pushSearchUp}
                pushDown={this.pushSearchDown}
                search={this.search}
                searchResult={this.state.searchResult}
                currentSearchIndex={this.state.currentSearchIndex}
                cancelSearch={this.cancelSearch}
                searchString={this.state.searchString}
                startSearching={this.startSearching}
                oponent={this.props.oponent}
                isRelation={this.props.isRelation}
                goback={this.props.goback}
                activity_id={this.props.activity_id}
                roomID={this.roomID}
                typing={this.state.typing}
                activity_name={this.props.activity_name}
                roomName={this.props.roomName}
            />
        );
    }

    duration = 10;
    VideoShower() {
        return (
            <InChatVideoPlayer
                reply={(mess) => {
                    this.initReply(mess)
                }}
                focusInput={this.fucussTextInput.bind(this)}
                react={(reaction) => this.reactToMessage(this.state.playingMessage.id, reaction)}
                forward={(mess) => {
                    Vibration.vibrate([10, 0, 0, 30]);
                    this.forwardToContacts(mess);
                }}
                message={this.state.playingMessage}
                remindThis={() => this.remindThis(this.state.playingMessage)}
                starThis={() => this.addStar(this.state.playingMessage)}
                video={this.state.video}
                fullScreen={this.state.fullScreen}
                buffering={this.buffering.bind(this)}
                enterFullscreen={this.enterFullscreen.bind(this)}
                hideVideo={this.hideVideo.bind(this)}
            />
        );
    }
    navigateToFullView(item) {
        let data = stores.Messages.messages[this.roomID];
        BeNavigator.pushTo('SwiperComponent', {
            dataArray: data,
            filterFunc: ele => ele.type == 'photo',
            reply: (mess) => this.initReply({ ...mess, url: null }),
            remindThis: (mess) => this.remindThis(mess),
            forward: (mess) => this.forwardToContacts(mess),
            starThis: (mess) => this.addStar(mess),
            mapFunction: this.mapFunction,
            currentIndex: item ? item.id : this.state.playingMessage.id
        });
    }
    mapFunction = (ele) => {
        let senderPhone = ele && ele.sender && ele.sender.phone && ele.sender.phone.replace && ele.sender.phone.replace('+', '00');
        return {
            ...ele,
            url: ele.source || ele.photo,
            message: ele.text,
            type: ele.type == 'photo' ? 'image' : 'video',
            creator: {
                name: stores.TemporalUsersStore.Users[senderPhone] &&
                    stores.TemporalUsersStore.Users[senderPhone].nickname,
                profile: stores.TemporalUsersStore.Users[senderPhone] &&
                    stores.TemporalUsersStore.Users[senderPhone].nickname,
                updated_at: ele.created_at,
            },
        };
    }
}
export default ChatRoom;
