import React, { PureComponent } from "react"
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, Vibration } from 'react-native';
import { Text } from "native-base"
import TextContent from "./TextContent";
export default class TextMessageSnder extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            sender: false,
            splicer: 500,
            showTime: false,
            creator: false,
            text: "",
            time: ""
        };
        this.senderMessage()
    }
   senderMessage(){
       let newMessage = {...this.props.message,type:"text"}
       this.props.sendMessage(newMessage)
   }
   timeOut = null
    componentDidMount() {
        this.setState({
            text: this.props.message.text,
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            creator: (this.props.message.sender.phone == this.props.creator)
        })
    }
    transparent = "rgba(52, 52, 52, 0.0)";
    duration = 10
    pattern = [1000, 0, 0]
    render() {
        return (
            <TouchableWithoutFeedback onPressIn={()=> this.senderMessage}>
            <View style={{ alignSelf: 'center', }}>
                <TextContent text={this.props.message.text}></TextContent>
                </View></TouchableWithoutFeedback>
        );
    }
}