import React, { PureComponent } from 'react';
import { ScrollView, Text,TouchableOpacity,View} from "react-native";
import Modal from "react-native-modalbox"
import moment from 'moment';
import ColorList from '../../colorList';
import BleashupModal from '../../mainComponents/BleashupModal';
import rounder from '../../../services/rounder';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import GState from '../../../stores/globalState';
import Texts from '../../../meta/text';

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
    modalHeight = this.props.report.report ? 400 : 100 
    modalWidth="90%"
    entry="top"
    modalBody() {
        return (
            <View>
                {this.props.report.report &&<Text style={{...GState.defaultTextStyle, margin: '5%',
            fontWeight: 'bold',fontStyle: 'italic',color:ColorList.bodySubtext}}>{`@${Texts.report}`}</Text>}
                {this.props.report.report && <ScrollView style={{ margin: "5%", height: "50%" }}>
                    <Text style={{...GState.defaultTextStyle}}>{this.props.report.report}</Text>
                </ScrollView>}
                <View style={{ margin: '2%' }}>
                <Text style={{...GState.defaultTextStyle,fontStyle: 'italic',}}>{moment(this.props.report.date).calendar()}</Text></View>
                {this.props.master ? <View style={{justifyContent: 'flex-end',flexDirection: 'row', margin: '2%',}}>
                    <TouchableOpacity transparent style={{ flexDirection: 'column', justifyContent: 'center', ...rounder(40,ColorList.bodyDarkWhite) }} onPress={() => {
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