import React, { Component } from "react";
import {
  View,
  PermissionsAndroid,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Text, Item, Button, Icon, Spinner, Label, Title } from "native-base";
import { Dropdown } from "react-native-material-dropdown";
import {
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import NumericInput from "react-native-numeric-input";
import moment from "moment";
import { find } from "lodash";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import colorList from "../../colorList";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";

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
  componentWillMount() {}
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
  getCode(day) {
    return find(daysOfWeeksDefault, { day: day }).code;
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
          style={{ height: "90%" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginLeft: "4%", flexDirection: "column" }}>
            {this.state.emptyNameError ? (
              <Text style={{ color: "#A91A84" }} note>
                {"name cannot be empty"}
              </Text>
            ) : null}
            {this.state.tooLongNameError ? (
              <Text style={{ color: "#A91A84" }} note>
                {
                  "name is too long; the name should not be morethan 30 characters"
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
              <Icon
                name="edit"
                active={true}
                type="AntDesign"
                style={{
                  color: colorList.bodyIcon,
                  alignSelf: "center",
                  fontSize: 32,
                }}
              />
              <Item
                style={{
                  width: "75%",
                  flexDirection: "row",
                  height: "80%",
                  marginLeft: "10%",
                }}
              >
                <TextInput
                  disabled={this.computedMaster}
                  maxLength={31}
                  style={{
                    width: "80%",
                    fontSize: 16,
                    color: colorList.bodyText,
                    fontWeight: "300",
                  }}
                  onChangeText={(e) => this.changeActivityName(e)}
                  value={this.state.activityName}
                  placeholder={"Activity Name"}
                ></TextInput>
              </Item>
            </View>
            <Item
              style={{
                borderColor: colorList.bodyBackground,
                marginTop: "4%",
                marginLeft: "-3%",
              }}
            >
              <View pointerEvents={this.props.master ? null : "none"}>
                <Button onPress={() => this.setPublic()} transparent>
                  <Icon
                    name={
                      this.state.public
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    type={"MaterialIcons"}
                    style={{ color: colorList.bodyIcon }}
                  ></Icon>
                  <Text style={{ color: colorList.bodyText }}>
                    {this.state.public ? "Public" : "Private"}
                  </Text>
                </Button>
              </View>
            </Item>
          </View>

          <View
            pointerEvents={this.props.creator ? null : "none"}
            style={{ width: "100%", flexDirection: "row" }}
          >
            <Icon
              name="account-group-outline"
              active={true}
              type="MaterialCommunityIcons"
              style={{ color: colorList.bodyIcon, margin: "4%" }}
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
                    <Text style={{ marginLeft: "10%" }}>Can be managed by</Text>
                    <Text
                      style={{
                        marginLeft: "2%",
                        color: colorList.bodyText,
                        fontWeight: "600",
                      }}
                    >
                      {this.state.whoCanUpdate}
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
                  anybody
                </MenuItem>
                <MenuItem onPress={() => this.setWhoCanUpdate("master")}>
                  master
                </MenuItem>
                <MenuItem onPress={() => this.setWhoCanUpdate("creator")}>
                  creator
                </MenuItem>
              </Menu>
            </TouchableOpacity>
          </View>
          <View pointerEvents={this.props.creator ? null : "none"} style={{}}>
            <Button onPress={() => this.closeActiviy()} transparent>
              <Icon
                name={this.state.closed ? "door-open" : "poweroff"}
                type={this.state.closed ? "FontAwesome5" : "AntDesign"}
                style={{
                  color: this.state.closed ? colorList.headerIcon : "red",
                }}
              ></Icon>
              <Text
                style={{
                  fontWeight: "bold",
                  color: colorList.bodyText,
                  marginLeft: "2.5%",
                }}
              >
                {this.state.closed ? "Open" : "Close"} Activiy
              </Text>
            </Button>
          </View>
        </ScrollView>
        {this.isNotSame() && (
          <View
            style={{
              justifyContent: "space-between",
              alignSelf: "flex-start",
              width: 150,
              flexDirection: "row",
              margin: "2%",
              paddingTop: "-5%",
              height: "10%",
            }}
          >
            <Icon
              name="close"
              type="EvilIcons"
              style={{ color: colorList.headerIcon }}
              onPress={this.cancelUpdate.bind(this)}
            ></Icon>
            <Icon
              style={{ color: colorList.indicatorColor }}
              type="EvilIcons"
              onPress={this.saveConfigurations.bind(this)}
              name="check"
            ></Icon>
          </View>
        )}
      </View>
    );
  }
}
