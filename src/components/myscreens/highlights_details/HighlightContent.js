/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, TouchableOpacity, Dimensions, Text } from "react-native"
import TextContent from '../eventChat/TextContent';
import converToHMS from './convertToHMS';
import SimpleAudioPlayer from './SimpleAudioPlayer';
import shadower from '../../shadower';
import CacheImages from '../../CacheImages';
import testForURL from '../../../services/testForURL';
import buttoner from '../../../services/buttoner';
import ColorList from '../../colorList';
import  Ionicons  from 'react-native-vector-icons/Ionicons';

let { height, width } = Dimensions.get('window');

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
            <TouchableWithoutFeedback onPressIn={() => this.props.PressingIn()} style={{width:'100%',backgroundColor:'green' }}>
                <View style={{width:'100%'}}>
                        {
                            this.props.highlight.url && this.props.highlight.url.audio ? <View style={{ backgroundColor: '#1FABAB', ...shadower(3), margin: '1%', borderRadius: 5, width: "100%" }}>
                                <SimpleAudioPlayer url={this.props.highlight.url}></SimpleAudioPlayer>
                            </View> : null
                        }
                        {this.props.highlight.url &&
                            (this.props.highlight.url.photo && testForURL(this.props.highlight.url.photo) ||
                                this.props.highlight.url.video && testForURL(this.props.highlight.url.video)) ?
                             <TouchableWithoutFeedback onPress={() =>
                                requestAnimationFrame(() => this.props.highlight.url.video ?
                                    this.props.showVideo(this.props.highlight.url.video) :
                                    this.props.showPhoto(this.props.highlight.url.photo))} style={{ width:'100%',borderRadius: 8, alignSelf: 'center', justifyContent:"center",alignItems:"center"}}>
                                <View style={{
                                    width:'100%',borderRadius: 8, alignSelf: 'center', justifyContent:"center",alignItems:"center"
                                }}>
                                    {this.props.highlight.url.photo && testForURL(this.props.highlight.url.photo) ? <CacheImages thumbnails square style={{
                                        width:  '98%',
                                        height: 300,
                                        borderRadius: 8,
                                    }} source={{ uri: this.props.highlight.url.photo }} >
                                    </CacheImages> : null}
                                    {this.props.highlight.url.video && testForURL(this.props.highlight.url.video)  ?
                                        <View style={{ position: 'absolute',...buttoner }}>
                                               <Ionicons onPress={() => {
                                                    this.props.showVideo(this.props.highlight.url.video)
                                                }} style={{ fontSize: 43,color:ColorList.headerBackground
                                            }} type={'Ionicons'} name={'ios-play'}>
                                            </Ionicons>
                                        </View> : null
                                    }
                                </View>
                             </TouchableWithoutFeedback> : null
                        }
                        {this.props.highlight.description ?
                            <View style={{ margin: '1%', }}>
                                <TextContent modal={this.props.modal} text={this.props.highlight.description}></TextContent>
                            </View> : null
                        }
                    
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
