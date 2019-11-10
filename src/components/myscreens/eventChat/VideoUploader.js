import React, { Component } from 'react';

import { View, TouchableOpacity, TouchableWithoutFeedback, PermissionsAndroid } from "react-native"
import Image from "react-native-scalable-image"
import { Text, Icon, Spinner } from 'native-base';
import rnFetchBlob from 'rn-fetch-blob';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as config from "../../../config/bleashup-server-config.json"
const { fs } = rnFetchBlob
const AppDir = rnFetchBlob.fs.dirs.SDCardDir + '/Bleashup/'
export default class VideoUploader extends Component {
    constructor(props) {
        super(props)
        this.uploadURL = config.file_server.protocol +
            "://" + config.file_server.host + ":" + config.file_server.port + "/video/save"
        this.baseURL = config.file_server.protocol +
            "://" + config.file_server.host + ":" + config.file_server.port + '/video/get/'
        this.state = {
            received: 0, total: 0,
            uploading:true,
            uploadState: 0
        }
    }
    state = {uploading:true}
    componentDidMount() {
        setTimeout(() => {
            this.uploadVideo()
        }, 500)
    }
    task = null
    uploadVideo() {
        fs.exists(this.props.message.source).then(state => {
            this.task = rnFetchBlob.fetch("POST", this.uploadURL, {
                'content-type': 'multipart/form-data',
            }, [{
                name: "file",
                filename: this.props.message.filename,
                type: this.props.message.content_type,
                data: rnFetchBlob.wrap(this.props.message.source)
            }])
            this.task.uploadProgress((writen, total) => {
                this.setState({
                    total: parseInt(total),
                    uploading:true,
                    received: parseInt(writen),
                    uploadState: (parseInt(writen) / parseInt(total)) * 100
                })
            })
            this.task.then(response => {
                if (response.data) {
                    newDir = `file://` + AppDir +"Video/"+ response.data
                    fs.writeFile(newDir.split(`file://`)[1], this.props.message.source.split(`file://`)[1], 'uri').then(() => {
                        this.setState({
                            uploadState: 100,
                            loaded: true,
                            uploading:false
                        })
                        this.props.message.type = 'video'
                        this.props.message.source = newDir
                        this.props.message.thumbnailSource = this.baseURL + response.data.split('.')[0] + '_thumbnail.jpeg'
                        this.props.message.temp = this.baseURL + response.data
                        this.props.message.received = 0
                        this.props.message.file_name = response.data
                        this.props.replaceMessage(this.props.message)
                    })
                }
            })
            this.task.catch((error) => {
                console.warn(error)
            })
        })
    }
    toMB(data) {
        mb = 1000 * 1000
        return data / mb
    }
    cancelUpLoad() {
        this.task.cancel((err, taskID) => {
        })
    }
    render() {
        return (
            <View>
                <View style={{ padding: "1.5%" }}>
                    <View>
                        <TouchableOpacity onPress={() => this.props.showPhoto(this.props.message.source)}>
                            <View resizeMode={'contain'} style={{
                                borderRadius: 15,
                                alignSelf: 'center',
                                width: 190,
                                height: 300,
                                backgroundColor: 'black',
                            }}></View>
                            <View style={{ position: 'absolute', marginTop: "50%", marginLeft: "46%", }}>
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
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignSelf: 'center', margin: '2%', }}>
                        {this.state.loaded ? <View style={{ marginTop: 0 }}><View><Text
                            style={{ color: this.state.sender ? '#F8F7EE' : '#E1F8F9' }}>
                            {this.toMB(this.state.total).toFixed(2)} {"Mb"}</Text></View></View> :
                            <View style={{ marginTop: 1 }}>
                                <AnimatedCircularProgress size={40}
                                    width={2}
                                    fill={this.state.uploadState}
                                    tintColor={this.state.error ? "red" : "#1FABAB"}
                                    backgroundColor={this.transparent}>
                                    {
                                        (fill) => (<View>
                                            {this.state.uploading ? <TouchableWithoutFeedback onPress={() => this.cancelUpLoad(this.props.message.source)}>
                                                <View><Icon type="EvilIcons" style={{ color: "#1FABAB" }} name="close">
                                                </Icon>
                                                 <Spinner style={{ position: 'absolute', marginTop: "-136%", marginLeft: "-15%", }}></Spinner>
                                                </View>
                                            </TouchableWithoutFeedback> : <TouchableWithoutFeedback onPress={() => this.uploadVideo()}>
                                                    <View>
                                                        <Icon type="EvilIcons" style={{ color: "#1FABAB" }} name="arrow-up">
                                                        </Icon>
                                                    </View>

                                                </TouchableWithoutFeedback>}
                                        </View>)
                                    }
                                </AnimatedCircularProgress>
                                <View style={{ marginTop: "15%", }}><Text style={{ color: '#0A4E52' }} note>{"("}{this.toMB(this.state.received).toFixed(1)}{"/"}
                                    {this.toMB(this.state.total).toFixed(1)}{")Mb"}</Text></View></View>}</View>
                </View>
                <View>
                    {this.props.message.text ? <Text style={{ margin: '3%', }}>{this.props.message.text}</Text> : null}
                </View>
            </View>
        );
    }
}