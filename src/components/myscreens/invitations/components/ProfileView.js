import React, { Component } from "react";
import CacheImages from "../../../CacheImages";
import { View, TouchableOpacity, Text } from "react-native";

import ImageActivityIndicator from "../../currentevents/components/imageActivityIndicator";
import ProfileIdicator from "../../currentevents/components/ProfilIndicator";
import stores from "../../../../stores";
import ProfileModal from "./ProfileModal";
import testForURL from "../../../../services/testForURL";
import ColorList from "../../../colorList";
import ProfileSimple from "../../currentevents/components/ProfileViewSimple";
import {
  check_user_error_1,
  check_user_error_2,
} from "../../../../stores/temporalUsersStore";
import BeComponent from "../../../BeComponent";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import emitter from "../../../../services/eventEmiter";
import { sayTyping } from "../../eventChat/services";
import { typing } from "../../../../meta/events";
import { observer } from "mobx-react";
import BePureComponent from "../../../BePureComponent";
import Texts from "../../../../meta/text";
import TextContent from "../../eventChat/TextContent";
import GState from '../../../../stores/globalState/index';

@observer
class ProfileView extends BeComponent {
  constructor(props) {
    super(props);
    this.state = { isMount: false, hide: false };
  }

  state = { isMount: false, hide: false };

  componentDidMount() {
    this.props.showHighlighter && this.props.showHighlighter()
    setTimeout(
      () =>
        stores.TemporalUsersStore.getUser(this.props.phone)
          .then((user) => {
            if (
              user.response == check_user_error_1 ||
              user.response === check_user_error_2
            ) {
              this.setStatePure({ hide: true }); //this.state.hide = true;
              this.props.hideMe ? this.props.hideMe(this.state.hide) : null;
            } else {
              this.props.contact &&
                stores.Contacts.addContact({
                  phone: user.phone,
                  host: user.current_host,
                }).then(() => { });
              this.props.contact && this.props.updateContact(user);

              this.setStatePure({
                isModalOpened: false,
                isMount: true,
              });
              this.props.setContact ? this.props.setContact(user) : null;
            }
          })
          .catch((err) => { }),
      20 * this.props.delay ? this.props.delay : 2
    );
  }

  openModal() {
    this.setStatePure({ isModalOpened: true });
  }
  typing_event = typing(this.props.phone)
  componentMounting() {
    emitter.on(this.typing_event, (typer) => {
      !this.sayTyping ? (this.sayTyping = sayTyping.bind(this)) : null;
      this.sayTyping(typer);
    });
  }
  unmountingComponent() {
    emitter.off(this.typing_event)

  }
  showTyper() {
    return (
      this.state.typing && (
        <Text
          style={[
            GState.defaultTextStyle,
            {
              color: ColorList.indicatorColor,
              fontSize: 12,
            },
          ]}
        >
          {this.state.recording ? Texts.recording : Texts.typing}
        </Text>
      )
    );
  }
  openProfile() {
    requestAnimationFrame(() => {
      this.openModal();
    });
  }
  color = ColorList.colorArray[Math.floor(Math.random() * (ColorList.colorArray.length - 1))];
  render() {
    console.warn("rendering: ",this.props.phoneInfo)
    let press = !this.props.dontPress && this.openProfile.bind(this)
    let user = stores.TemporalUsersStore.Users[this.props.phone];
    let userName =
      user && user.phone === stores.LoginStore.user.phone
        ? user.nickname + ` (${Texts.you})`
        : user
          ? user.nickname
          : (this.props.phoneInfo && this.props.phoneInfo.nickname) ||
          Texts.a_bleashup_user;
    return !this.state.hide ? (
      <View style={{ flexDirection: "row", alignItems: 'center' }}>
        <TouchableOpacity onPress={press}>
          {!this.props.hidePhoto && (
            <View style={{ width: 50 }} transparent>
              {testForURL(user && user.profile) ? (
                <CacheImages
                  staySmall
                  small
                  thumbnails
                  {...this.props}
                  source={{
                    uri: user && user.profile,
                  }}
                />
              ) : (
                  <FontAwesome
                    type={"FontAwesome"}
                    style={{
                      fontSize: ColorList.profilePlaceHolderHeight,
                      color: this.color,
                    }}
                    name={"user-circle-o"}
                  />
                )}
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={press}
          style={{
            fontWeight: "bold",
          }}
        >
          <TextContent
            onPress={press}
            notScallEmoji
            searchString={this.props.searchString}
            numberOfLines={1}
            style={{
              color: ColorList.bodyText,
              fontWeight: "bold",
              fontSize: 14,
              //marginTop: "4%",
            }}
          >
            {userName}
          </TextContent>
          {this.showTyper()}
        </TouchableOpacity>
        {this.state.isModalOpened ? (
          <ProfileModal
            isOpen={this.state.isModalOpened}
            hasJoin={this.props.hasJoin}
            isToBeJoint
            joined={this.props.joined}
            onClosed={() => {
              this.setStatePure({ isModalOpened: false });
            }}
            profile={user}
          ></ProfileModal>
        ) : null}
      </View>
    ) : (
        null
      );
  }
}
export default ProfileView;
