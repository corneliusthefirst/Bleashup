import React, { Component } from "react";
import CacheImages from "../../../CacheImages";
import { View, TouchableOpacity, Text} from "react-native";

import ImageActivityIndicator from "../../currentevents/components/imageActivityIndicator";
import ProfileIdicator from "../../currentevents/components/ProfilIndicator";
import stores from "../../../../stores";
import ProfileModal from "./ProfileModal";
import testForURL from "../../../../services/testForURL";
import ColorList from "../../../colorList";
import ProfileSimple from "../../currentevents/components/ProfileViewSimple";
import { check_user_error_1, check_user_error_2 } from '../../../../stores/temporalUsersStore';
import BeComponent from '../../../BeComponent';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import emitter from "../../../../services/eventEmiter";
import { sayTyping } from '../../eventChat/services';
import { typing } from "../../../../meta/events";
import { observer } from "mobx-react";
import BePureComponent from '../../../BePureComponent';

@observer class ProfileView extends BePureComponent {
    constructor(props) {
        super(props);
        this.state = {isMount:false,hide:false}
    }

    state = { isMount: false, hide: false };
    /*shouldComponentUpdate(nexprops, nexState) {
        return nexState.hide !== this.state.hide ||
            this.state.isMount !== nexState.isMount ||
            this.state.typing !== nexState.typing ||
            this.state.isModalOpened !== nexState.isModalOpened
    }*/
    componentDidMount() {
        setTimeout(
            () =>
                stores.TemporalUsersStore.getUser(this.props.phone).then((user) => {
                    if (
                        user.response == check_user_error_1 ||
                        user.response === check_user_error_2
                    ) {
                        this.setStatePure({ hide: true }); //this.state.hide = true;
                        this.props.hideMe ? this.props.hideMe(this.state.hide) : null;
                    } else {
                        this.props.contact &&
                            stores.Contacts.addContact({
                                phone: user.phone,
                                host: user.current_host,
                            }).then(() => { });
                        this.props.contact && this.props.updateContact(user);

                        this.setStatePure({
                            isModalOpened: false,
                            isMount: true,
                        });
                        this.props.setContact ? this.props.setContact(user) : null;
                    }
                }).catch((err) => {
                    
                }),
            20 * this.props.delay ? this.props.delay : 2
        );
    }

    openModal() {
        this.setStatePure({ isModalOpened: true });
    }
    componentMounting(){
        emitter.on(typing(this.props.phone),(typer) => {
            !this.sayTyping ? this.sayTyping = sayTyping.bind(this): null
            this.sayTyping(typer)
        })
    }
    unmountingComponent(){
        //!emitter.off(typing(this.props.phone))
    }
    showTyper() {
        return this.state.typing && <Text style={[GState.defaultTextStyle,
        {
            color: ColorList.indicatorColor, fontSize: 12,
        }]}>{`typing ...`}</Text>
    }
    render() {
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
                                <FontAwesome type={"FontAwesome"} style={{
                                    fontSize: ColorList.profilePlaceHolderHeight,
                                    color: ColorList.colorArray[Math.floor(Math.random() * 14)]
                                }} name={"user-circle-o"}/>
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
                            fontSize: 14,
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
                   {this.showTyper()}
                </View>
                {this.state.isModalOpened ? (
                    <ProfileModal
                        isOpen={this.state.isModalOpened}
                        hasJoin={this.props.hasJoin}
                        isToBeJoint
                        joined={this.props.joined}
                        onClosed={() => {
                            this.setStatePure({ isModalOpened: false });
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
export default ProfileView
