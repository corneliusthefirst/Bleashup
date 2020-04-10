import React, { Component } from "react"
import CacheImages from '../../../CacheImages';
import { View } from "react-native";
import { Body, Text, Accordion, Content, Thumbnail, Button,Title } from "native-base"
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
    state = { profile: undefined, isMount: false, hide: false }
    componentDidMount() {
        setTimeout(() => stores.TemporalUsersStore.getUser(this.props.phone).then(user => {
            console.warn("user gotten")
            if (user.response == "unknown_user") {
                this.props.hideMe ? this.props.hideMe() : null
                this.setState({
                    hide: true
                })
            } else {
                console.warn(user);
                this.setState({
                    profile: user,
                    isModalOpened: false,
                    isMount: true,
                })
                this.props.setContact ? this.props.setContact(user) : null
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

            <View style={{ flexDirection: "row", margin: '1%', }}>
                <Button onPress={() => {
                    requestAnimationFrame(() => {
                        this.setState({
                            isModalOpened: true
                        })
                    });
                }} transparent>
                    {testForURL(this.state.profile.profile) ? <CacheImages small thumbnails {...this.props}
                        source={{ uri: this.state.profile.profile }} /> :
                        <Thumbnail small source={require("../../../../../Images/images.jpeg")}></Thumbnail>}
                </Button>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center', marginLeft: "4%", display: 'flex', fontWeight: 'bold', }}>
                    <Text ellipsizeMode={'tail'} numberOfLines={1} style={{
                        marginBottom: "2%",
                        color: "#0A4E52",
                        fontWeight: 'bold',
                    }}>{this.state.profile.phone === stores.LoginStore.user.phone ? "You" : this.state.profile.nickname}</Text>
                   <Text ellipsizeMode={'tail'} numberOfLines={1} style={{ marginLeft: "2%", fontStyle: 'italic', }} note>{this.state.profile.status}</Text>
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