import React, { Component } from "react"
import { View, Image, TouchableOpacity } from 'react-native';
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import VideoController from "./VideoController";
import ColorList from '../../colorList';
import rounder from "../../../services/rounder";
import { Icon } from "native-base";
import CacheImages from '../../CacheImages';
import shadower from "../../shadower";
export default class PhotoPreview extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    shouldComponentUpdate(nextProp,nextState){
        return this.props.video !== nextProp.video || 
        this.props.image !== nextProp.image
    }
    logOutZoomState = (event, gestureState, zoomableViewEventObject) => { };
    render() {
        return !this.props.showVideo ? (
            <View
                style={{
                    height: 300,
                    width: "100%",
                }}
            >
                <ReactNativeZoomableView
                    style={{
                        height: 300,
                        width: "100%",
                    }}
                    maxZoom={1.5}
                    minZoom={0.5}
                    zoomStep={0.5}
                    initialZoom={1}
                    bindToBorders={true}
                    onZoomAfter={this.logOutZoomState}
                >
                    <CacheImages thubmnails square
                        style={{ width: "100%", height: "100%",alignSelf:"center",
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5, ...shadower(1)}}
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
                    <Icon
                        name="close"
                        type="EvilIcons"
                        style={{
                            fontSize: 15,
                        }}
                    ></Icon>
                </TouchableOpacity>
            </View>
        ) : (
                <View style={{ width: "100%", height: 300 }}>
                    <VideoController
                        source={{ uri: this.props.video }}
                        resizeMode={"contain"}
                        paused={false}
                        disableVolume={true}
                        seekColor={ColorList.indicatorColor}
                        disableFullscreen={true}
                        onBack={this.props.hideCaption}
                        style={{
                            width: "100%",
                            height: "100%",
                            borderTopRightRadius: 5,
                            borderTopLeftRadius: 5,
                        }}
                        videoStyle={{
                            alignItems: "center",
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            height: "100%",
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