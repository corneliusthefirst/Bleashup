import React, { PureComponent } from "react"
import { StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback, View, Vibration } from 'react-native';
import TextContent from "./TextContent";
export default class TextMessage extends PureComponent {
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
    }


    componentDidMount() {
       
    }
    transparent = "rgba(52, 52, 52, 0.0)";
    duration = 10
    pattern = [1000, 0, 0]
    render() {
        return (
            <View style={{alignSelf: "flex-start",}}>
                <TextContent tags={this.props.message.tags} 
                //handleLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null} 
                pressingIn={() => this.props.pressingIn()} 
                text={this.props.message.text}></TextContent>
            </View>
        );
    }
}