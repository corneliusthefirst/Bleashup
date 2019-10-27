
import React, { Component } from 'react';

import {
    StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Vibration, Platform
} from 'react-native';
import rnFetchBlob from 'rn-fetch-blob';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Icon, Right, Spinner, Toast } from 'native-base';
import * as config from "../../../config/bleashup-server-config.json"
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import GState from '../../../stores/globalState';
import FileViewer from 'react-native-file-viewer';
import ChatStore from '../../../stores/ChatStore';
let dirs = rnFetchBlob.fs.dirs
const { fs } = rnFetchBlob
const AppDir = rnFetchBlob.fs.dirs.SDCardDir + '/Bleashup'
export default class FileAttarchementUploader extends Component {
    constructor(props) {
        super(props);
        this.uploadURL = config.file_server.protocol +
            "://" + config.file_server.host + ":" + config.file_server.port + "/other/save"
        this.baseURL = config.file_server.protocol +
            "://" + config.file_server.host + ":" + config.file_server.port + '/other/get/'
        this.state = {
            duration: 0,
            received: 0, total: 0,
            uploadState: 0,
            currentPosition: 0,
            currentTime: 0,
            downloadState: 0,
        }
    }
    path = AppDir + '/Others/' + this.props.message.file_name
    duration = 10
    pattern = [1000, 0, 0]
    downloadID = null
    tempPath = this.path + '.download'
    uploadFile(url) {
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
                    newDir = `file://` + AppDir + "/Others/" + response.data
                        this.setState({
                            uploadState: 100,
                            loaded: true,
                            downloading:false
                        })
                        this.props.message.type = 'attachement'
                       ///this.props.message.thumbnailSource = this.baseURL + response.data.split('.')[0] + '_thumbnail.jpeg'
                        this.props.message.temp = this.baseURL + response.data
                        this.props.message.received = this.state.total
                        this.props.replaceMessage(this.props.message)
                }
            })
            this.task.catch((error) => {
                console.warn(error)
            })
        })
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
        this.room = new ChatStore(this.props.firebaseRoom)
        this.setState({
            duration: null,
            currentPosition: 0,
            playing: false,
            received: this.props.message.received,
            total: this.props.message.total,
            downloading:true,
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            creator: (this.props.message.sender.phone == this.props.creator)
        })
        setTimeout(() => {
            this.uploadFile()
        }, 500)
    }
    task = null
    previousTime = 0
    cancelUpLoad(url) {
        this.task.cancel((err, taskID) => {
            this.setState({ downloading: false })
        })
        this.room.SetCancledState(this.props.message.id).then(()=>{

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
