import React, { Component } from "react";
import stores from "../../../stores";
import ColorList from "../../colorList";
import shadower from "../../shadower";
import { Item, Icon, Toast, Text } from "native-base";
import { TextInput, TouchableOpacity, View } from "react-native";
import rounder from "../../../services/rounder";
import BleashupFlatList from "../../BleashupFlatList";
import globalFunctions from "../../globalFunctions";
import ProfileSimple from "../currentevents/components/ProfileViewSimple";
import getRelation from "../Contacts/Relationer";
import Requester from "./Requester";
import moment from "moment";
import { reject } from "lodash";
import TabModal from "../../mainComponents/TabModal";
import actFilterFunc from "../currentevents/activityFilterFunc";
import ActivityProfile from "../currentevents/components/ActivityProfile";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
export default class ShareWithYourContacts extends TabModal {
  initialize() {
    this.state = {
      searchString: "",
      users: [],
      activity: [],
    };
  }
  state = {
    searchString: "",
    users: [],
    activity: [],
  };
  onOpenModal() {
    stores.Contacts.getContacts().then((contacts) => {
      stores.TemporalUsersStore.getUsers(
        contacts.map((ele) => ele.phone),
        [],
        (users) => {
          setTimeout(() => {
            this.setState({
              users: users,
              activity: stores.Events.events.filter(
                (ele) => actFilterFunc(ele) && ele.type 
                !== "relation" && ele.id 
                !== this.props.activity_id
              ),
              mounted: true,
            });
          });
        }
      );
    });
  }

  swipeToClose = false;
  entry = "top";
  position = "center";
  borderTopLeftRadius = 0;
  borderTopRightRadius = 0;
  borderRadius = 10;
  modalHeight = 350;
  modalWidth = "98%";
  onClosedModal() {
    this.props.onClosed();
  }
  changeSeachString(e) {
    this.setState({
      searchString: e.nativeEvent.text,
    });
  }
  sendTo(user) {
    if (!this.sending) {
      this.sending = true;
      getRelation(user).then((relation) => {
        Requester.sendMessage(
          this.props.message,
          relation.id,
          relation.id,
          true
        )
          .then((response) => {
            this.setState({
              users: reject(this.state.users, { phone: user.phone }),
            });
            this.sending = false;
          })
          .catch((error) => {
            console.warn(error);
            this.sending = false;
          });
      });
    }
  }
  tabHeaderContent() {
    return this.searchHeader();
  }
  tabs = [
    {
      heading: () => (
        <View>
          <Text>{"contacts"}</Text>
        </View>
      ),
      body: () => this.searchableList(),
    },
    {
      heading: () => (
        <View>
          <Text>{"activity"}</Text>
        </View>
      ),
      body: () => this.searchableList("activity"),
    },
  ];
  tabHeight = 40;
  sendToActivity(item) {
    if (!this.sending) {
      this.sending = true;
      Requester.sendMessage(this.props.message, item.id, item.id, true)
        .then((response) => {
          console.warn(response);
          this.setState({
            activity: reject(this.state.activity, { id: item.id }),
          });
          this.sending = false
        })
        .catch(() => {
          this.sending = false;
          Toast.show({ text: "unable to send message" });
        });
    } else {
      Toast.show({ text: "app busy! " });
    }
  }
  searching = true;
  searchHeader() {
    return (
      <View
        style={{
          width: "100%",
          height: ColorList.headerHeight,
        }}
      >
        <View
          style={{
            ...bleashupHeaderStyle,
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          <Item
            style={{
              height: ColorList.headerHeight - 20,
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: "2%",
              width: "70%",
            }}
            rounded
          >
            <TextInput
              value={this.state.searchString}
              onChange={this.changeSeachString.bind(this)}
              autoFocus
              style={{
                width: "100%",
                height: "100%",
              }}
              placeholder={"Search in your contacts"}
            ></TextInput>
          </Item>
          <TouchableOpacity
            onPress={() => requestAnimationFrame(this.onClosedModal.bind(this))}
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              marginRight: "2%",
              flexDirection: "row",
              justifyContent: "center",
              ...rounder(30, ColorList.bodyBackground),
            }}
          >
            <Icon
              type={"FontAwesome"}
              style={{
                color: ColorList.bodyIcon,
                fontSize: 20,
                alignSelf: "center",
              }}
              name={"close"}
            ></Icon>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  tabPosition = "bottom";
  searchableList(type) {
    let items = !type
      ? this.state.users
        ? globalFunctions.returnUserSearch(
            this.state.users,
            this.state.searchString
          )
        : []
      : globalFunctions.searchInActivities(
          this.state.activity,
          this.state.searchString
        );
    return (
      <View
        style={{
          height: "90%",
          width: "95%",
          marginTop: "auto",
        }}
      >
        <BleashupFlatList
          firstIndex={0}
          initialRender={7}
          renderPerBatch={20}
          numberOfItems={items.length}
          dataSource={items}
          keyExtractor={(item, index) => item.phone}
          renderItem={(item, index) => (
            <View
              style={{
                width: "95%",
                flexDirection: "row",
                alignSelf: "center",
                height: ColorList.headerHeight - 10,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  width: 160,
                  justifyContent: "flex-start",
                }}
              >
                {!type ? (
                  <ProfileSimple
                    profile={item}
                    searching
                    searchString={this.state.searchString}
                  ></ProfileSimple>
                ) : (
                  <ActivityProfile
                    small
                    searching
                    searchString={this.state.searchString}
                    Event={item}
                  ></ActivityProfile>
                )}
              </View>
              <TouchableOpacity
                onPress={() =>
                  requestAnimationFrame(() =>
                    type ? this.sendToActivity(item) : this.sendTo(item)
                  )
                }
                style={{
                  marginBottom: "auto",
                  marginTop: "auto",
                  justifyContent: "center",
                  ...rounder(30, ColorList.indicatorColor),
                }}
              >
                <Icon
                  style={{
                    fontSize: 15,
                    alignSelf: "center",
                    color: ColorList.bodyBackground,
                  }}
                  type={"MaterialIcons"}
                  name={"send"}
                ></Icon>
              </TouchableOpacity>
            </View>
          )}
        ></BleashupFlatList>
      </View>
    );
  }
  /*modalBody() {
          return <View style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
          }}>
              {this.searchHeader()}
              {this.searchableList()}
          </View>
      }*/
}