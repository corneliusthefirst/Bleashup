/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import ProfileSimple from "../components/myscreens/currentevents/components/ProfileViewSimple";
import stores from "../stores/index";
import BeNavigator from "../services/navigationServices";
import BeComponent from "./BeComponent";
import Toaster from "../services/Toaster";
import Texts from '../meta/text';
import GState from '../stores/globalState/index';
import { observer } from "mobx-react";
import ActivityPages from './myscreens/eventChat/chatPages';

export default class RelationProfile extends BeComponent {
  constructor(props) {
    super(props);
    this.navigateToRelation = this.navigateToRelation.bind(this);
  }
  gotoRelation(){
    requestAnimationFrame(() =>
      BeNavigator.navigateToActivity(ActivityPages.chat, this.props.Event)
    );
  }
  
  navigateToRelation() {
    if(this.user){
     this.gotoRelation()
    }else{
      stores.TemporalUsersStore.getUser(this.oponent).then((user) => {
        
       user && !user.response ? this.gotoRelation():GState.considerIvite()
      }).catch(() => {
        GState.considerIvite()
      })
    }
  }
  render() {
    this.oponent = this.props.Event.participant.find(
      (ele) => ele && ele.phone !== stores.LoginStore.user.phone
    ).phone
    this.user = stores.TemporalUsersStore.Users[this.oponent]
    return (
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
          {
            <TouchableOpacity
              onPress={this.navigateToRelation}
              style={styles.profileContainer}
            >
              <ProfileSimple
                id={this.props.Event.id}
                members={this.props.Event.participant}
                navigate
                searchString={this.props.searchString}
                onPress={this.props.showPhoto}
                profile={this.user}
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
    flex: 1,
  },
  profile: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
});
