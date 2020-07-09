import React, { PureComponent } from 'react';
import { Content, Text, Item, View, Button, Left, Right, Icon } from 'native-base';
import { ScrollView } from "react-native";
import Modal from "react-native-modalbox"
import moment from 'moment';
import { Root } from 'native-base';
import ColorList from '../../colorList';
import BleashupModal from '../../mainComponents/BleashupModal';
import rounder from '../../../services/rounder';

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
                    <Button transparent style={{ flexDirection: 'column', justifyContent: 'center', height: 35 }} onPress={() => {
                        this.props.confirm()
                        this.props.closed()
                    }}>
                    <Icon style={{ color: ColorList.likeActive, fontSize: 26 }} 
                    type="MaterialCommunityIcons" name="check-all"></Icon>
                    </Button>
                </View> : null}
            </View>
        );
    }
}