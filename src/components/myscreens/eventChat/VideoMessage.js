import React, { Component } from "react"
import { View, TouchableOpacity, Text, TouchableWithoutFeedback, Vibration, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from "react-native-circular-progress";
import GState from "../../../stores/globalState";
import TextContent from "./TextContent";
import testForURL from '../../../services/testForURL';
import FileExachange from "../../../services/FileExchange";
import buttoner from "../../../services/buttoner";
import ColorList from '../../colorList';
import stores from "../../../stores";
import CacheImages from '../../CacheImages';
import BePureComponent from '../../BePureComponent';
import  EvilIcons  from 'react-native-vector-icons/EvilIcons';


export default class VideoMessage extends BePureComponent {
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
        let downloadState = (this.props.message.received / this.props.message.total) * 100
        this.setStatePure({
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
        this.exchanger = new FileExachange(this.props.message.source,
            this.path,
            this.state.total,
            this.state.received,
            this.progress.bind(this),
            this.success.bind(this),
            this.onFail.bind(this),
            this.onError.bind(this))
        // console.warn(this.state.downloadState, this.props.message.file_name)
    }
    progress(received, total, size) {
        let newReceived = parseInt(received);
        let newTotal = this.state.total && this.state.total > 0 && this.state.total > total ? this.state.total : total
        newTotal = parseInt(newTotal)
        this.setStatePure({
            error: false,
            downloadState: (newReceived / newTotal) * 100,
            total: newTotal, received: newReceived
        })
    }
    success(path, total, received) {
        GState.downlading = false
        this.setStatePure({
            total: this.state.total && this.state.total > 0 && this.state.total > total ? this.state.total : total,
            received: received
        })
        this.props.message.duration = this.exchanger.duration
        this.props.message.source = "file://" + path
        this.setAfterSuccess(this.props.message.source, total * 1000 * 1000, received * 1000 * 1000)
    }
    onFail(received, total) {
        console.warn(total, received)
        this.setStatePure({
            total: this.state.total && this.state.total > 0 && this.state.total > total ? this.state.total : total,
            received: received
        })
        GState.downlading = false
        this.props.message.duration = this.exchanger.duration
        this.props.message.received = received
        this.props.message.total = total
        stores.Messages.addVideoSizeProperties(this.props.room,this.props.message.id, total, received)
        this.setStatePure({
            downloading: false
        })
    }
    onError(error) {
        GState.downlading = false
        console.warn(error)
        this.setStatePure({
            downloading: false,
            error: true
        })
    }
    path = '/Video/' + this.props.message.file_name
    download(url) {
        clearInterval(this.downloadID)
        GState.downlading = true
        this.setStatePure({
            downloading: true
        })
        this.exchanger.download(this.state.received, this.state.total)
    }
    downloadID = null
    downloadVideo(url) {
        this.downloadID = setInterval(() => this.download(url), 500)
    }
    setAfterSuccess(res, cap, received) {
        stores.Messages.addVideoProperties(this.props.room,this.props.message.id, this.props.message.source, cap, received).then(() => {
            this.setStatePure({
                loaded: true,
                downloading: false,
                downloadState: 100
            })
        })
    }
    cancelDownLoad(url) {
        this.exchanger.task.cancel((err, taskID) => {
            this.setStatePure({ downloading: false })
        })
        stores.Messages.SetCancledState(this.props.room,this.props.message.id)
        this.setStatePure({
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
    messageWidth=250
    render() {
        return (
            <View>
                <TouchableOpacity onPressIn={this.props.pressingIn} onPress={() => this.props.playVideo(this.props.message.source)
                }  onLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null}>
                    <View style={{width:this.messageWidth}}>
                        <View>
                            <CacheImages thumbnails square style={{
                                marginTop: "2%",
                                width: this.messageWidth,
                                height:250
                            }}
                            borderRadius={5}
                            source={{ uri: this.props.message.thumbnailSource }}
                            >
                            </CacheImages>
                            <View style={{ position: 'absolute', marginTop: "50%", marginLeft: "45%", }}>
                                <View style={{ ...buttoner }}>
                                        <EvilIcons onPress={() => this.props.playVideo(this.props.message.source)} type="EvilIcons" name="play" style={{
                                            fontSize: 40,
                                            color: ColorList.bodyBackground
                                        }}/>
                                </View>
                            </View>
                            <View style={{ alignSelf: this.state.sender ? 'flex-start' : 'flex-end', margin: '2%', justifyContent: 'center', }}>
                                {this.state.loaded ? <View style={{ marginTop: "-20%" }}><View style={{ ...buttoner, height: 25, width: 65 }}><Text style={{ color: ColorList.bodyBackground }}>
                                    {this.toMB(this.state.total).toFixed(2)} {"Mb"}</Text></View></View> :
                                    <View style={{ marginTop: "-40%", flexDirection: 'column', alignItems: 'center', }}>
                                        <View style={{ height: 43 }}>
                                            <AnimatedCircularProgress size={40}
                                                width={2}
                                                fill={testForURL(this.props.message.source) ? this.state.downloadState : 100}
                                                tintColor={this.state.error ? "red" : ColorList.bodyBackground}
                                                backgroundColor={this.transparent}>
                                                {
                                                    (fill) => (<View style={{ ...buttoner, alignSelf: 'center' }}>
                                                        {this.state.downloading ? <TouchableWithoutFeedback onPress={() => this.cancelDownLoad(this.props.message.source)}>
                                                            <EvilIcons type="EvilIcons" style={{ color: ColorList.bodyBackground }} name="close">
                                                            </EvilIcons>
                                                        </TouchableWithoutFeedback> : <TouchableWithoutFeedback onPress={() => this.downloadVideo(this.props.message.source)}>
                                                                <EvilIcons type="EvilIcons" style={{ color: ColorList.bodyBackground }} name="arrow-down">
                                                                </EvilIcons>
                                                            </TouchableWithoutFeedback>}
                                                    </View>)
                                                }
                                            </AnimatedCircularProgress>
                                        </View>
                                        <View style={{ marginTop: "5%", ...buttoner, height: 25, width: 75 }}><Text style={{ marginBottom: 7, }} note>{"("}{this.toMB(this.state.received).toFixed(1)}{"/"}
                                            {this.toMB(this.state.total).toFixed(1)}{")Mb"}</Text></View></View>}</View>
                        </View>
                        {this.props.message.text ? <View style={{ marginTop: "-5%", padding: "2%", alignSelf: "flex-start" }}>
                            <TextContent tags={this.props.message.tags} pressingIn={this.props.pressingIn} handleLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null} pressingIn={() => this.props.pressingIn()} text={this.props.message.text}></TextContent>
                        </View> : null}
                    </View>
                </TouchableOpacity>
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