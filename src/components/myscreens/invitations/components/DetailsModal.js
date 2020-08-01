import React, { Component } from "react";
import Modal from "react-native-modalbox";
import {
  View,
  Text,
  TouchableOpacity,
  DeviceEventEmitter,
  Image,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import CacheImages from "../../../CacheImages";
import stores from "../../../../stores";
import { forEach, findIndex } from "lodash";
import bleashupHeaderStyle from "../../../../services/bleashupHeaderStyle";
import PhotoViewer from "../../event/PhotoViewer";
import Request from "../../currentevents/Requester";
import TitleView from "../../currentevents/components/TitleView";
import Creator from "../../reminds/Creator";
import BleashupModal from "../../../mainComponents/BleashupModal";
import Texts from "../../../../meta/text";
import Toaster from "../../../../services/Toaster";
import ColorList from '../../../colorList';
import GState from "../../../../stores/globalState";
import shadower from "../../../shadower";
export default class DetailsModal extends BleashupModal {
  state = {};
  initialize() {
    this.state = {
      details: undefined,
      isOpen: false,
      created_date: undefined,
      event_organiser_name: undefined,
      location: undefined,
      isJoining: false,
      isToBeJoint: false,
      id: undefined,
      loaded: false,
    };
    this.url = {uri:this.props.event && this.props.event.background}
    this.openPhoto = this.openPhoto.bind(this);
    this.initJoin = this.initJoin.bind(this);
  }
  transparent = "rgba(52, 52, 52, 0.0)";
  details = [];
  created_date = "";
  event_organiser_name = "";
  location = "";
  isToBeJoint = false;
  id = "";
  componentDidMount() {
    this.props.parent ? this.props.parent.onSeen() : null;
  }
  formCreator() {
    return new Promise((resolve, reject) => {
      stores.TemporalUsersStore.getUser(this.props.event.creator_phone).then(
        (user) => {
          resolve({
            name: user.nickname,
            status: user.status,
            image: user.profile,
          });
        }
      );
    });
  }

  formDetailModal(event) {
    return new Promise((resolve, reject) => {
      let card = [];
      Description = {
        event_title: event.about.title,
        event_description: event.about.description,
      };
      card.push(Description);
      resolve(card);
    });
  }
  join() {
    if (
      findIndex(this.state.event.participant, {
        phone: stores.LoginStore.user.phone,
      }) < 0
    ) {
      this.setStatePure({
        isJoining: true,
      });
      Request.join(this.state.event.id, this.state.event.event_host)
        .then((status) => {
          this.setStatePure({
            isJoining: false,
          });
          this.props.onClosed();
        })
        .catch((error) => {
          console.warn(error, " error which occured while joining ");
          this.setStatePure({ isJoining: false });
          Toaster({
            text: "unable to perform this action",
            buttonText: "Okay",
            position: "top",
            duration: 4000,
          });
        });
    } else {
      this.props.goToActivity();
      this.props.onClosed();
    }
  }
  backdropOpacity = 0.3;
  onClosedModal() {
    this.props.onClosed();
  }
  onOpenModal() {
      this.url.uri = this.props.event.background
    this.openModalTimeout = setTimeout(
      () =>
            this.setStatePure({
              event: this.props.event,
              //details: details,
              //creator: creator,
              loaded: true,
              location: this.props.event.location,
        }),
      100
    );
  }
  openPhoto() {
    requestAnimationFrame(() => {
      this.setStatePure({
        showPhoto: true,
      });
    });
  }
  initJoin() {
    this.props.join ? this.props.join() : this.join();
  }
  swipeToClose = false;
  modalHeight = this.height * 0.5;
  modalBody() {
    const accept = this.state.accept;
    const deny = this.state.deny;
    return !this.state.loaded ? null : (
      <View>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.photoContainer}
                onPress={this.openPhoto}
              >
                <CacheImages thumbnails source={this.url}></CacheImages>
              </TouchableOpacity>
              <View style={styles.titleMainContainer}>
                <TitleView Event={this.state.event}></TitleView>
              </View>
            </View>
          </View>
          <ScrollView style={styles.descriptionContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.description}>
            {this.props.event.about.description||"No Description Provided"}</Text>
          </ScrollView>
          <View style={styles.cardItem}>
            <View style={styles.left}>
              {this.props.isToBeJoint && this.state.event.public ? (
                <View>
                    {this.state.isJoining ? null : (
                      <TouchableOpacity
                        onPress={this.props.join}
                        style={styles.joinButtonContainer}
                        onPress={this.initJoin}
                      >
                        <Text style={styles.joinButtom}>{Texts.join}</Text>
                      </TouchableOpacity>
                    )}
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.cardItem}>
            {
              <Creator
                creator={this.state.event.creator_phone}
                created_at={this.state.event.created_at}
              ></Creator>
            }
          </View>
        </View>
        {this.state.showPhoto ? (
          <PhotoViewer
            open={this.state.showPhoto}
            photo={this.state.event.background}
            hidePhoto={() => {
              this.setStatePure({
                showPhoto: false,
              });
            }}
          ></PhotoViewer>
        ) : null}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: { height: 65 },
  descriptionContainer:{
    height:200
  },
  description:{
    ...GState.defaultTextStyle,
      fontSize: 14,
      margin: "3%",
      justifyContent: 'flex-start',
  },
  mainContainer: { height: "98%" },
  right: {
    alignSelf: "flex-end",
  },
  left: {
    alignSelf: "flex-end",
  },
  header: {
    ...bleashupHeaderStyle,
    alignItems: 'center',
    padding: "1%",
    flexDirection: "row",
  },
  cardItem: {
    margin: 2,
  },
  joinButtonContainer: {
    flexDirection: "row",
    height:40,
    marginLeft: "auto",
    alignSelf: 'flex-end',
    width:60,
    ...shadower(2),
    backgroundColor: ColorList.indicatorColor,
    borderRadius: 3,
  },
  titleMainContainer:{
    width: "80%",
    marginLeft: 10,
    marginTop: "5%",
  },
  titleContainer: { 
   
  },
  joinButtom: {
    fontSize: 18,
    marginLeft:'auto',
    marginRight: 'auto',
    marginBottom: "auto",
    marginTop: "auto",
    color:ColorList.bodyBackground,
    fontWeight: "500",
  },
  photoContainer: { width: "15%",marginBottom: "2%", },
  joinButton: {
    alignItems: "center",
    backgroundColor: ColorList.indicatorColor,
    alignSelf: 'flex-end',
    width: 100,
    marginTop: 4,
    marginBottom: 10,
    borderRadius: 5,
  },
});
/*marginTop:this.props.location.length > 19?15:this.props.location.length > 38?5:35*/
