import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import stores from "../stores";
import UserService from "../services/userHttpServices";
import ProfileView from "./myscreens/invitations/components/ProfileView";
import BleashupFlatList from "./BleashupFlatList";
import bleashupHeaderStyle from "../services/bleashupHeaderStyle";
import ColorList from "./colorList";
import CreationHeader from "./myscreens/event/createEvent/components/CreationHeader";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Spinner from "./Spinner";
import GState from "../stores/globalState";
import BeComponent from "./BeComponent";
import Texts from "../meta/text";

export default class ParticipantList extends BeComponent {
    constructor(props) {
        super(props);
        this.state = {
            publishers: [],
            hidden: {},
        };
    }
    state = {
        isOpen: false,
        isloaded: false,
    };
    writeParticant(participant) {
        return this.props.creator === participant.phone
            ? "creator"
            : participant.master == true
                ? "Master"
                : participant.master && participant.master !== "undefined"
                    ? "Simple Member"
                    : "";
    }
    componentDidUpdate(previousProps, previousState) {
        if (this.props.isSelecting !== previousProps.isSelecting) {
            if (!this.props.participants) {
                stores.Events.getPaticipants(this.props.event_id).then(
                    (participants) => {
                        this.setStatePure({
                            participants: participants,
                            isloaded: true,
                        });
                    }
                );
            } else {
                console.warn(this.props.participants);
                this.setStatePure({
                    participants: this.props.participants ? this.props.participants : [],
                    isloaded: true,
                });
            }
        }
    }
    componentDidMount() {
        setTimeout(() => {
            if (!this.props.participants) {
                stores.Events.getPaticipants(this.props.event_id).then(
                    (participants) => {
                        this.setStatePure({
                            participants: participants,
                            isloaded: true,
                        });
                    }
                );
            } else {
                console.warn(this.props.participants);
                this.setStatePure({
                    participants: this.props.participants ? this.props.participants : [],
                    isloaded: true,
                });
            }
        }, 3);
    }
    center = { marginBottom: "auto", marginTop: "auto" };
    delay = 0;
    _keyExtractor = (item, index) => item.phone;
    render() {
        return (
            <View style={{ height: "100%" }}>
                <CreationHeader
                    back={this.props.close}
                    title={
                        this.props.hide ? "" : this.props.title || Texts.participants_list
                    }
                    extra={
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: 'center',
                                maxWidth: 150,
                                paddingRight: 2,
                                marginBottom: "auto",
                                marginTop: "auto",
                            }}
                        >
                            {this.props.managing && (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: 'center',
                                    }}
                                >
                                    <TouchableOpacity
                                        transparent
                                        style={{
                                            backgroundColor: ColorList.bodyBackground,
                                            width: 40,
                                        }}
                                        onPress={this.props.addMembers}
                                    >
                                        <AntDesign
                                            name={"plus"}
                                            style={{
                                                ...GState.defaultIconSize,
                                                color: ColorList.headerIcon,
                                            }}
                                        ></AntDesign>
                                    </TouchableOpacity>
                                    {this.state.participants &&
                                        this.state.participants.length > 0 ? (
                                            <TouchableOpacity
                                                style={{
                                                    width: 40,
                                                    backgroundColor: ColorList.bodyBackground,
                                                }}
                                                onPress={this.props.removeMember}
                                            >
                                                <Entypo
                                                    name={"circle-with-minus"}
                                                    style={{
                                                        ...GState.defaultIconSize,
                                                        color: ColorList.headerIcon,
                                                    }}
                                                ></Entypo>
                                            </TouchableOpacity>
                                        ) : null}
                                </View>
                            )}
                            <Text style={{ fontSize: 12 }} note>
                                {this.state.participants ? this.state.participants.length : 0}
                                {" " + Texts.members }
                            </Text>
                        </View>
                    }
                ></CreationHeader>
                {this.state.isloaded ? (
                    <View>
                        {this.state.isEmpty ? (
                            <Text
                                style={{
                                    margin: "4%",
                                }}
                                note
                            >
                                {Texts.loading_data}
                            </Text>
                        ) : (
                                <View style={{ hight: "93%" }}>
                                    <BleashupFlatList
                                        firstIndex={0}
                                        renderPerBatch={7}
                                        initialRender={15}
                                        numberOfItems={
                                            this.state.participants ? this.state.participants.length : 0
                                        }
                                        keyExtractor={this._keyExtractor}
                                        dataSource={
                                            this.state.participants ? this.state.participants : []
                                        }
                                        renderItem={(item, index) => {
                                            this.delay = this.delay >= 15 ? 0 : this.delay + 1;
                                            return item.phone &&
                                                !(this.state.hidden && this.state.hidden[item.phone]) ? (
                                                    <View style={{ margin: "2%" }}>
                                                        <View
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "row",
                                                                justifyContent: "space-between",
                                                            }}
                                                        >
                                                            <View style={{}}>
                                                                <ProfileView
                                                                    hideMe={() => {
                                                                        let newHidden = this.state.hidden;
                                                                        newHidden[item.phone] = true;
                                                                        this.setStatePure({
                                                                            hidden: newHidden,
                                                                        });
                                                                    }}
                                                                    delay={this.delay}
                                                                    phone={
                                                                        item.phone
                                                                            ? item.phone.replace("+", "00")
                                                                            : null
                                                                    }
                                                                ></ProfileView>
                                                            </View>
                                                            <View>
                                                                <Text
                                                                    style={{
                                                                        fontWeight:
                                                                            this.props.creator == item.phone
                                                                                ? "bold"
                                                                                : "normal",
                                                                        fontStyle:
                                                                            this.props.creator == item.phone
                                                                                ? "italic"
                                                                                : "normal",
                                                                        color:
                                                                            this.props.creator == item.phone
                                                                                ? "#54F5CA"
                                                                                : "gray",
                                                                    }}
                                                                    note
                                                                >
                                                                    {this.writeParticant(item)}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ) : null;
                                        }}
                                    ></BleashupFlatList>
                                </View>
                            )}
                    </View>
                ) : (
                        <Spinner size="small"></Spinner>
                    )}
            </View>
        );
    }
}
