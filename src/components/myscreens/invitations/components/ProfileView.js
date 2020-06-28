import React, { Component } from "react";
import CacheImages from "../../../CacheImages";
import { View, TouchableOpacity } from "react-native";
import {
    Body,
    Text,
    Accordion,
    Content,
    Thumbnail,
    Button,
    Title,
    Icon,
} from "native-base";
import ImageActivityIndicator from "../../currentevents/components/imageActivityIndicator";
import ProfileIdicator from "../../currentevents/components/ProfilIndicator";
import stores from "../../../../stores";
import ProfileModal from "./ProfileModal";
import testForURL from "../../../../services/testForURL";
import ColorList from "../../../colorList";
import ProfileSimple from "../../currentevents/components/ProfileViewSimple";
import { check_user_error_1, check_user_error_2 } from '../../../../stores/temporalUsersStore';

export default class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {isMount:false,hide:false}
    }

    state = { isMount: false, hide: false };
    shouldComponentUpdate(nexprops, nexState) {
        return nexState.hide !== this.state.hide ||
            this.state.isMount !== nexState.isMount ||
            this.state.isModalOpened !== nexState.isModalOpened
    }
    componentDidMount() {
        setTimeout(
            () =>
                stores.TemporalUsersStore.getUser(this.props.phone).then((user) => {
                    if (
                        user.response == check_user_error_1 ||
                        user.response === check_user_error_2
                    ) {
                        this.setState({ hide: true }); //this.state.hide = true;
                        this.props.hideMe ? this.props.hideMe(this.state.hide) : null;
                    } else {
                        this.props.contact &&
                            stores.Contacts.addContact({
                                phone: user.phone,
                                host: user.current_host,
                            }).then(() => { });
                        this.props.contact && this.props.updateContact(user);

                        this.setState({
                            profile: user,
                            isModalOpened: false,
                            isMount: true,
                        });
                        this.props.setContact ? this.props.setContact(user) : null;
                    }
                }).catch((err) => {
                    
                }),
            20 * this.props.delay ? this.props.delay : 2
        );

        //small method fro testing
        /*if(this.props.phone != "00237650594616"){
                    console.warn("here we are")
                    this.state.hide = true;
                    this.props.hideMe(this.state.hide)
                }*/
    }

    openModal() {
        this.setState({ isModalOpened: true });
    }

    render() {
        console.warn("rendering profile view")
        return !this.state.hide ? (
            <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                    onPress={() => {
                        requestAnimationFrame(() => {
                            this.openModal();
                        });
                    }}
                >
                    {!this.props.hidePhoto && <View style={{ alignSelf: "center" }} transparent>
                        {stores.TemporalUsersStore.Users &&
                            testForURL(
                                stores.TemporalUsersStore.Users[this.props.phone] &&
                                stores.TemporalUsersStore.Users[this.props.phone].profile
                            ) ? (
                                <CacheImages
                                    staySmall
                                    small
                                    thumbnails
                                    {...this.props}
                                    source={{
                                        uri:
                                            stores.TemporalUsersStore.Users &&
                                            stores.TemporalUsersStore.Users[this.props.phone] &&
                                            stores.TemporalUsersStore.Users[this.props.phone].profile,
                                    }}
                                />
                            ) : (
                                <Icon type={"FontAwesome"} style={{
                                    fontSize: ColorList.profilePlaceHolderHeight,
                                    color:ColorList.photoPlaceHolderColor
                                }} name={"user-circle-o"}>

                               </Icon>
                            )}
                    </View>}
                </TouchableOpacity>
                <View
                    style={{
                        alignSelf: "center",
                        marginLeft: this.props.contact ? "6.5%" : "4%",
                        fontWeight: "bold",
                    }}
                >
                    <Text
                        ellipsizeMode={"tail"}
                        numberOfLines={1}
                        style={{
                            color: ColorList.bodyText,
                            fontWeight: "bold",
                            //marginTop: "4%",
                        }}
                    >
                        {stores.TemporalUsersStore.Users &&
                            stores.TemporalUsersStore.Users[this.props.phone] &&
                            stores.TemporalUsersStore.Users[this.props.phone].phone ===
                            stores.LoginStore.user.phone
                            ? "You"
                            : stores.TemporalUsersStore.Users[this.props.phone]
                                ? stores.TemporalUsersStore.Users[this.props.phone].nickname
                                : "a bleashup user"}
                    </Text>

                    {stores.TemporalUsersStore.Users &&
                        stores.TemporalUsersStore.Users[this.props.phone] &&
                        stores.TemporalUsersStore.Users[this.props.phone].status &&
                        stores.TemporalUsersStore.Users[this.props.phone].status !=
                        "undefined" &&
                        !stores.TemporalUsersStore.Users[
                            this.props.phone
                        ].status.isEmpty() ? (
                            <Text
                                ellipsizeMode={"tail"}
                                numberOfLines={1}
                                style={{ alignSelf: "flex-start", fontStyle: "italic" }}
                                note
                            >
                                {stores.TemporalUsersStore.Users &&
                                    stores.TemporalUsersStore.Users[this.props.phone] &&
                                    stores.TemporalUsersStore.Users[this.props.phone].status}
                            </Text>
                        ) : null}
                </View>
                {this.state.isModalOpened ? (
                    <ProfileModal
                        isOpen={this.state.isModalOpened}
                        hasJoin={this.props.hasJoin}
                        isToBeJoint
                        joined={this.props.joined}
                        onClosed={() => {
                            this.setState({ isModalOpened: false });
                        }}
                        profile={
                            stores.TemporalUsersStore.Users &&
                            stores.TemporalUsersStore.Users[this.props.phone]
                        }
                    ></ProfileModal>
                ) : null}
            </View>
        ) : (
                <ProfileIdicator />
            );
    }
}
