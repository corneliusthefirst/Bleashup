import React, { Component } from "react"
import { View, TouchableOpacity, Image } from "react-native"
import { Text,Title } from "native-base";
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
                <Title style={{marginBottom:4,fontSize:11,color:"#0A4E52", fontStyle: this.props.location ? 'normal' : 'italic'}} >
                    {this.props.location ? this.props.location : 'No Set Location'}
                </Title>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.location ? this.OpenLinkZoom : null}>
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
                <TouchableOpacity onPress={this.props.location ? this.OpenLink : null}>
                    <Text note> View On Map </Text>
                </TouchableOpacity>
            </View>
        </View>
    }
}