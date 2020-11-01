import React, { Component } from "react";

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import Modal from "react-native-modalbox";
import CacheImages from "../../../../CacheImages";
import HighlightCard from "./HighlightCard";
import stores from "../../../../../stores/index";
import moment from "moment";
import { find, reject } from "lodash";
import request from "../../../../../services/requestObjects";
import SearchImage from "./SearchImage";
import BleashupHorizontalFlatList from "../../../../BleashupHorizotalFlatList";
import testForURL from "../../../../../services/testForURL";
import SimpleAudioPlayer from "../../../highlights_details/SimpleAudioPlayer";
import Pickers from "../../../../../services/Picker";
import FileExachange from "../../../../../services/FileExchange";
import PhotoViewer from "../../PhotoViewer";
import shadower from "../../../../shadower";
import Requester from "../../Requester";
import buttoner from "../../../../../services/buttoner";
import ColorList from "../../../../colorList";
import BleashupModal from "../../../../mainComponents/BleashupModal";
import bleashupHeaderStyle from "../../../../../services/bleashupHeaderStyle";
import PickersUpload from "./PickerUpload";
import MediaPreviewer from "./MediaPeviewer";
import CreationHeader from "./CreationHeader";
import CreateButton from './ActionButton';
import CreateTextInput from './CreateTextInput';
import Toaster from "../../../../../services/Toaster";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Spinner from '../../../../Spinner';
import GState from "../../../../../stores/globalState";
import IDMaker from '../../../../../services/IdMaker';
import Texts from '../../../../../meta/text';
import public_states from '../../../reminds/public_states';
//create an extension to toast so that it can work in my modal



const options = {
  title: "Select Avatar",
  //customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: "images",
    maxWidth: 600,
    maxHeight: 500,
    noData: true,
    allowEditing: true,
    quality: 0.8,
  },
};

let { height, width } = Dimensions.get("window");

export default class EventHighlights extends BleashupModal {
  initialize() {
    this.state = {
      enlargeImage: false,
      title: "",
      description: "",
      url: "",
      defaultUrl: require("../../../../../../Images/post.png"),
      initialScrollIndex: 2,
      highlightData: [],
      animateHighlight: false,
      currentHighlight: request.Highlight(),
      update: false,
      audioState: false,
      searchImageState: false,
      participant: null,
      isMounted: false,
    };
  }
  isRoute = this.props.navigation && true
  getParam = (param) => this.isRoute && this.props.navigation.getParam(param)
  event_id = this.getParam("event_id") || this.props.event_id
  highlight_id = this.getParam("highlight_id") || this.props.highlight_id
  star = this.getParam("star") || this.props.star
  event = this.getParam("event") || this.props.event
  updateState = this.getParam("updateState") || this.props.updateState
  isRelation = this.getParam("isRelation") || this.props.isRelation
  stopLoader = this.getParam("stopLoader") || this.props.stopLoader
  startLoader = this.getParam("startLoader") || this.props.startLoader
  update = this.getParam("update") || this.props.update
  creatStar = this.getParam("createStar") || this.props.creatStar
  backdropPressToClose = false
  componentDidMount() {
    this.init()
  }

  init() {
    this.openModalTimeout = setTimeout(() => {
      stores.Highlights.readFromStore().then((Highlights) => {
        let highlight = find(Highlights[this.event_id], {
          id: this.highlight_id || request.Highlight().id,
        });
        this.setStatePure({
          newing: !this.state.newing,
          isMounted: true,
          currentHighlight: this.star ? this.star : (highlight || request.Highlight()),
        });
        !highlight && stores.Highlights.addHighlight(this.event_id,request.Highlight())
      });
    }, 100);
  }
  back() {
    if (this.isRoute) {
      this.props.navigation.goBack()
    } else {
      this.props.onClosed(this.star);
    }
  }

  resetHighlight() {
    this.state.currentHighlight = request.Highlight();
    this.state.currentHighlight.id = request.Highlight().id;
    this.setStatePure({
      newing: !this.state.newing,
      currentHighlight: this.state.currentHighlight,
    });
  }

  onChangedTitle(value) {
    this.setStatePure({
      newing: !this.state.newing,
      currentHighlight: { ...this.state.currentHighlight, title: value },
    });
    if (!this.updateState) {
      stores.Highlights.updateHighlightTitle(this.event_id,
        this.state.currentHighlight,
        false
      ).then(() => { });
    }
  }
  onChangedDescription(value) {
    //this.setStatePure({newing:!this.state.newing,description:value})
    //this.state.currentHighlight.description = value;
    this.setStatePure({
      newing: !this.state.newing,
      currentHighlight: { ...this.state.currentHighlight, description: value },
    });

    if (!this.updateState) {
      stores.Highlights.updateHighlightDescription(this.event_id,
        this.state.currentHighlight,
        false
      ).then(() => { });
    }
  }

  onchangeHighLightPublicState(value) {
    this.setStatePure({
      currentHighlight: { ...this.state.currentHighlight, public_state: value },
      newing: !this.state.newing,
    });
    if (this.updateState === false) {
      stores.Highlights.updateHighlightPublicState(this.event_id, {
        highlight_id: this.state.currentHighlight.id,
        public_state: value,
      }).then((ele) => ele);
    }
  }

  AddHighlight() {
    let New_id = IDMaker.make();
    let newHighlight = this.state.currentHighlight;
    newHighlight.id = New_id;
    newHighlight.event_id = this.event_id
      ? this.event_id
      : request.Event().id; //new event id
    newHighlight.creator = stores.LoginStore.user.phone;
    newHighlight.created_at = moment().format();
    if (
      newHighlight.title ||
      newHighlight.url.audio ||
      newHighlight.url.photo ||
      newHighlight.url.video ||
      newHighlight.url.source
    ) {
      this.creatStar(newHighlight);
      this.back()
    } else {
      Toaster({
        text: Texts.star_must_have_at_least,
        duration: 5000,
        buttonText: "ok",
      });
    }
  }

  updateHighlight() {
    if (this.highlight_id) {
      this.update(this.state.currentHighlight);
      this.back()
    }
  }
  applySave(url) {
    this.setStatePure({
      newing: !this.state.newing,
      currentHighlight: {
        ...this.state.currentHighlight,
        url: url
      },
    });
    if (!this.updateState) {
      stores.Highlights.updateHighlightUrl(this.event_id,
        this.state.currentHighlight,
        false
      ).then(() => { });
    }
  }
 
  deleteHighlight(id) {
    this.state.highlightData = reject(this.state.highlightData, { id, id });
    this.setStatePure({
      newing: !this.state.newing,
      highlightData: this.state.highlightData,
    });
  }

  _keyExtractor = (item, index) => item.id;

  rendering = 0;
  onClosedModal() {
    this.props.onClosed();
    this.setStatePure({
      animateHighlight: false,
    });
  }
  center = { marginBottom: 'auto', marginTop: 'auto', }
  width = '90%'
  modalBody() {
    return this.state.isMounted ? (
      <View>
        <CreationHeader
          back={this.back.bind(this)}
          title={this.updateState ? Texts.edit_post : Texts.add_highlight}
        >
        </CreationHeader>
        <View
          style={{
            height: ColorList.containerHeight - (ColorList.headerHeight + 10),
            width: '100%',
            alignSelf: "center",
          }}
        >
          <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false} ref={"scrollView"}>
            <View style={{ height: "100%" }}>
              <View style={{ width: this.width, alignSelf: 'center', }}>
                <CreateTextInput
                  height={height / 11}
                  value={this.state.currentHighlight.title
                    ? this.state.currentHighlight.title
                    : ""}
                  onChange={this.onChangedTitle.bind(this)}
                  maxLength={100}
                  placeholder={Texts.title}
                >
                </CreateTextInput>
              </View>
              <View style={{ width: this.width, alignSelf: 'center', }}>
                <CreateTextInput
                  height={height / 6}
                  value={this.state.currentHighlight.description
                    ? this.state.currentHighlight.description
                    : ""}
                  onChange={this.onChangedDescription.bind(this)}
                  placeholder={Texts.details}
                  numberOfLines={5}
                  multiline={true}
                  backgroundColor={"#fbfafd"}
                >
                </CreateTextInput>
              </View>
              <View style={{ marginTop: 5, marginBottom: 5, width: this.width, alignSelf: "center", alignItems: "flex-start" }}>
                <PickersUpload
                  //notAudio
                  creating={!this.updateState}
                  currentURL={this.state.currentHighlight.url || {}}
                  id={this.state.currentHighlight.id}
                  saveMedia={(url) => {
                    this.applySave(url);
                  }}
                ></PickersUpload>
              </View>
              <View style={{ width: this.width, alignSelf: 'center', }}>
                <MediaPreviewer
                  data={{ id: this.state.currentHighlight.id + '_create' }}
                  height={ColorList.containerHeight * 0.22}
                  defaultPhoto={this.state.defaultUrl}
                  url={this.state.currentHighlight.url || {}}
                  cleanMedia={() => this.applySave({})}
                ></MediaPreviewer>
              </View>
              <TouchableOpacity
                transparent
                onPress={() => {
                  this.onchangeHighLightPublicState(
                    this.state.currentHighlight.public_state === "public"
                      ? public_states.private_
                      : public_states.public_
                  );
                }}
                style={{
                  marginTop: "3%", flexDirection: "row", height: 40, alignItems: "center",
                  width: this.width,
                  alignSelf: 'center',
                  marginBottom: '3%',
                }}
              >
                <MaterialIcons
                  name={
                    this.state.currentHighlight.public_state === "public"
                      ? "radio-button-checked"
                      : "radio-button-unchecked"
                  }
                  type={"MaterialIcons"}
                  style={{
                    ...GState.defaultIconSize,
                    fontSize: 22,
                    width: '15%',
                    ...this.center
                  }}
                />
                <Text style={{ color: ColorList.bodyText, ...this.center }}>{`${Texts[this.state.currentHighlight.public_state]}`}</Text>
              </TouchableOpacity>


              {this.state.creating ? (
                <Spinner></Spinner>
              ) : <CreateButton
                action={!this.updateState ? this.AddHighlight.bind(this) : this.updateHighlight.bind(this)}
                title={!this.updateState ? Texts.add : Texts.edit}
                width={this.width}
              >
                </CreateButton>}

            </View>
          </ScrollView>
        </View>
      </View>
    ) : (
        <Spinner size={"small"} style={{ alignSelf: "center" }}></Spinner>
      );
  }
  render() {
    return this.isRoute ? this.modalBody() : this.modal()
  }
}