import React, { Component } from "react"
import { View, Image, TouchableOpacity } from 'react-native';
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import VideoController from "./VideoController";
import ColorList from '../../colorList';
import rounder from "../../../services/rounder";
import CacheImages from '../../CacheImages';
import shadower from "../../shadower";
import BeComponent from '../../BeComponent';
import  EvilIcons  from 'react-native-vector-icons/EvilIcons';
import GState from "../../../stores/globalState";
export default class PhotoPreview extends BeComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }
    shouldComponentUpdate(nextProp,nextState){
        return this.props.video !== nextProp.video || 
        this.props.image !== nextProp.image
    }
    containerHeight=100
    logOutZoomState = (event, gestureState, zoomableViewEventObject) => { };
    render() {
        return !this.props.showVideo ? (
            <View
                style={{
                    height: this.containerHeight,
                    borderTopLeftRadius: 5, backgroundColor: ColorList.bodyBackground,
                    borderTopRightRadius: 5,
                    width: "100%",
                }}
            >
                <ReactNativeZoomableView
                    style={{
                        height: this.containerHeight,
                        borderTopLeftRadius: 5, backgroundColor: ColorList.bodyBackground,
                        borderTopRightRadius: 5,
                        backgroundColor: ColorList.bodyBackground,
                        width: "100%",
                    }}
                    maxZoom={1}
                    minZoom={0.5}
                    zoomStep={0.5}
                    initialZoom={1}
                    bindToBorders={true}
                    onZoomAfter={this.logOutZoomState}
                >
                    <CacheImages thumbnails square
                        style={{ width: "98%", height: "98%",alignSelf:"center",margin: '1%',
                        borderTopLeftRadius: 5,backgroundColor: ColorList.bodyBackground,
                        borderTopRightRadius: 5,}}
                        source={{ uri: this.props.image }}
                    ></CacheImages>
                </ReactNativeZoomableView>
                <TouchableOpacity
                    onPress={() => requestAnimationFrame(this.props.hideCaption)}
                    style={{
                        position: "absolute",
                        ...rounder(15, ColorList.bodyBackground),
                        alignSelf: "flex-end",
                        justifyContent: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <EvilIcons
                        name="close"
                        type="EvilIcons"
                        style={{
                            ...GState.defaultIconSize,
                            fontSize: 15,
                        }}
                    />
                </TouchableOpacity>
            </View>
        ) : (
                <View style={{ width: "100%", height: this.containerHeight }}>
                    <VideoController
                        source={{ uri: this.props.video }}
                        resizeMode={"contain"}
                        paused={true}
                        disableVolume={true}
                        seekColor={ColorList.indicatorColor}
                        disableFullscreen={true}
                        onBack={this.props.hideCaption}
                        style={{
                            width: "98%",
                            height: "98%",
                            alignSelf: 'center',
                            marginTop: '1%',
                            borderTopRightRadius: 5,
                            borderTopLeftRadius: 5,
                        }}
                        videoStyle={{
                            alignItems: "center",
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            height: "95%",
                            width: "100%",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                        }}
                    ></VideoController>
                </View>)
    }
}