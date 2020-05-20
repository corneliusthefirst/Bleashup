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
               {this.props.back && <TouchableOpacity
                    style={{ width: "7%", marginTop: "auto", marginBottom: "auto" }}
                >
                    <Icon
                        onPress={this.props.back}
                        type="MaterialIcons"
                        name="arrow-back"
                        style={{ color: ColorList.headerIcon }}
                    />
                </TouchableOpacity>}
                <Text
                    elipsizeMode={"tail"}
                    numberOfLines={1}
                    style={{
                        color: ColorList.headerIcon,
                        fontWeight: "500",
                        marginTop: "auto",
                        fontSize: ColorList.headerFontSize,
                        marginBottom: "auto",
                        maxWidth: '50%',
                    }}
                >
                    {this.props.title}
                </Text>
                <View style={{ minWidth: '40%', justifyContent:'flex-end'}}>{this.props.extra}
                </View>
            </View>
        </View>
    }
}