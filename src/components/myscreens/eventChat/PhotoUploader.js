import React, { Component } from 'react';

import { View, TouchableOpacity, Text, TouchableWithoutFeedback, PermissionsAndroid } from "react-native"
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import GState from '../../../stores/globalState';
import FileExachange from '../../../services/FileExchange.js';
import rnFetchBlob from 'rn-fetch-blob';
import buttoner from '../../../services/buttoner';
import ColorList from '../../colorList';
import TextContent from './TextContent';
import CacheImages from '../../CacheImages';
import Pickers from '../../../services/Picker';
import BePureComponent from '../../BePureComponent';
import  EvilIcons  from 'react-native-vector-icons/EvilIcons';
const { fs } = rnFetchBlob
export default class PhotoUploader extends BePureComponent {
    constructor(props) {
        super(props)
        this.state = {
            received: 0, total: 0,
            uploadState: 0
        }
    }
    state = {}
    unmountingComponent(){
        clearInterval(this.uploadTimeout)
    }
    componentDidMount() {
        Pickers.resizePhoto(this.props.message.source).then(source => {
            console.warn("compress photo uplad source ",source)
            this.exchanger = new FileExachange(source,
                "/Photo/", this.props.message.total ?
                this.props.message.total : 0, this.props.message.received ?
                this.props.message.received : 0,
                this.progress.bind(this), this.onSuccess.bind(this),
                null, this.onError.bind(this),
                this.props.message.content_type,
                this.props.message.filename, '/photo')
            this.uploaderPhoto()
        })
    }
    task = null
    uploaderPhoto() {
        console.warn("calling download")
        if (!GState.downlading) this.uploadPhoto()
        else this.uploadTimeout = setTimeout(() => {
            this.uploaderPhoto()
        }, 1000)
    }
    progress(writen, total) {
        this.setStatePure({
            uploading: true,
            total: parseInt(total),
            received: parseInt(writen),
            uploadState: (parseInt(writen) / parseInt(total)) * 100
        })
    }
    onError(error) {
        GState.downlading = false
        this.setStatePure({
            uploading: false
        })
        console.warn(error)
    }
    uploadPhoto() {
        GState.downlading = true
        this.setStatePure({
            uploading: true
        })
        this.exchanger.upload(this.state.written, this.state.total)

    }
    onSuccess(newDir, path) {
        console.warn("successfully uploaded",newDir)
        this.setStatePure({
            uploadState: 100,
            uploading: false,
            loaded: true
        })
        this.props.message.type = 'photo'
        this.props.message.photo = newDir //this.props.message.source
        this.props.message.source = path
        //fs.unlink(newDir).then(() => {
            this.props.replaceMessage(this.props.message)
            GState.downlading = false
       // })
    }
    toMB(data) {
        mb = 1000 * 1000
        return data / mb
    }
    cancelUpLoad() {
        this.exchanger.task.cancel((err, taskID) => {
            GState.downlading = false
            this.setStatePure({
                uploading: false
            })
        })
    }
    messageWidth=250
    render() {
        return (
            <View style={{width:this.messageWidth}}>
                <View>
                    <View>
                        <TouchableOpacity onPress={() => this.props.showPhoto(this.props.message.source)}>
                            <CacheImages style={{
                                 alignSelf: 'center',
                                width: this.messageWidth, height: 248,
                            }} source={{ uri: this.props.message.source }} 
                            borderRadius={5} thumbnails square large width={this.messageWidth}></CacheImages>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignSelf: 'center', position: 'absolute', marginTop: '45%', }}>
                        {this.state.loaded ? <View style={{ marginTop: 0 }}><View><Text
                            style={{ color: this.state.sender ? '#F8F7EE' : '#E1F8F9' }}>
                            {this.state.total.toFixed(2)} {"Mb"}</Text></View></View> :
                            <View style={{ marginTop: 1, }}>
                                <View style={{ ...buttoner, alignSelf: 'center', }}><AnimatedCircularProgress size={40}
                                    width={2}
                                    fill={this.state.uploadState}
                                    tintColor={this.state.error ? "red" : ColorList.bodyBackground}
                                    backgroundColor={this.transparent}>
                                    {
                                        (fill) => (<View>
                                            {this.state.uploading ? <TouchableWithoutFeedback onPress={() => this.cancelUpLoad(this.props.message.source)}>
                                                <View>
                                                    <EvilIcons type="EvilIcons" style={{...GState.defaultIconSize, color: ColorList.bodyBackground }} name="close"/>
                                                </View>
                                            </TouchableWithoutFeedback> : <TouchableWithoutFeedback onPress={() => this.uploadPhoto()}>
                                                    <View>
                                                    <EvilIcons type="EvilIcons" style={{ ...GState.defaultIconSize, color: ColorList.bodyBackground }} name="arrow-up"/>
                                                    </View>

                                                </TouchableWithoutFeedback>}
                                        </View>)
                                    }
                                </AnimatedCircularProgress></View>
                                <View style={{ marginTop: "15%", ...buttoner, width: 85, height: 25, }}><Text style={{ color: ColorList.bodyBackground }} note>{"("}{this.toMB(this.state.received).toFixed(1)}{"/"}
                                    {this.toMB(this.state.total).toFixed(1)}{")Mb"}</Text></View></View>}</View>
                </View>
                <View>
                    {this.props.message.text ? <TextContent text={this.props.message.text} 
                    tags={this.props.message.tags} ></TextContent> : null}
                </View>
            </View>
        );
    }
}