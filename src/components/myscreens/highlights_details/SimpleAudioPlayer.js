import React, { Component } from 'react';

import { View, Slider, TouchableOpacity  } from "react-native"
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Sound from 'react-native-sound';
import BarIndicat from '../../BarIndicat';
import { BarIndicator } from "react-native-indicators"
import converToHMS from './convertToHMS';
import {Text,Icon,Right} from "native-base"


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
    componentWillMount() {
        this.props.url.audio ? this.initialisePlayer(this.props.url.audio) : null
    }
    pause() {
        this.setState({
            playing: false
        })
        this.player.pause()
    }
    initialisePlayer(source) {
        console.warn(source)
        this.player = new Sound(source, '', (error) => {
            console.warn(error)
        })
    }
    plays() {
        this.setState({
            playing: true
        })
        if (this.props.url.duration) {
            let refreshID = setInterval(() => {
                this.player.getCurrentTime(time => {
                    if (this.previousTime == time) clearInterval(refreshID)
                    else {
                        this.previousTime = time
                        this.setState({
                            currentPosition: time / this.props.url.duration,
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
                    this.props.url.duration = Math.floor(seconds)
                    this.setState({
                        playing: false,
                        currentPosition: seconds / this.props.url.duration,
                        currentTime: seconds
                    })
                    this.room.addurl.duration(seconds).then(status => {
                        //this.player.release()
                    })
                })
            }
        })
    }

    render() {
        return (
            <View>
                <View style={{ disply: 'flex', flexDirection: 'row', minWidth: 283, maxWidth: "86%", minHeight: 50, }}>
                    {this.props.url.duration ? <View style={textStyle}>
                        <View><Slider value={this.state.currentPosition} onValueChange={(value) => {
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
                    </View> : <View style={{ textStyleD }}>{!this.state.playing ? <BarIndicat animating={false}
                        color={"#1FABAB"} size={30} count={20} ></BarIndicat> : <BarIndicator color={"#1FABAB"} size={30} count={20}></BarIndicator>}</View>}
                    <View style={{ marginTop: this.props.url.duration ? "3%" : '1%', }}>
                        <AnimatedCircularProgress
                            size={40}
                            width={3}
                            fill={100}
                            tintColor={"#1FABAB"}
                            backgroundColor={'#F8F7EE'}>
                            {
                                (fill) => (
                                    <View style={{ marginTop: "-5%" }}>
                                        {!this.state.playing ? <TouchableOpacity
                                            onPress={() => requestAnimationFrame(() => this.plays())}>
                                            <Icon type="FontAwesome5" style={{ color: "#0A4E52", fontSize: 20 }} name="play">
                                            </Icon>
                                        </TouchableOpacity> : <TouchableOpacity onPress={() => requestAnimationFrame(() => this.pause())}>
                                                <Icon type="FontAwesome5" style={{ color: "#0A4E52", fontSize: 20 }} name="pause">
                                                </Icon>
                                            </TouchableOpacity>}
                                    </View>
                                )
                            }
                        </AnimatedCircularProgress></View>
                </View>
            </View>
        )
    }
}
