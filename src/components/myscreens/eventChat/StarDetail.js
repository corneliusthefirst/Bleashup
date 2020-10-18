import React, { Component, PureComponent } from "react";
import {
    View,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import AnimatedComponent from "../../AnimatedComponent";
import BeNavigator from "../../../services/navigationServices";
import stores from "../../../stores";
import Social from "../event/createEvent/components/Social";
import GState from "../../../stores/globalState/index";
import Creator from "../reminds/Creator";
import TextContent from "./TextContent";
import MedaiView from "../event/createEvent/components/MediaView";
import ColorList from "../../colorList";
import ActivityProfile from "../currentevents/components/ActivityProfile";
import Spinner from "../../Spinner";
import DetailsModal from "../invitations/components/DetailsModal";
import Entypo from "react-native-vector-icons/Entypo";
import rounder from "../../../services/rounder";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ShareWithYourContacts from "./ShareWithYourContacts";
import request from "../../../services/requestObjects";
import messagePreparer from "./messagePreparer";
import public_states from "../reminds/public_states";
import BeMenu from "../../Menu";
import Texts from "../../../meta/text";

let { height, width } = Dimensions.get("window");

export default class StarDetail extends AnimatedComponent {
    initialize(props) {
        this.state = {
            updating: false,
            deleting: false,
            mounted: false,
            newing: false,
            isOpen: false,
            check: false,
        };
    }

    containsMedia() {
        return this.item.url.video || this.item.url.audio || this.item.url.photo
            ? true
            : false;
    }
    loadStatesFromStar() {
        stores.Events.loadCurrentEvent(this.star.event_id).then((event) => {
            this.activity = event;
            this.item = {
                ...this.star,
                public_state: public_states.private_,
            };
            this.refreshStates();
        });
    }
    loadInitialStates() {
        stores.Events.loadCurrentEvent(this.activity_id).then((event) => {
            this.activity = event;
            stores.Highlights.loadHighlight(this.activity_id, this.item_id).then(
                (item) => {
                    this.item = { ...item, public_state: public_states.private_ };
                    this.refreshStates();
                }
            );
        });
    }
    refreshStates() {
        this.setStatePure({
            newing: !this.state.newing,
            mounted: true,
        });
    }
    loadStatesFromRemote() {
        stores.Events.loadCurrentEventFromRemote(this.activity_id).then((event) => {
            this.activity = event;
            stores.Highlights.loadHighlightFromRemote(
                this.activity_id,
                this.item_id
            ).then((star) => {
                this.item = Array.isArray(star) && star[0];
                stores.Messages.updateStarMessageInfoMessage(
                    this.activity_id,
                    this.item_id,
                    this.item
                );
                stores.Highlights.addHighlight(this.activity_id, this.item);
                this.refreshStates();
            });
        });
    }
    componentDidMount() {
        setTimeout(() => {
            if (this.star) {
                this.loadStatesFromStar();
            } else {
                this.loadInitialStates();
                this.loadStatesFromRemote();
            }
        }, 50);
    }
    startSharing() {
        this.setStatePure({
            isSharing: true,
        });
    }
    hideSharing() {
        this.setStatePure({
            isSharing: false,
        });
    }
    getParam = (param) => this.props.navigation.getParam(param);
    star = this.getParam("star");
    forward = this.getParam("forward") || this.startSharing.bind(this);
    item_id = this.getParam("post_id");
    reply = this.getParam("reply");
    roomID = this.getParam("room");
    reply_privately = this.getParam("reply_privately");
    activity_id = this.getParam("activity_id");
    container = {
        width: "98%",
        alignSelf: "center",
        justifyContent: "center",
        margin: "1%",
        backgroundColor: ColorList.bodyBackground,
        borderRadius: 5,
        //borderBottomWidth: 0.5,
        //borderColor: "ivory",
    };
    formReply() {
        let reply = GState.prepareStarForMention(this.item);
        reply.from_activity = this.item.event_id;
        reply.activity_id = this.roomID;
        reply.activity_name = this.activity.about.title;
        return reply;
    }
    startReply() {
        GState.reply = this.formReply();
        this.reply();
        this.goback();
    }
    startPrivateReply() {
        GState.reply = this.formReply();
        this.reply_privately([], this.item.creator);
    }
    showItem(item) {
        item.url.video
            ? BeNavigator.openVideo(item.url.video)
            : BeNavigator.openPhoto(item.url.photo);
    }
    openDetails() {
        this.setStatePure({
            isDetailsOpened: true,
        });
    }
    isMember() {
        return this.activity.participant.find(
            (ele) => ele.phone === stores.LoginStore.user.phone
        );
    }
    gotoRemindInAct() {
        BeNavigator.gotoStarWithIndex(this.activity, this.item_id);
    }
    goback() {
        this.props.navigation.goBack();
    }
    items() {
        return [
            {
                title: Texts.reply,
                action: this.startReply.bind(this),
                condition: this.roomID,
            },
            {
                title: Texts.manage_in_activity,
                condition: this.isMember(),
                action: this.gotoRemindInAct.bind(this),
            },
            {
                title: Texts.reply_privately,
                action: this.startPrivateReply.bind(this),
                condition: this.roomID,
            },
        ];
    }
    updateSource(aid, data) {
        stores.Highlights.updateHighlightUrl(aid, data);
    }
    render() {
        return this.state.mounted ? (
            <View>
                <ScrollView showVerticalScrollIndicator={false}>
                    <View
                        style={[
                            this.container,
                            {
                                backgroundColor: this.props.isPointed
                                    ? ColorList.postTransparent
                                    : ColorList.bodyBackground,
                            },
                        ]}
                    >
                        <View
                            style={{
                                width: "98%",
                                flexDirection: "row",
                                alignSelf: "flex-start",
                                hieght: 70,
                                marginBottom: "5%",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                onPress={this.goback.bind(this)}
                                style={{
                                    width: 45,
                                }}
                            >
                                <MaterialIcons
                                    name={"arrow-back"}
                                    style={{
                                        ...GState.defaultIconSize,
                                    }}
                                ></MaterialIcons>
                            </TouchableOpacity>
                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                <ActivityProfile
                                    small
                                    Event={this.activity}
                                    showPhoto={(url) => BeNavigator.openPhoto(url)}
                                    openDetails={this.openDetails.bind(this)}
                                ></ActivityProfile>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                {this.item.public_state == public_states.public_ ? (
                                    <TouchableOpacity
                                        onPress={this.forward}
                                        style={{
                                            ...rounder(40),
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Entypo
                                            name={"forward"}
                                            style={{
                                                ...GState.defaultIconSize,
                                                color: ColorList.indicatorColor,
                                            }}
                                        ></Entypo>
                                    </TouchableOpacity>
                                ) : null}
                                <View
                                    style={{
                                        marginRight: "5%",
                                    }}
                                >
                                    <BeMenu items={this.items.bind(this)}></BeMenu>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                width: "97%",
                                justifyContent: "center",
                                minHeight: 70,
                                alignSelf: "center",
                            }}
                        >
                            <TextContent
                                tags={this.item.extra && this.item.extra.tags}
                                animate={this.props.animate}
                                searchString={this.props.searchString}
                                style={{
                                    ...GState.defaultTextStyle,
                                    fontSize: 15,
                                    marginTop: "2%",

                                    textAlign: "center",
                                    color: ColorList.headerBlackText,
                                    fontWeight: "bold",
                                    //marginTop: "10%",
                                }}
                            //numberOfLines={3}
                            >
                                {this.item.title}
                            </TextContent>
                        </View>
                        <MedaiView
                            data={{ id: this.item.id }}
                            activity_id={this.item.event_id}
                            updateSource={this.updateSource}
                            width={ColorList.containerWidth}
                            height={250}
                            showItem={() => this.showItem(this.item)}
                            url={this.item.url || {}}
                        ></MedaiView>
                        <View
                            style={{
                                margin: "1%",
                            }}
                        >
                            <TextContent
                                animate={this.animateUI.bind(this)}
                                tags={this.item.extra && this.item.extra.tags}
                                searchString={this.props.searchString}
                                text={this.item.description ? this.item.description : ""}
                            ></TextContent>
                        </View>
                        <View
                            style={{
                                width: ColorList.containerWidth,
                                alignSelf: "center",
                                alignItems: "center",
                                marginLeft: "3%",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Creator creator={this.item.creator}></Creator>
                            {!this.star && (
                                <Social
                                    title={this.item.title}
                                    activity_name={this.activity.about.title}
                                    creator={this.item.creator}
                                    activity_id={this.activity_id}
                                    id={this.item.id}
                                ></Social>
                            )}
                        </View>
                    </View>
                </ScrollView>
                <DetailsModal
                    event={this.activity}
                    isToBeJoint
                    isOpen={this.state.isDetailsOpened}
                    data={{ post_id: this.item_id }}
                    onClosed={() => {
                        this.setStatePure({
                            isDetailsOpened: false,
                        });
                    }}
                ></DetailsModal>
                <ShareWithYourContacts
                    isOpen={this.state.isSharing}
                    activity_id={this.activity_id}
                    sender={request.Message().sender}
                    committee_id={this.activity_id}
                    message={{
                        ...messagePreparer.formMessagefromStar(this.item),
                        forwarded: true,
                        reply: null,
                        from_activity: this.activity,
                        from_committee: this.activity,
                        from: null,
                    }}
                    onClosed={this.hideSharing.bind(this)}
                ></ShareWithYourContacts>
            </View>
        ) : (
                <View
                    style={{
                        ...this.container,
                        height: "100%",
                        justifyContent: "center",
                    }}
                >
                    <Spinner></Spinner>
                </View>
            );
    }
}
