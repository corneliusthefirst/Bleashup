import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import CacheImages from "../../../CacheImages";
import shadower from "../../../shadower";
import testForURL from "../../../../services/testForURL";
import ColorList from "../../../colorList";
import GState from "../../../../stores/globalState/index";
import Texts from "../../../../meta/text";
import BleashupModal from "../../../mainComponents/BleashupModal";
import emitter from "../../../../services/eventEmiter";
import { sayTyping, checkUserOnlineStatus } from "../../eventChat/services";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import getRelation from "../../Contacts/Relationer";
import BeNavigator from "../../../../services/navigationServices";
import { close_all_modals, typing } from "../../../../meta/events";
import Vibrator from "../../../../services/Vibrator";
import { observer } from "mobx-react";
import stores from "../../../../stores";
import onlinePart from "../../eventChat/parts/onlineParts";
import rounder from "../../../../services/rounder";
import PhotoViewer from "../../event/PhotoViewer";
import AntDesign from "react-native-vector-icons/AntDesign";
import { already_a_contact } from "../../../../stores/contacts";
import Toaster from "../../../../services/Toaster";
import Entypo from "react-native-vector-icons/Entypo";
import TextContent from "../../eventChat/TextContent";
import globalFunctions from "../../../globalFunctions";

@observer
class ProfileModal extends BleashupModal {
  initialize(props) {
    this.enlargeImage = this.enlargeImage.bind(this);
    this.state = {
      enlargeImage: false,
      last_seen: " ....",
    };
    !this.onlinePart ? (this.onlinePart = onlinePart.bind(this)) : null;
    this.onClosedModal = this.onClosedModal.bind(this);
    this.sayTyping = sayTyping.bind(this);
  }

  transparent = "rgba(52, 52, 52, 0.3)";
  enlargeImage(url) {
    requestAnimationFrame(() => {
      this.setStatePure({
        showPhoto: true,
      });
    });
  }
  onOpenModal() {
    if (this.props.profile && !this.opened) {
      stores.TemporalUsersStore.checkRemote(this.props.profile.phone);
      this.event_to_be_listen = typing(this.props.profile.phone);
      emitter.on(this.event_to_be_listen, (typer) => {
        this.sayTyping(typer);
      });
      !this.checkUserOnlineStatus
        ? (this.checkUserOnlineStatus = checkUserOnlineStatus.bind(this))
        : null;
      this.checkUserOnlineStatus(
        this.props.profile.phone,
        this.checkRef,
        (checkRef) => {
          this.checkRef = checkRef;
        }
      );
    }
  }
  onClosedModal() {
    console.warn("clearing check online time out: ", this.checkRef);
    clearInterval(this.checkRef);
    this.props.profile && emitter.off(this.event_to_be_listen);
    this.off = true;
    this.props.onClosed();
    this.checkRef = null;
  }
  unMountingModal() {
    !this.off &&
      this.props.profile &&
      emitter.off(typing(this.props.profile.phone));
  }
  goToRelation(rems) {
    this.onClosedModal();
    this.props.profile
      ? getRelation(this.props.profile, true).then((relation) => {
          Vibrator.vibrateShort();
          if (rems) {
            BeNavigator.goToRemind(relation, true);
          } else {
            BeNavigator.pushToChat(relation);
          }
        })
      : GState.considerIvite();
    emitter.emit(close_all_modals);
  }
  showTyper() {
    return this.state.typing ? (
      <TextContent
        style={[
          GState.defaultTextStyle,
          {
            color: ColorList.indicatorColor,
            fontSize: 12,
            fontStyle: "italic",
            fontWeight: "bold",
            marginLeft: "2%",
          },
        ]}
      >
        {this.state.recording ? Texts.recording : Texts.typing}
      </TextContent>
    ) : null;
  }
  swipeToClose = true;
  modalHeight = "70%";
  //modalMinHieight = "70%"
  modalWidth = "97%";
  placeHolder = GState.profilePlaceHolder;
  addAsContact() {
    this.props.profile &&
      stores.Contacts.addContact({
        phone: this.user.phone,
        host: this.user.current_host,
      }).then((res) => {
        if (res == already_a_contact) {
          Toaster({ text: Texts.already_a_contact });
        } else {
          BeNavigator.navigateToContacts();
          this.onClosedModal();
        }
      });
  }
  modalBody() {
    this.isMe =
      this.props.profile && globalFunctions.isMe(this.props.profile.phone);
    this.user = {
      ...this.props.profile,
      ...(this.props.profile &&
        stores.TemporalUsersStore.Users[this.props.profile.phone]),
    };
    return this.user ? (
      <View>
        <View style={styles.child1}>
          <View style={styles.child1Sub}>
            <TouchableOpacity
              style={{ ...rounder(40), justifyContent: "center" }}
              onPress={this.onClosedModal}
              transparent
            >
              <EvilIcons style={styles.Child1SubIconStyle} name="close" />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.child2}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "95%",
                  justifyContent: "space-between",
                  margin: "2%",
                }}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <TextContent
                    ellipsizeMode={"tail"}
                    numberOfLines={1}
                    style={[GState.defaultTextStyle, styles.child2Text]}
                  >
                    {this.user.nickname}
                  </TextContent>
                  {this.showTyper()}
                  {this.onlinePart && this.onlinePart()}
                </View>
                {!this.isMe ? (
                  <TouchableOpacity
                    style={{
                      flexDirection: "column",
                      marginHorizontal: "2%",
                      ...rounder(40, ColorList.bodyDarkWhite),
                      ...shadower(2),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => this.goToRelation()}
                  >
                    <MaterialIcons
                      style={{
                        ...GState.defaultIconSize,
                        color: ColorList.indicatorColor,
                      }}
                      name="chat-bubble"
                    ></MaterialIcons>
                  </TouchableOpacity>
                ) : null}
                {!this.isMe ? (
                  <TouchableOpacity
                    style={{
                      flexDirection: "column",
                      ...rounder(40, ColorList.bodyDarkWhite),
                      ...shadower(2),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => this.goToRelation(true)}
                  >
                    <Entypo
                      style={{
                        ...GState.defaultIconSize,
                        color: ColorList.indicatorColor,
                      }}
                      name="bell"
                    ></Entypo>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            <View style={styles.child3}>
              <TouchableOpacity
                onPress={() => this.enlargeImage(this.user.profile)}
              >
                {this.user.profile && testForURL(this.user.profile) ? (
                  <CacheImages
                    thumbnails
                    source={{
                      uri: this.user && this.user.profile,
                    }}
                    style={styles.child3cacheImages}
                  />
                ) : (
                  <Image
                    resizeMode={"cover"}
                    style={styles.child3placeHolder}
                    source={this.placeHolder}
                  ></Image>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.child4}>
              <View style={{ width: "70%" }}>
                {!GState.isUndefined(this.user.status) ? (
                  <TextContent
                    ellipsizeMode={"tail"}
                    numberOfLines={2}
                    style={styles.child4text}
                  >
                    {this.user.status}
                  </TextContent>
                ) : null}
              </View>
              {this.user ? (
                !stores.Contacts.isAContact(this.user.phone) ? (
                  <TouchableOpacity
                    style={{
                      flexDirection: "column",
                      ...rounder(40),
                      backgroundColor: ColorList.bodyDarkWhite,
                      ...shadower(2),
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={this.addAsContact.bind(this)}
                  >
                    <AntDesign
                      style={{
                        ...GState.defaultIconSize,
                        color: ColorList.indicatorColor,
                      }}
                      name="adduser"
                    ></AntDesign>
                  </TouchableOpacity>
                ) : null
              ) : null}
            </View>
          </ScrollView>
        </View>
        {this.state.showPhoto ? (
          <PhotoViewer
            open={this.state.showPhoto}
            photo={this.user.profile}
            hidePhoto={() => {
              this.setStatePure({
                showPhoto: false,
              });
            }}
          ></PhotoViewer>
        ) : null}
      </View>
    ) : null;
  }
}
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: ColorList.bodyBackground,
    height: "80%",
    padding: "2%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: "100%",
  },
  child1: {
    margin: "3%",
    height: "95%",
    width: "95%",
  },
  child1Sub: {
    alignItems: "center",
    marginBottom: "2%",
    justifyContent: "center",
  },
  child2: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 0,
    alignItems: "flex-start",
  },
  child2Text: {
    fontSize: 18,
    fontWeight: "500",
  },
  Child1SubIconStyle: {
    color: ColorList.bodyIcon,
    fontSize: 35,
  },
  child3: {
    flexDirection: "column",
    ...shadower(1),
    justifyContent: "center",
    flexDirection: "column",
    padding: "2%",
    alignSelf: "center",
    margin: "auto",
    alignItems: "center",
    justifyContent: "center",
    ...rounder(300, ColorList.bodyDarkWhite),
    backgroundColor: ColorList.bodyBackground,
  },
  child3placeHolder: {
    ...rounder(250, ColorList.bodyBackground),
    ...shadower(2),
    alignSelf: "center",
    backgroundColor: ColorList.bodyBackground,
  },
  child3cacheImages: {
    alignSelf: "center",
    ...shadower(2),
    ...rounder(250, ColorList.bodyBackground),
    backgroundColor: ColorList.bodyBackground,
  },

  child4: {
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    justifyContent: "space-between",
    marginTop: 10,
  },
  child4text: {
    ...GState.defaultTextStyle,
    fontSize: 17,
    fontWeight: "400",
  },
});

export default ProfileModal;
