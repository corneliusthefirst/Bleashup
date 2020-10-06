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

export default class RemindReportContent extends BleashupModal {
    initialize() {
        this.state = {
            content: null
        }
        this.editReport = this.editReport.bind(this)
    }
    onClosedModal() {
        this.props.closed()
        this.setStatePure({
            content: null
        })
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
    modalHeight = GState.height * .55
    modalMinHieight = 100
    modalWidth = "90%"
    entry = "top"
    editReport() {
        this.props.editReport(this.props.user)
    }
    editButton() {
        return <View style={{ flexDirection: 'row', alignItems: 'center', }}><View style={{
            marginRight: '5%',
        }}><TouchableOpacity onPress={this.props.reply} style={{
            ...rounder(35, ColorList.bodyBackground),
            justifyContent: 'center',
        }}>
                <Entypo name={"reply"} style={{
                    ...GState.defaultIconSize,
                    color: ColorList.likeActive
                }}></Entypo>
            </TouchableOpacity></View>{this.props.user.phone == stores.LoginStore.user.phone ? <TouchableOpacity
                onPress={this.editReport}
                style={{
                    ...rounder(40, ColorList.bodyDarkWhite)
                }}>
                <MaterialIcons name={"mode-edit"} style={{
                    ...GState.defaultIconSize,
                    color: ColorList.indicatorColor
                }}></MaterialIcons>
            </TouchableOpacity> : null}</View>
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
        return (
            <View>
                <View style={{
                    marginTop: "1%",
                }}>{this.renderSwitchers()}</View>
                {this.props.report.report && <View style={this.flexContainerStyle}><View>
                    <ProfileView hidePhoto phone={this.props.currentPhone}></ProfileView></View>
                    {this.editButton()}
                </View>}
                {this.props.report.report ? <View style={{...this.flexContainerStyle,marginVertical: '1%',}}><ScrollView style={{
                    maxHeight: GState.height * .3,
                    minHeight: 50,
                    borderRadius: 10,
                    ...shadower(1),
                    padding: '2%',
                    backgroundColor: ColorList.bodyBackground,
                }}>
                    <Text style={{ ...GState.defaultTextStyle, marginBottom: "2%", }}>{this.props.report.report}</Text>
                </ScrollView></View> : null}
                <View style={{ ...this.flexContainerStyle, marginVertical: '1%', }}>
                    <View>
                        <Text style={{ ...GState.defaultTextStyle, fontStyle: 'italic', color: ColorList.darkGrayText }}>{moment(this.props.report.date).calendar()}</Text>
                    </View>
                    {!this.props.report.report ? this.editButton() : null}
                </View>
                <View style={{ ...this.flexContainerStyle, marginVertical: '1%', }}>
                    <View style={{ flex: 1, }}>
                        {this.props.report.latest_edit ? <Text style={{
                            ...GState.defaultTextStyle,
                            fontWeight: 'bold',
                            color: ColorList.darkGrayText
                        }}>{`${Texts.latest_update}${moment(this.props.report.latest_edit).
                            calendar()}`}</Text> : null}

                    </View>
                    {this.props.master && this.props.canConfirm ? <View style={{ justifyContent: 'flex-end', flexDirection: 'row',}}>
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