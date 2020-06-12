
import React, { Component } from 'react';

import {
    StyleSheet, Text,
    TouchableOpacity,
    View,
    ScrollView,
    Alert,
    Slider,
    Vibration,
    Platform
} from 'react-native';
import Sound from 'react-native-sound';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon, Right, Spinner, Toast } from 'native-base';
import stores from '../../../stores';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import GState from '../../../stores/globalState';
import FileExachange from '../../../services/FileExchange';
import converToHMS from '../highlights_details/convertToHMS';
import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';
import rnFetchBlob from 'rn-fetch-blob';
import TextContent from './TextContent';
import ColorList from '../../colorList';
const { fs } = rnFetchBlob


export default class AudioUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: 0,
            currentPosition: 0,
            loaded: false,
            currentTime: 0,
            uploadState: 0,
            downloading: true
        }
    }

    upload(url) {
        this.exchanger.upload(this.state.received, this.state.total)
    }
    progress(writen, total) {
        this.setState({
            total: parseInt(total),
            received: parseInt(writen),
            uploadState: (parseInt(writen) / parseInt(total)) * 100
        })
    }
    onError(error) {
        GState.downlading = false
        this.setState({
            downloading: false
        })
        console.warn(error)
    }
    onSuccess(newDir, path, filename) {
        GState.downlading = false
        this.setState({
            uploadState: 100,
            loaded: true,
            downloading: false
        })
        fs.unlink(this.tempSource).then(() => {
            this.initialisePlayer(newDir.replace('file://', ''))
            this.props.message.type = 'audio'
            this.props.message.source = newDir.replace("file://", "")
            this.props.message.temp = path
            this.props.message.received = 0
            this.props.message.file_name = filename
            if (this.props.message.duration) {
                this.props.replaceMessage(this.props.message)
            } else {
                RNFFmpeg.getMediaInformation(path).then(info => {
                    this.props.message.duration = Math.ceil(info.duration / 1000)
                    this.props.replaceMessage(this.props.message)
                })
            }
       })
    }
    downloadID = null
    uploadAudio(url) {
        this.upload(url)
    }
    initialisePlayer(source) {
        this.player = new Sound(source, '/', (error) => {
            console.warn(error)
        })
    }
    checkIfExist() {
        return new Promise((resolve, reject) => {
            fs.exists(this.tempSource).then((status) => {
                if (status) {
                    resolve("ok")
                } else {
                    fs.cp(this.props.message.source.replace("file://", ''),
                        this.tempSource).then(() => {
                            console.warn(this.props.message.source, "00", fs.dirs.DocumentDir)
                            resolve("ok")
                        })
                }
            })
        })
    }
    player = null
    tempSource = this.props.message.source.
        replace("test", this.props.message.id).
        replace("file://", '')
    componentDidMount() {
        this.checkIfExist().then(() => {
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
            this.exchanger = new FileExachange('file://' + this.tempSource, "/Sound/",
                this.state.total, this.state.received, this.progress.bind(this),
                this.onSuccess.bind(this), null,
                this.onError.bind(this),
                this.props.message.content_type,
                this.props.message.file_name, "/sound")
            this.uploadAudio('file://' + this.tempSource)
        })
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
                    stores.Messages.addDuration(this.props.room,this.props.message.id, seconds).then(status => {
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
    cancelUpLoad(url) {
        this.exchanger.task.cancel((err, taskID) => {
        })
        stores.Messages.SetCancledState(this.props.room,this.props.message.id).then(() => {

        })
        GState.downlading = false
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
            <View>
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
                            <Text>{converToHMS(Math.floor(this.state.currentTime))}</Text>
                            <Right><Text>{converToHMS(this.props.message.duration)}</Text></Right>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: "3%", }}>
                    <AnimatedCircularProgress
                        size={40}
                        width={3}
                        fill={this.state.uploadState}
                        tintColor={ColorList.indicatorColor}
                        backgroundColor={ColorList.indicatorInverted}>
                        {
                            (fill) => (
                                <View style={{ marginTop: "-5%" }}>
                                    {!this.state.loaded ?
                                        <TouchableOpacity onPress={() => this.state.downloading ? this.cancelUpLoad(this.tempSource) :
                                            this.uploadAudio(this.tempSource)}>
                                            <View>
                                                <Icon style={{ color: ColorList.bodyText }} type="EvilIcons"
                                                    name={this.state.downloading ? "close" : "arrow-up"}></Icon>
                                            </View>
                                            <View style={{ position: 'absolute', marginTop: '-103%', marginLeft: '-14%', }}>
                                                {this.state.downloading ? <Spinner></Spinner> : null}
                                            </View>
                                        </TouchableOpacity> : !this.state.playing ? <TouchableOpacity
                                            onPress={() => requestAnimationFrame(() => this.plays())}>
                                            <Icon type="FontAwesome5" style={{ color: ColorList.bodyText, fontSize: 20 }} name="play">
                                            </Icon>
                                        </TouchableOpacity> : <TouchableOpacity onPress={() => requestAnimationFrame(() => this.pause())}>
                                                <Icon type="FontAwesome5" style={{ color: ColorList.bodyText, fontSize: 20 }} name="pause">
                                                </Icon>
                                            </TouchableOpacity>}
                                </View>
                            )
                        }
                    </AnimatedCircularProgress></View>
            </View>
                {this.props.message.text?<TextContent
                    handleLongPress={this.props.handleLongPress}
                    pressingIn={this.props.pressingIn} text={this.props.message.text} tags={this.props.message.tags}
                >
                </TextContent>:null}
            </View>
        );
    }
}
