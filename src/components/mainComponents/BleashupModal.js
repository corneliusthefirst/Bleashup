import React, { PureComponent } from "react";
import { Dimensions, View } from "react-native"
import Modal from "react-native-modalbox";
import ColorList from '../colorList';
import AnimatedPureComponent from '../AnimatedPureComponent';
import emitter from "../../services/eventEmiter";
import { close_all_modals } from "../../meta/events";
import AnimatedComponent from '../AnimatedComponent';
import GState from '../../stores/globalState/index';

const screenheight = Math.round(Dimensions.get('window').height);

export default class BleashupModal extends AnimatedComponent {
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
    unMountingModal() {

    }
    mountingModal() {

    }
    componentMounting() {
        emitter.on(close_all_modals, () => {
            (this.props.isOpen || this.props.open) ? this.onClosedModal(true) : null
        })
        this.mountingModal()
    }
    unmountingComponent() {
        emitter.off(close_all_modals)
        this.unMountingModal()
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
    style = {}
    coverScreen = true
    modalBody() {
        return <View></View>
    }
    backdropPressToClose = true
    modalMinHieight = null
    isOpened = false
    entry = 'bottom'
    borderWidth = 0
    modal() {
        return (
            <Modal
                backdropOpacity={this.backdropOpacity || 0.7}
                backButtonClose={this.backButtonClose || true}
                backdropPressToClose={this.backdropPressToClose}
                position={this.position || "bottom"}
                swipeToClose={this.swipeToClose || false}
                onOpened={() => {
                    !this.opened && this.onOpenModal()
                    this.opened = true
                }}
                entry={this.entry || 'bottom'}
                onClosed={() => {
                    this.onClosedModal()
                    this.opened = false
                }}
                isOpen={this.props.isOpen ? true : this.props.open ? true : false}
                coverScreen={this.coverScreen}
                style={{
                    borderWidth: this.borderWidth,
                    backgroundColor: this.modalBackground || '#FFFFFF',
                    height: !this.modalMinHieight ? this.modalHeight : null,
                    minHeight: this.modalMinHieight ? this.modalMinHieight : null,
                    maxHeight: this.modalMinHieight && this.modalHeight,
                    width: this.modalWidth || "100%",
                    justifyContent: this.jusify ? 'center' : null,
                    borderRadius: this.borderRadius,
                    borderTopLeftRadius: this.borderTopLeftRadius,
                    borderTopRightRadius: this.borderTopRightRadius,//...this.style
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
