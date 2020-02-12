import React, { Component } from "react"
import CacheImages from '../../../CacheImages';
import { View,Text } from "react-native";
import { Body, Accordion, Content, Thumbnail } from "native-base"
import ImageActivityIndicator from '../../currentevents/components/imageActivityIndicator';
import ProfileIdicator from "../../currentevents/components/ProfilIndicator";
import stores from "../../../../stores";
import ProfileModal from "../../invitations/components/ProfileModal";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import testForURL from '../../../../services/testForURL';

export default class ProfileSimple extends Component {
    constructor(props) {
        super(props)
    }
    state = { profile: undefined, isMount: false, dataArray: undefined, hide: false }

    openModal() {
        this.setState({
            isModalOpened: true
        })
    }
    showingProfile = false
    render() {
        return (
            <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                !this.showingProfile? this.setState({
                    isModalOpened: true
                }):null
                
            })}>
                <View style={{ flexDirection: "row", }}>
                    <TouchableWithoutFeedback onPress={() => {
                        requestAnimationFrame(() => {
                            this.showingProfile = true
                             this.props.showPhoto(this.props.profile.profile)
                            setTimeout(() => {
                                this.showingProfile = false
                            }, 50)
                        });
                    }}>
                        {this.props.profile.profile && testForURL(this.props.profile.profile) ? <CacheImages small thumbnails {...this.props}
                            source={{ uri: this.props.profile.profile }} /> :
                            <Thumbnail source={{ uri: this.props.profile.profile }}></Thumbnail>}
                    </TouchableWithoutFeedback>
                    <View style={{ marginTop: "3%", marginLeft: "2%", flexDirection: "column" }}>
                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={{ marginBottom: "2%", fontWeight: 'bold', alignSelf: "flex-start", color: "#696969" }}>{this.props.profile.phone === stores.LoginStore.user.phone ? "You " : this.props.profile.nickname}</Text>
                        {this.props.profile.status && this.props.profile.status !== 'undefined' ? <Text ellipsizeMode={'tail'} numberOfLines={1} style={{ fontStyle: 'italic', alignSelf: "flex-start" }} note>{this.props.profile.status}</Text> : null}
                    </View>
                    {<ProfileModal
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
                        profile={this.props.profile}
                    ></ProfileModal>}
                </View>
            </TouchableOpacity>
        )
    }
}