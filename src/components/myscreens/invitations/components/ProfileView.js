import React, { Component } from "react"
import CacheImages from '../../../CacheImages';
import { View } from "react-native";
import { Body, Text, Accordion, Content } from "native-base"
import ImageActivityIndicator from '../../currentevents/components/imageActivityIndicator';
import ProfileIdicator from "../../currentevents/components/ProfilIndicator";
import stores from "../../../../stores";
import ProfileModal from "./ProfileModal";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class ProfileView extends Component {
    constructor(props) {
        super(props)
    }
    state = { profile: undefined, isMount: false, dataArray: undefined }
    componentDidMount() {
        setTimeout(() => stores.TemporalUsersStore.getUser(this.props.phone).then(user => {
            this.setState({
                profile: user,
                isModalOpened: false,
                isMount: true,
                dataArray: {
                    title: user.status.slice(0, 60) + " ...",
                    content: user.status
                }
            })
        }), 300)

    }
    openModal() {
        this.setState({
            isModalOpened: true
        })
    }
    render() {
        return this.state.isMount ? (
            <View style={{ flexDirection: "row", }}>
                <TouchableOpacity onPress={() => {
                    requestAnimationFrame(() => {
                        return this.setState({ isModalOpened: true })
                    });
                }}>
                    {<CacheImages thumbnails {...this.props} source={{ uri: this.state.profile.profile }} />}
                </TouchableOpacity>
                <View style={{ marginTop: "3%", marginLeft: "2%", display: 'flex', }}>
                    <Text style={{
                    }}>{this.state.profile.nickname}</Text>
                    <Text note>{this.state.dataArray.title}</Text>
                </View>
                <ProfileModal
                    isOpen={this.state.isModalOpened}
                    hasJoin={this.props.hasJoin}
                    isToBeJoint
                    joined={this.props.joined}
                    parent={this}
                    onClosed={() => {
                        this.setState({ isModalOpened: false })
                        //this.props.onOpen()
                    }
                    }
                    profile={this.state.profile}
                ></ProfileModal>
            </View>
        ) : <ProfileIdicator />
    }
}