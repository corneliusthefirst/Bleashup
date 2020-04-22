import React, { Component } from 'react';

import { View, Slider, TouchableOpacity } from "react-native"
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Sound from 'react-native-sound';
import BarIndicat from '../../BarIndicat';
import { BarIndicator } from "react-native-indicators"
import converToHMS from './convertToHMS';
import { Text, Icon, Right } from "native-base"
import Pickers from '../../../services/Picker';
import FileExachange from '../../../services/FileExchange';
import rnFetchBlob from 'rn-fetch-blob';
const AppDir = rnFetchBlob.fs.dirs.SDCardDir + '/Bleashup'

export default class SimpleAudioPlayer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTime: 0
        }
    }
    state = {

    }


    player = null
    componentDidMount() {
        this.initialisePlayer(this.props.url.audio).then((state) => {

        })
    }
    componentWillUnmount() {
        this.player && this.player.stop()
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.currentPosition !== nextState.currentPosition ||
            this.props.url.audio !== nextProps.url.audio ||
            this.state.playing !== nextState.playing
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return null
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.url.audio !== this.props.url.audio) {
            this.initialisePlayer(this.props.url.audio).then(state => {
                this.play(this.props.url)
            })
        }

    }
    pause() {
        this.setState({
            playing: false
        })
        this.player.pause()
    }
    initialisePlayer(source) {
        console.warn(source)
        return new Promise((resolve, reject) => {
            this.player ? this.player.stop() : null
            this.player = new Sound(source, '', (error) => {
                if (error) this.error = true
                resolve(error)
            })
        })
    }
    openFile(url) {
        Pickers.openFile(url)
    }
    
    play(url) {
       let file = this.props.url.audio.split('/').pop()
       let file_name = '/Others/' + this.file
       let full_path = AppDir + this.file_name
        if (this.error) {
            rnFetchBlob.fs.exists(full_path).then(stat => {
                if (stat) {
                    this.openFile(full_path)
                } else {
                    let exch = new FileExachange(url.audio, file_name, 0, 0, null, (dir, total, received) => {
                        this.openFile(dir)
                   })
                    exch.download(0, 0)
                }
            })

        } else {
            this.setState({
                playing: true
            })
            if (url.duration) {
                let refreshID = setInterval(() => {
                    this.player.getCurrentTime(time => {
                        if (this.previousTime == time) clearInterval(refreshID)
                        else {
                            this.previousTime = time
                            this.setState({
                                currentPosition: time / url.duration,
                                currentTime: time
                            })
                        }
                    })
                }, 1000)
            }
            this.player.play((success) => {
                console.warn(success, 'ppppp')
                if (success) {
                    this.player.getCurrentTime((seconds) => {
                        url.duration = Math.floor(seconds)
                        this.setState({
                            playing: false,
                            currentPosition: seconds / url.duration,
                            currentTime: seconds
                        })
                    })
                }
            })
        }
    }
    plays() {
        this.play(this.props.url)
    }

    render() {
        console.warn('rendering audio')
        textStyle = {
            width: "80%", margin: '2%', marginTop: "5%", display: 'flex', alignSelf: 'center',
            flexDirection: 'column',
        }
        textStyleD = {
            width: "80%", margin: '4%', paddingLeft: '10%', paddingRight: '20%', marginTop: "5%", display: 'flex', alignSelf: 'center',
            flexDirection: 'column',
        }
        return (
            <View>
                <View style={{ disply: 'flex', flexDirection: 'row', minWidth: 283, maxWidth: "86%", minHeight: 50, }}>
                    {this.props.url.duration ? <View style={textStyle}>
                        <View><Slider value={isNaN(this.state.currentPosition) ? 0 : this.state.currentPosition} onValueChange={(value) => {
                            this.player.setCurrentTime(value * this.props.url.duration)
                            this.setState({
                                currentPosition: value,
                                currentTime: value * this.props.url.duration
                            })
                        }}></Slider>
                            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'space-between', }}>
                                <Text>{converToHMS(Math.floor(this.state.currentTime))}</Text>
                                <Right><Text>{converToHMS(this.props.url.duration)}</Text></Right>
                            </View>
                        </View>
                    </View> : <View style={{ textStyleD }}>{/*!this.state.playing ? <BarIndicat animating={false}
                    color={"#1FABAB"} size={30} count={20} ></BarIndicat> : <BarIndicator color={"#1FABAB"} size={30} count={20}></BarIndicator>*/}</View>}
                    <View style={{ margin: '4%' }}>
                        {!this.state.playing ? <TouchableOpacity
                            onPress={() => requestAnimationFrame(() => this.plays())}>
                            <Icon type="FontAwesome5" style={{ color: "#0A4E52", fontSize: 20 }} name="play">
                            </Icon>
                        </TouchableOpacity> : <TouchableOpacity onPress={() => requestAnimationFrame(() => this.pause())}>
                                <Icon type="FontAwesome5" style={{ color: "#0A4E52", fontSize: 20 }} name="pause">
                                </Icon>
                            </TouchableOpacity>}
                    </View>
                </View>
            </View>
        )
    }
}
