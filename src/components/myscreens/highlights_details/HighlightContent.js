import React, { Component } from 'react';
import Image from "react-native-scalable-image"
import { View, TouchableWithoutFeedback, Slider } from "react-native"
import { Icon, Button, Text, Right } from 'native-base';
import TextContent from '../eventChat/TextContent';
import { TouchableOpacity } from 'react-native-gesture-handler';
import converToHMS from './convertToHMS';
import SimpleAudioPlayer from './SimpleAudioPlayer';

export default class HighlightContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTime: 0
        }
    }
    state = {

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
                                <SimpleAudioPlayer url={this.props.highlight.url}></SimpleAudioPlayer>
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