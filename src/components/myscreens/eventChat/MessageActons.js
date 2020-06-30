
import BleashupModal from "../../mainComponents/BleashupModal";
import React from 'react';
import { TouchableOpacity, View, ScrollView } from "react-native";
import { Icon, Text } from "native-base";
import ColorList from '../../colorList';


export default class MessageActions extends BleashupModal {

    modalHeight = "45%"
    modalWidth = "100%"
    borderRadius = 0

    actionsContainerStyles = {
        width: '95%',
        height: 60,
        margin: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
    actionIconContainerStyle = {
        marginBottom: 'auto',
        marginTop: 'auto',
        width: '10%',
        justifyContent: 'center',
        textAlign: 'center'
    }
    textContainerStyle = {
        width: '85%',
        marginBottom: 'auto',
        marginTop: 'auto',
        justifyContent: 'flex-start',
        textAlign: 'flex-start'
    }
    onClosedModal() {
        this.props.onClosed()
    }
    modalBody() {
        return <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}><View 
        style={{
            height:'5%',
            justifyContent: 'center',
            flexDirection: 'row',}}>
        <Text style={{ fontSize: 8, }} note>message actions</Text></View><ScrollView showsVerticalScrollIndicator={false}>
            <View style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignSelf: 'center',
                width: '95%',
                height: '90%',
                margin: 'auto'
            }}>
                <TouchableOpacity onPress={() => {
                    this.onClosedModal()
                    this.props.seenBy()
                }} style={{
                    ...this.actionsContainerStyles
                }}>
                    <View style={{ ...this.actionIconContainerStyle }}>
                        <Icon name={"check"} type={"FontAwesome"} style={{
                            color: "#56B671"
                        }}></Icon>
                    </View>
                    <View style={{ ...this.textContainerStyle }}>
                        <Text>{"Seen By ..."}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.onClosedModal()
                    this.props.replyMessage()
                }} style={{
                    ...this.actionsContainerStyles
                }}>
                    <View style={{ ...this.actionIconContainerStyle }}>
                        <Icon name={"reply"} type={"Entypo"} style={{
                            color: ColorList.bodyIcon
                        }}></Icon>
                    </View>
                    <View style={{ ...this.textContainerStyle }}>
                        <Text>{"Reply to message"}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.onClosedModal()
                    this.props.forwardToContacts()
                }} style={{
                    ...this.actionsContainerStyles
                }}>
                    <View style={{ ...this.actionIconContainerStyle }}>
                        <Icon name={"forward"} type={"Entypo"} style={{
                            color: ColorList.darkGrayText
                        }}></Icon>
                    </View>
                    <View style={{ ...this.textContainerStyle }}>
                        <Text>{"Forward message (contacts)"}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.onClosedModal()
                    this.props.remindThis()
                }} style={{
                    ...this.actionsContainerStyles
                }}>
                    <View style={{ ...this.actionIconContainerStyle }}>
                        <Icon name={"bell"} type={"Entypo"} style={{
                            color: ColorList.reminds
                        }}></Icon>
                    </View>
                    <View style={{ ...this.textContainerStyle }}>
                        <Text>{"Rmind of this"}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.onClosedModal()
                    this.props.starThis()
                }} style={{
                    ...this.actionsContainerStyles
                }}>
                    <View style={{ ...this.actionIconContainerStyle }}>
                        <Icon name={"star"} type={"AntDesign"} style={{
                            color: ColorList.post 
                        }}></Icon>
                    </View>
                    <View style={{ ...this.textContainerStyle }}>
                        <Text>{"Star This"}</Text>
                    </View>
                </TouchableOpacity>
                {/*<TouchableOpacity onPress={() => {
                    this.onClosedModal()
                    this.props.addToVote()
                }} style={{
                    ...this.actionsContainerStyles
                }}>
                    <View style={{ ...this.actionIconContainerStyle }}>
                        <Icon name={"vote-yea"} type={"FontAwesome5"} style={{
                            color: ColorList.vote
                        }}></Icon>
                    </View>
                    <View style={{ ...this.textContainerStyle }}>
                        <Text>{"Create a poll"}</Text>
                    </View>
                    </TouchableOpacity>*/}
                <TouchableOpacity onPress={() => {
                    this.onClosedModal()
                    this.props.copyMessage()
                }} style={{
                    ...this.actionsContainerStyles
                }}>
                    <View style={{ ...this.actionIconContainerStyle }}>
                        <Icon name={"copy"} type={"Feather"} style={{
                            color: ColorList.copy
                        }}></Icon>
                    </View>
                    <View style={{ ...this.textContainerStyle }}>
                        <Text>{"Copy message"}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.onClosedModal()
                    this.props.deleteMessage()
                }} style={{
                    ...this.actionsContainerStyles
                }}>
                    <View style={{ ...this.actionIconContainerStyle }}>
                        <Icon name={"delete-circle-outline"} type={"MaterialCommunityIcons"} style={{
                            color: ColorList.delete
                        }}></Icon>
                    </View>
                    <View style={{ ...this.textContainerStyle }}>
                        <Text>{"Delete message"}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </View>
    }
}