import React, { Component } from "react"
import { View, TouchableOpacity, TouchableWithoutFeedback, Vibration } from 'react-native';
import { Text } from 'native-base';
import TextContent from "./TextContent";
import Image from 'react-native-scalable-image';

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
            <View style={{ padding: "1%" }}>
            <TouchableOpacity onPress={()=> this.props.showPhoto(this.props.message.photo)}>
                    <Image resizeMode={"contain"} hasJoin onOpen={() => { }}
                        source={{ uri: this.props.message.photo }} style={{ alignSelf: 'center', }} width={290} borderRadius={20}>
                    </Image>
            </TouchableOpacity>
                {this.props.message.text ? 
                    <View style={{marginLeft:"3%",marginBottom: "2%",}}>
                    <TextContent text={this.props.message.text}></TextContent>
                    </View> : null}

            </View>
        );
    }


}