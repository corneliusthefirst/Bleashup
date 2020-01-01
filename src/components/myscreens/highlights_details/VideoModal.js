import React, { Component } from 'react';
import {
    View, Dimensions, StatusBar, Keyboard
} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Image from 'react-native-scalable-image';
import Orientation from 'react-native-orientation-locker';

import Modal from "react-native-modalbox"
import { Icon } from 'native-base';
import VideoController from '../eventChat/VideoController';
export default class VideoViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hidden: false,
            fullScreen:true
        }
    }
    state = {

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
    componentWillUnmount(){
        StatusBar.setHidden(false, false)
    }
    transparent = "rgba(50, 51, 53, 0.8)";
    render() {
        StatusBar.setHidden(true, true)
        return (
            <Modal
             //backdropPressToClose={false}
                //swipeToClose={false}
                backdropOpacity={.1}
                backButtonClose={true}
                position='top'
                entry={'top'}
                coverScreen={false}
                animationDuration={300}
                isOpen={this.props.open}
                onClosed={() => {
                    Orientation.lockToPortrait()
                    this.props.hideVideo()
                    StatusBar.setHidden(false, false)
                    this.setState({
                        message: null,
                        fullScreen:true,
                        title: null,
                        callback: null,
                    })
                }}
                onOpened={() => {
                    setTimeout(() => this.setState({
                        hidden: true,
                    }), 100)

                }}
                style={{
                    height: this.state.fullScreen ? screenheight : 400,
                    width: "100%",backgroundColor: this.transparent,
                }}
            >
                <View>
                    <View style={{ height: screenheight, width: screenWidth,  }}>
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
                </View>
            </Modal>
        );
    }
}