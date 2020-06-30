/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { Component,useState } from 'react';
import {
    View, Dimensions, StatusBar, Keyboard
} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Image from 'react-native-scalable-image';
//import Orientation from 'react-native-orientation-locker';
import { Icon, Text } from 'native-base';
import VideoViewerController from './videoViewerController';
import moment from 'moment';
import ColorList from '../../../colorList';



const VideoView = (props) => {
    const {} = props;
    const [hidden, setHidden] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [buffering, setBuffering] = useState(false);
   // console.warn("paused is", props.isPause);

    const Buffering = () => {
        setBuffering(true);

        setTimeout(() => {
            setBuffering(false);
        }, 5000);
    };

    const enterFullscreen = () => {

        Keyboard.dismiss();
        //Orientation.lockToPortrait()
        setFullScreen(true);
    };

    const exitFullscreen = () => {
        Keyboard.dismiss();
        //Orientation.lockToPortrait()
        setFullScreen(false);

    };


   const  transparent = "rgba(50, 51, 53, 0.8)";

        return (
                <View style={{
                        height: fullScreen ? "100%" : (props.height?props.height:248),
                        width: fullScreen ? "100%" : (props.width?props.width:screenWidth),
                        backgroundColor: 'black',
                        //alignSelf: 'center',
                    }}>
                        <VideoViewerController 
                            source={{ uri: props.video }} // Can be a URL or a local file.
                            ref={(ref) => {
                                this.videoPlayer = ref;
                            }} 
                            onBuffer={Buffering} // Callback when remote video is buffering
                            onError={(error) => {
                                console.error(error);
                            }} 
                            toggleResizeModeOnFullscreen={false}
                            //pictureInPicture={true}
                            resizeMode={"contain"} 
                            disableVolume={true} 
                            seekColor="white" 
                            controlTimeout={null}
                            //disablePlayPause={true}
                            //disableFullscreen={true}
                            onBack={() => props.hideVideo()}
                            onEnterFullscreen={enterFullscreen}
                            onExitFullscreen = {exitFullscreen}
                            fullscreenOrientation={"landscape"}
                            onLoad={props.onLoad}
                            //paused = {props.isPause && props.isPause}
                            disableBack={true}
                            disableFullscreen={true}
                            nextPrev={false}
                            nextVideo = {props.nextVideo}
                            previousVideo = {props.prevVideo}
                            fullscreen={fullScreen}
                            //controls={true}
                            style={{
                                backgroundColor: 'black',
                            }} 
                            videoStyle={{
                                alignItems: 'center',
                                height: "100%",
                                width: "100%",
                                top:0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                opacity:0.7,
                            }} // Callback when video cannot be loaded
                        />
                    </View>
        );
}

export default VideoView;




/**


export default class VideoView extends Component {
    constructor(props){
        super(props)
        this.state = {
            hidden: false,
            fullScreen: false
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
    enterFullscreen = () => {
        if(this.props.enterFullscreen){
           this.props.enterFullscreen();
        }
        Keyboard.dismiss()
        this.state.fullScreen ? Orientation.lockToPortrait() : Orientation.lockToLandscapeLeft(); //this will unlock the view to all Orientations
        this.setState({fullScreen: !this.state.fullScreen,})

    }

    componentWillUnmount() {
        //StatusBar.setHidden(false, false)
    }

    transparent = "rgba(50, 51, 53, 0.8)";


    render() {
        return (
                <View style={{
                        height: this.state.fullScreen ? "100%" : 250,
                        width: this.state.fullScreen ? "100%" : screenWidth,
                        backgroundColor: ColorList.bodyBackgrounddark,
                        alignSelf: 'center',
                       
                    }}>
                        <VideoViewerController 
                            source={{ uri: this.props.video }} // Can be a URL or a local file.
                            ref={(ref) => {
                                this.videoPlayer = ref;
                            }} 
                            onBuffer={() => this.buffering()} // Callback when remote video is buffering
                            onError={(error) => {
                                console.error(error);
                            }} 
                            toggleResizeModeOnFullscreen={false}
                            //pictureInPicture={true}
                            resizeMode={"contain"} 
                            disableVolume={true} 
                            seekColor="white" 
                            controlTimeout={null}
                            //disablePlayPause={true}
                            //disableFullscreen={true}
                            onBack={() => this.props.hideVideo()}
                            onEnterFullscreen={() => this.enterFullscreen()}
                            onExitFullscreen={() => this.enterFullscreen()}
                            fullscreenOrientation={"landscape"}
                            onLoad={this.props.onLoad}
                            disableBack={true}
                            nextPrev={true}
                            nextVideo = {this.props.nextVideo}
                            previousVideo = {this.props.prevVideo}
                            //fullscreen={this.state.fullScreen}
                            //controls={true}
                            style={{
                                backgroundColor: ColorList.bodyBackgrounddark,
                            }} 
                            videoStyle={{
                                alignItems: 'center',
                                height: "100%",
                                width: "100%",
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                opacity:0.7
                            }} // Callback when video cannot be loaded
                        />
                    </View>
        );
    }
}






*/