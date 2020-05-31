import React, { PureComponent } from "react";
import { Dimensions, View } from "react-native"
import Modal from "react-native-modalbox";
import ColorList from '../colorList';

const screenheight = Math.round(Dimensions.get('window').height);

export default class BleashupModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
        this.initialize()
    }
    state = {}
    initialize() {
    }
    onOpenModal() {

    }
    onClosedModal() {

    }
    jusify = false
    backdropOpacity = 0.7
    borderRadius = 0
    backButtonClose = false
    swipeToClose = true
    position = 'bottom'
    modalBackground = ColorList.bodyBackground
    modalWidth = '100%'
    modalHeight = '100%'
    borderTopLeftRadius = 8
    borderTopRightRadius = 8
    height = screenheight
    coverScreen=true
    modalBody() {
        return <View></View>
    }
    isOpened = false
    entry = 'bottom'

    modal(){
        return (
            <Modal
                backdropOpacity={this.backdropOpacity || 0.7}
                backButtonClose={this.backButtonClose || true}
                position={this.position || "bottom"}
                swipeToClose={this.swipeToClose || false}
                onOpened={() => {
                    this.onOpenModal()
                }}
                entry={this.entry || 'bottom'}
                onClosed={() => {
                    this.onClosedModal()
                }}
                isOpen={this.props.isOpen ? true : this.props.open ? true : false}
                coverScreen={this.coverScreen}
                style={{
                    backgroundColor: this.modalBackground || '#FFFFFF',
                    height: this.modalHeight,
                    width: this.modalWidth || "100%",
                    justifyContent: this.jusify ? 'center' : null,
                    borderRadius: this.borderRadius,
                    borderTopLeftRadius: this.borderTopLeftRadius,
                    borderTopRightRadius: this.borderTopRightRadius,
                }}
            >
                {this.modalBody()}
            </Modal>
        );
    }
    render() {
        return this.modal()
    }
}
