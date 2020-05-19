import React, { Component } from "react"
import { View, TouchableOpacity,PanResponder } from 'react-native'
import { Text } from "native-base"
import Hyperlink from 'react-native-hyperlink'
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
export default class TextContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            splicer: 500,
            notShowingAll: true,
        }
    }
    fontSizeFormular() {
        return this.props.text && this.testForImoji(this.props.text) ? 100 : 16
    }
    testForImoji(message) {
        let imoji = message.match(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug)
        return imoji && imoji.length == 1 && message.length == imoji[0].length
    }
    render() {
        //console.warn(this.props.text.length,this.props.text)
        return (
            <TouchableOpacity onPressIn={() => {
                this.props.pressingIn ? this.props.pressingIn() : null
            }} onPress={() =>
                this.setState({
                    notShowingAll: !this.state.notShowingAll
                })
            } onLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null}>
                <View>
                    <Hyperlink linkStyle={{ color: '#2980b9', }} linkDefault={true}>
                        <Text ellipsizeMode={this.state.notShowingAll ? 'tail' : null} numberOfLines={this.state.notShowingAll ? 25 : null} style={{
                            justifyContent: 'center',
                            fontSize: this.fontSizeFormular(),
                            color: '#555756'
                            //backgroundColor: this.state.sender ? '#FFBFB2' : '#C1FFF2',
                        }}>
                            {this.props.text}
                        </Text>
                    </Hyperlink>
                </View>
            </TouchableOpacity>
        )
    }
}