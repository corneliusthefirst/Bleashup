import React, { Component } from "react";
import { View } from "react-native";
import Like from "../../../currentevents/components/Like";
import { Icon, Text } from "native-base";
import ColorList from "../../../../colorList";
import { TouchableOpacity } from "react-native-gesture-handler";
import SocialTabModal from "./SocialTabModal";
import ActionsMenu from "../../ActionsMenu";
import PickersMenu from "./PickerMenu";

export default class Social extends Component {
    constructor(props) {
        super(props);
        this.state = {
            likesCount: 0,
            commentCount: 0,
            supportCount: 0,
        };
    }
    state = {};
    itemStyle = {
        flex: 1,
        marginBottom: "auto",
        marginTop: "auto",
        alignSelf: "center",
        justifyContent: "center",
    };
    render() {
        return (
            <View style={{ width: "100%", margin: 3 }}>
                <TouchableOpacity
                    onPress={() =>
                        requestAnimationFrame(() =>
                            this.setState({
                                isSocialModalOpened: true,
                            })
                        )
                    }
                    style={{ margin: "1%" }}
                >
                    <Text
                        note
                    >{`${this.state.likesCount} like(s), ${this.state.commentCount} comment(s), ${this.state.supportCount} supports`}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row",justifyContent: 'space-between', }}>
                    <View style={{ flex: 3, flexDirection: "row" }}>
                        <View style={this.itemStyle}>
                            <Like
                                setLikesCount={(count) => {
                                    this.setState({
                                        likesCount: this.state.likesCount + count,
                                    });
                                }}
                                id={this.props.id}
                            ></Like>
                        </View>
                        <View style={this.itemStyle}>
                            <Icon style={{color:ColorList.headerIcon,fontSize: 18,}} type={"FontAwesome"} name={"comment"}>
                        </Icon>
                        </View>
                        <View style={this.itemStyle}>
                            <Icon style={{ color: ColorList.headerIcon, fontSize: 18, }} type={"FontAwesome"} name={"support"}>
                            </Icon>
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={this.itemStyle}>
                            <PickersMenu
                                icon={{ name: "reply", type: "Entypo" }}
                                menu={[
                                    {
                                        title: "Mention in a committee ",
                                        callback: () => this.props.reply && this.props.reply(),
                                        condition: true,
                                    },
                                    {
                                        title: "Mention to a member",
                                        callback: () =>
                                            this.props.replyPrivately && this.props.replyPrivately(),
                                        condition: true,
                                    },
                                ]}
                            ></PickersMenu>
                        </View>
                        <View style={this.itemStyle}>
                            <PickersMenu
                                icon={{
                                    type: "Ionicons",
                                    name: "md-share-alt",
                                }}
                                menu={[
                                    {
                                        title: "Share with a Relation",
                                        callback: () =>
                                            this.props.shareWithARelation &&
                                            this.props.shareWithARelation(),
                                        condition: true,
                                    },
                                    {
                                        title: "Share whith your Contacts only",
                                        callback: () =>
                                            this.props.shareWithContacts &&
                                            this.props.shareWithContacts(),
                                        condition: true,
                                    },
                                    {
                                        title: "Share with your Followers",
                                        callback: () =>
                                            this.props.shareWithFollowers &&
                                            this.props.shareWithFollowers(),
                                        condition: true,
                                    },
                                ]}
                            ></PickersMenu>
                        </View>
                    </View>
                </View>
                <SocialTabModal
                    id={this.props.id}
                    isOpen={this.state.isSocialModalOpened}
                    closed={() => {
                        this.setState({
                            isSocialModalOpened: false,
                        });
                    }}
                ></SocialTabModal>
            </View>
        );
    }
}
