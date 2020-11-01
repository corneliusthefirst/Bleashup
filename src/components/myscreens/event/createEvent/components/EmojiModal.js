import React from "react"
import BleashupModal from '../../../../mainComponents/BleashupModal';
import ImojieSelector from "../../../eventChat/ImojiSelector";
import ColorList from '../../../../colorList';

export default class EmojiModal extends BleashupModal {
    onOpenModal(){

    }
    position='bottom'
    entry='bottom'
    modalHeight=300
    borderTopLeftRadius=20
    borderTopRightRadius=20
    backdropOpacity=0.1
    borderRadius=0 
    modalWidth="95%"
    modalBackground=ColorList.transparent
    onClosedModal(){
        this.props.onClosed()
    }
    modalBody() {
        return <ImojieSelector
            handleEmojiSelected={this.props.handleEmojiSelected}
        >
        </ImojieSelector>
    }
}