import React from "react"

import BleashupModal from "../../mainComponents/BleashupModal";
import { View } from 'react-native';
import CreationHeader from "../event/createEvent/components/CreationHeader";


export default class ReactionModal extends BleashupModal{

coverScreen=false 
modalHeight=35
position='center'
modalWidth=300
backdropOpacity=.03
onClosedModal(){
    this.props.onClosed()
}
modalBody(){
    return <View>
    </View>
}
}