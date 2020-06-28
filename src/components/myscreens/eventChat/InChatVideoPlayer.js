import React, { Component } from "react"
import { View } from "react-native"
import ColorList from '../../colorList';
import VideoController from './VideoController';
import { Icon } from "native-base";
import rounder from "../../../services/rounder";
import { TouchableOpacity } from 'react-native-gesture-handler';
export default class InChatVideoPlayer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playing: false
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.fullScreen !== nextProps.fullScreen ||
            this.state.isReactionOpened !== nextState.isReactionOpened ||
            this.state.playing !== nextState.playing ||
            this.props.video !== nextProps.video
    }
    iconStyles = {
        color: ColorList.bodyBackground
    }
    containerStyle = {
        ...rounder(35, ColorList.bottunerLighter),
        flexDirection: 'row',
        marginRight: 3,
        justifyContent: 'center',
    }
    showReactionModal() {
        this.setState({
            isReactionOpened: true,
        }, () => {
            this.videoPlayer._toggleControls()
            setTimeout(() => this.videoPlayer._toggleControls(), 700)
        })

    }
    render() {
        return <View
            style={{
                height: this.props.fullScreen
                    ? "100%"
                    : "40%",
                margin: '3%',
                alignSelf: 'center',
                width: this.props.fullScreen ? "100%" : "98%",
                position: "absolute",
            }}
        >
            <VideoController
                source={{ uri: this.props.video }} // Can be a URL or a local file.
                ref={(ref) => {
                    this.videoPlayer = ref;
                }}
                extra={<View style={{
                    width: 250,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    alignContent: 'flex-end',
                }}>
                    <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity onPress={() => {
                            this.props.focusInput()
                            this.props.reply(this.props.message)
                        }} style={this.containerStyle}>
                            <Icon name={"reply"} style={this.iconStyles} type={"Entypo"}>
                            </Icon>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.videoPlayer._pausePlayer()
                            this.props.forward(this.props.message)
                        }} style={this.containerStyle}>
                            <Icon name="forward" style={this.iconStyles} type={"Entypo"}></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.videoPlayer._pausePlayer()
                            this.props.enterFullscreen()
                        }} style={{ ...this.containerStyle }}>
                            <Icon style={{ color: ColorList.bodyBackground, marginBottom: 'auto', marginTop: 'auto', }} type="MaterialIcons" name="fullscreen">
                            </Icon>
                        </TouchableOpacity>
                    </View>
                </View>}
                onBuffer={this.props.buffering} // Callback when remote video is buffering
                onError={(error) => {
                    console.error(error);
                }}
                expandContainerStyle={this.containerStyle}
                toggleResizeModeOnFullscreen={false}
                //pictureInPicture={true}
                paused={this.state.playing}
                messaging
                resizeMode={"contain"}
                disableVolume={true}
                seekColor={ColorList.indicatorColor}
                controlTimeout={null}
                onBack={this.props.hideVideo}
                onEnterFullscreen={this.props.enterFullscreen}
                onExitFullscreen={this.props.enterFullscreen}
                fullscreenOrientation={"landscape"}
                containerStyle={{
                    alignSelf: "center",
                }}
                videoStyle={{
                    alignItems: "center",
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginTop: '1%',
                    height: "94%",
                    width: "100%",
                }} // Callback when video cannot be loaded
            />
        </View>
    }
}