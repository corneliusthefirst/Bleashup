import React, { Component } from 'react';
import { PulseIndicator } from 'react-native-indicators';
import { View, Text, TouchableOpacity, PermissionsAndroid, BackHandler, Platform } from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';
import converToHMS from '../highlights_details/convertToHMS';
import rnFetchBlob from 'rn-fetch-blob';
import ColorList from '../../colorList';
import BeComponent from '../../BeComponent';
import Toaster from '../../../services/Toaster';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import GState from '../../../stores/globalState';
import emitter from '../../../services/eventEmiter';
import shadower from '../../shadower';
let dirs = rnFetchBlob.fs.dirs
export default class AudioRecorder extends BeComponent {
    constructor(props) {
        super(props)
        this.state = {
            recordTime: 0,
            recording: true
        }
        this.BackHandler = null
    }
    componentMounting() {
    }
    stopRecordTiming() {
        clearInterval(this.recordInterval)
    }
    playingEvent = "playing"
    pausePLayingAudio() {
        emitter.emit(this.playingEvent)
    }
    startRecorder() {
        this.pausePLayingAudio()
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
                    this.startRecordTiming()
                }).catch(error => {
                    this.props.justHideMe()
                    Toaster({ duration: 4000, text: "cannot record due to " + error })
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
    filename = dirs.DocumentDir + "/test.mp3"
    unmountingComponent() {
        SoundRecorder.stop().catch(() => {

        })
    }
    _stopRecoder(dontsend) {
        this.stopRecordTiming()
        SoundRecorder.stop()
            .then((result) => {
                this.duration = Math.ceil(result.duration / 1000)
                this.props.sendAudioMessge(this.filename, this.duration, dontsend)
            });
    }
    stopRecordSimple() {
        this.stopRecordTiming()
        SoundRecorder.stop().then(() => {
            this.setStatePure({
                //recording:false,
                recordTime: 0
            })
        })
    }
    duration = 0
    stopRecord(dontsend) {
        this.setStatePure({
            //recording: !this.state.recording,
            showAudioRecorder: false,
            recordTime: 0
        })
        this._stopRecoder(dontsend)
    }
    pauseRecorder() {
        this.stopRecordTiming()
        SoundRecorder.pause().then(() => {
            this.setStatePure({
                recording: false,
            })
        })
    }
    startRecordTiming() {
        this.recordInterval = setInterval(() => {
            this.setStatePure({
                recordTime: this.state.recordTime + 1
            })
        }, 1000)
    }
    resumAudioRecoder() {
        this.startRecordTiming()
        SoundRecorder.resume().then(() => {
            this.setStatePure({
                recording: true
            })
        })
    }
    state = {}
    audioRecorder() {
        return <View style={{
            flex: this.props.room ? null : 1,
            width: this.props.room ? "100%" : null,
            alignSelf: 'center',
            backgroundColor: ColorList.recorderColor,
            maxHeight: 50,
            height: this.props.room ? 40 : null,
            flexDirection: 'row',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            justifyContent: 'space-between',
        }}><View style={{ alignSelf: 'flex-start', marginTop: '3.8%', }}><TouchableOpacity onPress={() => this.props.toggleAudioRecorder()}><EvilIcons type={'EvilIcons'}
            name={'close'} style={{ ...GState.defaultIconSize, color: ColorList.bodyBackground }} />
        </TouchableOpacity></View>{this.state.recording ?
            <View style={{ marginTop: "1.8%", display: 'flex', flexDirection: 'row', }}>
                <Entypo onPress={() => this.stopRecord()} name={"controller-stop"} style={{ color: ColorList.bodyBackground, fontSize: 35, }} />
                <FontAwesome name={"pause"} onPress={() => this.pauseRecorder()} style={{ marginTop: "5%", marginLeft: "10%", color: ColorList.bodyBackground, fontSize: 26, }} />
            </View> :
            <TouchableOpacity onPress={() => this.resumAudioRecoder()} style={{ marginTop: "1.8%", display: 'flex', flexDirection: 'row', }}>
                <Entypo name={"controller-record"} style={{ color: ColorList.bodyBackground, fontSize: 35, }} />
            </TouchableOpacity>}
            <View style={{ alignSelf: 'flex-end', }}><View style={{ display: 'flex', flexDirection: 'row', marginLeft: "30%", }}>
                <Text style={{ marginTop: "1.8%", fontSize: 22, color: ColorList.bodyBackground }}>
                    {converToHMS(this.state.recordTime)}</Text>
                <PulseIndicator color={'red'}>
                </PulseIndicator></View></View></View>;
    }
    render() {
        return this.props.showAudioRecorder ? this.audioRecorder() : false
    }
}