
import React from "react"
import BleashupModal from '../../mainComponents/BleashupModal';
import CacheImages from "../../CacheImages";
import shadower from "../../shadower";
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import GState from "../../../stores/globalState";
import ColorList from '../../colorList';
import Entypo from 'react-native-vector-icons/Entypo';
import ActivityPages from '../eventChat/chatPages';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BeNavigator from '../../../services/navigationServices';
import rounder from "../../../services/rounder";
import Vibrator from '../../../services/Vibrator';

export default class ActivityPreview extends BleashupModal {
    initialize() {
        this.showPhoto = this.showPhoto.bind(this)
    }
    onClosedModal() {
        this.props.onClosed()
    }
    gotoActivity(page) {
        Vibrator.vibrateShort()
        BeNavigator.navigateToActivity(page, this.props.event,true)
        this.onClosedModal()
    }
    width = GState.width*.7
    modalHeight = this.width
    modalWidth = this.width
    borderRadius = this.width
    borderTopLeftRadius = this.borderRadius
    borderTopRightRadius = this.borderRadius
    position = 'center'
    swipeToClose = true
    backdropOpacity = .4
    buttonsContainerStyle = {
        ...rounder(50, ColorList.buttonerBackground),
        justifyContent: 'center'
    }
    showPhoto() {
        this.props.showPhoto(this.props.event.background)
        this.onClosedModal()
    }
    modalBody() {
        return <TouchableOpacity
            onPress={this.showPhoto}
            style={{
                ...rounder(this.borderRadius),
                justifyContent: 'center'
            }}
        >
            <CacheImages
                thumbnails
                style={{
                    ...rounder(this.borderRadius),
                    alignSelf: 'center'
                }}
                source={{ uri: this.props.event.background }}
            >

            </CacheImages>
            <View style={{
                position:'absolute',
                padding:5,
                paddingBottom:'70%'
            }}>
            <View style={{
                backgroundColor: ColorList.buttonerBackground,
                ...shadower(1),
                borderRadius:10,
                padding: 5,
            }}>
                <Text style={{
                    textAlign:'center',
                    textDecorationLine:'underline',
                    ...GState.defaultTextStyle,
                    color: ColorList.bodyBackground,
                    fontWeight: 'bold'
                }}>
                    {this.props.event.about.title}
                </Text>
            </View>
            </View>
            <View style={{
                position:'absolute',
                paddingTop:'100%',
                flexDirection:'column',
                flex:1,
                justifyContent:'flex-end'
            }}>
            <View style={{
                alignSelf: 'flex-end',
                minHeight: 50,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 5,
                borderRadius: 30,
                width:this.borderRadius * .8,
                alignItems: 'center',
                backgroundColor: ColorList.bottunerLighter,
                ...shadower(1)
            }}>
                <TouchableOpacity
                    onPress={() => this.gotoActivity(ActivityPages.reminds)}
                    style={this.buttonsContainerStyle}
                >
                    <Entypo name={'bell'}
                        style={{
                            ...GState.defaultIconSize,
                            color: ColorList.reminds
                        }}
                    ></Entypo>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.gotoActivity(ActivityPages.chat)}
                    style={this.buttonsContainerStyle}
                >
                    <MaterialIcons name={'chat-bubble'}
                        style={{
                            ...GState.defaultIconSize,
                            color: ColorList.bodyBackground
                        }}
                    ></MaterialIcons>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.gotoActivity(ActivityPages.starts)}
                    style={this.buttonsContainerStyle}
                >
                    <AntDesign name={'star'}
                        style={{
                            ...GState.defaultIconSize,
                            color: ColorList.post
                        }}
                    ></AntDesign>
                </TouchableOpacity>
            </View>
            </View>
        </TouchableOpacity>
    }
}