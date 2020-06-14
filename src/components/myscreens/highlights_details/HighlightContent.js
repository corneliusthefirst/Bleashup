import React, { Component } from 'react';
import Image from "react-native-scalable-image"
import { View, TouchableWithoutFeedback, TouchableOpacity } from "react-native"
import { Icon, Button, Text, Right } from 'native-base';
import TextContent from '../eventChat/TextContent';
import converToHMS from './convertToHMS';
import SimpleAudioPlayer from './SimpleAudioPlayer';
import shadower from '../../shadower';
import CacheImages from '../../CacheImages';
import testForURL from '../../../services/testForURL';
import buttoner from '../../../services/buttoner';
import ColorList from '../../colorList';

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
                        {
                            this.props.highlight.url && this.props.highlight.url.audio ? <View style={{ backgroundColor: '#1FABAB', ...shadower(3), margin: '1%', borderRadius: 5, width: "80%" }}>
                                <SimpleAudioPlayer url={this.props.highlight.url}></SimpleAudioPlayer>
                            </View> : null
                        }
                        {this.props.highlight.url &&
                            (this.props.highlight.url.photo && testForURL(this.props.highlight.url.photo) ||
                                this.props.highlight.url.video && testForURL(this.props.highlight.url.video)) ?
                            this.props.modal ? <TouchableWithoutFeedback onPress={() =>
                                requestAnimationFrame(() => this.props.highlight.url.video ?
                                    this.props.showVideo(this.props.highlight.url.video) :
                                    this.props.showPhoto(this.props.highlight.url.photo))}>
                                <View style={{
                                    borderRadius: 10, alignSelf: 'center', margin: '4%', justifyContent:"center",alignItems:"center"
                                }}>
                                    {this.props.highlight.url.photo && testForURL(this.props.highlight.url.photo) ? <CacheImages thumbnails square style={{
                                        width: '97%',
                                        height: 300,
                                        borderRadius: 8,
                                    }} source={{ uri: this.props.highlight.url.photo }} width={360}>
                                    </CacheImages> : null}
                                    {this.props.highlight.url.video && testForURL(this.props.highlight.url.video)  ?
                                        <View style={{ position: 'absolute',...buttoner }}>
                                               <Icon onPress={() => {
                                                    this.props.showVideo(this.props.highlight.url.video)
                                                }} style={{ fontSize: 43,color:ColorList.headerBackground
                                            }} type={'Ionicons'} name={'ios-play'}></Icon>
                                        </View> : null
                                    }
                                </View>
                            </TouchableWithoutFeedback> : <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.highlight.url.video ? this.props.showVideo(this.props.highlight.url.video) : this.props.showPhoto(this.props.highlight.url.photo))}>
                                    <View style={{
                                        borderRadius: 10, alignSelf: 'center', margin: '4%',justifyContent:"center",alignItems:"center"
                                    }}>
                                        <CacheImages thumbnails square style={{
                                            width: '97%',
                                            height: 300,
                                            borderRadius: 8,
                                        }} source={{ uri: this.props.highlight.url.photo ? this.props.highlight.url.photo : this.props.highlight.url.video }} width={360}></CacheImages>
                                        {this.props.highlight.url.video ?
                                            <View style={{ position: 'absolute',...buttoner  }}>
                                                    <Icon style={{ fontSize: 43,color:ColorList.bodyBackground }} type="Ionicons" name="ios-play" onPress={() => {
                                                    this.props.highlight.url.video ? this.props.showVideo(this.props.highlight.url.video) : this.props.showPhoto(this.props.highlight.url.photo)
                                                }}></Icon>
                                            </View> : 
                                            null}

                                    </View>
                                </TouchableOpacity> : null
                        }
                        {this.props.highlight.description ?
                            <View style={{ margin: '1%', }}>
                                <TextContent modal={this.props.modal} color={"#FEFEDE"} text={this.props.highlight.description}></TextContent>
                            </View> : null
                        }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}