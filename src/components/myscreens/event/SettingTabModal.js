import React from "react";
import { View, ScrollView,TouchableOpacity } from "react-native";
import { Icon,Title,Text,Spinner } from "native-base";
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
  onOpenModal(){
      this.setState({
        isMounted:true
      })
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
                justifyContent: 'space-between',
                alignItems: "center",
              }}
            >
              <TouchableOpacity style={{width:"20%", marginRight: 10, background:'red'}} onPress={() => 
               requestAnimationFrame(this.onClosedModal.bind(this))
              } >
              <Icon
                style={{
                  color: ColorList.headerIcon,
                  marginLeft: 20,
                }}
                type={"MaterialIcons"}
                name={"arrow-back"}
              ></Icon>
              </TouchableOpacity>
              <View style={{ 
                width:"80%"
               }}>
              <Title style={{ 
                color: ColorList.headerText, 
                fontWeight: "600",
                fontSize:ColorList.fontSize,
                alignSelf:'flex-start' 
              }}>
                {"Activity Settings"}
              </Title>
              </View>
            </View>
          </View>
        </View>
        <ScrollView nestedScrollEnabled>
          <View style={{ height: 400 }}>
            <Settings
              event={this.props.event}
              master={this.props.master}
              creator={this.props.creator}
              computedMaster={this.props.computedMaster}
              saveSettings={this.props.saveSettings}
              closeActivity={this.props.closeActivity}
            ></Settings>
          </View>
          <View style={{ height: 600 }}>
            <View style={{
              height:ColorList.headerHeight
            }}>{this.TabHeader()}</View>
          {this.state.isMounted ?
            <Members
              currentPhone={this.props.currentPhone}
              leaveActivity={this.props.leaveActivity}
              checkActivity={this.props.checkActivity}
              creator={this.props.event.creator_phone}
              participants={this.props.event.participant}
              master={this.props.master}
              changeMasterState={this.props.changeMasterState}
            ></Members>:<Spinner size={"small"} ></Spinner>}
          </View>
        </ScrollView>
      </View>
    );
  }
  TabHeader() {
    return (
       <View style={{
         flexDirection: 'row',
         justifyContent: 'space-between',
         marginLeft: "1%",
         marginRight: "1%",
         }}>
        <View style={{
          marginBottom: 'auto',
          marginTop: 'auto',
        }}><Text note>members</Text></View>
       <View
          style={{
            flexDirection: "row",
            marginBottom: 'auto',
            marginTop: 'auto',
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
