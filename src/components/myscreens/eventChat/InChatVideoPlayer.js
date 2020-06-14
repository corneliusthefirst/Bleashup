import React , {Component} from "react"
import {View} from "react-native"
import ColorList from '../../colorList';
import VideoController from './VideoController';
export default class InChatVideoPlayer extends Component {
    constructor(props){
        super(props)
    }
    shouldComponentUpdate(nextProps,nextState){
        return this.props.fullScreen !== nextProps.fullScreen
    }
    render(){
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
                onBuffer={this.props.buffering} // Callback when remote video is buffering
                onError={(error) => {
                    console.error(error);
                }}
                toggleResizeModeOnFullscreen={false}
                //pictureInPicture={true}
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