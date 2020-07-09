
import React, { Component } from 'react';
import {
    Text, Icon, Item,
    Button,
} from "native-base";
import { View, Dimensions, Keyboard, ScrollView, Textarea } from 'react-native';
import Modal from 'react-native-modalbox';
import ColorList from '../../colorList';
import CreateTextInput from '../event/createEvent/components/CreateTextInput';
import BleashupModal from '../../mainComponents/BleashupModal';

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
                <View style={{ height: "65%",width:"95%",alignSelf: 'center', }}>
                    <CreateTextInput
                    height={150}
                    maxLength={200}
                    multiline
                    placeholder="Add A Report" 
                    value={this.state.description} keyboardType="default"
                    onChange={(value) => this.onChangedEventDescription(value)} />

                </View>
                {this.state.description ? <View style={{ height: "10%", marginTop: "5%" }}>
                    <View style={{
                        width: width / 4, height: "100%", alignSelf: "flex-end",
                        marginRight: "1%"
                    }} >
                        <Button onPress={() => this.props.report(this.state.description)} style={{
                            borderRadius: 8,
                            borderWidth: 1, marginRight: "2%", backgroundColor: ColorList.bodyBackground,
                            borderColor: ColorList.bodyIcon, alignSelf: 'flex-end',
                            width: width / 4, height: height / 18, justifyContent: "center"
                        }}>
                            <Text style={{ color: ColorList.bodyIcon }}>Report</Text>
                        </Button>
                    </View>
                </View> : null}
            </ScrollView>)
    }
}