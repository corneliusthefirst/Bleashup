import React, { PureComponent } from "react";
import { Dimensions, View } from "react-native"
import Modal from "react-native-modalbox";

const screenheight = Math.round(Dimensions.get('window').height);

export default class BleashupModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
        this.initialize()
    }
    state = {}
    initialize(){
    }
    onOpenModal() {

    }
    onClosedModal() {

    }
    backdropOpacity = 0.7
    backButtonClose = false
    swipeToClose = true
    position = 'bottom'
    modalBackground = '#FFFFFF'
    modalWidth = '100%'
    modalHeight = screenheight
    borderTopLeftRadius = 8
    borderTopRightRadius = 8
    height = screenheight
    modalBody() {
        return <View></View>
    }
    isOpened = false
    render() {
        return (
            <Modal
                backdropOpacity={this.backdropOpacity || 0.7}
                backButtonClose={this.backButtonClose || true}
                position={this.position || "bottom"}
                swipeToClose={this.swipeToClose || false}
                onOpened={() => {
                    this.onOpenModal()
                }}
                onClosed={() => {
                    this.onClosedModal()
                }}
                isOpen={this.props.isOpen}
                coverScreen={this.coverScreen || true}
                style={{
                    backgroundColor: this.modalBackground || '#FFFFFF',
                    height: this.modalHeight,
                    width: this.modalWidth || "100%",
                    borderTopLeftRadius: this.borderTopLeftRadius || 8,
                    borderTopRightRadius: this.borderTopRightRadius || 8,
                }}
            >
                {this.modalBody()}
            </Modal>
        );
    }
}
