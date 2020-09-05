import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Text
} from "react-native";
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
import BePureComponent from '../../BePureComponent';
import  AntDesign  from 'react-native-vector-icons/AntDesign';
import Entypo  from 'react-native-vector-icons/Entypo';
import  FontAwesome5  from 'react-native-vector-icons/FontAwesome5';
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import GState from "../../../stores/globalState";
export default class ReplyText extends BePureComponent {
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
        <AntDesign
          name={"star"}
          type={"AntDesign"}
          style={{
            fontSize: this.reply_font,
            color: ColorList.post,
          }}
        />
      ) : type === replies.reminds ? (
        <Entypo
          name={"bell"}
          type={"Entypo"}
          style={{
            fontSize: this.reply_font,
            color: ColorList.reminds,
          }}
        />
      ) : type === replies.votes ? (
        <FontAwesome5
          name={"vote-yea"}
          type={"FontAwesome5"}
          style={{
            fontSize: this.reply_font,
            color: ColorList.vote,
          }}
        />
      ) : (
              <MaterialIcons
                name={"history"}
                type={"MaterialIcons"}
                style={{
                  fontSize: this.reply_font,
                  color: ColorList.darkGrayText,
                }}
              />
            )
    ) : null
  }
  handleReply(){
     this.props.openReply(this.props.reply);
  }
  render() {
    return (
      <TouchableWithoutFeedback
        //onLongPress={() =>
        //  this.props.handLongPress ? this.props.handLongPress() : null
       // }
        onPress={() => requestAnimationFrame(() => this.props.openReply(this.props.reply))}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottomWidth: 0,
            backgroundColor: ColorList.replyBackground,
            padding: 2, //margin: '1%',
            minHeight: 50,
            maxWidth:"100%",
            maxHeight: 150,
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
                  <View style={{
                    width: !this.props.reply.type_extern ? 0 : 13,justifyContent: 'flex-start',flexDirection: 'row',
                    marginBottom: 'auto',
                    marginTop: 'auto',}}>
                    {this.renderReplyIcon(this.props.reply.type_extern)}</View>
                  <View style={{ width: !this.props.reply.type_extern ? "100%" : "93%"}}>
                      <Text
                        note
                        ellipsizeMode={"tail"}
                        numberOfLines={1}
                        style={{
                          ...GState.defaultTextStyle,
                          fontWeight: "bold",
                          color: ColorList.indicatorColor,
                          maxWidth: "100%",
                        }}
                      >
                        {`${
                          this.props.reply.replyer_name
                            ? this.props.reply.replyer_name
                        : this.props.reply.title.split(": \n")[0]
                          }`}
                      </Text>
                    </View>
                  </View>
                </View>
              <View></View>
              {this.props.reply.audio || this.props.reply.file ? (
                <View style={{ display: "flex", flexDirection: "row" }}>
                  {this.props.reply.audio ? <MaterialIcons style={{ ...GState.defaultIconSize, 
                    width: "14%", color: ColorList.indicatorColor}} name={"audiotrack"}></MaterialIcons>:
                  <MaterialCommunityIcons
                    name={"file-document-box"}
                    style={{ ...GState.defaultIconSize,
                       width: "14%", color: ColorList.indicatorColor }}
                  ></MaterialCommunityIcons>}
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
                          <Text ellipsizeMode={"tail"} style={{ ...GState.defaultTextStyle }} numberOfLines={1}>
                            {(this.props.reply.url &&
                              this.props.reply.url.duration) ||
                              this.props.reply.duration
                              ? converToHMS(
                                this.props.reply.type_extern === replies.posts
                                  ? this.props.reply.url.duration
                                  : this.props.reply.duration
                              )
                              : null}
                          </Text>
                        ) : (
                            <Text
                              ellipsizeMode={"tail"}
                              numberOfLines={1}
                              style={{...GState.defaultTextStyle, fontSize: 30 }}
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
                            marginTop: 3,
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
                                    this.state.currentHeight > 30
                                      ? this.state.currentHeight
                                      : 40,
                                  maxHeight:
                                    this.state.currentHeight > 30
                                      ? this.state.currentHeight
                                      : 40,
                                  borderBottomRightRadius: 5,
                                  borderTopRightRadius: 5,
                                }}
                                source={{ uri: this.props.reply.sourcer }}
                              ></CacheImages>
                          </View>
                      </View>
                      ) : null}
                      <View
                        onLayout={(e) => {
                          this.setStatePure({
                            currentHeight: e.nativeEvent.layout.height,
                          });
                        }}
                        style={{
                          alignSelf:"flex-end",
                          marginLeft: this.props.reply.sourcer ? ".5%" : null,
                          width: this.props.reply.sourcer ? "74%" : "100%",
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
                                  ? 5
                                  : 5
                                : 7
                            }
                            style={{ fontSize: 12, color: "#1F4237" }}
                            text={
                              this.props.reply.replyer_name
                                ? this.props.reply.title && this.props.reply.title
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
                                  ? 5
                                  : 6
                                : 4
                            }
                            style={{ fontSize: 12 }}
                            text={this.props.reply.text}
                          ></TextContent>
                        ) : null}
                      </View>
                    </View>
                  </View>
                )}
            </View>
            {this.props.reply.change_date ? (
              <Text style={{fontSize: 12,color:ColorList.bodySubtext,fontStyle: 'italic',}}>{`${moment(
                this.props.reply.change_date
              ).calendar()}`}</Text>
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
