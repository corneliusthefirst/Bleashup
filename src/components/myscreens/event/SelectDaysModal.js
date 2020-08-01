import React, { Component } from 'react';
import { View, ScrollView, Text,TouchableOpacity } from "react-native"
import ModalBox from 'react-native-modalbox';
import { findIndex } from 'lodash';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import BleashupModal from '../../mainComponents/BleashupModal';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import GState from '../../../stores/globalState';

export default class SelectDays extends BleashupModal {
    
    checked = (code) => findIndex(this.props.daysSelected, (ele) => ele === code) >= 0 ? true : false
    renderItem(item) {
        return <TouchableOpacity 
        style={{ width: "95%",alignSelf: 'center',flexDirection: 'row',
        height:50,
        alignItems: 'center',
         }} 
        key={item.code} onPress={() => this.checked(item.code) ? 
            this.props.removeCode(item.code) : this.props.addCode(item.code)} 
            ><Text style={{...GState.defaultTextStyle,width:"80%" }}>{`${item.day}`}</Text>
            <MaterialIcons style={{ alignSelf: 'flex-end',...GState.defaultIconSize }} type={"MaterialIcons"} 
            name={this.checked(item.code) ? "radio-button-checked" : 
            "radio-button-unchecked"}/>
            </TouchableOpacity>
    }
    state = {}
    renderAll() {
        return this.props.daysOfWeek.map(ele => {
            return this.renderItem(ele)
        })
    }
    modalHeight = 400
    modalWidth = "50%"
    borderRadius = 8
    position="center"
    entry = "top"
    onClosedModal() {
        this.props.onClosed()
    }
    swipeToClose = false
    modalBody() {
        return (
            <View>
                <View style={{ height: 30, width: '90%',alignSelf: 'center', margin: 'auto',}}>
                    <View style={{ justifyContent: 'center', alignSelf: 'center', }}>
                        <Text style={{ ...GState.defaultTextStyle, width: '90%', alignSelf: 'center', fontWeight: 'bold' }}>{"days"}</Text>
                    </View></View>
                <View pointerEvents={this.props.ownership ? null : 'none'}>
                    <ScrollView>
                        {this.renderAll()}
                    </ScrollView>
                </View>
            </View>
        )
    }
}