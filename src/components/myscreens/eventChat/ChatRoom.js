import React, { Component } from "react";
import {
    Content,
    Card,
    CardItem,
    Body,
    Container,
    Header,
    Form,
    Title,
    Input,
    Left,
    Right,
    Icon,
    Text,
    H3,
    Spinner,
    Button
} from "native-base";
import {
    Image,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
    BackHandler
} from 'react-native';

import { observer } from "mobx-react";
import Menu, { MenuDivider } from 'react-native-material-menu';
import initialRoute from "../invitations/components/initialRoute";
import globalState from "../../../stores/globalState";
import ServerEventListener from "../../../services/severEventListener";
import connection from "../../../services/tcpConnect";
import UpdatesDispatcher from "../../../services/updatesDispatcher";
import { ScrollView } from 'react-navigation';
import Video from 'react-native-video';
import VideoPlayer from "react-native-video-controls"

import TextMessage from "./TextMessage";
import PhotoMessage from "./PhotoMessage";
import AudioMessage from "./AudioMessage";
import VideoMessage from "./VideoMessage";
const screenWidth = Math.round(Dimensions.get('window').width);
export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sender: false,
            splicer: 500,
            creator: true,
            showVideo: false,
            playing: true,
            message: {
                sender: {
                    phone: 2,
                    nickname: "Sokeng Kamga"
                },
                photo: "http://192.168.43.32:8555/video/thumbnail/get/20190725_182151.jpg",
                file_name: 'bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg',
                created_at: "2014-03-30 12:32",
                text: `Hello!`
            },
            message2: {
                sender: {
                    phone: 2,
                    nickname: "Sokeng Kamga"
                },
                photo: "http://192.168.43.32:8555/video/thumbnail/get/20190725_182151.jpg",
                file_name: "bm33r9813uloeua1aasg_bm33r9813uloeua1aat0_bm33r9813uloeua1aatg.jpg",
                created_at: "2014-03-30 12:32",
                text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.

`
            }
        };
    }
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this))
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    }
    handleBackButton() {
        if(this.state.showVideo){
            this.setState({
                showVideo: false
            })
            return true
        }else{

        }
    }
    state = {
        sender: false,
        showTime: true
    }
    message = {
        source: 'http://192.168.43.32:8555/sound/get/p2.mp3',
        file_name: 'p2.mp3',
        total:0,
        received:0,
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    }
    message2 = {
        source: 'http://192.168.43.32:8555/video/get/bm6lgk013ult9gc75vmg_bm6lgk013ult9gc75vn0_bm6lgk013ult9gc75vng.mp4',
        file_name: 'bm6lgk013ult9gc75vmg_bm6lgk013ult9gc75vn0_bm6lgk013ult9gc75vng.mp4',
        thumbnailSource: 'http://192.168.43.32:8555/video/thumbnail/get/20190725_182151.jpg',
        sender: {
            phone: 3,
            nickname: "Sokeng Kamga"
        },
        received:0,
        total:0,
        text: `Hello!
        Erlang/OTP is divided into a number of OTP applications. An application normally contains Erlang modules. Some OTP applications, such as the C interface erl_interface, are written in other languages and have no Erlang modules.
On a Unix system you can view the manual pages from the command line using
    % erl -man <module>
You can of course use any editor you like to write Erlang programs, but if you use Emacs there exists editing support such as indentation, syntax highlighting, electric commands, module name verification, comment support including paragraph filling, skeletons, tags support and more. See the Tools application for details.
There are also Erlang plugins for other code editors Vim (vim-erlang) , Atom , Eclipse (ErlIDE) and IntelliJ IDEA.

`,
        duration: Math.floor(0),
        created_at: "2014-03-30 12:32",
    }

    playVideo(video) {
        this.setState({
            video: video,
            showVideo: true
        })
    }
    hideVideo() {
        this.setState({
            showVideo: false
        })
    }
    showActions() {
        this.setState({
            showActions: true
        })
        setTimeout(() => {
            this.setState({
                showActions: false
            })
        }, 5000)
    }
    buffering() {
        this.setState({
            buffering: true
        })
        setTimeout(() => {
            this.setState({
                buffering: false
            })
        }, 5000)
    }
    enterFullscreen(){
        this.setState({
            fullScreen:!this.state.fullScreen
        })
    }
    togglePlay() {
        this.setState({
            playing: !this.state.playing
        })
    }
    transparent = "rgba(52, 52, 52, 0.8)";
    render() {
        return (
            <View>
                <View style={{}}>
                    <ScrollView>
                        <PhotoMessage user={2} creator={2} message={this.state.message}></PhotoMessage>
                        <TextMessage user={2} creator={2} message={this.state.message}></TextMessage>
                        <AudioMessage user={3} creator={3} message={this.message}></AudioMessage>
                        <VideoMessage playVideo={(video) => {this.playVideo(video)}} message={this.message2} user={1}></VideoMessage>
                        <TextMessage user={3} creator={2} message={this.state.message2}></TextMessage>
                        <TextMessage user={1} creator={2} message={this.state.message2}></TextMessage>
                    </ScrollView>
                </View>
                {this.state.showVideo ? <View style={{
                    height: 400,
                    position: "absolute",
                    width: this.state.fullScreen ? "100%" : screenWidth,
                    backgroundColor: this.transparent,
                    alignSelf: 'center',
                }}>
                    <VideoPlayer source={{ uri: this.state.video }}   // Can be a URL or a local file.
                        ref={(ref) => {
                            this.videoPlayer = ref
                        }}
                        onBuffer={() =>
                            this.buffering()
                        }                // Callback when remote video is buffering
                        onError={(error) => {
                            console.error(error)
                        }}
                        toggleResizeModeOnFullscreen={false}
                        //pictureInPicture={true}
                        resizeMode={"contain"}
                        disableVolume={true}
                        seekColor="#1FABAB"
                        controlTimeout={null}
                        //disablePlayPause={true}
                        //disableFullscreen={true}
                        onBack={() => this.hideVideo()}
                        onEnterFullscreen={()=> this.enterFullscreen()}
                        onExitFullscreen={()=> this.enterFullscreen()}
                        //fullscreenOrientation={"landscape"}
                        //fullscreen={true}
                        //controls={true}
                        style={{
                            backgroundColor: this.transparent,
                        }}
                        videoStyle={{
                            alignItems: 'center',
                            height: "100%",
                            width: "100%",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                        }}             // Callback when video cannot be loaded
                    />
                    {this.state.showActions ? <View style={{ position: "absolute" }}>
                        <TouchableOpacity onPress={() => {
                            this.hideVideo()
                        }}>
                            <Icon name="close" style={{ margin: '3%', color: "#1FABAB" }} type="EvilIcons">
                            </Icon>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.togglePlay()}>
                            <Icon type={this.state.playing ? "Foundation" : "EvilIcons"} name={this.state.playing ? "pause" : "play"} style={{ fontSize: 50, color: "#1FABAB", marginTop: "47%", marginLeft: "60.6%", }}>
                            </Icon>
                        </TouchableOpacity>
                    </View> : null}
                </View> : null}
            </View>

        )
    }
}