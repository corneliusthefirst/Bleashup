/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import ProfileSimple from "../components/myscreens/currentevents/components/ProfileViewSimple";
import stores from "../stores/index";
import BeNavigator from "../services/navigationServices";
import BeComponent from "./BeComponent";

export default class RelationProfile extends BeComponent {
  constructor(props) {
    super(props);
    this.navigateToRelation = this.navigateToRelation.bind(this);
  }
  navigateToRelation() {
    requestAnimationFrame(() =>
      BeNavigator.navigateToActivity("EventChat", this.props.Event)
    );
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          {
            <TouchableOpacity
              onPress={this.navigateToRelation}
              style={styles.profileContainer}
            >
              <ProfileSimple
                showPhoto={this.props.showPhoto}
                profile={
                  stores.TemporalUsersStore.Users[
                    this.props.Event.participant.find(
                      (ele) => ele.phone !== stores.LoginStore.user.phone
                    ).phone
                  ]
                }
                relation
                style={styles.profile}
              />
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: 2,
    paddingTop: 2,
    borderRadius: 5,
    width: "100%",
  },
  subContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    width: "65%",
  },
  profile: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
});
