import React, { Component } from "react"
import { View, TouchableOpacity, TouchableWithoutFeedback, Vibration, StyleSheet } from 'react-native';
import { Text, Icon, Spinner, Toast } from 'native-base';
import PhotoView from "../currentevents/components/PhotoView";
import Image from "react-native-scalable-image"
import { AnimatedCircularProgress } from "react-native-circular-progress";
import rnFetchBlob from 'rn-fetch-blob';
import GState from "../../../stores/globalState";
import TextContent from "./TextContent";
import ChatStore from '../../../stores/ChatStore';
import testForURL from '../../../services/testForURL';
const { fs, config } = rnFetchBlob
let dirs = rnFetchBlob.fs.dirs
const AppDir = rnFetchBlob.fs.dirs.SDCardDir + '/Bleashup'


export default class VideoMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sender: false,
            splicer: 500,
            creator: false,
            received: 0.0,
            total: 0.0,
            showTime: false,
            downloadState: 1,
            text: "",
            time: "",
        };
    }
    transparent = "rgba(52, 52, 52, 0.3)";
    componentDidMount() {
        this.room = new ChatStore(this.props.firebaseRoom)
        let downloadState = (this.props.message.received / this.props.message.total) * 100
        this.setState({
            text: this.props.message.text,
            url: this.props.message.photo,
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            received: isNaN(parseInt(this.props.message.received)) ? 0 : parseInt(this.props.message.received),
            loaded: testForURL(this.props.message.source) ? false : true,
            ///downloadState: parseInt(downloadState) === null ? 1 : parseInt(downloadState),
            total: this.props.message.total ? parseInt(this.props.message.total).toFixed(2) : 0,
            creator: (this.props.message.sender.phone == this.props.creator)
        })
        // console.warn(this.state.downloadState, this.props.message.file_name)
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
    path = AppDir + '/Video/' + this.props.message.file_name
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
                GState.downlading = false
                temper1 = this.toMB(this.state.total)
                temper2 = this.toMB(this.state.received)
                temp1 = Math.floor(temper1)
                temp2 = Math.floor(temper2)
                temp3 = Math.ceil(temper2)
                if (temp1 == temp2 || temp1 == temp3) {
                    this.props.message.duration = Math.floor(res.info().headers.Duration)
                    fs.appendFile(this.tempPath, res.path(), 'uri').then(() => {
                        fs.unlink(this.path)
                        fs.appendFile(this.path, this.tempPath, 'uri').then(() => {
                            fs.unlink(this.tempPath)
                            fs.unlink(res.path())
                            this.props.message.source = "file://" + this.path
                            this.setAfterSuccess(this.props.message.source,this.state.total, this.state.received)
                        })
                    })
                } else {
                    fs.appendFile(this.tempPath, res.path(), 'uri').then(() => {
                        fs.unlink(res.path())
                        this.props.message.received = this.state.received
                        this.props.message.total = this.state.total
                        this.room.addVideoSizeProperties(this.props.message.id, this.state.total, this.state.received)
                        this.setState({})
                    })
                }
            })
        })
    }
    downloadID = null
    downloadVideo(url) {
        this.downloadID = setInterval(() => this.download(url), 500)
    }
    setAfterSuccess(res, cap, received) {
        this.room.addVideoProperties(this.props.message.id, this.props.message.source, cap, received).then(() => {
            this.setState({
                loaded: true,
                downloading: false,
                total: cap.toFixed(2),
                downloadState: 100
            })
        })
    }
    cancelDownLoad(url) {
        this.task.cancel((err, taskID) => {
            this.setState({ downloading: false })
        })
        this.room.SetCancledState(this.props.message.id)
        this.setState({
            downloading: false
        })
    }
    toMB(data) {
        mb = 1000 * 1000
        return data / mb
    }
    videoPlayer = null
    duration = 10
    pattern = [1000, 0, 0]
    render() {
        return (
            <View>
                <View>
                    <Image playVideo={() => this.props.playVideo(this.props.message.source)} video style={{
                        marginTop: "2%",
                        marginLeft: "1.2%",
                    }} borderRadius={5} source={{ uri: this.props.message.thumbnailSource }} photo={this.props.message.thumbnailSource}
                        width={290} height={200}>
                    </Image>
                    <View style={{ position: 'absolute', marginTop: "25%", marginLeft: "45%", }}>
                        <View>
                            <TouchableOpacity
                                onPress={() => this.props.playVideo(this.props.message.source)
                                }>
                                <Icon type="EvilIcons" name="play" style={{
                                    fontSize: 40,
                                    color: "#1FABAB"
                                }}></Icon>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ alignSelf: this.state.sender ? 'flex-start' : 'flex-end', margin: '2%', }}>
                        {this.state.loaded ? <View style={{ marginTop: "-10%" }}><View><Text style={{ color: this.state.sender ? '#F8F7EE' : '#E1F8F9' }}>
                            {this.toMB(this.state.total).toFixed(2)} {"Mb"}</Text></View></View> :
                            <View style={{ marginTop: "-25%" }}>
                                <AnimatedCircularProgress size={40}
                                    width={2}
                                    fill={testForURL(this.props.message.source) ? this.state.downloadState : 100}
                                    tintColor={this.state.error ? "red" : "#1FABAB"}
                                    backgroundColor={this.transparent}>
                                    {
                                        (fill) => (<View>
                                            {this.state.downloading ? <TouchableWithoutFeedback onPress={() => this.cancelDownLoad(this.props.message.source)}>
                                                <Icon type="EvilIcons" style={{ color: "#1FABAB" }} name="close">
                                                </Icon>
                                            </TouchableWithoutFeedback> : <TouchableWithoutFeedback onPress={() => this.downloadVideo(this.props.message.source)}>
                                                    <Icon type="EvilIcons" style={{ color: "#1FABAB" }} name="arrow-down">
                                                    </Icon>
                                                </TouchableWithoutFeedback>}
                                        </View>)
                                    }
                                </AnimatedCircularProgress>
                                <View style={{ marginTop: "15%" }}><Text note>{"("}{this.toMB(this.state.received).toFixed(1)}{"/"}
                                    {this.toMB(this.state.total).toFixed(1)}{")Mb"}</Text></View></View>}</View>
                </View>
                {this.props.message.text ? <View style={{ marginTop: "-5%", padding: "2%" }}>
                    <TextContent text={this.props.message.text}></TextContent>
                </View> : null}
            </View>
        );
    }
}
var styles = StyleSheet.create({
    backgroundVideo: {
        // position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});