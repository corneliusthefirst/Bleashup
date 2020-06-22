import React, { Component ,PureComponent} from "react";
import {
  Card,
  CardItem,
  Icon,
  Label,
  Title,
  Input,
  Left,
  Right,
  Button,
  Thumbnail,
} from "native-base";

import { View, TouchableOpacity, Dimensions, Text } from "react-native";
import Modal from "react-native-modalbox";
import autobind from "autobind-decorator";
import moment from "moment";
import { isEqual } from "lodash";
//import EventHighlights from "./EventHighlights"
import BleashupAlert from "./BleashupAlert";
import testForURL from "../../../../../services/testForURL";
import CacheImages from "../../../../CacheImages";
import shadower from "../../../../shadower";
import PostMenu from "./PostMenu";
import ColorList from "../../../../colorList";
import buttoner from "../../../../../services/buttoner";
import MedaiView from "./MediaView";
import Social from "./Social";

let { height, width } = Dimensions.get("window");

export default class HighlightCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      deleting: false,
      mounted: false,
      isOpen: false,
      check: false,
      master:
        this.props.participant.master == false
          ? this.props.participant.master
          : true,
    };
  }

  @autobind
  update() {
    //new highlight update when event is not yet created but highlight already created
    this.props.parentComponent.state.currentHighlight = this.props.item;
    this.props.parentComponent.setState({ update: true });
  }
  /*shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      this.state.mounted !== nextState.mounted ||
      this.props.item.title !== nextProps.item.title ||
      this.props.item.description !== nextProps.item.description || 
      !isEqual(this.props.item.url, nextProps.item.url) || 
      this.props.computedMaster !== nextProps.computedMaster
    );
  }*/
  containsMedia() {
    return this.props.item.url.video ||
      this.props.item.url.audio ||
      this.props.item.url.photo
      ? true
      : false;
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        mounted: true,
        creator: this.props.computedMaster, //this.props.item.creator === this.props.phone
      });
    }, 50 * this.props.delay);
  }

  render() {
    return this.state.mounted ? (
      <View
        style={{
          width: ColorList.containerWidth,
          alignSelf: "center",
          ...(!this.props.shadowless && shadower(1)),
          justifyContent: "center",
          marginTop: "1%",
          borderBottomWidth: 0.5,
          borderColor: "ivory",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "97%",
            justifyContent: "space-between",
            marginTop: 2,
            marginBottom: 2,
            height: ColorList.containerHeight / 20,
            alignSelf: "center",
          }}
        >
          <View style={{ maxWidth: "100%" }}>
            <Title
              style={{
                fontSize: 14,
                color: ColorList.headerBlackText,
                fontWeight: "bold",
                marginTop: "10%",
              }}
            >
              {this.props.item.title ? this.props.item.title : ""}
            </Title>
          </View>
          <View>
            {this.state.creator ? (
              <View
                style={{ alignSelf: "flex-end", justifyContent: "flex-end" }}
              >
                <PostMenu
                  creator={this.state.creator}
                  mention={() => this.props.mention(this.props.item)}
                  delete={() => this.props.deleteHighlight(this.props.item)}
                  update={() => this.props.update(this.props.item.id)}
                  master={this.props.participant.master}
                ></PostMenu>
              </View>
            ) : null}
          </View>
        </View>
        <MedaiView
          width={ColorList.containerWidth}
          height={this.props.height}
          showItem={() => this.props.showItem(this.props.item)}
          url={this.props.item.url}
        ></MedaiView>

        <TouchableOpacity
          onPress={() =>
            requestAnimationFrame(() => this.props.showItem(this.props.item))
          }
          style={{
            height: this.containsMedia() ? height / 18 : height / 6,
            margin: "1%",
          }}
        >
          <Text
            ellipsizeMode="tail"
            style={{ fontSize: 12 }}
            numberOfLines={this.containsMedia() ? 3 : 13}
          >
            {this.props.item.description ? this.props.item.description : null}
          </Text>
        </TouchableOpacity>

        <View
          style={{ width: "90%", alignSelf: "center", alignItems: "center" }}
        > 
        {/*<Social
            title={this.props.item.title}
            activity_name={this.props.activity_name}
            creator={this.props.item.creator}
            activity_id={this.props.activity_id}
            id={this.props.item.id}
          ></Social>*/}
        </View>
      </View>
    ) : (
      <View
        style={{
          width: ColorList.containerWidth,
          height: "100%",
          ...(!this.props.shadowless && shadower(1)),
        }}
      ></View>
    );
  }
}
