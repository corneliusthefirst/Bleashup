import React, { Component } from 'react';
import { PulseIndicator } from 'react-native-indicators';
import { Text, Right, Icon, Left,Toast} from 'native-base';
import { View, TouchableOpacity, PermissionsAndroid, BackHandler, Platform } from 'react-native';
import SoundRecorder from 'react-native-sound-recorder';
import converToHMS from '../highlights_details/convertToHMS';
import rnFetchBlob from 'rn-fetch-blob';

let dirs = rnFetchBlob.fs.dirs
export default class AudioRecorder extends Component{
    constructor(props){
        super(props)
        this.state = {
            recordTime:0,
            recording:true
        }
        this.BackHandler = null
    }
    componentWillMount(){
        if (this.BackHandler) this.BackHandler.remove()
        this.BackHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this))
    }
    stopRecordTiming() {
        clearInterval(this.recordInterval)
    }
    handleBackButton(){
        if (this.props.showAudioRecorder) {
            this.stopRecordTiming()
            SoundRecorder.stop().then(() => {
                this.setState({
                    recordTime: 0,
                    recording: false,
                    showAudioRecorder: false
                })
            })
            return true
        }
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
                    this.startRecordTiming()
                }).catch(error => {
                    //console.warn(error)
                    Toast.show({ duration: 4000, text: "cannot record due to " + error })
                    this.setState({ recording: false, recordTime: 0 })
                    this.props.toggleAudioRecorder()
                    this.stopRecordTiming()
                    SoundRecorder.stop().then(() => {

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
    filename = dirs.DocumentDir + "/test.mp3"
    componentWillUnmount(){
        SoundRecorder.stop().then(() => {
            this.BackHandler.remove()
        })
    }
    _stopRecoder() {
        this.stopRecordTiming()
        SoundRecorder.stop()
            .then((result) => {
                this.duration = Math.ceil(result.duration / 1000)
                this.props.sendAudioMessge(this.filename,this.duration)
            });
    }
    stopRecordSimple(){
        this.stopRecordTiming()
        SoundRecorder.stop().then(() => {
            this.setState({
                recording:false,
                recordTime:0
            })
        })
    }
    duration = 0
    stopRecord() {
        this.setState({
            recording: !this.state.recording,
            showAudioRecorder: false,
            recordTime: 0
        })
        this._stopRecoder()
    }
    pauseRecorder() {
        this.stopRecordTiming()
        SoundRecorder.pause().then(() => {
            this.setState({
                recording: false,
            })
        })
    }
    startRecordTiming() {
        this.recordInterval = setInterval(() => {
            this.setState({
                recordTime: this.state.recordTime + 1
            })
        }, 1000)
    }
    resumAudioRecoder() {
        this.startRecordTiming()
        SoundRecorder.resume().then(() => {
            this.setState({
                recording: true
            })
        })
    }
    state = {}
    audioRecorder() {
        return <View style={{
            position: "absolute", width: '87%', opacity: 0.97,
            // marginTop: "1%",
            backgroundColor: '#5CB99E', height: 50, display: 'flex', flexDirection: 'row',
            marginLeft: 2, borderRadius: 10,
        }}><Left><TouchableOpacity onPress={() => this.props.toggleAudioRecorder()}><Icon type={'EvilIcons'} 
        name={'close'} style={{ color: "#FEFFDE" }}></Icon>
        </TouchableOpacity></Left>{this.state.recording ? 
            <View style={{ marginLeft: "-40%", marginTop: "1.8%", display: 'flex', flexDirection: 'row', }}>
            <Icon type={"Entypo"} onPress={() => this.stopRecord()} name={"controller-stop"} style={{ color: "#FEFFDE", fontSize: 35, }}></Icon>
            <Icon type={"FontAwesome"} name={"pause"} onPress={() => this.pauseRecorder()} style={{ marginTop: "5%", marginLeft: "10%", color: "#FEFFDE", fontSize: 26, }}></Icon>
        </View> :
         <View style={{ marginLeft: "-40%", marginTop: "1.8%", display: 'flex', flexDirection: 'row', }}>
                <Icon type={"Entypo"} onPress={() => this.resumAudioRecoder()} name={"controller-record"} style={{ color: "#FEFFDE", fontSize: 35, }}></Icon>
            </View>}
            <Right><View style={{ display: 'flex', flexDirection: 'row', marginLeft: "30%", }}>
                <Text style={{ marginTop: "6%", fontSize: 22, color: "#FEFFDE" }}>
                    {converToHMS(this.state.recordTime)}</Text>
                <PulseIndicator color={'red'}>
                </PulseIndicator></View></Right></View>;
    }
    render(){
        return this.props.showAudioRecorder?this.audioRecorder():false
    }
}