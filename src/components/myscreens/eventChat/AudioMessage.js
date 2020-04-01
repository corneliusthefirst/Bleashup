
import React, { Component } from 'react';

import {
    StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Slider, Vibration, Platform
} from 'react-native';
import Sound from 'react-native-sound';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon, Right, Spinner, Toast } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import GState from '../../../stores/globalState';
import BarIndicat from '../../BarIndicat';
import { BarIndicator } from "react-native-indicators"
import testForURL from '../../../services/testForURL';
import converToHMS from '../highlights_details/convertToHMS';
import FileExachange from '../../../services/FileExchange';
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
    componentWillUnmount() {
        this.player && this.player.stop()
        clearInterval(this.downloadID)
    }
    componentDidMount() {
        console.warn(this.props.message.source)
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
        this.exchanger = new FileExachange(this.props.message.source,
            this.path, this.state.total, this.state.received,
            this.progress.bind(this),
            this.success.bind(this),
            this.onFail.bind(this),
            this.onError.bind(this))
        setTimeout(() => {
            if (testForURL(this.props.message.source)) {
                !this.props.message.cancled ?
                    this.downloadAudio(this.props.message.source)
                    : this.setState({
                        downloading: false
                    })
            } else {
                this.initialisePlayer(this.props.message.source)
            }
        }, 1000)
    }
    setAfterSuccess(path) {
        GState.downlading = false
        this.props.message.source = Platform.OS === 'android' ? path + "/" : '' + path
        this.props.room.addStaticFilePath(this.props.message.source, this.props.message.id).then(() => {
            this.props.room.addAudioSizeProperties(this.props.message.id, this.state.total,
                this.state.received, this.props.message.duration).then(() => {
                    this.initialisePlayer(this.props.message.source)
                    this.setState({
                        loaded: true
                    })
                })
        })
    }
    success(path, total, received) {
        this.props.message.duration = this.exchanger.duration
        this.setState({
            total: total,
            received: received
        })
        this.setAfterSuccess(path)
    }
    progress(received, total, size) {
        let newReceived = received;
        let newTotal = this.state.total && this.state.total > 0 && this.state.total > total ? this.state.total : total
        newTotal = parseInt(newTotal)
        this.setState({
            downloadState: (newReceived / newTotal) * 100,
            total: newTotal, received: newReceived
        })
    }
    path = '/Sound/' + this.props.message.file_name
    duration = 10
    pattern = [1000, 0, 0]
    tempPath = this.path + '.download'
    download(url) {
        clearInterval(this.downloadID)
        GState.downlading = true
        this.setState({
            downloading: true
        })
        this.exchanger.download(this.state.received)
    }
    onError(error) {
        GState.downlading = false
        console.warn(error)
        this.setState({
            downloading: false,
            error: true
        })
    }
    onFail(received, total) {
        //console.warn(total,received)
        this.props.message.duration = this.exchanger.duration
        this.setState({
            received: received,
            downloading: false,
            total: this.state.total && this.state.total > 0 && this.state.total > total ? this.state.total : total
        })
        this.props.message.received = this.state.received
        this.props.message.total = this.state.total
        this.props.room.addAudioSizeProperties(this.props.message.id, this.state.total,
            this.state.received, this.props.message.duration).then(() => {
                this.setState({})
            })
    }
    downloadID = null
    downloadAudio(url) {
        this.downloadID = setInterval(() => {
            this.download(url)
        }, 500)
    }
    initialisePlayer(source) {
        this.player = new Sound(source, '/', (error) => {
            console.warn(error, "error")
        })
    }
    player = null
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
                    this.props.room.addDuration(seconds).then(status => {
                        //this.player.release()
                    })
                })
            }
        })
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
        if (this.exchanger.task !== null) {
            this.exchanger.task.cancel((err, taskID) => {
            })
        }
        this.props.room.SetCancledState(this.props.message.id)
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
            width: "80%", margin: '4%', paddingLeft: '10%', paddingRight: '20%', marginTop: "5%", display: 'flex', alignSelf: 'center',
            flexDirection: 'column',
        }
        return (
            <TouchableWithoutFeedback onLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null} onPressIn={() => this.props.pressingIn()}>
                <View style={{ disply: 'flex', flexDirection: 'row', minWidth: 283, maxWidth: 300, minHeight: 50, }}>
                    {this.props.message.duration ? <View style={textStyle}>
                        <View><Slider value={this.state.currentPosition} onValueChange={(value) => {
                            this.player.setCurrentTime(value * this.props.message.duration)
                            this.setState({
                                currentPosition: value,
                                currentTime: value * this.props.message.duration
                            })
                        }}></Slider>
                            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'space-between', }}>
                                <Text>{converToHMS(Math.floor(this.state.currentTime))}</Text>
                                <Right><Text>{converToHMS(this.props.message.duration)}</Text></Right>
                            </View>
                        </View>
                    </View> : <View style={{ textStyleD }}>{/*!this.state.playing ? <BarIndicat animating={false}
                    color={"#1FABAB"} size={30} count={20} ></BarIndicat> : <BarIndicator color={"#1FABAB"} size={30} count={20}></BarIndicator>*/}</View>}
                    <View style={{ margin:  "4%"  }}>
                        {testForURL(this.props.message.source) ? <AnimatedCircularProgress
                            size={40}
                            width={3}
                            fill={testForURL(this.props.message.source) ? this.state.downloadState : 100}
                            tintColor={"#1FABAB"}
                            backgroundColor={'#F8F7EE'}>
                            {
                                (fill) => (
                                    <View style={{ marginTop: "-5%" }}>
                                        <TouchableOpacity onPress={() => this.state.downloading ? this.cancelDownLoad(this.props.message.source) :
                                            this.downloadAudio(this.props.message.source)}>
                                            <View>
                                                <Icon style={{ color: "#0A4E52" }} type="EvilIcons"
                                                    name={this.state.downloading ? "close" : "arrow-down"}></Icon>
                                            </View>
                                            <View style={{ position: 'absolute', marginTop: '-103%', marginLeft: '-14%', }}>
                                                {this.state.downloading ? <Spinner></Spinner> : null}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </AnimatedCircularProgress> : !this.state.playing ? <TouchableOpacity
                            onPress={() => requestAnimationFrame(() => this.plays())}>
                            <Icon type="FontAwesome5" style={{ color: "#0A4E52", fontSize: 20 }} name="play">
                            </Icon>
                        </TouchableOpacity> : <TouchableOpacity onPress={() => requestAnimationFrame(() => this.pause())}>
                                    <Icon type="FontAwesome5" style={{ color: "#0A4E52", fontSize: 20 }} name="pause">
                                    </Icon>
                                </TouchableOpacity>}</View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
