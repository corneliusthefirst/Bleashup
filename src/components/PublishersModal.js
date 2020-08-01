import React from "react"
import ContactList from "./ContactList";
import BleashupModal from "./mainComponents/BleashupModal";
import Spinner from './Spinner';
export default class PublishersModal extends BleashupModal {
    initialize(){
        this.state = {
            isOpen: false,
            loaded: false
        };
    }
    onClosedModal() {
        this.props.onClosed()
        this.setStatePure({
            event_id: null,
            loaded: false
        })
    }
    swipeToClose = this.props.reaction ? false : true
    modalHeight = this.props.reaction ? 550 : this.modalHeight
    modalWidth = this.props.reaction ? "80%" : this.modalWidth
    position = this.props.reaction ? 'center' : 'top'
    onOpenModal() {
       this.openModalTimeout = setTimeout(() => {
            this.setStatePure({
                loaded: true,
                event_id: this.props.event_id
            })
        }, 50)
    }
    componentDidMount() {

    }
    modalBody() {
        return (
            this.state.loaded ?
                <ContactList reacters={this.props.reacters} back={() => this.onClosedModal()} reaction={this.props.reaction} title={"Publishers List"} event_id={this.state.event_id}></ContactList>
                : <Spinner size={"small"}></Spinner>)
    }
}