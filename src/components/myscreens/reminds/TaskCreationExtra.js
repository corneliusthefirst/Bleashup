import React, { Component } from 'react';
import BleashupModal from '../../mainComponents/BleashupModal';
import { Text, Icon } from 'native-base';
import { View, TouchableOpacity, ScrollView } from "react-native"
import TextMenu from './TextMenu';
import CreateButton from '../event/createEvent/components/ActionButton';
import ColorList from '../../colorList';

export default class TaskCreationExtra extends BleashupModal {

    modalHeight = 300
    backdropOpacity=false
    modalWidth = '80%'
    position = "center"
    onClosedModal() {
        this.props.onClosed()
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
                            <Icon style={{ ...this.center, color: ColorList.bodyIcon, width: '15%' }} name={
                                this.props.currentRemind.must_report ? "check-box" :
                                    "radio-button-unchecked"
                            } type={"MaterialIcons"}></Icon>
                            <Text style={{ fontWeight: 'bold', ...this.center }}>Request Report on Completion</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', height: 100 }}>
                        <Text style={{ fontWeight: 'normal', marginRight: '4%', ...this.center }}>{"This Remind is "}</Text>
                        <View style={{ ...this.center }}>
                            <TextMenu
                                title={this.props.currentRemind.status}
                                menu={[{
                                    title: 'Public',
                                    condition: true,
                                    callback: () => this.props.onChangedStatus('public')
                                }, {
                                    title: 'Private',
                                    condition: true,
                                    callback: () => this.props.onChangedStatus('private')
                                }]}
                            ></TextMenu></View>
                    </View>
                    <View style={{ height: 80,margin: '2%', justifyContent: 'center', }}>
                        <CreateButton title={"Proceed"} action={() => {
                            this.onClosedModal()
                            this.props.proceed()
                        }}></CreateButton>
                    </View>
                </View>
            </ScrollView>
        </View>
    }
}