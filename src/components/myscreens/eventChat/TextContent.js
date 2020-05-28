import React, { Component } from "react"
import {
    View, TouchableOpacity, PanResponder, Linking, Vibration,
    Clipboard, StyleSheet
} from 'react-native'
import { Text, Toast } from "native-base"
import Hyperlink from 'react-native-hyperlink'
import ParsedText from 'react-native-parsed-text';
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import openLink from "../event/createEvent/components/openLinkOnBrowser";
import ColorList from '../../colorList';
export default class TextContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            splicer: 500,
            notShowingAll: true,
        }
    }
    handleUrlPress(url, matchIndex /*: number*/) {
        openLink(url)
    }
    copyToClipboard(phone) {
        Clipboard.setString(phone)
        Vibration.vibrate(10)
        Toast.show({ text: 'copied to clipboard !' })
    }

    handlePhonePress(phone, matchIndex /*: number*/) {
        this.copyToClipboard(phone)
    }

    handleNamePress(name, matchIndex /*: number*/) {
        console.warn(name)
    }

    handleEmailPress(email, matchIndex /*: number*/) {
        this.copyToClipboard(email)
    }

    renderText(matchingString, matches) {
        // matches => ["[@michel:5455345]", "@michel", "5455345"]
        let pattern = /\[(@[^:]+):([^\]]+)\]/i;
        let match = matchingString.match(pattern);
        return `^^${match[1]}^^`;
    }
    fontSizeFormular() {
        return this.props.text && this.testForImoji(this.props.text) ? 100 : 16
    }
    testForImoji(message) {
        let imoji = message.match(/[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug)
        return imoji && imoji.length == 1 && message.length == imoji[0].length
    }
    renderBoldText(text) {
        return this.removeMatch(text, "*")
    }
    removeMatch(text, match) {
        return text.split(match)[1]
    }
    renderItalicText(text) {
        return this.removeMatch(text, "_")
    }
    renderStrickenText(text) {
        return this.removeMatch(text, "~")
    }
    String_toRegExp(pattern, flags) {
        return new RegExp(pattern, "i");
    }
    render() {
        //console.warn(this.props.text.length,this.props.text)
        return (
            <TouchableOpacity onLongPress={() => this.props.handleLongPress ? this.props.handleLongPress() : null} onPressIn={() => {
                this.props.pressingIn ? this.props.pressingIn() : null
            }} onPress={() =>
                this.setState({
                    notShowingAll: !this.state.notShowingAll
                })
            }>
                <View>
                    <ParsedText style={this.props.style || {
                        justifyContent: 'center',
                        fontSize: this.fontSizeFormular(),
                        color: '#555756'
                        //backgroundColor: this.state.sender ? '#FFBFB2' : '#C1FFF2',
                    }} ellipsizeMode={this.state.notShowingAll ? 'tail' : null} numberOfLines={this.state.notShowingAll ? this.props.numberOfLines || 25 : null}
                        parse={
                            [
                                { type: 'url', style: styles.url, onPress: this.handleUrlPress.bind(this) },
                                { type: 'phone', style: styles.phone, onPress: this.handlePhonePress.bind(this) },
                                { type: 'email', style: styles.email, onPress: this.handleEmailPress.bind(this) },
                                this.props.tags ? {
                                    pattern: this.String_toRegExp(this.props.tags.map(ele => ele.nickname).join("|")),
                                    style: styles.name, onPress: this.handleNamePress.bind(this)
                                } :
                                    {
                                        pattern: /\[(@[^:]+):([^\]]+)\]/i, style: styles.username, onPress: this.handleNamePress.bind(this),
                                        renderText: this.renderText
                                    },
                                { pattern: /^\d+$/, style: styles.phone, onPress: this.handlePhonePress.bind(this) },
                                { pattern: /42/, style: styles.magicNumber },
                                { pattern: /\*(\w+)\*/, style: styles.boldText, renderText: this.renderBoldText.bind(this) },
                                { pattern: /\_(\w+)\_/, style: styles.italicStyle, renderText: this.renderItalicText.bind(this) },
                                { pattern: /\~(\w+)\~/, style: styles.strikesText, renderText: this.renderStrickenText.bind(this) },
                                { pattern: /#(\w+)/, style: styles.hashTag },
                            ]
                        }
                        childrenProps={{ allowFontScaling: false }}
                    >
                        {this.props.text}
                    </ParsedText>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    italicStyle: {
        fontStyle: 'italic',
    },
    strikesText: { textDecorationLine: 'line-through', textDecorationStyle: 'solid' },
    boldText: {
        fontWeight: "600",
    },
    url: {
        color: ColorList.iconActive,
        textDecorationLine: 'underline',
    },

    email: {
        textDecorationLine: 'underline',
    },

    text: {
        color: 'black',
        fontSize: 15,
    },

    phone: {
        color: ColorList.indicatorColor,
        textDecorationLine: 'underline',
    },

    name: {
        color: ColorList.likeInactive,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },

    username: {
        color: 'green',
        fontWeight: 'bold'
    },

    magicNumber: {
        fontSize: 42,
        color: 'pink',
    },

    hashTag: {
        fontStyle: 'italic',
        color: 'grey'
    },

});