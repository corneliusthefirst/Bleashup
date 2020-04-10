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
    Item
} from 'native-base';
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
    Clipboard
} from 'react-native';

import VideoPlayer from "./VideoController"
import Image from 'react-native-scalable-image';
import Orientation from 'react-native-orientation-locker';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import BleashupFlatList from '../../BleashupFlatList';
import Message from "./Message";
import { find, orderBy, reject, findIndex, map, uniqBy, groupBy } from "lodash"
import moment from "moment";
import { PulseIndicator } from 'react-native-indicators';
import ReplyText from "./ReplyText";
import firebase from 'react-native-firebase'
import ChatStore from '../../../stores/ChatStore';
import { TouchableWithoutFeedback, ScrollView } from "react-native-gesture-handler";
import stores from '../../../stores';
import VerificationModal from "../invitations/components/VerificationModal";
import GState from '../../../stores/globalState';
import EmojiSelector from 'react-native-emoji-selector';
import ChatroomMenu from "./ChatroomMenu";
import uuid from 'react-native-uuid';
import dateDisplayer from '../../../services/dates_displayer';
import { SendNotifications } from '../../../services/cloud_services';
import Pickers from '../../../services/Picker';
import converToHMS from '../highlights_details/convertToHMS';
import Waiter from "../loginhome/Waiter";
import MediaTabModal from "./MediaTabModal";
import testForURL from '../../../services/testForURL';
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import Votes from "../votes";
import emitter from '../../../services/eventEmiter';
import ChatRoomPlus from "./ChatRoomPlus";
import ContactsModal from "../../ContactsModal";
import AudioRecorder from "./AudioRecorder";
import TypingIndicator from "./TypingIndicator";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.authObserver()
        this.state = {
            sender: false,
            user: 2,
            splicer: 500,
            creator: true,
            hideStatusBar: false,
            showEmojiInput: false,
            showAudioRecorder: false,
            recordTime: 0,
            keyboardOpened: false,
            textValue: '',
            image: null,
            isModalOpened: false,
            showHeader: true,
            previousMessageHeight: this.formHeight(((screenheight - 67) / screenheight)),
            previousTextHeight: this.formHeight((67 / screenheight)),
            replying: false,
            recording: false,
            captionText: '',
            textHeight: screenheight * 0.1,
            photoHeight: screenheight * 0.9,
            showCaption: false,
            showEmojiInputCaption: false,
            replyerOffset: 0.1,
            messageListHeight: this.formHeight(((screenheight - 67) / screenheight)),
            textInputHeight: this.formHeight((67 / screenheight)),
            inittialTextInputHeightFactor: 67 / screenheight,
            initialMessaListHeightFactor: (screenheight - 67) / screenheight,
            showRepliedMessage: false,
            showVideo: false,
            showPhoto: false,
            playing: true,
            replyContent: null
        };
        this.BackHandler = null
    }

    authObserver() {
        firebase.auth().onAuthStateChanged(this.bootstrap.bind(this))
    }
    getUID() {
        return (firebase.auth().currentUser || {}).uid
    }
    getRef(firebaseRoom) {
        return firebase.database().ref(firebaseRoom)
    }
    room = null
    getTimestamp() {
        return firebase.database().serverValue.TIMESTAMP
    }
    bootstrap(user) {
        if (!user) {
            firebase.auth().signInWithPhoneNumber(this.props.user.phone).then(confirmCode => {
                this.setState({
                    isModalOpened: true
                })
                stores.TempLoginStore.confirmCode = confirmCode
            }).catch((e) => {
                switch (e.code) {
                    case 'auth/operation-not-allowed':
                        console.warn('Enable anonymous in your firebase console.');
                        break;
                    default:
                        console.warn(e);
                        break;
                }
            })
        } else {
        }
    }
    formPercentage(height) {
        return height / screenWidth
    }
    messageListFactor = 0.50
    textInputFactor = 0.15
    fireRef = null
    newMessages = []
    addNewMessage(newMessage, newKey) {
        if (this.room.messages.length > 0) {
            let index = findIndex(this.room.messages, { id: newMessage.id })
            let received = uniqBy(newMessage.received, "phone")
            if (index >= 0 && this.room.messages[index].key !== newKey) {
                this.room.messages[index] = { ...this.room.messages[index], key: newKey, sent: true, type: newMessage.type }
                this.room.addNewMessage(newMessage, newKey, newMessage.type, true, true).then(() => {
                    firebase.database().ref(`${this.props.firebaseRoom}/${newKey}/received`).set(received)
                    if (newMessage.sender && newMessage.sender.phone == this.props.user.phone) {
                        console.warn("adding new_message"," with cloud functions")
                        //!! example of cloud functions calling . 
                        SendNotifications(this.props.user.name, newKey, newMessage.type, newMessage.text, this.props.firebaseRoom, this.props.user.phone, this.props.activity_name, this.props.activity_id, this.props.roomName, this.props.room_type).then(() => {
                            this.setState({ newMessage: true })
                        })
                        // fetch(`https://us-central1-bleashup-1562173529011.cloudfunctions.net/informOthers?sender_name=${this.props.user.name}&message_key=${newKey}&message_type=${newMessage.type}&message=${newMessage.text}&room_key=${this.props.firebaseRoom}&sender_phone=${this.props.user.phone}&activity_name=${this.props.activity_name}&activity_id=${this.props.activity_id}&room_name=${this.props.roomName}`).then(response => {

                        //})
                    }
                })
            } else {
                //console.warn(newMessage, "PPPPPPPPPP")
                if (this.sender.phone == newMessage.sender.phone) {

                 } else {
                    firebase.database().ref(`${this.props.firebaseRoom}/${newKey}/received`).set(received).then(() => {
                        this.newMessages.length !== 0 ? this.newMessages.unshift(newMessage) : null
                        console.warn("saving new messagess")
                        this.room.addNewMessage(newMessage, newKey, newMessage.type, true, this.newMessages.length == 0).then(() => {
                            this.setState({
                                newMessage: true
                            })
                        })
                    })
                }
            }
        }
    }
    insetDateSeparator(messages, newMessage) {
        return new Promise((resolve, reject) => {
            let separator = { ...newMessage, id: "New Messages", type: "new_separator" }
            index = findIndex(messages, { id: separator.id })
            let result = index >= 0 ? messages : [separator].concat(messages)
            resolve(result)
        })
    }
    removeMessage(message) {
        //console.warn(message)
        this.room.addAndReadFromStore(message).then(value => {
            //this.room.messages = reject(this.room.messages, { id: value.id });
            //let index = findIndex(this.room.messages, { id: value.id })
            this.room.removeMessage(value.id).then(() => {
                firebase.database().ref(`${this.props.firebaseRoom}/${message.key}`).remove((error) => {
                    this.setState({
                        newMessage: true
                    })
                })
            })
        })
    }
    toastStyle = {
        backgroundColor: '#FEFFDE',
        marginTop: "-10%",
        paddingTop: "3%",
    }
    toastTextStyles = {
        color: "#0A4E52"
    }
    typingRef = null
    setTypingRef(room) {
        this.typingRef = firebase.database().ref(`typing/${room}`)
        // !! set typing ref on the relaion/activity page here.
        //!! you will the set the typing reff on the relation/activity page. where activity_id is either the "relation" of the id of the current_activity
        // i advice you to do this as a cloud function 
        // this.how i will advice you to do this .
        /* 
        write a cloud function that is going to iterate throught the members of the current room an
        and update the activity/relation typing state of each individual member. 
        and on the relation of activity committees page those changes are going to be listen for
        */
    }
    currentTyper = null
    showTypingToast(newTyper) {
        if (newTyper[0]) {
            this.currentTyper = newTyper[0].nickname + " is "
        } else if (newTyper.phone !== undefined) {
            console.warn("phone found")
            this.currentTyper = newTyper.nickname
        } else {
            if (this.currentTyper === null) {
                this.currentTyper = "You are"
            }
        }
        this.typingTimeout && clearTimeout(this.typingTimeout)
        // console.warn(this.currentTyper)
        this.setState({
            typing:true
        })
       this.typingTimeout = setTimeout(() => {
            this.setState({
                typing:false
            })
        },1000)
        //Toast.show({ text: `typing ...`, position: "top", textStyle: this.toastTextStyles, style: this.toastStyle })
    }
    setTyingState(typer) {
        this.typingRef.set([typer, moment().format()])
    }
    formStorableData(messages) {
        let result = [];
        return new Promise((resolve, reject) => {
            this.room.readFromStore().then(data => {
                //    console.warn(data)
                messages.reverse().map(element => {
                    let date = moment(element.created_at).format('YYYY/MM/DD')
                    index = findIndex(data, { id: date })
                    index2 = findIndex(result, { id: date })
                    if (index < 0 && index2 < 0) {
                        result.push({ ...element, id: date, type: 'date_separator' })
                        result.unshift(element)
                    } else {
                        result.unshift(element)
                    }
                })
                resolve(result)
            })
        })

    }
    showMessage = []
    componentDidMount() {
        GState.currentRoom = this.props.firebaseRoom
        firebase.database().ref(`current_room/${this.props.user.phone}`).set(this.props.firebaseRoom)
        this.formStorableData(this.props.newMessages).then(news => {
            this.newMessages = news
            this.newMessages = this.newMessages.length > 0 ? [...this.newMessages, {
                id: 'New Messages',
                type: 'new_separator',
                sender: {
                    phone: 3,
                    nickname: "Sokeng Kamga"
                },
                duration: Math.floor(0),
                created_at: "2014-03-30 12:32",
            }] : []
            setTimeout(() => {
                GState.reply ? this.replying(GState.reply, null) :
                    this.setState({
                        loaded: true,
                        // replyContent: GState.reply ? GState.reply : null,
                        //replying: GState.reply ? true : false
                    })
            }, 100)
            if (this.props.newMessages.length > 0) {
                this.room.insertBulkMessages(this.newMessages).then(() => {
                })
            }
            this.fireRef.endAt().limitToLast(1).on('child_added', snapshot => {
                console.warn("new_child", snapshot.val())
                let message = snapshot.val()
                message.received && message.received.length > 0 ? message.received.unshift({
                    phone:
                        this.props.user.phone, date: moment().format()
                }) : message.received = [{phone:this.props.user.phone, date: moment().format()}]
                message.received = uniqBy(message.received, "phone");
                console.warn("here we are",message.received)
                this.addNewMessage(message, snapshot.key)
            })
            this.fireRef.on('child_changed', snapshot => {
                console.warn(snapshot.val(),"snapshot from seen")
                let index = find(this.room.messages, { key: snapshot.key })
                if (index >= 0) {
                    this.room.messages[index] = snapshot.val()
                    this.room.addNewMessage(snapshot.val(), snapshot.key, true, true).then(() => {
                        this.setState({ newMessage: true })
                    })
                }
            })
            this.fireRef.on('child_removed', message => {
                this.removeMessage(message)
            });
            this.typingRef.on('child_changed', newChild => {
                //console.warn(newChild)
                let typer = newChild.phone ? newChild.nickname : newChild
                this.showTypingToast(typer)
            })
        })
        setTimeout(() => {
            this.adjutRoomDisplay()
        }, 500)
    }
    adjutRoomDisplay(dontToggle) {
        setTimeout(() => {
            GState.reply && this._textInput.focus()
            this.refs.scrollViewRef.scrollToEnd({ animated: true, duration: 200 })
            this.state.showCaption && 
            this.refs.captionScrollViewRef.scrollToEnd({ animated: true, 
                duration: 200 })
            this.temp ? GState.reply = JSON.parse(this.temp) : null
        })
    }
    markAsRead() {
        this.room.deleteNewMessageIndicator().then(() => { })
        if (this.newMessages.length > 0) {
            this.room.messages = this.newMessages.concat(this.room.messages)
            this.room.messages = uniqBy(this.room.messages, "id")
            this.newMessages = []
            this.showMessage = []
            this.setState({
                newMessage: true
            })
        }
    }
    initializeNotifications(){
        firebase.messaging().getToken().then(token => {
            firebase.database().ref(`notifications_tokens/${this.sender.phone.replace("00", "+")}`).set(token).then(() => {
                console.warn("notification token successfully initialized")
            })
        })
    }
    componentWillMount() {
        this.initializeNotifications()
        this.fireRef = this.getRef(this.props.firebaseRoom);
        this.setTypingRef(this.props.firebaseRoom)
        //!! handle user peer user disconnection here listen to something like 'current_room/${peer_user_phone}' to know wether the user is connected or not
        // !! this will only be valid for a when there is just one user in a room .


        firebase.database().ref(`current_room/${this.props.user.phone}`).onDisconnect().set(null)
        this.room = new ChatStore(this.props.firebaseRoom) //!! example of chat store initialization
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
        if (this.BackHandler) this.BackHandler.remove()
        this.BackHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this))
        Orientation.lockToPortrait();
    }
    componentWillUnmount() {
        //GState.reply = null
        Pickers.CleanAll()
        this.fireRef.off()
        this.typingRef.off()
        this.keyboardDidShowSub.remove();
        GState.currentRoom = null
        firebase.database().ref(`current_room/${this.props.user.phone}`).set(null)
        this.keyboardDidHideSub.remove();
        this.BackHandler.remove()
    }

    handleKeyboardDidShow = (event) => {
        offset = this.state.replying ? 0.21 : 0.01
        // const { height: windowHeight } = Dimensions.get('window');
        // const keyboardHeight = event.endCoordinates.height;
        this.setState({
            showEmojiInput: false,
            keyboardOpened: true,
            showEmojiInputCaption: false
        })
        this.adjutRoomDisplay()
        this.markAsRead()
    }

    handleKeyboardDidHide = () => {
        offset = this.state.replying ? 0.13 : 0
        this._textInput.blur()
        this.setState({
            keyboardOpened: false,
            messageListHeight: !this.state.showEmojiInput ?
                this.formHeight(this.state.replying ? ((screenheight - 147) / screenheight) : this.state.initialMessaListHeightFactor) :
                this.formHeight(this.state.replying ? 0.40 : 0.50),
        })
        //this.adjutRoomDisplay()
    }
    convertPercentageToInt(data) {
        return parseInt(data.split('%')[0]) / 100
    }

    handleBackButton() {
        if (this.state.showEmojiInput) {
            this._textInput.focus()
            this.setState({
                showEmojiInput: false
            })
            return true
        } else if (this.state.showRepliedMessage) {
            this.setState({
                showRepliedMessage: false
            })
            return true
        } /*else if (this.state.replying) {
            this.setState({
                replying: false,
                replyContent: null,
            })
            return true
        }*/ else if (this.state.showVideo) {
            this.setState({
                showVideo: false,
                showCaption: false,
                //fullScreen: false,
                ///hideStatusBar: false
            })
            Orientation.lockToPortrait()
            return true
        } else if (this.state.showPhoto) {
            this.setState({
                showPhoto: false,
                showCaption: false
                //hideStatusBar: false
            })
            return true
        } else if (this.state.showEmojiInputCaption) {
            this._captionTextInput.focus()
            this.setState({
                showEmojiInputCaption: false
            })
            return true
        } else if (this.state.showCaption) {
            //Keyboard.dismiss()
            this.setState({
                showCaption: false,
                showVideo: false
            })
            //this._resetCaptionInput()
            return true
        } else if (this.state.showAudioRecorder) {
            this.refs.AudioRecorder.stopRecord(true)
            return true
        } else {

        }
    }
    state = {
        sender: false,
        showTime: true
    }
    formHeight(factor) {
        return factor * screenheight
    }
    playVideo(video) {
        this.setState({
            video: video,
            showVideo: true
        })
    }
    hideVideo() {
        Orientation.lockToPortrait();
        this.setState({
            showVideo: false,
            hideStatusBar: false,
            showCaption: false
            //fullScreen: false
        })
        //Orientation.lockToPortrait()
    }
    showActions() {
        this.setState({
            showActions: true
        })
        setTimeout(() => {
            this.setState({
                showActions: false
            })
        }, 5000)
    }
    buffering() {
        this.setState({
            buffering: true
        })
        setTimeout(() => {
            this.setState({
                buffering: false
            })
        }, 5000)
    }

    renderMessages(data) {
        data = { ...data, received: [{ phone: this.user.phone, time: moment().format() }] }
        return data.map(element => this.chooseComponent(element))
    }
    enterFullscreen() {
        Keyboard.dismiss()
        this.state.fullScreen ? Orientation.lockToPortrait() : Orientation.lockToLandscapeLeft(); //this will unlock the view to all Orientations
        this.setState({
            fullScreen: !this.state.fullScreen,
            //hideStatusBar: !this.state.hideStatusBar
        })
        // StatusBar.setBackgroundColor({color:'#000100',animated:true})

    }
    togglePlay() {
        this.setState({
            playing: !this.state.playing
        })
    }
    _onChange(event) {
        this.setState({ textValue: event.nativeEvent.text || '' });
        this.setTyingState(this.sender)
        this.adjutRoomDisplay()
    }
    filterFunctionByUnicode = emoji => {
        return emoji.lib.added_in === "6.0" || emoji.lib.added_in === "6.1"
    }
    _resetTextInput() {
        this._textInput.clear();
        // this._textInput.resetHeightToMin();
    }
    _resetCaptionInput() {
        //this._captionTextInput.clear()

    }
    handleEmojieSectionCaption(e) {
        this.setState({
            textValue: this.state.textValue + e
        })
    }
    handleEmojiSelected(e) {
        this.setState({
            textValue: this.state.textValue + e
        })
    }
    logOutZoomState = (event, gestureState, zoomableViewEventObject) => {    }
    sendMessage(messager) {
        if (messager) {
            GState.reply = null
            messager = { ...messager, received: [{ phone: this.props.user.phone, date: moment().format() }] }
            this.fireRef.push(messager)
            // !! update the latess message of the relation page
        }
    }
    sending = false
    sendTextMessage(newMessage) {
        if (GState.connected) {
            this.scrollToEnd()
            this.room.messages = reject(this.room.messages, { id: newMessage.id })
            this.room.messages.unshift(newMessage)
            this.room.replaceMessage(newMessage).then(() => {
                this.sendMessage(newMessage)
            });
        }
    }
    sendMessageText(message) {
        //console.warn("sending message ", message)
        if (this.state.showAudioRecorder) {
            this.refs.AudioRecorder.stopRecord()
        } else if (this.state.textValue !== '' && message !== '') {
            this.initialzeFlatList()
            let messager = {
                id: uuid.v1(),
                type: "text_sender",
                text: message,
                sender: this.sender,
                reply: this.state.replyContent,
                //user: this.user,
                creator: this.creator,
                created_at: moment().format()
            }
            this.room.messages.length == 0 ? this.room.messages[0] = messager : this.room.messages.unshift(messager)
            this.scrollToEnd()
            this.room.addMessageToStore(messager).then(() => {
                this.setState({
                    newMessage: true
                })
            })
            this._resetTextInput()
            this.setState({
                textValue: '',
                replying: false,
                replyContent: null,
            })
        } else {

        }
    }
    user = this.props.user;
    creator = 1
    showPhoto(photo) {
        Keyboard.dismiss()
        this.setState({
            photo: photo,
            showPhoto: true,
            //hideStatusBar: true
        })
    }
    captionMessages = []
    sendingCaptionMessages = false
    uselessSentCount = 0;
    captionSender() {
        //console.warn("executing iiiiiii", this.captionMessages)
        if (this.uselessSentCount <= 20) {
            if (this.captionMessages.length <= 0) {
                setTimeout(() => {
                    this.uselessSentCount = this.uselessSentCount + 1;
                    this.captionSender()
                }, 1000)
            } else {
                this.sendingCaptiomMessages = true
                this.uselessSentCount = 0
                this.scrollToEnd()
                let tobeSent = [...this.captionMessages]
                this.captionMessages = []
                tobeSent.map(newMessage => {
                    this.room.messages = reject(this.room.messages, { id: newMessage.id })
                    this.room.messages.unshift(newMessage)
                    this.setState({
                        newMessage: true
                    })
                    this.room.replaceMessage(newMessage).then(() => {
                        this.sendMessage({ ...newMessage, photo: newMessage.source })
                        this.informMembers()
                        //send message to the server here
                    });
                })
                this.captionSender()
            }
        } else {
            this.sendingCaptiomMessages = false
        }
    }
    openCamera() {
        //Keyboard.dismiss();
        Pickers.SnapPhoto().then(snap => {
            let isVideo = snap.content_type.includes("video") ? true : false
            this.setState({
                video: snap.source,
                image: snap.source,
                //base64: response[0].data,
                showCaption: true,
                imageSelected: isVideo ? false : true,
                filename: snap.filename,
                showVideo: isVideo ? true : false,
                content_type: snap.content_type,
                size: snap.size
            })
            this.markAsRead()
            this.adjutRoomDisplay()
        })
    }

    sender = {
        phone: this.props.user.phone,
        nickname: this.props.user.name
    }
    openPhotoSelector() {
        //Keyboard.dismiss()
        this.scrollToEnd()
        Pickers.TakeManyPhotos().then(response => {
            response.map(res => {
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
                    text: this.state.captionText
                }
                this.room.messages.unshift(message)
                this.room.addMessageToStore(message).then(() => {
                    this.setState({
                        newMessage: true
                    })
                    this.initialzeFlatList()
                    this.markAsRead()
                })
                //  this._resetCaptionInput();
            })
            this.setState({
                captionText: '',
                // showCaption: false,
            })
        }).catch(error => {
            console.warn(error)
        })
    }
    informMembers() {
        // do some thing with room members : this.props.roomMemners
    }
    _sendCaptionMessage() {
        this.scrollToEnd()
        let message = {
            id: uuid.v1(),
            type: (this.state.imageSelected ? "photo" : "video") + "_upload",
            source: this.state.imageSelected ? this.state.image : this.state.video,
            sender: this.sender,
            //user: this.user,
            reply: this.state.replyContent,
            creator: this.creator,
            created_at: moment().format(),
            total: this.state.size,
            send: 0,
            content_type: this.state.content_type,
            filename: this.state.filename,
            text: this.state.textValue
        }

        this.room.messages.unshift(message)
        this.room.addMessageToStore(message).then(() => {
            this.setState({
                newMessage: true
            })
            this.initialzeFlatList()
        })
        this._resetCaptionInput();
        let offset = this.state.replying ? .1 : 0
        this.setState({
            captionText: '',
            textValue: '',
            replyContent: null,
            replying: false,
            showEmojiInputCaption: false,
            showCaption: false,
            showVideo: false
        })
        this._textInput.focus()
    }
    replaceMessage(newMessage) {
        this.room.replaceMessage(newMessage).then(() => {
            this.setState({
                newMessage: true
            })
            this.sendMessage({ ...newMessage, photo: newMessage.source })
            this.informMembers()
            //send message to the server here
        });
    }
    replaceMessageVideo(newMessage) {
        this.room.replaceMessage(newMessage).then(() => {
            this.setState({
                newMessage: true
            })
            this.sendMessage({ ...newMessage, source: newMessage.temp })
            this.informMembers()
            //send message to the server here
        });
    }
    replaceMessageFile(newMessage) {
        this.room.replaceMessage(newMessage).then(() => {
            this.setState({
                newMessage: true
            })
            this.sendMessage({ ...newMessage, source: newMessage.temp })
            this.informMembers()
            //send message to the server here
        });
    }
    replaceAudioMessage(newMessage) {
        this.room.replaceMessage(newMessage).then((messages) => {
            this.setState({
                newMessage: true
            })
            this.sendMessage({ ...newMessage, source: newMessage.temp })
            this.informMembers()
            //send message to the server here
        });
    }
    verboseLoggingFunction(error) {

    }
    async openAudioPicker() {
        const res = await Pickers.TakeAudio()
        let temp = this.filename
        this.filename = res.uri
        this.duration = 0
        this.sendAudioMessge(temp, this.duration)
        this.filename = temp
    }
    async openFilePicker() {
        const res = await Pickers.TakeFile()
        this.scrollToEnd()
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
        }
        this.room.messages.unshift(message)
        this.room.addMessageToStore(message).then((data) => {
            this.setState({
                newMessage: true
            })
            this.initialzeFlatList()
        })
        this.setState({
            replyContent: null,
            messageListHeight: this.formHeight(this.state.initialMessaListHeightFactor),
            textInputHeight: this.formHeight(this.inittialTextInputHeightFactor),
            replying: false,
        })
    }
    duration = 0
    _onChangeCaption(event) {
        this.setTyingState(this.sender)
        this.setState({
            textValue: event.nativeEvent.text || ''
        })
        this.adjutRoomDisplay()
    }
    toggleAudioRecorder() {
        this.setState({
            showAudioRecorder: !this.state.showAudioRecorder,
        })
        if (this.state.showAudioRecorder) {
            this.refs.AudioRecorder.stopRecordSimple()
        } else {
            this.refs.AudioRecorder.startRecorder()
        }
    }
    cancleReply() {
        GState.reply = null
        this.setState({
            replying: false,
            replyContent: null,
            messageListHeight: this.state.previousMessageHeight,
            textInputHeight: this.state.previousTextHeight,
            textHeight: screenheight * 0.1,
            photoHeight: screenheight * 0.9,
        })
    }
    sendAudioMessge(filename, duration, dontsend) {
        this.setState({
            showAudioRecorder: false
        })
        if (!dontsend) {
            this.scrollToEnd()
            let message = {
                id: uuid.v1(),
                source: 'file://' + (filename || this.filename),
                duration: duration || this.duration,
                type: "audio_uploader",
                reply: this.state.replyContent,
                sender: this.sender,
                //user: this.user,
                content_type: 'audio/mp3',
                total: 0,
                received: 0,
                file_name: 'test.mp3',
                created_at: moment().format()
            }
            this.room.messages.unshift(message)
            this.room.addMessageToStore(message).then(() => {
                this.setState({
                    newMessage: true
                })
                this.initialzeFlatList()
                //this.sendMessage(message)
            })
            this.setState({
                newMessage: true,
                replying: false,
                replyContent: null,
            })
        }
    }
    toggleEmojiKeyboard() {
        offset = this.state.replying ? 0.1 : 0
        this.temp = GState.reply ? JSON.stringify(GState.reply) : null
        GState.reply = null
        //!this.state.showEmojiInput ? 
        Keyboard.dismiss()
        //: this._textInput.focus()
        setTimeout(() => {
            this.setState({
                showEmojiInput: !this.state.showEmojiInput,
            })
            this.adjutRoomDisplay(true)
        }, this.state.keyboardOpened ? 200 : 0)
    }
    scrollToEnd() {
        this.refs.bleashupSectionListOut.scrollToEnd()
    }
    initialzeFlatList() {
        this.refs.bleashupSectionListOut.resetItemNumbers()
        this.adjutRoomDisplay()
    }
    createVote(vote) {
        let message = {
            id: uuid.v1(),
            text: vote.title,
            type: "vote",
            vote: { id: vote.id, option: vote.option },
            created_at: moment().format(),
            received: [{ phone: stores.LoginStore.phone, date: moment().format() }],
            sender: this.sender
        }
        this.room.addMessageToStore(message).then(() => {
            this.sendMessage(message)
            this.room.messages.unshift(message)
            this.setState({
                //isVoteCreationModalOpened: false,
                newMessage: true
            })

            // this.informMembers()
            this.initialzeFlatList()
        })
    }
    verifyNumber(code) {
        stores.TempLoginStore.confirmCode.confirm(code).then(success => {
            this.setState({
                isModalOpened: false
            })
        })
    }
    replying(replyer, color) {
        //this._textInput.focus()
        offset = this.state.replying ? 0.2 : 0
        this.setState({
            loaded: true,
            replying: true,
            replyContent: replyer,
            replyerBackColor: color,
            photoHeight: screenheight * 0.80
        })
        this.adjutRoomDisplay()

    }
    options = ["Remove message", "Update message", "Seen by ...", "Copy to clipboard", "Cancel"]
    showActions(message) {
        ActionSheet.show({ options: this.options, title: "Choose You Action", cancelButtonIndex: 4 }, (index) => {
            if (index === 0) {
                if (GState.connected) {
                    let messageRef = this.fireRef.child(message.key)
                    this.room.removeMessage(message.id).then(() => {
                        this.setState({ newMessage: true })
                        if (message.sender.phone == this.sender.phone) {
                            messageRef.remove()
                            //TODO: Cloud delete goes here
                        }
                    })
                }
            } else if (index == 2) {
                firebase.database().ref(`${this.props.firebaseRoom}/${message.key}/received`).once('value', snapshot => {
                    console.warn("here ",snapshot)
                    snapshot.val() !== null ? this.props.showContacts(snapshot.val().map(ele => { return ele.phone.replace("+", "00") }),"Seen by") :
                        this.props.showContacts(message.received.map(ele => { return { ...ele, phone: ele.phone.replace("+", "00") } }), "Seen by")
                })
            } else if (index == 3) {
                Clipboard.setString(message.text)
                Vibration.vibrate(10)
                Toast.show({ text: 'copied !' })
            }
        })
    }
    hideAndShowHeader() {
        this.setState({
            showHeader: false
        })
        // this.replying = true
        setTimeout(() => this.setState({
            showHeader: true
        }), 5000)
    }
    initializeVotes(votes) {
        this.setState({
            votes: votes,
        })
    }
    showMembers() {
        this.props.showLoader()
        firebase.database().ref(`rooms/${this.props.activity_id}/${this.props.firebaseRoom}`).once('value', snapshot => {
            this.props.stopLoader()
            if (snapshot.val()) {
                this.props.showMembers(snapshot.val().members)
            } else {
                this.props.showMembers(this.props.members)
                //Toast.show({ text: "Unable to show members of this conversation" })
            }
        })
    }
    messagelayouts={}
    showRoomMedia() {
        this.setState({
            isMediaModalOpened: true,
            messages: JSON.stringify(this.room.messages)
        })
    }
    showVoters(voters) {
        this.setState({
            showContacts: true,
            voters: voters,
            title: 'Voters list '
        })
    }
    transparent = "rgba(50, 51, 53, 0.8)";
    render() {
        //console.warn("messages are",this.room.messages)

        headerStyles = {
            flexDirection: 'row', ... (!this.state.showVideo && !this.state.showPhoto && !this.state.showRepliedMessage && !this.state.showCaption && bleashupHeaderStyle)
        }
        return (
            <View style={{ height: "100%", }}>
                <StatusBar animated={true} hidden={this.state.hideStatusBar} barStyle="dark-content" backgroundColor="#FEFFDE"></StatusBar>
                {!this.state.loaded ? <Waiter></Waiter> : <View style={{}}><View style={{ width: "100%", alignSelf: 'center', }}>
                    <ScrollView keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false} scrollEnabled={false} inverted nestedScrollEnabled
                        ref="scrollViewRef">
                        <View style={{ height: this.state.messageListHeight, marginBottom: "0.5%" }}>
                            <TouchableWithoutFeedback onPressIn={() => {
                                // Keyboard.dismiss()
                                this.scrolling = false
                                this.adjutRoomDisplay()
                                //this.hideAndShowHeader()
                            }}>
                                {
                                    this.messageList()
                                }
                            </TouchableWithoutFeedback>
                        </View>
                        <View>
                            {!this.props.opened || !this.props.generallyMember ? <Text style={{ fontStyle: 'italic', marginLeft: "3%", }} note>{"This commitee has been closed for you"}</Text> :
                                // ***************** KeyBoard Displayer *****************************
                                this.keyboardView()
                            }
                        </View>
                    </ScrollView>
                </View>
                    {
                        // **********************Header************************ //
                        this.state.showHeader ? this.header() : null
                    }
                    {
                        // **********************New Message Indicator *****************//
                        this.newMessages.length > 0 ? this.newMessageIndicator() : null

                    }
                    {
                        // **************Captions messages handling ***********************//

                        this.state.showCaption ? this.captionMessageHandler() : null}
                    {

                        //******  Reply Message onClick See Reply handler View ********/


                        this.state.showRepliedMessage ? this.replyMessageViewer() : null}
                    {
                        // ******************Photo Viewer View ***********************//
                        this.state.showPhoto ?
                            this.PhotoShower() : null
                    }
                    {
                        //** ####### Vidoe PLayer View ################ */

                        this.state.showVideo ? this.VideoShower() : null}
                </View>
                }
                <VerificationModal isOpened={this.state.isModalOpened}
                    verifyCode={(code) => this.verifyNumber(code)}
                    phone={this.props.user.phone}></VerificationModal>
                {this.state.isMediaModalOpened ? <MediaTabModal video={this.groupByWeek(JSON.parse(this.state.messages).filter(ele => ele &&
                    ele.type === 'video' && !testForURL(ele.source)))}
                    photo={this.groupByWeek(JSON.parse(this.state.messages).filter(ele => ele && ele.type === 'photo'))}
                    file={this.groupByWeek(JSON.parse(this.state.messages).filter(ele => ele && ele.type === "attachement" && !testForURL(ele.source)))}
                    isOpen={this.state.isMediaModalOpened}
                    closed={() => {
                        this.setState({
                            isMediaModalOpened: false
                        })
                    }}></MediaTabModal> : null}
                {<Votes takeVotes={(votes => {
                    this.initializeVotes(votes)
                })}
                    replying={(reply) => {
                        this.replying(reply, null)
                        //Keyboard.show()
                        Vibration.vibrate(this.duration)
                        this.setState({
                            isVoteCreationModalOpened: false
                        })
                        setTimeout(() => {
                            this._textInput.focus()
                        }, 200)
                    }}
                    computedMaster={this.props.computedMaster}
                    takeVote={(vote => this.createVote(vote))}
                    voteItem={mess => {
                        this.perviousId = mess.id
                        this.replaceVote({ ...mess, id: uuid.v1() })
                    }}
                    working={this.props.working}
                    isSingleVote={this.state.single_vote}
                    vote_id={this.state.vote_id}
                    startLoader={this.props.showLoader}
                    showVoters={(voters) => {
                        this.showVoters(voters)
                    }}
                    stopLoader={this.props.stopLoader}
                    committee_id={this.props.firebaseRoom}
                    event_id={this.props.activity_id}
                    isOpen={this.state.isVoteCreationModalOpened}
                    sender={this.sender}
                    onClosed={() => {
                        this.setState({
                            isVoteCreationModalOpened: false
                        })
                    }}></Votes>}
                {this.state.showContacts ? <ContactsModal title={this.state.title} contacts={this.state.voters} isOpen={this.state.showContacts} onClosed={() => {
                    this.setState({
                        showContacts: false
                    })
                }}></ContactsModal> : null}
                {//</ImageBackground>
                }
            </View>

        )
    }
    groupByWeek(media) {
        let groupedDates = groupBy(media, ele => moment(ele.created_at).startOf('week'))
        let keys = Object.keys(groupedDates)
        let result = []
        for (let i = 0; i < keys.length; i++) {
            result = [...result, { type: "date_separator", id: keys[i] }, ...groupedDates[keys[i]]]
        }
        return result
    }
    replaceVote(vote) {
        this.room.removeMessage(this.perviousId).then(() => {
            //this.room.messages.unshift(vote)
            this.room.replaceNewMessage(vote).then(() => {
                this.sendMessage(vote)
                this.initialzeFlatList()
                this.setState({
                    newMessage: true
                })
            })
        })
    }
    openVoteCreation() {
        this.setState({
            isVoteCreationModalOpened: true,
            single_vote: false
        })
    }
    delay = 1
    messageList() {
        return <BleashupFlatList
            //backgroundColor={"transparent"}
            marginTop
            firstIndex={0}
            ref="bleashupSectionListOut"
            inverted={true}
            renderPerBatch={20}
            initialRender={20}
            numberOfItems={this.room.messages.length}
            keyExtractor={(item, index) => item ? item.id : null}
            renderItem={(item, index) => {
                this.delay = this.delay >= 20 || (item && !item.sent) ? 0 : this.delay + 1
                return item ? <Message
                    voteItem={(index, vote) => {
                        emitter.emit("vote-me", index,vote)
                    }}
                    messagelayouts={this.messagelayouts}
                    setCurrentLayout={layout => {
                        this.messagelayouts[item.id] = layout
                    }}
                    newCount={this.props.newMessages.length}
                    index={index}
                    scrolling={this.scrolling}
                    computedMaster={this.props.computedMaster}
                    showVoters={(voters) => this.showVoters(voters)}
                    votes={this.state.votes}
                    showProfile={(pro) => this.props.showProfile(pro)}
                    delay={this.delay}
                    room={this.room}
                    PreviousMessage={this.room.messages[index >= 0 ? index + 1 : 0] &&
                        this.room.messages[index >= 0 ? index + 1 : 0]}
                    showActions={(message) => this.showActions(message)}
                    firebaseRoom={this.props.firebaseRoom}
                    roomName={this.props.roomName}
                    sendMessage={message => this.sendTextMessage(message)}
                    received={item.received ? item.received.length >= this.props.members.length : false}
                    replaceMessageVideo={(data) => this.replaceMessageVideo(data)}
                    showPhoto={(photo) => this.showPhoto(photo)}
                    replying={(replyer, color) => {
                        this._textInput.focus()
                        this.replying(replyer, color)
                    }
                    }
                    replaceMessage={(data) => this.replaceMessage(data)}
                    replaceAudioMessage={(data) => this.replaceAudioMessage(data)}
                    handleReplyExtern={(reply) => {
                        this.handleReplyExtern(reply)
                    }}
                    message={item}
                    openReply={(replyer) => {
                        this.setState({
                            replyer: replyer,
                            showRepliedMessage: true
                        });
                    }}
                    user={this.props.user.phone}
                    creator={this.props.creator}
                    replaceMessageFile={(data) => this.replaceMessageFile(data)}
                    playVideo={(source) => this.playVideo(source)}></Message> : null;
            }}
            dataSource={this.room.messages}
            newData={this.showMessage}
            newDataLength={this.showMessage.length}>
        </BleashupFlatList>;
    }
    handleReplyExtern(replyer) {
        if (replyer.type_extern === 'Votes') {
            this.setState({
                isVoteCreationModalOpened: true,
                single_vote: true,
                vote_id: replyer.id
            })
        } else {
            this.props.handleReplyExtern(replyer)
        }
    }
    showAudio() {
        this.toggleAudioRecorder();
        this.markAsRead();
    }
    keyboardView() {
        return <View style={{
            backgroundColor: "#FFF",
            alignSelf: 'center', alignItems: 'center', borderBottomWidth: 0, borderTopWidth: .3,
            borderColor: 'gray', borderRadius: 4,
            padding: '1%', width: "99%", alignItems: 'center',
        }}>
            {
                //* Reply Message caption */
                this.state.replying ? this.replyMessageCaption() : null}
            <View style={{
                flexDirection: 'row',
                alignSelf: 'center', width: '100%'
            }}>
                <View style={{
                    width: "88%",
                    fontSize: 17,
                    //height: 40,
                    flexDirection: 'row',
                    borderColor: "#1FABAB",
                    borderWidth: 0,
                    borderRadius: 10,
                }}>
                    <View style={{ width: '12%', padding: '1%', }}><Icon onPress={() => {
                        this.toggleEmojiKeyboard();
                        this.markAsRead();
                    }} style={{ color: "#1FABAB", alignSelf: 'flex-start', marginTop: '20%', }}
                        type="Entypo" name="emoji-flirt"></Icon></View>
                    <Item style={{ width: '76%' }}>
                        <TextInput
                            value={this.state.textValue}
                            onChange={(event) => this._onChange(event)}
                            placeholder={'Your Message'}
                            style={{ width: '100%', maxHeight: 200, minHeight: 45 }}
                            placeholderTextColor='#66737C'
                            multiline={true}
                            enableScrollToCaret
                            ref={(r) => { this._textInput = r; }} /></Item>
                    <View style={{ width: '12%', padding: '1%', }}><Icon onPress={() => this.openCamera()}
                        style={{ color: "#1FABAB", alignSelf: 'flex-end', marginTop: '20%', }}
                        type={"Ionicons"}
                        name={"md-photos"}></Icon>
                    </View>
                </View>
                <View style={{
                    width: "10%",
                    marginLeft: '2%',
                    paddingTop: '2.5%',
                    padding: '1%',
                }}>
                    {!this.state.textValue && !this.state.showAudioRecorder ? <Icon style={{
                        color: "#0A4E52", alignSelf: 'flex-end'
                    }} onPress={() => {
                        this.showAudio()
                    }} type={"FontAwesome5"} name={"microphone-alt"}></Icon> : <Icon onPress={() => {
                        requestAnimationFrame(() => {
                            return this.sendMessageText(this.state.textValue);
                        });
                    }} style={{ color: "#0A4E52", alignSelf: 'flex-end' }}
                        name="md-send" type="Ionicons">
                        </Icon>}
                </View>
                {
                    // ******************** Audio Recorder Input ************************//

                    this.audioRecorder()}
            </View>
            {
                // ***************** Emoji keyBoard Input ***********************//
                this.state.showEmojiInput ? this.imojiInput() : null}
        </View>;
    }

    replyMessageCaption() {
        return <View style={{ backgroundColor: this.state.replyerBackColor, alignSelf: 'center', width: '98%' }}><ReplyText compose={true} openReply={(replyer) => {
            replyer.type_extern ?
                this.handleReplyExtern(replyer) : this.setState({
                    replyer: replyer,
                    showRepliedMessage: true
                });
        }}
            pressingIn={() => { }} showProfile={(pro) => this.props.showProfile(pro)} reply={this.state.replyContent}></ReplyText>
            <Button onPress={() => this.cancleReply()
            } style={{ position: "absolute", alignSelf: 'flex-end', }} rounded transparent><Icon name={"close"} type={"EvilIcons"} style={{ color: '#1FABAB' }}></Icon></Button>
        </View>;
    }

    audioRecorder() {
        return <AudioRecorder
            justHideMe={() => {
                this.setState({
                    showAudioRecorder: false
                })
                this.refs.AudioRecorder.stopRecordSimple()
            }}
            showAudioRecorder={this.state.showAudioRecorder}
            sendAudioMessge={(file, duration, dontsend) => this.sendAudioMessge(file, duration, dontsend)}
            ref={"AudioRecorder"}
            toggleAudioRecorder={() => this.toggleAudioRecorder()}

        ></AudioRecorder>
    }

    imojiInput() {
        return <View style={{ marginLeft: '-1.5%', width: "100%", height: 300 }}>
            <EmojiSelector onEmojiSelected={(emoji) => this.handleEmojiSelected(emoji)} enableSearch={false} ref={emojiInput => this._emojiInput = emojiInput} resetSearch={this.state.reset} showSearchBar={false} loggingFunction={this.verboseLoggingFunction.bind(this)} verboseLoggingFunction={true} filterFunctions={[this.filterFunctionByUnicode]}></EmojiSelector>
        </View>;
    }
    header() {
        return <View style={{
            width: "100%",
            height: 44,
            position: 'absolute'
        }}><View style={headerStyles}>
                <View style={{ width: '60%', }}>
                    <View style={{ flexDirection: 'row', }}><View style={{ width: '20%', paddingLeft: '2%', }}>
                        <Icon onPress={() => {
                            this.props.openMenu()
                        }}
                            style={{ color: '#0A4E52', fontSize: 35  }}
                            type={"Ionicons"}
                            name={"ios-menu"}></Icon>
                    </View>
                        <View style={{ width: "80%", marginTop: "2%", }}>
                            <Title style={{
                                fontWeight: 'bold',
                                alignSelf: 'flex-start',
                            }}>{this.props.roomName}</Title>
                            {this.state.typing && <TypingIndicator></TypingIndicator>}
                        </View>
                    </View>
                    {
                        //!! you can add the member last seen here if the room has just one member */
                    }
                </View>
                <View style={{
                    width: "40%",
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                }}>
                    <View style={{ alignSelf: 'flex-start', width: '25%' }}>
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
                            showReminds={() => { this.props.addRemind(this.props.members) }}
                            addPhotos={() => this.openPhotoSelector()}
                            addMembers={() => this.props.addMembers()}
                        ></ChatRoomPlus>
                    </View>
                    <View>
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
                            opened={this.props.opened}></ChatroomMenu>
                    </View>
                </View></View></View>;
    }

    newMessageIndicator() {
        return <View style={{
            position: 'absolute', height: 40,
            marginTop: '5%', alignSelf: 'center'
        }}>
            <View style={{ alignSelf: 'center', backgroundColor: '#FEFFDE', borderRadius: 10, margin: '2%', display: 'flex', flexDirection: 'row', }}>
                <Text style={{ fontSize: 19, fontWeight: 'bold', color: "#00BE71" }}>{this.props.newMessages.length}{" new messages"}</Text>
                <Icon type="EvilIcons" style={{ color: "#00BE71", marginTop: '3%', fontSize: 19 }} name="arrow-up"></Icon>
            </View>
        </View>;
    }
    handleCaptionImojiOnPress() {
        offset = this.state.replying ? 0.1 : 0;
        this.temp = GState.reply ? JSON.stringify(GState.reply) : null
        //!this.state.showEmojiInputCaption ? 
        Keyboard.dismiss()
        this.adjutRoomDisplay()
        //: this._captionTextInput.focus();
        this.setState({
            showEmojiInputCaption: !this.state.showEmojiInputCaption,
        });
        this.adjutRoomDisplay()
    }
    captionMessageHandler() {
        return <View style={{
            position: "absolute", width: screenWidth,
            height: screenheight, backgroundColor: "black", display: 'flex', width: "100%", height: "100%"
        }}>
            {this.darkStatus()}
            <ScrollView scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
                keyboardShouldPersistTaps={"always"}
                ref={"captionScrollViewRef"}>
                <View style={{ height: this.state.photoHeight, width: "100%" }}>
                    {this.state.image ? <ReactNativeZoomableView maxZoom={1.5} minZoom={0.5} zoomStep={0.5} initialZoom={1} bindToBorders={true} onZoomAfter={this.logOutZoomState}>
                        {this.state.imageSelected ? <Image resizeMode={"contain"} width={screenWidth} style={{ flex: 1 }} source={{ uri: this.state.image }}></Image> : null}</ReactNativeZoomableView> : null}
                </View>
                {
                    //* Reply Message caption */
                    this.state.replying ? <View style={{
                        backgroundColor: this.state.replyerBackColor,
                        marginLeft: "-1%", backgroundcolor: "#FEFFDE", margin: '1%',
                    }}>
                        <ReplyText openReply={(replyer) => {
                            this.setState({
                                replyer: replyer,
                                showRepliedMessage: true
                            });
                        }} showProfile={(prop) => {
                            this.showProfile(pro)
                        }} pressingIn={() => { }} reply={this.state.replyContent}></ReplyText></View> : null}
                <View style={{ backgroundColor: "#1FABAB", width: "100%", display: 'flex', flexDirection: 'row' }}>
                    <Icon onPress={() => {
                        this.handleCaptionImojiOnPress()
                    }} type="Entypo" name="emoji-flirt" style={{ color: "#0A4E52", marginTop: "3%", width: "8%" }}>
                    </Icon><TextInput multiline={true} enableScrollToCaret ref={(r) => { this._captionTextInput = r; }} value={this.state.textValue} onChange={(data) => this._onChangeCaption(data)}
                        style={{ left: 0, right: 0, minHeight: 50, maxHeight: 200, width: "84%" }} placeholder={'Enter your text!'} />
                    <Icon style={{ color: "#0A4E52", marginTop: "3%", width: "8%" }} onPress={() => this._sendCaptionMessage()} type={"Ionicons"} name={"md-send"}></Icon>
                </View>
                {
                    //********** Caption Emoji Keyboard *******************************/
                    this.state.showEmojiInputCaption ? this.captionImojiInput() : null}
                <View style={{ position: 'absolute', margin: '3%', }}><Icon style={{ color: "#FEFFDE" }} onPress={() => {
                    this.setState({
                        showCaption: false,
                        showPhoto: false,
                        showVideo: false,
                    })
                    //this._resetTextInput()
                }} name="close" type={"EvilIcons"}></Icon></View>
            </ScrollView>
        </View>;
    }

    captionImojiInput() {
        return <View style={{ width: "100%", height: 300 }}>
            <EmojiSelector onEmojiSelected={(emoji) => this.handleEmojieSectionCaption(emoji)}
                //enableSearch={false}
                ref={emojiInput => this._emojiInputCaption = emojiInput} resetSearch={this.state.reset} showSearchBar={false} loggingFunction={this.verboseLoggingFunction.bind(this)} verboseLoggingFunction={true} filterFunctions={[this.filterFunctionByUnicode]}></EmojiSelector>
        </View>;
    }
    duration = 10
    replyMessageViewer() {
        return <View style={{
            height: 1000,
            position: "absolute", backgroundColor: this.transparent,
            width: "100%",
        }}>
            <View style={{ display: 'flex', flexDirection: 'row', marginTop: "3%", }}>
                {this.state.replyer.sender.phone == this.sender.phone ? <TouchableOpacity onPress={() => {
                    this.setState({
                        showRepliedMessage: false
                    });
                }}>
                    <Icon type="EvilIcons" style={{ margin: '7%', fontSize: 35, color: "#FEFFDE" }} name={"close"}></Icon>
                </TouchableOpacity> : null}
                <ScrollView style={{ top: 0, bottom: 0, height: screenheight - 60 }}>
                    <View style={{ display: "flex", }}>
                        <Text style={{
                            color: "#FEFFDE", alignSelf: 'center',
                            fontWeight: 'bold',
                        }}>{dateDisplayer(moment(find(this.room.messages,
                            { id: this.state.replyer.id }).created_at).format("YYYY/MM/DD"))}</Text>
                        {<Message computedMaster={this.props.computedMaster}
                            openReply={(replyer) => {
                                console.warn("replying", replyer);
                                this.setState({
                                    replyer: replyer,
                                    showRepliedMessage: true
                                });
                            }}
                            handleReplyExtern={(reply) => {
                                this.props.handleReplyExtern(reply)
                            }}
                            showProfile={(pro) => this.props.showProfile(pro)} replying={() => { }}
                            received={this.state.replyer.received ?
                                this.state.replyer.received.length >=
                                this.props.members.length : false}
                            showPhoto={(photo) => this.showPhoto(photo)}
                            playVideo={(source) => this.playVideo(source)}
                            creator={2} user={this.sender.phone}
                            message={find(this.room.messages,
                                { id: this.state.replyer.id })} />}
                    </View>
                </ScrollView>
                {!(this.state.replyer.sender.phone == this.sender.phone) ? <TouchableOpacity onPress={() => {
                    this.setState({
                        showRepliedMessage: false
                    });
                }}>
                    <Icon type="EvilIcons" style={{ margin: '2%', marginTop: "8%", fontSize: 35, color: "#FEFFDE" }} name={"close"}></Icon>
                </TouchableOpacity> : null}
            </View>
        </View>;
    }
    darkStatus = () => <StatusBar hidden={this.state.hideStatusBar} animated={true} barStyle="light-content" backgroundColor="#000"></StatusBar>
    VideoShower() {
        return <View style={{
            height: this.state.fullScreen ? "100%" : this.state.keyboardOpened || this.state.showEmojiInput ||
                this.state.showEmojiInputCaption ? this.state.replying ? 255 : 300 : 400,
            position: "absolute",
            width: this.state.fullScreen ? "100%" : screenWidth,
            backgroundColor: this.transparent,
            alignSelf: 'center',
        }}>
            {this.darkStatus()}
            <VideoPlayer source={{ uri: this.state.video }} // Can be a URL or a local file.
                ref={(ref) => {
                    this.videoPlayer = ref;
                }} onBuffer={() => this.buffering()} // Callback when remote video is buffering
                onError={(error) => {
                    console.error(error);
                }} toggleResizeModeOnFullscreen={false}
                //pictureInPicture={true}
                resizeMode={"contain"} disableVolume={true} seekColor="#1FABAB" controlTimeout={null}
                //disablePlayPause={true}
                //disableFullscreen={true}
                onBack={() => this.hideVideo()} onEnterFullscreen={() => this.enterFullscreen()} onExitFullscreen={() => this.enterFullscreen()} fullscreenOrientation={"landscape"}
                //fullscreen={true}
                //controls={true}
                style={{
                    backgroundColor: this.transparent,
                }} videoStyle={{
                    alignItems: 'center',
                    height: "100%",
                    width: "100%",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }} // Callback when video cannot be loaded
            />
        </View>;
    }

    PhotoShower() {
        return <View style={{ height: "100%", width: "100%", position: "absolute", backgroundColor: "black", }}>
            {this.darkStatus()}
            <View style={{ alignSelf: 'center', }}>
                <ReactNativeZoomableView maxZoom={1.5} minZoom={0.5} zoomStep={0.5} initialZoom={1} bindToBorders={true} onZoomAfter={this.logOutZoomState}>
                    <Image resizeMode={"contain"} width={screenWidth} height={screenheight} source={{ uri: this.state.photo }}></Image>
                </ReactNativeZoomableView>
                <Icon type="EvilIcons" onPress={() => {
                    this.setState({
                        showPhoto: false,
                        showCaption: false
                        //hideStatusBar: false
                    });
                }} style={{ margin: '1%', position: 'absolute', fontSize: 30, color: "#FEFFDE" }} name={"close"}></Icon></View>
        </View>;
    }
}
