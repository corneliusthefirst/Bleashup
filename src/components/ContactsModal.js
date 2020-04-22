import React, { PureComponent } from "react"
import Modal from "react-native-modalbox"
import { Content, List, ListItem, Body, Left, Right, Text, Container } from 'native-base';
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import Contacts from './Contacts';
import BleashupModal from './mainComponents/BleashupModal';
export default class ContactsModal extends BleashupModal {
 
    initialize(){
        this.state = {
            isOpen: false,
            contacts: []
        };
    }
    onClosedModal(){
        this.props.onClosed()
    }
    state = {}
    componentDidMount() {

    }
    onOpenModal(){
        this.setState({
            contacts: this.props.contacts
        })
    }
    modalBody() {
        return <Container>
                    <Contacts 
                    close={this.onClosedModal.bind(this)} 
                    contacts={(this.props.contacts && this.props.contacts) || []} 
                    title={this.props.title ? this.props.title : "Seen By ..."}
                    ></Contacts>
                </Container>
    }
}