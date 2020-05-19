
import React, { Component } from 'react';

import {
    StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Vibration, Platform
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon, Right, Spinner, Toast } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import GState from '../../../stores/globalState';
import FileViewer from 'react-native-file-viewer';
import FileExachange from '../../../services/FileExchange';
import rnFetchBlob from 'rn-fetch-blob';
import stores from '../../../stores';
const { fs } = rnFetchBlob
export default class FileAttarchementUploader extends Component {
    constructor(props) {
        super(props);
          this.state = {
            duration: 0,
            received: 0, total: 0,
            uploadState: 1,
            currentPosition: 0,
            currentTime: 0,
            downloadState: 0,
        }
    }
    duration = 10
    pattern = [1000, 0, 0]
    downloadID = null
    uploadFile(url) {
        this.exchanger.upload(this.state.writen, this.state.total)
    }
    progress(writen, total) {
        this.setState({
            total: parseInt(total),
            received: parseInt(writen),
            uploadState: (parseInt(writen) / parseInt(total)) * 100
        })
    }
    onSuccess(newDir, path, filename) {
        this.setState({
            uploadState: 100,
            loaded: true,
            downloading: false
        })
        fs.unlink(newDir,() => {})
        this.props.message.type = 'attachement'
        ///this.props.message.thumbnailSource = this.baseURL + response.data.split('.')[0] + '_thumbnail.jpeg'
        this.props.replaceMessage({...this.props.message,source:path,temp:path,received:this.state.total})
    }
    onError(error) {
        console.warn(error)
        this.setState({
            downloading: false
        })
    }
    openFile() {
        FileViewer.open(this.props.message.source).then(() => {

        }).catch((error) => {
            console.warn(error)
        })
    }
    componentDidMount() {
        this.setState({
            duration: null,
            currentPosition: 0,
            playing: false,
            received: this.props.message.received,
            total: this.props.message.total,
            downloading: true,
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            creator: (this.props.message.sender.phone == this.props.creator)
        })
        this.exchanger = new FileExachange(this.props.message.source,
            '/Others/', this.state.total,
            this.state.received,
            this.progress.bind(this),
            this.onSuccess.bind(this),
            null,
            this.onError.bind(this),
            this.props.message.content_type,
            this.props.message.file_name, '/other',true)
        setTimeout(() => {
            this.uploadFile()
        }, 500)
    }
    task = null
    previousTime = 0
    cancelUpLoad(url) {
        this.exchanger.task.cancel((err, taskID) => {
            this.setState({ downloading: false })
        })
        stores.Messages.SetCancledState(this.props.room,this.props.message.id).then(() => {

        })
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
                                <Text style={{ fontSize: 30, color: "#0A4E52" }}>{this.props.message.file_name.split(".")
                                [this.props.message.file_name.split(".").length - 1].toUpperCase()}</Text>
                                <Right></Right>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: "3%", marginLeft: "-5%", }}>
                        <AnimatedCircularProgress
                            size={40}
                            width={3}
                            fill={this.state.uploadState}
                            tintColor={"#1FABAB"}
                            backgroundColor={'#F8F7EE'}>
                            {
                                (fill) => (
                                    <View style={{ marginTop: "-2%" }}>
                                        {!this.state.loaded ?
                                            <TouchableOpacity onPress={() => this.state.downloading ? this.cancelUpLoad(this.props.message.source) :
                                                this.uploadFile(this.props.message.source)}>
                                                <View>
                                                    <Icon style={{ color: "#0A4E52" }} type="EvilIcons"
                                                        name={this.state.downloading ? "close" : "arrow-up"}></Icon>
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
