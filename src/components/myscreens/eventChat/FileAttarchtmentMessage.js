
import React, { Component } from 'react';

import {
    StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, Vibration, Platform, TouchableWithoutFeedback
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import GState from '../../../stores/globalState';
import testForURL from '../../../services/testForURL';
import FileExachange from '../../../services/FileExchange';
import Pickers from '../../../services/Picker';
import stores from '../../../stores';
import ColorList from '../../colorList';
import TextContent from './TextContent';
import BePureComponent from '../../BePureComponent';
import  EvilIcons  from 'react-native-vector-icons/EvilIcons';
import  FontAwesome  from 'react-native-vector-icons/FontAwesome';

export default class FileAttarchementMessaege extends BePureComponent {
    constructor(props) {
        super(props);
        this.state = {
            duration: 0,
            currentPosition: 0,
            currentTime: 0,
            downloadState: 0,
            loaded: false
        }
    }
    setAfterSuccess(path) {
        GState.downlading = false
        this.props.message.source = Platform.OS === 'android' ? path + "/" : '' + path
        stores.Messages.addStaticFilePath(this.props.room,this.props.message.source, this.props.message.id).then(() => {
            stores.Messages.addAudioSizeProperties(this.props.room,this.props.message.id, this.props.message.total,
                this.props.message.received, this.props.message.duration).then(() => {
                    this.setStatePure({
                        loaded: true,
                        downlading: false
                    })
                })
        })
    }
    room = null
    path = '/Others/' + this.props.message.file_name
    duration = 10
    pattern = [1000, 0, 0]
    downloadID = null
    download(url) {
        clearInterval(this.downloadID)
        this.setStatePure({
            downloading: true
        })
        GState.downlading = true
        this.exchanger.download(this.state.received, this.state.total)
    }
    downloadFile(url) {
        this.downloadID = setInterval(() => {
            if (!GState.downlading)
                this.download(url)
        }, 500)

    }
    openFile() {
        Pickers.openFile(this.props.message.source)
    }
    componentDidMount() {
        this.setStatePure({
            duration: null,
            currentPosition: 0,
            playing: false,
            received: this.props.message.received,
            total: this.props.message.total,
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            creator: (this.props.message.sender.phone == this.props.creator)
        })
        this.exchanger = new FileExachange(this.props.message.source,
            this.path, this.state.total,
            this.state.received,
            this.progress.bind(this),
            this.success.bind(this), this.onFailed.bind(this),
            this.onError.bind(this))
    }
    task = null
    previousTime = 0
    cancelDownLoad(url) {
        this.exchanger.task.cancel((err, taskID) => {
            this.setStatePure({ downloading: false })
        })
        stores.Messages.SetCancledState(this.props.room,this.props.message.id)
    }
    toMB(data) {
        mb = 1000 * 1000
        return data / mb
    }
    progress(received, total) {
        let newTotal = this.state.total && this.state.total > 0 && this.state.total > total ? this.state.total : total
        newTotal = parseInt(newTotal)
        this.setStatePure({
            downloadState: (received / newTotal) * 100,
            total: newTotal, received: received
        })
    }
    success(path, total, received) {
        this.props.message.received = this.state.receive
        // this.props.message.source = path
        this.props.message.total = this.state.total
        this.setAfterSuccess(path, total * 1000 * 1000, received * 1000 * 1000)
    }
    onFailed(received, total) {
        console.warn("failing")
        GState.downlading = false
        this.props.message.received = received
        this.props.message.total = total
        stores.Messages.addAudioSizeProperties(this.props.room,this.props.message.id,
            total, received).then(() => {
                console.warn("setting failed state")
                this.setStatePure({
                    downloading: false
                })
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
    render() {
        textStyle = {
            width: "80%", margin: '2%', marginTop: "5%", display: 'flex', alignSelf: 'center',
            flexDirection: 'column',
        }
        return (
            <View>
                <View style={{ 
                marginTop: 2,
                borderRadius: 5,
                disply: 'flex', 
                flexDirection: 'row', 
                width: "99%",
                alignSelf: 'center',
                backgroundColor: ColorList.bottunerLighter, }}>
                    <View style={textStyle}>
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'space-between', }}>
                                <View style={{ width: "65%" }}>
                                    <Text elipsizeMode={'tail'} numberOfLines={4} style={{}}>{this.props.message.file_name}</Text>
                                </View>
                                <View style={{ width: '35%' }}><Text elipsizeMode={"tail"} numberOfLines={1}
                                    style={{ fontSize: 30, color: ColorList.bodyText, alignSelf: 'flex-start' 
                                }}>{this.props.message.file_name.split(".").pop().toUpperCase()}</Text></View>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: "3%", marginLeft: "-5%", width: '20%', }}>
                        {testForURL(this.props.message.source) ? <View style={{ alignSelf: 'center',}}><AnimatedCircularProgress
                            size={40}
                            width={3}
                            fill={testForURL(this.props.message.source) ? this.state.downloadState : 100}
                            tintColor={ColorList.indicatorColor}
                            backgroundColor={ColorList.indicatorInverted}>
                            {
                                (fill) => (
                                    <View style={{ marginTop: "-2%" }}>
                                        <TouchableOpacity onPress={() => this.state.downloading ? this.cancelDownLoad(this.props.message.source) :
                                            this.downloadFile(this.props.message.source)}>
                                            <View>
                                                <EvilIcons style={{...GState.defaultIconSize, color: ColorList.bodyText }} type="EvilIcons"
                                                    name={this.state.downloading ? "close" : "arrow-down"}/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </AnimatedCircularProgress></View> : <TouchableOpacity
                            onPress={() => requestAnimationFrame(() => this.openFile())}>
                                <FontAwesome type="FontAwesome" style={{ color: ColorList.bodyText, fontSize: 22,alignSelf:'center',justifyContent: 'center', }} name="folder-open"/>
                            </TouchableOpacity>}<View>
                            {!testForURL(this.props.message.source) ? <Text style={{alignSelf: 'center',}}>{this.toMB(this.state.total).toFixed(1)}{"Mb"}</Text> :
                                <Text style={{ fontSize: 10,alignSelf: 'center',justifyContent: 'center', }} note>{"("}{this.toMB(isNaN(this.state.received) ? 0 : this.state.received).toFixed(1)}{"/"}
                                    {this.toMB(this.state.total).toFixed(1)}{")Mb"}</Text>}</View></View>
                </View>
                {this.props.message.text ? <TextContent
                    foundString={this.props.foundString} 
                    animate={this.props.animate}
                    searchString={this.props.searchString}
                    //handleLongPress={this.props.handleLongPress}
                    pressingIn={this.props.pressingIn} text={this.props.message.text}
                    tags={this.props.message.tags}></TextContent> : null}
            </View>
        );
    }
}
