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
import Requester from './Requester';
import globalFunctions from '../../globalFunctions';
import ShareWithYourContacts from './ShareWithYourContacts';
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
import { sayTyping } from './services';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
@observer
class ChatRoom extends AnimatedComponent {
    initialize() {
        this.authObserver();
        this.state = {
            isModalOpened: false,
            showOptions: false,
            showHeader: !this.props.isComment,
            messageListHeight: this.formHeight(120 / screenheight),
        };
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
                id: Texts.new_messages,
                type: 'new_separator',
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
                        this.setStatePure({
                            newMessage: true,
                        });
                    });
            });
        });
    }
    toastStyle = {
        marginTop: '-10%',
        paddingTop: '3%',
    };
    typingRef = null;
    currentTyper = null;
    showTypingToast(newTyper) {
     !this.sayTyping ? this.sayTyping = sayTyping.bind(this) : null
       this.sayTyping(newTyper)
    }
    setTyingState() {
      return Requester.sayTyping(this.props.firebaseRoom,
            this.props.activity_id)
    }
    formStorableData(messages) {
        messages = uniqBy(messages, 'id').sort(this.dateSorter);
        let result = [];
        return new Promise((resolve, reject) => {
            stores.Messages.readFromStore().then((data) => {
                messages.forEach((element) => {
                    let date = moment(element.created_at).format('YYYY/MM/DD');
                    index =
                        data[this.roomID] && findIndex(data[this.roomID], { id: date });
                    index2 = findIndex(result, { id: date });
                    if ((!index && index2 < 0) || (index < 0 && index2 < 0)) {
                        result.unshift({ ...element, id: date, type: 'date_separator' });
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
    initializeNewMessageForRoom() {
        return new Promise((resolve, reject) => {
            this.formStorableData(this.props.newMessages).then((news) => {
                this.newMessages = news;
                this.newMessages =
                    this.newMessages.length > 0
                        ? [
                            ...this.newMessages,
                            {
                                id: Texts.new_messages,
                                type: 'new_separator',
                                sender: {
                                    phone: 3,
                                    nickname: 'Sokeng Kamga',
                                },
                                duration: Math.floor(0),
                                created_at: '2014-03-30 12:32',
                            },
                        ]
                        : [];
                this.initTimeout = setTimeout(() => {
                    GState.reply
                        ? this.replying(GState.reply, null)
                        : this.setStatePure({
                            loaded: true,
                        });
                    this.adjutRoomDisplay();
                    clearTimeout(this.initTimeout)
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
        let acreated = moment(a.created_at).format('X');
        let bcreated = moment(b.created_at).format('X');
        return acreated < bcreated ? -1 : bcreated < acreated ? 1 : 0;
    }
    componentDidMount() {
        this.saveNotificationToken();
        GState.currentRoom = this.props.firebaseRoom;
        if (this.props.isComment) {
            this.loadComments();
        } else {
            this.initializeNewMessageForRoom().then(() => {
            });
        }
    }
    adjutRoomDisplay(dontToggle) {
        this.adjustDisplayTimeout = setTimeout(() => {
            GState.reply && !this.alreadyFocussed && this.fucussTextInput();
            this.alreadyFocussed = true;
            this.refs && this.refs.scrollViewRef && this.refs.scrollViewRef.scrollToEnd({ animated: true, duration: 200 });
            this.temp ? (GState.reply = JSON.parse(this.temp)) : null;
            clearTimeout(this.adjustDisplayTimeout)
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
                'id'
            );
            this.newMessages = [];
            this.showMessage = [];
            this.setStatePure({
                newMessage: true,
            });
        }
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
        }else if(this.refs.keyboard  && this.refs.keyboard.state.showCaption){
            this.refs.keyboard.hideCaption()
            return  true
        } else {
            return false
        }
    }
    componentMounting() {
        PrivacyRequester.makeOnline()
        //this.fireRef = this.getRef(this.props.firebaseRoom);
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow.bind(this));
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide.bind(this));
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));
        emitter.on("reply-me", (rep) => {
            this.props.openMenu()
            this.replying(rep, null)
            this.focusInputTimeout = setTimeout(() => {
                this.alreadyFocussed = false;
                this.fucussTextInput()
                clearTimeout(this.focusInputTimeout)
            }, 700)
        })
        emitter.on(`${this.props.firebaseRoom}_typing`,(typer) =>{
            this.showTypingToast(typer);
        })
        this.props.isComment ? (stores.Messages.messages[this.roomID] = []) : null;
    }
    unmountingComponent() {
        PrivacyRequester.makeOffline()
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton.bind(this));
        this.keyboardDidHideSub.remove();
        this.keyboardDidShowSub.remove();
        emitter.off(`${this.props.firebaseRoom}_typing`)
        //this.fireRef.off();
        emitter.off('reply-me');
        //this.typingRef.off();
        this.markAsRead();
        GState.currentRoom = null;
    }
    handleKeyboardDidShow = (event) => {
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
            fullScreen:true,
            showPhoto: false,
            showVideo: true,
        });
        this.refs.keyboard.animateLayout();
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
        this.refs.keyboard.animateLayout();
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
            received: [{ phone: this.user.phone, time: moment().format() }],
        };
        return data.map((element) => this.chooseComponent(element));
    }
    enterFullscreen(exit) {
        this.setStatePure({
            fullScreen: exit ? false: !this.state.fullScreen
        })
    }
    togglePlay() {
        this.setStatePure({
            playing: !this.state.playing,
        });
    }

    _resetCaptionInput() { }

    received = [{ phone: this.props.user.phone, date: moment().format() }];
    sendToOtherActivity(message) {
        return new Promise((resolve, reject) => {
            Requester.sendMessage(
                message,
                message.from_committee,
                message.from_activity, true).
                then((response) => {
                    resolve;
                });
        });
    }
    sendMessage(messager) {
        return new Promise((resolve, reject) => {
            if (messager) {
                GState.reply = null;
                    messager = { ...messager, sent: true };
                        Requester.sendMessage(
                            messager,
                            this.roomID,
                            this.props.activity_id
                        ).then((response) => {
                            setTimeout(() => {
                                resolve(messager);
                            },100)
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

    user = this.props.user;
    creator = 1;
    showPhoto(photo, item) {
        this.setStatePure({
            playingMessage: item,
            showVideo: false,
        }, () => {
            Keyboard.dismiss();
            this.navigateToFullView();

        });
    }
    captionMessages = [];
    sendingCaptionMessages = false;
    uselessSentCount = 0;
    sender = {
        phone: this.props.user.phone,
        nickname: this.props.user.name,
    };
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
    openAudioPicker() {
        this.refs.keyboard && this.refs.keyboard.pickAudio();
    }
    openFilePicker() {
        this.refs.keyboard &&
            this.refs.keyboard.pickFile();
    }
    duration = 0;

    scrollToEnd() {
        this.refs &&
            this.refs.bleashupSectionListOut &&
            this.refs.bleashupSectionListOut.scrollToEnd();
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
       this.state.currentMessage.received? this.props.showContacts(
            this.state.currentMessage.received.map((ele) =>
                ele.phone.replace('+', '00')
            ),
            Texts.seen_by
        ):Toaster({text:Texts.this_message_was_never_sent});
    }
    copyMessage() {
        Clipboard.setString(this.state.currentMessage.text);
        Vibration.vibrate(10);
        Toaster({ text: 'copied !', type: 'success' });
    }
    showMessageAction(message, reply, sender) {
        this.tempReply = reply
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
        this.setStatePure({
            isShareWithContactsOpened: true,
        });
    }
    scrollToIndex(index) {
        console.warn(index);
        this.refs.bleashupSectionListOut &&
            this.refs.bleashupSectionListOut.scrollToIndex(index);
        this.scrollToTimeout = setTimeout(() => {
            this.refs.bleashupSectionListOut &&
                this.refs.bleashupSectionListOut.scrollToIndex(index);
            clearTimeout(this.scrollToTimeout)
        }, 40);
    }
    messageActions = () => [
        {
            title: Texts.seen_by,
            iconName: "check",
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
            condition: () => this.state.sender,
            iconName: "delete-circle-outline",
            iconType: "MaterialCommunityIcons",
            color: ColorList.delete,
            callback: () => this.deleteMessageAction()
        }
    ]
    render() {
        return (
            <ImageBackground style={{
                resizeMode: 'cover',
                justifyContent: 'center',
            }} source={require('../../../../assets/chat_screen.jpg')}>
                <View style={{ height: '100%', justifyContent: 'flex-end' }}>
                    {
                        // **********************Header************************ //
                        this.state.showHeader && !this.state.showCaption ? (
                            <View style={{ height: '7.5%' }}>{this.header()}</View>
                        ) : null
                    }

                    <View style={{ height: this.state.showHeader && !this.state.showCaption ? '92.5%' : '100%' }}>
                        <View style={{ height: '100%', justifyContent: 'flex-end' }}>
                            {!this.state.loaded ? (
                                <Waiter />
                            ) : (
                                    <KeyboardAvoidingView behavior={Platform.OS == 'android' ? null : 'padding'} style={{
                                        width: '100%',
                                        height: '100%',

                                    }}>
                                        <ScrollView
                                            onScroll={() => {
                                                this.adjutRoomDisplay();
                                            }}
                                            scrollEnabled={false}
                                            inverted={true}
                                            keyboardShouldPersistTaps={'always'}
                                            showsVerticalScrollIndicator={false}
                                            ref="scrollViewRef"
                                        //style={{ height: screenheight }}
                                        >
                                            <View style={{ height: this.state.messageListHeight, flexDirection: 'column', justifyContent: 'flex-end', marginHorizontal: 2, }}>
                                                <TouchableWithoutFeedback
                                                    onPressIn={() => {
                                                        this.scrolling = false;
                                                        console.warn('pressing in');
                                                        this.adjutRoomDisplay();
                                                        !this.openedKeyboard && this.refs.keyboard && this.refs.keyboard.blur();
                                                    }}
                                                ><View>
                                                        {this.messageList()}
                                                    </View>
                                                    {this.state.showDownScroller && <SideButton
                                                        buttonColor={'rgba(52, 52, 52, 0.8)'}
                                                        position={"right"}
                                                        //text={"D"}
                                                        renderIcon={() => {
                                                            return <TouchableOpacity onPress={() => requestAnimationFrame(() => { this.scrollToEnd() })} style={{ backgroundColor: ColorList.bodyBackground, height: 40, width: 40, borderRadius: 30, justifyContent: "center", alignItems: "center", ...shadower(4) }}>
                                                                <SimpleLineIcons name="arrow-down" type="SimpleLineIcons" style={{ color: ColorList.bodyIcon, fontSize: 22 }} />
                                                            </TouchableOpacity>
                                                        }}
                                                        action={() => requestAnimationFrame(() => { this.scrollToEnd() })}
                                                        //buttonTextStyle={{color:colorList.bodyBackground}}
                                                        offsetX={15}
                                                        size={20}
                                                    //offsetY={20}
                                                    />}
                                                </TouchableWithoutFeedback>
                                                {
                                                    this.state.showOptions && <Options
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

                                                        <View style={{ justifyContent: 'flex-end' }}>{this.keyboardView()}</View>
                                                    )}
                                            </View>
                                        </ScrollView>
                                    </KeyboardAvoidingView>
                                )}
                            {/*<VerificationModal
                                isOpened={this.state.isModalOpened}
                                verifyCode={(code) => this.verifyNumber(code)}
                                phone={this.props.user.phone}
                            />*/}
                            <ShareWithYourContacts
                                activity_id={this.props.activity_id}
                                sender={this.sender}
                                committee_id={this.roomID}
                                isOpen={this.state.isShareWithContactsOpened}
                                message={this.state.currentMessage && {
                                    ...this.state.currentMessage,
                                    id: IDMaker.make(),
                                    created_at: moment().format(),
                                    sender: this.sender,
                                    type: this.state.currentMessage.type === 'image' ? 'photo' :
                                        this.state.currentMessage.type,
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
                                    this.setStatePure({
                                        isShareWithContactsOpened: false,
                                    });
                                }}
                            />
                            <MessageActions
                                title={"message actions"}
                                actions={this.messageActions}
                                isOpen={this.state.showMessageActions}
                                onClosed={() => {
                                    this.setStatePure({
                                        showMessageActions: false,
                                    });
                                }}
                            ></MessageActions>
                            <PublishersModal
                                isOpen={this.state.showReacters}
                                onClosed={() => {
                                    this.setStatePure({
                                        showReacters: false,
                                    });
                                }}
                                reaction={this.state.currentReaction || {}}
                                reacters={this.state.currentReacters || []}
                            />
                        </View>
                        {
                            // ******************Photo Viewer View ***********************//
                            this.state.showPhoto ? this.PhotoShower() : null
                        }
                        {
                            //** ####### Vidoe PLayer View ################ */

                            this.state.showVideo ? this.VideoShower() : null
                        }
                    </View>
                </View>
            </ImageBackground>
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
        let start = request.Highlight()
        start.event_id = this.props.activity_id
        start.title = message.text && message.text.split(this.splitRegexp)[0]
        start.description = message.text && message.text.split(this.splitRegexp).length > 1 ? message.text : ""
        start.url = message.type === "photo" || message.type === "image" ? {
            photo: testForURL(message.photo) ? message.photo : message.source
        } : message.type === "video" ? {
            photo: message.thumbnailSource,
            video: testForURL(message.source) ? message.source : message.temp,
        } : message.type === 'audio' ? {
            audio: testForURL(message.source) ? message.source : message.temp,
            duration: message.duration,
        } : null;
        this.props.startThis(start);

    }
    forwardToContacts(message) {
        message && message.sent
            ? this.setStatePure({
                isShareWithContactsOpened: true,
                currentMessage: message,
            })
            : Toaster({ text: 'cannot forward unsent messages' });
    }
    replyMessage() {
        this.replyTimout = setTimeout(() => {
            this.refs.keyboard.focus();
            this.replying(this.tempReply);
            clearTimeout(this.replyTimout)
        }, 50);
    }
    splitRegexp = /[\n|.|\r]/
    remindThis(message) {
        let start = request.Remind()
        start.event_id = this.props.activity_id
        start.title = message.text && message.text.split(this.splitRegexp)[0]
        start.description = message.text && message.text.split(this.splitRegexp).length > 1 ? message.text : ""
        start.remind_url = message.type === "photo" || message.type === "image" ? {
            photo: testForURL(message.photo) ? message.photo : message.source
        } : message.type === "video" ? {
            photo: message.thumbnailSource,
            video: testForURL(message.source) ? message.source : message.temp,
        } : message.type === 'audio' ? {
            audio: testForURL(message.source) ? message.source : message.temp,
            duration: message.duration,
        } : null;
        this.props.remindThis(start);
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
            this.props.activity_id
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
        this.refs.keyboard.animateLayout();
    }
    deleteMessage(messageID) {
        Requester.deleteMessage(
            messageID,
            this.props.activity_id,
            this.roomID
        ).then(() => {
            this.refs.keyboard.animateLayout();
        });
    }
    delay = 1;
    addVote() { }
    getItemLayout(item, index) {
        return GState.getItemLayout(item, index,
            stores.Messages.messages[this.roomID])
    }
    choseReply(message) {
        let nickname = message.sender && message.sender.nickname;
        let tempMessage = { ...message, change_date: message.created_at }
        switch (message.type) {
            case 'text':
                tempMessage.replyer_name = nickname;
                return tempMessage;
            case 'audio':
                tempMessage.audio = true;
                tempMessage.replyer_name = nickname;
                return tempMessage;
            case 'video':
                tempMessage.video = true;
                tempMessage.sourcer = message.thumbnailSource;
                tempMessage.replyer_name = nickname;
                return tempMessage;
            case 'attachement':
                tempMessage.replyer_name = nickname;
                tempMessage.file = true;
                let temp = message.file_name.split('.');
                let temper = tempMessage;
                temper.typer = temp[temp.length - 1];
                return temper;
            case 'photo':
                tempMessage.replyer_name = nickname;
                tempMessage.sourcer = message.source;
                return tempMessage;
            case 'image':
                tempMessage.replyer_name = nickname;
                tempMessage.sourcer = message.source;
                return tempMessage;
            default:
                Toaster({ text: 'unable to reply for unsent messages' });
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
        this.fucussTextInput();
        replyer = this.choseReply(replyer);
        replyer && this.replying(replyer);
    }
    handleReply(replyer) {
        let index = findIndex(stores.Messages.messages[this.roomID], { id: replyer.id });
        index >= 0 && this.scrollToIndex(index);
    }
    toggleDownScroller(val) {
        this.setStatePure({
            showDownScroller: val
        })
    }
    onScroll(event) {

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
    messageList() {
        let lastIndex = stores.Messages.messages[this.roomID] ?
            (stores.Messages.messages[this.roomID].length - 1) : 0
        return (
            <BleashupFlatList
                onScroll={this.onScroll.bind(this)}
                windowSize={21}
                backgroundColor={'transparent'}
                keyboardShouldPersistTaps={'handled'}
                marginTop
                disableVirtualization={false}
                firstIndex={0}
                ref="bleashupSectionListOut"
                inverted={true}
                loadMoreFromRemote={() => this.props.isComment && this.loadComments()}
                renderPerBatch={20}
                initialRender={30}
                numberOfItems={
                    stores.Messages.messages[this.roomID]
                        ? stores.Messages.messages[this.roomID].length
                        : 0
                }
                getItemLayout={this.getItemLayout.bind(this)}
                keyExtractor={(item, index) => (item ? item.id : index)}
                renderItem={(item, index) => {
                    this.delay =
                        this.delay >= 20 || (item && !item.sent) ? 0 : this.delay + 1;
                    return item ? (
                        <Message
                            isRelation={this.props.isRelation}
                            react={this.reactToMessage.bind(this)}
                            showReacters={this.showReacters.bind(this)}
                            messagelayouts={this.messagelayouts}
                            setCurrentLayout={(layout) => {
                                this.messagelayouts[item.id] = layout;
                                GState.itemDebounce(item, () => {
                                    this.storesLayouts(layout, index)
                                }, 500)

                            }}
                            forwardMessage={() => {
                                this.forwardToContacts(item);
                            }}
                            newCount={this.props.newMessages.length}
                            index={index}
                            key={item.id}
                            scrolling={this.scrolling}
                            computedMaster={this.props.computedMaster}
                            activity_id={this.props.activity_id}
                            showProfile={(pro) => this.props.showProfile(pro.replace("+", "00"))}
                            delay={this.delay}
                            isfirst={index === 0}
                            room={this.roomID}
                            PreviousMessage={
                                stores.Messages.messages[this.roomID] &&
                                stores.Messages.messages[this.roomID][index >= lastIndex ? lastIndex : index + 1]
                            }
                            showActions={(message, reply, sender) => this.showMessageAction(message, reply, sender)}
                            firebaseRoom={this.props.firebaseRoom}
                            roomName={this.props.roomName}
                            sendMessage={(message) => this.sendTextMessage(message)}
                            received={
                                item.received && this.props.members
                                    ? item.received.length >= this.props.members.length
                                    : false
                            }
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
            },150)
        }
    }
    openOptions() {
        this.setStatePure({
            showOptions: !this.state.showOptions
        })
    }
    toggleAudio() {
        this.setStatePure({
            showAudioRecorder: !this.state.showAudioRecorder,
        });
    }
    keyboardView() {
        return (
            <ChatKeyboard
                toggleAudio={this.toggleAudio.bind(this)}
                showAudioRecorder={this.state.showAudioRecorder}
                showImoji={this.showImoji.bind(this)}
                hideImoji={this.hideImoji.bind(this)}
                showingImoji={this.state.showingImoji}
                openOptions={this.openOptions.bind(this)}
                sender={this.sender}
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
                markAsRead={this.markAsRead.bind(this)}
            />
        );
    }

    header() {
        return (
            <ChatRoomHeader
                goback={this.props.goback}
                activity_id={this.props.activity_id}
                roomID={this.roomID}
                typing={this.state.typing}
                activity_name={this.props.activity_name}
                roomName={this.props.roomName}
                computedMaster={this.props.computedMaster}
                master={this.props.master}
                firebaseRoom={this.props.firebaseRoom}
                public_state={this.props.public_state}
                members={this.props.members}
                addMembers={this.props.addMembers}
                showMembers={this.showMembers.bind(this)}
                close={this.props.close}
                open={this.props.open}
                leave={this.props.leave}
                showRoomMedia={this.showRoomMedia.bind(this)}
                openAudioPicker={this.openAudioPicker.bind(this)}
                markAsRead={this.markAsRead.bind(this)}
                openFilePicker={this.openFilePicker.bind(this)}
                openVoteCreation={this.openVoteCreation.bind(this)}
                addRemind={this.props.addRemind}
                openPhotoSelector={this.openPhotoSelector.bind(this)}
                removeMembers={this.props.removeMembers}
                publish={this.props.publish}
                master={this.props.master}
                openSettings={this.props.openSettings}
                editCommitteeName={this.props.editCommitteeName}
                openMenu={this.props.openMenu}
            />
        );
    }

    duration = 10;
    darkStatus = () => (
        <StatusBar
            hidden={this.state.hideStatusBar}
            animated={true}
            barStyle="light-content"
            backgroundColor="#000"
        />
    );
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
    navigateToFullView(index) {
        let data = stores.Messages.messages[this.roomID].filter(ele =>
            ele.type == 'photo');
        BeNavigator.pushTo('SwiperComponent', {
            dataArray: data,
            reply: (mess) => this.initReply({ ...mess, url: null }),
            remindThis: (mess) => this.remindThis(mess),
            forward: (mess) => this.forwardToContacts(mess),
            starThis: (mess) => this.addStar(mess),
            mapFunction: this.mapFunction,
            currentIndex: data.findIndex(ele => ele.id === this.state.playingMessage.id),
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
    PhotoShower() {
        return (
            <View
                style={{
                    height: '80%',
                    marginTop: '3%',
                    width: 350,
                    position: 'absolute',
                    alignSelf: 'center',
                    borderRadius: 5,
                    backgroundColor: colorList.buttonerBackground,
                    ...shadower(3),
                }}
            >
                {this.darkStatus()}
                <View style={{ alignSelf: 'center', width: '100%', height: '100%' }}>
                    <ReactNativeZoomableView
                        maxZoom={1.5}
                        style={{
                            width: '100%', height: '100%',
                        }}
                        minZoom={0.5}
                        zoomStep={0.5}
                        initialZoom={1}
                        bindToBorders={true}
                        onZoomAfter={this.logOutZoomState}
                    >
                        <CacheImages
                            style={{ width: '100%', height: '100%' }}
                            source={{ uri: this.state.photo }}
                        />
                    </ReactNativeZoomableView>
                    <View style={{
                        margin: '1%',
                        position: 'absolute',
                    }}>
                        <EvilIcons
                            type="EvilIcons"
                            onPress={() => {
                                this.setStatePure({
                                    showPhoto: false,
                                    showCaption: false,
                                    //hideStatusBar: false
                                });
                            }}
                            style={{
                                fontSize: 30,
                                color: ColorList.bodyBackground,
                            }}
                            name={'close'}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
export default ChatRoom;
