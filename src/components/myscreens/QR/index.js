import React, { Component } from 'react';
import { View, BackHandler } from "react-native"
import QRCodeScanner from 'react-native-qrcode-scanner';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import { Button, Text, Icon } from 'native-base';
import stores from '../../../stores';
import DetailsModal from '../invitations/components/DetailsModal';
import { findIndex } from 'lodash';

export default class QRScanner extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    state = {

    }
    componentWillMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));
    }
    handleBackButton() {
        this.goback()
        return true;
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton.bind(this));
    }
    goToActivity(event) {
        //console.error("navigating")
        this.props.navigation.navigate("Event", {
            Event: event,
            tab: "EventDetails"
        });
        this.scanner.reactivate()
        //this.props.onClosed()
    }
    componentDidMount() {
        setTimeout(() => {
            this.scanner.reactivate()
        }, 500)
    }
    onSuccess = e => {
        //console.error(e.data)
        stores.Events.loadCurrentEvent(e.data).then((event) => {
            let isParticipant = findIndex(event.participant, { phone: stores.LoginStore.user.phone }) >= 0
            if (isParticipant) {
                this.goToActivity(event)
            } else {
                this.setState({
                    isDetailModalOpened: true,
                    event: event
                })
            }
        })
    };
    goback() {
        this.props.navigation.goBack()
    }
    render() {
        return <View style={{ height: '100%', backgroundColor: '#FEFFDE', }}>
            <QRCodeScanner
                ref={(node) => { this.scanner = node }}
                showMarker={true}
                onRead={this.onSuccess}
                //flashMode={QRCodeScanner.Constants.FlashMode.torch}
                topContent={
                    <View style={{ ...bleashupHeaderStyle, padding: '2%', height: 45 }}>
                        <Text style={{ fontWeight: 'bold', }}>
                            {"Join activity through QR Code"}
                        </Text>
                    </View>
                }
                bottomContent={
                    <Button onPress={() => this.goback()}>
                        <Icon name="md-arrow-round-back" type='Ionicons'></Icon><Text>{"Go Back"}</Text>
                    </Button>
                }
            />
            {this.state.isDetailModalOpened ? <DetailsModal
                onClosed={() => {
                    this.setState({
                        isDetailModalOpened: false
                    })
                    this.scanner.reactivate()
                }}
                goToActivity={() => this.goToActivity(this.state.event)}
                navigation={this.props.navigation}
                event={this.state.event}
                location={this.state.event.location && this.state.event.location.string}
                isOpen={this.state.isDetailModalOpened}
                isToBeJoint={true}></DetailsModal> : null}
        </View>
    }
}