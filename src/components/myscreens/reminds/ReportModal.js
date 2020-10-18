import React, { PureComponent } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modalbox"
import moment from 'moment';
import ColorList from '../../colorList';
import BleashupModal from '../../mainComponents/BleashupModal';
import rounder from '../../../services/rounder';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GState from '../../../stores/globalState';
import Texts from '../../../meta/text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import stores from '../../../stores';
import ProfileView from '../invitations/components/ProfileView';
import shadower from '../../shadower';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import BeMenu from '../../Menu';
import TextContent from '../eventChat/TextContent';
import MedaiView from '../event/createEvent/components/MediaView';
import BeNavigator from '../../../services/navigationServices';

export default class RemindReportContent extends BleashupModal {
    initialize() {
        this.state = {
            content: null
        }
        this.editReport = this.editReport.bind(this)
        this.showItem = this.showItem.bind(this)
    }
    onClosedModal() {
        this.props.closed()
        this.setStatePure({
            content: null
        })
    }
    showItem() {
        const url = this.props.report.url
        if (this.props.video) {
            BeNavigator.openVideo(url.video)
        } else {
            BeNavigator.openPhoto(url.photo)
        }
        this.onClosedModal()
    }
    onOpenModal() {
        this.openModalTimeout = setTimeout(() => {
            this.setStatePure({
                content: this.props.content
            })
        }, 20)
    }
    swipeToClose = false
    position = "center"
    modalHeight = GState.height * .65
    modalMinHieight = 100
    modalWidth = "90%"
    entry = "top"
    editReport() {
        this.props.editReport(this.props.user)
    }
    items = () => [
        {
            title: Texts.reply,
            condition: true,
            action: this.props.reply
        },
        {
            title: Texts.edit,
            condition: this.props.user.phone == stores.LoginStore.user.phone,
            action: this.editReport
        }
    ]
    editButton() {
        return <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <BeMenu size={35} items={this.items} />
        </View>
    }
    flexContainerStyle = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: '1%',
        alignSelf: 'center',
        alignItems: 'center',
        width: '95%',
    }
    switchBack() {
        requestAnimationFrame(() => {
            this.props.switchBack && this.props.switchBack()
        })
    }
    switchFront() {
        requestAnimationFrame(() => {
            this.props.switchFront && this.props.switchFront()
        })
    }
    renderSwitchers() {
        return <View style={{
            height: 30,
            width: 100,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 40,
            ...shadower(2),
            backgroundColor: ColorList.bodyBackground,
        }}>
            <TouchableOpacity onPress={this.switchBack.bind(this)} style={{
                ...rounder(30, ColorList.bodyDarkWhite),
                justifyContent: 'center',
            }}><AntDesign
                name={"leftcircle"}
                style={{
                    ...GState.defaultIconSize,
                    fontSize: 16,
                }}
            >
                </AntDesign></TouchableOpacity>
            {this.props.currentIndex >= 0 && this.props.total ? <View><Text style={{
                ...GState.defaultTextStyle, fontSize: 13,
            }}>{`${this.props.currentIndex + 1} / ${this.props.total}`}</Text></View> : null}
            <TouchableOpacity onPress={this.switchFront.bind(this)} style={{
                ...rounder(30, ColorList.bodyDarkWhite),
                justifyContent: 'center',
            }}>
                <AntDesign
                    name={"rightcircle"}
                    style={{
                        ...GState.defaultIconSize,
                        fontSize: 16,
                    }}
                >
                </AntDesign>
            </TouchableOpacity>
        </View>
    }
    borderRadius = 10
    modalBody() {
        let canShowReport = this.props.report.url || this.props.report.report
        return (
            <View>
                <View style={{
                    marginTop: "1%",
                }}>{this.renderSwitchers()}</View>
                <View style={this.flexContainerStyle}><View>
                    <ProfileView hidePhoto phone={this.props.currentPhone}></ProfileView></View>
                    {this.editButton()}
                </View>
                {canShowReport ? <ScrollView style={{
                    maxHeight: GState.height * .41,
                }} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                    <View>
                        {this.props.report.url ? <View
                            style={{
                                width: '96%',
                                borderRadius: 10,
                                alignSelf: 'center',
                            }}
                        ><MedaiView
                                url={{ ...this.props.report.url, id: this.props.remind_id + '_report' }}
                                height={GState.height * .3}
                                width={"100%"}
                                updateSource={this.props.updateSource}
                                showItem={this.showItem}
                                data={{ activity_id: this.props.activity_id, remind_id: this.props.remind_id }}
                                activity_id={this.props.activity_id}

                            /></View> : null}
                        {this.props.report.report ? <View style={{ ...this.flexContainerStyle, marginVertical: '1%', }}>
                            <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true} style={{
                                maxHeight: GState.height * .2,
                                minHeight: 50,
                                borderRadius: 10,
                                ...shadower(1),
                                backgroundColor: ColorList.descriptionBody,
                                padding: '2%',
                            }}>
                                <TextContent style={{ ...GState.defaultTextStyle, marginBottom: "2%", }}>{this.props.report.report}</TextContent>
                            </ScrollView></View> : null}
                    </View>
                </ScrollView> : null}
                <View style={{ ...this.flexContainerStyle, marginVertical: '1%', }}>
                    <View>
                        <TextContent style={{ ...GState.defaultTextStyle, fontStyle: 'italic', color: ColorList.darkGrayText }}>{moment(this.props.report.date).calendar()}</TextContent>
                    </View>
                </View>
                <View style={{
                    ...this.flexContainerStyle, marginVertical: '1%',
                    ...!canShowReport ? { justifyContent: 'flex-end', } : {}
                }}>
                    {canShowReport ? <View style={{ flex: 1, }}>
                        {this.props.report.latest_edit ? <TextContent style={{
                            ...GState.defaultTextStyle,
                            fontWeight: 'bold',
                            color: ColorList.darkGrayText
                        }}>{`${Texts.latest_update}${moment(this.props.report.latest_edit).
                            calendar()}`}</TextContent> : null}

                    </View> : null}
                    {this.props.master && this.props.canConfirm ? <View style={{ justifyContent: 'flex-end', flexDirection: 'row', }}>
                        <TouchableOpacity transparent style={{ flexDirection: 'column', justifyContent: 'center', ...rounder(40, ColorList.bodyDarkWhite) }} onPress={() => {
                            this.props.confirm()
                        }}>
                            <MaterialCommunityIcons style={{ color: ColorList.likeActive, fontSize: 26 }}
                                name="check-all"></MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View> : null}
                </View>
            </View>
        );
    }
}