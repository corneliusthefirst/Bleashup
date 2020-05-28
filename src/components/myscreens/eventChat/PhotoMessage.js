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
import FileExachange from '../../../services/FileExchange';
import testForURL from '../../../services/testForURL';
import stores from "../../../stores";

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
        if (testForURL(this.props.message.photo)) {
            this.exchanger = new FileExachange(this.props.message.photo, this.path, 0, 0, (received, total) => {

            }, (dir, received, total) => {
                stores.Messages.replaceMessage(this.props.room,{ ...this.props.message, photo: 'file://' + dir }).then(() => {

                })
            }, (error) => {
                console.warn(error)
            })
            this.exchanger.download(0, 0)
        } else {
        }
    }
    path = '/Photo/' + this.props.message.filename
    render() {
        return (
            <View style={{ minHeight: 250, width: 300, marginLeft: this.props.sender ? "-1.2%" : "1%",marginTop: '1%', }}>
                <TouchableWithoutFeedback
                    onLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null}
                    onPressIn={() => {
                        this.props.pressingIn()
                    }}
                    onPress={() => this.props.showPhoto(this.props.message.photo)}>
                    <CacheImages hasJoin onOpen={() => { }}
                        source={{ uri: this.props.message.photo }} square thumbnails style={{ alignSelf: 'flex-start', width: 295, height: 248, }} borderRadius={5}>
                    </CacheImages>
                </TouchableWithoutFeedback>
                {this.props.message.text ?
                    <View style={{ marginBottom: "2%", marginTop: '2%', alignSelf: this.props.sender ? "flex-start" : "flex-end", }}>
                        <TextContent tags={this.props.message.tags} onLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null} pressingIn={() => this.props.pressingIn()} text={this.props.message.text}></TextContent>
                    </View> : null}

            </View>
        );
    }


}