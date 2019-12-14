import React, { Component } from 'react';
import moment from "moment"
import { View, StatusBar } from 'react-native';
import { Text, Title } from 'native-base';
import BleashupSectionList from '../../BleashupSectionList';
import BleashupFlatList from '../../BleashupFlatList';
import HighLight from './Highlight';
import PhotoViewer from '../event/PhotoViewer';
import VideoViewer from './VideoModal';
import InputModal from './InputModal';

export default class HighLightsDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    state = {

    }
    showPhoto(photo) {
        this.setState({
            showPhoto: true,
            photo: photo
        })
    }
    textColor = "#FFF"
    messageList() {
        return <BleashupFlatList backgroundColor={"transparent"}
            firstIndex={0} ref="bleashupSectionListOut" inverted={true}
            renderPerBatch={5} initialRender={5}
            numberOfItems={this.highlights.length}
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
                            showInput:true
                        })
                    }}
                    highlight={item}
                    openReply={(replyer) => {
                        this.setState({
                            replyer: replyer,
                            showRepliedMessage: true
                        });
                    }} playVideo={(source) => this.playVideo(source)}></HighLight> : null;
            }} dataSource={this.highlights}>
        </BleashupFlatList>;
    }
    highlights = [{
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
  }*/]
    render() {
        StatusBar.setBackgroundColor('#3D3D1F', true)
        return (
            <View style={{
                height: "100%",
                width: "100%",
                backgroundColor: '#3D3D1F',
                opacity: 0.9
            }}>
                <View>
                    {
                        this.messageList()
                    }
                </View>

                <View style={{
                    position: 'absolute', backgroundColor: '#FEFEDE', width: '95%',
                    height: 44, borderRadius: 10, opacity: 0.8, alignSelf: 'center', margin: '3%',
                }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 25, fontStyle: 'italic', marginTop: "2%", alignSelf: 'center', }}>{"Highlights"} </Text>
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
                <InputModal open={this.state.showInput} hideInput={() => {
                    this.setState({
                        showInput:false
                    })
                }} ></InputModal>
            </View>
        );
    }
}