/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, Dimensions, Text, TouchableOpacity, StyleSheet } from 'react-native';
import rounder from "../../../services/rounder";
import ColorList from "../../colorList";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);

import BleashupModal from '../../mainComponents/BleashupModal';
import BeNavigator from '../../../services/navigationServices';
import AnimatedComponent from '../../AnimatedComponent';
import shadower from '../../shadower';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Texts from '../../../meta/text';
import { Keyboard } from 'react-native';
import { ScrollView } from 'react-native';

export default class Options extends AnimatedComponent {

    onClosedModal() {
        this.props.onClosed();
    }
    state = {
        full: false
    }
    backdropOpacity = 0.01
    borderRadius = 10
    modalBackground = "rgba(255,255,255,255)";
    entry = 'bottom';
    position = 'bottom';
    modalWidth = '96%'
    modalHeight = 220;

    style = { bottom: 60 }
    coverScreen = true;

    componentDidMount() {
        this.animationDuration = 900
        setTimeout(() => {
            this.setStatePure({
                full: true
            })
            this.animationDuration = this.defaultAnimationDuration
        }, 300)
    }

    waitAndAct(func) {
        Keyboard.dismiss()
        this.props.onClosed()
        setTimeout(() => {
            func()
        }, this.props.timeToDissmissKeyboard)
    }
    addRemind = () => {
        this.waitAndAct(this.props.addRemind)
    }
    addStar(){
        this.waitAndAct(this.props.addStar)
    }
    openFilePicker = () => {
        this.waitAndAct(this.props.openFilePicker)
    }

    openPhotoSelector = () => {
        this.waitAndAct(this.props.openPhotoSelector)
    }

    openAudioPicker = () => {
        this.waitAndAct(this.props.openAudioPicker)
    }





    viewStyle = {
        width: 40,
        bottom: 2,
        padding: "1%",
        justifyContent: 'center', alignItems: 'center'
    }
    mainContainerStyles = {
        height: 75,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: "98%"
    }
    gotoSelectRelation(page){
        BeNavigator.pushTo("SelectRelation", {
            tab: page, current: this.props.activity_id,
            select: (item) => {
                this.waitAndAct(() => this.props.select(item))
            }
        })
    }
    shareActivites() {
        this.gotoSelectRelation("Activities")
    }
    shareRelations() {
        this.gotoSelectRelation("Contacts")
    }
    buttonSize = 30
    render() {
        return (
            <View style={{
                position: "absolute",
                flexDirection: 'row',
                paddingRight: 6,
                height: this.state.full ? 300 : 50,
                justifyContent: 'center',
                marginBottom: "2%",
                alignSelf: 'flex-end',
                width: 50,

            }}>
                <ScrollView
                    keyboardShouldPersistTaps={'handled'}
                    showsVerticalScrollIndicator={false}
                    style={{
                        height: "100%", backgroundColor: ColorList.bodyBackground,
                        borderRadius: 40, width: 45, ...shadower(2),
                    }}>

                    <View style={{ height: "100%", flexDirection: "column", alignItems: 'center', justifyContent: 'space-between', padding: 5 }}>

                        <View style={this.mainContainerStyles}>
                            <TouchableOpacity
                                onPress={() => requestAnimationFrame(() => this.addRemind())}
                                style={this.viewStyle} >
                                <View
                                    style={{
                                        alignItems: "center",
                                        ...shadower(3),
                                        ...rounder(this.buttonSize, '#1e90ff'),
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        style={{
                                            color: 'white',
                                            fontSize: 25,
                                        }}
                                        name={"bell-plus"}
                                    />
                                </View>
                            </TouchableOpacity>

                            <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.textStyle} >{Texts.reminder}</Text>
                        </View>

                        <View style={this.mainContainerStyles}>
                            <TouchableOpacity
                                onPress={() => requestAnimationFrame(() => this.addStar())}
                                style={this.viewStyle} >
                                <View
                                    style={{
                                        alignItems: "center",
                                        ...shadower(3),
                                        ...rounder(this.buttonSize, ColorList.post),
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        style={{
                                            color: 'white',
                                            fontSize: 25,
                                        }}
                                        name={"star-box"}
                                    />
                                </View>
                            </TouchableOpacity>

                            <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.textStyle} >{Texts.star}</Text>
                        </View>
                        <View style={this.mainContainerStyles}>
                            <TouchableOpacity
                                onPress={() => requestAnimationFrame(() => { this.openFilePicker(); })}
                                style={this.viewStyle}
                            >
                                <View
                                    style={{
                                        alignItems: "center",
                                        ...rounder(this.buttonSize, ColorList.indicatorColor),
                                    }}
                                >
                                    <AntDesign
                                        style={{
                                            color: ColorList.bodyBackground,
                                            fontSize: 20,
                                        }}
                                        type={"AntDesign"}
                                        name={"addfile"}
                                    />
                                </View>
                            </TouchableOpacity>

                            <Text
                                ellipsizeMode={"tail"}
                                numberOfLines={1}
                                style={styles.textStyle} >{Texts.files}</Text>
                        </View>

                        <View style={this.mainContainerStyles}>
                            <TouchableOpacity
                                onPress={() => requestAnimationFrame(() => this.openPhotoSelector())}
                                style={this.viewStyle}
                            >
                                <View
                                    style={{
                                        alignItems: "center",
                                        ...rounder(this.buttonSize, '#8b008b'),
                                    }}
                                >
                                    <MaterialIcons
                                        style={{
                                            color: ColorList.bodyBackground,
                                            fontSize: 23,
                                        }}
                                        type={"Ionicons"}
                                        name={"add-to-photos"}
                                    />
                                </View>
                            </TouchableOpacity>

                            <Text
                                ellipsizeMode={"tail"}
                                numberOfLines={1}
                                style={styles.textStyle}  >{Texts.add_photos}</Text>
                        </View>

                        <View style={this.mainContainerStyles}>
                            <TouchableOpacity
                                onPress={() => requestAnimationFrame(() => this.openAudioPicker())}
                                style={this.viewStyle}
                            >
                                <View style={{ alignItems: "center", ...rounder(this.buttonSize, '#ff8c00') }} >

                                    <View
                                        style={{
                                            alignItems: "center",
                                            ...rounder(this.buttonSize - 5, '#ffd707'),
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            style={{
                                                color: ColorList.bodyBackground,
                                                fontSize: 20,
                                            }}
                                            type={"MaterialCommunityIcons"}
                                            name={"microphone-plus"}
                                        />
                                    </View>

                                </View>
                            </TouchableOpacity>
                            <Text ellipsizeMode={"tail"}
                                numberOfLines={1}
                                style={styles.textStyle}  >Audio</Text>
                        </View>
                        <View style={this.mainContainerStyles}>
                            <TouchableOpacity
                                onPress={() => requestAnimationFrame(() => this.shareActivites())}
                                style={this.viewStyle}
                            >
                                    <View
                                        style={{
                                            alignItems: "center",
                                            ...rounder(this.buttonSize - 5, '#6710C8'),
                                        }}
                                    >
                                        <AntDesign
                                            style={{
                                                color: ColorList.bodyBackground,
                                                fontSize: 20,
                                            }}
                                        name={"addusergroup"}
                                        />
                                    </View>
                            </TouchableOpacity>
                            <Text ellipsizeMode={"tail"}
                                numberOfLines={1}
                                style={styles.textStyle}  >{Texts.activity}</Text>
                        </View>
                        <View style={this.mainContainerStyles}>
                            <TouchableOpacity
                                onPress={() => requestAnimationFrame(() => this.shareRelations())}
                                style={this.viewStyle}
                            >
                                    <View
                                        style={{
                                            alignItems: "center",
                                            ...rounder(this.buttonSize - 5, '#0D7FAB'),
                                        }}
                                    >
                                        <AntDesign
                                            style={{
                                                color: ColorList.bodyBackground,
                                                fontSize: 20,
                                            }}
                                        name={"adduser"}
                                        />
                                    </View>
                            </TouchableOpacity>
                            <Text ellipsizeMode={"tail"}
                                numberOfLines={1}
                                style={styles.textStyle}  >{Texts.contacts}</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={{
                    position: "absolute",
                    height: '100%',
                    width: "100%",
                    //alignItems: 'flex-start',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',

                }}>
                    <View style={styles.TriangleShapeView}></View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 10,
        color: 'black',
    },
    TriangleShapeView: {
        //To make Triangle Shape
        marginTop: -1,
        width: 0,
        height: 0,
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderTopWidth: 15,
        alignSelf: 'flex-end',
        borderStyle: 'solid',
        transform: [{ rotate: '90deg' }],
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: ColorList.bodyDarkWhite,
        marginRight: '70%',
        marginBottom: "27%",

    },
});
