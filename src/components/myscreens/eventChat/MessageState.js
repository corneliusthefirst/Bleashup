
import React from "react"
import AnimatedComponent from '../../AnimatedComponent';
import ColorList from '../../colorList';
import rounder from "../../../services/rounder";
import { View } from 'react-native';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import  EvilIcons from 'react-native-vector-icons/EvilIcons';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';

export default class MessageState extends AnimatedComponent{

    initialize(){

    }
    iconStyles = {
        fontSize: 20,
        color: ColorList.indicatorColor,
        //marginTop: "-2%",
    };
    render(){
        return this.props.sent ? (
            this.props.received ? (
                this.props.seen ? (
                    <View
                        style={{
                            ...rounder(20, ColorList.indicatorColor),
                            justifyContent: "center",
                        }}
                    >
                        <Ionicons
                            style={{
                                ...this.iconStyles,
                                color: ColorList.bodyBackground,
                                marginLeft: 0,
                                fontSize: 20,
                                marginBottom: 0,
                                paddingTop: 0,
                            }}
                            type="Ionicons"
                            name="ios-done-all"
                        />
                    </View>
                ) : (
                        <Ionicons
                            style={this.iconStyles}
                            type="Ionicons"
                            name="ios-checkmark-circle"
                        />
                    )
            ) : (
                    <View style={{
                        ...rounder(20, this.props.color), justifyContent: 'center',
                    }}
                    ><EvilIcons
                            style={this.iconStyles}
                            type={"EvilIcons"}
                            name="check"
                        />
                    </View>
                )
        ) : (
                <MaterialCommunityIcons
                    style={{
                        ...this.iconStyles,
                        color: ColorList.darkGrayText,
                    }}
                    type="MaterialCommunityIcons"
                    name="progress-check"
                />
            )
    }
}