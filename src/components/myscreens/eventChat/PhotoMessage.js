import React, { Component } from "react"
import {
    View, TouchableOpacity,
    TouchableWithoutFeedback,
    Vibration, PanResponder
} from 'react-native';
import { Text } from 'native-base';
import TextContent from "./TextContent";
import Image from 'react-native-scalable-image';
import CacheImages from '../../CacheImages';

export default class PhotoMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sender: false,
            splicer: 500,
            creator: false,
            showTime: false,
            text: "",
            time: "",
        };
    }

    componentDidMount() {
        this.setState({
            text: this.props.message.text,
            url: this.props.message.photo,
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            creator: (this.props.message.sender.phone == this.props.creator)
        })
    }
    render() {
        return (
            <View style={{ minHeight: 250,width:300 }}>
                <TouchableWithoutFeedback 
                onLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null}
                onPressIn={() => {
                    this.props.pressingIn()
                }} 
                onPress={() => this.props.showPhoto(this.props.message.photo)}>
                    <CacheImages  hasJoin onOpen={() => { }}
                        source={{ uri: this.props.message.photo }} square thumbnails style={{ alignSelf: 'flex-start', width:295,height: 248, }} borderRadius={5}>
                    </CacheImages>
                </TouchableWithoutFeedback>
                {this.props.message.text ?
                    <View style={{ marginBottom: "2%",marginTop: '2%', }}>
                        <TextContent onLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null} pressingIn={() => this.props.pressingIn()} text={this.props.message.text}></TextContent>
                    </View> : null}

            </View>
        );
    }


}