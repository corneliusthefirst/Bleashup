import React, { PureComponent } from "react"
import { View, 
    TouchableOpacity, 
    Keyboard, 
    Image, 
    UIManager,
    Platform, 
    LayoutAnimation} from 'react-native';
import ImojieSelector from "./ImojiSelector";
import Pickers from '../../../services/Picker';
import rounder from '../../../services/rounder';
import { Icon } from "native-base";
import GState from '../../../stores/globalState/index';
import ReplyText from "./ReplyText";
import toTitleCase from '../../../services/toTitle';
import globalFunctions from '../../globalFunctions';
import stores from "../../../stores";
import BleashupFlatList from '../../BleashupFlatList';
import ProfileSimple from '../currentevents/components/ProfileViewSimple';
import AudioRecorder from "./AudioRecorder";
import GrowingInput from "./GrowingInput";
import ColorList from '../../colorList';
import uuid from 'react-native-uuid';
import moment from "moment";
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import VideoController from './VideoController';
import AudioFilePreviewer from "./AudioFilePreviewer";


export default class ChatKeyboard extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            textValue: ""
        }
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
    componentWillMount() {
        this.formSerachableMembers();
    }
    _resetTextInput() {
        this._textInput.clear();
    }
    sendMessageText(message) {
        if (this.state.showCaption) {
            this._sendCaptionMessage()
        } else if (this.state.showAudioRecorder) {
            this.refs.AudioRecorder.stopRecord();
        } else if (this.state.textValue !== "" && message !== "") {
            this.props.initialzeFlatList();
            let messager = {
                id: uuid.v1(),
                type: "text_sender",
                tags: this.tags,
                text: message,
                sender: this.props.sender,
                reply: this.state.replyContent,
                creator: this.creator,
                created_at: moment().format(),
            };
            this.props.scrollToEnd();
            stores.Messages.addMessageToStore(this.props.roomID, messager).then((data) => {
                this._resetTextInput();
                this.tags = null;
                this.setState({
                    textValue: "",
                    replying: false,
                    replyContent: null,
                });
                this.animateLayout()
            });
        } else {
        }
    }
    componentWillUnmount() {
        Pickers.CleanAll();
    }
    sendAudioMessge(filename, duration, dontsend) {
        this.setState({
            showAudioRecorder: false,
        });
        if (!dontsend) {
            this.props.scrollToEnd();
            let message = {
                id: uuid.v1(),
                source: "file://" + (filename || this.filename),
                duration: duration || this.duration,
                type: "audio_uploader",
                text: this.state.textValue,
                reply: this.state.replyContent,
                tags: this.tags,
                sender: this.props.sender,
                content_type: "audio/mp3",
                total: 0,
                received: 0,
                file_name: "test.mp3",
                created_at: moment().format(),
            };
            stores.Messages.addMessageToStore(this.props.roomID, message).then(() => {
                this._resetTextInput()
                this.setState({
                    newMessage: true,
                    textValue: "",
                    audioSouce: null,
                    audio: false,
                    replying: false,
                    replyContent: null,
                });
                this.tags = null
                this.focus()
                this.props.initialzeFlatList();
                this.animateLayout()
            });
        }
    }
    _onChange(event) {
        let text = event.nativeEvent.text;
        this.setState({ textValue: text || "" });
        if (text.split("@").length > 1) {
            this.setState({
                tagging: true,
            });
        }
        //this.props.setTyingState(/*this.sender*/);
        this.props.adjutRoomDisplay();
        this.animateLayout()
    }
    imojiInput() {
        return <ImojieSelector
            handleEmojiSelected={this.handleEmojiSelected.bind(this)}
        >
        </ImojieSelector>
    }
    animateLayout(){
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        let i = 0
      this.animationInterval =  setInterval(() => {
            if(i >= 5){
                clearInterval(this.animationInterval)
            }
            this.props.adjutRoomDisplay()
            i = i + 1
        },50)
    }
    handleEmojiSelected(e) {
        this.setState({
            textValue: this.state.textValue + e,
        });
    }
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
        this.animateLayout()
    }
    formSerachableMembers() {
        stores.TemporalUsersStore.getUsers(
            this.props.members ?
                this.props.members.map((ele) => ele.phone) :
                [],
            [],
            (users) => {
                this.searchableMembers = users;
            }
        );
    }
    searchableMembers = [];
    tagger() {
        return (
            <View
                style={{
                    width: "100%",
                    backgroundColor: ColorList.bottunerLighter,
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
    cancleReply() {
        GState.reply = null;
        this.setState({
            replying: false,
            replyContent: null,
        });
        this.props.adjutRoomDisplay();
        this.animateLayout()
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
                            ? this.props.handleReplyExtern(replyer)
                            : this.props.handleReply(replyer)
                    }}
                    pressingIn={() => { }}
                    showProfile={(pro) => this.props.showProfile(pro)}
                    reply={this.state.replyContent}
                ></ReplyText>
                <TouchableOpacity
                    onPress={() => requestAnimationFrame(this.cancleReply.bind(this))}
                    style={{
                        ...rounder(15, ColorList.bodyBackground),
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
                            fontSize:15,
                            alignSelf: "center",
                        }}
                    ></Icon>
                </TouchableOpacity>
            </View>
        );
    }
    focus() {
        this._textInput.focus()
    }
    blur() {
        this._textInput.blur()
    }
    replying(replyer, color) {
        this.setState({
            loaded: true,
            replying: true,
            replyContent: replyer,
            replyerBackColor: color,
        });
        this.props.adjutRoomDisplay();
        this.animateLayout()
    }
    openCamera() {
        this.blur()
        Pickers.SnapPhoto("all").then((snap) => {
            let isVideo = snap.content_type.includes("video") ? true : false;
            this.setState({
                video: snap.source,
                image: snap.source,
                audio: false,
                audioSouce: false,
                showCaption: true,
                imageSelected: isVideo ? false : true,
                filename: snap.filename,
                showVideo: isVideo ? true : false,
                content_type: snap.content_type,
                size: snap.size,
            });
            this.props.markAsRead();
            this.activateKeyboard()
            this.animateLayout()
        });
    }
    _sendCaptionMessage() {
        if (this.state.audioSouce) {
            this.sendAudioMessge(this.state.audioSouce, this.duration)
        } else {
            this.props.scrollToEnd();
            let message = {
                id: uuid.v1(),
                type: (this.state.imageSelected ? "photo" : "video") + "_upload",
                source: this.state.imageSelected ? this.state.image : this.state.video,
                sender: this.props.sender,
                tags: this.tags,
                reply: this.state.replyContent,
                created_at: moment().format(),
                total: this.state.size,
                send: 0,
                content_type: this.state.content_type,
                filename: this.state.filename,
                text: this.state.textValue,
            };
            stores.Messages.addMessageToStore(this.props.roomID, message).then(() => {
                this.tags = null;
                this.props.initialzeFlatList();
            });
            this.setState({
                textValue: "",
                replyContent: null,
                replying: false,
                showEmojiInput: false,
                showCaption: false,
                showVideo: false,
            });
            this.animateLayout()
        }
    }
    toggleAudioRecorder() {
        this.setState({
            showAudioRecorder: !this.state.showAudioRecorder,
        });
        setTimeout(() => {
            if (!this.state.showAudioRecorder) {
                this.refs.AudioRecorder.stopRecordSimple();
            } else {
                this._textInput.focus();
                this.refs.AudioRecorder.startRecorder();
            }
        })
        this.animateLayout()
    }
    pickMultiplePhotos() {
        Pickers.TakeManyPhotos()
            .then((response) => {
                response.map((res) => {
                    message = {
                        id: uuid.v1(),
                        type: "photo" + "_upload",
                        source: res.source,
                        sender: this.props.sender,
                        //user: this.user,
                        created_at: moment().format(),
                        total: res.size,
                        send: 0,
                        // data: this.state.base64,
                        content_type: res.content_type,
                        filename: res.filename,
                    };
                    stores.Messages.addMessageToStore(this.props.roomID, message).then(() => {
                        this.setState({
                            newMessage: true,
                        });
                        this.props.initialzeFlatList();
                        this.props.markAsRead();
                    });
                });
            })
            .catch((error) => {
                console.warn(error);
            });
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
    toggleEmojiKeyboard() {
        offset = this.state.replying ? 0.1 : 0;
        this.temp = GState.reply ? JSON.stringify(GState.reply) : null;
        GState.reply = null;
        Keyboard.dismiss();
        setTimeout(
            () => {
                this.setState({
                    showEmojiInput: !this.state.showEmojiInput,
                });
                this.props.adjutRoomDisplay(true);
            },
            this.state.keyboardOpened ? 200 : 0
        );
        this.animateLayout()
    }
    showAudio() {
        this.toggleAudioRecorder();
        this.props.adjutRoomDisplay();

    }
    tags = null;
    resetImoji() {
        setTimeout(() => {
            this.setState({
                showEmojiInput: false
            })
            //this.props.adjutRoomDisplay()
        }, 190)
        this.animateLayout()
    }
    hideCaption() {
        this.setState({
            showCaption: false,
            audio: false,
            audioSouce: null
        })
        this.animateLayout()
    }
    filename = ""
    logOutZoomState = (event, gestureState, zoomableViewEventObject) => { };
    async pickAudio() {
        this.blur()
        const res = await Pickers.TakeAudio();
        this.setState({
            audioSouce: res.uri,
            showCaption: true,
            audio: true
        });
        this.duration = 0;
        this.props.initialzeFlatList()
        //this.sendAudioMessge(temp, this.duration);
        this.activateKeyboard()
        this.animateLayout()
    }
    activateKeyboard() {
        setTimeout(() => {
            this.focus()
        })
    }
    async pickFile() {
        this.blur()
        const res = await Pickers.TakeFile();
        this.props.scrollToEnd();
        message = {
            id: uuid.v1(),
            source: res.uri,
            file_name: res.name,
            reply: this.state.replyContent,
            sender: this.props.sender,
            //user: this.user,
            creator: 2,
            type: "attachement_upload",
            received: 0,
            total: res.size,
            created_at: moment().format(),
        };
        stores.Messages.addMessageToStore(this.props.roomID, message).then((data) => {
            this.props.initialzeFlatList();
        });
    }
    hideAudioCaption(){
        this.setState({
            audio:false,
            audioSouce:false,
            showCaption:false
        })
        this.animateLayout()
    }
    showMedia() {
        return this.state.audio ? <View><AudioFilePreviewer source={this.state.audioSouce}

        >
        </AudioFilePreviewer><TouchableOpacity
        onPress={() => this.hideAudioCaption()}
         style={{
            position: 'absolute',
            ...rounder(15, ColorList.bodyBackground),
            alignItems: 'center', textAlign: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-end',
        }}><Icon name="close"
        style={{
            fontSize: 15,
        }}
            type={"EvilIcons"}></Icon></TouchableOpacity>
        </View> : !this.state.showVideo ? <View style={{
            height: 300, width: '100%',
        }}><ReactNativeZoomableView
            style={{
                height: 300,
                width: '100%'
            }}
            maxZoom={1}
            minZoom={0.5}
            zoomStep={0.5}
            initialZoom={1}
            bindToBorders={true}
            onZoomAfter={this.logOutZoomState}
        >
                <Image
                    resizeMode={"contain"}
                    style={{ flex: 1, width: '100%', height: '100%' }}
                    source={{ uri: this.state.image }}>
                </Image>
            </ReactNativeZoomableView>
            <TouchableOpacity
                onPress={() => requestAnimationFrame(this.hideCaption.bind(this))}
                style={{
                    position: 'absolute',
                    ...rounder(15, ColorList.bodyBackground),
                    alignSelf: 'flex-end',
                    justifyContent: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}><Icon
                    name="close"
                    type="EvilIcons" style={{
                        fontSize:15,
                    }}></Icon></TouchableOpacity>
        </View> :
                <View style={{ width: '100%', height: 300 }}>
                    <VideoController
                        source={{ uri: this.state.video }}
                        resizeMode={"contain"}
                        disableVolume={true}
                        seekColor={ColorList.indicatorColor}
                        disableFullscreen={true}
                        onBack={() => this.hideCaption()}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderTopRightRadius: 5,
                            borderTopLeftRadius: 5,
                        }}
                        videoStyle={{
                            alignItems: "center",
                            height: "100%",
                            width: "100%",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                        }}
                    >
                    </VideoController>
                </View>
    }
    render() {
        return <View>
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
                        width: ColorList.containerWidth - 8,
                    }}
                >
                    <View
                        style={{
                            width: "86%",
                            fontSize: 17,
                            bottom: 0,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderColor: "#1FABAB",
                            borderWidth: 0,
                            borderRadius: 10,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                requestAnimationFrame(() =>
                                    this.openCamera()
                                )}
                            style={{
                                width: "12%",
                                alignSelf: 'flex-end',
                                bottom: 2,
                                padding: "1%",
                            }}
                        >
                            <View style={{
                                alignItems: 'center',
                                ...rounder(30, ColorList.indicatorColor)
                            }}>
                                <Icon
                                    style={{
                                        color: ColorList.bodyBackground,
                                        fontSize: 20,
                                    }}
                                    type={"MaterialCommunityIcons"}
                                    name={"image-filter"}
                                ></Icon>
                            </View>
                        </TouchableOpacity>
                        <View
                            style={{
                                width: "88%",
                                flexDirection: "column",
                                borderRadius: 25,
                                backgroundColor: ColorList.bodyBackground,
                                borderWidth: 0.2,
                                borderColor: "grey",
                                borderTopLeftRadius:
                                    this.state.replying ||
                                        this.state.tagging ||
                                        this.state.showAudioRecorder ||
                                        this.state.showCaption
                                        ? 5
                                        : 25,
                                borderTopRightRadius:
                                    this.state.replying ||
                                        this.state.tagging ||
                                        this.state.showAudioRecorder ||
                                        this.state.showCaption
                                        ? 5
                                        : 25,
                            }}
                        >
                            {
                                //* Reply Message caption */
                                this.state.replying ? this.replyMessageCaption() : null
                            }
                            {
                                this.state.showCaption ? this.showMedia() : null
                            }
                            {
                                //* Tagger component @Giles e.g *//
                                this.state.tagging ? this.tagger() : null
                            }
                            {
                                // ******************** Audio Recorder Input ************************//

                                this.audioRecorder()
                            }
                            <GrowingInput
                                onFocus={this.resetImoji.bind(this)}
                                _onChange={this._onChange.bind(this)}
                                animateLayout={() => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)}
                                textValue={this.state.textValue}
                                ref={(r) => {
                                    this._textInput = r;
                                }}>
                            </GrowingInput>
                            <TouchableOpacity
                                style={{
                                    width: "16%",
                                    position: "absolute",
                                    bottom: 10,
                                    right: 5,
                                }}
                                onPress={() => requestAnimationFrame(() => {
                                    this.toggleEmojiKeyboard();
                                })}
                            >
                                <Icon
                                    style={{
                                        color: "gray",
                                        alignSelf: "flex-end",
                                        fontSize: 20,
                                    }}
                                    type="Entypo"
                                    name="emoji-flirt"
                                ></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={{
                            width: "12%",
                            alignSelf: 'flex-end',
                            alignItems: 'center',
                            bottom: 2,
                            padding: "1%",
                        }}
                        onPress={() => requestAnimationFrame(() => {
                            (!this.state.textValue &&
                                !this.state.showAudioRecorder && !this.state.showCaption) ?
                                this.showAudio() :
                                this.sendMessageText(this.state.textValue);
                        })}
                    >
                        <View style={{
                            alignSelf: 'flex-end',
                            ...rounder(30, ColorList.senTBoxColor),
                            alignItems: 'center',
                        }}>{!this.state.textValue &&
                            !this.state.showAudioRecorder &&
                            !this.state.showCaption ? (
                                <Icon
                                    style={{
                                        color: ColorList.bodyIcon,
                                        fontSize: 23,
                                        alignSelf: "center",
                                    }}
                                    type={"FontAwesome5"}
                                    name={"microphone-alt"}
                                ></Icon>
                            ) : (
                                <Icon
                                    style={{
                                        color: ColorList.bodyIcon,
                                        fontSize: 23,
                                        alignSelf: "center"
                                    }}
                                    name="md-send"
                                    type="Ionicons"
                                ></Icon>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    // ***************** Emoji keyBoard Input ***********************//
                    this.state.showEmojiInput ? this.imojiInput() : null
                }
            </View>
        </View>
    }
}