
import React, { Component } from 'react';

import {
    StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Slider, Vibration, Platform
} from 'react-native';
import Sound from 'react-native-sound';
import rnFetchBlob from 'rn-fetch-blob';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon, Right, Spinner, Toast } from 'native-base';
import stores from '../../../stores';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import GState from '../../../stores/globalState';
import * as config from "../../../config/bleashup-server-config.json"
let dirs = rnFetchBlob.fs.dirs
const { fs } = rnFetchBlob
export default class AudioUploader extends Component {
    constructor(props) {
        super(props);
        this.uploadURL = config.file_server.protocol +
            "://" + config.file_server.host + ":" + config.file_server.port + "/sound/save"
        this.baseURL = config.file_server.protocol +
            "://" + config.file_server.host + ":" + config.file_server.port + '/sound/get/'
        this.state = {
            duration: 0,
            currentPosition: 0,
            loaded:false,
            currentTime: 0,
            downloadState: 0,
            downloading: true
        }
    }

    upload(url) {
        fs.exists(this.props.message.source).then(state => {
            this.task = rnFetchBlob.fetch("POST", this.uploadURL, {
                'content-type': 'multipart/form-data',
            }, [{
                name: "file",
                filename: this.props.message.file_name,
                type: this.props.message.content_type,
                data: rnFetchBlob.wrap(this.props.message.source)
            }])
            this.task.uploadProgress((writen, total) => {
                this.setState({
                    total: parseInt(total),
                    received: parseInt(writen),
                    uploadState: (parseInt(writen) / parseInt(total)) * 100
                })
            })
            this.task.then(response => {
                if (response.data) {
                    newDir = fs.dirs.DocumentDir + "/audio_" + response.data
                    fs.writeFile(newDir, this.props.message.source.split(`file://`)[1], 'uri').then(() => {
                        this.setState({
                            uploadState: 100,
                            loaded: true
                        })
                        this.initialisePlayer(newDir)
                        this.props.message.type = 'audio'
                        this.props.message.source = newDir
                        this.props.message.temp = this.baseURL + response.data
                        this.props.message.received = 0
                        this.props.message.file_name = response.data
                        this.props.replaceMessage(this.props.message)
                    })
                }
            })
            this.task.catch((error) => {
                console.warn(error)
            })
        })
    }
    downloadID = null
    uploadAudio(url) {
            this.upload(url)
    }
    testForURL(url) {
        let test = url.includes("http://")
        let test2 = url.includes("https://")
        return test || test2
    }
    initialisePlayer(source) {
        this.player = new Sound(source, '/', (error) => {
            console.warn(error, '-------')
        })
    }
    player = null
    componentDidMount() {
        //  console.warn(dirs.DocumentDir)
        this.setState({
            duration: this.props.message.duration,
            currentPosition: 0,
            playing: false,
            received: this.props.message.received,
            total: this.props.message.total,
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            creator: (this.props.message.sender.phone == this.props.creator)
        })
        this.uploadAudio(this.props.message.source)
    }
    pause() {
        this.setState({
            playing: false
        })
        this.player.pause()
    }
    task = null
    previousTime = 0
    plays() {
        this.setState({
            playing: true
        })
        if (this.props.message.duration) {
            let refreshID = setInterval(() => {
                this.player.getCurrentTime(time => {
                    //console.warn(time)
                    if (this.previousTime == time) clearInterval(refreshID)
                    else {
                        this.previousTime = time
                        this.setState({
                            currentPosition: time / this.props.message.duration,
                            currentTime: time
                        })
                    }
                })
            }, 1000)
        }
        this.player.play((success) => {
            if (success) {
                this.player.getCurrentTime((seconds) => {
                    this.props.message.duration = Math.floor(seconds)
                    this.setState({
                        playing: false,
                        currentPosition: seconds / this.props.message.duration,
                        currentTime: seconds
                    })
                    stores.ChatStore.addDuration(seconds).then(status => {
                        //this.player.release()
                    })
                })
            }
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
    showProgress() {
        if (this.props.message.duration) {
            this.setState({
                showProgress: true
            })
            setTimeout(() => {
                this.setState({ showProgress: false })
            }, 5000)
        }
    }
    cancelUpLoad(url) {
        this.task.cancel((err, taskID) => {
        })
        stores.ChatStore.SetCancledState()
        this.setState({
            downloading: false
        })
    }
    render() {
        textStyle = {
            width: "80%", margin: '2%', marginTop: "5%", display: 'flex', alignSelf: 'center',
            flexDirection: 'column',
        }
        return (
            <View style={{ disply: 'flex', flexDirection: 'row', width: 300, }}>
                <View style={textStyle}>
                    <View><Slider value={this.state.currentPosition} onValueChange={(value) => {
                        this.player.setCurrentTime(value * this.props.message.duration)
                        this.setState({
                            currentPosition: value,
                            currentTime: value * this.props.message.duration
                        })
                    }}></Slider>
                        <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'space-between', }}>
                            <Text>{this.convertToHMS(Math.floor(this.state.currentTime))}</Text>
                            <Right><Text>{this.convertToHMS(this.props.message.duration)}</Text></Right>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: "3%", }}>
                    <AnimatedCircularProgress
                        size={40}
                        width={3}
                        fill={this.state.uploadState}
                        tintColor={"#1FABAB"}
                        backgroundColor={'#F8F7EE'}>
                        {
                            (fill) => (
                                <View style={{ marginTop: "-5%" }}>
                                    {!this.state.loaded ?
                                        <TouchableOpacity onPress={() => this.state.downloading ? this.cancelUpLoad(this.props.message.source) :
                                            this.uploadAudio(this.props.message.source)}>
                                            <View>
                                                <Icon style={{ color: "#0A4E52" }} type="EvilIcons"
                                                    name={this.state.downloading ? "close" : "arrow-up"}></Icon>
                                            </View>
                                            <View style={{ position: 'absolute', marginTop: '-103%', marginLeft: '-14%', }}>
                                                {this.state.downloading ? <Spinner></Spinner> : null}
                                            </View>
                                        </TouchableOpacity> : !this.state.playing ? <TouchableOpacity
                                            onPress={() => requestAnimationFrame(() => this.plays())}>
                                            <Icon type="FontAwesome5" style={{ color: "#0A4E52", fontSize: 20 }} name="play">
                                            </Icon>
                                        </TouchableOpacity> : <TouchableOpacity onPress={() => requestAnimationFrame(() => this.pause())}>
                                                <Icon type="FontAwesome5" style={{ color: "#0A4E52", fontSize: 20 }} name="pause">
                                                </Icon>
                                            </TouchableOpacity>}
                                </View>
                            )
                        }
                    </AnimatedCircularProgress></View>
            </View>
        );
    }
}
