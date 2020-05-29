import React, { PureComponent } from "react";
import {
    Text,
    Badge,
    Icon,
    Label,
    Spinner,
    Toast,
    Thumbnail,
    Title,
} from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import stores from "../../../stores";
import { View, TouchableWithoutFeedback } from "react-native";
import { find, isEqual } from "lodash";
import EditNameModal from "./EditNameModal";
import emitter from "../../../services/eventEmiter";
import { observer } from "mobx-react";
import GState from "../../../stores/globalState";
import firebase from "react-native-firebase";
import Image from "react-native-scalable-image";
import CacheImages from "../../CacheImages";
import ChatStore from "../../../stores/ChatStore";
import testForURL from "../../../services/testForURL";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import shadower from "../../shadower";
import ColorList from "../../colorList";
import convertToHMS from "../highlights_details/convertToHMS";
import TextContent from "../eventChat/TextContent";

export default class CommiteeItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            isEditNameModelOpened: false,
        };
    }
    state = {};
    /*shouldComponentUpdate(nextProps, nextState, nextContext) {
          console.warn("updated ats",this.props.commitee.updated_at,nextProps.commitee.updated_at)
          return this.props.commitee.updated_at !== nextProps.commitee.updated_at 
               || this.state.loaded !== nextState.loaded
      }*/
    componentDidUpdate() {
        this.calculateCommittee();
    }
    componentDidMount() {
        setTimeout(() => {
            this.calculateCommittee();
        });
    }
    calculateCommittee() {
        let member =
            this.props.commitee &&
            this.props.commitee.member &&
            find(
                this.props.commitee.member,
                (ele) => ele !== null && ele.phone === this.props.phone
            );
        (this.master = member ? this.props.computedMaster : false),
            (this.joint = member ? true : false);
        this.setState({
            loaded: true,
        });
    }
    revertName() {
        // console.warn("edit failed message recieved!!")
        this.setState({
            newThing: !this.state.newThing,
        });
        this.swap();
    }
    publish() {
        this.props.publishCommitee(
            this.props.commitee.id,
            !this.props.commitee.public_state
        );
        /*emitter.once('published', state => {
                this.setState({
                    newThing: !this.state.newThing
                })
            })*/
    }
    join() {
        return new Promise((resolve, reject) => {
            if (this.props.commitee.public_state && !this.joint) {
                this.props.join(this.props.commitee.id);
                emitter.on("joint", () => {
                    this.setState({
                        joint: true,
                    });
                    resolve();
                    //this._accordion.setSelected(-1);
                });
            } else {
                Toast.show({
                    text: "Cannot join this commitee; It is not opened to you",
                });
                reject();
            }
        });
    }
    leave() {
        if (this.joint) {
            this.props.leave(this.props.commitee.id);
            emitter.on("left", () => {
                this.setState({
                    left: true,
                });
            });
        }
    }
    addMembers() {
        this.props.addMembers(this.props.commitee.id, this.props.commitee.member);
    }
    removeCommitee() {
        this.props.removeMember(this.props.commitee.id, this.props.commitee.member);
    }
    editName(newName) {
        /*this.previousName = this.props.commitee.name
            this.setState({
                commitee: { ...this.props.commitee, name: newName },
                isEditNameModelOpened: false,
                newThing: !this.state.newThing
            })*/
        this.props.editName(newName, this.props.commitee.id);
        /*emitter.once("edit-failed", () => {
                this.revertName()
            })*/
    }
    swap() {
        GState.currentRoomNewMessages = this.props.commitee.new_messages;
        //GState.currentCommitee = this.props.commitee.id
        this.props.swapChats(this.props.commitee);
        //emitter.emit("current_commitee_changed", this.props.id)
        let phone = stores.LoginStore.user.phone.replace("00", "+");
        firebase
            .database()
            .ref(`new_message/${phone}/${this.props.id}/new_messages`)
            .set([]);
        this.setState({
            newThing: !this.state.newThing,
        });
    }
    swappCommitee() {
        if (this.accessible) {
            if (!this.joint) {
                this.join().then(() => {
                    this.swap();
                });
            } else {
                this.swap();
            }
        }
    }
    setActionPercentage() {
        actionsNumber = () => {
            if (
                this.master &&
                this.props.commitee &&
                this.props.commitee.public_state
            ) {
                return 5;
            } else if (
                !this.master &&
                (!this.props.commitee || !this.props.commitee.public_state)
            ) {
                return 1;
            } else if (
                !this.master &&
                this.props.commitee &&
                this.props.commitee.public_state &&
                !this.joint
            ) {
                return 2;
            }
        };
    }
    formNickName(user) {
        return user.phone == stores.LoginStore.user.phone.replace("00", "+")
            ? "You"
            : user.nickname;
    }
    toMB(data) {
        mb = 1000 * 1000;
        return (data / mb).toFixed(2).toString() + "MB";
    }
    writeText(text, tags) {
        return text ? (
            <View>
                <TextContent
                    tags={tags}
                    style={{
                        fontSize: 14,
                        alignSelf: "flex-start",
                        alignItems: "flex-start",
                    }}
                    elipsizeMode={"tail"}
                    text={text}
                    numberOfLines={2}
                ></TextContent>
            </View>
        ) : null;
    }
    writeLatestMessage(message) {
        switch (message.type) {
            case "text":
                return (
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        <View style={{ width: "95%" }}>
                            <Text
                                elipsizeMode={"tail"}
                                numberOfLines={1}
                                style={{
                                    fontWeight: "bold",
                                    fontSize: 16,
                                    color: ColorList.bodyText,
                                    width: "20%",
                                }}
                            >
                                {this.formNickName(message.sender)}
                            </Text>
                        </View>
                        <View style={{ width: "95%", alignSelf: "flex-start" }}>
                            {this.writeText(message.text, message.tags)}
                        </View>
                    </View>
                );
            case "photo":
                return (
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        <Text
                            elipsizeMode={"tail"}
                            numberOfLines={1}
                            style={{
                                fontWeight: "bold",
                                fontSize: 16,
                                color: ColorList.bodyText,
                                width: "95%",
                                alignSelf: "flex-start",
                            }}
                        >
                            {this.formNickName(message.sender)}
                        </Text>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                marginTop: "1%",
                                width: "100%",
                            }}
                        >
                            <View style={{ width: "80%", alignSelf: "flex-start" }}>
                                {this.writeText(message.text, message.tags)}
                            </View>
                            <View
                                style={{
                                    alignSelf: "flex-end",
                                    marginTop: "-8%",
                                    borderRadius: 8,
                                    width: "20%",
                                }}
                            >
                                {testForURL(message.photo) ? (
                                    <CacheImages
                                        source={{ uri: message.photo }}
                                        thumbnails
                                        square
                                        small
                                    ></CacheImages>
                                ) : (
                                        <Thumbnail
                                            style={{ borderRadius: 5 }}
                                            square
                                            small
                                            source={{ uri: message.photo }}
                                        ></Thumbnail>
                                    )}
                            </View>
                        </View>
                    </View>
                );
            case "audio":
                return (
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        <Title
                            style={{
                                fontWeight: "bold",
                                fontSize: 16,
                                color: ColorList.bodyText,
                                alignSelf: "flex-start",
                            }}
                        >
                            {this.formNickName(message.sender)}
                        </Title>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <View style={{
                                marginLeft: "3%",
                                marginTop: "1%",
                                width: "80%",
                            }}>
                                <TextContent
                                    numberOfLines={2}
                                    style={{
                                        fontSize: 14,
                                    }}
                                    tags={message.tags}
                                    text={
                                        message.text
                                            ? message.text
                                            : message.duration
                                                ? convertToHMS(message.duration)
                                                : message.total
                                                    ? this.toMB(message.total)
                                                    : ""
                                    }
                                ></TextContent>
                            </View>
                            <View style={{ alignSelf: "flex-end", marginTop: "-2%" }}>
                                <Icon
                                    type={"Entypo"}
                                    name={"mic"}
                                    style={{ fontSize: 30, color: ColorList.bodyText }}
                                ></Icon>
                            </View>
                        </View>
                    </View>
                );
            case "video":
                return (
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        <Title
                            style={{
                                fontWeight: "bold",
                                fontSize: 16,
                                color: ColorList.bodyText,
                                alignSelf: "flex-start",
                            }}
                        >
                            {this.formNickName(message.sender)}
                        </Title>
                        <View
                            style={{ display: "flex", flexDirection: "row", marginTop: "1%" }}
                        >
                            <View style={{ marginLeft: "0%", width: "80%" }}>
                                <TextContent
                                    numberOfLines={2}
                                    style={{ fontSize: 14, }}
                                    tags={message.tags}
                                    text={
                                        message.text
                                            ? message.text
                                            : message.duration
                                                ? message.duration
                                                : message.total
                                                    ? this.toMB(message.total)
                                                    : ""
                                    }
                                ></TextContent>
                            </View>
                            <View style={{ alignSelf: "flex-end", marginTop: "-2%" }}>
                                <Icon
                                    type={"AntDesign"}
                                    name={"videocamera"}
                                    style={{ fontSize: 30, color: ColorList.bodyText }}
                                ></Icon>
                            </View>
                        </View>
                    </View>
                );
            case "attachement":
                return (
                    <View style={{ display: "flex", flexDirection: "column" }}>
                        <Title
                            style={{
                                fontWeight: "bold",
                                fontSize: 16,
                                color: ColorList.bodyText,
                                alignSelf: "flex-start",
                            }}
                        >
                            {this.formNickName(message.sender)}
                        </Title>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <View style={{
                                marginLeft: "2%", width: "95%"
                            }}>
                                <TextContent
                                    numberOfLines={2}
                                    style={{
                                        fontSize: 14,
                                        alignSelf: "flex-start",
                                        fontWeight: "bold",
                                    }}
                                    tags={message.tags}
                                    text={message.file_name
                                        .split(".")
                                    [message.file_name.split(".").length - 1].toUpperCase()}
                                ></TextContent>
                            </View>
                            <View style={{ alignSelf: "flex-end", marginTop: "-2%" }}>
                                <Icon
                                    type={"Octicons"}
                                    name={"file"}
                                    style={{ fontSize: 30, color: ColorList.bodyText }}
                                ></Icon>
                            </View>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    }
    render() {
        let mainStyles = {
            width: "98%",
            ...shadower(1),
            margin: "1%",
            opacity: this.accessible ? 1 : 0.2,
            borderBottomRightRadius: 5,
            borderTopRightRadius: 5,
            backgroundColor: this.props.ImICurrentCommitee
                ? ColorList.bodyDarkWhite
                : ColorList.bodyBackground,
        };
        this.accessible =
            this.joint || (this.props.commitee && this.props.commitee.public_state);
        return this.state.loaded ? (
            <View
                style={{
                    ...mainStyles,
                }}
            >
                <TouchableOpacity
                    onPress={() =>
                        requestAnimationFrame(() => {
                            if (GState.editingCommiteeName === false) this.swappCommitee();
                        })
                    }
                >
                    <View>
                        <View
                            style={{
                                display: "flex",
                                hieght: 100,
                                width: "100%",
                                flexDirection: "row",
                                marginBottom: "2%",
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{
                                    margin: "1%",
                                    flex: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Text
                                    elipsizeMode={"tail"}
                                    numberOfLines={1}
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 14,
                                        color:
                                            GState.currentCommitee == this.props.commitee.id
                                                ? ColorList.headerIcon
                                                : "gray",
                                    }}
                                >
                                    {this.props.commitee.name}
                                </Text>
                                {this.joint && this.props.commitee.newest_message ? (
                                    <Text note>Latest Message :</Text>
                                ) : null}
                            </View>
                            <View
                                style={{
                                    display: "flex",
                                    margin: "2%",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignSelf: "flex-end",
                                }}
                            >
                                {/*
                                    this.props.commitee &&
                                        this.props.commitee.name &&
                                        this.props.commitee.name.toLowerCase() === "General".toLowerCase() ? null :
                                        this.master ?
                                            <View style={{ marginTop: "-5%", }}>
                                                <TouchableWithoutFeedback onPress={() => {
                                                    GState.editingCommiteeName = true
                                                    requestAnimationFrame(() => {
                                                        this.setState({
                                                            isEditNameModelOpened: true,
                                                            newThing: !this.state.newThing
                                                        })
                                                        setTimeout(() => {
                                                            GState.editingCommiteeName = false
                                                        }, 300)
                                                    })
                                                }}>
                                                    <View><Icon style={{ fontSize: 30, color: ColorList.bodyText }} name="pencil" type="EvilIcons" /></View>
                                                </TouchableWithoutFeedback>
                                            </View> : null*/}
                                {this.joint && this.props.commitee.new_messages ? (
                                    this.props.commitee.new_messages.length > 0 ? (
                                        <Badge
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                            primary
                                        >
                                            <Text
                                                style={{ display: "flex", justifyContent: "center" }}
                                            >
                                                {this.props.commitee.new_messages.length}
                                            </Text>
                                        </Badge>
                                    ) : null
                                ) : null}
                            </View>
                        </View>
                        <View style={{ margin: "2%" }}>
                            {this.joint && this.props.commitee.newest_message
                                ? this.writeLatestMessage(this.props.commitee.newest_message)
                                : null}
                        </View>
                    </View>
                </TouchableOpacity>
                {this.state.isEditNameModelOpened ? (
                    <EditNameModal
                        value={this.props.commitee.name}
                        isOpen={this.state.isEditNameModelOpened}
                        close={() => {
                            this.setState({
                                isEditNameModelOpened: false,
                                newThing: !this.state.newThing,
                            });
                        }}
                        editName={(newName) => {
                            this.editName(newName);
                        }}
                    ></EditNameModal>
                ) : null}
                {
                    //<MenuDivider color="#1FABAB" />
                }
            </View>
        ) : (
                <View
                    style={{
                        ...mainStyles,
                        height: this.props.commitee.newest_message ? 100 : 50,
                    }}
                ></View>
            );
    }
}
