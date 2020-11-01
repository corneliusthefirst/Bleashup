import React, { Component } from "react";

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Alert,
    Vibration,
    Platform,
} from "react-native";
import Slider from 'react-native-slider';
import Sound from "react-native-sound";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import GState from "../../../stores/globalState";
import testForURL from "../../../services/testForURL";
import converToHMS from "../highlights_details/convertToHMS";
import FileExachange from "../../../services/FileExchange";
import ColorList from "../../colorList";
import stores from "../../../stores";
import TextContent from "./TextContent";
import emitter from '../../../services/eventEmiter';
import BePureComponent from '../../BePureComponent';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Requester from './Requester';
import Spinner from "../../Spinner";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
export default class AudioMessage extends BePureComponent {
    constructor(props) {
        super(props);
        this.state = {
            duration: 0,
            currentPosition: this.props.room ? 1 : 0.01,
            canPlay: true,
            currentTime: 0,
            downloadState: 0,
            downloading: true,
        };
    }
    unmountingComponent() {
        this.cleanPlayer()
    }
    cleanPlayer() {
        this.player && this.player.stop();
        clearInterval(this.downloadID);
        emitter.off(this.playingEvent)
    }
    componentDidMount() {
        this.startDownloader()
    }
    startDownloader(immidiate) {
        if (this.player) {
            this.cleanPlayer()
        }           
        this.setStatePure({
            duration: null,
            currentPosition: this.haveIPLayed() ? 1 : .00,
            playing: false,
            received: this.props.message.received,
            total: this.props.message.total,
            ...immidiate ? { canPlay: false } : {},
            sender_name: this.props.message.sender && this.props.message.sender.nickname,
            sender: this.props.message.sender && !(this.props.message.sender.phone == this.props.user),
            time: this.props.message.created_at && this.props.message.created_at.split(" ")[1],
            creator: this.props.message.sender && this.props.message.sender.phone == this.props.creator,
        }, () => {
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
            this.mountTimeout = setTimeout(() => {
                if (testForURL(this.props.message.source)) {
                    !this.props.message.cancled
                        ? this.downloadAudio(this.props.message.source)
                        : this.setStatePure({
                            downloading: false,
                        });
                } else {
                    //this.initialisePlayer(this.props.message.source);
                }

            }, immidiate ? 0 : 1000);
        });
    }
    componentDidUpdate(prevPro, prevState) {
        //console.warn("component updating: ",prevPro.message, this.props.message)
        if (this.props.message.source !== prevPro.message.source) {
            if (testForURL(this.props.message.source)) {
                this.startDownloader(true)
            } /*else {
                this.showPlayController()
                //this.initialisePlayer(this.props.message.source)
            }*/
        }
    }
    setAfterSuccess(path) {
        GState.downlading = false;
        this.source =
            Platform.OS === "android" ? path + "/" : "" + path;
        if (this.props.room) {
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
                );
            });
        } else {
            if (this.props.activity_id && this.props.updateSource) {
                this.props.updateSource(this.props.activity_id, {
                    ...this.props.data,
                    url: {
                        ...this.props.message,
                        received: this.state.received,
                        total: this.state.total,
                        source: this.source,
                        duration: this.props.message.duration,
                    }
                })
            }
        }
        this.initialisePlayer(this.source);
        this.setStatePure({
            loaded: true,
        });

    }
    success(path, total, received) {
        this.props.message.duration = this.exchanger.duration;
        this.setStatePure({
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
        this.setStatePure({
            downloadState: (newReceived / newTotal) * 100,
            total: newTotal,
            received: newReceived,
        });
    }
    source = this.props.message.source
    path = "/Sound/" + (this.props.message.file_name || this.props.message.id);
    duration = 10;
    pattern = [1000, 0, 0];
    tempPath = this.path + ".download";
    download(url) {
        clearInterval(this.downloadID);
        GState.downlading = true;
        this.setStatePure({
            downloading: true,
        });
        this.exchanger.download(this.state.received);
    }
    onError(error) {
        GState.downlading = false;
        console.warn(error);
        this.setStatePure({
            downloading: false,
            error: true,
        });
    }
    onFail(received, total) {
        //console.warn(total,received)
        this.props.message.duration = this.exchanger.duration;
        this.setStatePure({
            received: received,
            downloading: false,
            total:
                this.state.total && this.state.total > 0 && this.state.total > total
                    ? this.state.total
                    : total,
        });
        this.props.message.received = this.state.received;
        this.props.message.total = this.state.total;
        this.props.room && stores.Messages.addAudioSizeProperties(
            this.props.room,
            this.props.message.id,
            this.state.total,
            this.state.received,
            this.props.message.duration
        )
        this.setStatePure({});
    }
    downloadID = null;
    downloadAudio(url) {
        this.downloadID = setInterval(() => {
            this.download(url);
        }, 500);
    }
    showPlayController() {
        setTimeout(() => {
            this.setStatePure({
                canPlay: true
            })
        }, 400)
    }
    initialisePlayer(source, play) {
        this.player = new Sound(source, "/", (error) => {
            console.warn(error, "error");
            this.showPlayController()
            play && this.player.play(this.playerCallback.bind(this))
        });
    }
    player = null;
    pause() {
        clearInterval(this.refreshID)
        this.player && this.player.pause();
        emitter.off(this.playingEvent)
        this.setStatePure({
            playing: false,
        });
    }
    task = null;
    previousTime = 0;
    plays() {
        if (this.props.message.duration) {
            this.refreshID = setInterval(() => {
                this.player && this.player.getCurrentTime((time) => {
                    if (this.previousTime == time) clearInterval(this.refreshID);
                    else {
                        console.warn(time / this.props.message.duration)
                        this.previousTime = time;
                        this.setStatePure({
                            currentPosition: (time / this.props.message.duration) || .02,
                            currentTime: time,
                        });
                    }
                });
            }, 500);
        }
        this.setStatePure({
            playing: true,
        })
        emitter.emit(this.playingEvent)
        if (this.player) {
            this.player.play(this.playerCallback.bind(this));
            emitter.on(this.playingEvent, this.handlePLaying.bind(this))
        } else {
            this.initialisePlayer(this.source, true)
            emitter.on(this.playingEvent, this.handlePLaying.bind(this))
        }
        if (!this.haveIPLayed() && this.props.room) {
            Requester.playedMessage(this.props.message.id, this.props.room, this.props.activity_id)
        }
    }
    handlePLaying() {
        this.pause()
    }
    persistDuration(seconds) {
        if (this.props.room) {
            stores.Messages.addDuration(this.props.room, seconds, this.props.message.id).then(
                (status) => {

                }
            );
        } else {
            if (this.props.activity_id && this.props.updateSource) {
                this.props.updateSource(this.props.activity_id,
                    {
                        ...this.props.data, url: {
                            ...this.props.message,
                            duration:
                                seconds
                        }
                    })
            }
        }
    }
    playingEvent = "playing"
    playerCallback(success) {
        this.pause()
        if (success) {
            this.player && this.player.getCurrentTime((seconds) => {
                this.props.message.duration = Math.floor(seconds);
                this.setStatePure({
                    currentPosition: seconds / this.props.message.duration,
                    playing: false,
                    currentTime: seconds,
                });
                this.persistDuration(seconds)
            });
        }
    }
    showProgress() {
        if (this.props.message.duration) {
            this.setStatePure({
                showProgress: true,
            });
            this.progressTimout = setTimeout(() => {
                this.setStatePure({ showProgress: false }, () => {
                    clearTimeout(this.progressTimout)
                });
            }, 5000);
        }
    }
    haveIPLayed() {
        return this.props.room && this.props.message && this.props.message.played &&
            this.props.message.played.findIndex(ele => ele && ele.phone == stores.LoginStore.user.phone) >= 0
    }
    cancelDownLoad(url) {
        if (this.exchanger.task !== null) {
            this.exchanger.task.cancel((err, taskID) => { });
        }
        this.props.room && stores.Messages.SetCancledState(this.props.room, this.props.message.id);
        this.setStatePure({
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
        let trackColor = this.props.allplayed ? ColorList.reminds : ColorList.indicatorColor
       let textStyle = {
            width: "80%",
            flexDirection: "column",
            alignSelf: "center",
        };
        return (
            <View
                style={{
                    flexDirection: "column",
                    alignItems: "center",
                    margin: 1,
                    flex: 1,
                }}
            >
                <TouchableWithoutFeedback
                    //onLongPress={() =>
                    //    this.props.handleLongPress ? this.props.handleLongPress() : null
                    // }
                    onPressIn={() =>
                        this.props.pressingIn && this.props.pressingIn()
                    }
                >
                    <View
                        style={{
                            flexDirection: "row",
                            backgroundColor: ColorList.bottunerLighter,
                            borderRadius: ColorList.chatboxBorderRadius,
                            width: "99%",
                            alignItems: "center",
                            marginTop: '1%',
                            paddingLeft: '1%',
                            minWidth: 150,
                            alignSelf: "center",
                            minHeight: 50,
                            justifyContent: "space-between",
                        }}
                    >
                        {this.props.message.duration ? (
                            <View style={textStyle}>
                                <View>
                                    <Slider
                                        style={{
                                            alignSelf: 'flex-start',
                                            width:'90%'
                                        }}
                                        minimumValue={0.01}
                                        maximumValue={1}
                                        step={.01}
                                        thumbTouchSize={{ height: 50, width: 50 }}
                                        minimumTrackTintColor={trackColor}
                                        value={(isFinite(this.state.currentPosition) && (this.state.currentPosition) || .01) || .01}
                                        onValueChange={(value) => {
                                            //this.plays()
                                            setTimeout(() => {
                                                this.player && this.player.setCurrentTime(
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
                        <View style={{ width: this.props.message.duration ? "15%" : "100%", alignItems: "center",marginLeft: "2%", }}>
                            {testForURL(this.source) ? (
                                <AnimatedCircularProgress
                                    size={40}
                                    width={3}
                                    fill={
                                        testForURL(this.source)
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
                                                    <EvilIcons
                                                        style={{ ...GState.defaultIconSize, color: ColorList.bodyText }}
                                                        type="EvilIcons"
                                                        name={
                                                            this.state.downloading ? "close" : "arrow-down"
                                                        }
                                                    ></EvilIcons>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </AnimatedCircularProgress>
                            ) : this.state.canPlay ? (
                                <TouchableOpacity
                                    style={this.playIconStyle}
                                    onPress={() =>
                                        requestAnimationFrame(() =>
                                            !this.state.playing ? this.plays() : this.pause()
                                        )
                                    }
                                >
                                    <FontAwesome5
                                        type="FontAwesome5"
                                        style={{ ...GState.defaultIconSize, color: ColorList.bodyText, fontSize: 20 }}
                                        name={!this.state.playing ? "play" : "pause"}
                                    />
                                </TouchableOpacity>
                            ) : <Spinner></Spinner>}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                {this.props.message.text ? <View style={{ margin: "1%", alignSelf: "flex-start" }}>
                    <TextContent
                        animate={this.props.animate}
                        foundString={this.props.foundString}
                        searchString={this.props.searchString}
                        text={this.props.message.text}
                        tags={this.props.message.tags}
                        //handleLongPress={this.props.handleLongPress}
                        pressingIn={this.props.pressingIn}
                    ></TextContent>
                </View> : null}
            </View>
        );
    }
}
