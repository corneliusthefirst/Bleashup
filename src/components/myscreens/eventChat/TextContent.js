import React, { Component } from "react"
import { View, TouchableOpacity } from 'react-native'
import {Text} from "native-base"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
export default class TextContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            splicer:500
        }
    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={() => this.setState({
                splicer: this.state.splicer == this.props.text.length
                    ? 500 : this.props.text.length
            })}>
                <View>
                    <Text styles={{
                        justifyContent: 'center',
                        fontSize: 8,
                        backgroundColor: this.state.sender ? '#FFBFB2' : '#C1FFF2',
                    }}>
                        {this.props.text/*this.props.text.slice(0, this.state.splicer)}{"  "}{this.props.text.length >= 
                        this.state.splicer ? this.state.splicer == this.props.text.length ? "" : " .... ...." : ""*/}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}