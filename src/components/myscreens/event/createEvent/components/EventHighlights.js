import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner, Root,
  Button, InputGroup, DatePicker, Thumbnail, Alert, List, ListItem, Label, Toast
} from "native-base";
import { StyleSheet, View, Image, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import CacheImages from "../../../../CacheImages";
import Textarea from 'react-native-textarea';
import HighlightCard from "./HighlightCard"
import PhotoEnlargeModal from "../../../invitations/components/PhotoEnlargeModal";
import ImagePicker from 'react-native-customized-image-picker';
import stores from '../../../../../stores/index';
import { observer } from 'mobx-react'
import moment from "moment"
import { find, reject, } from "lodash";
import request from "../../../../../services/requestObjects";
import SearchImage from './SearchImage';
import BleashupHorizontalFlatList from '../../../../BleashupHorizotalFlatList';
import testForURL from '../../../../../services/testForURL'
import SimpleAudioPlayer from "../../../highlights_details/SimpleAudioPlayer";
import Pickers from '../../../../../services/Picker';
import FileExachange from '../../../../../services/FileExchange';

//create an extension to toast so that it can work in my modal


var uuid = require('react-native-uuid');
uuid.v1({
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: Math.floor(Math.random() * 5678) + 50
});





const options = {
  title: 'Select Avatar',
  //customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
    maxWidth: 600,
    maxHeight: 500,
    noData: true,
    allowEditing: true,
    quality: 0.8
  },
};

let { height, width } = Dimensions.get('window');



export default class EventHighlights extends Component {

  constructor(props) {
    super(props);
    this.state = {
      enlargeImage: false,
      title: "",
      description: "",
      url: "",
      defaultUrl: require('../../../../../../Images/highlightphoto.jpg'),
      initialScrollIndex: 2,
      highlightData: [],
      animateHighlight: false,
      currentHighlight: request.Highlight(),
      update: false,
      audioState: false,
      searchImageState: false,
      participant: null,
      isMounted: false

    }

  }





  componentDidMount() {
    setTimeout(() => {
      //i set the current new highlight data on startUp
      stores.Highlights.readFromStore().then(Highlights => {
        //console.warn(Highlights,"All higlights");
        let highlight = find(Highlights, { id: this.props.highlight_id ? this.props.highlight_id : "newHighlightId" });
        console.warn(highlight, "constructor higlight");
        this.setState({ currentHighlight: highlight });
      });

      //On startUp for each highlightId in new Event i set all the highlightData

      if (!this.props.event_id) {
        let event_id = "newEventId";
        stores.Highlights.fetchHighlights(event_id).then(Highlights => {
          this.setState({ highlightData: Highlights })
        })
      }



      setInterval(() => {
        if ((this.state.animateHighlight == true) && (this.state.highlightData.length > 2)) {
          this.highlight_flatlistRef.scrollToIndex({ animated: true, index: this.state.initialScrollIndex, viewOffset: 0, viewPosition: 0 });

          if (this.state.initialScrollIndex >= (this.state.highlightData.length) - 2) {
            this.setState({ initialScrollIndex: 0 })
          } else {
            this.setState({ initialScrollIndex: this.state.initialScrollIndex + 2 })
          }
        }
      }, 4000)

      this.setState({ isMounted: true });

    }, 400)

  }


  @autobind
  TakePhotoFromCamera() {
    Pickers.SnapPhoto(true).then(snap => {
      let exchanger = new FileExachange(snap.source,
        '/Photo/', 0, 0, (writen, total) => {
          console.warn('writen: ', writen)
        }, (newDir, path, filename) => {
          this.setState({ currentHighlight: {...this.state.currentHighlight,
            url:{...this.state.currentHighlight.url,
              photo:path}} });
          if (this.state.update == false) {
            stores.Highlights.updateHighlightUrl(this.state.currentHighlight, false).then(() => { });
          }
        }, null, (error) => {
          console.warn(error)
          Toast.show({ text: "Unable to Upload Photo!" })
        }, snap.content_type, snap.filename, '/photo')
      exchanger.upload()
    })
  }


  @autobind
  TakePhotoFromLibrary() {
    return new Promise((resolve, reject) => {

      ImagePicker.openPicker({
        cropping: true,
        quality: "medium"
      }).then(response => {
        let res = head(response);
        resolve(res.path);
        this.state.currentHighlight.url.photo = res.path;
        this.setState({ currentHighlight: this.state.currentHighlight });
        if (this.state.update == false) {
          stores.Highlights.updateHighlightUrl(this.state.currentHighlight, false).then(() => { });
        }
      })
    })

  }






  @autobind
  back() {
    this.setState({ animateHighlight: false })
    this.props.onClosed();
  }

  @autobind
  resetHighlight() {
    this.state.currentHighlight = request.Highlight();
    this.state.currentHighlight.id = "newHighlightId";
    this.setState({ currentHighlight: this.state.currentHighlight });
  }



  @autobind
  onChangedTitle(value) {
    //this.setState({title:value})
    this.state.currentHighlight.title = value;
    this.setState({ currentHighlight: this.state.currentHighlight });
    if (this.state.update == false) {
      stores.Highlights.updateHighlightTitle(this.state.currentHighlight, false).then(() => { });
    }

  }
  @autobind
  onChangedDescription(value) {
    //this.setState({description:value})
    this.state.currentHighlight.description = value;
    this.setState({ currentHighlight: this.state.currentHighlight });

    if (this.state.update == false) {
      stores.Highlights.updateHighlightDescription(this.state.currentHighlight, false).then(() => { });
    }


  }

  @autobind
  AddHighlight() {

    var arr = new Array(32);
    let num = Math.floor(Math.random() * 16)
    uuid.v1(null, arr, num);
    let New_id = uuid.unparse(arr, num);

    stores.Highlights.readFromStore().then(Highlights => {
      let newHighlight = request.Highlight();
      let highlight = find(Highlights, { id: "newHighlightId" });
      newHighlight = highlight;
      newHighlight.id = New_id;
      newHighlight.event_id = this.props.event_id ? this.props.event_id : "newEventId";   //new event id

      //add the new highlights to global highlights
      stores.LoginStore.getUser().then((user) => {
        newHighlight.creator = user.name;
        newHighlight.created_at = moment().format("YYYY-MM-DD HH:mm");
      })
      if (!this.props.event_id) {
        this.setState({ highlightData: [...this.state.highlightData, newHighlight] }, () => { console.log("after", this.state.highlightData) });
      }
      if (this.props.event_id) {
        this.props.parentComponent.setState({ highlightData: [...this.props.parentComponent.state.highlightData, newHighlight] }, () => { console.log("after", this.props.parentComponent.state.highlightData) });

      }

      stores.Highlights.addHighlights(newHighlight).then(() => { });
      //add the new highlight id to our newly created event for it to be accessed later when needed using this id
      stores.Events.addHighlight(newHighlight.event_id, newHighlight.id, false).then(() => { });
      stores.Events.readFromStore().then((Events) => { console.warn(Events, "After highlight id insertion"); })
      //reset the class currentHighlight state
      this.resetHighlight();
      //delete highlight and add a new highlight empty One
      stores.Highlights.removeHighlight("newHighlightId").then(() => { });
      stores.Highlights.addHighlights(this.state.currentHighlight).then(() => { });
      //stores.Highlights.resetHighlight(this.state.currentHighlight,false).then(()=>{});
    });

    if (this.props.event_id) {
      this.props.onClosed();
    }

  }

  @autobind
  updateHighlight() {
    stores.Highlights.updateHighlight(this.state.currentHighlight, false).then(() => { });
    this.resetHighlight();
    this.setState({ update: false });
    if (this.props.highlight_id) {
      this.props.onClosed();
    }

  }
  choseAction(url) {

  }
  @autobind
  deleteHighlight(id) {
    this.state.highlightData = reject(this.state.highlightData, { id, id });
    this.setState({ highlightData: this.state.highlightData });
  }


  _keyExtractor = (item, index) => item.id;


  _getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )



  render() {
    return this.state.isMounted ? (

      <Modal
        isOpen={this.props.isOpen}
        onClosed={() => {
          this.props.onClosed()
          this.setState({ animateHighlight: false })
        }}
        style={{
          height: this.props.event_id ? "70%" : "100%", width: "100%", borderTopLeftRadius: 10, borderTopRightRadius: 10,
          backgroundColor: "#FEFFDE", borderColor: 'black', flexDirection: 'column'
        }}
        coverScreen={true}
        position={'bottom'}
        swipeToClose={false}
      >
        <View style={{ height: "100%", width: "100%" }}>
          {!this.props.event_id ?
            <View style={{ height: "8%", width: "96%", marginLeft: "2%", marginRight: "2%" }}>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity>
                  <Icon onPress={this.back} type='MaterialCommunityIcons' name="keyboard-backspace" style={{ color: "#1FABAB" }} />
                </TouchableOpacity>
                <Text style={{ marginLeft: "27%", fontWeight: "500" }}>New Highlight</Text>
              </View>
            </View> : null
          }
          <View style={{ height: !this.props.event_id ? "95%" : "100%", width: "90%", alignSelf: 'center', }}>
            <ScrollView showsVerticalScrollIndicator={false} ref={"svrollView"} >
              <View style={{ height: "100%" }}>
                {this.state.highlightData.length > 0 ? <View style={{ height: this.state.highlightData.length == 0 ? 0 : height / 4 + height / 14, width: "100%", borderColor: "gray", borderWidth: 1 }} >
                  <BleashupHorizontalFlatList
                    initialRender={4}
                    renderPerBatch={5}
                    firstIndex={0}
                    refHorizontal={(ref) => { this.highlight_flatlistRef = ref }}
                    keyExtractor={this._keyExtractor}
                    dataSource={this.state.highlightData}
                    parentComponent={this}
                    getItemLayout={this._getItemLayout}
                    renderItem={(item, index) => {
                      return (
                        <HighlightCard participant={this.props.participant} parentComponent={this} item={item} ancien={false}
                          deleteHighlight={(id) => { this.deleteHighlight(id) }} ref={"higlightcard"} />
                      );
                    }}
                  >
                  </BleashupHorizontalFlatList>
                </View> : null}
                <View style={{ height: height / 13, alignItems: 'center', margin: '2%', }}>
                  {/* <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"500",fontSize:16}} >Title :</Text>*/}
                  <Item style={{ borderColor: '1FABAB', width: "95%", margin: '2%', }} rounded>
                    <Input value={this.state.currentHighlight.title} maxLength={40} placeholder='Highlight Title' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                      onChangeText={(value) => this.onChangedTitle(value)} />
                  </Item>
                </View>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItem: 'center', marginBottom: "2%" }}>
                  <TouchableOpacity style={{ width: "15%", justifyContent: 'center', alignItem: 'center', marginLeft: "7%" }}
                    onPress={() => { this.TakePhotoFromCamera() }}>
                    <View style={{ flexDirection: "column" }}>
                      <Icon name="photo-camera" active={true} type="MaterialIcons"
                        style={{ color: "#0A4E52", alignSelf: "flex-start" }} />
                      <Text style={{ fontSize: 10, marginBottom: 6 }}>Photo</Text>
                    </View>
                  </TouchableOpacity>

                  {/* <TouchableOpacity style={{width:"18%",backgroundColor:"transparent",justifyContent:'center',alignItem:'center'}} 
                    onPress={()=>{this.TakePhotoFromLibrary().then(source=>{})}}>
                         <View style={{flexDirection:"column"}}>
                            <Icon name="photo" active={true} type="FontAwesome"
                               style={{color: "#0A4E52",alignSelf:"flex-start"}}/>
                            <Text style={{fontSize:10}}>Library</Text>
                          </View>
                    </TouchableOpacity>*/}
                  <TouchableOpacity style={{ width: "15%", backgroundColor: "transparent", justifyContent: 'center', alignItem: 'center' }}
                    onPress={() => { this.TakePhotoFromLibrary().then(source => { }) }}>
                    <View style={{ flexDirection: "column" }}>
                      <Icon name="video" active={true} type="Entypo"
                        style={{ color: "#0A4E52", alignSelf: "flex-start" }} />
                      <Text style={{ fontSize: 10, marginBottom: 6 }}>Videos</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: "15%", backgroundColor: "transparent", justifyContent: 'center', alignItem: 'center' }}
                    onPress={() => { this.setState({ searchImageState: true }) }}>
                    <View style={{ flexDirection: "column" }}>
                      <Icon name="microphone" active={true} type="FontAwesome"
                        style={{ color: "#0A4E52", alignSelf: "flex-start" }} />
                      <Text style={{ fontSize: 10, marginBottom: 6 }}>Audio</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: "15%", backgroundColor: "transparent", justifyContent: 'center', alignItem: 'center' }}
                    onPress={() => { this.setState({ searchImageState: true }) }}>
                    <View style={{ flexDirection: "column" }}>
                      <Icon name="web" active={true} type="MaterialCommunityIcons"
                        style={{ color: "#0A4E52", alignSelf: "flex-start", marginLeft: 7 }} />
                      <Text style={{ fontSize: 10, marginBottom: 6 }}>Download</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {this.state.currentHighlight.url.audio &&
                  <View style={{ height: height / 9, backgroundColor: "yellow", elevation: 10, marginBottom: "5%" }}>
                    <SimpleAudioPlayer uri={this.state.currentHighlight.url}></SimpleAudioPlayer>
                  </View>}
                <View style={{ height: height / 4 - height / 18, width: "90%", alignSelf: 'center', }}>
                  <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItem: 'center' }}>
                    <TouchableOpacity onPress={() => this.setState({ enlargeImage: true })} >
                      {this.state.currentHighlight.url && this.state.currentHighlight.url.photo && testForURL(this.state.currentHighlight.url.photo) ?
                        <CacheImages thumbnails source={{ uri: this.state.currentHighlight.url.photo }} style={{
                          alignSelf: 'center',
                          height: "100%", width: "100%",
                          borderColor: "#1FABAB", borderRadius: 100,
                        }} /> : <Thumbnail square
                          source={this.state.currentHighlight.url &&
                            this.state.currentHighlight.url.photo ? {
                              uri:
                                this.state.currentHighlight.url.photo
                            } : this.state.defaultUrl} style={{
                              alignSelf: 'center',
                              height: "100%", width: "100%", borderColor: "#1FABAB", borderRadius: 100
                            }}></Thumbnail>}
                    </TouchableOpacity>
                    {/*this.state.currentHighlight.url.video || this.state.currentHighlight.url.audio ? */<View style={{ position: 'absolute', marginTop: '15%', marginLeft: '36%', opacity: .9 }}>
                      <Icon onPress={() => {
                        this.choseAction(this.state.currentHighlight.url)
                      }} name={this.state.currentHighlight.url.video ? "play" : "headset"} style={{
                        fontSize: 50, color: '#FEFFDE', alignSelf: 'center'
                      }} type={this.state.currentHighlight.url.video ? "EvilIcons" : "MaterialIcons"}>
                      </Icon></View>/* : null*/}
                  </View>
                  <PhotoEnlargeModal isOpen={this.state.enlargeImage} onClosed={() => this.setState({ enlargeImage: false })} photo={this.state.currentHighlight.url.photo} />
                </View>
                <View style={{ height: height / 4.5, alignItems: 'flex-start', justifyContent: 'center' }}>
                  <View style={{ width: "90%", height: "90%", alignSelf: 'center', }}>

                    {/* <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"500",fontSize:16}} >Description :</Text>*/}
                    <Textarea value={this.state.currentHighlight.description}
                      containerStyle={{
                        width: "100%", margin: "1%",
                        height: 130,
                        borderRadius: 10, borderWidth: 1,
                        borderColor: "#1FABAB",
                        backgroundColor: "#f5fffa"
                      }}
                      placeholder="Highlight Description"
                      style={{
                        textAlignVertical: 'top',  // hack android
                        height: "100%",
                        fontSize: 14,
                        color: '#333',
                      }}
                      maxLength={1000}
                      onChangeText={(value) => this.onChangedDescription(value)} />
                  </View>
                </View>
                <View style={{ height: height / 10, justifyContent: 'space-between', alignItem: 'center' }}>
                  {!this.state.update ?
                    <TouchableOpacity style={{ alignSelf: 'flex-end', elevaation: 10 }}>
                      <Button onPress={() => { this.AddHighlight() }} rounded>
                        <Text style={{ color: "#FEFFDE" }}>{"Ok"}</Text>
                      </Button>
                    </TouchableOpacity> :
                    <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
                      <Button
                        onPress={() => { this.updateHighlight() }} rounded>
                        <Text style={{ color: "#FEFFDE" }}>{"Ok"}</Text>
                      </Button>
                    </TouchableOpacity>}
                </View>
              </View>
            </ScrollView>
          </View>
          <SearchImage accessLibrary={() => { this.TakePhotoFromLibrary().then(() => { }) }} isOpen={this.state.searchImageState} onClosed={() => { this.setState({ searchImageState: false }) }} />
        </View>
      </Modal>

    ) : <Spinner size={"small"} style={{ alignSelf: "center" }}></Spinner>
  }

}