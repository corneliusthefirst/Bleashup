import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from "react-native";
import { Text, Icon, Thumbnail } from "native-base";
import Image from "react-native-scalable-image";
import CacheImages from "../../CacheImages";
import moment from "moment";
import converToHMS from "../highlights_details/convertToHMS";
import shadower from "../../shadower";
import testForURL from "../../../services/testForURL";
import ProfileModal from "../invitations/components/ProfileModal";
import buttoner from "../../../services/buttoner";
import ColorList from "../../colorList";
import TextContent from "./TextContent";
import replies from "./reply_extern";
import rounder from '../../../services/rounder';
let stores = null;
export default class ReplyText extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  state = {};
  showReplyer() {
    this.props.showProfile(
      this.props.reply.replyer_phone ||
      this.props.reply.sender.phone.replace("+", "00")
    );
  }
  reply_font = 10;
  renderReplyIcon(type) {
  return type ? (
      type === replies.posts ? (
        <Icon
          name={"star"}
          type={"AntDesign"}
          style={{
            fontSize: this.reply_font,
            color: ColorList.post,
          }}
        ></Icon>
      ) : type === replies.reminds ? (
        <Icon
          name={"bell"}
          type={"Entypo"}
          style={{
            fontSize: this.reply_font,
            color: ColorList.reminds,
          }}
        ></Icon>
      ) : type === replies.votes ? (
        <Icon
          name={"vote-yea"}
          type={"FontAwesome5"}
          style={{
            fontSize: this.reply_font,
            color: ColorList.vote,
          }}
        ></Icon>
      ) : (
              <Icon
                name={"history"}
                type={"MaterialIcons"}
                style={{
                  fontSize: this.reply_font,
                  color: ColorList.darkGrayText,
                }}
              ></Icon>
            )
    ) : (
        <Icon
          name={"chat-bubble"}
          type={"MaterialIcons"}
          style={{
            color: ColorList.bodyIcon,
            fontSize: this.reply_font,
          }}
        ></Icon>
      );
  }
  handleReply(){
     this.props.openReply(this.props.reply);
  }
  render() {
    return (
      <TouchableWithoutFeedback
        onLongPress={() =>
          this.props.handLongPress ? this.props.handLongPress() : null
        }
        onPress={() => requestAnimationFrame(() => this.props.openReply(this.props.reply))}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottomWidth: 0,
            backgroundColor: ColorList.replyBackground,
            padding: "1%", //margin: '1%',
            minHeight: 50,
            maxHeight: 350,
            minWidth: 100,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}
        >
          <View
            style={{
              /* width: "90%",*/ width: this.props.compose ? "100%" : null,
            }}
          >
            <View style={{ margin: "1%",minWidth: 100, }}>
                <View style={{ flexDirection: "column" }}>
                  {this.props.reply.forwarded ? (
                    <Text style={{ fontSize: 10, fontStyle: "italic" }} note>
                      {"(forwarded)"}
                    </Text>
                  ) : null}
                  <View style={{ flexDirection: "row" }}>
                    <View style={{width:13,justifyContent: 'flex-start',flexDirection: 'row',
                    marginBottom: 'auto',
                    marginTop: 'auto',}}>
                    {this.renderReplyIcon(this.props.reply.type_extern)}</View>
                    <View style={{width:"93%"}}>
                      <Text
                        note
                        ellipsizeMode={"tail"}
                        numberOfLines={1}
                        style={{
                          fontWeight: "bold",
                          color: ColorList.indicatorColor,
                          maxWidth: "90%",
                        }}
                      >
                        {`${
                          this.props.reply.replyer_name
                            ? this.props.reply.replyer_name
                            : this.props.reply.type_extern
                          }`}
                      </Text>
                    </View>
                  </View>
                  {this.props.reply.type_extern ? (
                    <View
                      style={{
                        flexDirection: "row",
                        minWidth: "75%",
                        maxWidth: "90%",
                      }}
                    >
                      <Text
                        ellipsizeMode={"tail"}
                        numberOfLines={3}
                        style={{
                          fontWeight: "bold",
                          fontSize: 12,
                          width: "100%",
                        }}
                      >{`${
                        this.props.reply.replyer_name
                          ? this.props.reply.type_extern
                          : this.props.reply.title.split(": \n")[0]
                        }`}</Text>
                    </View>
                  ) : null}
                </View>
              <View></View>
              {this.props.reply.audio || this.props.reply.file ? (
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Icon
                    type={
                      this.props.reply.audio
                        ? "MaterialIcons"
                        : "MaterialCommunityIcons"
                    }
                    name={
                      this.props.reply.audio
                        ? "audiotrack"
                        : "file-document-box"
                    }
                    style={{ width: "14%", color: ColorList.indicatorColor }}
                  ></Icon>
                  {this.props.reply.type_extern && this.props.reply.audio ? (
                    <Text
                      ellipsizeMode={"tail"}
                      numberOfLines={4}
                      style={{
                        fontWeight: "bold",
                        fontSize: 12,
                        color: "#1F4237",
                        width: "83%",
                      }}
                    >
                      {this.props.reply.replyer_name
                        ? this.props.reply.title
                        : this.props.reply.title.split(": \n")[1]}
                    </Text>
                  ) : (
                      <View
                        style={{
                          marginTop: this.props.reply.audio ? "2%" : "0%",
                          width: "83%",
                        }}
                      >
                        {this.props.reply.audio ? (
                          <Text ellipsizeMode={"tail"} numberOfLines={1}>
                            {(this.props.reply.url &&
                              this.props.reply.url.duration) ||
                              this.props.reply.duration
                              ? converToHMS(
                                this.props.reply.type_extern === "Posts"
                                  ? this.props.reply.url.duration
                                  : this.props.reply.duration
                              )
                              : null}
                          </Text>
                        ) : (
                            <Text
                              ellipsizeMode={"tail"}
                              numberOfLines={1}
                              style={{ fontSize: 30 }}
                            >
                              {"."}
                              {this.props.reply.typer.toUpperCase()}
                            </Text>
                          )}
                      </View>
                    )}
                </View>
              ) : (
                  <View>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      {this.props.reply.sourcer ? (
                      <View
                        style={{
                        /*width: this.props.reply.sourcer ? "20%" : "0%",*/ marginRight:
                            "1%",
                        }}
                      >
                          <View>
                              <CacheImages
                                staySmall
                                thumbnails
                                square
                                style={{
                                  width: 70,
                                  minHeight:
                                    this.state.currentHeight > 50
                                      ? this.state.currentHeight
                                      : 60,
                                  maxHeight:
                                    this.state.currentHeight > 50
                                      ? this.state.currentHeight
                                      : 60,
                                  borderBottomRightRadius: 5,
                                  borderTopRightRadius: 5,
                                }}
                                source={{ uri: this.props.reply.sourcer }}
                              ></CacheImages>
                          </View>
                          {this.props.reply.video ? (
                            <View
                              style={{
                                ...rounder(30, ColorList.buttonerBackground),
                                position: 'absolute',
                                marginBottom: this.state.currentHeight/2 || 60,
                                marginTop: this.state.currentHeight/2  || 60,
                                marginLeft: 20,
                              }}
                            >
                              <Icon
                                type={"EvilIcons"}
                                name={"play"}
                                style={{
                                  alignSelf: 'center',
                                  color: ColorList.bodyBackground,
                                }}
                              ></Icon>
                            </View>) : null}
                      </View>
                      ) : null}
                      <View
                        onLayout={(e) => {
                          this.setState({
                            currentHeight: e.nativeEvent.layout.height,
                          });
                        }}
                        style={{
                          alignSelf:"flex-end",
                          marginLeft: this.props.reply.sourcer ? "1%" : null,
                          width: this.props.reply.sourcer ? "74%" : "94%",
                        }}
                      >
                        {this.props.reply.title ? (
                          <TextContent
                            onPress={() => this.props.openReply(this.props.reply)}
                            handleLongPress={this.props.handLongPress}
                            pressingIn={() => this.props.pressingIn()}
                            tags={this.props.reply.tags}
                            ellipsizeMode="tail"
                            numberOfLines={
                              this.props.reply.sourcer
                                ? this.props.reply.replyer_name
                                  ? 13
                                  : 15
                                : 15
                            }
                            style={{ fontSize: 12, color: "#1F4237" }}
                            text={
                              this.props.reply.replyer_name
                                ? this.props.reply.title
                                : this.props.reply.title.split(": \n")[1]
                            }
                          ></TextContent>
                        ) : this.props.reply.text ? (
                          <TextContent
                            onPress={() => this.props.openReply(this.props.reply)}
                            handleLongPress={this.props.handLongPress}
                            pressingIn={() => this.props.pressingIn()}
                            tags={this.props.reply.tags}
                            ellipsizeMode="tail"
                            numberOfLines={
                              this.props.reply.sourcer
                                ? this.props.reply.replyer_name
                                  ? 13
                                  : 14
                                : 14
                            }
                            style={{ fontSize: 12 }}
                            text={this.props.reply.text}
                          ></TextContent>
                        ) : null}
                      </View>
                    </View>
                    {this.props.reply.change_date ? (
                      <Text note>{`On: ${moment(
                        this.props.reply.change_date
                      ).format("dddd, MMMM Do YYYY, h:mm:ss a")}`}</Text>
                    ) : null}
                  </View>
                )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
