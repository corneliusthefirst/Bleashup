import React, { Component } from 'react';
import {
    View, Dimensions, StatusBar
} from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import Image from 'react-native-scalable-image';
import { Icon, Thumbnail, Toast, Text } from 'native-base';
import CacheImages from '../../CacheImages';
import StatusBarWhiter from './StatusBarWhiter';
import testForURL from '../../../services/testForURL';
import rnFetchBlob from 'rn-fetch-blob';
import moment from 'moment';
import shadower from '../../shadower';
import buttoner from '../../../services/buttoner';
import BleashupModal from '../../mainComponents/BleashupModal';
let dirs = rnFetchBlob.fs.dirs
export default class PhotoViewer extends BleashupModal {
    initialize() {
        this.state = {
            hidden: false
        }
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
    onClosedModal() {
        this.props.hidePhoto()
        //StatusBar.setHidden(false, false)
        this.setState({
            message: null,
            title: null,
            callback: null,
        })
    }
    modalBackground = "black"
    modalBody() {
        return (
               <View>
               <StatusBarWhiter></StatusBarWhiter>
                <View style={{ height: screenheight, width: screenWidth, backgroundColor: "black", }}>
                    <View style={{ alignSelf: 'center', width: screenWidth }}>
                        {testForURL(this.props.photo) ? <CacheImages style={{ alignSelf: 'center', }} resizeMode={"contain"} width={screenWidth} height={screenheight}
                            source={{ uri: this.props.photo }}></CacheImages> :
                            <Image resizeMode={"contain"}
                                width={screenWidth}
                                height={screenheight}
                                source={{ uri: this.props.photo }}></Image>}
                        <View style={{ flexDirection: 'row', position: 'absolute', width: screenWidth }}>
                
                                    
                                     <View style={{...buttoner,width:"15%"}} >
                                        <Icon type="EvilIcons" onPress={() => {
                                            this.props.hidePhoto()
                                        }} style={{
                                            fontSize: 30, color: 'ivory'
                                        }} name={"close"}></Icon>
                                       </View>

                                        <View style={{...buttoner, width:"15%" ,marginLeft:"55%"}}>
                                            <Icon onPress={() => {
                                                this.handleForwardImage()
                                            }} style={{color: 'ivory' }}
                                                type={"Entypo"}
                                                name={"forward"} >
                                            </Icon>
                                        </View>
                                  

                                    <View style={{...buttoner, width:"15%"}}>
                                        <Icon onPress={() => {
                                            this.downLoadImage()
                                        }} style={{ color: 'ivory' }}
                                            type={"AntDesign"}
                                            name={"clouddownload"}>
                                        </Icon>
                                    </View>                   

                            </View>
                            <View style={{ margin: '1%', ...buttoner, width: 130, height: 20 }}>
                                {this.props.created_at ? <Text style={{ color: '#FEFFDE', marginBottom: 6, }} note>{moment(this.props.created_at).calendar()}</Text> : null}
                            </View>
                        </View>

                    </View>

                </View>    
        );
    }
}