import React, { Component } from 'react';
import { View, BackHandler, Text, TouchableOpacity } from "react-native"
import QRCodeScanner from 'react-native-qrcode-scanner';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import stores from '../../../stores';
import DetailsModal from '../invitations/components/DetailsModal';
import { findIndex } from 'lodash';
import ColorList from '../../colorList';
import BeNavigator from '../../../services/navigationServices';
import Toaster from '../../../services/Toaster';
import Ionicons from 'react-native-vector-icons/Ionicons';
import shadower from '../../shadower';
import GState from '../../../stores/globalState';
import Texts from '../../../meta/text';
import Spinner from '../../Spinner';
import BePureComponent from '../../BePureComponent';

export default class QRScanner extends BePureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }
    state = {

    }
    goToActivity(event) {
        //console.error("navigating")
        BeNavigator.pushActivity(event)
        this.scanner.reactivate()
        //this.props.onClosed()
    }
    componentDidMount() {
        setTimeout(() => {
            this.scanner.reactivate()
        }, 500)
    }
    startLoading() {
        this.setStatePure({
            loading: true
        })
    }
    goBackAfterTimeout(){
        this.goback()
    }
    onSuccess = e => {
        let data = JSON.parse(e.data)
        this.startLoading()
        if (data && data.activity_id) {
            stores.Events.loadCurrentEventFromRemote(data.activity_id).then((event) => {
                let isParticipant = findIndex(event.participant,
                    { phone: stores.LoginStore.user.phone }) >= 0
                if (isParticipant) {
                    if (data.remind_id) {
                        this.goBackAfterTimeout()
                        BeNavigator.pushActivityWithIndex(event, { remind_id: data.remind_id })
                    } else {
                        this.goBackAfterTimeout()
                        this.goToActivity(event)
                    }
                } else {
                    if (data.remind_id) {
                        this.goBackAfterTimeout()
                        BeNavigator.goToRemindDetail(data.remind_id, data.activity_id)
                    } else {
                        this.setStatePure({
                            isDetailModalOpened: true,
                            event: event
                        })
                    }
                }
            }).catch((error) => {
                Toaster({ text: 'Unable to perform network request', position: 'top', duration: 4000 })
            })
        }
    };
    goback() {
        this.props.navigation.goBack()
    }
    render() {
        return <View style={{ height: '100%', }}>
            <QRCodeScanner
                ref={(node) => { this.scanner = node }}
                showMarker={true}
                onRead={this.onSuccess}
                //flashMode={QRCodeScanner.Constants.FlashMode.torch}
                topContent={
                    <View style={{ ...bleashupHeaderStyle, padding: '2%', height: 45 }}>
                        <Text style={{ ...GState.defaultTextStyle, fontWeight: 'bold', }}>
                            {Texts.join_activity_or_program_via_qr}
                        </Text>
                    </View>
                }
                bottomContent={
                    <TouchableOpacity
                        style={{
                            width: 100,
                            height: 50,
                            alignSelf: 'flex-start',
                            margin: '1%',
                            ...shadower(3),
                            backgroundColor: ColorList.indicatorColor,
                            borderRadius: 5, flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingLeft: 10,
                            paddingRight: 10,
                            alignItems: 'center',
                        }}
                        onPress={() => this.goback()}>
                        <Ionicons
                            style={{ ...GState.defaultIconSize, color: ColorList.bodyBackground }} name="md-arrow-round-back" type='Ionicons' /><Text style={{ ...GState.defaultTextStyle, color: ColorList.bodyBackground }}>{Texts.go_back}</Text>
                    </TouchableOpacity>
                }
            />
            {this.state.loading ? <View style={{
                position: 'absolute',
                backgroundColor: ColorList.buttonerBackground,
                flexDirection: 'column',
                height:'100%',
                width:'100%',
                alignItems: 'center',
            }}>
                <Spinner size={50} color={ColorList.bodyBackground}></Spinner>
            </View> : null}
            {this.state.isDetailModalOpened ? <DetailsModal
                onClosed={() => {
                    this.setStatePure({
                        isDetailModalOpened: false
                    })
                    this.scanner.reactivate()
                }}
                goToActivity={() => {
                    this.goBackAfterTimeout()
                    this.goToActivity(this.state.event)
                }}
                navigation={this.props.navigation}
                event={this.state.event}
                location={this.state.event.location && this.state.event.location.string}
                isOpen={this.state.isDetailModalOpened}
                isToBeJoint={true}></DetailsModal> : null}
        </View>
    }
}