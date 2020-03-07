import React, { Component } from 'react';
import {
    View, Dimensions, StatusBar
} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Image from 'react-native-scalable-image';
import Modal from "react-native-modalbox"
import {Icon, Thumbnail, Toast,Text} from 'native-base';
import CacheImages from '../../CacheImages';
import StatusBarWhiter from './StatusBarWhiter';
import testForURL from '../../../services/testForURL';
import rnFetchBlob from 'rn-fetch-blob';
import moment  from 'moment';
let dirs = rnFetchBlob.fs.dirs
export default class PhotoViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hidden: false
        }
    }
    state = {

    }
    componentWillUnmount() {
        //StatusBar.setHidden(false, false)
    }
    downLoadImage() {
        this.props.hidePhoto()
        if (testForURL(this.props.photo)) {
            let path = dirs.DownloadDir + '/Bleashup/' + this.props.photo.split('/')[this.props.photo.split('/').length - 1]
            rnFetchBlob.fs.exists(path).then(status => {
                if (status) {
                    Toast.show({
                        text: 'Image has already been downloaded',
                        duration: 4000,
                    })
                } else {
                    rnFetchBlob.config({
                        path: path,
                        addAndroidDownloads: {
                            useDownloadManager: true, // <-- this is the only thing required
                            // Optional, override notification setting (default to true)
                            notification: false,
                            path: path,
                            // Optional, but recommended since android DownloadManager will fail when
                            // the url does not contains a file extension, by default the mime type will be text/plain
                            mime: 'text/plain',
                            title: 'Activity image',
                            description: 'File Downloaded by Bleashup'
                        }
                    }).fetch('GET', this.props.photo).then((res) => {
                        Toast.show({ text: 'Image Successfully downloaded', type: 'success', duration: 4000 })
                    }).catch((e) => {
                        console.warn(e)
                        Toast.show({
                            text: 'unable to download this image',
                            duration: 5000
                        })
                    })
                }
            })
        }
    }
    handleForwardImage() {
        this.props.hidePhoto()
    }
    render() {
        // StatusBar.setHidden(true,true)
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
                    //StatusBar.setHidden(false, false)
                    this.setState({
                        message: null,
                        title: null,
                        callback: null,
                    })
                }}
                onOpened={() => {


                }}
                style={{
                    height: "100%",
                    borderRadius: 10, backgroundColor: 'black', width: "100%"
                }}
            >
                <View>
                    <StatusBarWhiter></StatusBarWhiter>
                    <View style={{ height: screenheight, width: screenWidth, backgroundColor: "black", }}>
                        <View style={{ alignSelf: 'center', }}>
                            <ReactNativeZoomableView
                                maxZoom={1.5}
                                minZoom={0.5}
                                zoomStep={0.5}
                                initialZoom={1}
                                bindToBorders={true}
                                onZoomAfter={this.logOutZoomState}>
                                {testForURL(this.props.photo) ? <CacheImages resizeMode={"contain"} width={screenWidth} height={screenheight}
                                    source={{ uri: this.props.photo }}></CacheImages> :
                                    <Image resizeMode={"contain"}
                                        width={screenWidth}
                                        height={screenheight}
                                        source={{ uri: this.props.photo }}></Image>}
                            </ReactNativeZoomableView>
                            <View style={{ flexDirection: 'column', position: 'absolute', margin: '1%', }}>
                                <View style={{flexDirection: 'row', margin: '2%',}}>
                                    <View style={{ width: '75%' }}>
                                        <Icon type="EvilIcons" onPress={() => {
                                            this.props.hidePhoto()
                                        }} style={{
                                            fontSize: 30, color: "#FEFFDE"
                                        }} name={"close"}></Icon></View>
                                    <View style={{ flexDirection: 'row', width: '25%' }}>
                                        <View style={{ width: '60%' }}>
                                            <Icon onPress={() => {
                                                this.handleForwardImage()
                                            }} style={{ alignSelf: 'flex-start', margin: '3%', color: '#FEFFDE' }}
                                                type={"Entypo"}
                                                name={"forward"} >
                                            </Icon>
                                        </View>
                                        <View>
                                            <Icon onPress={() => {
                                                this.downLoadImage()
                                            }} style={{ alignSelf: 'flex-end', margin: '3%', color: '#FEFFDE' }}
                                                type={"AntDesign"}
                                                name={"clouddownload"}>
                                            </Icon>
                                        </View>
                                    </View>
                                </View>
                                <View style={{margin: '2%',}}>
                                    {this.props.created_at ? <Text style={{ color: '#FEFFDE' }} note>{moment(this.props.created_at).calendar()}</Text> : null}
                                </View>
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>
        );
    }
}