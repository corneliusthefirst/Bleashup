import React, { Component } from "react"
import CacheImages from '../../../CacheImages';
import { View } from "react-native";
import { Body, Text, Accordion, Content } from "native-base"
import ImageActivityIndicator from '../../currentevents/imageActivityIndicator';

export default class ProfileView extends Component {
    constructor(props) {
        super(props)
    }
    state = { profile: undefined, isMount: false, dataArray: undefined }
    componentDidMount() {
        this.setState({
            profile: this.props.profile,
            isMount: true,
            dataArray: {
                title: this.props.profile.status.slice(0, 60) + " ...",
                content: this.props.profile.status
            }
        })
    }
    render() {
        return this.state.isMount ? (
            <View style={{ flexDirection: "row" }}>
                <View>
                    <CacheImages thumbnails {...this.props} source={{ uri: this.state.profile.image }} />
                </View>
                <View>
                    <Body>
                        <Text style={{

                        }}>{this.state.profile.name}</Text>
                        <Text style={{ marginTop: 8 }} note>{this.state.dataArray.title}</Text>
                    </Body>
                </View>
            </View>
        ) : <ImageActivityIndicator />
    }
}