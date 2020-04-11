import React, { Component } from 'react';
import moment from "moment"
import { View, StatusBar, Dimensions, BackHandler, Keyboard } from 'react-native';
import { Text, Title, Spinner, Toast, Icon } from 'native-base';
import BleashupSectionList from '../../BleashupSectionList';
import BleashupFlatList from '../../BleashupFlatList';
import HighLight from './Highlight';
import PhotoViewer from '../event/PhotoViewer';
import VideoViewer from './VideoModal';
import InputView from './InputView';
import stores from '../../../stores';
import firebase from 'react-native-firebase';
import uuid from 'react-native-uuid';
import ChatStore from '../../../stores/ChatStore';
import shadower from '../../shadower';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ColorList from '../../colorList';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
export default class HighLightsDetails extends Component {
    constructor(props) {
        super(props)
        this.event_id = this.props.navigation.getParam('event_id');
        this.state = {
            inputsHeight: 0,
            showImojiInput: false,
            messageListHeight: this.formHeightPercent(screenheight),
            replyer: {

            }
        }
    }
    componentWillMount() {
        this.room = new ChatStore(this.event_id)
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow.bind(this));
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide.bind(this));
        this.BackHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));

    }
    handleKeyboardDidShow() {
        this.setState({
            showImojiInput: false,
            inputsHeight: //!this.state.showImojiInput ? 
                this.formHeightPercent(245)
            // : this.formHeightPercent(350)
            ,
            messageListHeight: //!this.state.showImojiInput ? 
                this.formHeightPercent(screenheight - 245)
            // : this.formHeightPercent(screenheight - 350)
        })
    }

    handleKeyboardDidHide() {
        this.setState({
            replyer: this.state.replyer ? this.state.replyer : null,
            inputsHeight: !this.state.showImojiInput ? this.formHeightPercent(140) : this.formHeightPercent(350),
            messageListHeight: !this.state.showImojiInput ? this.formHeightPercent(screenheight - 140) : this.formHeightPercent(screenheight - 350)
        });
    }
    goback() {
        this.props.navigation.goBack()
    }
    handleBackButton() {
        this.goback()
        StatusBar.setHidden(false, true)
        return true
    }
    componentDidMount() {
        stores.Highlights.fetchHighlights(this.event_id).then(highlights => {
            this.setState({
                mounted: true,
                highlights: highlights
            })
        })
    }
    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
        this.BackHandler.remove()
    }
    formHeightPercent(height) {
        return `${(height / screenheight * 100).toString()}%`
    }
    state = {

    }
    showPhoto(photo) {
        this.setState({
            showPhoto: true,
            photo: photo
        })
    }
    sendReaction(mess) {
        let message = {
            id: uuid.v1(),
            sender: {
                phone: stores.LoginStore.user.phone.replace("00", "+"),
                nickname: stores.LoginStore.user.name
            },
            reply: this.state.replyer,
            type: "text",
            received: [{ phone: stores.LoginStore.user.phone.replace("00", "+"), date: moment().format() }],
            text: mess,
            created_at: moment().format(),
        }
        firebase.database().ref(this.event_id).push(message, (e => {
            if (e) {
                console.warn(e)
                Toast.show({ text: "Couldn't send your reaction; deu to connection issues" })
            } else {
                this.setState({
                    messageListHeight: '100%',
                    inputsHeight: 0
                })
                this.room ? this.room.addNewMessage(message).then(() => {
                    Toast.show({ text: 'Reaction Sent', type: 'success' })
                }) : null
                this.refs.inputView._clean()
            }
        }))
    }
    textColor = "#FFF"
    messageList() {
        return <BleashupFlatList
            backgroundColor={"transparent"}
            firstIndex={0}
            ref="bleashupSectionListOut"
            //inverted={true}
            renderPerBatch={5}
            initialRender={5}
            numberOfItems={this.state.highlights.length}
            keyExtractor={(item, index) => item ? item.id : null}
            renderItem={(item, index) => {
                return item ? <HighLight
                    showPhoto={(photo) => this.showPhoto(photo)}
                    replying={(replyer, color) => this.replying(replyer, color)}
                    showVideo={(url) => {
                        this.setState({
                            video: url,
                            showVideo: true
                        })
                    }}
                    showInput={() => {
                        this.setState({
                            showInput: true
                        })
                    }}
                    highlight={item}
                    showInput={(replyer) => {
                        let reply = {
                            id: replyer.id,
                            video: replyer.url.video ? true : false,
                            audio: !replyer.url.video && replyer.url.audio ? true : false,
                            video: replyer.url.video ? true : false,
                            photo: !replyer.url.video && replyer.url.photo ? true : false,
                            sourcer: replyer.url.video ?
                                replyer.url.photo : replyer.url.photo ?
                                    replyer.url.photo : replyer.url.audio ?
                                        replyer.url.audio : null,
                            replyer_phone: stores.LoginStore.user.phone,
                            //replyer_name: stores.LoginStore.user.name,
                            title: `${replyer.title}: \n ${replyer.description}`,
                            type_extern: 'Posts',
                        }
                        this.setState({
                            replyer: reply,
                            inputsHeight: this.formHeightPercent(140),
                            replying: true,
                            messageListHeight: this.formHeightPercent(screenheight - 140)
                        });
                        this.adjutRoomDisplay()
                    }}
                    playVideo={(source) => this.playVideo(source)}></HighLight> : null;
            }}
            dataSource={this.state.highlights}>
        </BleashupFlatList>;
    }
    adjutRoomDisplay() {
        setTimeout(() => {
            //this.refs.inputView.focus()
            this.refs.ScrollViewRefer.scrollToEnd({ animated: true, duration: 200 })
        })
    }
    render() {
        return (
            <View>
                <ScrollView ref={"ScrollViewRefer"} keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false} scrollEnabled={false} nestedScrollEnabled >
                    <View style={{
                        height: this.state.replying ? screenheight * .9 : screenheight,
                        width: "100%",
                        backgroundColor: '#3D3D1F',
                        opacity: 0.9
                    }}><StatusBar animated={true} barStyle="light-content" backgroundColor="#3D3D1F"></StatusBar>
                        {!this.state.mounted ? <Spinner size={'small'}></Spinner> :
                            <TouchableWithoutFeedback onPressIn={() => {
                                this.adjutRoomDisplay()
                            }}>{this.messageList()}</TouchableWithoutFeedback>
                        }
                    </View>
                    <View style={{ height: this.state.replying ? null : 0, backgroundColor: 'transparent', borderRadius: 10, }}>
                        {
                            <InputView onInputChange={() => {
                                this.adjutRoomDisplay()
                            }} ref="inputView" showImojiInput={this.state.showImojiInput}
                                sendMessageText={(text) => {
                                    this.sendReaction(text)
                                    this.setState({
                                        replying:false
                                    })
                                    this.adjutRoomDisplay()
                                }} replyer={this.state.replyer} increaseHeightToCopeEmoji={() => {
                                    this.setState({
                                        //inputsHeight: this.formHeightPercent(350),
                                        //messageListHeight: this.formHeightPercent(screenheight - 350),
                                        showImojiInput: true
                                    })
                                    this.adjutRoomDisplay()
                                    Keyboard.dismiss()
                                }} decreaseHeightToCopeEmoji={() => {
                                    this.setState({
                                        //inputsHeight: this.formHeightPercent(140),
                                        //messageListHeight: this.formHeightPercent(screenheight - 140),
                                        showImojiInput: false
                                    })
                                    this.adjutRoomDisplay()
                                }} cancleReply={() => {
                                    this.setState({
                                        replying:false,
                                        inputsHeight: this.formHeightPercent(0),
                                        messageListHeight: this.formHeightPercent(screenheight)
                                    })
                                    this.adjutRoomDisplay()
                                }}></InputView>
                        }
                    </View>

                    <View style={{
                        position: 'absolute', width: '15%', ...shadower(8),
                        height: 30, opacity: 0.7, alignSelf: 'flex-end', marginTop: '2%',
                        borderBottomLeftRadius: 8, borderTopLeftRadius: 8, backgroundColor: ColorList.bodyBackground, borderRightWidth: 0,
                        flexDirection: 'row',
                    }}>
                        <Text style={{ fontSize: 18, fontStyle: 'italic', marginBottom: "13%", fontWeight: 'bold', alignSelf: 'flex-end', marginLeft: '7%', width: '100%' }}>{"Posts"} </Text>
                    </View>
                    <View style={{
                        position: 'absolute', backgroundColor: ColorList.bodyBackground, width: '10%', ...shadower(8),
                        height: 30, opacity: 0.7, alignSelf: 'flex-start', marginTop: '2%',
                        borderBottomRightRadius: 8, borderTopRightRadius: 8, borderRightWidth: 0,
                        flexDirection: 'row',
                    }}>
                        <Icon onPress={() => {
                            this.goback()
                        }} name="doubleleft" style={{ marginLeft: '8%', color: '#0A4E52', marginBottom: '7%', alignSelf: 'center', }} type={"AntDesign"}></Icon>
                    </View>
                    {this.state.showPhoto ? <PhotoViewer photo={this.state.photo} open={this.state.showPhoto} hidePhoto={() => {
                        this.setState({
                            showPhoto: false
                        })
                    }}></PhotoViewer> : null}
                    {this.state.showVideo ? <VideoViewer video={this.state.video} open={this.state.showVideo} hideVideo={() => {
                        this.setState({
                            showVideo: false
                        })
                    }}></VideoViewer> : null}
                </ScrollView>
            </View>
        );
    }
}