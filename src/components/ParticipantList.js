import React, { Component } from "react";
import {
    List,
    ListItem,
    Body,
    Left,
    Right,
    Text,
    Header,
    Title,
    Spinner,
    Icon,
} from "native-base";
import { View, FlatList } from "react-native";
import ImageActivityIndicator from "./myscreens/currentevents/components/imageActivityIndicator";
import stores from "../stores";
import UserService from "../services/userHttpServices";
import ProfileView from "./myscreens/invitations/components/ProfileView";
import BleashupFlatList from "./BleashupFlatList";
import Menu, { MenuDivider, MenuItem } from "react-native-material-menu";
import bleashupHeaderStyle from "../services/bleashupHeaderStyle";
import ColorList from "./colorList";

export default class ParticipantList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            publishers: [],
            hidden:{}
        };
    }
    state = {
        isOpen: false,
        isloaded: false,
    };
    /*shouldComponentUpdate(nextProps, nextState) {
        return nextState.isOpen !== this.state.isOpen ||
            nextState.isloaded !== this.state.isloaded
            ? true
            : false;
    }*/
    writeParticant(participant) {
        return this.props.creator === participant.phone
            ? "creator"
            : participant.master == true
                ? "Master"
                : participant.master && participant.master !== "undefined"
                    ? "Simple Member"
                    : "";
    }
    componentDidUpdate(previousProps,previousState){
        if(this.props.isSelecting !== previousProps.isSelecting){
            if (!this.props.participants) {
                stores.Events.getPaticipants(this.props.event_id).then(
                    (participants) => {
                        this.setState({
                            participants: participants,
                            isloaded: true,
                        });
                    }
                );
            } else {
                console.warn(this.props.participants);
                this.setState({
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
                        this.setState({
                            participants: participants,
                            isloaded: true,
                        });
                    }
                );
            } else {
                console.warn(this.props.participants);
                this.setState({
                    participants: this.props.participants ? this.props.participants : [],
                    isloaded: true,
                });
            }
        }, 3);
    }
    delay = 0;
    _keyExtractor = (item, index) => item.phone;
    render() {
        return (
            <View>
                <View style={{ height: ColorList.headerHeight }}>
                    <View
                        style={{
                            padding: "3%",
                            flexDirection: "row",
                            ...bleashupHeaderStyle,
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={{ width: "10%" }}>
                            <Icon
                                onPress={this.props.close}
                                style={{
                                    color: ColorList.headerIcon,
                                }}
                                name="keyboard-backspace"
                                type="MaterialCommunityIcons"
                            ></Icon>
                        </View>
                        <Text
                            elipziseMode={"tail"}
                            numberOfLines={1}
                            style={{ fontWeight: "bold", fontSize: 20, width: "50%" }}
                        >
                            {this.props.hide ? "" : this.props.title || "Participants List"}
                        </Text>
                       {this.props.managing && <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "20%",
                            }}
                        >
                            <Icon
                                onPress={this.props.addMembers}
                                name={"plus"}
                                type={"AntDesign"}
                                style={{ color: ColorList.headerIcon }}
                            ></Icon>
                            <Icon
                                onPress={this.props.removeMember}
                                name={"circle-with-minus"}
                                type={"Entypo"}
                                style={{ color: ColorList.headerIcon }}
                            ></Icon>
                        </View>}
                        <Text style={{marginTop: '2%',}} note>
                            {this.state.participants ? this.state.participants.length : 0}
                            {" member(s)"}
                        </Text>
                    </View>
                </View>
                {this.state.isloaded ? (
                    <View>
                        {this.state.isEmpty ? (
                            <Text
                                style={{
                                    margin: "4%",
                                }}
                                note
                            >
                                {"sory! there's no connction to the server"}
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
                                            return item.phone && !(this.state.hidden && this.state.hidden[item.phone]) ? (
                                                <View style={{ margin: '2%', }}>
                                                    <View style={{ display: "flex", flexDirection: "row" }}>
                                                        <View style={{}}>
                                                            <ProfileView
                                                            hideMe={() => {
                                                                let newHidden = this.state.hidden
                                                                newHidden[item.phone] = true
                                                                this.setState({
                                                                hidden : newHidden
                                                            })
                                                            }}
                                                                delay={this.delay}
                                                                phone={
                                                                    item.phone
                                                                        ? item.phone.replace("+", "00")
                                                                        : null
                                                                }
                                                            ></ProfileView>
                                                        </View>
                                                        <View
                                                            style={{
                                                                marginLeft: "40%",
                                                                marginTop: "5%",
                                                            }}
                                                        >
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
