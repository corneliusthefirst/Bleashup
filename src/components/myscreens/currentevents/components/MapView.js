import React, { Component } from "react"
import { View, TouchableOpacity, Image } from "react-native"
import { Text } from "native-base";
import { createOpenLink } from "react-native-open-maps";
export default class MapView extends Component {
    constructor(props) {
        super(props)
    }
    Query = { query: this.props.location };
    OpenLink = createOpenLink(this.Query);
    OpenLinkZoom = createOpenLink({ ...this.Query, zoom: 50 });
    componentDidMount() {
    }
    render() {
        return <View style={this.props.style}>
            <TouchableOpacity>
                <Text ellipsizeMode="clip" numberOfLines={2}>
                    {this.props.location}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.OpenLinkZoom}>
                <Image
                    source={require("../../../../../Images/google-maps-alternatives-china-720x340.jpg")}
                    style={{
                        height: 60,
                        width: "100%",
                        borderRadius: 15
                    }}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <TouchableOpacity onPress={this.OpenLink}>
                    <Text note> View On Map </Text>
                </TouchableOpacity>
            </View>
        </View>
    }
}