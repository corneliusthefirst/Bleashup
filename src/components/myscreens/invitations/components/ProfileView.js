import React, { Component } from "react"
import CacheImages from '../../../CacheImages';
import { View } from "react-native";
import { Body, Text, Accordion, Content, Thumbnail, Button } from "native-base"
import ImageActivityIndicator from '../../currentevents/components/imageActivityIndicator';
import ProfileIdicator from "../../currentevents/components/ProfilIndicator";
import stores from "../../../../stores";
import ProfileModal from "./ProfileModal";
import { TouchableOpacity } from "react-native-gesture-handler";
import testForURL from '../../../../services/testForURL';

export default class ProfileView extends Component {
    constructor(props) {
        super(props)
    }
    state = { profile: undefined, isMount: false, dataArray: undefined, hide: false }
    componentDidMount() {
        setTimeout(() => stores.TemporalUsersStore.getUser(this.props.phone).then(user => {
            if (user.response == "unknown_user") {
                this.props.hideMe ? this.props.hideMe() : null
                this.setState({
                    hide: true
                })
            } else {
                this.setState({
                    profile: user,
                    isModalOpened: false,
                    isMount: true,
                    dataArray: {
                        title: user.status.slice(0, 60) + " ...",
                        content: user.status
                    }
                })
                this.props.setContact(user)
            }
        }), 20 * this.props.delay ? this.props.delay : 2)
    }
    openModal() {
        this.setState({
            isModalOpened: true
        })
    }
    render() {
        return this.state.hide ? null : this.state.isMount ? (

            <View style={{ flexDirection: "row",margin: '1%', }}>
                <Button onPress={() => {
                    requestAnimationFrame(() => {
                        this.setState({
                            isModalOpened:true
                        })
                    });
                }} transparent>
                    {testForURL(this.state.profile.profile) ? <CacheImages thumbnails {...this.props}
                        source={{ uri: this.state.profile.profile }} /> :
                        <Thumbnail source={{ uri: this.state.profile.profile }}></Thumbnail>}
                </Button>
                <View style={{ marginTop: "3%", marginLeft: "2%", display: 'flex', fontWeight: 'bold', }}>
                    <Text style={{
                        marginBottom: "2%",
                        color: "#0A4E52",
                        fontWeight: 'bold',
                    }}>{this.state.profile.phone === stores.LoginStore.user.phone ? "You" : this.state.profile.nickname}</Text>
                    <Text style={{ marginLeft: "2%", fontStyle: 'italic', }} note>{this.state.dataArray.title}</Text>
                </View>
                {this.state.isModalOpened ? <ProfileModal
                    isOpen={this.state.isModalOpened}
                    hasJoin={this.props.hasJoin}
                    isToBeJoint
                    joined={this.props.joined}
                    onClosed={() => {
                        this.setState({ isModalOpened: false })
                        //this.props.onOpen()
                    }
                    }
                    profile={this.state.profile}
                ></ProfileModal> : null}
            </View>
        ) : <ProfileIdicator />
    }
}