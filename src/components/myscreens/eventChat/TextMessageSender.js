/* eslint-disable prettier/prettier */
import React, { PureComponent } from "react"
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, Vibration } from 'react-native';
import TextContent from "./TextContent";
import ColorList from '../../colorList';
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
    senderMessage() {
        let newMessage = { ...this.props.message, type: "text" }
        this.props.sendMessage(newMessage)
    }
    timeOut = null
    componentDidMount() {
    }
    transparent = "rgba(52, 52, 52, 0.0)";
    duration = 10
    pattern = [1000, 0, 0]
    render() {
        return (
            <TouchableWithoutFeedback onLongPress={this.props.onLongPress} onPressIn={() => this.senderMessage}>
                <View style={{ alignSelf: 'flex-start', borderColor: !this.state.sender ? ColorList.senTBoxColor : ColorList.receivedBox }}>
                    <TextContent
                        searchString={this.props.searchString}
                        //handleLongPress={this.props.onLongPress} 
                        tags={this.props.message.tags} text={this.props.message.text}></TextContent>
                </View></TouchableWithoutFeedback>
        );
    }
}