/* eslint-disable prettier/prettier */
import React, { PureComponent } from 'react';
import { View, TouchableOpacity, ScrollView, Image } from "react-native"
import AreYouSure from './AreYouSureModal';
import CacheImages from '../../CacheImages';
import shadower from '../../shadower';
import BleashupModal from '../../mainComponents/BleashupModal';
import PickersUpload from './createEvent/components/PickerUpload';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ColorList from '../../colorList';
import PhotoPreview from '../eventChat/PhotoPreviewer';
import PhotoViewer from './PhotoViewer';
import rounder from '../../../services/rounder';
import GState from '../../../stores/globalState';
import testForURL from '../../../services/testForURL';
import Swipeout from '../eventChat/Swipeout';

export default class PhotoInputModal extends BleashupModal {
    initialize() {
        this.state = {
        }
    }
    onClosedModal() {
        this.props.closed()
        this.setStatePure({
            message: null,
            title: null,
            callback: null,
        })
    }
    entry = "top"
    swipeToClose = false
    modalHeight = GState.height * .6
    modalWidth = GState.width * .8
    borderRadius = 5
    photoStyle = {
        width: this.modalWidth * .95,
        alignSelf: 'center',
        height: this.modalHeight * .8,
        borderRadius: 5
    }
    color = ColorList.colorArray[Math.floor(Math.random() * (ColorList.colorArray.length - 1))]
    position = "center"
    modalBody() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{ flexDirection: 'column', }}>
                <Swipeout swipeRight={this.props.replyToPhoto}>
                    <TouchableOpacity onPress={() => this.setStatePure({
                        showPhoto: true
                    })} style={{
                        backgroundColor: ColorList.indicatorColor,
                        ...shadower(2),
                        alignSelf: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 10,
                        borderRadius: 5,
                        width: this.modalWidth * .95,
                        height: this.modalHeight * .82
                    }}>
                        {testForURL(this.props.photo) ? <CacheImages
                            source={{ uri: this.props.photo }}
                            style={this.photoStyle} thumbnails
                            square></CacheImages> :
                            <View
                                style={
                                    {
                                        ...this.photoStyle,
                                        backgroundColor: this.color,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                resizeMode={"cover"}
                                source={this.props.isRelation ? GState.profilePlaceHolder : GState.activity_place_holder}
                            >
                                <MaterialIcons name={'chat-bubble'}
                                    style={{
                                        ...GState.defaultIconSize,
                                        fontSize: 200,
                                        color: ColorList.bodyBackground
                                    }}
                                >
                                </MaterialIcons>
                            </View>}
                    </TouchableOpacity>
                </Swipeout>
                <View style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent:'center',
                    borderRadius: 4,
                    width: '100%',
                    height: 40,
                }}>
                    {!this.props.isRelation && <View style={{justifyContent:'center',alignItems:'center' }}>
                        <PickersUpload
                            withTrash={!this.props.isRelation && this.props.photo}
                            currentURL={{ photo: this.props.photo }}
                            saveMedia={(url) => this.props.saveBackground(url.photo)}
                            creating={false}
                            notVideo
                            notAudio
                            notFile>
                        </PickersUpload>
                    </View>}
                </View>
                {this.state.showPhoto ? <PhotoViewer
                    open={this.state.showPhoto}
                    photo={this.props.photo}
                    hidePhoto={() => {
                        this.setStatePure({
                            showPhoto: false
                        })
                    }}
                >
                </PhotoViewer> : null}
            </ScrollView>
        );
    }
}