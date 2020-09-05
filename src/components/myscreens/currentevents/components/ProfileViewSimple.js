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
import Highlighter from "react-native-highlight-words";
import ColorList from "../../../colorList";
import BeComponent from "../../../BeComponent";
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import emitter from "../../../../services/eventEmiter";
import { sayTyping } from '../../eventChat/services';
import { typing } from "../../../../meta/events";
import { observer } from "mobx-react";
import BePureComponent from '../../../BePureComponent';

@observer class ProfileSimple extends BePureComponent {
  constructor(props) {
    super(props);
    this.state = {
      invite: false,
    };
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
  
  componentMounting(){
    emitter.on(typing(this.props.profile.phone),(typer) => {
      !this.sayTyping ? this.sayTyping = sayTyping.bind(this):null 
      this.sayTyping(typer)
    })
  }
  showTyper(){
    return this.state.typing && <Text style={[GState.defaultTextStyle,
      {color:ColorList.indicatorColor,fontSize: 12,
      }]}>{`typing ...`}</Text>
  }
  closeProfileModal() {
    this.setStatePure({ isModalOpened: false });
  }
  showingProfile = false;
  render() {
    let user = this.props.profile && { ...this.props.profile,
      ...stores.TemporalUsersStore.Users[this.props.profile.phone]}
    return (
      <View style={styles.mainContainer}>
        {!this.props.hidePhoto && (
          <View style={styles.containerSub}>
            {user &&
            user.profile &&
            testForURL(user.profile) ? (
              <TouchableWithoutFeedback onPress={this.showProfile}>
                <CacheImages
                  staySmall
                  small
                  thumbnails
                  {...this.props}
                  source={{ uri:user.profile }}
                />
              </TouchableWithoutFeedback>
            ) : (
              <FontAwesome style={styles.iconPlaceHolder} name={"user-circle"}></FontAwesome>
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
              textToHighlight={user.nickname}
            ></Highlighter>
            {this.showTyper()}
          </View>
        ) : (
          <TouchableOpacity onPress={this.showProfile} style={styles.textStyles}>
            <Text
              ellipsizeMode={"tail"}
              numberOfLines={1}
              style={styles.text}
            >
              {user &&
              user.phone === stores.LoginStore.user.phone
                ? "You "
                : user && user.nickname}
            </Text>
            {this.showTyper()}
          </TouchableOpacity>
        )}

        {this.props.invite && !user.found ? (
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
            profile={user}
          ></ProfileModal>
        }
      </View>
    );
  }
}

export default ProfileSimple

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
