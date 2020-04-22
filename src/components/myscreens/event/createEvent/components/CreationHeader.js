import React, { Component } from "react"
import { View, TouchableOpacity } from 'react-native';
import ColorList from '../../../../colorList';
import { Icon, Text } from "native-base";
import bleashupHeaderStyle from "../../../../../services/bleashupHeaderStyle";

export default class CreationHeader extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <View style={{ height: ColorList.headerHeight, width: "100%" }}>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    ...bleashupHeaderStyle,
                    justifyContent: 'space-between',
                    paddingLeft: "2%",
                }}
            >
                <TouchableOpacity
                    style={{ width: "20%", marginTop: "auto", marginBottom: "auto" }}
                >
                    <Icon
                        onPress={this.props.back}
                        type="MaterialCommunityIcons"
                        name="keyboard-backspace"
                        style={{ color: ColorList.headerIcon }}
                    />
                </TouchableOpacity>
                <Text
                    elipsizeMode={"tail"}
                    numberOfLines={1}
                    style={{
                        color: ColorList.headerIcon,
                        fontWeight: "500",
                        width: "50%",
                        marginTop: "auto",
                        marginBottom: "auto",
                    }}
                >
                    {this.props.title}
                </Text>
                <View style={{ width: '30%' }}>{this.props.extra}
                </View>
            </View>
        </View>
    }
}