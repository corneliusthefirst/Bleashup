import React, { Component } from 'react';
import BleashupModal from '../../mainComponents/BleashupModal';
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import TextMenu from './TextMenu';
import CreateButton from '../event/createEvent/components/ActionButton';
import ColorList from '../../colorList';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GState from '../../../stores/globalState';
import { AlarmPatterns } from '../../../services/recurrenceConfigs';
import Texts from '../../../meta/text';
import shadower from '../../shadower';
import public_states from './public_states';

export default class TaskCreationExtra extends BleashupModal {

    modalHeight = 300
    backdropOpacity = false
    modalWidth = '80%'
    borderRadius = 10 
    position = "center"
    onClosedModal(global) {
        //this.props.proceed()
        this.props.onClosed()
        
    }
    writeAlarms() {
        let reduceFun = (prev, current) => prev + "  " + current
        return this.props.currentRemind.extra && this.props.currentRemind.extra.alarms ?
            this.props.currentRemind.extra.alarms.map(ele => ele.text).reduce(reduceFun, "") :
            AlarmPatterns().filter(e => e.autoselected).map(ele => ele.text).reduce(reduceFun, "")
    }
    swipeToClose = false
    center = { marginTop: 'auto', marginBottom: 'auto' }
    modalBody() {
        return <View style={{ height: '100%', margin: '5%', }}>
            <ScrollView showVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'column', justifyContent: 'space-between', heigt: '100%' }}>
                    <View>
                        <TouchableOpacity style={{ width: "95%", flexDirection: 'row', }} onPress={() => requestAnimationFrame(this.props.onComplete)}
                            transparent>
                            <MaterialIcons style={{ ...GState.defaultIconSize, ...this.center, color: ColorList.bodyIcon, width: '15%' }} name={
                                this.props.currentRemind.must_report ? "check-box" :
                                    "radio-button-unchecked"
                            } type={"MaterialIcons"} />
                            <Text style={{ ...GState.defaultTextStyle, fontWeight: 'bold', ...this.center }}>{Texts.request_report}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', height: 100 }}>
                        <Text style={{ ...GState.defaultTextStyle, fontWeight: 'normal', marginRight: '4%', ...this.center }}>{Texts.this_program}</Text>
                        <View style={{ ...this.center }}>
                            <TextMenu
                                title={this.props.currentRemind.status}
                                menu={[{
                                    title: Texts.public,
                                    condition: true,
                                    callback: () => this.props.onChangedStatus(public_states.public_)
                                }, {
                                    title: Texts.private,
                                    condition: true,
                                    callback: () => this.props.onChangedStatus(public_states.private_)
                                }]}
                            ></TextMenu></View>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        width: "95%",
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Text style={{ ...GState.defaultTextStyle, fontWeight: 'bold', marginRight: 5, }}>{Texts.set_current_alarm}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Text style={{ ...GState.defaultTextStyle, fontStyle: 'italic', }}>{this.writeAlarms()}</Text>
                        </ScrollView>
                        <TouchableOpacity onPress={this.props.updateAlarms} style={{
                            width:50,
                            height:20,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: ColorList.bodyDarkWhite,
                            ...shadower(1),
                            borderRadius: 4,marginLeft: 10,
                        }}>
                        <Text style={{...GState.defaultTextStyle}}>{Texts.set}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 80, margin: '2%', justifyContent: 'center', }}>
                        <CreateButton title={Texts.proceed} action={() => {
                           this.props.proceed()
                           this.props.onClosed()
                        }}></CreateButton>
                    </View>
                </View>
            </ScrollView>
        </View>
    }
}