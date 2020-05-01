import React, { Component } from "react";
import { View } from "react-native";
import Like from "../../../currentevents/components/Like";
import { Icon, Text } from "native-base";
import ColorList from "../../../../colorList";
import { TouchableOpacity } from "react-native-gesture-handler";
import SocialTabModal from "./SocialTabModal";
import ActionsMenu from "../../ActionsMenu";
import PickersMenu from "./PickerMenu";
import Comments from "./Comment";

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
        width:'33.33%',
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
                    >{`${isNaN(this.state.likesCount)?0:this.state.likesCount} like(s), ${this.state.commentCount} comment(s), ${this.state.supportCount} supports`}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", }}>
                    <View style={{ width:"60%", flexDirection: "row",alignSelf: 'center',justifyContent: 'space-between', }}>
                        <View style={{...this.itemStyle,width:'20%'}}>
                            <Like
                            icon={{ 
                                    type:"AntDesign",
                                    name:'hearto'
                             }}
                             size={25}
                             likedColor={ColorList.heartColor}
                                setLikesCount={(count) => {
                                    this.setState({
                                        likesCount: count,
                                    });
                                }}
                                id={this.props.id}
                            ></Like>
                        </View>
                        <View style={this.itemStyle}>
                        <Comments
                        activity_id={this.props.activity_id}
                        activity_name={this.props.activity_name}
                        title={this.props.title}
                        creator={this.props.creator}
                        setCommentsCount={(val) => {
                            this.setState({
                                commentCount:val
                            })
                        }} id={this.props.id}></Comments>
                        </View>
                        <View style={this.itemStyle}>
                            <View style={{ flexDirection:"row",justifyContent:"center"}}>
                                <Icon style={{ color: ColorList.headerIcon, fontSize: 22, }} type={"FontAwesome"} name={"support"}>
                            </Icon>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            width:"25%",
                            flexDirection: "row",
                            alignSelf: 'flex-end',
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
                                    type: "MaterialCommunityIcons",
                                    name: "share-outline",
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
