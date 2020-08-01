import React, { Component } from 'react';
import { View, BackHandler, Text,TouchableOpacity} from "react-native"
import QRCodeScanner from 'react-native-qrcode-scanner';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import stores from '../../../stores';
import DetailsModal from '../invitations/components/DetailsModal';
import { findIndex } from 'lodash';
import ColorList from '../../colorList';
import BeNavigator from '../../../services/navigationServices';
import Toaster from '../../../services/Toaster';
import Ionicons  from 'react-native-vector-icons/Ionicons';
import shadower from '../../shadower';
import GState from '../../../stores/globalState';
import Texts from '../../../meta/text';

export default class QRScanner extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    state = {

    }
    componentWillMount() {
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
    onSuccess = e => {
        stores.Events.loadCurrentEventFromRemote(e.data).then((event) => {
            let isParticipant = findIndex(event.participant, { phone: stores.LoginStore.user.phone }) >= 0
            if (isParticipant) {
                this.goToActivity(event)
           } else {
                this.setState({
                    isDetailModalOpened: true,
                    event: event
                })
           }
        }).catch((error) => {
            Toaster({text:'Unable to perform network request',position:'top',duration:4000})
        })
    };
    goback() {
        this.props.navigation.goBack()
    }
    render() {
        return <View style={{ height: '100%',  }}>
            <QRCodeScanner
                ref={(node) => { this.scanner = node }}
                showMarker={true}
                onRead={this.onSuccess}
                //flashMode={QRCodeScanner.Constants.FlashMode.torch}
                topContent={
                    <View style={{ ...bleashupHeaderStyle, padding: '2%', height: 45 }}>
                        <Text style={{...GState.defaultTextStyle, fontWeight: 'bold', }}>
                            {Texts.join_via_qr}
                        </Text>
                    </View>
                }
                bottomContent={
                    <TouchableOpacity
                    style={{
                        width:100,
                        height:50,
                        alignSelf: 'flex-start',
                        margin: '1%',
                        ...shadower(3),
                        backgroundColor: ColorList.indicatorColor,
                        borderRadius: 5,flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingLeft: 10,
                        paddingRight: 10,
                        alignItems: 'center',
                    }}
                    onPress={() => this.goback()}>
                        <Ionicons
                         style={{ ...GState.defaultIconSize, color: ColorList.bodyBackground }} name="md-arrow-round-back" type='Ionicons'/><Text style={{ ...GState.defaultTextStyle,color: ColorList.bodyBackground }}>{Texts.go_back}</Text>
                    </TouchableOpacity>
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