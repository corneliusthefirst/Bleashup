import React, { Component } from "react";
import stores from "../../../stores";
import ColorList from "../../colorList";
import shadower from "../../shadower";
import { TextInput, TouchableOpacity, View, Text } from "react-native";
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
import Toaster from "../../../services/Toaster";
import  FontAwesome  from 'react-native-vector-icons/FontAwesome';
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
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
          Toaster({ text: "unable to send message" });
        });
    } else {
      Toaster({ text: "app busy! " });
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
          <View
            style={{
              height: ColorList.headerHeight - 10,
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
          </View>
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
            <FontAwesome
              type={"FontAwesome"}
              style={{
                color: ColorList.bodyIcon,
                fontSize: 20,
                alignSelf: "center",
              }}
              name={"close"}
            />
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
          fit
          firstIndex={0}
          initialRender={7}
          renderPerBatch={20}
          numberOfItems={items.length}
          keyboardShouldPersistTaps={"always"}
          dataSource={items}
          keyExtractor={(item, index) => item.phone}
          renderItem={(item, index) => (
            <View
              style={{
                width: "95%",
                flexDirection: "row",
                alignSelf: "center",
                height: ColorList.headerHeight - 5,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  width: 250,
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
                <MaterialIcons
                  style={{
                    fontSize: 15,
                    alignSelf: "center",
                    color: ColorList.bodyBackground,
                  }}
                  type={"MaterialIcons"}
                  name={"send"}
                />
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
