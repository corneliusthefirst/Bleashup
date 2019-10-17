
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
import BarIndicat from '../../BarIndicat';
import { BarIndicator } from "react-native-indicators"
let dirs = rnFetchBlob.fs.dirs
const { fs, config } = rnFetchBlob
const AppDir = rnFetchBlob.fs.dirs.SDCardDir + '/Bleashup'
export default class AudioMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: 0,
            currentPosition: 0,
            currentTime: 0,
            downloadState: 0,
            downloading: true
        }
    }
    setAfterSuccess(path) {
        this.props.message.source = Platform.OS === 'android' ? path + "/" : '' + path
        stores.ChatStore.addStaticFilePath(this.props.message.source, '').then(() => {
            this.initialisePlayer(this.props.message.source)
            this.setState({
                loaded: true
            })
        })
    }
    DetemineRange(path) {
        return new Promise((resolve, reject) => {
            fs.exists(path).then(ext => {
                if (ext) {
                 //   console.warn("exists")
                    fs.stat(path).then(stat => resolve(stat.size))
                } else {
                    resolve(0)
                }
            })
        })
    }
    path = AppDir + '/Sound/' + this.props.message.file_name
    duration = 10
    pattern = [1000, 0, 0]
    tempPath = this.path + '.download'
    download(url) {
        clearInterval(this.downloadID)
        GState.downlading = true
        this.setState({
            downloading: true
        })
        this.DetemineRange(this.tempPath).then(size => {
            this.task = rnFetchBlob.config({
                fileCache: true
            }).fetch('GET', url, {
                Range: `bytes=${size}-`,
                From: `${size}`
            })
            this.task.progress((received, total) => {
                let newReceived = parseInt(size) + parseInt(received);
                let newTotal = this.props.message.total > 0 ? this.props.message.total : total
                newTotal = parseInt(newTotal)
                this.setState({
                    downloadState: (newReceived / newTotal) * 100,
                    total: newTotal, received: newReceived
                })
            })
            this.task.catch(error => {
                GState.downlading = false
                console.warn(error)
                this.setState({
                    downloading: false,
                    error: true
                })
            })
            this.task.then((res) => {
                temp1 = this.state.received / 1000
                temp2 = this.state.total / 1000
                temper1 = temp2 / 1000
                temper2 = temp1 / 1000
                temp1 = Math.floor(temper1)
                temp2 = Math.floor(temper2)
                temp3 = Math.ceil(temper2)
                GState.downlading = false
              //  console.warn(temper1, temper2)
                if (temp1 == temp2 || temp1 == temp3) {
                    this.props.message.duration = Math.floor(res.info().headers.Duration)
                    fs.appendFile(this.tempPath, res.path(), 'uri').then(() => {
                        fs.unlink(this.path)
                        fs.appendFile(this.path, this.tempPath, 'uri').then(() => {
                            fs.unlink(this.tempPath)
                            fs.unlink(res.path())
                            //this.props.message.source = "file://" + this.path
                            this.setAfterSuccess(this.path, temper1, temper2)
                        })
                    })
                } else {
                    fs.appendFile(this.tempPath, res.path(), 'uri').then(() => {
                        fs.unlink(res.path())
                        this.props.message.received = this.state.received
                        this.props.message.total = this.state.total
                        stores.ChatStore.addAudioSizeProperties(this.state.total, this.state.received)
                        this.setState({})
                    })
                }
            })
        })
    }
    downloadID = null
    downloadAudio(url) {
        this.downloadID = setInterval(() => {
            this.download(url)
        }, 500)
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
        this.setState({
            duration: null,
            currentPosition: 0,
            playing: false,
            received: this.props.message.received,
            total: this.props.message.total,
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            creator: (this.props.message.sender.phone == this.props.creator)
        })
        setTimeout(() => {
            if (this.testForURL(this.props.message.source)) {
                if (!this.props.message.cancled)
                    this.downloadAudio(this.props.message.source)
            }else{
                this.initialisePlayer(this.props.message.source)
            }
        }, 1000)
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
    cancelDownLoad(url) {
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
        textStyleD = {
            width: "80%", margin: '4%', marginTop: "5%", display: 'flex', alignSelf: 'center',
            flexDirection: 'column',
        }
        return (
            <View style={{ disply: 'flex', flexDirection: 'row', width: 300, }}>
               {this.props.message.duration? <View style={textStyle}>
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
                </View> :<View style={{textStyleD}}>{!this.state.playing ? <BarIndicat animating={false} 
                        color={"#1FABAB"} size={30} count={20} ></BarIndicat> : <BarIndicator color={"#1FABAB"} size={30} count={20}></BarIndicator>}</View>}
                <View style={{ marginTop: this.props.message.duration? "3%":'0%',}}>
                    <AnimatedCircularProgress
                        size={40}
                        width={3}
                        fill={this.testForURL(this.props.message.source) ? this.state.downloadState : 100}
                        tintColor={"#1FABAB"}
                        backgroundColor={'#F8F7EE'}>
                        {
                            (fill) => (
                                <View style={{ marginTop: "-5%" }}>
                                    {this.testForURL(this.props.message.source) ?
                                        <TouchableOpacity onPress={() => this.state.downloading ? this.cancelDownLoad(this.props.message.source) :
                                            this.downloadAudio(this.props.message.source)}>
                                            <View>
                                                <Icon style={{ color: "#0A4E52" }} type="EvilIcons"
                                                    name={this.state.downloading ? "close" : "arrow-down"}></Icon>
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
