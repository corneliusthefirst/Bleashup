import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import stores from "../../../../stores";
import { find } from "lodash";
import Highlighter from "react-native-highlight-words";
import BeNavigator from "../../../../services/navigationServices";
import ColorList from "../../../colorList";
export default class TitleView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetailsModalOpened: false,
      isJoining: false,
    };
    this.goToEventDetails = this.goToEventDetails.bind(this);
  }
  componentDidMount() {}
  navigateToEventDetails() {
    stores.Events.isParticipant(
      this.props.Event.id,
      stores.Session.SessionStore.phone
    ).then((status) => {
      if (status) {
        BeNavigator.navigateToActivity(
          "EventChat",
          find(stores.Events.events, { id: this.props.Event.id })
        );
      } else {
        this.props.openDetail && this.props.openDetail();
      }
      this.props.seen && this.props.seen();
    });
  }
  goToEventDetails() {
    requestAnimationFrame(() => {
      this.navigateToEventDetails();
    });
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.subContainer}
          onPress={this.goToEventDetails}
        >
          <View style={styles.titleContainer}>
            {this.props.searching ? (
              <Highlighter
                numberOfLines={1}
                ellipsizeMode="tail"
                searchWords={[this.props.searchString]}
                autoEscape={true}
                textToHighlight={this.props.Event.about.title}
                highlightStyle={styles.highlightStyle}
              ></Highlighter>
            ) : (
              <Text
                adjustsFontSizeToFit={true}
                ellipsizeMode={"tail"}
                numberOfLines={1}
                style={styles.titleTextStyles}
              >
                {this.props.Event.about.title}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, marginTop: "2.5%" },
  subContainer: {
    height: "100%",
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
