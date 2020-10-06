import React, { PureComponent } from "react"
import Contacts from './Contacts';
import {View} from "react-native"
import BleashupModal from './mainComponents/BleashupModal';
import Texts from "../meta/text";
export default class ContactsModal extends BleashupModal {

    initialize() {
        this.state = {
            isOpen: false,
            contacts: []
        };
    }
    onClosedModal() {
        this.isRoute ? this.goback() : this.props.onClosed()
    }
    state = {}
    componentDidMount() {

    }
    goback() {
        this.props.navigation.goBack()
    }
    getParam = (param) => this.props.navigation && this.props.navigation.getParam(param)
    isRoute = this.props.navigation && true
    contacts = this.getParam("contacts") || this.props.contacts
    title = this.getParam("title") || this.props.title

    onOpenModal() {
        this.setStatePure({
            contacts: this.props.contacts
        })
    }
    render() {
        return this.isRoute ? this.modalBody() : this.modal()
    }
    modalBody() {
        return <View>
            <Contacts
                close={this.onClosedModal.bind(this)}
                contacts={this.contacts || []}
                title={this.title || Texts.members}
            ></Contacts>
        </View>
    }
}