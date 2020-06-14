import React, { Component } from "react";
import Modal from "react-native-modalbox";
import {
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter,
    Image,
    TouchableHighlight, ScrollView
} from "react-native";
import {
    Button,
    Icon,
    Card,
    CardItem,
    Right,
    Left,
    Spinner,
    Header,
    Content,
    Footer,
    Container,
    Toast,
    Title,
} from "native-base";
import CacheImages from "../../../CacheImages";
import autobind from "autobind-decorator";
import ImageActivityIndicator from "../../currentevents/components/imageActivityIndicator";
import DeckSwiperModule from "./deckswiper/index";
import MapView from "../../currentevents/components/MapView";
import stores from "../../../../stores";
import moment from "moment";
import { forEach, findIndex } from "lodash";
import bleashupHeaderStyle from "../../../../services/bleashupHeaderStyle";
import PhotoViewer from "../../event/PhotoViewer";
import Request from "../../currentevents/Requester";
import TitleView from "../../currentevents/components/TitleView";
import Creator from "../../reminds/Creator";
import BleashupModal from "../../../mainComponents/BleashupModal";
export default class DetailsModal extends BleashupModal {
    constructor(props) {
        super(props);
    }
    state = {};
    initialize() {
        this.state = {
            details: undefined,
            isOpen: false,
            created_date: undefined,
            event_organiser_name: undefined,
            location: undefined,
            isJoining: false,
            isToBeJoint: false,
            id: undefined,
            loaded: false,
        };
    }
    transparent = "rgba(52, 52, 52, 0.0)";
    details = [];
    created_date = "";
    event_organiser_name = "";
    location = "";
    isToBeJoint = false;
    id = "";
    componentDidMount() {
        this.props.parent ? this.props.parent.onSeen() : null;
    }
    formCreator() {
        return new Promise((resolve, reject) => {
            stores.TemporalUsersStore.getUser(this.props.event.creator_phone).then(
                (user) => {
                    resolve({
                        name: user.nickname,
                        status: user.status,
                        image: user.profile,
                    });
                }
            );
        });
    }

    formDetailModal(event) {
        return new Promise((resolve, reject) => {
            let card = [];
            Description = {
                event_title: event.about.title,
                event_description: event.about.description,
            };
            card.push(Description);
            resolve(card);
        });
    }
    join() {
        if (
            findIndex(this.state.event.participant, {
                phone: stores.LoginStore.user.phone,
            }) < 0
        ) {
            this.setState({
                isJoining: true,
            });
            Request.join(this.state.event.id, this.state.event.event_host)
                .then((status) => {
                    this.setState({
                        isJoining: false,
                    });
                    this.props.onClosed();
                })
                .catch((error) => {
                    console.warn(error, " error which occured while joining ");
                    this.setState({ isJoining: false });
                    Toast.show({
                        text: "unable to perform this action",
                        buttonText: "Okay",
                        position: "top",
                        duration: 4000,
                    });
                });
        } else {
            this.props.goToActivity();
            this.props.onClosed();
        }
    }
    backdropOpacity = 0.3;
    onClosedModal() {
        this.props.onClosed();
    }
    onOpenModal() {
        setTimeout(
            () =>
                this.formDetailModal(this.props.event).then((details) => {
                    this.formCreator().then((creator) => {
                        this.setState({
                            event: this.props.event,
                            details: details,
                            creator: creator,
                            loaded: true,
                            location: this.props.event.location,
                        });
                    });
                }),
            100
        );
    }
    swipeToClose=false
    modalHeight = this.height * 0.5;
    modalBody() {
        const accept = this.state.accept;
        const deny = this.state.deny;
        return !this.state.loaded ? (
            <Spinner size={"small"}></Spinner>
        ) : (
                <Content showsVerticalScrollIndicator={false}>
                    <View style={{ height: "98%" }}>
                        <View style={{ height: 65 }}>
                            <View
                                style={{
                                    ...bleashupHeaderStyle,
                                    padding: "1%",
                                    flexDirection: "row",
                                }}
                            >
                                <TouchableOpacity
                                    style={{ width: "30%" }}
                                    onPress={() =>
                                        requestAnimationFrame(() => {
                                            this.setState({
                                                showPhoto: true,
                                            });
                                        })
                                    }
                                >
                                    <CacheImages
                                        thumbnails
                                        source={{ uri: this.state.event.background }}
                                    ></CacheImages>
                                </TouchableOpacity>
                                <View style={{ width: "80%" }}>
                                    <TitleView Event={this.state.event}></TitleView>
                                </View>
                            </View>
                        </View>
                        <DeckSwiperModule details={this.state.details} />
                        <CardItem>
                            <Left>
                                {this.props.isToBeJoint && this.state.event.public ? (
                                    <View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            {this.state.isJoining ? (
                                                <Spinner></Spinner>
                                            ) : (
                                                    <Button
                                                        onPress={this.props.join}
                                                        style={{
                                                            alignItems: "center",
                                                            width: 100,
                                                            marginTop: 4,
                                                            marginBottom: 10,
                                                            borderRadius: 5,
                                                        }}
                                                        onPress={() =>
                                                            this.props.join ? this.props.join() : this.join()
                                                        }
                                                        success
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 18,
                                                                fontWeight: "500",
                                                                marginLeft: 31,
                                                            }}
                                                        >
                                                            Join
                        </Text>
                                                    </Button>
                                                )}
                                            <View style={{ flexDirection: "column" }}></View>
                                        </View>
                                    </View>
                                ) : null}
                            </Left>
                            <Right>
                                {this.state.location && this.state.location.string ? (
                                    <MapView card location={this.state.location.string}></MapView>
                                ) : null}
                            </Right>
                        </CardItem>
                        <View style={{  margin:'1%' }}>
                            {
                                <Creator
                                    creator={this.state.event.creator_phone}
                                    created_at={this.state.event.created_at}
                                ></Creator>
                            }
                        </View>
                    </View>
                    {this.state.showPhoto ? (
                        <PhotoViewer
                            open={this.state.showPhoto}
                            photo={this.state.event.background}
                            hidePhoto={() => {
                                this.setState({
                                    showPhoto: false,
                                });
                            }}
                        ></PhotoViewer>
                    ) : null}
                </Content>
            );
    }
}

/*marginTop:this.props.location.length > 19?15:this.props.location.length > 38?5:35*/
