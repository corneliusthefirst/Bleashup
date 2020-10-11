import React, { Component } from 'react';
import BleashupModal from '../../../../mainComponents/BleashupModal';
import TabModal from '../../../../mainComponents/TabModal';
import Likers from '../../../../Likers';
import { View,TouchableOpacity } from 'react-native';
import ColorList from '../../../../colorList';
import  AntDesign  from 'react-native-vector-icons/AntDesign';
import rounder from '../../../../../services/rounder';
import GState from '../../../../../stores/globalState/index';
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';

export default class SocialTabModal extends TabModal {
    initialize() {
        this.state = {}
    }
    TabHeader() {
        return null
    }
    mountedComponent(){
        this.setStatePure({
            mounted:true
        })
    }
    shouldUpdateTabs = true
    underlineStyle = {
        height: 0,
        color: 'transparent'
    }
    returnFontSize(index) {
        return this.isCurrentTab(index) ? 40 : 18
    }
    activeTextStyle = { color: ColorList.likeActive }
    swipeToClose= false
    state = {}
    tabs = {
        Likes: {
            navigationOptions: {
                tabBarIcon: () => (
                    <TouchableOpacity
                        style={{
                            ...rounder(40, ColorList.bodyDarkWhite),
                        }}
                    >
                        <AntDesign name={"hearto"} style={{
                            ...GState.defaultIconSize,
                            color: ColorList.heartColor
                        }} />
                    </TouchableOpacity>
                ),
            },
            screen:() => <Likers id={this.props.id}></Likers>
        },
        Back: {
            navigationOptions: {
                tabBarIcon: () => (
                    <TouchableOpacity
                        style={{
                            ...rounder(40, ColorList.bodyDarkWhite),
                        }}
                    >
                        <MaterialIcons
                            name="close"
                            style={{ ...GState.defaultIconSize, color: ColorList.headerIcon }}
                        />
                    </TouchableOpacity>
                ),
            },
            screen: () => {
                this.onClosedModal();
                return <View></View>;
            },
        }
    }
    returnTabs() {
        return this.tabs
    }
}