import React, { Component } from "react"
import { View, TouchableOpacity, Text, } from "react-native"
import { Title, Thumbnail } from "native-base";
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
        return <View style={{...this.props.style,flexDirection: 'column',}}>
            <TouchableOpacity style={{alignSelf: 'flex-start',}}>
                <Title style={{fontSize:12}}> {this.props.location && this.props.card ? this.props.location: 'No Set Location'}</Title>     
            </TouchableOpacity>
            <TouchableOpacity  onPress={this.props.location ? this.OpenLinkZoom : null}>
                <Thumbnail
                    square
                    source={require("../../../../../Images/google-maps-alternatives-china-720x340.jpg")}
                    style={{
                        height: 50,
                        borderRadius: 3,
                        width:'100%'
                    }}
                    //resizeMode="contain"
                />
            </TouchableOpacity>
            <View
                style={{
                    flexDirection: "row",
                    alignSelf: 'flex-start',
                }}
            >
                <TouchableOpacity onPress={this.props.location ? this.OpenLink : null}>
                    <Text note>{"View On Map"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
}