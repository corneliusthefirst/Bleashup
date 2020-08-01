import React, { PureComponent } from 'react';
import { ScrollView, Text,TouchableOpacity,View} from "react-native";
import Modal from "react-native-modalbox"
import moment from 'moment';
import ColorList from '../../colorList';
import BleashupModal from '../../mainComponents/BleashupModal';
import rounder from '../../../services/rounder';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';

export default class RemindReportContent extends BleashupModal {
    initialize(){
        this.state = {
            content: null
        }
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
    modalHeight=400 
    modalWidth="90%"
    entry="top"
    modalBody() {
        return (
            <View>
                <ScrollView style={{ margin: "5%", height: "75%" }}>
                    <Text>{this.props.report.report}</Text>
                </ScrollView>
                <View style={{ margin: '2%' }}>
                <Text note>{moment(this.props.report.date).
                    format("dddd, MMMM Do YYYY, h:mm:ss a")}</Text></View>
                {this.props.master ? <View style={{justifyContent: 'flex-end',flexDirection: 'row',}}>
                    <TouchableOpacity transparent style={{ flexDirection: 'column', justifyContent: 'center', height: 35 }} onPress={() => {
                        this.props.confirm()
                        this.props.closed()
                    }}>
                    <MaterialCommunityIcons style={{ color: ColorList.likeActive, fontSize: 26 }} 
                    name="check-all"></MaterialCommunityIcons>
                    </TouchableOpacity>
                </View> : null}
            </View>
        );
    }
}