import React, { Component } from "react";
import {
    Content,
    Card,
    CardItem,
    Body,
    Container,
    Header,
    Form,
    Title,
    Input,
    Left,
    Right,
    Icon,
    Text,
    H3,
    Spinner,
    Button,
    Toast
} from "native-base";
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
    BackHandler,
    Keyboard,
    Platform,
    KeyboardAvoidingView,
    PermissionsAndroid
} from 'react-native';

import { observer } from "mobx-react";
import initialRoute from "../invitations/components/initialRoute";
import globalState from "../../../stores/globalState";
import ServerEventListener from "../../../services/severEventListener";
import connection from "../../../services/tcpConnect";
import SoundRecorder from 'react-native-sound-recorder';
import UpdatesDispatcher from "../../../services/updatesDispatcher";
import { ScrollView } from 'react-navigation';
import EmojiInput from "react-native-emoji-input"
import VideoPlayer from "./VideoController"
import Image from 'react-native-scalable-image';
import KeyboardSpacer from '@thenetcircle/react-native-keyboard-spacer';
import DocumentPicker from 'react-native-document-picker';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import ImagePicker from 'react-native-customized-image-picker';
import BleashupFlatList from '../../BleashupFlatList';
import Message from "./Message";
import { find, orderBy, reject } from "lodash"
import { TextInput } from "react-native-gesture-handler";
import stores from "../../../stores";
import moment from "moment";
import { PulseIndicator } from 'react-native-indicators';
import Sound from 'react-native-sound';
import rnFetchBlob from 'rn-fetch-blob';
const { fs } = rnFetchBlob
const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sender: false,
            user: 2,
            splicer: 500,
            creator: true,
            showEmojiInput: false,
            showAudioRecorder: false,
            recordTime: 0,
            keyboardOpened: false,
            textValue: '',
            image: null,
            recording: false,
            captionText: '',
            textHeight: screenheight * 0.1,
            photoHeight: screenheight * 0.9,
            showCaption: false,
            showEmojiInputCaption: false,
            messageListHeight: this.formHeight(((screenheight - 100) / screenheight)),
            textInputHeight: this.formHeight((100 / screenheight)),
            inittialTextInputHeightFactor: 100 / screenheight,
            initialMessaListHeightFactor: (screenheight - 100) / screenheight,
            showRepliedMessage: false,
            showVideo: false,
            playing: true,
            replyer: {}
        };
    }
    messageListFactor = 0.84
    textInputFactor = 0.16
    componentDidMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this))
    }
    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
        SoundRecorder.stop().then(() => {

        })
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    }

    handleKeyboardDidShow = (event) => {
        const { height: windowHeight } = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        this.setState({
            showEmojiInput: false,
            keyboardOpened: true,
            textHeight: screenheight * .55,
            photoHeight: screenheight * .45,
            textInputHeight: this.formHeight(this.textInputFactor),
            messageListHeight: this.formHeight(this.messageListFactor),
            showEmojiInputCaption: false
        })
    }

    handleKeyboardDidHide = () => {
        this.setState({
            keyboardOpened: false,
            messageListHeight: !this.state.showEmojiInput ?
                this.formHeight(this.state.initialMessaListHeightFactor) : this.formHeight(0.50),
            textInputHeight: !this.state.showEmojiInput || this.state.showEmojiInputCaption ?
                this.formHeight(this.state.inittialTextInputHeightFactor) : this.formHeight(0.50),
            textHeight: this.state.showEmojiInputCaption ? screenheight * 0.55 : screenheight * .1,
            photoHeight: this.state.showEmojiInputCaption ? screenheight * 0.45 : screenheight * .9
        })
    }

    handleBackButton() {
        if (this.state.showVideo) {
            this.setState({
                showVideo: false,
                showCaption: false
            })
            return true
        } else if (this.state.showRepliedMessage) {
            this.setState({
                showRepliedMessage: false
            })
            return true
        } else if (this.state.showEmojiInput) {
            this._textInput.focus()
            this.setState({
                showEmojiInput: false
            })
            return true
        } else if (this.state.showCaption) {
            Keyboard.dismiss()
            this.setState({
                showCaption: false
            })
            return true
        } else if (this.state.showPhoto) {
            this.setState({
                showPhoto: false
            })
            return true
        } else if (this.state.showAudioRecorder) {
            this.stopRecordTiming()
            SoundRecorder.stop().then(()=>{
                this.setState({
                    recordTime:0,
                    recording:false,
                    showAudioRecorder:false
                })
            })
            return true
        } else {

        }
    }
    state = {
        sender: false,
        showTime: true
    }
    formHeight(factor) {
        // console.warn(factor, screenheight)
        return (factor * 100).toString() + "%"
    }
    playVideo(video) {
        this.setState({
            video: video,
            showVideo: true
        })
    }
    hideVideo() {
        this.setState({
            showVideo: false
        })
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
        return data.map(element => this.chooseComponent(element))
    }
    enterFullscreen() {
        this.setState({
            fullScreen: !this.state.fullScreen
        })
    }
    togglePlay() {
        this.setState({
            playing: !this.state.playing
        })
    }
    _onChange(event) {
        this.setState({ textValue: event.nativeEvent.text || '' });
    }
    filterFunctionByUnicode = emoji => {
        return emoji.lib.added_in === "6.0" || emoji.lib.added_in === "6.1"
    }
    _resetTextInput() {
        this._textInput.clear();
        // this._textInput.resetHeightToMin();
    }
    _resetCaptionInput() {
        this._captionTextInput.clear()
    }
    handleEmojieSectionCaption(e) {
        this.setState({
            captionText: this.state.captionText + e.char
        })
    }
    handleEmojiSelected(e) {
        this.setState({
            textValue: this.state.textValue + e.char
        })
    }
    logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
        /*  console.log('');
          console.log('');
          console.log('-------------');
          console.log('Event: ', event);
          console.log('GestureState: ', gestureState);
          console.log('ZoomableEventObject: ', zoomableViewEventObject);
          console.log('');
          console.log(`Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`);*/
    }
    sendMessageText(message) {
        this.scrollToEnd()
        if (this.state.textValue !== '') {
            let messager = {
                id: Math.random() * 100,
                type: "text",
                text: message,
                sender: this.sender,
                user: this.user,
                creator: this.creator,
                created_at: moment().format("YYYY-MM-DD HH:mm")
            }
            stores.ChatStore.messages.unshift(messager)
            this._resetTextInput()
            this.setState({
                textValue: ''
            })
        } else if (this.state.showAudioRecorder) {
            this.stopRecord()

        } else {

        }
    }
    user = 2;
    creator = 1
    showPhoto(photo) {
        this.setState({
            photo: photo,
            showPhoto: true
        })
    }
    openCamera() {
        Keyboard.dismiss();
        ImagePicker.openPicker({
            cropping: false,
            isCamera: true,
            //openCameraOnStart: true,
            returnAfterShot: true,
            // returnAfterShot:true,
            compressQuality: 50
        }).then(response => {
            //console.warn("opening camera")
            let temp = response[0].path.split('/');
            this.setState({
                image: response[0].path,
                base64: response[0].data,
                showCaption: true,
                imageSelected: true,
                filename: temp[temp.length - 1],
                content_type: response[0].mime,
                size: response[0].size
            })
        })
    }
    openVideo() {
        Keyboard.dismiss();
        ImagePicker.openPicker({
            cropping: false,
            includeBase64: false,
            isVideo: true,
            isCamera: true,
            title: "Take A Video",
            // returnAfterShot:true,
            compressQuality: 50
        }).then(response => {
            //console.warn(response)
            let temp = response[0].path.split('/');
            this.setState({
                video: response[0].path,
                //base64: response[0].data,
                showCaption: true,
                showVideo: true,
                imageSelected: false,
                filename: temp[temp.length - 1],
                content_type: response[0].mime,
                size: response[0].size
            })
        })
    }
    sender = {
        phone: 2,
        nickname: "Fokam Sanza"
    }
    openPhotoSelector() {
        Keyboard.dismiss()
        ImagePicker.openPicker({
            cropping: false,
            includeBase64: false,
            compressQuality: 50,
            multipleShot: false,
            multiple: true,
            imageLoader: "PICASSO"
        }).then((response) => {
            response.map(res => {
                message = {
                    id: Math.random() * 100,
                    type: "photo" + "_upload",
                    source: res.path,
                    sender: this.sender,
                    user: this.user,
                    creator: this.creator,
                    created_at: moment().format("YYYY-MM-DD HH:mm"),
                    total: res.size,
                    send: 0,
                    // data: this.state.base64,
                    content_type: res.mime,
                    filename: res.path.split("/")[res.path.split('/').length - 1],
                    text: this.state.captionText
                }
                stores.ChatStore.messages.unshift(message)
                //  this._resetCaptionInput();
            })
            this.setState({
                captionText: '',
                // showCaption: false,
            })
        })
    }
    _sendCaptionMessage() {
        this.scrollToEnd()
        let message = {
            id: Math.random() * 100,
            type: (this.state.imageSelected ? "photo" : "video") + "_upload",
            source: this.state.imageSelected ? this.state.image : this.state.video,
            sender: this.sender,
            user: this.user,
            creator: this.creator,
            created_at: moment().format("YYYY-MM-DD HH:mm"),
            total: this.state.size,
            send: 0,
            content_type: this.state.content_type,
            filename: this.state.filename,
            text: this.state.captionText
        }

        stores.ChatStore.messages.unshift(message)
        this._resetCaptionInput();
        this.setState({
            captionText: '',
            showCaption: false,
            showVideo: false
        })
    }
    replaceMessage(newMessage) {
        this.scrollToEnd()
        stores.ChatStore.messages = reject(stores.ChatStore.messages, { id: newMessage.id })
        stores.ChatStore.messages.unshift(newMessage)
        this.setState({
            newMessage: true
        })
        newMessage.photo = newMessage.source
        //send message to the server here
    }
    replaceMessageVideo(newMessage) {
        this.scrollToEnd()
        stores.ChatStore.messages = reject(stores.ChatStore.messages, { id: newMessage.id })
        stores.ChatStore.messages.unshift(newMessage)
        this.setState({
            newMessage: true
        })
        // the video url is stored in the newMessage.temp
        // newMessage.source = newMessage.temp
        //send message to server here
    }
    replaceMessageFile(newMessage) {
        this.scrollToEnd()
        ///console.warn(message)
        stores.ChatStore.messages = reject(stores.ChatStore.messages, { id: newMessage.id })
        stores.ChatStore.messages.unshift(newMessage)
        this.setState({
            newMessage: true
        })
        // the video url is stored in the newMessage.temp
        // newMessage.source = newMessage.temp
        //send message to server here
    }
    replaceAudioMessage(newMessage) {
        this.scrollToEnd()
        stores.ChatStore.messages = reject(stores.ChatStore.messages, { id: newMessage.id })
        stores.ChatStore.messages.unshift(newMessage)
        this.setState({
            newMessage: true
        })
        // the video url is stored in the newMessage.temp
        // newMessage.source = newMessage.temp
        //send message to server here
    }
    verboseLoggingFunction(error) {

    }
    async openAudioPicker() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.audio]
            });
            let temp = this.filename
            this.filename = res.uri
            this.duration = 0
            this.sendAudioMessge()
            this.filename = temp
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }
    async openFilePicker() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            res.uri.replace('content://', 'file://')
            message = {
                id: Math.random() * 100,
                source: res.uri,
                file_name: res.name,
                sender: this.sender,
                user: this.user,
                creator: 2,
                type: "attachement_upload",
                received: 0,
                total: res.size,
                created_at: moment().format("YYYY-MM-DD HH:mm"),
            }
            stores.ChatStore.messages.unshift(message)
            this.setState({
                newMessage: true
            })
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }
    duration = 0
    _stopRecoder() {
        this.stopRecordTiming()
        SoundRecorder.stop()
            .then((result) => {
                this.duration = Math.ceil(result.duration / 1000)
                this.sendAudioMessge()
            });
    }
    startRecorder() {
        let recordAudioRequest;
        if (Platform.OS == 'android') {
            recordAudioRequest = this._requestRecordAudioPermission();
        } else {
            recordAudioRequest = new Promise(function (resolve, reject) { resolve(true); });
        }

        recordAudioRequest.then((hasPermission) => {
            if (!hasPermission) {
                console.warn('permission denied!!!')
                return;
            }
            SoundRecorder.start(this.filename)
                .then(() => {
                }).catch(error => {
                    //console.warn(error)
                    Toast.show({duration:4000, text: "cannot record due to " + error })
                    this.setState({ showAudioRecorder: false, recording: false, recordTime: 0 })
                    this.stopRecordTiming()
                    SoundRecorder.stop().then(()=>{

                    })
                });
        });
    }

    async _requestRecordAudioPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: 'Microphone Permission',
                    message: 'ExampleApp needs access to your microphone to test react-native-audio-toolkit.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    }
    filename = fs.dirs.DocumentDir + "/test.mp3"
    _onChangeCaption(event) {
        this.setState({
            captionText: event.nativeEvent.text || ''
        })
    }
    startRecordTiming() {
        this.recordInterval = setInterval(() => {
            this.setState({
                recordTime: this.state.recordTime + 1
            })
        }, 1000)
    }
    stopRecordTiming() {
        clearInterval(this.recordInterval)
    }
    toggleAudioRecorder() {
        this.setState({
            showAudioRecorder: !this.state.showAudioRecorder,
            recording: !this.state.recording,
            recordTime: 0,

        })
        if (this.state.showAudioRecorder) {
            this.stopRecordTiming()
            SoundRecorder.stop().then((s) => {
                this.setState({
                    showAudioRecorder: false,
                    recording: false,
                    // recordTime: 0,

                })
            })
        } else {
            this.startRecordTiming()
            this.startRecorder()
        }
    }
    recordInterval = null
    stopRecord() {
        this.stopRecordTiming()
        this.setState({
            recording: !this.state.recording,
            showAudioRecorder: false,
            recordTime: 0
        })
        this._stopRecoder()
        //  this.sendAudioMessge()
    }
    pauseRecorder() {
        this.stopRecordTiming()
        SoundRecorder.pause().then(() => {
            this.setState({
                recording: false,
            })
        })
    }
    convertToHMS(secs) {
        var sec_num = parseInt(secs, 10)
        var hours = Math.floor(sec_num / 3600)
        var minutes = Math.floor(sec_num / 60) % 60
        var seconds = sec_num % 60

        return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")

    }
    resumAudioRecoder() {
        this.startRecordTiming()
        SoundRecorder.resume().then(() => {
            this.setState({
                recording: true
            })
        })
    }
    sendAudioMessge() {
        this.scrollToEnd()
        let message = {
            id: Math.random() * 100,
            source: 'file://' + this.filename,
            duration: this.duration,
            type: "audio_uploader",
            sender: this.sender,
            user: this.user,
            content_type: 'audio/mp3',
            total: 0,
            received: 0,
            file_name: 'test.mp3',
            created_at: moment().format("YYYY-MM-DD HH:mm")
        }
        stores.ChatStore.messages.unshift(message)
        this.setState({
            newMessage: true
        })
    }
    toggleEmojiKeyboard() {
        !this.state.showEmojiInput ? Keyboard.dismiss() : this._textInput.focus()
        this.setState({
            showEmojiInput: !this.state.showEmojiInput,
            messageListHeight: this.state.showEmojiInput ?
                this.formHeight(this.state.initialMessaListHeightFactor) : this.formHeight(0.50),
            textInputHeight: this.state.showEmojiInput ?
                this.formHeight(this.state.inittialTextInputHeightFactor) : this.formHeight(0.50)
        })
    }
    scrollToEnd(){
        this.refs.bleashupFlatlistOut.scrollToEnd()
    }
    transparent = "rgba(50, 51, 53, 0.8)";
    render() {
        return (
            <View>
                <View>
                    <View style={{ height: this.state.messageListHeight, marginBottom: "0.5%", }}>
                        <BleashupFlatList
                            firstIndex={0}
                            ref="bleashupFlatlistOut"
                            inverted={true}
                            renderPerBatch={20}
                            initialRender={15}
                            numberOfItems={stores.ChatStore.messages.length}
                            keyExtractor={(item) => item ? item.id : null}
                            renderItem={(item) => item ? <Message
                                replaceMessageVideo={(data) => this.replaceMessageVideo(data)}
                                showPhoto={(photo) => this.showPhoto(photo)}
                                replaceMessage={(data) => this.replaceMessage(data)}
                                replaceAudioMessage={(data) => this.replaceAudioMessage(data)}
                                message={item}
                                openReply={(replyer) => {
                                    this.setState({
                                        replyer: replyer,
                                        showRepliedMessage: true
                                    })
                                }}
                                user={item.user} creator={item.creator}
                                replaceMessageFile={(data) => this.replaceMessageFile(data)}
                                playVideo={(source) => this.playVideo(source)}></Message> : null}
                            dataSource={stores.ChatStore.messages}
                        >
                        </BleashupFlatList>
                    </View>
                    {
                        // ***************** KeyBoard Displayer *****************************
                        <View style={{
                            height: this.state.textInputHeight, borderRadius: 10, alignSelf: 'center', borderWidth: 1,
                            borderColor: '#1FABAB', padding: '1%', maxWidth: "99.9%"
                        }}>
                            <View style={{ display: 'flex', flexDirection: 'row', }}>
                                <View style={{
                                    marginTop: "2%",
                                    width: "33%",
                                    display: 'flex', flexDirection: 'row',
                                }}><TouchableOpacity onPress={() => this.openFilePicker()}>
                                        <Icon name={"attach-file"} type={"MaterialIcons"} style={{ color: "#0A4E52", marginRight: "1%", }}></Icon></TouchableOpacity>
                                    <TouchableOpacity onLongPress={() => this.openPhotoSelector()} onPress={() => this.openCamera()}><Icon style={{ color: "#0A4E52", marginRight: "4%", }}
                                        type={"Ionicons"} name={"md-photos"}></Icon></TouchableOpacity><TouchableOpacity onPress={() => this.openVideo()}>
                                        <Icon name={"video-camera"} type={"Entypo"} style={{ color: "#0A4E52", marginRight: "4%" }}></Icon></TouchableOpacity>
                                    <Icon onPress={() => this.toggleEmojiKeyboard()} style={{ color: "#1FABAB" }} type="Entypo" name="emoji-flirt"></Icon>
                                </View>
                                <TextInput
                                    value={this.state.textValue}
                                    onChange={(event) => this._onChange(event)}
                                    style={{
                                        paddingLeft: 10,
                                        fontSize: 17,
                                        height: 50,
                                        width: "50%",
                                        borderColor: "#1FABAB",
                                        backgroundColor: 'white',
                                        borderWidth: 1,
                                        borderRadius: 8,
                                    }}
                                    placeholder={'Your Message'}
                                    placeholderTextColor='#66737C'
                                    maxHeight={200}
                                    multiline={this.state.keyboardOpened ? true : false}
                                    minHeight={45}
                                    enableScrollToCaret
                                    ref={(r) => { this._textInput = r; }}
                                />
                                <View style={{
                                    marginLeft: this.state.showAudioRecorder ? "5%" : "3%", marginTop: "2%", display: 'flex',
                                    width: "17%",
                                    flexDirection: 'row',
                                }}>
                                    {
                                        !this.state.showAudioRecorder ? <TouchableOpacity onLongPress={() => {
                                            this.openAudioPicker()
                                        }} onPress={() => this.toggleAudioRecorder()}><Icon style={{
                                            color: "#0A4E52",
                                            marginRight: "8%",
                                        }}
                                            type={"FontAwesome5"} name={"microphone-alt"} ></Icon></TouchableOpacity> : null}
                                    <TouchableOpacity onPress={() => {
                                        requestAnimationFrame(() => {
                                            return this.sendMessageText(this.state.textValue)
                                        })
                                    }}><Icon style={{ marginLeft: this.state.showAudioRecorder ? "23%" : "0%", color: "#1FABAB" }}
                                        name="paper-plane" type="FontAwesome"></Icon></TouchableOpacity>
                                </View>
                            </View>
                            {
                                // ***************** Emoji keyBoard Input ***********************//
                                this.state.showEmojiInput ? <View style={{ marginLeft: '-1.5%', width: "95%", height: 300 }}>
                                    <EmojiInput onEmojiSelected={(emoji) => this.handleEmojiSelected(emoji)}
                                        enableSearch={false}
                                        ref={emojiInput => this._emojiInput = emojiInput}
                                        resetSearch={this.state.reset}
                                        loggingFunction={this.verboseLoggingFunction.bind(this)}
                                        verboseLoggingFunction={true}
                                        filterFunctions={[this.filterFunctionByUnicode]} ></EmojiInput>
                                </View> : null}
                            {

                                // ******************** Audio Recorder Input ************************//

                                this.state.showAudioRecorder ?
                                    <View style={{
                                        position: "absolute", width: 350, opacity: 0.97,
                                        marginTop: "1%",
                                        backgroundColor: '#4A918A', height: 50, display: 'flex', flexDirection: 'row',
                                        marginLeft: 2, borderRadius: 10,
                                    }}><Left><TouchableOpacity onPress={() => this.toggleAudioRecorder()}><Icon type={'EvilIcons'}
                                        name={'close'} style={{ color: "#FEFFDE" }}></Icon></TouchableOpacity></Left>{this.state.recording ? <View
                                            style={{ marginLeft: "-40%", marginTop: "1.8%", display: 'flex', flexDirection: 'row', }}>
                                            <Icon type={"Entypo"} onPress={() => this.stopRecord()} name={"controller-stop"}
                                                style={{ color: "#FEFFDE", fontSize: 35, }}></Icon>
                                            <Icon type={"FontAwesome"} name={"pause"} onPress={() => this.pauseRecorder()}
                                                style={{ marginTop: "5%", marginLeft: "10%", color: "#FEFFDE", fontSize: 26, }}></Icon>
                                        </View> : <View style={{ marginLeft: "-40%", marginTop: "1.8%", display: 'flex', flexDirection: 'row', }}>
                                                <Icon type={"Entypo"} onPress={() => this.resumAudioRecoder()}
                                                    name={"controller-record"} style={{ color: "#FEFFDE", fontSize: 35, }}></Icon>
                                            </View>}
                                        <Right><View style={{ display: 'flex', flexDirection: 'row', marginLeft: "30%", }}>
                                            <Text style={{ marginTop: "6%", fontSize: 22, color: "#FEFFDE" }}>
                                                {this.convertToHMS(this.state.recordTime)}</Text>
                                            <PulseIndicator color={'red'}>
                                            </PulseIndicator></View></Right></View> : null}
                        </View>
                    }
                </View>
                {
                    // ******************Photo Viewer View ***********************//
                    this.state.showPhoto ?
                        <View style={{ height: screenheight, width: screenWidth, position: "absolute", backgroundColor: "black", }}>
                            <ReactNativeZoomableView
                                maxZoom={1.5}
                                minZoom={0.5}
                                zoomStep={0.5}
                                initialZoom={1}
                                bindToBorders={true}
                                onZoomAfter={this.logOutZoomState}>
                                <Image resizeMode={"contain"} width={screenWidth} height={screenheight}
                                    source={{ uri: this.state.photo }}></Image>
                            </ReactNativeZoomableView>
                            <Icon type="EvilIcons" onPress={() => {
                                this.setState({
                                    showPhoto: false
                                })
                            }} style={{ margin: '1%', position: 'absolute', fontSize: 30, color: "#FEFFDE" }} name={"close"}></Icon>
                        </View> : null
                }
                {
                    // **************Captions messages handling ***********************//

                    this.state.showCaption ? <View style={{
                        position: "absolute", width: screenWidth,
                        height: screenheight, backgroundColor: "black", display: 'flex',
                    }}>
                        <View style={{ height: this.state.photoHeight, width: "100%" }}>
                            {this.state.image ? <ReactNativeZoomableView
                                maxZoom={1.5}
                                minZoom={0.5}
                                zoomStep={0.5}
                                initialZoom={1}
                                bindToBorders={true}
                                onZoomAfter={this.logOutZoomState}>
                                {this.state.imageSelected ? <Image resizeMode={"contain"}
                                    width={screenWidth} style={{ flex: 1 }} source={{ uri: this.state.image }}></Image> : null
                                }</ReactNativeZoomableView> : null}
                        </View>
                        <KeyboardAvoidingView >
                            <View style={{ heigh: this.state.textHeight, backgroundColor: "#1FABAB", width: "100%", display: 'flex', flexDirection: 'row', }}>
                                <Icon onPress={() => {
                                    !this.state.showEmojiInputCaption ? Keyboard.dismiss() : this._captionTextInput.focus()
                                    this.setState({
                                        showEmojiInputCaption: !this.state.showEmojiInputCaption,
                                        textHeight: screenheight * 0.55,
                                        photoHeight: screenheight * 0.45
                                    })
                                }} type="Entypo" name="emoji-flirt" style={{ color: "#0A4E52", marginTop: "3%", width: "8%" }}>
                                </Icon><TextInput multiline enableScrollToCaret
                                    ref={(r) => { this._captionTextInput = r; }} value={this.state.captionText} onChange={(data) => this._onChangeCaption(data)}
                                    style={{ left: 0, right: 0, height: 59, width: "84%" }}
                                    placeholder={'Enter your text!'} />
                                <Icon style={{ color: "#0A4E52", marginTop: "3%", width: "8%" }} onPress={() => this._sendCaptionMessage()} type={"FontAwesome"} name={"paper-plane"}></Icon>
                            </View>
                            {
                                //********** Caption Emoji Keyboard *******************************/
                                this.state.showEmojiInputCaption ? <View style={{ width: "100%", height: 300 }}>
                                    <EmojiInput onEmojiSelected={(emoji) => this.handleEmojieSectionCaption(emoji)}
                                        enableSearch={false}
                                        ref={emojiInput => this._emojiInputCaption = emojiInput}
                                        resetSearch={this.state.reset}
                                        loggingFunction={this.verboseLoggingFunction.bind(this)}
                                        verboseLoggingFunction={true}
                                        filterFunctions={[this.filterFunctionByUnicode]} ></EmojiInput>
                                </View> : null}
                        </KeyboardAvoidingView>
                    </View> : null}
                {

                    //******  Reply Message onClick See Reply handler View ********/


                    this.state.showRepliedMessage ? <View style={{
                        height: 1000,
                        position: "absolute", backgroundColor: this.transparent,
                        width: "100%",
                    }}>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            {this.state.replyer.user == this.state.user ? <TouchableOpacity onPress={() => {
                                this.setState({
                                    showRepliedMessage: false
                                })
                            }}>
                                <Icon type="EvilIcons" style={{ margin: '7%', fontSize: 35, color: "#FEFFDE" }} name={"close"}></Icon>
                            </TouchableOpacity> : null}
                            <ScrollView>
                                <View style={{ display: "flex", }}>
                                    {<Message openReply={(replyer) => {
                                        this.setState({
                                            replyer: replyer,
                                            showRepliedMessage: true
                                        })
                                    }} playVideo={(source) => this.playVideo(source)}
                                        creator={2} user={2} message={find(stores.ChatStore.messages, { id: this.state.replyer.id })} />}
                                </View>
                            </ScrollView>
                            {!(this.state.replyer.user == this.state.user) ? <TouchableOpacity onPress={() => {
                                this.setState({
                                    showRepliedMessage: false
                                })
                            }}>
                                <Icon type="EvilIcons" style={{ margin: '2%', marginTop: "8%", fontSize: 35, color: "#FEFFDE" }} name={"close"}></Icon>
                            </TouchableOpacity> : null}
                        </View>
                    </View> : null}
                {
                    //** ####### Vidoe PLayer View ################ */

                    this.state.showVideo ? <View style={{
                        height: this.state.keyboardOpened || this.state.showEmojiInput || this.state.showEmojiInputCaption ? 300 : 400,
                        position: "absolute",
                        width: this.state.fullScreen ? "100%" : screenWidth,
                        backgroundColor: this.transparent,
                        alignSelf: 'center',
                    }}>
                        <VideoPlayer source={{ uri: this.state.video }}   // Can be a URL or a local file.
                            ref={(ref) => {
                                this.videoPlayer = ref
                            }}
                            onBuffer={() =>
                                this.buffering()
                            }                // Callback when remote video is buffering
                            onError={(error) => {
                                console.error(error)
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
                            //fullscreenOrientation={"landscape"}
                            //fullscreen={true}
                            //controls={true}
                            style={{
                                backgroundColor: this.transparent,
                            }}
                            videoStyle={{
                                alignItems: 'center',
                                height: "100%",
                                width: "100%",
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                            }}             // Callback when video cannot be loaded
                        />
                    </View> : null}
            </View>

        )
    }
}


const styles = StyleSheet.create({
    textInput: {
        paddingLeft: 10,
        fontSize: 17,
        height: 50,
        width: 195,
        borderColor: "#1FABAB",
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
    }
});