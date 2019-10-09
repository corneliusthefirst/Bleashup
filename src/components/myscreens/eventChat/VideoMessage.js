import React, { Component } from "react"
import { View, TouchableOpacity, TouchableWithoutFeedback, Vibration, StyleSheet } from 'react-native';
import { Text, Icon, Spinner, Toast } from 'native-base';
import PhotoView from "../currentevents/components/PhotoView";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import rnFetchBlob from 'rn-fetch-blob';
import stores from "../../../stores";
import GState from "../../../stores/globalState";
import TextContent from "./TextContent";
const { fs, config } = rnFetchBlob
let dirs = rnFetchBlob.fs.dirs

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
            downloadState: 0,
            text: "",
            time: "",
        };
    }
    transparent = "rgba(52, 52, 52, 0.3)";
    componentDidMount() {
        this.setState({
            text: this.props.message.text,
            url: this.props.message.photo,
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            received: this.props.message.received,
            //downloadState : (this.props.message.received/this.props.message.total)*100,
            total: this.props.message.total,
            creator: (this.props.message.sender.phone == this.props.creator)
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
    path = dirs.DocumentDir + '/videos_' + this.props.message.file_name
    tempPath = this.path + '.download'
    download(url) {
        clearInterval(this.downloadID)
        GState.downlading = true
        this.setState({
            downloading: true
        })
        this.DetemineRange(this.tempPath).then(size => {
            console.warn("downloading....", size)
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
                            this.setAfterSuccess(this.props.message.source, temper1, temper2)
                        })
                    })
                } else {
                    fs.appendFile(this.tempPath, res.path(), 'uri').then(() => {
                        fs.unlink(res.path())
                        this.props.message.received = this.state.received
                        this.props.message.total = this.state.total
                        stores.ChatStore.addVideoSizeProperties(this.state.total, this.state.received)
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
        stores.ChatStore.addVideoProperties(this.props.message.source, cap, received).then(() => {
            this.setState({
                loaded: true,
                downloading: false,
                total: cap.toFixed(1),
                downloadState: 100
            })
        })
    }
    testForURL(url) {
        let test = url.includes("http://")
        let test2 = url.includes("https://")
        return test || test2
    }
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
    videoPlayer = null
    duration = 10
    pattern = [1000, 0, 0]
    render() {
        topMostStyle = {
            marginLeft: this.state.sender ? '0%' : 0,
            marginRight: !this.state.sender ? '1%' : 0,
            marginTop: "1%",
            marginBottom: "0.5%",
            alignSelf: this.state.sender ? 'flex-start' : 'flex-end',
        }
        GeneralMessageBoxStyle = {
            maxWidth: 300, flexDirection: 'column', minWidth: "10%",
            minHeight: 10, overflow: 'hidden', borderBottomLeftRadius: this.state.sender ? 0 : 20,
            borderColor: !this.state.sender ? '#0A4E52' : "#0A4E52",
            // this style is different from the others
            borderTopLeftRadius: this.state.sender ? 0 : 10, backgroundColor: this.state.sender ? '#F8F7EE' : '#E1F8F9',
            borderTopRightRadius: this.state.sender ? 20 : 10, borderBottomRightRadius: this.state.sender ? 20 : 0,
        }
        spaceStyles = {
            backgroundColor: "#FFFFFF", height: "100%",
            width: "2%",
            borderBottomRightRadius: 3,
            marginTop: 1,
            borderTopRightRadius: 15,
        }

        senderNameStyle = {
            maxWidth: this.state.sender ? "98%" : "100%",
            padding: 4,
            borderBottomLeftRadius: 40,
        }
        subNameStyle = {
            marginTop: -3, paddingBottom: 5,
            flexDirection: "column"
        }
        return (
            <View>
                <View>
                    <PhotoView playVideo={() => this.props.playVideo(this.props.message.source)} video style={{
                        marginTop:"1%",
                        marginLeft: "0.5%",
                    }} borderRadius={10} photo={this.props.message.thumbnailSource}
                        width={290} height={340}>
                    </PhotoView>
                    <View style={{ position: 'absolute', marginTop: "25%", marginLeft: "45%", }}>
                        <View>
                            <TouchableOpacity
                                onPress={() => this.props.playVideo(this.props.message.source)
                                }>
                                <Icon type="EvilIcons" name="play" style={{
                                    fontSize: 40,
                                    color: "#1FABAB"
                                }}></Icon>
                                <View style={{ marginTop: "-58.5%", marginLeft: "-58%", }}>
                                    <Spinner></Spinner>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ alignSelf: this.state.sender ? 'flex-start' : 'flex-end', margin: '2%', }}>
                        {this.state.loaded ? <View style={{ marginTop: "-10%" }}><View><Text style={{ color: this.state.sender ? '#F8F7EE' : '#E1F8F9' }}>
                            {this.state.total} {"Mb"}</Text></View></View> :
                            <View style={{ marginTop: "-25%" }}>
                                <AnimatedCircularProgress size={40}
                                    width={2}
                                    fill={this.testForURL(this.props.message.source) ? this.state.downloadState : 100}
                                    tintColor={this.state.error ? "red" : "#1FABAB"}
                                    backgroundColor={this.transparent}>
                                    {
                                        (fill) => (<View>
                                            {this.state.downloading ? <TouchableWithoutFeedback onPress={() => this.cancelDownLoad(this.props.message.sor)}>
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
                {this.props.message.text ? <View style={{ marginTop: "-10%", padding: "2%" }}>
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