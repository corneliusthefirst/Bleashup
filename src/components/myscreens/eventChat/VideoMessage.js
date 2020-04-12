import React, { Component } from "react"
import { View, TouchableOpacity, TouchableWithoutFeedback, Vibration, StyleSheet } from 'react-native';
import { Text, Icon, Spinner, Toast } from 'native-base';
import Image from "react-native-scalable-image"
import { AnimatedCircularProgress } from "react-native-circular-progress";
import GState from "../../../stores/globalState";
import TextContent from "./TextContent";
import testForURL from '../../../services/testForURL';
import FileExachange from "../../../services/FileExchange";
import buttoner from "../../../services/buttoner";
import ColorList from '../../colorList';


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
        console.warn(this.props.message.received, this.props.message.total, "--")
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
        this.setState({
            error:false,
            downloadState: (newReceived / newTotal) * 100,
            total: newTotal, received: newReceived
        })
    }
    success(path, total, received) {
        GState.downlading = false
        this.setState({
            total: this.state.total && this.state.total > 0 && this.state.total > total ? this.state.total : total,
            received: received
        })
        this.props.message.duration = this.exchanger.duration
        this.props.message.source = "file://" + path
        this.setAfterSuccess(this.props.message.source, total * 1000 * 1000, received * 1000 * 1000)
    }
    onFail(received, total) {
        console.warn(total, received)
        this.setState({
            total: this.state.total && this.state.total > 0 && this.state.total > total ? this.state.total : total,
            received: received
        })
        GState.downlading = false
        this.props.message.duration = this.exchanger.duration
        this.props.message.received = received
        this.props.message.total = total
        this.props.room.addVideoSizeProperties(this.props.message.id, total, received)
        this.setState({
            downloading: false
        })
    }
    onError(error) {
        GState.downlading = false
        console.warn(error)
        this.setState({
            downloading: false,
            error: true
        })
    }
    path = '/Video/' + this.props.message.file_name
    download(url) {
        clearInterval(this.downloadID)
        GState.downlading = true
        this.setState({
            downloading: true
        })
        this.exchanger.download(this.state.received, this.state.total)
    }
    downloadID = null
    downloadVideo(url) {
        this.downloadID = setInterval(() => this.download(url), 500)
    }
    setAfterSuccess(res, cap, received) {
        this.props.room.addVideoProperties(this.props.message.id, this.props.message.source, cap, received).then(() => {
            this.setState({
                loaded: true,
                downloading: false,
                downloadState: 100
            })
        })
    }
    cancelDownLoad(url) {
        this.exchanger.task.cancel((err, taskID) => {
            this.setState({ downloading: false })
        })
        this.props.room.SetCancledState(this.props.message.id)
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
                <TouchableWithoutFeedback onPressIn={() => {
                    this.props.pressingIn()
                }} onLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null}>
                    <View>
                    <View>
                        <Image style={{
                            marginTop: "2%",
                            marginLeft: "1.2%",
                        }} 
                        borderRadius={5} 
                        source={{ uri: this.props.message.thumbnailSource }} 
                        photo={this.props.message.thumbnailSource}
                            width={290} height={200}>
                        </Image>
                        <View style={{ position: 'absolute', marginTop: "25%", marginLeft: "45%", }}>
                            <View style={{...buttoner}}>
                                <TouchableOpacity
                                    onPress={() => this.props.playVideo(this.props.message.source)
                                    }>
                                    <Icon type="EvilIcons" name="play" style={{
                                        fontSize: 40,
                                        color: ColorList.headerTextInverted
                                    }}></Icon>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ alignSelf: this.state.sender ? 'flex-start' : 'flex-end', margin: '2%',justifyContent: 'center', }}>
                                {this.state.loaded ? <View style={{ marginTop: "-12%" }}><View style={{ ...buttoner, height: 25, width: 65 }}><Text style={{ color: ColorList.headerTextInverted }}>
                                {this.toMB(this.state.total).toFixed(2)} {"Mb"}</Text></View></View> :
                                <View style={{ marginTop: "-25%", }}>
                                    <AnimatedCircularProgress size={40}
                                        width={2}
                                        fill={testForURL(this.props.message.source) ? this.state.downloadState : 100}
                                            tintColor={this.state.error ? "red" : ColorList.headerTextInverted}
                                        backgroundColor={this.transparent}>
                                        {
                                            (fill) => (<View style={{...buttoner, alignSelf:'center'}}>
                                                {this.state.downloading ? <TouchableWithoutFeedback onPress={() => this.cancelDownLoad(this.props.message.source)}>
                                                    <Icon type="EvilIcons" style={{ color: ColorList.headerTextInverted }} name="close">
                                                    </Icon>
                                                </TouchableWithoutFeedback> : <TouchableWithoutFeedback onPress={() => this.downloadVideo(this.props.message.source)}>
                                                        <Icon type="EvilIcons" style={{ color: ColorList.headerTextInverted }} name="arrow-down">
                                                        </Icon>
                                                    </TouchableWithoutFeedback>}
                                            </View>)
                                        }
                                    </AnimatedCircularProgress>
                                    <View style={{ marginTop: "10%",...buttoner,height:15,width:75 }}><Text style={{marginBottom: 7,}} note>{"("}{this.toMB(this.state.received).toFixed(1)}{"/"}
                                        {this.toMB(this.state.total).toFixed(1)}{")Mb"}</Text></View></View>}</View>
                    </View>
                    {this.props.message.text ? <View style={{ marginTop: "-5%", padding: "2%" }}>
                        <TextContent onLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null} pressingIn={() => this.props.pressingIn()} text={this.props.message.text}></TextContent>
                    </View> : null}
                    </View>
                </TouchableWithoutFeedback>
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