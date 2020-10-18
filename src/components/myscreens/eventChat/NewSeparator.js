import React, { Component } from "react";

import { View, Text } from "react-native";
import shadower from "../../shadower";
import ColorList from '../../colorList';
import stores from "../../../stores";
import Texts from "../../../meta/text";
import { observer } from "mobx-react";
@observer class NewSeparator extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        this.newCount = stores.States.getNewMessagesCount(this.props.room)
        return (
            <View style={{ 
            ...shadower(1) ,
            maxHeight: 35,
            minHeight: 25, 
            backgroundColor: ColorList.transparentWhite, 
            borderRadius: 5,
            width:'100%',
            borderWidth: 1,
            borderColor: ColorList.bodyBackground,
            flexDirection: 'column',
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            }}>
            <View>
                <Text style={{ 
                fontWeight: 'bold', 
                textAlign:'center',
                alignSelf: 'center',
                color:ColorList.reminds
            }}>
                {this.newCount && `(${this.newCount}) `}  {Texts.new_messages}</Text>
            </View>
            </View>
        );
    }
}

export default NewSeparator