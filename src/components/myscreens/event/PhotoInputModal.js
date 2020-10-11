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
    entry="top"
    swipeToClose = false
    modalHeight = 340
    modalWidth = 300
    borderRadius = 5
    photoStyle = {
        width: 300,
        height: 290,
        borderRadius: 5
    }
    position = "center"
    modalBody() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={{ flexDirection: 'column', }}>
                <TouchableOpacity onPress={() => this.setStatePure({
                    showPhoto: true
                })} style={{
                    backgroundColor: ColorList.indicatorColor,
                    ...shadower(2),
                    alignSelf: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                    width: 300,
                    height: 300
                }}>
                    {testForURL(this.props.photo) ? <CacheImages
                        source={{ uri: this.props.photo }}
                        style={this.photoStyle} thumbnails
                        square></CacheImages> :
                        <Image
                            style={this.photoStyle}
                            resizeMode={"cover"}
                            source={this.props.isRelation ? GState.profilePlaceHolder : GState.activity_place_holder}
                        ></Image>}
                </TouchableOpacity>



                <View style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                    alignItems: 'center',
                    marginLeft: "1%",
                    borderRadius: 4, width: '100%', height: 40,
                }}>
                    <View style={{
                        width: this.props.isRelation ? 35 : '60%',
                        borderRadius: 35,
                        marginLeft: "1%",
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        ...shadower(1),
                        backgroundColor: ColorList.bodyBackground,
                    }}>
                        {!this.props.isRelation && <View style={{ width: "75%" }}>
                            <PickersUpload
                                withTrash={!this.props.isRelation && this.props.photo}
                                currentURL={{ photo: this.props.photo }}
                                saveMedia={(url) => this.props.saveBackground(url.photo)}
                                creating={false} notVideo notAudio notFile>
                            </PickersUpload>
                        </View>}
                        <TouchableOpacity onPress={this.props.replyToPhoto} style={{ ...rounder(35, ColorList.bodyDarkWhite), justifyContent: 'center', }}>
                            <Entypo name={"reply"} style={{
                                ...GState.defaultIconSize,
                                color: ColorList.indicatorColor
                            }}></Entypo>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>

                        <Entypo name="sound-mute" active={true} style={{ color: 'black', fontSize: 22 }} onPress={() => { }} />
                        <MaterialIcons name="block" active={true} style={{ color: 'red', fontSize: 22, marginLeft: 15, marginRight: 5 }} onPress={() => { }} />
                    </View>
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