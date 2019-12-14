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

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
import Modal from "react-native-modalbox"
import { Icon, Button } from 'native-base';
import EmojiSelector from 'react-native-emoji-selector';
import ReplyText from '../eventChat/ReplyText';
import { TouchableOpacity } from 'react-native-gesture-handler';
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    modalContainer: {
        height: Dimensions.get('window').height * .3,
        width: Dimensions.get('window').width,
        backgroundColor: 'red'
    }
});
export default class InputModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hidden: false
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
            <EmojiSelector onEmojiSelected={(emoji) => this.handleEmojiSelected(emoji)} enableSearch={false} ref={emojiInput => this._emojiInput = emojiInput} resetSearch={this.state.reset} showSearchBar={false} loggingFunction={this.verboseLoggingFunction.bind(this)} verboseLoggingFunction={true} filterFunctions={[this.filterFunctionByUnicode]}></EmojiSelector>
        </View>;
    }
    state = {

    }
    _onChange(event) {
        this.setState({ textValue: event.nativeEvent.text || '' });
    }
    replyMessageCaption() {
        return <View style={{ backgroundColor: this.state.replyerBackColor, marginLeft: "-1%", }}><ReplyText openReply={(replyer) => {
            this.setState({
                replyer: replyer,
                showRepliedMessage: true
            });
        }} pressingIn={() => { }} reply={this.state.replyContent}></ReplyText>
            <Button onPress={() => this.cancleReply()
            } style={{ position: "absolute", alignSelf: 'flex-end', }} transparent><Icon name={"close"} type={"EvilIcons"} style={{}}></Icon></Button>
        </View>;
    }
    toggleEmojiKeyboard() {
        offset = this.state.replying ? 0.1 : 0
        !this.state.showEmojiInput ? Keyboard.dismiss() : this._textInput.focus()
        this.setState({
            showEmojiInput: !this.state.showEmojiInput,
            messageListHeight: this.state.showEmojiInput ?
                this.formHeight(this.state.initialMessaListHeightFactor - offset) : this.formHeight(0.50 - offset),
            textInputHeight: this.state.showEmojiInput ?
                this.formHeight(this.state.inittialTextInputHeightFactor + offset) : this.formHeight(0.50 + offset)
        })
    }
    render() {
        return (
            <KeyboardAvoidingView >
                <View>
                    <View style={{  width: screenWidth, }}>
                        <View style={{ alignSelf: 'center', }}>
                            <View style={{
                                height: this.state.textInputHeight, backgroundColor: "#FEFFDE",
                                borderRadius: 10, alignSelf: 'center', borderWidth: 1, borderBottomWidth: 0,
                                borderColor: '#1FABAB', padding: '1%', maxWidth: "99.9%",
                            }}>
                                {
                                    //* Reply Message caption */
                                   // this.state.replying ? this.replyMessageCaption() : null
                                }
                                <View>
                                    <View style={{ display: 'flex', flexDirection: 'row', }}>
                                        <View style={{
                                            marginTop: "2%",
                                            width: "33%",
                                            display: 'flex', flexDirection: 'row',
                                        }}><View style={{margin: '1%',}}>
                                                <TouchableWithoutFeedback onPress={() =>{
                                                    console.warn("pressing heart")
                                                }}>
                                                    <Icon name={"heart"} type={"AntDesign"} style={{ color: "red", }}></Icon>
                                                </TouchableWithoutFeedback>
                                            </View>
                                            <View style={{ margin: '1%', }}>
                                                <TouchableWithoutFeedback onPress={() =>{
                                                    console.warn("Pressing angry")
                                                }}>
                                                    <Icon name={"angry"} type={"FontAwesome5"} 
                                                    style={{ color: "orange", }}></Icon>
                                                </TouchableWithoutFeedback>
                                            </View>
                                            <View style={{}}>
                                            </View>
                                            <View style={{ margin: '1%', }}>
                                                <Button transparent>
                                                    <Icon onPress={() => {
                                                    }} style={{
                                                        color: "yellow", alignSelf: 'flex-end',
                                                    }} type="FontAwesome5" name="laugh-squint"></Icon></Button>
                                            </View>
                                        </View>
                                        <TextInput value={this.state.textValue} onChange={(event) => this._onChange(event)} style={{
                                            paddingLeft: 10,
                                            fontSize: 17,
                                          //  height: 50,
                                            width: "50%",
                                            borderColor: "#1FABAB",
                                            backgroundColor: 'white',
                                            borderWidth: 1,
                                            borderRadius: 8,
                                        }} placeholder={'Your Message'}
                                            placeholderTextColor='#66737C'
                                           // maxHeight={200}
                                            multiline={this.state.keyboardOpened ? true : false}
                                         //   minHeight={45}
                                            enableScrollToCaret ref={(r) => { this._textInput = r; }} />
                                        <View style={{
                                            marginLeft: "3%", marginTop: "2%", display: 'flex',
                                            width: "17%",
                                            flexDirection: 'row',
                                        }}>
                                            <View style={{ width: "45%", }}>
                                                <Button onPress={() => {
                                                    this.toggleEmojiKeyboard();
                                                }} transparent><Icon style={{
                                                    color: "#0A4E52",
                                                    marginRight: "8%",
                                                }} type={"FontAwesome5"} name={"laugh"}></Icon></Button>
                                            </View>
                                            <View>
                                                <Button style={{ width: "45%", }} onPress={() => {
                                                    requestAnimationFrame(() => {
                                                        return this.sendMessageText(this.state.textValue);
                                                    });
                                                }} transparent><Icon style={{
                                                    color: "#1FABAB", marginRight: "2%",
                                                }} name="paper-plane"
                                                    type="FontAwesome"></Icon></Button>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                {
                                    // ***************** Emoji keyBoard Input ***********************//
                                  //  this.state.showEmojiInput ? this.imojiInput() : null
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}