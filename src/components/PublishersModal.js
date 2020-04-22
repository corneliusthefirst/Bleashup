import React, { PureComponent } from "react"
import Modal from "react-native-modalbox"
import { Content, List, ListItem, Body, Left, Right, Text, Container,Spinner } from 'native-base';
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import ContactList from "./ContactList";
import { observer } from "mobx-react";
import BleashupModal from "./mainComponents/BleashupModal";
@observer export default class PublishersModal extends BleashupModal {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            loaded:false
        };
    }
    onClosedModal(){
        this.props.onClosed()
        this.setState({
            event_id: null,
            loaded: false
        })
    }
    onOpenModal(){
        setTimeout(() => {
            this.setState({
                loaded: true,
                event_id: this.props.event_id
            })
        }, 50)
    }
    componentDidMount() {

    }
    modalBody() {
        return (
              this.state.loaded?
                    <ContactList back={() => this.onClosedModal()} title={"Publishers List"} event_id={this.state.event_id}></ContactList>
                :<Spinner size={"small"}></Spinner>)
    }
}