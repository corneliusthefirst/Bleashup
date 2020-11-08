import React from "react"
import { View, Text } from "react-native"
import AnimatedComponent from '../../AnimatedComponent';
import Feather from 'react-native-vector-icons/Feather';
import GState from '../../../stores/globalState/index';
import rounder from "../../../services/rounder";
import ColorList from "../../colorList";
import { observer } from 'mobx-react';
import stores from "../../../stores";
import  Entypo  from 'react-native-vector-icons/Entypo';
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';

@observer class HomeTab extends AnimatedComponent {
    initialize() {

    }
    render() {
        this.act_count = this.props.remind ? stores.States.getNewRemindsCount() : stores.States.getNewMessagesCount()
        console.warn("act counts is: ",  this.act_count, 
            stores.States.states.newMessages)
        this.iconStyle = {
            ...GState.defaultIconSize,
            color: this.props.focused ?
                this.props.remind ?
                    ColorList.likeActive :
                    ColorList.indicatorColor :
                this.props.color,
            fontSize: this.props.focused ? 35 : 15,
        }
        return <View>
            {this.props.remind?<Entypo style={this.iconStyle}
            name={"bell"}
            ></Entypo>:<MaterialIcons style={this.iconStyle}
                name={"chat-bubble"}></MaterialIcons>}
            <View style={{
                alignSelf: 'center',
                paddingTop: 3,
                position: 'absolute',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                height: 40, width: 40
            }}>
                {this.act_count ? <View style={{
                    ...rounder(this.props.focused ? 25 : 17,
                        this.props.focused ? ColorList.reminds : ColorList.indicatorInverted),
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        ...GState.defaultTextStyle,
                        fontSize: !this.props.focused ? 11 : 20,
                        color: ColorList.bodyBackground,
                        fontWeight: this.props.focused ? 'bold' : 'normal',
                    }}>{this.act_count}</Text>
                </View> : null}
            </View>
        </View>
    }
}
export default HomeTab