import React, { Component } from 'react';
import {
    View, Dimensions, StatusBar, Keyboard
} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Image from 'react-native-scalable-image';
import Orientation from 'react-native-orientation-locker';

import { Icon, Text } from 'native-base';
import VideoController from '../eventChat/VideoController';
import moment from 'moment';
import BleashupModal from '../../mainComponents/BleashupModal';
export default class VideoViewer extends BleashupModal {
    initialize() {
        this.state = {
            hidden: false,
            fullScreen: true
        }
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
    enterFullscreen() {
        Keyboard.dismiss()
        //this.state.fullScreen ? Orientation.lockToPortrait() : Orientation.lockToLandscapeLeft(); //this will unlock the view to all Orientations
        this.setState({
            fullScreen: !this.state.fullScreen,
        })

    }
    componentWillUnmount() {
        //StatusBar.setHidden(false, false)
    }
    transparent = "rgba(50, 51, 53, 0.8)";
    backdropOpacity = 0.1
    entry = "top"
    position = "top"
    onClosedModal() {
        Orientation.lockToPortrait()
        this.props.hideVideo()
        //StatusBar.setHidden(false, false)
        this.setState({
            message: null,
            fullScreen: true,
            title: null,
            callback: null,
        })
    }
    modalBackground = this.transparent
    modalHeight = this.state.fullScreen ? screenheight : 400
    onOpenModal() {
        setTimeout(() => this.setState({
            hidden: true,
        }), 100)

    }
    modalBody() {
        return (
            <View>
                <StatusBar animated={true} barStyle="light-content" backgroundColor="black"></StatusBar>
                <View style={{ height: screenheight - 60, width: screenWidth, borderRadius: 8, }}>
                    <View style={{
                        height: this.state.fullScreen ? '100%' : 400,
                        width: this.state.fullScreen ? "100%" : screenWidth,
                        backgroundColor: 'black',
                        alignSelf: 'center',
                    }}>
                        <VideoController source={{ uri: this.props.video }} // Can be a URL or a local file.
                            ref={(ref) => {
                                this.videoPlayer = ref;
                            }} onBuffer={() => this.buffering()} // Callback when remote video is buffering
                            onError={(error) => {
                                console.error(error);
                            }} toggleResizeModeOnFullscreen={false}
                            //pictureInPicture={true}
                            resizeMode={"contain"} disableVolume={true} seekColor="#1FABAB" controlTimeout={null}
                            //disablePlayPause={true}
                            //disableFullscreen={true}
                            onBack={() => this.props.hideVideo()}
                            onEnterFullscreen={() => this.enterFullscreen()}
                            onExitFullscreen={() => this.enterFullscreen()}
                            fullscreenOrientation={"landscape"}
                            //fullscreen={true}
                            //controls={true}
                            style={{
                                backgroundColor: this.transparent,
                            }} videoStyle={{
                                alignItems: 'center',
                                height: "100%",
                                width: "100%",
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                            }} // Callback when video cannot be loaded
                        />
                    </View>
                </View>
                <View style={{ backgroundColor: 'black', height: 60 }}>
                    <Text style={{ color: '#FEFFDE' }} note>{this.props.created_at ? moment(this.props.created_at).calendar() : ""}</Text>
                </View>
            </View>
        );
    }
}