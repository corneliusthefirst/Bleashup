import React from "react";
import { View, ScrollView } from "react-native";
import { Icon,Title,Text } from "native-base";
import Settings from "./Settings";
import Members from "./Members";
import MoreMembersMenu from "./MoreMembersMenu";
import RemoveMemberMenu from "./RemoveMemberMenu";
import BleashupModal from "../../mainComponents/BleashupModal";
import ColorList from "../../colorList";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";

export default class SettingsTabModal extends BleashupModal {
  onClosedModal() {
    this.props.closed();
  }
  swipeToClose = false
  modalBody() {
    return (
      <View>
        <View
          style={{
            height: ColorList.headerHeight,
            width: "100%",
          }}
        >
          <View style={{ ...bleashupHeaderStyle }}>
            <View
              style={{
                height: ColorList.headerHeight,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon
                onPress={() => {
                  this.onClosedModal();
                }}
                style={{
                  color: ColorList.headerIcon,
                  marginLeft: "5%",
                  marginRight: "3%",
                }}
                type={"MaterialIcons"}
                name={"arrow-back"}
              ></Icon>
              <Title style={{ color: ColorList.headerText, fontWeight: "800" }}>
                {"@Activity Settings"}
              </Title>
            </View>
          </View>
        </View>
        <ScrollView nestedScrollEnabled>
          <View style={{ height: this.height * 0.4 }}>
            <Settings
              event={this.props.event}
              master={this.props.master}
              creator={this.props.creator}
              computedMaster={this.props.computedMaster}
              saveSettings={this.props.saveSettings}
              closeActivity={this.props.closeActivity}
            ></Settings>
          </View>
          <View style={{ height: this.height - ColorList.headerHeight }}>
          {this.TabHeader()}
            <Members
              currentPhone={this.props.currentPhone}
              leaveActivity={this.props.leaveActivity}
              checkActivity={this.props.checkActivity}
              creator={this.props.event.creator_phone}
              participants={this.props.event.participant}
              master={this.props.master}
              changeMasterState={this.props.changeMasterState}
            ></Members>
          </View>
        </ScrollView>
      </View>
    );
  }
  TabHeader() {
    return (
       <View style={{flexDirection: 'row',justifyContent: 'space-between',margin: '3%',}}>
       <View><Text note>members</Text></View>
       <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-end",
            width: 100,
            justifyContent: "space-between",
          }}
        >
          <MoreMembersMenu
            master={this.props.master}
            addMembers={this.props.addMembers}
            invite={this.props.invite}
          ></MoreMembersMenu>
          {this.props.master && (
            <RemoveMemberMenu remove={this.props.remove}></RemoveMemberMenu>
          )}
        </View></View> )
  }
}
