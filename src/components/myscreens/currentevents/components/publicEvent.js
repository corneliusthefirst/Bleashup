import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import colorList from "../../../colorList";
import ActivityProfile from "./ActivityProfile";
import GlobalFunctions from "../../../globalFunctions";
import BeNavigator from "../../../../services/navigationServices";
import RelationProfile from "../../../RelationProfile";
import BeComponent from "../../../BeComponent";
import Swipeout from "../../eventChat/Swipeout";

let globalFunctions = GlobalFunctions;
class PublicEvent extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMount: true,
      joint: true,
      swipeClosed: true,
      master: false,
    };
  }
  shouldComponentUpdate(nextState, nextProps) {
    const shouldUpdate =
      !this.props.Event ||
      !nextProps.Event ||
      this.props.Event.background !== nextProps.Event.background ||
      this.props.Event.about.title !== nextProps.Event.about.title;
    if (shouldUpdate) {
      this.props.animate && this.props.animate();
    }
    return shouldUpdate;
  }
  renderprofile() {
    return (
      <View style={this.profileContainer}>
        <Swipeout
          disabled={true}
          onLongPress={() => {
            this.props.onLongPress && this.props.onLongPress(this.props.Event);
          }}
        >
          <RelationProfile
            searchString={this.props.searchString}
            Event={this.props.Event}
          />
        </Swipeout>
      </View>
    );
  }

  renderTitle() {
    return (
      <View style={styles.mainContainer}>
        <Swipeout
          disabled={true}
          onLongPress={() => {
            this.props.onLongPress && this.props.onLongPress(this.props.Event);
          }}
        >
          <View style={styles.subContainer}>
            <View style={styles.profileContainer}>
              <ActivityProfile
                navigate
                searchString={this.props.searchString}
                dim={50}
                showPhoto={this.props.showPhoto}
                openDetails={this.props.openDetails}
                Event={this.props.Event || {}}
              ></ActivityProfile>
            </View>
          </View>
        </Swipeout>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.renderContainer}>
        <View style={styles.renderSubContainer}>{this.renderTitle()}</View>
        <View style={styles.separator}></View>
      </View>
    );
  }
}
export default PublicEvent;

const styles = StyleSheet.create({
  renderContainer: {
    backgroundColor: colorList.bodyBackground,
    width: colorList.containerWidth,
    alignSelf: "center",
  },
  renderSubContainer: {
    backgroundColor: colorList.bodyBackground,
    width: "100%",
    alignSelf: "center",
  },
  separator: {
    height: 2,
    marginHorizontal: "5%",
    borderRadius: 5,
    backgroundColor: colorList.bodyIcondark,
  },
  mainContainer: {
    marginBottom: "2%",
    backgroundColor: colorList.bodyBackground,
    width: "100%",
    flexDirection: "row",
  },
  subContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginLeft: "2%",
  },
  profileContainer: {
    width: "98%",
  },
  placeHolder: {
    height: 120,
    alignSelf: "center",
    backgroundColor: colorList.bodyBackground,
    width: "100%",
  },
});
