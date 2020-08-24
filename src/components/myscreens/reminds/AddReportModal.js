
import React, { Component } from 'react';

import { Text,View, Dimensions, Keyboard, ScrollView, Textarea, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modalbox';
import ColorList from '../../colorList';
import CreateTextInput from '../event/createEvent/components/CreateTextInput';
import BleashupModal from '../../mainComponents/BleashupModal';
import GState from '../../../stores/globalState';
import Entypo  from 'react-native-vector-icons/Entypo';
import Toaster from '../../../services/Toaster';

let { height, width } = Dimensions.get('window');

export default class AddReport extends BleashupModal {
   initialize(){
       this.state = {
           description: ''
       }
   }
    state = {

    }
    report() {
        this.props.report(this.state.description)
        Keyboard.dismiss()
    }
    onChangedEventDescription(value) {
        this.setStatePure({ description: value })
    }
    onOpenModal(){

    }
    onClosedModal(){
        this.props.onClosed(this.state.description)
    }
    modalHeight=300
    modalWidth=390
    borderTopLeftRadius=8
    borderTopRightRadius=8
    position="bottom"
    entry="bottom"
    modalBody() {
        return (
            <ScrollView keyboardShouldPersistTaps={"handled"}
                nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ flex: 1, flexDirection: "column" }}>
                <TouchableOpacity onPress={() => Toaster({text:"You can enter a link pointing to your report"})} style={{margin: '2%',}}>
                    <Entypo style={{ ...GState.defaultIconSize }} name={"attachment"}>
                </Entypo>
                </TouchableOpacity>
                <View style={{ height: "65%",width:"95%",alignSelf: 'center', }}>
                    <CreateTextInput
                    height={150}
                    maxLength={1000}
                    multiline
                    placeholder="Add A Report" 
                    value={this.state.description} keyboardType="default"
                    onChange={(value) => this.onChangedEventDescription(value)} />

                </View>
                {this.state.description ? <View style={{ height: "10%", marginTop: "1%" }}>
                    <View style={{
                        width: width / 4, height: 70, alignSelf: "flex-end",
                        marginRight: "1%"
                    }} >
                        <TouchableOpacity onPress={() => this.props.report(this.state.description)} style={{
                            borderRadius: 8,
                            borderWidth: 1, marginRight: "2%", backgroundColor: ColorList.bodyBackground,
                            borderColor: ColorList.bodyIcon, alignSelf: 'flex-end',
                            width: width / 4, height: height / 18, justifyContent: "center"
                        }}>
                            <Text style={{...GState.defaultTextStyle, color: ColorList.bodyIcon,marginRight:"auto",marginLeft: "auto", }}>Report</Text>
                        </TouchableOpacity>
                    </View>
                </View> : null}
            </ScrollView>)
    }
}