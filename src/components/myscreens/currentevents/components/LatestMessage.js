import React from "react";
import { observer } from "mobx-react";
import AnimatedComponent from "../../../AnimatedComponent";
import message_types from "../../eventChat/message_types";
import TextContent from "../../eventChat/TextContent";
import GState from "../../../../stores/globalState/index";
import ChatUser from "../../eventChat/ChatUser";
import { View, Text, TouchableOpacity } from "react-native";
import ColorList from "../../../colorList";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import convertToHMS from "../../highlights_details/convertToHMS";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import stores from "../../../../stores";
import moment from "moment";
import Texts from "../../../../meta/text";
import MessageState from "../../eventChat/MessageState";
import Moment from "react-moment";
import rounder from "../../../../services/rounder";
import AnimatedPureComponent from '../../../AnimatedPureComponent';
import { writeChangeWithContent } from "../../changelogs/change.services";

@observer
class LatestMessage extends AnimatedComponent {
    initialize() { }
    main(Mess, change) {
        return (
            <View
                style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                }}
            >
                <View style={{ maxWidth: GState.width * 0.2, marginRight: "2%" }}>
                    <ChatUser
                        reply
                        searchString={this.props.searchString}
                        phone={
                            change
                                ? this.change.updater
                                : this.message &&
                                this.message.sender &&
                                this.message.sender.phone
                        }
                        showProfile={() => {
                            requestAnimationFrame(() => {
                                this.props.showProfile &&
                                    this.props.showProfile(this.message.sender.phone);
                            });
                        }}
                    ></ChatUser>
                </View>
                <View>
                    <Text>{": "}</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <Mess></Mess>
                </View>
            </View>
        );
    }
    textStyle = {
        color: ColorList.darkGrayText,
    };
    messageText(change) {
        return (
            <TextContent
                tags={this.message.tags}
                notScallEmoji
                text={change ? (this.change.changed + writeChangeWithContent(this.change.new_value.new_value)) : this.message.text}
                numberOfLines={1}
                style={this.textStyle}
            />
        );
    }
    iconStyle = {
        ...GState.defaultIconSize,
        color: ColorList.darkGrayText,
        fontSize: 14,
    };
    iconContainer = {
        marginRight: "2%",
    };
    mainContainer = {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    };
    textContentStyle = {
        flex: 1,
    };

    choseMessages() {
        const types = {
            [message_types.text]: this.main(() => (
                <View style={this.mainContainer}>{this.messageText()}</View>
            )),
            [message_types.text_sender]: this.main(() => (
                <View style={this.mainContainer}>{this.messageText()}</View>
            )),
            [message_types.photo]: this.main(() => (
                <View style={this.mainContainer}>
                    <View style={this.iconContainer}>
                        <FontAwesome name={"photo"} style={this.iconStyle}></FontAwesome>
                    </View>
                    <View style={this.textContentStyle}>{this.messageText()}</View>
                </View>
            )),
            [message_types.photo_sender]: this.main(() => (
                <View style={this.mainContainer}>
                    <View style={this.iconContainer}>
                        <FontAwesome name={"photo"} style={this.iconStyle}></FontAwesome>
                    </View>
                    <View style={this.textContentStyle}>{this.messageText()}</View>
                </View>
            )),
            [message_types.video]: this.main(() => (
                <View style={this.mainContainer}>
                    <View style={this.iconContainer}>
                        <FontAwesome name={"video-camera"} style={this.iconStyle}></FontAwesome>
                    </View>
                    <View style={this.textContentStyle}>{this.messageText()}</View>
                </View>
            )),
            [message_types.video_sender]: this.main(() => (
                <View style={this.mainContainer}>
                    <View style={this.iconContainer}>
                        <FontAwesome name={"video-camera"} style={this.iconStyle}></FontAwesome>
                    </View>
                    <View style={this.textContentStyle}>{this.messageText()}</View>
                </View>
            )),
            [message_types.audio]: this.main(() => {
                this.played =
                    this.message.played &&
                    this.message.played.length >= this.props.members.length;
                let color = this.played ? ColorList.reminds : ColorList.darkGrayText;
                return (
                    <View style={this.mainContainer}>
                        <View style={this.iconContainer}>
                            <MaterialIcons
                                style={{ ...this.iconStyle, color }}
                                name={"keyboard-voice"}
                            ></MaterialIcons>
                        </View>
                        {this.message.duration ? (
                            <View
                                style={{
                                    marginRight: "2%",
                                }}
                            >
                                <Text
                                    style={{
                                        ...GState.defaultTextStyle,
                                        fontWeight: "bold",
                                        ...this.textStyle,
                                        color,
                                    }}
                                    numberOfLines={1}
                                >
                                    {convertToHMS(this.message.duration)}
                                </Text>
                            </View>
                        ) : null}
                        <View style={this.textContentStyle}>{this.messageText()}</View>
                    </View>
                );
            }),
            [message_types.audio_sender]: this.main(() => {
                this.played =
                    this.message.played &&
                    this.message.played.length >= this.props.members.length;
                let color = this.played ? ColorList.reminds : ColorList.darkGrayText;
                return (
                    <View style={this.mainContainer}>
                        <View style={this.iconContainer}>
                            <MaterialIcons
                                style={{ ...this.iconStyle, color }}
                                name={"keyboard-voice"}
                            ></MaterialIcons>
                        </View>
                        {this.message.duration ? (
                            <View
                                style={{
                                    marginRight: "2%",
                                }}
                            >
                                <Text
                                    style={{
                                        ...GState.defaultTextStyle,
                                        fontWeight: "bold",
                                        ...this.textStyle,
                                        color,
                                    }}
                                    ellipsizeMode={'tail'}
                                    numberOfLines={1}
                                >
                                    {convertToHMS(this.message.duration)}
                                </Text>
                            </View>
                        ) : null}
                        <View style={this.textContentStyle}>{this.messageText()}</View>
                    </View>
                );
            }),
            [message_types.file]: this.main(() => (
                <View style={this.mainContainer}>
                    <View style={this.iconContainer}>
                        <FontAwesome
                            style={this.iconStyle}
                            name={"file-text"}
                        ></FontAwesome>
                    </View>
                    <View
                        style={{
                            marginRight: "2%",
                        }}
                    >
                        <Text numberOfLines={1}>{this.message.file_name}</Text>
                    </View>
                    <View style={this.textContentStyle}>{this.messageText()}</View>
                </View>
            )),
            [message_types.filesender]: this.main(() => (
                <View style={this.mainContainer}>
                    <View style={this.iconContainer}>
                        <FontAwesome
                            style={this.iconStyle}
                            name={"file-text"}
                        ></FontAwesome>
                    </View>
                    <View
                        style={{
                            marginRight: "2%",
                        }}
                    >
                        <Text numberOfLines={1}>{this.message.file_name}</Text>
                    </View>
                    <View style={this.textContentStyle}>{this.messageText()}</View>
                </View>
            )),
            [message_types.remind_message]: this.main(() => (
                <View style={this.mainContainer}>
                    <View style={this.iconContainer}>
                        <Entypo
                            style={{ ...this.iconStyle, color: ColorList.reminds }}
                            name={"bell"}
                        ></Entypo>
                    </View>
                    <View style={this.textContentStyle}>{this.messageText()}</View>
                </View>
            )),
            [message_types.star_message]: this.main(() => (
                <View style={this.mainContainer}>
                    <View style={this.iconContainer}>
                        <AntDesign
                            style={{ ...this.iconStyle, color: ColorList.post }}
                            name={"star"}
                        ></AntDesign>
                    </View>
                    <View style={this.textContentStyle}>{this.messageText()}</View>
                </View>
            )),
            [message_types.relation_message]: this.main(() => (
                <View style={this.mainContainer}>
                    <View style={this.iconContainer}>
                        <AntDesign style={this.iconStyle} name={"user"}></AntDesign>
                    </View>
                    <View style={this.textContentStyle}>{this.messageText()}</View>
                </View>
            )),
        };
        return types[this.message.type] || this.sayNoUpdatedYet();
    }
    writeLatestUpdate() {
        return (
            <TouchableOpacity
                onPress={this.props.gotoLogs}
                style={{ flexDirection: "row", alignItems: "center" }}
            >
                {this.main(
                    () => (
                        <View style={this.mainContainer}>
                            <View style={this.iconContainer}>
                                <MaterialIcons
                                    style={this.iconStyle}
                                    name={"history"}
                                ></MaterialIcons>
                            </View>
                            <View style={this.textContentStyle}>
                                {this.messageText(true)}
                            </View>
                        </View>
                    ),
                    true
                )}
            </TouchableOpacity>
        );
    }
    sayNoUpdatedYet() {
        return <Text style={this.textStyle}>{Texts.no_updates_yet}</Text>;
    }
    calendar() {
        return (
            <View
                style={{
                    alignSelf: "flex-end",
                    alignItems: "flex-end",
                }}
            >
                <Moment element={Text} date={this.created_at} fromNow />
            </View>
        );
    }
    statesContainer = {
        minWidth: 40,
        maxHeight: 40,
        marginRight: 3,
        marginVertical: 2,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-end",
    }
    writeStates() {
        this.seen =
            this.message.seen &&
            this.message.seen.length >= this.props.members.length;
        this.received =
            this.message.receive &&
            this.message.receive.length >= this.props.members.length;
        return this.unreadMessages ? <View style={this.statesContainer}>
            <View style={{ ...rounder(30, ColorList.reminds), justifyContent: 'center', }}>
                <Text
                    style={{
                        ...GState.defaultTextStyle,
                        fontWeight: 'bold',
                        color: ColorList.bodyBackground
                    }}
                >{this.unreadMessages}</Text>
            </View>
        </View> : this.canShowDates ? (
            this.canShowChanges ? (
                this.calendar()
            ) : (
                    <View
                        style={this.statesContainer}
                    >
                        <MessageState
                            sent={this.message.sent}
                            color={ColorList.bodyBackground}
                            seen={this.seen}
                            received={this.received}
                        ></MessageState>
                        {this.calendar()}
                    </View>
                )
        ) : null;
    }
    render() {
        this.message =
            (stores.Messages.messages &&
                stores.Messages.messages[this.props.id] &&
                stores.Messages.messages[this.props.id][0]) ||
            {};
        this.change =
            (stores.ChangeLogs.changes &&
                stores.ChangeLogs.changes[this.props.id] &&
                stores.ChangeLogs.changes[this.props.id][0]) ||
            {};
        this.canShowDates = this.message.created_at || this.change.date;
        this.canShowChanges =
            (this.change.date && this.message.created_at &&
                moment(this.message.created_at).format("x") <=
                moment(this.change.date).format("x")) ||
            (!this.message.created_at && this.change.date);
        this.created_at = this.canShowChanges

            ? this.change.date
            : this.message.created_at;
        this.unreadMessages = stores.States.getNewMessagesCount(this.props.id)
        return this.canShowDates ? (
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    {this.canShowChanges
                        ? this.writeLatestUpdate()
                        : this.choseMessages()}
                </View>
                {this.writeStates()}
            </View>
        ) : (
                this.sayNoUpdatedYet()
            );
    }
}

export default LatestMessage;
