/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import CacheImages from "../../../CacheImages";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import stores from "../../../../stores";
import Icon from "react-native-vector-icons/FontAwesome";
import ProfileModal from "../../invitations/components/ProfileModal";
import testForURL from "../../../../services/testForURL";
import GState from "../../../../stores/globalState/index";
import Highlighter from "react-native-highlight-words";
import ColorList from "../../../colorList";
import BeComponent from "../../../BeComponent";

export default class ProfileSimple extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      invite: false,
    };
    this.url.uri = this.props.profile.profile
    this.showProfile = this.showProfile.bind(this);
    this.showInivte = this.showInivte.bind(this);
    this.closeProfileModal = this.closeProfileModal.bind(this);
  }
  showProfile() {
    requestAnimationFrame(() => {
      GState.showingProfile = true;
      this.setStatePure({ isModalOpened: true });
      setTimeout(() => {
        GState.showingProfile = false;
      }, 50);
    });
  }
  showInivte() {
    requestAnimationFrame(() => {
      this.setStatePure({ invite: true });
    });
  }
  url = {
    //uri: this.props.profile.profile,
  };
  closeProfileModal() {
    this.setStatePure({ isModalOpened: false });
  }
  showingProfile = false;
  render() {
    return (
      <View style={styles.mainContainer}>
        {!this.props.hidePhoto && (
          <View style={styles.containerSub}>
            {this.props.profile &&
            this.props.profile.profile &&
            testForURL(this.props.profile.profile) ? (
              <TouchableWithoutFeedback onPress={this.showProfile}>
                <CacheImages
                  staySmall
                  small
                  thumbnails
                  {...this.props}
                  source={this.url}
                />
              </TouchableWithoutFeedback>
            ) : (
              <Icon style={styles.iconPlaceHolder} name={"user-circle"}></Icon>
            )}
          </View>
        )}

        {this.props.searching ? (
          <View style={styles.textStyles}>
            <Highlighter
              numberOfLines={1}
              ellipsizeMode="tail"
              highlightStyle={styles.light}
              searchWords={[this.props.searchString]}
              style={styles.normal}
              autoEscape={true}
              textToHighlight={this.props.profile.nickname}
            ></Highlighter>
          </View>
        ) : (
          <View style={styles.textStyles}>
            <Text
              ellipsizeMode={"tail"}
              numberOfLines={1}
              style={styles.text}
            >
              {this.props.profile &&
              this.props.profile.phone === stores.LoginStore.user.phone
                ? "You "
                : this.props.profile && this.props.profile.nickname}
            </Text>
            {this.props.profile &&
            this.props.profile.status &&
            this.props.profile.status !== "undefined" ? (
              <Text style={styles.text2}>
                {this.props.profile && this.props.profile.status}
              </Text>
            ) : null}
          </View>
        )}

        {this.props.invite && !this.props.profile.found ? (
          <View style={styles.inviteContainer}>
            <TouchableWithoutFeedback onPress={this.showInvite}>
              <Text style={styles.invite}>invite</Text>
            </TouchableWithoutFeedback>
          </View>
        ) : null}

        {
          <ProfileModal
            isOpen={this.state.isModalOpened}
            hasJoin={this.props.hasJoin}
            isToBeJoint
            joined={this.props.joined}
            parent={this}
            onClosed={this.closeProfileModal}
            profile={this.props.profile}
          ></ProfileModal>
        }
        {/*<Invite isOpen={this.state.invite} onClosed={() => { this.setStatePure({ invite: false }) }} />*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: "4%",
  },
  containerSub: {
    width: "23%",
    paddingLeft: "4%",
  },
  textStyles: {
    width: "77%",
    paddingLeft: "4.6%",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  text: {
    marginBottom: "2%",
    fontWeight: "bold",
    alignSelf: "flex-start",
    color: ColorList.bodyText,
    fontSize: 14,
  },
  text2: {
    fontStyle: "italic",
    alignSelf: "flex-start",
    fontSize: 14,
    color: ColorList.bodySubtext,
  },
  normal: {
    fontSize: 12,
    color: ColorList.bodyIcon,
  },
  light: {
    backgroundColor: ColorList.iconInactive,
    fontWeight: "bold",
    color: ColorList.bodyBackground,
  },
  iconPlaceHolder: {
    color: ColorList.colorArray[Math.floor(Math.random() * 14)],
    fontSize: ColorList.profilePlaceHolderHeight,
  },
  invite: {
    fontWeight: "500",
    color: ColorList.indicatorColor,
  },
  inviteContainer: { width: "17%" },
});
