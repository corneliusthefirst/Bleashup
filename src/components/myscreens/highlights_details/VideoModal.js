import React, { Component } from 'react';
import {
    View, Dimensions, StatusBar, Keyboard, Text
} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import VideoController from '../eventChat/VideoController';
import moment from 'moment';
import BleashupModal from '../../mainComponents/BleashupModal';
import ColorList from '../../colorList';

export default class VideoViewer extends BleashupModal {
    initialize() {
        this.state = {
            hidden: false,
            fullScreen: true
        }
    }
    buffering() {
        this.setStatePure({
            buffering: true
        })
       this.bufferingTimeout = setTimeout(() => {
            this.setStatePure({
                buffering: false
            })
        }, 5000)
    }
    unmountingComponent(){
        clearTimeout(this.buffering)
    }
    enterFullscreen() {
        Keyboard.dismiss()
        this.setStatePure({
            fullScreen: !this.state.fullScreen,
        })

    }
    componentWillUnmount() {
        //StatusBar.setHidden(false, false)
    }
    getNavParam(param){
        return this.props.navigation && this.props.navigation.getParam(param)
    } 
    isRoute = this.getNavParam("video")
    navVideo = this.getNavParam("video")
    transparent = "rgba(50, 51, 53, 0.8)";
    backdropOpacity = 0.1
    entry = "top"
    position = "top"
    onClosedModal() {
        //this.props.hideVideo()
        //StatusBar.setHidden(false, false)
        this.setStatePure({
            message: null,
            fullScreen: true,
            title: null,
            callback: null,
        })
    }
    modalBackground = this.transparent
    modalHeight = this.state.fullScreen ? screenheight : 400
    onOpenModal() {
       this.openModalTimeout= setTimeout(() => this.setStatePure({
            hidden: true,
        }), 100)

    }
    date = this.getNavParam("date") || this.props.created_at
    render(){
        return this.isRoute ? this.modalBody() : this.modal()
    }
    modalBody() {
        return (
            <View style={{flex: 1,backgroundColor: 'black',}}>
                <StatusBar animated={true} barStyle="light-content" backgroundColor="black"></StatusBar>
                <View style={{ height: screenheight - 60, width: screenWidth, borderRadius: 8, }}>
                    <View style={{
                        height: this.state.fullScreen ? '100%' : 400,
                        width: this.state.fullScreen ? "100%" : screenWidth,
                        backgroundColor: 'black',
                        alignSelf: 'center',
                    }}>
                        <VideoController 
                        source={{ uri: this.navVideo || this.props.video }} // Can be a URL or a local file.
                            ref={(ref) => {
                                this.videoPlayer = ref;
                            }} 
                            onBuffer={() => this.buffering()} // Callback when remote video is buffering
                            onError={(error) => {
                                console.error(error);
                            }} 
                            toggleResizeModeOnFullscreen={false}
                            resizeMode={"contain"} 
                            disableVolume={true} 
                            seekColor={ColorList.indicatorColor} 
                            controlTimeout={null}
                            onBack={() => this.isRoute ? this.props.navigation.goBack()
                                : this.props.hideVideo()}
                            onEnterFullscreen={() => this.enterFullscreen()}
                            onExitFullscreen={() => this.enterFullscreen()}
                            fullscreenOrientation={"landscape"}
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
                    <Text style={{ color: ColorList.bodyBackground }} note>{this.date ? moment(this.date).calendar() : ""}</Text>
                </View>
            </View>
        );
    }
}