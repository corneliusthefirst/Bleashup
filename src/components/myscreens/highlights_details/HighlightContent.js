import React, { Component } from 'react';
import Image from "react-native-scalable-image"
import { View, TouchableWithoutFeedback, Slider } from "react-native"
import { Icon, Button, Text, Right } from 'native-base';
import Sound from 'react-native-sound';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import BarIndicat from '../../BarIndicat';
import { BarIndicator } from "react-native-indicators"
import TextContent from '../eventChat/TextContent';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class HighlightContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTime: 0
        }
    }
    state = {

    }
    player = null
    convertToHMS(secs) {
        var sec_num = parseInt(secs, 10)
        var hours = Math.floor(sec_num / 3600)
        var minutes = Math.floor(sec_num / 60) % 60
        var seconds = sec_num % 60

        return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")

    }
    componentWillMount() {
        this.props.highlight.url.audio ? this.initialisePlayer(this.props.highlight.url.audio) : null
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
        if (this.props.highlight.url.duration) {
            let refreshID = setInterval(() => {
                this.player.getCurrentTime(time => {
                    if (this.previousTime == time) clearInterval(refreshID)
                    else {
                        this.previousTime = time
                        this.setState({
                            currentPosition: time / this.props.highlight.url.duration,
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
                    this.props.highlight.url.duration = Math.floor(seconds)
                    this.setState({
                        playing: false,
                        currentPosition: seconds / this.props.highlight.url.duration,
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
        textStyle = {
            width: "80%", margin: '2%', marginTop: "5%", display: 'flex', alignSelf: 'center',
            flexDirection: 'column',
        }
        textStyleD = {
            width: "80%", margin: '4%', paddingLeft: '10%', paddingRight: '20%', marginTop: "5%", display: 'flex', alignSelf: 'center',
            flexDirection: 'column',
        }
        return (
            <TouchableWithoutFeedback onPressIn={() => this.props.PressingIn()}>
                <View style={{ margin: '1%', }}>
                    <View>
                        {this.props.highlight.url.photo || this.props.highlight.url.video ?
                            <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.highlight.url.video ? this.props.showVideo(this.props.highlight.url.video) : this.props.showPhoto(this.props.highlight.url.photo))}>
                                <View style={{
                                    borderRadius: 10, alignSelf: 'center', margin: '4%',
                                }}>
                                    <Image style={{
                                        width: '97%',
                                        height: 300,
                                        borderRadius: 8,
                                    }} source={{ uri: this.props.highlight.url.photo ? this.props.highlight.url.photo : this.props.highlight.url.video }} width={360}></Image>
                                    {this.props.highlight.url.video ?
                                        <View style={{ position: 'absolute', marginTop: "25%", marginLeft: '43%', }}>
                                            <Button transparent>
                                                <Icon style={{ fontSize: 50, }} type={'EvilIcons'} name={'play'}></Icon>
                                            </Button>
                                        </View> : null
                                    }
                                </View>
                            </TouchableOpacity> : null
                        }
                        {
                            this.props.highlight.url.audio ? <View>
                                <View style={{ disply: 'flex', flexDirection: 'row', minWidth: 283, maxWidth: "86%", minHeight: 50, }}>
                                    {this.props.highlight.url.duration ? <View style={textStyle}>
                                        <View><Slider value={this.state.currentPosition} onValueChange={(value) => {
                                            this.player.setCurrentTime(value * this.props.highlight.url.duration)
                                            this.setState({
                                                currentPosition: value,
                                                currentTime: value * this.props.highlight.url.duration
                                            })
                                        }}></Slider>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'space-between', }}>
                                                <Text>{this.convertToHMS(Math.floor(this.state.currentTime))}</Text>
                                                <Right><Text>{this.convertToHMS(this.props.highlight.url.duration)}</Text></Right>
                                            </View>
                                        </View>
                                    </View> : <View style={{ textStyleD }}>{!this.state.playing ? <BarIndicat animating={false}
                                        color={"#1FABAB"} size={30} count={20} ></BarIndicat> : <BarIndicator color={"#1FABAB"} size={30} count={20}></BarIndicator>}</View>}
                                    <View style={{ marginTop: this.props.highlight.url.duration ? "3%" : '1%', }}>
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
                            </View> : null
                        }
                        {this.props.highlight.description ?
                            <View style={{ margin: '1%', }}>
                                <TextContent color={"#FEFEDE"} text={this.props.highlight.description.split(' ').length > 200 ? this.props.highlight.description.split(' ').slice(0, 300).join(' ') : this.props.highlight.description}></TextContent>
                            </View> : null
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}