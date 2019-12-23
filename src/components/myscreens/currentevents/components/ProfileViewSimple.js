import React, { Component } from "react"
import CacheImages from '../../../CacheImages';
import { View } from "react-native";
import { Body, Text, Accordion, Content, Thumbnail } from "native-base"
import ImageActivityIndicator from '../../currentevents/components/imageActivityIndicator';
import ProfileIdicator from "../../currentevents/components/ProfilIndicator";
import stores from "../../../../stores";
import ProfileModal from "../../invitations/components/ProfileModal";
import { TouchableOpacity } from "react-native-gesture-handler";
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
    render() {
        return (

            <View style={{ flexDirection: "row", }}>
                <TouchableOpacity onPress={() => {
                    requestAnimationFrame(() => {
                        return this.props.showPhoto(this.props.profile.profile)
                    });
                }}>
                    {testForURL(this.props.profile.profile) ? <CacheImages small thumbnails {...this.props}
                        source={{ uri: this.props.profile.profile }} /> :
                        <Thumbnail source={{ uri: this.props.profile.profile }}></Thumbnail>}
                </TouchableOpacity>
                <View style={{ marginTop: "3%", marginLeft: "2%",flexDirection:"column"}}>
                    <Text style={{marginBottom: "2%",fontWeight: 'bold',alignSelf:"flex-start"}}>{this.props.profile.phone === stores.LoginStore.user.phone?"You ": this.props.profile.nickname}</Text>
                    <Text style={{ fontStyle:'italic',alignSelf:"flex-start" }} note>{!(this.props.profile.status === undefined) ? this.props.profile.status.slice(0, 50) : ""}</Text>
                </View>

                {/*<ProfileModal
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
                ></ProfileModal>*/}
            </View>
        )
    }
}