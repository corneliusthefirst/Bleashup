import React, { Component } from "react";

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Alert,
    Slider,
    Vibration,
    TouchableWithoutFeedback,
    Platform,
} from "react-native";
import Sound from "react-native-sound";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Icon, Right, Spinner, Toast } from "native-base";
import GState from "../../../stores/globalState";
import BarIndicat from "../../BarIndicat";
import { BarIndicator } from "react-native-indicators";
import testForURL from "../../../services/testForURL";
import converToHMS from "../highlights_details/convertToHMS";
import FileExachange from "../../../services/FileExchange";
import ColorList from "../../colorList";
import stores from "../../../stores";
import TextContent from "./TextContent";
import emitter from '../../../services/eventEmiter';
export default class AudioMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: 0,
            currentPosition: 0,
            currentTime: 0,
            downloadState: 0,
            downloading: true,
        };
    }
    componentWillUnmount() {
        this.player && this.player.stop();
        clearInterval(this.downloadID);
        emitter.off(this.playingEvent)
    }
    componentDidMount() {
        //console.warn(this.props.message.source);
        this.setState({
            duration: null,
            currentPosition: 0,
            playing: false,
            received: this.props.message.received,
            total: this.props.message.total,
            sender_name: this.props.message.sender.nickname,
            sender: !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at.split(" ")[1],
            creator: this.props.message.sender.phone == this.props.creator,
        });
        this.exchanger = new FileExachange(
            this.props.message.source,
            this.path,
            this.state.total,
            this.state.received,
            this.progress.bind(this),
            this.success.bind(this),
            this.onFail.bind(this),
            this.onError.bind(this)
        );
        setTimeout(() => {
            if (testForURL(this.props.message.source)) {
                !this.props.message.cancled
                    ? this.downloadAudio(this.props.message.source)
                    : this.setState({
                        downloading: false,
                    });
            } else {
                //this.initialisePlayer(this.props.message.source);
            }
        }, 1000);
    }
    setAfterSuccess(path) {
        GState.downlading = false;
        this.props.message.source =
            Platform.OS === "android" ? path + "/" : "" + path;
        stores.Messages.addStaticFilePath(
            this.props.room,
            this.props.message.source,
            this.props.message.id
        ).then(() => {
            stores.Messages.addAudioSizeProperties(
                this.props.room,
                this.props.message.id,
                this.state.total,
                this.state.received,
                this.props.message.duration
            ).then(() => {
                this.initialisePlayer(this.props.message.source);
                this.setState({
                    loaded: true,
                });
            });
        });
    }
    success(path, total, received) {
        this.props.message.duration = this.exchanger.duration;
        this.setState({
            total: total,
            received: received,
        });
        this.setAfterSuccess(path);
    }
    progress(received, total, size) {
        let newReceived = received;
        let newTotal =
            this.state.total && this.state.total > 0 && this.state.total > total
                ? this.state.total
                : total;
        newTotal = parseInt(newTotal);
        this.setState({
            downloadState: (newReceived / newTotal) * 100,
            total: newTotal,
            received: newReceived,
        });
    }
    path = "/Sound/" + this.props.message.file_name;
    duration = 10;
    pattern = [1000, 0, 0];
    tempPath = this.path + ".download";
    download(url) {
        clearInterval(this.downloadID);
        GState.downlading = true;
        this.setState({
            downloading: true,
        });
        this.exchanger.download(this.state.received);
    }
    onError(error) {
        GState.downlading = false;
        console.warn(error);
        this.setState({
            downloading: false,
            error: true,
        });
    }
    onFail(received, total) {
        //console.warn(total,received)
        this.props.message.duration = this.exchanger.duration;
        this.setState({
            received: received,
            downloading: false,
            total:
                this.state.total && this.state.total > 0 && this.state.total > total
                    ? this.state.total
                    : total,
        });
        this.props.message.received = this.state.received;
        this.props.message.total = this.state.total;
        stores.Messages.addAudioSizeProperties(
            this.props.room,
            this.props.message.id,
            this.state.total,
            this.state.received,
            this.props.message.duration
        ).then(() => {
            this.setState({});
        });
    }
    downloadID = null;
    downloadAudio(url) {
        this.downloadID = setInterval(() => {
            this.download(url);
        }, 500);
    }
    initialisePlayer(source,play) {
        this.player = new Sound(source, "/", (error) => {
            console.warn(error, "error");
            play && this.player.play(this.playerCallback.bind(this))
        });
    }
    player = null;
    pause() {
        this.setState({
            playing: false,
        });
        this.player.pause();
        emitter.off(this.playingEvent)
    }
    task = null;
    previousTime = 0;
    plays() {
        if (this.props.message.duration) {
            let refreshID = setInterval(() => {
                this.player.getCurrentTime((time) => {
                    if (this.previousTime == time) clearInterval(refreshID);
                    else {
                        this.previousTime = time;
                        this.setState({
                            currentPosition: time / this.props.message.duration,
                            playing: true,
                            currentTime: time,
                        });
                    }
                });
            }, 1000);
        }
        emitter.emit(this.playingEvent)
       if(this.player){
           this.player.play(this.playerCallback.bind(this));
           emitter.on(this.playingEvent, this.handlePLaying.bind(this))
       }else{
           this.initialisePlayer(this.props.message.source,true)
           emitter.on(this.playingEvent, this.handlePLaying.bind(this))
       }
    }
    handlePLaying(){
        this.pause()
    }
    playingEvent = "playing"
    playerCallback(success){
        if (success) {
            this.player.getCurrentTime((seconds) => {
                this.props.message.duration = Math.floor(seconds);
                this.setState({
                    currentPosition: seconds / this.props.message.duration,
                    currentTime: seconds,
                });
                this.pause()
                stores.Messages.addDuration(this.props.room, seconds).then(
                    (status) => {
                        
                    }
                );
            });
        }
    }
    showProgress() {
        if (this.props.message.duration) {
            this.setState({
                showProgress: true,
            });
            setTimeout(() => {
                this.setState({ showProgress: false });
            }, 5000);
        }
    }
    cancelDownLoad(url) {
        if (this.exchanger.task !== null) {
            this.exchanger.task.cancel((err, taskID) => { });
        }
        stores.Messages.SetCancledState(this.props.room, this.props.message.id);
        this.setState({
            downloading: false,
        });
    }
    playIconStyle = {
        marginTop: "auto",
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        marginBottom: "auto",
    };
    render() {
        textStyle = {
            width: "85%",
            flexDirection: "column",
            alignSelf: "center",
        };
        return (
            <View
                style={{
                    flexDirection: "column",
                    alignItems: "center",
                    width: 290,
                }}
            >
                <TouchableWithoutFeedback
                    onLongPress={() =>
                        this.props.handleLongPress ? this.props.handleLongPress() : null
                    }
                    onPressIn={() => this.props.pressingIn()}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            backgroundColor: ColorList.bottunerLighter,
                            borderRadius: ColorList.chatboxBorderRadius,
                            width: "100%",
                            alignItems: "center",
                            marginTop: '1%',
                            paddingLeft: '1%',
                            alignSelf: "flex-end",
                            minHeight: 50,
                            justifyContent: "space-between",
                        }}
                    >
                        {this.props.message.duration ? (
                            <View style={textStyle}>
                                <View>
                                    <Slider
                                        value={this.state.currentPosition}
                                        onValueChange={(value) => {
                                          this.plays()
                                          setTimeout(() => {
                                              this.player.setCurrentTime(
                                                  value * this.props.message.duration
                                              );
                                          })
                                        }}
                                    ></Slider>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View>
                                        <Text>{converToHMS(Math.floor(this.state.currentTime))}</Text>
                                    </View>
                                    <View>
                                        <Text>{converToHMS(this.props.message.duration)}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : null}
                        <View style={{ width: this.props.message.duration ? "15%" : "100%", alignItems: "center" }}>
                            {testForURL(this.props.message.source) ? (
                                <AnimatedCircularProgress
                                    size={40}
                                    width={3}
                                    fill={
                                        testForURL(this.props.message.source)
                                            ? this.state.downloadState
                                            : 100
                                    }
                                    tintColor={ColorList.indicatorColor}
                                    backgroundColor={ColorList.indicatorInverted}
                                >
                                    {(fill) => (
                                        <View style={{}}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.state.downloading
                                                        ? this.cancelDownLoad(this.props.message.source)
                                                        : this.downloadAudio(this.props.message.source)
                                                }
                                            >
                                                <View>
                                                    <Icon
                                                        style={{ color: ColorList.bodyText }}
                                                        type="EvilIcons"
                                                        name={
                                                            this.state.downloading ? "close" : "arrow-down"
                                                        }
                                                    ></Icon>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </AnimatedCircularProgress>
                            ) : (
                                    <TouchableOpacity
                                        style={this.playIconStyle}
                                        onPress={() =>
                                            requestAnimationFrame(() =>
                                                !this.state.playing ? this.plays() : this.pause()
                                            )
                                        }
                                    >
                                        <Icon
                                            type="FontAwesome5"
                                            style={{ color: ColorList.bodyText, fontSize: 20 }}
                                            name={!this.state.playing ? "play" : "pause"}
                                        ></Icon>
                                    </TouchableOpacity>
                                )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {this.props.message.text ? <View style={{ margin: "1%", alignSelf: "flex-start" }}>
                    <TextContent
                        text={this.props.message.text}
                        tags={this.props.message.tags}
                        handleLongPress={this.props.handleLongPress}
                        pressingIn={this.props.pressingIn}
                    ></TextContent>
                </View> : null}
            </View>
        );
    }
}
