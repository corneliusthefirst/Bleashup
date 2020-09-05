import React, { Component } from "react"
import {
    View, TouchableOpacity,
    TouchableWithoutFeedback,
    Vibration, PanResponder,
    Text 
} from 'react-native';
import TextContent from "./TextContent";
import CacheImages from '../../CacheImages';
import FileExachange from '../../../services/FileExchange';
import testForURL from '../../../services/testForURL';
import stores from "../../../stores";
import BePureComponent from '../../BePureComponent';

export default class PhotoMessage extends BePureComponent {
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
    getPhotoSmall() {
        return this.props.message.sender && stores.LoginStore.user.phone.replace("00", "+") === this.props.message.sender.phone ?
            this.props.message.source :
            this.props.message.photo
    }
    messageWidth = 250
    path = '/Photo/' + this.props.message.filename
    render() {
        return (
            <View style={{ minHeight: 250, width: this.messageWidth, marginTop: '1%', }}>
                <TouchableOpacity
                    onPressIn={this.props.pressingIn}
                    //onLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null}
                    onPress={() => this.props.showPhoto(this.props.message.photo)}>
                    <CacheImages hasJoin onOpen={() => { }}
                        source={{ uri: this.getPhotoSmall() }} square thumbnails style={{ alignSelf: 'flex-start', width: this.messageWidth, height: 248, }} borderRadius={5}>
                    </CacheImages>
                </TouchableOpacity>
                {this.props.message.text ?
                    <View style={{ alignSelf: 'flex-start', }}>
                        <TextContent 
                        tags={this.props.message.tags} 
                        //handleLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null} 
                        pressingIn={() => this.props.pressingIn()} text={this.props.message.text}></TextContent>
                    </View> : null}

            </View>
        );
    }


}