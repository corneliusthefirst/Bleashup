import React, { PureComponent } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import Modal from "react-native-modalbox"
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import ColorList from '../../colorList';
import shadower from '../../shadower';
import Texts from '../../../meta/text';
import GState from '../../../stores/globalState';
import BleashupModal from '../../mainComponents/BleashupModal';
import BleashupAlert from './createEvent/components/BleashupAlert';

export default class AreYouSure extends BleashupModal {
    constructor(props) {
        super(props)
        this.state = {
            content: null
        }
    }
    state = {}
    buttonStyle = {
        alignItems: 'center',
        backgroundColor: ColorList.bodyBackground,
        ...shadower(2),
        justifyContent: 'center',
        borderRadius: 10, width: 70, height: 40
    }
    modalWidth = "80%"
    modalHeight = 200
    position="center"
    borderRadius = 10
    swipeToClose = false
    onOpenModal() {
        setTimeout(() => {
            this.setState({
                content: this.props.content
            })
        }, 20)
    }
    onClosedModal() {
        this.props.closed()
        this.setState({
            message: null,
            title: null,
            callback: null,
        })
    }
    modalBody() {
        return <BleashupAlert
            component
            title={this.props.title}
            message={this.props.message}
            onClosed={this.onClosedModal.bind(this)}
            refuse={Texts.cancel}
            accept={this.props.ok ? this.props.ok : Texts.leave}
            deleteFunction={() => {
                this.props.callback()
                this.onClosedModal()
            }}
        ></BleashupAlert>
    }
}