import React, { Component } from "react";
import {
  View,
  PermissionsAndroid,
  StatusBar,
  TouchableOpacity, ScrollView, TextInput,
  TouchableWithoutFeedback, Text
} from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import NumericInput from "react-native-numeric-input";
import moment from "moment";
import { find } from "lodash";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import colorList from "../../colorList";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GState from "../../../stores/globalState";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Spinner from '../../Spinner';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Texts from "../../../meta/text";
import CreateTextInput from './createEvent/components/CreateTextInput';
import rounder from "../../../services/rounder";
import Ionicons from 'react-native-vector-icons/Ionicons';

var event = null;
export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "time",
      show: false,
      loaded: false,
      showDate: false,
      recurrent: false,
      recurrence: this.props.event.period
        ? this.props.event.period
        : moment().format(),
      display: "clock",
    };
  }
  state = {};
  changeActivityName(e) {
    this.setState({
      activityName: e,
      newThing: !this.state.newThing,
    });
    this.validateName(e);
  }
  validateName(e) {
    this.updated = true;
    if (e.length > 30) {
      this.setState({
        tooLongNameError: true,
        newThing: !this.state.newThing,
      });
      return false;
    } else if (!e) {
      console.warn("errorful name ...");
      this.setState({
        emptyNameError: true,
        newThing: !this.state.newThing,
      });
      return false;
    } else {
      this.setState({
        emptyNameError: false,
        tooLongNameError: false,
        newThing: !this.state.newThing,
      });
      return true;
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.event = JSON.stringify(this.props.event);
      this.init();
    }, 20);
  }
  init() {
    this.setState({
      activityName: this.props.event.about.title,
      public: this.props.event.public,
      closed: this.props.event.closed ? true : false,
      whoCanUpdate: this.props.event.who_can_update,
      loaded: true,
    });
  }
  componentWillUnmount() {
    this.name = null;
    this.updated = null;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.event.about.title !== prevProps.event.about.title) {
      this.init();
    }
    if (this.props.event.who_can_update !== prevProps.event.who_can_update) {
      console.warn("updating who can update")
      this.init();
    }
    if (this.props.event.public !== prevProps.event.public) {
      this.init();
    }
    if (this.props.event.closed !== prevProps.event.closed) {
      console.warn("updated from closed");
      this.init();
    }
    this.event = JSON.stringify(this.props.event)
  }
  setPublic() {
    this.setState({
      public: !this.state.public,
      newThing: !this.state.newThing,
    });
  }
  saveConfigurations() {
    if (this.validateName(this.state.activityName)) {
      let period = this.state.date;
      let newConfig = {
        period_new: this.props.event.period,
        title_new: this.state.activityName ? this.state.activityName : null,
        public_new: this.state.public,
        interval_new: this.props.event.interval,
        recurrent_new: this.props.event.recurrent,
        recurrence_new: this.props.event.recurrence,
        frequency_new: this.props.event.frequency,
        days_of_week: this.props.event.days_of_week,
        week_start: this.props.event.week_start,
        who_can_update_new: this.state.whoCanUpdate,
        notes_new: this.props.event.notes,
      };
      this.props.saveSettings(this.event, newConfig);
    }
  }
  isNotSame() {
    return (
      this.state.activityName !== this.props.event.about.title ||
      this.state.whoCanUpdate !== this.props.event.who_can_update ||
      this.state.public !== this.props.event.public
    );
  }
  componentWillMount() { }
  closeActiviy() {
    console.warn("closing activity");
    this.props.closeActivity();
  }
  updatePossibilities = [
    { value: "master" },
    { value: "anybody" },
    { value: "creator" },
  ];
  showEndatePiker() {
    this.setState({
      showEndatePiker: true,
      mode: "date",
      display: "calendar",
      newThing: !this.state.newThing,
    });
  }
  setWhoCanUpdate(val) {
    this.setState({
      whoCanUpdate: val,
      newThing: !this.state.newThing,
    });
    this._menu.hide();
  }

  //who can manage

  //initialise menu
  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };
  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };
  cancelUpdate() {
    this.init();
  }
  render() {
    return !this.state.loaded ? (
      <Spinner size={"small"}></Spinner>
    ) : (
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <View style={{ marginLeft: "4%", flexDirection: "column" }}>
              {this.state.emptyNameError ? (
                <Text style={{ color: colorList.errorColor }} note>
                  {Texts.name_cannot_be_empty}
                </Text>
              ) : null}
              {this.state.tooLongNameError ? (
                <Text style={{ color: colorList.errorColor }} note>
                  {
                    Texts.name_is_too_long
                  }
                </Text>
              ) : null}
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  marginTop: "5%",
                  headerHeight: colorList.headerHeight,
                }}
              >
                <AntDesign
                  name="edit"
                  active={true}
                  style={{
                    color: colorList.bodyIcon,
                    alignSelf: "center",
                    fontSize: 32,
                  }}
                />
                <View
                  style={{
                    width: "75%",
                    flexDirection: "row",
                    height: "80%",
                    marginLeft: "10%",
                  }}
                >
                  <CreateTextInput
                    disabled={this.computedMaster}
                    maxLength={100}
                    height={45}
                    style={{
                      width: "80%",
                      fontSize: 16,
                      color: colorList.bodyText,
                      fontWeight: "300",
                    }}
                    onChange={(e) => this.changeActivityName(e)}
                    value={this.state.activityName}
                    placeholder={Texts.activity_name}
                  ></CreateTextInput>
                </View>
              </View>
              <View
                style={{
                  borderColor: colorList.bodyBackground,
                  marginTop: "4%",
                  marginLeft: "-3%",
                }}
              >
                <View pointerEvents={this.props.master ? null : "none"}>
                  <TouchableOpacity style={{ flexDirection: 'row', width: 125, justifyContent: 'space-between', }} onPress={() => this.setPublic()} transparent>
                    <MaterialIcons
                      name={
                        this.state.public
                          ? "radio-button-checked"
                          : "radio-button-unchecked"
                      }
                      type={"MaterialIcons"}
                      style={{ ...GState.defaultIconSize, color: colorList.bodyIcon, marginLeft: 5, }}
                    />
                    <Text style={{ color: colorList.bodyText, marginTop: 5, }}>
                      {this.state.public ? Texts.public : Texts.private}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View
              pointerEvents={this.props.creator ? null : "none"}
              style={{ width: "100%", flexDirection: "row" }}
            >
              <MaterialIconCommunity
                name="account-group-outline"
                active={true}
                type="MaterialCommunityIcons"
                style={{ ...GState.defaultIconSize, color: colorList.bodyIcon, margin: "4%" }}
                onPress={this.showMenu}
              />

              <TouchableOpacity
                style={{ justifyContent: "center" }}
                onPress={this.showMenu}
              >
                <Menu
                  ref={this.setMenuRef}
                  button={
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ marginLeft: "10%" }}>{Texts.can_be_managed_by}</Text>
                      <Text
                        style={{
                          marginLeft: "2%",
                          color: colorList.bodyText,
                          fontWeight: "600",
                        }}
                      >
                        {Texts[this.state.whoCanUpdate]}
                      </Text>
                    </View>
                  }
                  style={{
                    backgroundColor: colorList.bodyBackground,
                    marginLeft: "45%",
                    width: 0,
                  }}
                >
                  <MenuItem onPress={() => this.setWhoCanUpdate("anybody")}>
                    {Texts.anybody}
                  </MenuItem>
                  <MenuItem onPress={() => this.setWhoCanUpdate("master")}>
                    {Texts.masters}
                  </MenuItem>
                  <MenuItem onPress={() => this.setWhoCanUpdate("creator")}>
                    {Texts.creator}
                  </MenuItem>
                </Menu>
              </TouchableOpacity>
            </View>
            <View pointerEvents={this.props.creator ? null : "none"} style={{ marginLeft: "4%", }}>
              <TouchableOpacity style={{ flexDirection: 'row', width: 150, justifyContent: 'space-between', }} onPress={() => this.closeActiviy()} transparent>
                <View>{this.props.event && this.props.event.closed ? <FontAwesome5
                  name={"door-open"}
                  style={{
                    ...GState.defaultIconSize,
                    color: colorList.headerIcon
                  }}
                /> : <AntDesign name={"poweroff"}
                  style={{ ...GState.defaultIconSize, color: 'red' }}
                ></AntDesign>}</View>
                <Text
                  style={{
                    marginLeft: "5%",
                    fontWeight: "bold",
                    color: colorList.bodyText,
                    marginTop: 5,
                  }}
                >
                  {this.props.event && this.props.event.closed ?
                    Texts.open_activity :
                    Texts.close_activity}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {this.isNotSame() && (
            <View
              style={{
                justifyContent: "space-between",
                alignSelf: "flex-start",
                width: '50%',
                flexDirection: "row",
                margin: "4%",
                marginTop: '6%',
                height: 45,
              }}
            >
              <TouchableOpacity onPress={this.cancelUpdate.bind(this)} style={{
                ...rounder(40, colorList.descriptionBody)
              }}>
                <EvilIcons
                  name="close"
                  type="EvilIcons"
                  style={{ 
                    ...GState.defaultIconSize,
                    fontSize: 40, 
                    color: colorList.orangeColor 
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{
                ...rounder(40, colorList.descriptionBody)
              }}>
                <Ionicons
                  style={{ 
                    ...GState.defaultIconSize,
                    fontSize: 40, 
                    color: colorList.indicatorColor 
                  }}
                  onPress={this.saveConfigurations.bind(this)}
                  name="ios-checkmark-circle"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
  }
}
