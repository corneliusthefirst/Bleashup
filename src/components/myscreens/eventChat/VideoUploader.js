import React, { Component } from 'react';

import { View, TouchableOpacity, TouchableWithoutFeedback, PermissionsAndroid } from "react-native"
import Image from "react-native-scalable-image"
import { Text, Icon, Spinner } from 'native-base';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import FileExachange from '../../../services/FileExchange';
import Pickers from '../../../services/Picker';
import rnFetchBlob from 'rn-fetch-blob';
const { fs } = rnFetchBlob
export default class VideoUploader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            received: 0, total: 0,
            uploading: true,
            uploadState: 1
        }
    }
    state = { uploading: true }
    componentDidMount() {
        setTimeout(() => {
            this.uploadVideo()
        }, 500)
    }
    task = null
    uploadVideo() {
        this.setState({
            compressing: true
        })
        Pickers.CompressVideo({
            source: this.props.message.source,
            filename: this.props.message.filename,
            size: this.props.message.total,
            content_type: this.props.message.content_type
        }).then(res => {
            this.setState({
                compressing: false
            })
            this.exchanger = new FileExachange(res.source, '/Video/',
                res.size,
                this.props.message.received ? this.props.message.received : 0,
                this.progress.bind(this), this.onSuccess.bind(this), null,
                this.onError.bind(this), res.content_type,
                res.filename, '/video')
            this.exchanger.upload(this.state.writen, this.state.total)
        })
    }
    onSuccess(newDir, path, filename, baseUrl) {
        this.setState({
            uploadState: 100,
            loaded: true,
            uploading: false
        })
        fs.unlink(newDir).then(() => {})
        this.props.message.type = 'video'
        this.props.message.source = path
        this.props.message.cancled = true
        this.props.message.thumbnailSource = baseUrl + filename.split('.')[0] + '_thumbnail.jpeg'
        this.props.message.temp = path
        this.props.message.total = this.state.total
        this.props.message.received = 0
        this.props.message.file_name = filename
        this.props.replaceMessage(this.props.message)
    }
    progress(writen, total) {
        this.setState({
            total: parseInt(total),
            uploading: true,
            received: parseInt(writen),
            uploadState: (parseInt(writen) / parseInt(total)) * 100
        })
    }
    onError(error) {
        console.warn(error)
        this.setState({
            uploading: false
        })
    }
    toMB(data) {
        mb = 1000 * 1000
        return data / mb
    }
    cancelUpLoad() {
        Pickers.CancleCompression()
        this.exchanger.task && this.exchanger.task.cancel((err, taskID) => {
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
                                {this.state.compressing ? <Text note>{"compressing ..."}</Text> : <View style={{ marginTop: "15%", }}><Text style={{ color: '#0A4E52' }} note>{"("}{this.toMB(this.state.received).toFixed(1)}{"/"}
                                    {this.toMB(this.state.total).toFixed(1)}{")Mb"}</Text></View>}</View>}</View>
                </View>
                <View>
                    {this.props.message.text ? <Text style={{ margin: '3%', }}>{this.props.message.text}</Text> : null}
                </View>
            </View>
        );
    }
}