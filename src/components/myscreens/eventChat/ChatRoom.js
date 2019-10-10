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
    Image,
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
import Video from 'react-native-video';
import VideoPlayer from "./VideoController"
import KeyboardSpacer from '@thenetcircle/react-native-keyboard-spacer';
import TextMessage from "./TextMessage";
import PhotoMessage from "./PhotoMessage";
import AudioMessage from "./AudioMessage";
import VideoMessage from "./VideoMessage";
import FileAttarchementMessaege from "./FileAttarchtmentMessage";
import BleashupFlatList from '../../BleashupFlatList';
import Message from "./Message";
import { find,orderBy } from "lodash"
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
            textValue:'',
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
            showEmojiInput:this.state.showEmojiInput?false:false,
            keyboardOpened: true,
            textInputHeight: this.formHeight(this.textInputFactor),
            messageListHeight: this.formHeight(this.messageListFactor)
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
            messageListHeight:!this.state.showEmojiInput?
             this.formHeight(this.state.initialMessaListHeightFactor):this.formHeight(0.50),
            textInputHeight:!this.state.showEmojiInput? 
            this.formHeight(this.state.inittialTextInputHeightFactor):this.formHeight(0.50)
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
        } else if(this.state.showEmojiInput){
            this._textInput.focus()
            this.setState({
                showEmojiInput:false
            })
            return true
        } else {

        }
    }
    state = {
        sender: false,
        showTime: true
    }
    message = [{
        id: 0,
        source: 'http://192.168.43.32:8555/sound/get/p2.mp3',
        file_name: 'p2.mp3',
        total: 0,
        received: 0,
        user: 2,
        creator: 2,
        type: 'audio',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    }, {
            id: 1,
            source: 'http://192.168.43.32:8555/sound/get/p2.mp3',
            file_name: 'p2.mp3',
            total: 0,
            received: 0,
            user: 1,
            creator: 2,
            type: 'text',
            text:`hello `,
            sender: {
                phone: 3,
                nickname: "Sokeng Kamga"
            },
            duration: Math.floor(0),
            created_at: "2014-03-30 12:32",
        }, {
        id: 2,
        sender: {
            phone: 2,
            nickname: "Sokeng Kamga"
        },
        user: 3,
        reply: {
            id: 3,
            user: 2,
            text: `Hello!  Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>`,
            video: true,
            replyer_name: "Santers Gipson",
            source: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg"
        },
        creator: 2,
        type: "photo",
        photo: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg",
        file_name: 'bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg',
        created_at: "2014-03-30 12:32",
        text: `Hello!`
    }, {
        id: 3,
        source: 'http://192.168.43.32:8555/video/get/bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0.mp4',
        file_name: 'bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0_thumbnail.jpeg',
        thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0_thumbnail.jpeg',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        user: 2,
        creator: 3,
        type: "video",
        received: 0,
        total: 0,
        reply: {
            id: 2,
            user: 3,
            text: `Hello!  Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>`,
            video: true,
            replyer_name: "Santers Gipson",
            source: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg"
        },
        text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.`,
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    }, {
        id: 4,
        source: 'http://192.168.43.32:8555/video/get/bm6lgk013ult9gc75vmg_bm6lgk013ult9gc75vn0_bm6lgk013ult9gc75vng.mp4',
        file_name: 'Black M - Le prince Aladin (Clip officiel) ft. Kev Adams.mp4',
        thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bm7sd5813ulrbjp7u1sg_bm7sd5813ulrbjp7u1t0_bm7sd5813ulrbjp7u1tg_thumbnail.jpeg',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        user: 2,
        creator: 2,
        type: "attachement",
        received: 0,
        total: 0,
        text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.

`,
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    },
        , {
        id: 5,
        source: 'http://192.168.43.32:8555/video/get/Black M - Le prince Aladin (Clip officiel) ft. Kev Adams.mp4',
        file_name: 'bm6lgk013ult9gc75vmg_bm6lgk013ult9gc75vn0_bm6lgk013ult9gc75vng.mp4',
        thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bm7sd5813ulrbjp7u1sg_bm7sd5813ulrbjp7u1t0_bm7sd5813ulrbjp7u1tg_thumbnail.jpeg',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        type: "video",
        user: 3,
        creator: 2,
        received: 0,
        total: 0,
        text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.

`,
        duration: Math.floor(0),
        created_at: "2014-0s3-30 12:32",
    }]
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
    handleEmojiSelected(e) {
        this.setState({
            textValue: this.state.textValue +e.char
        })
    }
    sendMessageText(message){
      let  messager = {
          id:100,
            type:"text",
            text : message,
            sender:{
                phone:3,
                nickname:"Fokam Giles"
            },
            user :2,
            creator:1,
          created_at: moment().format("YYYY-MM-DD HH:mm")
        }
        this.message.unshift(messager)
        stores.ChatStore.addMessage(messager).then(()=>{
            this._resetTextInput()
            this.setState({
                newMessage:true
            })
        })
    }
    verboseLoggingFunction(error) {

    }
    transparent = "rgba(50, 51, 53, 0.8)";
    render() {
        return (
            <View>
                <View>
                    <View style={{ height: this.state.messageListHeight,marginBottom: "0.5%", }}>
                        <BleashupFlatList
                            firstIndex={0}
                            inverted={true}
                            renderPerBatch={20}
                            initialRender={7}
                            numberOfItems={this.message.length}
                            keyExtractor={(item) => item ? item.id : null}
                            renderItem={(item) => item ? <Message message={item} openReply={(replyer) => {
                                this.setState({
                                    replyer: replyer,
                                    showRepliedMessage: true
                                })
                            }} user={item.user} creator={item.creator} playVideo={(source) => this.playVideo(source)}></Message> : null}
                            dataSource={this.message}
                        >
                        </BleashupFlatList>
                    </View>
                    <KeyboardAvoidingView  keyboardVerticalOffset>
                    <View style={{ height: this.state.textInputHeight, }}>
                            <View style={{ display: 'flex', flexDirection: 'row', }}>
                                <View style={{marginTop: "2%", 
                            display: 'flex',flexDirection: 'row',}}><TouchableOpacity>
                                        <Icon name={"attach-file"} type={"MaterialIcons"} style={{ color: "#0A4E52", }}></Icon></TouchableOpacity>
                                    <TouchableOpacity><Icon style={{ color: "#0A4E52", marginRight: "1%",}} 
                                        type={"Ionicons"} name={"md-photos"}></Icon></TouchableOpacity><TouchableOpacity><Icon style={{ color: "#0A4E52", marginRight: "1%"}}
                                        type={"MaterialIcons"} name={"photo-camera"}></Icon></TouchableOpacity><Icon style={{ color: "#1FABAB" }} onPress={() => {
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
                                    style={styles.textInput}
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
                                marginRight: "8%", }} 
                                    type={"FontAwesome5"} name={"microphone-alt"} ></Icon></TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{requestAnimationFrame(()=>{
                                       return this.sendMessageText(this.state.textValue)
                                    })}}><Icon style={{ color: "#1FABAB" }} name="paper-plane" type="FontAwesome"></Icon></TouchableOpacity></View>
                            </View>
                            {this.state.showEmojiInput ? <View style={{ width: "100%", height:300}}>
                                <EmojiInput onEmojiSelected={(emoji) => this.handleEmojiSelected(emoji)}
                                    enableSearch={false}
                                    ref={emojiInput => this._emojiInput = emojiInput}
                                    resetSearch={this.state.reset}
                                    loggingFunction={this.verboseLoggingFunction.bind(this)}
                                    verboseLoggingFunction={true}
                                    filterFunctions={[this.filterFunctionByUnicode]} ></EmojiInput>
                            </View> : null}
                        <KeyboardSpacer />
                    </View>
                    </KeyboardAvoidingView>
                </View>
                {this.state.showRepliedMessage ? <View style={{
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
                {this.state.showVideo ? <View style={{
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
        height:50,
        width: 230,
        borderColor: "#1FABAB",
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 8,
    }
});