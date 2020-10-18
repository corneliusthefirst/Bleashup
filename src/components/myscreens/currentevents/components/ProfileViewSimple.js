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
import ProfileModal from "../../invitations/components/ProfileModal";
import testForURL from "../../../../services/testForURL";
import GState from "../../../../stores/globalState/index";
import ColorList from "../../../colorList";
import BeComponent from "../../../BeComponent";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import emitter from "../../../../services/eventEmiter";
import { sayTyping } from "../../eventChat/services";
import { typing } from "../../../../meta/events";
import { observer } from "mobx-react";
import BePureComponent from "../../../BePureComponent";
import Texts from "../../../../meta/text";
import TextContent from "../../eventChat/TextContent";
import LatestMessage from "./LatestMessage";

@observer
class ProfileSimple extends BePureComponent {
  constructor(props) {
    super(props);
    this.state = {
      invite: false,
    };
    this.showProfile = this.showProfile.bind(this);
    this.showInvite = this.showInvite.bind(this);
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
  showInvite() {
    this.props.showInvite && this.props.showInvite(this.props.profile);
  }
  typing_event = typing(this.props.profile.phone)
  componentMounting() {
    if (this.props.profile && this.props.navigate) {
      emitter.on(this.typing_event, (typer) => {
        !this.sayTyping ? (this.sayTyping = sayTyping.bind(this)) : null;
        this.sayTyping(typer);
      });
    }
  }
  unmountingComponent() {
    this.props.profile && this.props.navigate && emitter.off(this.typing_event)

  }
  showTyper() {
    return (
      this.state.typing ? (
        <Text
          style={[
            GState.defaultTextStyle,
            {
              color: ColorList.indicatorColor,
              fontSize: 12,
            },
          ]}
        >
          {Texts.typing}
        </Text>
      )
        : this.props.navigate ? <LatestMessage
          id={this.props.id}
          members={this.props.members}>
        </LatestMessage> : null);
  }
  closeProfileModal() {
    this.setStatePure({ isModalOpened: false });
  }
  showingProfile = false;
  render() {
    let user = this.props.profile && {
      ...this.props.profile,
      ...stores.TemporalUsersStore.Users[this.props.profile.phone],
    };
    let userName =
      user && user.phone === stores.LoginStore.user.phone
        ? user.nickname + " (You)"
        : user && user.nickname;
    return (
      <View style={styles.mainContainer}>
        {!this.props.hidePhoto && (
          <View style={styles.containerSub}>
            {user && user.profile && testForURL(user.profile) ? (
              <TouchableWithoutFeedback onPress={this.props.onPress || this.showProfile}>
                <CacheImages
                  staySmall
                  small
                  thumbnails
                  {...this.props}
                  source={{ uri: user.profile }}
                />
              </TouchableWithoutFeedback>
            ) : (
                <FontAwesome
                  style={styles.iconPlaceHolder}
                  name={"user-circle"}
                ></FontAwesome>
              )}
          </View>
        )}
        <TouchableOpacity onPress={this.props.onPress || this.showProfile} style={styles.textStyles}>
          <TextContent
            onPress={this.props.onPress || this.showProfile}
            ellipsizeMode={"tail"}
            numberOfLines={1}
            style={styles.text}
            foundString={this.props.foundString}
            searchString={this.props.searchString}
          >
            {userName}
          </TextContent>
          {this.showTyper()}
        </TouchableOpacity>
        {this.props.invite && !user.found ? (
          <View style={styles.inviteContainer}>
            <TouchableWithoutFeedback onPress={this.showInvite}>
              <Text style={styles.invite}>{Texts.invite}</Text>
            </TouchableWithoutFeedback>
          </View>
        ) : null}
        {this.state.isModalOpened ?
          <ProfileModal
            isOpen={this.state.isModalOpened}
            hasJoin={this.props.hasJoin}
            isToBeJoint
            joined={this.props.joined}
            parent={this}
            onClosed={this.closeProfileModal}
            profile={user}
          ></ProfileModal> : null
        }
      </View>
    );
  }
}

export default ProfileSimple;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  containerSub: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 60,
    marginRight:"2%",
  },
  textStyles: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  text: {
    fontWeight: "bold",
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
    color: ColorList.colorArray[Math.floor(Math.random() * (ColorList.colorArray.length - 1))],
    fontSize: ColorList.profilePlaceHolderHeight,
  },
  invite: {
    fontWeight: "500",
    color: ColorList.indicatorColor,
  },
  inviteContainer: { width: 75 },
});
