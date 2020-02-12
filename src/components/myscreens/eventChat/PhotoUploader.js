import React, { Component } from 'react';

import { View, TouchableOpacity, TouchableWithoutFeedback, PermissionsAndroid } from "react-native"
import Image from "react-native-scalable-image"
import { Text, Icon, Spinner } from 'native-base';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import GState from '../../../stores/globalState';
import FileExachange from '../../../services/FileExchange.js';

export default class PhotoUploader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            received: 0, total: 0,
            uploadState: 0
        }
    }
    state = {}
    componentDidMount() {
        this.exchanger = new FileExachange(this.props.message.source,
            "/Photo/", this.props.message.total ?
            this.props.message.total : 0, this.props.message.received ?
            this.props.message.received : 0,
            this.progress.bind(this), this.onSuccess.bind(this),
            null, this.onError.bind(this),
            this.props.message.content_type,
            this.props.message.filename, '/photo')
        this.uploaderPhoto()

    }
    task = null
    uploaderPhoto() {
        console.warn("calling download")
        if (!GState.downlading) this.uploadPhoto()
        else setTimeout(() => {
            this.uploaderPhoto()
        }, 1000)
    }
    progress(writen, total) {
        this.setState({
            uploading: true,
            total: parseInt(total),
            received: parseInt(writen),
            uploadState: (parseInt(writen) / parseInt(total)) * 100
        })
    }
    onError(error) {
        GState.downlading = false
        this.setState({
            uploading: false
        })
        console.warn(error)
    }
    uploadPhoto() {
        GState.downlading = true
        this.setState({
            uploading: true
        })
        this.exchanger.upload(this.state.written,this.state.total)
        
    }
    onSuccess(newDir, path) {
        this.setState({
            uploadState: 100,
            uploading: false,
            loaded: true
        })
        this.props.message.type = 'photo'
        this.props.message.source = path
        this.props.message.photo = newDir
        this.props.replaceMessage(this.props.message)
        GState.downlading = false
    }
    toMB(data) {
        mb = 1000 * 1000
        return data / mb
    }
    cancelUpLoad() {
        this.exchanger.task.cancel((err, taskID) => {
            GState.downlading = false
            this.setState({
                uploading:false
            })
        })
    }
    render() {
        return (
            <View>
                <View style={{ padding: "1.5%" }}>
                    <View>
                        <TouchableOpacity onPress={() => this.props.showPhoto(this.props.message.source)}>
                            <Image resizeMode={'contain'} style={{
                                borderRadius: 9, alignSelf: 'center',
                                maxWidth: 380,
                            }} source={{ uri: this.props.message.source }} height={340}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignSelf: 'center', margin: '2%', }}>
                        {this.state.loaded ? <View style={{ marginTop: 0 }}><View><Text
                            style={{ color: this.state.sender ? '#F8F7EE' : '#E1F8F9' }}>
                            {this.state.total.toFixed(2)} {"Mb"}</Text></View></View> :
                            <View style={{ marginTop: 1 }}>
                                <AnimatedCircularProgress size={40}
                                    width={2}
                                    fill={this.state.uploadState}
                                    tintColor={this.state.error ? "red" : "#1FABAB"}
                                    backgroundColor={this.transparent}>
                                    {
                                        (fill) => (<View>
                                            {this.state.uploading ? <TouchableWithoutFeedback onPress={() => this.cancelUpLoad(this.props.message.source)}>
                                                <View>
                                                    <Icon type="EvilIcons" style={{ color: "#1FABAB" }} name="close">
                                                    </Icon>
                                                    <Spinner style={{ position: 'absolute', marginTop: "-136%", marginLeft: "-15%", }}>
                                                    </Spinner>
                                                </View>
                                            </TouchableWithoutFeedback> : <TouchableWithoutFeedback onPress={() => this.uploadPhoto()}>
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