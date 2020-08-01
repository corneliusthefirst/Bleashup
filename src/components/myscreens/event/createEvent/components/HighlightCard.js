import React, { Component ,PureComponent} from "react";
import { View, Dimensions, Text, TouchableOpacity } from "react-native";
import testForURL from "../../../../../services/testForURL";
import shadower from "../../../../shadower";
import ColorList from "../../../../colorList";
import MedaiView from "./MediaView";
import Social from "./Social";
import Swipeout from '../../../eventChat/Swipeout';
import BePureComponent from '../../../../BePureComponent';
import GState from "../../../../../stores/globalState";

let { height, width } = Dimensions.get("window");

export default class HighlightCard extends BePureComponent {
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

  containsMedia() {
    return this.props.item.url.video ||
      this.props.item.url.audio ||
      this.props.item.url.photo
      ? true
      : false;
  }

  componentDidMount() {
    setTimeout(() => {
      this.setStatePure({
        mounted: true,
        creator: this.props.computedMaster, //this.props.item.creator === this.props.phone
      });
    }, 50 * this.props.delay);
  }

  render() {
    return this.state.mounted ? (
      <Swipeout disabled onLongPress={this.props.showActions} swipeLeft={() => { }} swipeRight={() => {
        this.props.mention(this.props.item)
      }}>
      <View
          onLayout={(e) => {
            this.props.onLayout(e.nativeEvent.layout)}
          }
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
            <Text
              style={{
                ...GState.defaultTextStyle,
                fontSize: 14,
                color: ColorList.headerBlackText,
                fontWeight: "bold",
                //marginTop: "10%",
              }}
            >
              {this.props.item.title ? this.props.item.title : ""}
            </Text>
          </View>
          <View>
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
            style={{ ...GState.defaultTextStyle, fontSize: 12 }}
            numberOfLines={this.containsMedia() ? 3 : 13}
          >
            {this.props.item.description ? this.props.item.description : null}
          </Text>
        </TouchableOpacity>

        <View
          style={{ width: "90%", alignSelf: "center", alignItems: "center" }}
        > 
        <Social
            title={this.props.item.title}
            activity_name={this.props.activity_name}
            creator={this.props.item.creator}
            activity_id={this.props.activity_id}
            id={this.props.item.id}
          ></Social>
        </View>
      </View>
      </Swipeout>
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
