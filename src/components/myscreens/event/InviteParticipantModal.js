import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import BleashupFlatList from "../../BleashupFlatList";
import { findIndex, reject } from "lodash";
import stores from "../../../stores";
import SelectableContactsMaster from "./SelectableContactsMaster";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import BleashupModal from "../../mainComponents/BleashupModal";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import GState from "../../../stores/globalState";
import Texts from '../../../meta/text';
import Searcher from "../Contacts/Searcher";
import { startSearching, cancelSearch, justSearch } from "../eventChat/searchServices";
import globalFunctions from '../../globalFunctions';
export default class InviteParticipantModal extends BleashupModal {
  initialize() {
    this.state = {
      isOpen: false,
      loaded: false,
      contacts: [],
      participant: [],
      event_id: null,
      selected: [],
    };
    this.startSearching = startSearching.bind(this)
    this.cancelSearch = cancelSearch.bind(this)
    this.search = justSearch.bind(this)
  }
  toggleMaster(memberPhone) {
    this.setStatePure({
      selected: this.state.selected.map((ele) => ele &&
        ele.phone === memberPhone ? { ...ele, master: !ele.master } : ele
      ),
    });
  }
  addMember(member) {
    this.setStatePure({
      selected: [...this.state.selected, member],
    });
  }
  remove(memberPhone) {
    this.setStatePure({
      selected: reject(this.state.selected, { phone: memberPhone }),
    });
  }
  _keyExtractor(item) {
    return item.phone;
  }
  onClosedModal() {
    this.props.onClosed();
    this.setStatePure({
      participant: [],
      selected: [],
      loaded: false,
      event_id: null,
      hideTitle: false,
    });
  }
  onOpenModal() {
    stores.Contacts.getContacts().then((contacts) => {
      this.openModalTimeout = setTimeout(() => {
        this.setStatePure({
          contacts: contacts
            ? contacts.filter((ele) => findIndex(this.props.participant, { phone: ele.phone }) < 0)
            : [],
          event_id: this.props.event_id,
          hideTitle: this.props.hideTitle,
        });
      })
    });
  }
  saveStyles = { fontSize: 40, color: "#1FABAB" }
  delay = 0;
  swipeToClose = false
  modalBody() {
    let data = this.state.contacts && this.state.contacts.filter(ele =>
      globalFunctions.filterForRelation(ele, this.state.searchString || ""))
    return (
      <View>
        <View
          style={{
            ...bleashupHeaderStyle,
            padding: "2%",
            width: "100%",
            height: 53,
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity onPress={() => requestAnimationFrame(() => this.onClosedModal())} style={{
            marginBottom: 'auto',
            marginTop: 'auto',
            marginHorizontal: '2%',
            justifyContent: 'flex-start',
            flexDirection: 'row',
            width: 70
          }}>
            <MaterialIcons style={{ ...GState.defaultIconSize }} type={"MaterialIcons"} name={"arrow-back"} />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              height: '100%',
              flexDirection: "row",
              justifyContent: 'space-between',
            }}
          >
            {this.state.searching ? null : <View style={{ flexDirection: "column", flex: 1, }}>
              <Text
              ellipsizeMode={"tail"}
              numberOfLines={1}
                style={{
                  ...GState.defaultTextStyle,
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {Texts.select_members}
              </Text>
              <Text
                note
                style={{
                  fontSize: 14,
                  fontStyle: "italic",
                }}
              >
                {this.state.selected.length}
                {Texts.members_and}
                {
                  this.state.selected.filter((ele) => ele.master == true)
                    .length
                }
                {" "+Texts.masters}
              </Text>
            </View>}
            {this.state.selected.length > 0 && !this.state.searching && <View>
              <TouchableOpacity
                onPress={() =>
                  requestAnimationFrame(() =>
                    this.props.invite(this.state.selected)
                  )
                }
              >
                {this.props.adding ? <Entypo style={this.saveStyles} name="check" /> : <EvilIcons
                  style={this.saveStyles}
                  name={"sc-telegram"}
                />}
              </TouchableOpacity>
            </View>}
            <View
              style={{
                flex: this.state.searching ? 1 : null,
                width: this.state.searching ? "100%" : 35,
                height: 35
              }}
            >
              <Searcher
                searching={this.state.searching}
                searchString={this.state.searchString}
                startSearching={this.startSearching}
                search={this.search}
                cancelSearch={this.cancelSearch}
              >
              </Searcher>
            </View>
          </View>
        </View>
        <View style={{ height: "93%" }}>
          <BleashupFlatList
            firstIndex={0}
            renderPerBatch={20}
            //key={JSON.stringify(this.state.selected)}
            initialRender={10}
            numberOfItems={data.length}
            keyExtractor={this._keyExtractor}
            dataSource={data}
            renderItem={(item, index) => {
              let me = this.state.selected.find(ele => ele && ele.phone === item.phone)
              this.delay = this.delay >= 15 ? 0 : this.delay + 1;
              return (
                <SelectableContactsMaster
                  searchString={this.state.searchString}
                  checked={me && me.phone ? true : false}
                  masterchecked={me && me.phone && me.master ? true : false}
                  master={this.props.master}
                  delay={this.delay}
                  toggleMaster={(member) => this.toggleMaster(member)}
                  selected={(member) => {
                    this.addMember(member);
                  }}
                  unselected={(member) => this.remove(member)}
                  //key={index}
                  contact={item}
                ></SelectableContactsMaster>
              );
            }}
          ></BleashupFlatList>
        </View>
      </View>
    );
  }
}
