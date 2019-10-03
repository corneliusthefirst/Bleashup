import React, { Component } from "react"
import { View, TouchableOpacity, TouchableWithoutFeedback, Vibration } from 'react-native';
import { Text } from 'native-base';
import PhotoView from "../currentevents/components/PhotoView";
import TextContent from "./TextContent";

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
            <View style={{ padding: "3%" }}>
                <PhotoView hasJoin onOpen={() => { }}
                    photo={this.props.message.photo} style={{ alignSelf: 'center', }} width={290} height={340} borderRadius={5}>
                </PhotoView>
                {this.props.message.text ? 
                    <View>
                    <TextContent text={this.props.message.text}></TextContent>
                    </View> : null}

            </View>
        );
    }


}