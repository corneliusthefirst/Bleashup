import React, { Component } from "react";
//import GState from "../../../../../stores/globalState";
import {
  View,
  Text,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modalbox";
import colorList from "../../colorList";
import Creator from "../reminds/Creator";
import QRDisplayer from "../QR/QRCodeDisplayer";
import BleashupModal from "../../mainComponents/BleashupModal";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import GState from "../../../stores/globalState/index";
import Texts from "../../../meta/text";
import TextContent from "../eventChat/TextContent";
import Entypo from "react-native-vector-icons/Entypo";
import shadower from "../../shadower";

export default class DescriptionModal extends BleashupModal {
  onClosedModal() {
    this.props.onClosed();
  };

  backButtonClose = false;
  swipeToClose = false;
  position = "center";
  modalWidth = "80%";
  modalHeight = 250;
  modalMinHieight = 50
  borderRadius = 20;
  borderTopLeftRadius = 20;
  borderTopRightRadius = 20;

  modalBody() {
    return (
      <View
        style={{
          height: "100%",
          width: "100%",
          borderRadius: 20,
          flexDirection: "column",
        }}
      >
        <View
          style={{
            height: 250*.90,
            width: "98%",
            padding: "2%",
            margin: "1%",
            alignSelf: "center",
            borderRadius: 20,
            backgroundColor: "mintcream",
            ...shadower(1),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: "20%",
              alignItems: "center",
            }}
          >
            <TextContent
              style={{
                fontWeight: "500",
                color: colorList.bodyText,
              }}
            >
              {`@${Texts.activity_description}`}
            </TextContent>
            <TouchableOpacity
              onPress={() => requestAnimationFrame(this.props.replyDescription)}
            >
              <Entypo
                name={"reply"}
                style={{
                  ...GState.defaultIconSize,
                  color: colorList.indicatorColor,
                }}
              ></Entypo>
            </TouchableOpacity>
            {this.props.computedMaster ? (
              <TouchableOpacity
                onPress={() =>
                  requestAnimationFrame(this.props.showEditDescription)
                }
              >
                <EvilIcons
                  style={{ ...GState.defaultIconSize }}
                  name={"pencil"}
                  type={"EvilIcons"}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <ScrollView
            keyboardShouldPersistTaps={"handled"}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            <View style={{ height: "80%" }}>
              <TextContent
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  margin: "1%",
                  ...(!this.props.Event.about.description
                    ? { color: colorList.darkGrayText, fontStyle: "italic" }
                    : {}),
                }}
              >
                {this.props.Event.about.description ||
                  Texts.activity_description_placeholder}
              </TextContent>
            </View>
          </ScrollView>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: "2%",
            marginRight: "2%",
          }}
        >
          <View style={{width: "5%" }}>
            <Creator
              color={colorList.bodyBackground}
              creator={this.props.Event.creator_phone}
              created_at={this.props.Event.created_at}
            />
          </View>
        </View>
      </View>
    );
  }
}
