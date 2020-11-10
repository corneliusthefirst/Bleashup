import React from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import Settings from "./Settings";
import Members from "./Members";
import MoreMembersMenu from "./MoreMembersMenu";
import RemoveMemberMenu from "./RemoveMemberMenu";
import BleashupModal from "../../mainComponents/BleashupModal";
import ColorList from "../../colorList";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GState from "../../../stores/globalState";
import Spinner from '../../Spinner';
import Searcher from "../Contacts/Searcher";
import { startSearching, cancelSearch, justSearch } from "../eventChat/searchServices";
import globalFunctions from '../../globalFunctions';
import Texts from '../../../meta/text';
import rounder from "../../../services/rounder";
export default class SettingsTabModal extends BleashupModal {

  initialize() {
    this.startSearching = startSearching.bind(this)
    this.cancelSearch = cancelSearch.bind(this)
    this.search = justSearch.bind(this)
  }
  onClosedModal() {
    this.props.closed();
  }
  onOpenModal() {
    this.setStatePure({
      isMounted: true
    })
  }
  swipeToClose = false
  modalBody() {
    let data = this.props.event.participant &&
      this.props.event.participant.filter(ele =>
        globalFunctions.filterForRelation(ele, this.state.searchString || ""))
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
                marginRight:'2%',
                alignItems: "center",
              }}
            >
              <TouchableOpacity style={{ width: "20%", marginRight: 10, background: 'red' }} onPress={() =>
                requestAnimationFrame(this.onClosedModal.bind(this))
              } >
                <MaterialIcons
                  style={{
                    ...GState.defaultIconSize,
                    color: ColorList.headerIcon,
                    marginLeft: 20,
                  }}
                  type={"MaterialIcons"}
                  name={"arrow-back"}
                />
              </TouchableOpacity>
              <View style={{
                flex: 1,
                marginRight: '3%'
              }}>
                <Text style={{
                  color: ColorList.headerText,
                  fontWeight: "600",
                  fontSize: ColorList.fontSize,
                  alignSelf: 'flex-start'
                }}>
                  {Texts.activity_setting}
                </Text>
              </View>
              {this.props.working ? <View style={{
                ...rounder(40, ColorList.bodyBackground)
              }}>
                <Spinner color={ColorList.indicatorColor} big />
              </View> : null}
            </View>
          </View>
        </View>
        <ScrollView nestedScrollEnabled>
          <View style={{ height: GState.height * .50 }}>
            <Settings
              closeModals={this.onClosedModal.bind(this)}
              event={this.props.event}
              master={this.props.master}
              creator={this.props.creator}
              computedMaster={this.props.computedMaster}
              saveSettings={this.props.saveSettings}
              closeActivity={this.props.closeActivity}
            ></Settings>
          </View>
          <View style={{ height: GState.height * .7, width: '100%' }}>
            <View style={{
              height: ColorList.headerHeight,
              width: '100%',
            }}>{this.TabHeader()}</View>
            <View style={{ height: "80%" }}>
              {this.state.isMounted ?
                <Members
                  removeWithMe={this.props.remove}
                  addMembers={this.props.addMembers}
                  closeModals={this.onClosedModal.bind(this)}
                  currentPhone={this.props.currentPhone}
                  leaveActivity={this.props.leaveActivity}
                  checkActivity={this.props.checkActivity}
                  creator={this.props.event.creator_phone}
                  participants={data}
                  searchString={this.state.searchString}
                  master={this.props.master}
                  changeMasterState={this.props.changeMasterState}
                ></Members> : <Spinner size={"small"} ></Spinner>}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
  TabHeader() {
    return (
      <View style={{
        flexDirection: 'row',
        alignSelf: 'center',
        //justifyContent: 'space-between',
        marginLeft: "1%",
        width: '97%',
        alignItems: 'center',
        height: 35,
        marginRight: "1%",
      }}>
        {!this.state.searching ? <View style={{
          alignSelf: 'flex-start',
          flex: 1,
        }}><Text style={{
          ...GState.defaultTextStyle
        }}>{Texts.members}</Text></View> : null}
        <View style={{
          height: 35,
          alignSelf: 'center',
          marginLeft: 5,
          marginRight: 6,
          width: this.state.searching ? "98%" : 35
        }}>
          <Searcher
            searching={this.state.searching}
            searchString={this.state.searchString}
            startSearching={this.startSearching}
            cancelSearch={this.cancelSearch}
            search={this.search}
          ></Searcher>
        </View>
      </View>)
  }
}
