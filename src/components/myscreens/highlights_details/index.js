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
const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
export default class HighLightsDetails extends Component {
    constructor(props) {
        super(props)
        this.event_id = this.props.navigation.getParam('event_id')
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
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));

    }
    handleKeyboardDidShow() {
        this.setState({
            showImojiInput: false
        })
    }

    handleKeyboardDidHide() {
        this.setState({
            replyer: this.state.replyer ? this.state.replyer : null,
            inputsHeight: !this.state.showImojiInput ? this.formHeightPercent(140) : this.formHeightPercent(350),
            messageListHeight: !this.state.showImojiInput ? this.formHeightPercent(screenheight - 140) : this.formHeightPercent(screenheight - 350)
        });
    }
    handleBackButton() {
        this.props.navigation.navigate('Home')
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
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton.bind(this));
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
                            ...replyer, video: replyer.url.video ? true : false,
                            audio: !replyer.url.video && replyer.url.audio ? true : false,
                            video: replyer.url.video ? true : false,
                            photo: !replyer.url.video && replyer.url.photo ? true : false,
                            sourcer: replyer.url.video ?
                                replyer.url.photo : replyer.url.photo ?
                                    replyer.url.photo : replyer.url.audio ?
                                        replyer.url.audio : null,
                            replyer_phone: stores.LoginStore.user.phone,
                            replyer_name: stores.LoginStore.user.name,
                            type_extern: 'HighLights',
                        }
                        this.setState({
                            replyer: reply,
                            inputsHeight: this.formHeightPercent(140),
                            messageListHeight: this.formHeightPercent(screenheight - 140)
                        });
                    }}
                    playVideo={(source) => this.playVideo(source)}></HighLight> : null;
            }}
            dataSource={this.state.highlights}>
        </BleashupFlatList>;
    }
    /* highlights = [{
         id: Math.random().toString(),
         title: "Audio HighLights",
         description: `Hallo everybody
 DESCRIPTIVE TEXT, or in terms of writing only known as “description” is one of English lessons that should be mastered not only by junior high school students but also by senior high school students, college students and anyone who loves English. Because after all, descriptive material is very necessary for the increasing of our English proficiency.
 
 Some of the most famous authors, especially fiction writers, have good skill in writing of descriptive text so that their writing is very readable and easy to understand. Therefore, if we were able to master this lesson well, we might be able to become a great writer in the future.
 
 Furthermore, explanations and examples of this descriptive text can help a friend who is or still a long journey to learn English. Do not hesitate to read the descriptive text below, the more often we read we will be able to understand it more. And it would be nice if we do not only understand mere, but also can write descriptive text ourself….
 
 Maybe you are “bored” to learn narrative text, because of that, it’s time to discuss descriptive text so that our head is not merely contains stories and stories
 
 Descriptive Text
 
 Definition`,
         url: {
             audio: 'http://192.168.43.32:8555/sound/get/p2.mp3',
             duration: Math.floor(0)
         },
         type: 'audio',
         created_at: moment().format(),
     }, {
         id: Math.random().toString(),
         url: {
 
         },
         type: 'text',
         title: "Text Description HighLight",
         description: `Hallo everybody
 DESCRIPTIVE TEXT, or in terms of writing only known as “description” is one of English lessons that should be mastered not only by junior high school students but also by senior high school students, college students and anyone who loves English. Because after all, descriptive material is very necessary for the increasing of our English proficiency.
 
 Some of the most famous authors, especially fiction writers, have good skill in writing of descriptive text so that their writing is very readable and easy to understand. Therefore, if we were able to master this lesson well, we might be able to become a great writer in the future.
 
  Furthermore, explanations and examples of this descriptive text can help a friend who is or still a long journey to learn English. Do not hesitate to read the descriptive text below, the more often we read we will be able to understand it more. And it would be nice if we do not only understand mere, but also can write descriptive text ourself….
 
 Maybe you are “bored” to learn narrative text, because of that, it’s time to discuss descriptive text so that our head is not merely contains stories and stories
 
 Descriptive Text
 
 Definition`,
         created_at: moment().format(),
     }, {
         id: Math.random().toString(),
         type: "photo",
         url: {
             photo: "http://192.168.43.32:8555/sound/get/bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg"
         },
         title: "Photo HighLight",
         created_at: moment().format(),
         description: `Furthermore, explanations and examples of this descriptive text can help a friend who is or still a long journey to learn English. Do not hesitate to read the descriptive text below, the more often we read we will be able to understand it more. And it would be nice if we do not only understand mere, but also can write descriptive text ourself….
 
 Maybe you are “bored” to learn narrative text, because of that, it’s time to discuss descriptive text so that our head is not merely contains stories and stories
 
 Descriptive Text
 
 Definition`
     }, {
         id: Math.random().toString(),
         url: {
             photo: 'http://192.168.43.32:8555/video/thumbnail/get/bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0_thumbnail.jpeg',
             video: 'http://192.168.43.32:8555/video/get/bma9auo13ult3nh5n690_bma9auo13ult3nh5n69g_bma9auo13ult3nh5n6a0.mp4',
 
         },
         type: "video",
         title: 'Video Highlight',
         description: `Hello!
         Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
 On a Unix system you can view the manual pages from the command line using
     % erl -man <module>
 You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
 There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.`,
         duration: Math.floor(0),
         created_at: moment().format(),
     }/*, {
     id: Math.random().toString(),
     source: 'http://192.168.43.32:8555/video/get/bm6lgk013ult9gc75vmg_bm6lgk013ult9gc75vn0_bm6lgk013ult9gc75vng.mp4',
     file_name: 'Black M - Le prince Aladin (Clip officiel) ft. Kev Adams.mp4',
     thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bm7sd5813ulrbjp7u1sg_bm7sd5813ulrbjp7u1t0_bm7sd5813ulrbjp7u1tg_thumbnail.jpeg',
     sender: {
       phone: 3,
       nickname: "Sokeng Kamga"
     },
     user: 2,
     creator: 2,
     type: "attachement",
     received: 0,
     total: 0,
     text: `Hello!
         Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
 On a Unix system you can view the manual pages from the command line using
     % erl -man <module>
 You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
 There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.
 
 `,
     duration: Math.floor(0),
     created_at: moment().format(),
   },
     , {
     id: Math.random().toString(),
     source: 'http://192.168.43.32:8555/video/get/Black M - Le prince Aladin (Clip officiel) ft. Kev Adams.mp4',
     file_name: 'bm6lgk013ult9gc75vmg_bm6lgk013ult9gc75vn0_bm6lgk013ult9gc75vng.mp4',
     thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/bm7sd5813ulrbjp7u1sg_bm7sd5813ulrbjp7u1t0_bm7sd5813ulrbjp7u1tg_thumbnail.jpeg',
     sender: {
       phone: 3,
       nickname: "Sokeng Kamga"
     },
     type: "video",
     user: 3,
     creator: 2,
     received: 0,
     total: 0,
     text: `Hello!
         Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
 On a Unix system you can view the manual pages from the command line using
     % erl -man <module>
 You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
 There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.
 
 `,
     duration: Math.floor(0),
     created_at: moment().format(),
   }]*/
    render() {
        return (
            <View>
                <View style={{
                    height: this.state.messageListHeight,
                    width: "100%",
                    backgroundColor: '#3D3D1F',
                    opacity: 0.9
                }}>
                    {!this.state.mounted ? <Spinner size={'small'}></Spinner> :
                        this.messageList()
                    }
                </View>
                <View style={{ height: this.state.inputsHeight, backgroundColor: 'transparent', borderRadius: 10, }}>
                    {
                        <InputView showImojiInput={this.state.showImojiInput}
                            sendMessageText={(text) => {
                                this.sendReaction(text)
                            }} replyer={this.state.replyer} increaseHeightToCopeEmoji={() => {
                                this.setState({
                                    inputsHeight: this.formHeightPercent(350),
                                    messageListHeight: this.formHeightPercent(screenheight - 350),
                                    showImojiInput: true
                                })
                                Keyboard.dismiss()
                            }} decreaseHeightToCopeEmoji={() => {
                                this.setState({
                                    inputsHeight: this.formHeightPercent(140),
                                    messageListHeight: this.formHeightPercent(screenheight - 140),
                                    showImojiInput: false
                                })
                            }} cancleReply={() => {
                                this.setState({
                                    inputsHeight: this.formHeightPercent(0),
                                    messageListHeight: this.formHeightPercent(screenheight)
                                })
                            }}></InputView>
                    }
                </View>

                <View style={{
                    position: 'absolute', backgroundColor: '#FEFEDE', width: '10%', ...shadower(8),
                    height: 30, opacity: 0.7, alignSelf: 'flex-end', marginTop: '2%', 
                    borderBottomLeftRadius: 8, borderTopLeftRadius: 8, borderRightWidth: 0,
                    flexDirection: 'row',
                }}>
                    <Icon onPress={()=>{
                        this.props.navigation.navigate('Home')
                    }} name="doubleright" style={{ marginLeft:'8%', color: '#1FABAB',marginBottom: '7%',alignSelf: 'center', }} type={"AntDesign"}></Icon>
                </View>
                <View style={{
                    position: 'absolute', backgroundColor: '#FEFEDE', width: '15%', ...shadower(8),
                    height: 30, opacity: 0.7, alignSelf: 'flex-start', marginTop: '2%',
                    borderBottomRightRadius: 8, borderTopRightRadius: 8, borderRightWidth: 0,
                    flexDirection: 'row',
                }}>
                    <Text style={{ fontSize: 18, fontStyle: 'italic', marginTop: "8%", fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: '15%', width: '68%' }}>{"Posts"} </Text>
                </View>
                <PhotoViewer photo={this.state.photo} open={this.state.showPhoto} hidePhoto={() => {
                    this.setState({
                        showPhoto: false
                    })
                }}></PhotoViewer>
                <VideoViewer video={this.state.video} open={this.state.showVideo} hideVideo={() => {
                    this.setState({
                        showVideo: false
                    })
                }}></VideoViewer>
            </View>
        );
    }
}