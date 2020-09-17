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
import  EvilIcons  from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Spinner from '../../../../Spinner';
import GState from "../../../../../stores/globalState";
import IDMaker from '../../../../../services/IdMaker';
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

  componentDidUpdate(prevProps, prevState) {
   if (prevProps.highlight_id !== this.props.highlight_id) {
         stores.Highlights.readFromStore().then((Highlights) => {
          let highlight = find(Highlights[this.props.event_id], {
            id: this.props.highlight_id || request.Highlight().id,
          });
          this.setStatePure({
            newing: !this.state.newing,
            isMounted: true,
            currentHighlight: highlight ? highlight : request.Highlight(),
            update: this.props.highlight_id ? true : false,
          });
        });
    }
  }
  backdropPressToClose = false
  componentDidMount() {
   this.openModalTimeout = setTimeout(() => {
      stores.Highlights.readFromStore().then((Highlights) => {
        let highlight = find(Highlights[this.props.event_id], {
          id: this.props.highlight_id || request.Highlight().id,
        });
        this.setStatePure({
          newing: !this.state.newing,
          isMounted: true,
          currentHighlight:this.props.star?this.props.star:highlight ? highlight : request.Highlight(),
        });
      });
    }, 100);
  }


  back() {
    this.setStatePure({ newing: !this.state.newing, animateHighlight: false });
    this.props.onClosed(this.props.star);
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
      currentHighlight: {...this.state.currentHighlight,title:value},
    });
    if (!this.props.updateState) {
      stores.Highlights.updateHighlightTitle(this.props.event_id,
        this.state.currentHighlight,
        false
      ).then(() => {});
    }
  }
  onChangedDescription(value) {
    //this.setStatePure({newing:!this.state.newing,description:value})
    //this.state.currentHighlight.description = value;
    this.setStatePure({
      newing: !this.state.newing,
      currentHighlight: {...this.state.currentHighlight,description:value},
    });

    if (!this.props.updateState) {
      stores.Highlights.updateHighlightDescription(this.props.event_id,
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
    if (this.props.updateState === false) {
      stores.Highlights.updateHighlightPublicState(this.props.event_id, {
        highlight_id: this.state.currentHighlight.id,
        public_state: value,
      }).then((ele) => ele);
    }
  }

  AddHighlight() {
    let New_id = IDMaker.make();
    let newHighlight = this.state.currentHighlight;
    newHighlight.id = New_id;
    newHighlight.event_id = this.props.event_id
      ? this.props.event_id
      : request.Event().id; //new event id
    newHighlight.creator = stores.LoginStore.user.phone;
    newHighlight.created_at = moment().format();
      this.props.startLoader();
      this.props.onClosed();
      if (
        newHighlight.title ||
        newHighlight.url.audio ||
        newHighlight.url.photo ||
        newHighlight.url.video
      ) {
        this.setStatePure({
          creating: true,
        });
        Requester.createHighlight(newHighlight,this.props.isRelation?false:this.props.event.about.title)
          .then(() => {
            this.resetHighlight();
            stores.Highlights.removeHighlight(newHighlight.event_id, request.Highlight().id).then(() => {
              this.props.stopLoader();
              this.setStatePure({
                creating: false,
              });
            });
          })
          .catch(() => {
            this.props.stopLoader();
            this.setStatePure({
              creating: false,
            });
          });
      } else {
        Toaster({
          text: "Post Must include at least a media or title",
          duration: 5000,
          buttonText: "ok",
        });
        this.props.stopLoader();
      }
  }

  updateHighlight() {
    this.setStatePure({ newing: !this.state.newing, update: false });
    if (this.props.highlight_id) {
      this.props.update(this.state.currentHighlight);
      this.props.onClosed();
      //this.resetHighlight();
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
    if (!this.props.updateState) {
      stores.Highlights.updateHighlightUrl(this.props.event_id,
        this.state.currentHighlight,
        false
      ).then(() => { });
    }
  }

  swipeToClose=false
  cleanAudio() {
    if (!this.props.updateState) {
      stores.Highlights.updateHighlightUrl(this.props.event_id, {
        ...this.state.currentHighlight,
        url: {
          ...this.state.currentHighlight.url,
          audio: null,
          duration: null
        },
      },
        false
      ).then(() => {
        this.setStatePure({
          newing: !this.state.newing,
          currentHighlight: {
            ...this.state.currentHighlight,
            url: {
              ...this.state.currentHighlight.url,
              audio: null,
              duration: null
            },
          },
        });
      });
    } else {
      this.setStatePure({
        newing: !this.state.newing,
        currentHighlight: {
          ...this.state.currentHighlight,
          url: {
            ...this.state.currentHighlight.url,
            audio: null,
            duration: null
          },
        },
      });
    }
  }
  exchanger = null;
  cleanMedia() {
    if (!this.props.updateState) {
      this.setStatePure({
        newing: !this.state.newing,
        currentHighlight: {
          ...this.state.currentHighlight,
          url: {
            ...this.state.currentHighlight.url,
            photo: null,
            video: null,
            //audio: null,
            //duration: null
          },
        },
      });
      !this.props.updateState &&
        stores.Highlights.updateHighlightUrl(this.props.event_id, {
          ...this.state.currentHighlight,
          url: {
            ...this.state.currentHighlight.url,
            photo: null,
            video: null,
          },
        });
    } else {
      this.setStatePure({
        newing: !this.state.newing,
        currentHighlight: {
          ...this.state.currentHighlight,
          url: {
            ...this.state.currentHighlight.url,
            photo: null,
            video: null,
          },
        },
      });
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

  _getItemLayout = (data, index) => ({
    length: 100,
    offset: 100 * index,
    index,
  });
  rendering = 0;
  onClosedModal() {
    this.props.onClosed();
    this.setStatePure({
      animateHighlight: false,
    });
  }
  center={marginBottom: 'auto',marginTop: 'auto',}
  width='90%'
  modalBody() {
    return this.state.isMounted ? (
      <View>
       <CreationHeader
       back={this.back.bind(this)}
        title={this.props.updateState ? "Update Post" : "Add New Post"}
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
            <View style={{width:this.width,alignSelf: 'center',}}>
            <CreateTextInput
                height={height/11}
                value={this.state.currentHighlight.title
                  ? this.state.currentHighlight.title
                  : ""}
                onChange={this.onChangedTitle.bind(this)}
                placeholder={"title"}
            >
            </CreateTextInput>
            </View>
            <View style={{width:this.width,alignSelf: 'center',}}>
            <CreateTextInput
                height={height/6}
                value={this.state.currentHighlight.description
                  ? this.state.currentHighlight.description
                  : ""}
                onChange={this.onChangedDescription.bind(this)}
                placeholder={"description"}
                maxLength={3000}
                numberOfLines={5}
                multiline={true}
                backgroundColor={"#fbfafd"}
            >
            </CreateTextInput>
              </View>
              <View style={{ marginTop: 5, marginBottom: 5,width:this.width,alignSelf:"center",alignItems:"flex-start" }}>
                <PickersUpload
                  //notAudio
                  creating={!this.props.updateState}
                  currentURL={this.state.currentHighlight.url||{}}
                  id={this.state.currentHighlight.id}
                  saveMedia={(url) => {
                    this.applySave(url);
                  }}
                ></PickersUpload>
              </View>
                <View style={{width:this.width,alignSelf: 'center',}}>
              <MediaPreviewer
                height={ColorList.containerHeight * 0.22}
                defaultPhoto={this.state.defaultUrl}
                url={this.state.currentHighlight.url||{}}
                cleanMedia={() => this.cleanMedia()}
              ></MediaPreviewer>
              </View>
              {this.state.currentHighlight && 
                this.state.currentHighlight.url &&
                this.state.currentHighlight.url.audio ? (
                <View
                  style={{
                    height: height / 11,
                    alignSelf: "center",
                    backgroundColor: ColorList.bodyDarkWhite,
                    ...shadower(2),
                    margin: "3%",
                    width: this.width, 
                  }}
                >
                  <SimpleAudioPlayer
                    url={this.state.currentHighlight.url}
                  ></SimpleAudioPlayer>

                  <EvilIcons
                    name={"close"}
                    type="EvilIcons"
                    onPress={() => this.cleanAudio()}
                    style={{
                      color: "red",
                      position: "absolute",
                      alignSelf: "flex-end",
                      fontSize: 20,
                    }}
                  />
                </View>
              ) : null}
              
              <TouchableOpacity
                transparent
                onPress={() => {
                  this.onchangeHighLightPublicState(
                    this.state.currentHighlight.public_state === "public"
                      ? "private"
                      : "public"
                  );
                }}
                style={{marginTop:"3%",flexDirection:"row",height:40,alignItems:"center",
                width:this.width,
                alignSelf: 'center',
                marginBottom: '3%',}}
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
                    fontSize:22,
                    width:'15%',
                    ...this.center}}
                />
                <Text style={{color:ColorList.bodyText,...this.center}}>{`${this.state.currentHighlight.public_state}`}</Text>
              </TouchableOpacity>


                {this.state.creating ? (
                  <Spinner></Spinner>
                ) :<CreateButton
                    action={!this.props.updateState ? this.AddHighlight.bind(this) : this.updateHighlight.bind(this)}
                    title={!this.props.updateState ? "Add New Post" : "Update Post"}
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
}