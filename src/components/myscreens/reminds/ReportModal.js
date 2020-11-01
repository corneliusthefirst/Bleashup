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
import { copyText } from '../eventChat/services';
import request from '../../../services/requestObjects';
import messagePreparer from '../eventChat/messagePreparer';
import { containsMedia, 
    containsAudio, 
    containsFile, 
    containsVideo, 
    containsPhoto, 
    calculateType 
} from '../event/createEvent/components/mediaTypes.service';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import IDMaker from '../../../services/IdMaker';
import Swipeout from '../eventChat/Swipeout';
import Vibrator from '../../../services/Vibrator';

export default class RemindReportContent extends BleashupModal {
    initialize() {
        this.state = {
            content: null
        }
        this.editReport = this.editReport.bind(this)
        this.showItem = this.showItem.bind(this)
        this.copyReportText = this.copyReportText.bind(this)
        this.containsMedia = containsMedia.bind(this)
        this.containsAudio = containsAudio.bind(this)
        this.containsFile = containsFile.bind(this)
        this.containsVideo = containsVideo.bind(this)
        this.containsPhoto = containsPhoto.bind(this)
        this.handleSwipe = this.handleSwipe.bind(this)
        this.calculateType = calculateType.bind(this)
        this.exportReport = this.exportReport.bind(this)
        this.url = this.props.report.url
    }
    copyReportText() {
        copyText(this.props.report.report)
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
    borderTopRightRadius = 0
    borderTopLeftRadius = 0
    modalWidth = "100%"
    entry = "top"
    exportReport(){
        this.props.exportReport && this.props.exportReport(this.props.report)
    }
    editReport() {
        this.props.editReport(this.props.user)
    }
    items = () => [
        {
            title: Texts.reply,
            condition: this.props.reply && true,
            action: this.props.reply
        },
        {
            title: Texts.edit,
            condition: this.props.user.phone == stores.LoginStore.user.phone,
            action: this.editReport
        },{
            title:Texts.export_,
            condition: this.props.master,
            action:this.exportReport
        }
            /*, {
            title: Texts.share,
            condition: this.props.shareReport && true,
            action: () => this.props.shareReport && this.props.shareReport(
                {
                    ...request.Message(),
                    id: IDMaker.make(),
                    sent: true,
                    from_activity: this.props.activity_id,
                    from_commitee: this.props.activity_id,
                    report: true,
                    forwarded: true,
                    type: this.calculateType(),
                    text: this.props.report.report,
                    source: (this.url && this.url.main_source || 
                        (this.url && this.url.source)) || 
                    (this.url && this.url.video),
                    photo: this.url && this.url.photo,
                    file_name: this.url && this.url.file_name,
                    filename: this.url && this.url.file_name,
                }
            )
        }*/
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
    handleSwipe(){
        Vibrator.vibrateShort()
        this.props.reply && this.props.reply()
    }
    borderRadius = 0
    modalBody() {
        this.url = this.props.report.url
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
                        {this.props.report.report ? <Swipeout
                            swipeRight={this.handleSwipe}
                            onLongPress={this.copyReportText}
                            style={{ ...this.flexContainerStyle, marginVertical: '1%', }}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                                style={{
                                    maxHeight: GState.height * .2,
                                    minHeight: 50,
                                    borderRadius: 2,
                                    ...shadower(1),
                                    backgroundColor: ColorList.descriptionBody,
                                    padding: '2%',
                                }}>
                                <TextContent
                                    onLongPress={this.copyReportText}
                                    style={{
                                        ...GState.defaultTextStyle,
                                        marginBottom: "2%",
                                    }}>{this.props.report.report}</TextContent>
                            </ScrollView></Swipeout> : null}
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