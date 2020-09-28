import React from "react";
import { observer } from "mobx-react";
import TabModal from "../../mainComponents/TabModal";
import { TouchableOpacity, View, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import rounder from "../../../services/rounder";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import GState from "../../../stores/globalState/index";
import ColorList from "../../colorList";
import UserList from "./UserList";
import Ionicons from "react-native-vector-icons/Ionicons";
import message_types from "./message_types";
import shadower from "../../shadower";

@observer
class MessageInfoModal extends TabModal {
    initialize(){
        this.state = {
            mounted: false
        }
    }
    onOpenModal() {
        this.setStatePure({
            mounted:true
        })
    }
    countStyle = {
        ...GState.defaultTextStyle,
        fontWeight: '600',
        fontSize: 14,
    }
    iconStyle = {
        ...GState.defaultIconSize,
        color: ColorList.indicatorColor,
    }
    swipeToClose = false
    containerStyles = {
        width: 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 35,
    }
    shouldUpdateTabs=true
    returnTabs() {
        return this.state.mounted && {
            Received: {
                navigationOptions: {
                    tabBarIcon: () => (
                        <TouchableOpacity style={this.containerStyles}>
                            <View style={{ 
                                ...rounder(40, ColorList.bodyDarkWhite),
                                justifyContent: 'center',
                                
                             }}>
                                <Ionicons
                                    name={"ios-checkmark-circle"}
                                    style={this.iconStyle}
                                ></Ionicons>
                            </View>
                            <View
                                style={{
                                    ...rounder(15, ColorList.bodyDarkWhite)
                                }}
                            >
                                <Text
                                    style={this.countStyle}
                                >
                                    {this.props.item && this.props.item.receive ? this.props.item.receive.length : 0}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ),
                },
                screen: () => {
                    return <View style={{ flex: 1 }}>
                        <UserList data={this.props.item &&
                            this.props.item.receive ?
                            this.props.item.receive : []}></UserList>
                    </View>
                },
            },
            Seen: {
                navigationOptions: {
                    tabBarIcon: () => (
                        <TouchableOpacity style={
                            this.containerStyles
                        }> 
                        <View style={{ ...rounder(40, ColorList.bodyDarkWhite) }}>
                            <View style={{...rounder(30,ColorList.indicatorColor)}}><Ionicons
                                name={"ios-done-all"}
                                style={{...this.iconStyle,color:ColorList.bodyBackground}}
                            ></Ionicons></View>
                        </View>
                            <View
                                style={{
                                    ...rounder(15,ColorList.bodyDarkWhite)
                                }}
                            >
                                <Text
                                    style={this.countStyle}
                                >
                                    {this.props.item && this.props.item.seen ? this.props.item.seen.length : 0}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ),
                },
                screen: () => {
                    return <View style={{ flex: 1 }}>
                        <UserList data={this.props.item && this.props.item.seen ? this.props.item.seen : []}></UserList>
                    </View>
                },
            },
            ...(this.props.item && this.props.item.type == message_types.audio
                ? {
                    Played: {
                        navigationOptions: {
                            tabBarIcon: () => (
                                <TouchableOpacity 
                                style={this.containerStyles}
                                >
                                    <View
                                        style={{ ...rounder(40, ColorList.bodyDarkWhite) }}
                                    >
                                        <Ionicons
                                            name={"ios-headset"}
                                            style={this.iconStyle}
                                        ></Ionicons>
                                    </View>
                                    <View 
                                    style={{
                                        ...rounder(15,ColorList.bodyDarkWhite)
                                    }}
                                    >
                                        <Text
                                            style={this.countStyle}
                                        >
                                            {this.props.item &&
                                                this.props.item.played ?
                                                this.props.item.played.length : 0}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ),
                        },
                        screen: () => {
                            return <View style={{ flex: 1 }}>
                                <UserList data={this.props.item &&
                                    this.props.item.played ? this.props.item.played : []}></UserList>
                            </View>
                        },
                    },
                }
                : {}),
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
    }
}
export default MessageInfoModal;
