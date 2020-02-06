import React, { Component } from 'react';
import {
    View, Dimensions, StatusBar
} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Image from 'react-native-scalable-image';
import Modal from "react-native-modalbox"
import { Icon } from 'native-base';
import CacheImages from '../../CacheImages';
export default class PhotoViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hidden:false
        }
    }
    state = {
        
    }
    componentWillUnmount(){
        StatusBar.setHidden(false, false)
    }
    render() {
        StatusBar.setHidden(true,true)
        return (
            <Modal
                backdropOpacity={0.7}
                backButtonClose={true}
                position='center'
                coverScreen={true}
                //animationDuration={0}
                isOpen={this.props.open}
                onClosed={() => {
                    this.props.hidePhoto()
                    StatusBar.setHidden(false, false)
                    this.setState({
                        message: null,
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
                    height: "100%",
                    borderRadius: 10, backgroundColor: 'black', width: "100%"
                }}
            >
                <View>
                    <StatusBar animated={true}   barStyle="dark-content" backgroundColor="black"></StatusBar>
                    <View style={{ height: screenheight, width: screenWidth, backgroundColor: "black", }}>
                        <View style={{ alignSelf: 'center', }}>
                            <ReactNativeZoomableView
                                maxZoom={1.5}
                                minZoom={0.5}
                                zoomStep={0.5}
                                initialZoom={1}
                                bindToBorders={true}
                                onZoomAfter={this.logOutZoomState}>
                                <CacheImages resizeMode={"contain"} width={screenWidth} height={screenheight}
                                    source={{ uri: this.props.photo }}></CacheImages>
                            </ReactNativeZoomableView>
                            <Icon type="EvilIcons" onPress={() => {
                                this.props.hidePhoto()
                            }} style={{ margin: '1%', position: 'absolute', fontSize: 30, color: "#FEFFDE" }} name={"close"}></Icon></View>
                    </View>
                </View>
            </Modal>
        );
    }
}