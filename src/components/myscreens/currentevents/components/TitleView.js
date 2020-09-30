import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import stores from "../../../../stores";
import { find } from "lodash";
import BeNavigator from "../../../../services/navigationServices";
import ColorList from "../../../colorList";
import BePureComponent from "../../../BePureComponent";
import emitter from "../../../../services/eventEmiter";
import { sayTyping } from "../../eventChat/services";
import GState from "../../../../stores/globalState/index";
import Texts from "../../../../meta/text";
import TextContent from "../../eventChat/TextContent";
import ActivityPages from "../../eventChat/chatPages";
import active_types from "../../eventChat/activity_types";
import ProfileView from "../../invitations/components/ProfileView";
export default class TitleView extends BePureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDetailsModalOpened: false,
      isJoining: false,
    };
    this.goToEventDetails = this.goToEventDetails.bind(this);
  }
  typing_event = `${this.props.Event.id}_typing`;
  componentMounting() {
    emitter.on(this.typing_event, (typer) => {
      !this.sayTyping ? (this.sayTyping = sayTyping.bind(this)) : null;
      this.sayTyping(typer);
    });
  }
  unmountingComponent() {
    emitter.off(this.typing_event);
  }
  componentDidMount() { }
  renderTitleForRelation() {
    let parts = this.props.Event.participant;
    const user_1 = parts[0].phone;
    const user_2 = parts[1].phone;
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ width: "43%" }}>
          <ProfileView hidePhoto phone={user_1}></ProfileView>
        </View>
        <View>
          <Text style={{ ...GState.defaultTextStyle, fontWeight: "bold" }}>
            {" & "}
          </Text>
        </View>
        <View style={{ width: "43%" }}>
          <ProfileView hidePhoto phone={user_2}></ProfileView>
        </View>
      </View>
    );
  }
  navigateToEventDetails() {
    if (this.props.Event.type === active_types.activity) {
      stores.Events.isParticipant(
        this.props.Event.id,
        stores.Session.SessionStore.phone
      ).then((event) => {
        if (event) {
          BeNavigator.pushToChat(event);
        } else {
          this.props.openDetail && this.props.openDetail();
        }
        this.props.seen && this.props.seen();
      });
    }
  }
  goToEventDetails() {
    requestAnimationFrame(() => {
      this.navigateToEventDetails();
    });
  }
  render() {
    let isRelation = this.props.Event.type === active_types.relation;
    return (
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.subContainer}
          onPress={this.props.onPress || this.goToEventDetails}
        >
          {isRelation ? (
            this.renderTitleForRelation()
          ) : (
              <View style={styles.titleContainer}>
                <TextContent
                  onPress={this.props.onPress || this.goToEventDetails}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  searchString={this.props.searchString}
                  style={styles.titleTextStyles}
                  ellipsizeMode="tail"
                >
                  {this.props.Event.about.title}
                </TextContent>
              </View>
            )}
          {this.state.typing && !isRelation && (
            <Text
              style={[
                GState.defaultTextStyle,
                {
                  fontSize: 12,
                  color: ColorList.indicatorColor,
                },
              ]}
            >{`${this.state.typer} is ${Texts.typing}`}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  subContainer: {
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  highlightStyle: {
    backgroundColor: ColorList.iconInactive,
    fontWeight: "bold",
    color: ColorList.bodyBackground,
  },
  titleTextStyles: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
    color: "black",
    fontFamily: "Roboto",
  },
});
