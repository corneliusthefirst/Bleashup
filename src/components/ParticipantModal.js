import React from "react"
import ParticipantList from "./ParticipantList";
import BleashupModal from './mainComponents/BleashupModal';
 export default class ParticipantModal extends BleashupModal {
    initialize(){
        this.state = {
            isOpen: false,
            loaded: false,
            participants: [],
            event_id: null
        };
    }
    state = {}
    onClosedModal() {
        this.props.onClosed()
        this.setStatePure({
            participants: [],
            loaded: false,
            event_id: null,
            hideTitle: false
        })
    }
    onOpenModal() {
       this.openModalTimeout = setTimeout(() => {
            this.setStatePure({
                participants: this.props.participants,
                event_id: this.props.event_id,
                loaded: true,
                hideTitle: this.props.hideTitle
            })
        }, 100)
    }
    modalBody() {
        return (
            this.state.loaded ?
                <ParticipantList close={this.props.onClosed} master={this.props.master} creator={this.props.creator} hide={this.state.hideTitle} participants={this.state.participants} title={"Participants List"}
                    event_id={this.state.event_id}></ParticipantList> :null

        );
    }
}