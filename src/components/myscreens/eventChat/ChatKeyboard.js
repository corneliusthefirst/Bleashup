import React, { PureComponent } from "react";
import {
    View,
    TouchableOpacity,
    Keyboard,
    Image,
    UIManager,
    Platform,
    LayoutAnimation,
} from "react-native";
import ImojieSelector from "./ImojiSelector";
import Pickers from "../../../services/Picker";
import rounder from "../../../services/rounder";
import GState from "../../../stores/globalState/index";
import ReplyText from "./ReplyText";
import toTitleCase from "../../../services/toTitle";
import globalFunctions from "../../globalFunctions";
import stores from "../../../stores";
import BleashupFlatList from "../../BleashupFlatList";
import ProfileSimple from "../currentevents/components/ProfileViewSimple";
import AudioRecorder from "./AudioRecorder";
import GrowingInput from "./GrowingInput";
import ColorList from "../../colorList";
import moment from "moment";
import AudioFilePreviewer from "./AudioFilePreviewer";
import FilePreview from "./FilePreview";
import PhotoPreview from "./PhotoPreviewer";
import BeComponent from "../../BeComponent";
import BeNavigator from '../../../services/navigationServices';
import Vibrator from '../../../services/Vibrator';
import Toaster from "../../../services/Toaster";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IDMaker from '../../../services/IdMaker';
import AnimatedComponent from '../../AnimatedComponent';
import Texts from '../../../meta/text';
import request from "../../../services/requestObjects";
import RelationMessage from "./RelationMessage";
import message_types from './message_types';
import Requester from './Requester';
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';

export default class ChatKeyboard extends AnimatedComponent {
    constructor(props) {
        super(props);
        this.state = {
            textValue: "",
            isOptionsOpened: false,
        }
        this.tagItem = this.tagItem.bind(this)
        this.choseTagged = this.choseTagged.bind(this)
    }
    componentMounting() {
        this.formSerachableMembers();
    }
    _resetTextInput() {
        this._textInput.clear();
    }
    sendMessageText(message) {
        if (this.state.showCaption) {
            this._sendCaptionMessage();
        } else if (this.props.showAudioRecorder) {
            this.refs.AudioRecorder.stopRecord();
        } else if (this.state.textValue !== "" && message !== "") {
            this.props.initialzeFlatList();
            let messager = {
                ...request.Message(),
                id: IDMaker.make(),
                type: "text_sender",
                tags: this.tags,
                text: message,
                sender: this.props.sender,
                reply: this.state.replyContent,
                creator: this.creator,
                created_at: moment().format(),
            };
            this.props.scrollToEnd();
            stores.Messages.addMessageToStore(this.props.roomID, messager).then(
                (data) => {
                    this._resetTextInput();
                    this.tags = null;
                    this.setStatePure({
                        textValue: "",
                        replying: false,
                        replyContent: null,
                    });
                    this.animateLayout();
                }
            );
        } else {
        }
    }
    unmountingComponent() {
        Pickers.CleanAll();
    }
    sendAudioMessge(filename, duration, dontsend) {
        !this.state.audio && this.props.toggleAudio()
        if (!dontsend) {
            this.props.scrollToEnd();
            let message = {
                ...request.Message(),
                id: IDMaker.make(),
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
                this._resetTextInput();
                this.clearCaption()
                this.tags = null;
                this.focus();
                this.props.initialzeFlatList();
                this.animateLayout();
            });
        }
    }
    clearCaption() {
        this.setStatePure({
            newMessage: true,
            textValue: "",
            audioSouce: null,
            showCaption: false,
            audio: false,
            replying: false,
            replyContent: null,
        });
    }
    _onChange(event) {
        this.props.openOptions(true)
        let text = event.nativeEvent.text;
        this.setStatePure({ textValue: text || "" });
        if (text.split("@").length > 1) {
            this.setStatePure({
                tagging: true,
            });
        }
        this.props.setTyingState(this.props.sender);
        //  this.animateLayout();
    }
    imojiInput() {
        return (
            <ImojieSelector
                handleEmojiSelected={this.handleEmojiSelected.bind(this)}
            ></ImojieSelector>
        );
    }
    animateLayout(focus) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        let i = 0;
        this.animationInterval = setInterval(() => {
            if (i >= 5) {
                clearInterval(this.animationInterval);
                focus && this.focus();
            }
            this.props.adjutRoomDisplay();
            i = i + 1;
        }, 50);
    }
    handleEmojiSelected(e) {
        this.setStatePure({
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
        this.setStatePure({
            textValue: currentText.join("@"),
        });
        this.animateLayout();
    }
    componentDidUpdate(previousProps, prevState) {
        if (previousProps.members.length !== this.props.members.length) {
            this.formSerachableMembers()
        }
    }
    formSerachableMembers() {
        stores.TemporalUsersStore.getUsers(
            this.props.members ? this.props.members.map((ele) => ele && ele.phone) : [],
            [],
            (users) => {
                this.searchableMembers = users;
            }
        );
    }
    choseTagged(item){
        requestAnimationFrame(() => this.chooseItem(item))
    }
    searchableMembers = [];
    tagItem(item) {
        return (
            <TouchableOpacity
                onPress={() => this.choseTagged(item)}
            >
                <View style={{ width: 200, alignSelf: "flex-start" }}>
                    <ProfileSimple
                        onPress={() => this.choseTagged(item)}
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
        )
    }
    tagger() {
        return (
            <View
                style={{
                    width: "100%",
                    backgroundColor: ColorList.bottunerLighter,
                    borderTopLeftRadius: 5,
                    maxHeight: 150,
                    minHeight: 0,
                    borderTopRightRadius: 5,
                    padding: "2%",
                }}
            >
                <BleashupFlatList
                    fit
                    empty={() => {
                        this.setStatePure({
                            tagging: false,
                        });
                    }}
                    backgroundColor={"transparent"}
                    keyboardShouldPersistTaps={"always"}
                    firstIndex={0}
                    renderPerBatch={20}
                    initialRender={7}
                    keyExtractor={(ele) => ele && ele.phone}
                    dataSource={globalFunctions.returnUserSearch(
                        this.searchableMembers,
                        this.state.textValue && this.state.textValue.split("@").length > 1
                            ? this.state.textValue.split("@")[
                            this.state.textValue.split("@").length - 1
                            ]
                            : "~-pz"
                    )}
                    numberOfItems={this.searchableMembers.length}
                    renderItem={this.tagItem}
                ></BleashupFlatList>
            </View>
        );
    }
    cancleReply() {
        GState.reply = null;
        this.setStatePure({
            replying: false,
            replyContent: null,
        });
        this.props.adjutRoomDisplay();
        this.animateLayout();
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
                            : this.props.handleReply(replyer);
                    }}
                    pressingIn={() => { }}
                    showProfile={(pro) => this.props.showProfile(pro)}
                    reply={this.state.replyContent}
                ></ReplyText>
                <TouchableOpacity
                    onPress={() => requestAnimationFrame(this.cancleReply.bind(this))}
                    style={{
                        ...rounder(20, ColorList.bodyBackground),
                        position: "absolute",
                        marginRight: 6,
                        marginTop: 1,
                        alignSelf: "flex-end",
                    }}
                >
                    <EvilIcons
                        name={"close"}
                        type={"EvilIcons"}
                        style={{
                            fontSize: 17,
                            alignSelf: "center",
                        }}
                    />
                </TouchableOpacity>
            </View>
        );
    }
    focus() {
        this._textInput.focus();
    }
    blur() {
        this._textInput.blur();
    }
    starSendingRelation(item) {
        this.setStatePure({
            isSendingRelation: true,
            item,
            showCaption: true
        })
        this.focus()
    }
    replying(replyer, color) {
        replyer.activity_name = replyer.from_activity == this.props.roomID ? null : replyer.activity_name
        this.props.openOptions(true)
        this.setStatePure({
            loaded: true,
            replying: true,
            replyContent: replyer,
            replyerBackColor: color,
        });
        this.props.adjutRoomDisplay();
        this.animateLayout();
    }
    openCamera() {
        this.blur();
        Pickers.SnapPhoto("all").then((snap) => {
            this.concludePicking(snap)
        });
    }
    concludePicking(snap) {
        this.props.openOptions(true)
        let isVideo = snap.content_type.includes("video") ? true : false;
        this.setStatePure({
            video: snap.source,
            image: snap.source,
            audio: false,
            file: false,
            audioSouce: false,
            showCaption: true,
            imageSelected: isVideo ? false : true,
            filename: snap.filename,
            showVideo: isVideo ? true : false,
            content_type: snap.content_type,
            size: snap.size,
        });
        this.animateLayout();
        this.focusTimeout = setTimeout(() => {
            this.focus()
            clearTimeout(this.focusTimeout)
        }, 700)
    }
    _sendCaptionMessage() {
        if (this.state.isSendingRelation) {
            this.sendRelationMessage()
        } else if (this.state.file) {
            this.sendFileMessage();
        } else if (this.state.audioSouce) {
            this.sendAudioMessge(this.state.audioSouce, this.duration);
        } else {
            this.sendMedia();
        }
    }
    sendRelationMessage() {
        let message = request.Message()
        message = { ...message, ...this.state.item }
        message.reply = this.state.replyContent
        message.type = message_types.relation_message
        message.created_at = moment().format()
        message.tags = this.tags
        message.text = this.state.textValue
        message.sent = true
        message.id = IDMaker.make()
        message.updated_at = moment().format()
        message.committee_id = this.props.roomID
        this.props.initialzeFlatList()
        //this.props.scrollToEnd()
        Requester.sendMessage(message,
            this.props.roomID,
            this.props.roomID,
            this.props.activity_name).then(() => {
                this.setStatePure({
                    isSendingRelation: false,
                    showCaption: false,
                    replying: false,
                    replyContent: null,
                    textValue: ""
                })
            })
    }
    sendMedia() {
        this.props.scrollToEnd();
        let message = {
            ...request.Message(),
            id: IDMaker.make(),
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
        this.setStatePure({
            textValue: "",
            replyContent: null,
            replying: false,
            showEmojiInput: false,
            showCaption: false,
            showVideo: false,
        });
        this.animateLayout();
    }
    toggleAudioRecorder() {
        this.props.openOptions(true)
        this.props.toggleAudio()
        this.toggleAudioTimeout = setTimeout(() => {
            if (!this.props.showAudioRecorder) {
                this.refs.AudioRecorder.stopRecordSimple();
            } else {
                this.focus()
                this.refs.AudioRecorder.startRecorder();
            }
            clearTimeout(this.toggleAudioTimeout)
        }, 50);
        this.animateLayout();
    }
    sendAllPhoto(photos, index, completed) {
        if (index == photos.length) {
            completed()
        } else {
            stores.Messages.addMessageToStore(this.props.roomID, photos[index]).then(
                () => {
                    this.sendAllPhoto(photos, index + 1, completed)
                }
            );
        }
    }
    pickMultiplePhotos() {
        Pickers.TakeManyPhotos()
            .then((response) => {
                this.sendAllPhoto(response.map((res) => {
                    return {
                        ...request.Message(),
                        id: IDMaker.make(),
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

                }), 0, () => {
                    this.props.initialzeFlatList()
                });
            })
            .catch((error) => {
                console.warn(error);
            });
    }
    audioRecorder() {
        return (
            <View style={{
                margin: 2,
            }}>
                <AudioRecorder
                    room
                    sayRecording={this.props.sayRecording}
                    justHideMe={() => {
                        this.setStatePure({
                            showAudioRecorder: false,
                        });
                        this.refs.AudioRecorder.stopRecordSimple();
                    }}
                    showAudioRecorder={this.props.showAudioRecorder}
                    sendAudioMessge={(file, duration, dontsend) =>
                        this.sendAudioMessge(file, duration, dontsend)
                    }
                    ref={"AudioRecorder"}
                    toggleAudioRecorder={() => this.toggleAudioRecorder()}
                ></AudioRecorder>
            </View>
        );
    }
    toggleEmojiKeyboard() {
        this.props.openOptions(true)
        offset = this.state.replying ? 0.1 : 0;
        this.temp = GState.reply ? JSON.stringify(GState.reply) : null;
        GState.reply = null;
        Keyboard.dismiss();
        this.toggleTimeout = setTimeout(
            () => {
                this.props.showingImoji ? this.props.hideImoji() : this.props.showImoji()
                clearTimeout(this.toggleTimeout)
                this.props.adjutRoomDisplay(true);
            },
            this.state.keyboardOpened ? 200 : 0
        );
        this.animateLayout();
    }
    showAudio() {
        this.toggleAudioRecorder();
        this.props.adjutRoomDisplay();
    }
    tags = null;
    resetImoji() {
        this.toggleTimeout = setTimeout(() => {
            this.props.hideImoji()
            clearTimeout(this.toggleTimeout)
            //this.props.adjutRoomDisplay()
        }, 190);
        this.animateLayout();
    }
    hideCaption() {
        this.setStatePure({
            showCaption: false,
            audio: false,
            file: false,
            audioSouce: null,
        });
        this.animateLayout();
    }
    filename = "";
    async pickAudio() {
        this.blur();
        const res = await Pickers.TakeAudio();
        this.setStatePure({
            audioSouce: res.uri,
            showCaption: true,
            filename: res.name,
            size: res.size,
            file: false,
            audio: true,
        });
        this.filename = res.uri.split('/').pop()
        this.duration = 0;
        this.props.initialzeFlatList();
        this.animateLayout(true);
    }
    activateKeyboard() {
        this.activateKeyboardTimeout = setTimeout(() => {
            this.focus();
            clearTimeout(this.activateKeyboardTimeout)
        });
    }
    async pickFile() {
        this.blur();
        const res = await Pickers.TakeFile();
        this.setStatePure({
            showCaption: true,
            file: true,
            audio: false,
            type: res.type,
            filename: res.name,
            source: res.uri,
            size: typeof res.size == "function" ? res.size() : res.size,
        });
        this.animateLayout(true);
    }
    sendFileMessage() {
        this.props.scrollToEnd();
        message = {
            ...request.Message(),
            id: IDMaker.make(),
            source: this.state.source,
            file_name: this.state.filename,
            reply: this.state.replyContent,
            sender: this.props.sender,
            content_type: this.state.type,
            text: this.state.textValue,
            commitee_id: this.props.roomID,
            type: "attachement_upload",
            received: 0,
            total: this.state.size,
            created_at: moment().format(),
        };
        stores.Messages.addMessageToStore(this.props.roomID, message).then(
            (data) => {
                this.props.initialzeFlatList();
                this.clearCaption()
            }
        );
        this.animateLayout();
    }
    hideAudioCaption() {
        this.setStatePure({
            audio: false,
            audioSouce: false,
            showCaption: false,
        });
        this.animateLayout();
    }
    closeIcon() {
        return (
            <EvilIcons
                name="close"
                style={{
                    ...GState.defaultIconSize,
                    fontSize: 17,
                }}
                type={"EvilIcons"}
            />
        );
    }
    closeStyle = {
        position: "absolute",
        ...rounder(20,
            ColorList.bodyBackground),
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        alignSelf: "flex-end",
    };
    hideFileCaption() {
        this.setStatePure({
            showCaption: false,
            file: false,
            filename: null,
            source: null,
        });
        this.animateLayout();
    }
    endCamera() {
        this.setStatePure({
            isCameraOpened: false
        })
    }
    showMedia() {
        return this.state.file ? (
            <View>
                <FilePreview
                    filename={this.state.filename}
                    source={this.state.source}
                    size={this.state.size}
                ></FilePreview>
                <TouchableOpacity
                    onPress={() => this.hideFileCaption()}
                    style={this.closeStyle}
                >
                    {this.closeIcon()}
                </TouchableOpacity>
            </View>
        ) : this.state.audio ? (
            <View>
                <AudioFilePreviewer
                    filename={this.state.filename}
                    size={this.state.size}
                    source={this.state.audioSouce}></AudioFilePreviewer>
                <TouchableOpacity
                    onPress={() => this.hideAudioCaption()}
                    style={this.closeStyle}
                >
                    {this.closeIcon()}
                </TouchableOpacity>
            </View>
        ) : <PhotoPreview
            image={this.state.image}
            openedKeyboard={this.props.openedKeyboard}
            timeToDissmissKeyboard={this.props.timeToDissmissKeyboard}
            showVideo={this.state.showVideo}
            video={this.state.video}
            hideCaption={this.hideCaption.bind(this)}>
                </PhotoPreview>
    }
    showSnapper() {
        Keyboard.dismiss()
        setTimeout(() => {
            BeNavigator.pushTo("CameraScreen", {
                callback: (souce) => setTimeout(() => this.concludePicking(souce),
                    this.props.openedKeyboard() ? this.props.timeToDissmissKeyboard : 400),
                directReturn: false,
                openGallery: () => setTimeout(() => this.openCamera(), 100)
            })
        }, this.props.openedKeyboard() ? this.props.timeToDissmissKeyboard : 0)
    }
    showOptionsModal() {
        this.setStatePure({
            isOptionsOpened: true
        })
    }
    keyBoardActionContainer = {
        width: 20,
        position: "absolute",
        height: 20,
        bottom: 10,
        right: 2,
    }
    attemptAudio() {
        Vibrator.vibrateShort()
        Toaster({ "text": Texts.press_long_to_record })
    }
    hideRelation() {
        this.setStatePure({
            isSendingRelation: false,
            showCaption: false
        })
    }
    displayRelation() {
        return <View style={{ marginHorizontal: '1%', }}>
            <RelationMessage
                compose
                message={this.state.item}
                onPress={this.props.showRelation}
            ></RelationMessage>
            <TouchableOpacity
                onPress={() => requestAnimationFrame(this.hideRelation.bind(this))}
                style={{
                    ...rounder(20, ColorList.bodyBackground),
                    position: "absolute",
                    marginRight: 6,
                    marginTop: 1,
                    alignSelf: "flex-end",
                }}
            >
                <EvilIcons
                    name={"close"}
                    type={"EvilIcons"}
                    style={{
                        fontSize: 17,
                        alignSelf: "center",
                    }}
                />
            </TouchableOpacity>
        </View>
    }
    render() {
        this.canUseAudio = !this.state.textValue &&
            !this.props.showAudioRecorder &&
            !this.state.showCaption &&
            !this.state.isSendingRelation
        return (
            <View>
                <View
                    style={{
                        alignItems: "center",
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        //minHeight: 20,
                        alignSelf: 'flex-end',
                        borderColor: "gray",
                        padding: "1%",
                        width: "99%",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            marginBottom: 5,
                            alignSelf: "center",
                            width: "100%",
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => requestAnimationFrame(() => this.showSnapper() //this.openCamera()
                            )}
                            style={{
                                width: 45,
                                alignSelf: "flex-end",
                                bottom: 2,
                            }}
                        >
                            <View
                                style={{
                                    alignItems: "center",
                                    ...rounder(40, ColorList.bodyBackground),
                                }}
                            >
                                <MaterialIconCommunity
                                    style={{
                                        color: ColorList.indicatorColor,
                                        fontSize: 30,
                                    }}
                                    type={"MaterialCommunityIcons"}
                                    name={"camera"}
                                />
                            </View>
                        </TouchableOpacity>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "column",
                                borderRadius: 35,
                                ...shadower(2),
                                minHeight: 20,
                                maxHeight: 500,
                                backgroundColor: ColorList.bodyBackground,
                                borderTopLeftRadius:
                                    this.state.replying ||
                                        this.state.tagging ||
                                        this.props.showAudioRecorder ||
                                        this.state.showCaption
                                        ? 5
                                        : 35,
                                borderTopRightRadius:
                                    this.state.replying ||
                                        this.state.tagging ||
                                        this.props.showAudioRecorder ||
                                        this.state.showCaption
                                        ? 5
                                        : 35,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => requestAnimationFrame(() => this.toggleEmojiKeyboard()//this.openCamera()
                                )}
                                style={
                                    {
                                        ...this.keyBoardActionContainer,
                                        right: null,
                                        width: 25,
                                        bottom: 9,
                                        height: 25,
                                        paddingTop: 3,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        left: 7
                                    }}
                            >
                                <Entypo
                                    style={{
                                        color: ColorList.likeActive,
                                        alignSelf: "flex-end",
                                        fontSize: 25,
                                    }}
                                    type="Entypo"
                                    name="emoji-flirt"
                                />
                            </TouchableOpacity>
                            {
                                //* Reply Message caption */
                                this.state.replying ? this.replyMessageCaption() : null
                            }
                            {
                                this.state.isSendingRelation ? this.displayRelation() : null
                            }
                            {this.state.showCaption && !this.state.isSendingRelation ? this.showMedia() : null}
                            {
                                //* Tagger component @Giles e.g *//
                                this.state.tagging ? this.tagger() : null
                            }
                            {
                                // ******************** Audio Recorder Input ************************//

                                this.audioRecorder()
                            }
                            <GrowingInput
                                dontShowKeyboard={this.props.dontShowKeyboard}
                                onFocus={this.resetImoji.bind(this)}
                                _onChange={this._onChange.bind(this)}
                                animateLayout={() =>
                                    this.animateLayout()
                                }
                                textValue={this.state.textValue}
                                ref={(r) => {
                                    this._textInput = r;
                                }}
                            ></GrowingInput>
                            {this.state.textValue.length <= 0 ? <TouchableOpacity
                                style={{ ...this.keyBoardActionContainer, bottom: 15 }}
                                onPress={() =>
                                    requestAnimationFrame(() => {
                                        this.props.openOptions()
                                    })
                                }
                            >
                                <Ionicons
                                    style={{
                                        color: ColorList.indicatorColor,
                                        fontSize: 30,
                                    }}
                                    type={"Ionicons"}
                                    name={this.props.showOptions ? "ios-close" : "ios-add"}
                                />
                            </TouchableOpacity> : null}
                        </View>
                        <TouchableOpacity
                            style={{
                                width: 45,
                                alignSelf: "flex-end",
                                alignItems: "center",
                                bottom: 2,
                            }}
                            onLongPress={() => this.canUseAudio && this.showAudio()}
                            onPress={() =>
                                requestAnimationFrame(() => {
                                    this.canUseAudio
                                        ? this.attemptAudio()
                                        : this.sendMessageText(this.state.textValue);
                                })
                            }
                        >
                            <View
                                style={{
                                    alignSelf: "flex-end",
                                    ...rounder(40, ColorList.descriptionBody),
                                    alignItems: "center",
                                }}
                            >
                                {!this.state.textValue &&
                                    !this.props.showAudioRecorder &&
                                    !this.state.showCaption ? (
                                        <MaterialIcons
                                            style={{
                                                color: ColorList.indicatorColor,
                                                fontSize: 30,
                                                alignSelf: "center",
                                            }}
                                            name={"keyboard-voice"}
                                        />
                                    ) : (
                                        <Ionicons
                                            style={{
                                                color: ColorList.indicatorColor,
                                                fontSize: 30,
                                                alignSelf: "center",
                                            }}
                                            name="md-send"
                                            type="Ionicons"
                                        />
                                    )}
                            </View>
                        </TouchableOpacity>
                    </View>
                    {
                        // ***************** Emoji keyBoard Input ***********************//
                        this.props.showingImoji ? this.imojiInput() : null
                    }
                </View>
            </View>
        );
    }
}
