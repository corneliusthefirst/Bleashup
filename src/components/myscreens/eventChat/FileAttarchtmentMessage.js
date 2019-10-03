
import React, { Component } from 'react';

import {
    StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Vibration, Platform
} from 'react-native';
import rnFetchBlob from 'rn-fetch-blob';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon, Right, Spinner, Toast } from 'native-base';
import stores from '../../../stores';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import GState from '../../../stores/globalState';
import FileViewer from 'react-native-file-viewer';
let dirs = rnFetchBlob.fs.dirs
const { fs, config } = rnFetchBlob
export default class FileAttarchementMessaege extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: 0,
            currentPosition: 0,
            currentTime: 0,
            downloadState: 0,
        }
    }
    setAfterSuccess(path) {
        console.warn("setting success!!!!")
        this.props.message.source = Platform.OS === 'android' ? path + "/" : '' + path
        stores.ChatStore.addStaticFilePath(this.props.message.source, '').then(() => {
            this.setState({
                loaded: true
            })
        })
    }
    DetemineRange(path) {
        return new Promise((resolve, reject) => {
            fs.exists(path).then(ext => {
                if (ext) {
                    console.warn("exists")
                    fs.stat(path).then(stat => resolve(stat.size))
                } else {
                    resolve(0)
                }
            })
        })
    }
    path = dirs.DocumentDir + '/others_' + this.props.message.file_name
    duration = 10
    pattern = [1000, 0, 0]
    downloadID = null
    tempPath = this.path + '.download'
    download(url) {
        clearInterval(this.downloadID)
        this.setState({
            downloading: true
        })
        GState.downlading = true
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
                GState.downlading = false
                temp1 = this.state.received / 1000
                temp2 = this.state.total / 1000
                temper1 = temp2 / 1000
                temper2 = temp1 / 1000
                temp1 = Math.floor(temper1)
                temp2 = Math.floor(temper2)
                temp3 = Math.ceil(temper2)
                console.warn(temper1, temper2)
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
                    })
                }
            })
        })
    }
    downloadFile(url) {
        this.downloadID = setInterval(() => {
            if (!GState.downlading)
                this.download(url)
        }, 500)

    }
    openFile() {
        FileViewer.open(this.props.message.source).then(() => {

        }).catch((error) => {
            console.warn(error)
        })
    }
    testForURL(url) {
        let test = url.includes("http://")
        let test2 = url.includes("https://")
        return test || test2
    }
    componentDidMount() {
        console.warn(dirs.DocumentDir)
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
    }
    task = null
    previousTime = 0
    cancelDownLoad(url) {
        this.task.cancel((err, taskID) => {
            this.setState({ downloading: false })
        })
        stores.ChatStore.SetCancledState()
        this.setState({
            downloading: false
        })
    }
    toMB(data) {
        mb = 1000 * 1000
        return data / mb
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
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'space-between', }}>
                                <View style={{ width: "70%" }}>
                                    <Text style={{}}>{this.props.message.file_name}</Text>
                                </View>
                                <Text style={{ fontSize: 35, color: "#0A4E52" }}>{this.props.message.file_name.split(".")
                                [this.props.message.file_name.split(".").length - 1].toUpperCase()}</Text>
                                <Right></Right>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: "3%", marginLeft: "-5%", }}>
                        <AnimatedCircularProgress
                            size={40}
                            width={3}
                            fill={this.testForURL(this.props.message.source) ? this.state.downloadState : 100}
                            tintColor={"#1FABAB"}
                            backgroundColor={'#F8F7EE'}>
                            {
                                (fill) => (
                                    <View style={{ marginTop: "-2%" }}>
                                        {this.testForURL(this.props.message.source) ?
                                            <TouchableOpacity onPress={() => this.state.downloading ? this.cancelDownLoad(this.props.message.source) :
                                                this.downloadFile(this.props.message.source)}>
                                                <View>
                                                    <Icon style={{ color: "#0A4E52" }} type="EvilIcons"
                                                        name={this.state.downloading ? "close" : "arrow-down"}></Icon>
                                                </View>
                                                <View style={{ position: 'absolute', marginTop: '-103%', marginLeft: '-14%', }}>
                                                    {this.state.downloading ? <Spinner></Spinner> : null}
                                                </View>
                                            </TouchableOpacity> : <TouchableOpacity
                                                onPress={() => requestAnimationFrame(() => this.openFile())}>
                                                <Icon type="FontAwesome" style={{ color: "#0A4E52", fontSize: 22 }} name="folder-open">
                                                </Icon>
                                            </TouchableOpacity>}
                                    </View>
                                )
                            }
                        </AnimatedCircularProgress><View>
                            {this.state.loaded ? <Text>{this.toMB(this.state.total).toFixed(1)}{"Mb"}</Text> :
                             <Text style={{ fontSize: 10 }} note>{"("}{this.toMB(this.state.received).toFixed(1)}{"/"}
                                {this.toMB(this.state.total).toFixed(1)}{")Mb"}</Text>}</View></View>
                </View>
            </View>
        );
    }
}
