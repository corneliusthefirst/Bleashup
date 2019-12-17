import React, { Component } from 'react';
import {
    View,
    Dimensions,
    StatusBar,
    TextInput,
    Keyboard,
    StyleSheet,
    TouchableWithoutFeedback,
    KeyboardAvoidingView
} from 'react-native';

import Modal from "react-native-modalbox"
import { Icon, Button, Text } from 'native-base';
import EmojiSelector from 'react-native-emoji-selector';
import ReplyText from '../eventChat/ReplyText';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default class InputView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hidden: false,
            replying: true,
            textValue:''
        }
    }
    state = {

    }
    handleEmojiSelected(e) {
        this.setState({
            textValue: this.state.textValue + e
        })
    }
    imojiInput() {
        return <View style={{ marginLeft: '-1.5%', width: "100%", height: 300 }}>
            <EmojiSelector onEmojiSelected={(emoji) => this.handleEmojiSelected(emoji)} enableSearch={false} ref={emojiInput => this._emojiInput = emojiInput} resetSearch={this.state.reset} showSearchBar={false} verboseLoggingFunction={true}></EmojiSelector>
        </View>;
    }
    state = {

    }
    cancleReply() {
        this.props.cancleReply()
    }
    _onChange(event) {
        this.setState({ textValue: event.nativeEvent.text || '' });
    }
    replyMessageCaption() {
        return <View style={{ backgroundColor: '#FEFEDE', marginLeft: "-1%", }}>
            <ReplyText openReply={(replyer) => {
                this.setState({
                    replyer: replyer,
                    showRepliedMessage: true
                });
            }} pressingIn={() => { }} reply={this.props.replyer}></ReplyText>
            <Button onPress={() => this.cancleReply()
            } style={{ position: "absolute", alignSelf: 'flex-end', }} transparent><Icon name={"close"} type={"EvilIcons"} style={{}}></Icon></Button>
        </View>;
    }
    toggleEmojiKeyboard() {
        // offset = this.state.replying ? 0.1 : 0
        // !this.state.showEmojiInput ? Keyboard.dismiss() : this._textInput.focus()
        !this.state.showEmojiInput ? this.props.increaseHeightToCopeEmoji() : this.props.decreaseHeightToCopeEmoji()
    }
    render() {
        return (
            <View style={{ backgroundColor: 'transparent' }}>
                <View style={{ width: "100%", }}>
                    <View style={{ alignSelf: 'center', }}>
                        <View style={{
                            height: this.state.textInputHeight, backgroundColor: "#FEFFDE",
                            borderRadius: 10, alignSelf: 'center', borderWidth: 1, borderBottomWidth: 0,
                            borderColor: '#1FABAB', padding: '1%', maxWidth: "99.9%",
                        }}>
                            {
                                //* Reply Message caption */
                                this.props.replyer.replyer_name ? this.replyMessageCaption() : null
                            }
                            <View>
                                <View style={{ display: 'flex', flexDirection: 'row', }}>
                                    <View style={{
                                        marginTop: "2%",
                                        width: "33%",
                                        display: 'flex', flexDirection: 'row',
                                    }}><View style={{ margin: '1%', }}>
                                            <TouchableOpacity onPress={() => {
                                                console.warn("pressing heart")
                                                this.props.sendMessageText("❤️")
                                            }}>
                                                <Text style={{ fontSize: 30, }}>❤️</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ margin: '1%', }}>
                                            <TouchableOpacity onPress={() => {
                                                console.warn("Pressing angry")
                                                this.props.sendMessageText("😡")
                                            }}>
                                                <Text style={{ fontSize: 30, }}>😡</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{}}>
                                        </View>
                                        <View style={{ margin: '1%', }}>
                                            <TouchableOpacity onPress={() => {
                                                console.warn("pressing clapp")
                                                this.props.sendMessageText("👏")
                                            }}>
                                                <Text style={{ fontSize: 30, }}>
                                                    👏
                                                    </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={() => {
                                                console.warn("Pressing thumbs up")
                                                this.props.sendMessageText("👍")
                                            }} >
                                                <Text style={{ fontSize: 30, }}>
                                                    👍
                                            </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TextInput value={this.state.textValue}
                                        onChange={(event) => this._onChange(event)}
                                        style={{
                                            paddingLeft: 10,
                                            fontSize: 17,
                                            height: 50,
                                            width: "50%",
                                            borderColor: "#1FABAB",
                                            backgroundColor: 'white',
                                            borderWidth: 1,
                                            borderRadius: 8,
                                        }} placeholder={'Your Message'}
                                        placeholderTextColor='#66737C'
                                        maxHeight={200}
                                        multiline={this.state.keyboardOpened ? true : false}
                                        minHeight={45}
                                        enableScrollToCaret ref={(r) => { this._textInput = r; }} />
                                    <View style={{
                                        marginLeft: "1%", marginTop: "2%", display: 'flex',
                                        width: "20%",
                                        flexDirection: 'row',
                                    }}>
                                        <View style={{ width: "45%", }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.toggleEmojiKeyboard();
                                                }}>
                                                <Icon style={{
                                                    color: "#0A4E52",
                                                    marginRight: "1%",
                                                }} type={"FontAwesome5"} name={"laugh"}></Icon>
                                            </TouchableOpacity>
                                        </View>
                                        {this.state.textValue ? <View style={{ width: "45%", }}>
                                            <TouchableOpacity onPress={() => {
                                                requestAnimationFrame(() => {
                                                     this.props.sendMessageText(this.state.textValue);
                                                    this._textInput.clear();
                                                });
                                            }}><Icon style={{
                                                color: "#1FABAB", marginRight: "2%",
                                            }} name="paper-plane"
                                                type="FontAwesome"></Icon>
                                            </TouchableOpacity>
                                        </View> : null}
                                    </View>
                                </View>
                            </View>
                            {
                                // ***************** Emoji keyBoard Input ***********************//
                                this.props.showImojiInput ? this.imojiInput() : null
                            }
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}