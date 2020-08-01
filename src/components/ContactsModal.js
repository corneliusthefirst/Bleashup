import React, { PureComponent } from "react"
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
        this.setStatePure({
            contacts: this.props.contacts
        })
    }
    modalBody() {
        return <View>
                    <Contacts 
                    close={this.onClosedModal.bind(this)} 
                    contacts={(this.props.contacts && this.props.contacts) || []} 
                    title={this.props.title ? this.props.title : "Seen By ..."}
                    ></Contacts>
                </View>
    }
}