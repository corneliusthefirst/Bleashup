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
    Button
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
    KeyboardAvoidingView
} from 'react-native';

import { observer } from "mobx-react";
import Menu, { MenuDivider } from 'react-native-material-menu';
import initialRoute from "../invitations/components/initialRoute";
import globalState from "../../../stores/globalState";
import ServerEventListener from "../../../services/severEventListener";
import connection from "../../../services/tcpConnect";
import UpdatesDispatcher from "../../../services/updatesDispatcher";
import { ScrollView } from 'react-navigation';
import EmojiInput from "react-native-emoji-input"
import VideoPlayer from "./VideoController"
import Image from 'react-native-scalable-image';
import KeyboardSpacer from '@thenetcircle/react-native-keyboard-spacer';
//import ImagePicker from 'react-native-image-picker';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import ImagePicker from 'react-native-customized-image-picker';
import BleashupFlatList from '../../BleashupFlatList';
import Message from "./Message";
import { find, orderBy, reject } from "lodash"
import { TextInput } from "react-native-gesture-handler";
import stores from "../../../stores";
import moment from "moment";
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
            keyboardOpened: false,
            textValue: '',
            image: null,
            captionText: '',
            textHeight: screenheight * 0.1,
            photoHeight: screenheight * 0.9,
            showCaption: false,
            showEmojiInputCaption: false,
            messageListHeight: this.formHeight(0.91),
            textInputHeight: this.formHeight(0.09),
            inittialTextInputHeightFactor: 0.09,
            initialMessaListHeightFactor: 0.91,
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
        /*   UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
               const fieldHeight = height;
               const fieldTop = pageY;
               const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
               if (gap >= 0) {
                   return;
               }
               Animated.timing(
                   this.state.shift,
                   {
                       toValue: gap,
                       duration: 1000,
                       useNativeDriver: true,
                   }
               ).start();
           });*/
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
        /*  Animated.timing(
              this.state.shift,
              {
                  toValue: 0,
                  duration: 1000,
                  useNativeDriver: true,
              }
          ).start();*/
    }

    handleBackButton() {
        if (this.state.showVideo) {
            this.setState({
                showVideo: false
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
        if (this.state.textValue !== '') {
            let messager = {
                id: Math.random() * 100,
                type: "text",
                text: message,
                sender: {
                    phone: 3,
                    nickname: "Fokam Giles"
                },
                user: 3,
                creator: 1,
                created_at: moment().format("YYYY-MM-DD HH:mm")
            }
            stores.ChatStore.messages.unshift(messager)
            this._resetTextInput()
            this.setState({
                textValue: ''
            })
        }
    }
    showPhoto(photo) {
        this.setState({
            photo: photo,
            showPhoto: true
        })
    }
    openCamera() {
        Keyboard.dismiss();
        ImagePicker.openCamera({
            cropping: false,
            includeBase64: false,
            title: "Take A Photo",
            compressQuality: 50
        }).then(response => {
            let temp = response[0].path.split('/');
            this.setState({
                image: response[0].path,
                base64: response[0].data,
                imageSelected: true,
                showCaption: true,
                filename: temp[temp.length - 1],
                content_type: response[0].mime,
                size: response[0].size
            })
        })
    }
    openPhotoSelector(){
        Keyboard.dismiss()
        ImagePicker.openPicker({

        })
    }
    _sendCaptionMessage() {
        let message = {
            id: Math.random() * 100,
            type: (this.state.imageSelected ? "photo" : "video") + "_upload",
            source: this.state.image,
            sender: {
                phone: 2,
                nickname: "Fokam Sanza"
            },
            user: 2,
            created_at: moment().format("YYYY-MM-DD HH:mm"),
            total: this.state.size,
            send: 0,
            data: this.state.base64,
            content_type: this.state.content_type,
            filename: this.state.filename,
            text: this.state.captionText
        }
        stores.ChatStore.messages.unshift(message)
        this._resetCaptionInput();
        this.setState({
            captionText: '',
            showCaption: false,
        })
    }
    replaceMessage(newMessage) {
        stores.ChatStore.messages = reject(stores.ChatStore.messages, { id: newMessage.id })
        stores.ChatStore.messages.unshift(newMessage)
        this.setState({
            newMessage: true
        })
        newMessage.photo = newMessage.source
        //send message to the server here
    }
    verboseLoggingFunction(error) {

    }
    _onChangeCaption(event) {
        this.setState({
            captionText: event.nativeEvent.text || ''
        })
    }
    transparent = "rgba(50, 51, 53, 0.8)";
    render() {
        return (
            <View>
                <View>
                    <View style={{ height: this.state.messageListHeight, marginBottom: "0.5%", }}>
                        <BleashupFlatList
                            firstIndex={0}
                            inverted={true}
                            renderPerBatch={20}
                            initialRender={15}
                            numberOfItems={stores.ChatStore.messages.length}
                            keyExtractor={(item) => item ? item.id : null}
                            renderItem={(item) => item ? <Message showPhoto={(photo) => this.showPhoto(photo)} replaceMessage={(data) => this.replaceMessage(data)} message={item} openReply={(replyer) => {
                                this.setState({
                                    replyer: replyer,
                                    showRepliedMessage: true
                                })
                            }} user={item.user} creator={item.creator} playVideo={(source) => this.playVideo(source)}></Message> : null}
                            dataSource={stores.ChatStore.messages}
                        >
                        </BleashupFlatList>
                    </View>
                    <KeyboardAvoidingView keyboardVerticalOffset>
                        <View style={{ height: this.state.textInputHeight, }}>
                            <View style={{ display: 'flex', flexDirection: 'row', }}>
                                <View style={{
                                    marginTop: "2%",
                                    display: 'flex', flexDirection: 'row',
                                }}><TouchableOpacity>
                                        <Icon name={"attach-file"} type={"MaterialIcons"} style={{ color: "#0A4E52", }}></Icon></TouchableOpacity>
                                    <TouchableOpacity onPress={()=> this.openPhotoSelector()}><Icon style={{ color: "#0A4E52", marginRight: "1%", }}
                                        type={"Ionicons"} name={"md-photos"}></Icon></TouchableOpacity><TouchableOpacity
                                            onPress={() => this.openCamera()}><Icon style={{ color: "#0A4E52", marginRight: "1%" }}
                                                type={"MaterialIcons"} name={"photo-camera"}></Icon></TouchableOpacity><TouchableOpacity>
                                        <Icon name={"video-camera"} type={"Entypo"} style={{ color: "#0A4E52", marginRight: "1%", }}></Icon></TouchableOpacity>
                                    <Icon style={{ color: "#1FABAB" }} onPress={() => {
                                        !this.state.showEmojiInput ? Keyboard.dismiss() : this._textInput.focus()
                                        this.setState({
                                            showEmojiInput: !this.state.showEmojiInput,
                                            messageListHeight: this.state.showEmojiInput ?
                                                this.formHeight(this.state.initialMessaListHeightFactor) : this.formHeight(0.50),
                                            textInputHeight: this.state.showEmojiInput ?
                                                this.formHeight(this.state.inittialTextInputHeightFactor) : this.formHeight(0.50)
                                        })
                                    }} type="Entypo" name="emoji-flirt"></Icon></View>
                                <TextInput
                                    value={this.state.textValue}
                                    onChange={(event) => this._onChange(event)}
                                    style={{
                                        paddingLeft: 10,
                                        fontSize: 17,
                                        height: 50,
                                        width: 195,
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
                                <View style={{ marginLeft: "2%", marginTop: "2%", display: 'flex', flexDirection: 'row', }}><TouchableOpacity><Icon style={{
                                    color: "#0A4E52",
                                    marginRight: "8%",
                                }}
                                    type={"FontAwesome5"} name={"microphone-alt"} ></Icon></TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        requestAnimationFrame(() => {
                                            return this.sendMessageText(this.state.textValue)
                                        })
                                    }}><Icon style={{ color: "#1FABAB" }}
                                        name="paper-plane" type="FontAwesome"></Icon></TouchableOpacity></View>
                            </View>
                            {this.state.showEmojiInput ? <View style={{ width: "100%", height: 300 }}>
                                <EmojiInput onEmojiSelected={(emoji) => this.handleEmojiSelected(emoji)}
                                    enableSearch={false}
                                    ref={emojiInput => this._emojiInput = emojiInput}
                                    resetSearch={this.state.reset}
                                    loggingFunction={this.verboseLoggingFunction.bind(this)}
                                    verboseLoggingFunction={true}
                                    filterFunctions={[this.filterFunctionByUnicode]} ></EmojiInput>
                            </View> : null}
                        </View>
                    </KeyboardAvoidingView>
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
                            <Icon type="EvilIcons" onPress={()=>{
                                this.setState({
                                    showPhoto:false
                                })
                            }} style={{ margin: '1%', position:'absolute', fontSize: 30, color: "#FEFFDE" }} name={"close"}></Icon>
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
                                onZoomAfter={this.logOutZoomState}><Image resizeMode={"contain"}
                                    width={screenWidth} style={{ flex: 1 }} source={{ uri: this.state.image }}></Image></ReactNativeZoomableView> : null}
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
                            {this.state.showEmojiInputCaption ? <View style={{ width: "100%", height: 300 }}>
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
                                        creator={2} user={2} message={find(this.message, { id: this.state.replyer.id })} />}
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
                        height: 400,
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