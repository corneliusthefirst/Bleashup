import React, { Component } from "react";
import { PulseIndicator } from "react-native-indicators";
import {
    View,
    Text,
    TouchableOpacity,
    PermissionsAndroid,
    BackHandler,
    Platform,
} from "react-native";
import SoundRecorder from "react-native-sound-recorder";
import converToHMS from "../highlights_details/convertToHMS";
import rnFetchBlob from "rn-fetch-blob";
import ColorList from "../../colorList";
import BeComponent from "../../BeComponent";
import Toaster from "../../../services/Toaster";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import GState from "../../../stores/globalState";
import emitter from "../../../services/eventEmiter";
import shadower from "../../shadower";
import rounder from "../../../services/rounder";
import Texts from '../../../meta/text';
import { AppDir } from "../../../stores/globalState/globalState";
let dirs = rnFetchBlob.fs.dirs;
export default class AudioRecorder extends BeComponent {
    constructor(props) {
        super(props);
        this.state = {
            recordTime: 0,
            recording: true,
            font: 22,
            numberOfLines: 1
        };
        this.BackHandler = null;
    }
    componentMounting() { }
    stopRecordTiming() {
        clearInterval(this.recordInterval);
    }
    playingEvent = "playing";
    pausePLayingAudio() {
        emitter.emit(this.playingEvent);
    }
    startRecorder() {
        this.pausePLayingAudio();
        let recordAudioRequest;
        if (Platform.OS == "android") {
            recordAudioRequest = this._requestRecordAudioPermission();
        } else {
            recordAudioRequest = new Promise(function (resolve, reject) {
                resolve(true);
            });
        }

        recordAudioRequest.then((hasPermission) => {
            if (!hasPermission) {
                console.warn("permission denied!!!");
                return;
            }
            console.warn(this.filename)
            SoundRecorder.start(this.filename)
                .then(() => {
                    this.startRecordTiming();
                })
                .catch((error) => {
                    this.props.justHideMe();
                    Toaster({ duration: 4000, text: Texts.lang + error });
                });
        });
    }

    async _requestRecordAudioPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: Texts.microphone_permission,
                    message: Texts.beup_needs_to_record,
                    buttonNeutral: Texts.ask_me_later,
                    buttonNegative: Texts.cancel,
                    buttonPositive: "OK",
                }
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
    filename = AppDir + '/Sound' + "/test.mp3";
    unmountingComponent() {
        SoundRecorder.stop().catch(() => { });
    }
    _stopRecoder(dontsend) {
        this.stopRecordTiming();
        SoundRecorder.stop().then((result) => {
            this.duration = Math.ceil(result.duration / 1000);
            this.props.sendAudioMessge(this.filename, this.duration, dontsend);
        });
    }
    stopRecordSimple() {
        this.stopRecordTiming();
        SoundRecorder.stop().then(() => {
            this.setStatePure({
                //recording:false,
                recordTime: 0,
            });
        });
    }
    duration = 0;
    stopRecord(dontsend) {
        this.setStatePure({
            //recording: !this.state.recording,
            showAudioRecorder: false,
            recordTime: 0,
        });
        this._stopRecoder(dontsend);
    }
    pauseRecorder() {
        this.stopRecordTiming();
        SoundRecorder.pause().then(() => {
            this.setStatePure({
                recording: false,
            });
        });
    }
    startRecordTiming() {
        this.recordInterval = setInterval(() => {
            this.setStatePure({
                recordTime: this.state.recordTime + 1,
            });
            this.props.sayRecording && this.props.sayRecording()
        }, 1000);
    }
    resumAudioRecoder() {
        this.startRecordTiming();
        SoundRecorder.resume().then(() => {
            this.setStatePure({
                recording: true,
            });
        });
    }
    adjusFontSize(e) {
        const { lines } = e.nativeEvent;
        if (lines.length > this.state.numberOfLines) {
            this.setStatePure({
                font: this.state.font - 1,
            });
        }
    }
    state = {};
    audioRecorder() {
        return (
            <View
                style={{
                    flex: this.props.room ? null : 1,
                    width: this.props.room ? "100%" : null,
                    alignSelf: "center",
                    backgroundColor: ColorList.recorderColor,
                    maxHeight: 50,
                    ...shadower(2),
                    height: this.props.room ? 40 : null,
                    flexDirection: "row",
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    alignItems: "center",
                }}
            >
                <View style={{
                    width: 50,
                    alignSelf: 'center',
                    margin: '2%',
                }}>
                    <TouchableOpacity style={{
                        ...rounder(35, ColorList.descriptionBody),
                        justifyContent: 'center',
                    }} onPress={() => this.props.toggleAudioRecorder()}>
                        <EvilIcons
                            type={"EvilIcons"}
                            name={"close"}
                            style={{
                                ...GState.defaultIconSize,
                                color: ColorList.indicatorColor,
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        width: 60,
                        alignItems: "center",
                        flexDirection: "row",
                        marginRight: '8%',
                    }}
                >
                    {this.state.recording ? (
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Entypo
                                onPress={() => this.stopRecord()}
                                name={"controller-stop"}
                                style={{ color: ColorList.bodyBackground, fontSize: 35 }}
                            />
                            <FontAwesome
                                name={"pause"}
                                onPress={() => this.pauseRecorder()}
                                style={{ color: ColorList.bodyBackground, fontSize: 26 }}
                            />
                        </View>
                    ) : (
                            <TouchableOpacity
                                onPress={() => this.resumAudioRecoder()}
                                style={{ display: "flex", flexDirection: "row" }}
                            >
                                <Entypo
                                    name={"controller-record"}
                                    style={{
                                        color: ColorList.bodyBackground,
                                        fontSize: 35
                                    }}
                                />
                            </TouchableOpacity>
                        )}
                </View>
                <View

                    style={{
                        alignSelf: "flex-end",
                        flex: 1,
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Text numberOfLines={this.state.numberOfLines}
                        onTextLayout={this.adjusFontSize.bind(this)}
                        style={{
                            fontSize: this.state.font,
                            flex: 1,
                            color: ColorList.bodyBackground
                        }}>
                        {converToHMS(this.state.recordTime)}
                    </Text>
                    <View>
                        <PulseIndicator color={"red"}></PulseIndicator>
                    </View>
                </View>
            </View>
        );
    }
    render() {
        return this.props.showAudioRecorder ? this.audioRecorder() : false;
    }
}
