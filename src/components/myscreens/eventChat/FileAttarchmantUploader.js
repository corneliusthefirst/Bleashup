
import React, { Component } from 'react';

import {
    StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Vibration, Platform, TouchableWithoutFeedback
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import GState from '../../../stores/globalState';
import FileViewer from 'react-native-file-viewer';
import FileExachange from '../../../services/FileExchange';
import rnFetchBlob from 'rn-fetch-blob';
import stores from '../../../stores';
import TextContent from './TextContent';
import ColorList from '../../colorList';
import BePureComponent from '../../BePureComponent';
import EvilIcons  from 'react-native-vector-icons/EvilIcons';
import  FontAwesome  from 'react-native-vector-icons/FontAwesome';
const { fs } = rnFetchBlob
export default class FileAttarchementUploader extends BePureComponent {
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
        this.setStatePure({
            total: parseInt(total),
            received: parseInt(writen),
            uploadState: (parseInt(writen) / parseInt(total)) * 100
        })
    }
    onSuccess(newDir, path, filename) {
        this.setStatePure({
            uploadState: 100,
            loaded: true,
            downloading: false
        })
        fs.unlink(newDir, () => { })
        this.props.message.type = 'attachement'
        ///this.props.message.thumbnailSource = this.baseURL + response.data.split('.')[0] + '_thumbnail.jpeg'
        this.props.replaceMessage({ ...this.props.message, source: path, temp: path, received: this.state.total })
    }
    onError(error) {
        console.warn(error)
        this.setStatePure({
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
        this.setStatePure({
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
            this.props.message.file_name, '/other', true)
        setTimeout(() => {
            this.uploadFile()
        }, 500)
    }
    task = null
    previousTime = 0
    cancelUpLoad(url) {
        this.exchanger.task.cancel((err, taskID) => {
            this.setStatePure({ downloading: false })
        })
        stores.Messages.SetCancledState(this.props.room, this.props.message.id).then(() => {

        })
        this.setStatePure({
            downloading: false
        })
    }
    toMB(data) {
        mb = 1000 * 1000
        return data / mb
    }
    render() {
        return (
            <View>
                <TouchableOpacity //onLongPress={this.props.onLongPress} 
                style={{
                    marginTop: 2,
                    borderRadius: 5,
                    disply: 'flex',
                    flexDirection: 'row',
                    width: "99%",
                    alignSelf: 'center',
                    backgroundColor: ColorList.bottunerLighter,}}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'space-between', width: '81%' }}>
                        <View style={{ width: "60%",marginBottom: 'auto',marginTop: 'auto', }}>
                            <Text style={{}}>{this.props.message.file_name}</Text>
                        </View>
                        <View style={{width:'40%',marginBottom: 'auto',marginTop: 'auto',}}>
                        <Text elipsizeMode={"tail"} numberOfLines={1} style={{ fontSize: 30, color: ColorList.bodyText 
                            }}>{this.props.message.file_name.split(".").pop().toUpperCase()}</Text></View>
                    </View>
                    <View style={{ width: "19%", alignSelf: 'flex-end',marginBottom: 2, }}>
                        <AnimatedCircularProgress
                            size={40}
                            width={3}
                            fill={this.state.uploadState}
                            tintColor={ColorList.indicatorColor}
                            backgroundColor={ColorList.indicatorInverted}>
                            {
                                (fill) => (
                                    <View>
                                        {!this.state.loaded ?
                                            <TouchableOpacity onPress={() => this.state.downloading ? this.cancelUpLoad(this.props.message.source) :
                                                this.uploadFile(this.props.message.source)}>
                                                <View>
                                                    <EvilIcons style={{ ...GState.defaultIconSize,color: ColorList.bodyText }} type="EvilIcons"
                                                        name={this.state.downloading ? "close" : "arrow-up"}/>
                                                </View>
                                                <View style={{ position: 'absolute', marginTop: '-103%', marginLeft: '-14%', }}>
                                                </View>
                                            </TouchableOpacity> : <TouchableOpacity
                                                onPress={() => requestAnimationFrame(() => this.openFile())}>
                                                <FontAwesome type="FontAwesome" style={{ color: ColorList.bodyText, fontSize: 22 }} name="folder-open"/>
                                            </TouchableOpacity>}
                                    </View>
                                )
                            }
                        </AnimatedCircularProgress><View>
                            {this.state.loaded ? <Text>{this.toMB(this.state.total).toFixed(1)}{"Mb"}</Text> :
                                <Text style={{ fontSize: 10 }} note>{"("}{this.toMB(this.state.received).toFixed(1)}{"/"}
                                    {this.toMB(this.state.total).toFixed(1)}{")Mb"}</Text>}</View></View>
                </TouchableOpacity>
                {this.props.message.text?<TextContent
                    animate={this.props.animate}
                    searchString={this.props.searchString}
                    foundString={this.props.foundString}
                    //handleLongPress={this.props.onLongPress}
                    pressingIn={this.props.pressingIn} text={this.props.message.text} 
                    tags={this.props.message.tags}></TextContent>:null}
            </View>
        );
    }
}
