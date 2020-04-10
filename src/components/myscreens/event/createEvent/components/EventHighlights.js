import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner, Root,
  Button, InputGroup, DatePicker, Thumbnail, Alert, List, ListItem, Label, Toast
} from "native-base";
import { StyleSheet, View, Image, TouchableOpacity, FlatList, ScrollView, Dimensions, TextInput } from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import CacheImages from "../../../../CacheImages";
import Textarea from 'react-native-textarea';
import HighlightCard from "./HighlightCard"
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
import PhotoViewer from '../../PhotoViewer';
import { RNFFmpeg } from 'react-native-ffmpeg';
import shadower from '../../../../shadower';
import Requester from '../../Requester';
import buttoner from "../../../../../services/buttoner";

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




  componentDidUpdate(prevProps, prevState) {
    if (prevProps.highlight_id !== this.props.highlight_id) {
      setTimeout(() => {
        stores.Highlights.readFromStore().then(Highlights => {
          let highlight = find(Highlights, {
            id: this.props.highlight_id ?
              this.props.highlight_id : "newHighlightId"
          });
          this.previoushighlight = JSON.stringify(highlight)
          if (!this.props.event_id) {
            let event_id = "newEventId";
            stores.Highlights.fetchHighlights(event_id).then(Highlights => {
              this.setState({
                newing: !this.state.newing, highlightData: Highlights,
                isMounted: true, currentHighlight:
                  highlight ? highlight : request.Highlight(), update:
                  this.props.highlight_id ? true : false
              })
            })
          } else {
            this.setState({
              newing: !this.state.newing, isMounted: true,
              currentHighlight: highlight ? highlight :
                request.Highlight(), update:
                this.props.highlight_id ? true : false
            })
          }
        });
        /*setInterval(() => {
          if ((this.state.animateHighlight == true) && (this.state.highlightData.length > 2)) {
            this.highlight_flatlistRef.scrollToIndex({ animated: true, index: this.state.initialScrollIndex, viewOffset: 0, viewPosition: 0 });
  
            if (this.state.initialScrollIndex >= (this.state.highlightData.length) - 2) {
              this.setState({ newing: !this.state.newing, initialScrollIndex: 0 })
            } else {
              this.setState({ newing: !this.state.newing, initialScrollIndex: this.state.initialScrollIndex + 2 })
            }
          }
        }, 4000)*/
      }, 100)
    }
  }

  componentDidMount() {
    setTimeout(() => {
      stores.Highlights.readFromStore().then(Highlights => {
        let highlight = find(Highlights, {
          id: this.props.highlight_id ?
            this.props.highlight_id : "newHighlightId"
        });
        if (!this.props.event_id) {
          let event_id = "newEventId";
          stores.Highlights.fetchHighlights(event_id).then(Highlights => {
            this.setState({
              newing: !this.state.newing, highlightData: Highlights,
              isMounted: true, currentHighlight:
                highlight ? highlight : request.Highlight(), update:
                this.props.highlight_id ? true : false
            })
          })
        } else {
          this.setState({
            newing: !this.state.newing, isMounted: true,
            currentHighlight: highlight ? highlight :
              request.Highlight(), update:
              this.props.highlight_id ? true : false
          })
        }
      });
      /*setInterval(() => {
        if ((this.state.animateHighlight == true) && (this.state.highlightData.length > 2)) {
          this.highlight_flatlistRef.scrollToIndex({ animated: true, index: this.state.initialScrollIndex, viewOffset: 0, viewPosition: 0 });

          if (this.state.initialScrollIndex >= (this.state.highlightData.length) - 2) {
            this.setState({ newing: !this.state.newing, initialScrollIndex: 0 })
          } else {
            this.setState({ newing: !this.state.newing, initialScrollIndex: this.state.initialScrollIndex + 2 })
          }
        }
      }, 4000)*/
    }, 100)

  }


  @autobind
  TakePhotoFromCamera() {
    Pickers.SnapPhoto(true).then(snap => {
      this.setState({
        newing: !this.state.newing,
        uploading: true
      })
      this.clear()
      this.exchanger = new FileExachange(snap.source,
        '/Photo/', 0, 0, (writen, total) => {
          console.warn('writen: ', writen)
        }, (newDir, path, filename) => {
          this.setState({
            newing: !this.state.newing,
            currentHighlight: {
              ...this.state.currentHighlight,
              url: {
                ...this.state.currentHighlight.url,
                photo: path,
                video: null
              }
            },
            uploading: false,
          });
          if (!this.props.updateState) {
            stores.Highlights.updateHighlightUrl(this.state.currentHighlight, false).then(() => { });
          }
        }, null, (error) => {
          console.warn(error)
          Toast.show({ text: "Unable to Upload Photo!" })
          this.setState({
            newing: !this.state.newing,
            uploading: false
          })
        }, snap.content_type, snap.filename, '/photo')
      !this.props.updateState ? this.state.currentHighlight.url.photo ||
        this.state.currentHighlight.url.video ?
        this.exchanger.deleteFile(this.state.currentHighlight.url.video ?
          this.state.currentHighlight.url.video :
          this.state.currentHighlight.url.photo) : null : null, true
      this.exchanger.upload()
    })
  }


  @autobind
  TakePhotoFromLibrary() {
    Pickers.SnapVideo().then(snaper => {
      this.setState({
        newing: !this.state.newing,
        uploading: true
      })
      this.clear()
      //Pickers.CompressVideo(snaper).then(snap => {
      this.exchanger = new FileExachange(snaper.source, "/Video/", 0, 0, null, (newDir, path, filename, baseURL) => {
        this.setState({
          newing: !this.state.newing,
          currentHighlight: {
            ...this.state.currentHighlight,
            url: {
              ...this.state.currentHighlight.url,
              photo: baseURL + filename.split('.')[0] + '_thumbnail.jpeg',
              video: path,
              //audio:null
            }
          },
          uploading: false
        })
        if (!this.props.updateState) {
          stores.Highlights.updateHighlightUrl(this.state.currentHighlight, false).then(() => { });
        }

      }, null, (error) => {
        this.setState({
          newing: !this.state.newing,
          uploading: false
        })
        Toast.show({ text: "Unable To Upload Video", position: "top" })
        console.warn(error)
      }, snaper.content_type, snaper.filename, '/video')
      !this.props.updateState ? this.state.currentHighlight.url.video ||
        this.state.currentHighlight.url.photo ?
        this.exchanger.deleteFile(
          this.state.currentHighlight.url.video ?
            this.state.currentHighlight.url.video :
            this.state.currentHighlight.url.photo) : null : null, true
      this.exchanger.upload()
    })
    //})
  }






  @autobind
  back() {
    this.setState({ newing: !this.state.newing, animateHighlight: false })
    this.props.onClosed();
  }

  @autobind
  resetHighlight() {
    this.state.currentHighlight = request.Highlight();
    this.state.currentHighlight.id = "newHighlightId";
    this.setState({ newing: !this.state.newing, currentHighlight: this.state.currentHighlight });
  }



  @autobind
  onChangedTitle(value) {
    //this.setState({newing:!this.state.newing,title:value})
    this.state.currentHighlight.title = value;
    this.setState({ newing: !this.state.newing, currentHighlight: this.state.currentHighlight });
    if (!this.props.updateState) {
      stores.Highlights.updateHighlightTitle(this.state.currentHighlight, false).then(() => { });
    }

  }
  @autobind
  onChangedDescription(value) {
    //this.setState({newing:!this.state.newing,description:value})
    this.state.currentHighlight.description = value;
    this.setState({ newing: !this.state.newing, currentHighlight: this.state.currentHighlight });

    if (!this.props.updateState) {
      stores.Highlights.updateHighlightDescription(this.state.currentHighlight, false).then(() => { });
    }


  }

  @autobind
  onchangeHighLightPublicState(value) {
    this.setState({
      currentHighlight: { ...this.state.currentHighlight, public_state: value },
      newing: !this.state.newing
    })
    if (this.props.updateState === false) {
      stores.Highlights.updateHighlightPublicState(
        {
          highlight_id: this.state.currentHighlight.id,
          public_state: value
        }).then((ele) => ele)
    }
  }

  @autobind
  AddHighlight() {
    var arr = new Array(32);
    let num = Math.floor(Math.random() * 16)
    uuid.v1(null, arr, num);
    let New_id = uuid.unparse(arr, num);
    let newHighlight = this.state.currentHighlight;
    newHighlight.id = New_id;
    newHighlight.event_id = this.props.event_id ? this.props.event_id : "newEventId";   //new event id
    //add the new highlights to global highlights
    newHighlight.creator = stores.LoginStore.user.phone;
    newHighlight.created_at = moment().format();
    if (!this.props.event_id) {
      stores.Highlights.addHighlight(newHighlight).then(() => {
        stores.Events.addHighlight(newHighlight.id, newHighlight.event_id).then(() => {
          this.setState({ newing: !this.state.newing, highlightData: [...this.state.highlightData, newHighlight] }, () => {
            console.log("after", this.state.highlightData)
          });
          this.resetHighlight();
          stores.Highlights.removeHighlight("newHighlightId").then(() => {
            this.setState({
              creating: false
            })
          });
        })
      })
    } else {
      this.props.startLoader()
      this.props.onClosed()
      if (newHighlight.title || newHighlight.url.audio || newHighlight.url.photo || newHighlight.url.video) {
        this.setState({
          creating: true
        })
        Requester.createHighlight(newHighlight).then(() => {
          this.props.reinitializeHighlightsList(newHighlight)
          this.resetHighlight();
          stores.Highlights.removeHighlight("newHighlightId").then(() => {
            this.props.stopLoader()
            this.setState({
              creating: false
            })
          });
        }).catch(() => {
          this.props.stopLoader()
          this.setState({
            creating: false
          })
        })
      } else {
        Toast.show({ text: 'Post Must include at least a media or title', duration: 5000, buttonText: 'ok' })
        this.props.stopLoader()
      }
    }
  }

  @autobind
  updateHighlight() {
    this.setState({ newing: !this.state.newing, update: false });
    if (this.props.highlight_id) {
      this.props.update(this.state.currentHighlight, this.previoushighlight)
      this.props.onClosed();
      //this.resetHighlight();
    }
  }
  choseAction(url) {
    if (url.video) {
      this.props.playVideo(url.video)
    } else {
      this.setState({
        newing: !this.state.newing,
        enlargeImage: true
      })
    }
  }
  cleanAudio() {
    console.warn('executing clean audio')
    this.clearAudio()
    if (!this.props.updateState) {
      this.audioExchanger = new FileExachange(null, null, null, null, null, () => {
        this.setState({
          newing: !this.state.newing,
          currentHighlight: {
            ...this.state.currentHighlight,
            url: {
              ...this.state.currentHighlight.url,
              //photo: this.state.currentHighlight.url.video ? null : this.state.currentHighlight.url.photo,
              //video: null,
              audio: null,
              duration: null
            }
          },
        })
        stores.Highlights.updateHighlightUrl(this.state.currentHighlight, false).then(() => { });

      },() => {
        Toast.show({text:'Unable to perform network request'})
      })
      this.audioExchanger.deleteFile(this.state.currentHighlight.url.audio)
    } else {
      this.setState({
        newing: !this.state.newing,
        currentHighlight: {
          ...this.state.currentHighlight,
          url: {
            ...this.state.currentHighlight.url,
            //photo: this.state.currentHighlight.url.video ? null : this.state.currentHighlight.url.photo,
            //video: null,
            audio: null,
            duration: null
          }
        },
      })
    }
  }
  exchanger = null
  clear() {
    this.exchanger && this.exchanger.task && this.exchanger.task.cancel && this.exchanger.task.cancel()
  }
  cleanMedia() {
    this.clear()
    if (!this.props.updateState) {
      this.exchanger = new FileExachange(null, null, null, null, null, () => {
        this.setState({
          newing: !this.state.newing,
          currentHighlight: {
            ...this.state.currentHighlight,
            url: {
              ...this.state.currentHighlight.url,
              photo: null,
              video: null,
              //audio: null,
              //duration: null
            }
          },
        })
        !this.props.updateState && stores.Highlights.updateHighlightUrl({
          ...this.state.currentHighlight,
          url: {
            ...this.state.currentHighlight.url,
            photo: null,
            video: null,
            //audio: null,
            //duration: null
          }
        }, false).then(() => { });
      }, () => {
        Toast.show({ text: 'unable to perform network request' })
      })
      this.exchanger.deleteFile(this.state.currentHighlight.url.video ?
        this.state.currentHighlight.url.video :
        this.state.currentHighlight.url.photo)
    } else {
      this.setState({
        newing: !this.state.newing,
        currentHighlight: {
          ...this.state.currentHighlight,
          url: {
            ...this.state.currentHighlight.url,
            photo: null,
            video: null,
            //audio: null,
            //duration: null
          }
        },
      })
    }
  }
  @autobind
  deleteHighlight(id) {
    this.state.highlightData = reject(this.state.highlightData, { id, id });
    this.setState({ newing: !this.state.newing, highlightData: this.state.highlightData });
  }
  clearAudio() {
    this.audioExchanger &&
      this.audioExchanger.task && 
      this.audioExchanger.task.cancel &&
      this.audioExchanger.task.cancel()
  }
  takeAudio() {
    Pickers.TakeAudio().then(audio => {
      if (audio) {
        console.warn(audio)
        this.setState({
          newing: !this.state.newing,
          uploading: true
        })
        this.clearAudio()
        this.audioExchanger = new FileExachange('file://' + audio.uri, '/Sound/', 0, 0, null,
          (newDir, path, filename) => {
            RNFFmpeg.getMediaInformation(path).then(info => {
              console.warn(info, path)
              this.setState({
                newing: !this.state.newing,
                currentHighlight: {
                  ...this.state.currentHighlight,
                  url: {
                    ...this.state.currentHighlight.url,
                    //photo: this.state.currentHighlight.url.video ? null : this.state.currentHighlight.url.photo,
                    //video: null,
                    audio: path,
                    duration: Math.ceil(info.duration / 1000)
                  }
                },
                uploading: false
              })
              if (!this.props.updateState) {
                stores.Highlights.updateHighlightUrl(this.state.currentHighlight, false).then(() => { });
              }
            })
          }, null, (error) => {
            Toast.show({ text: "Unable To Upload Audio", position: 'top' })
          }, audio.type, audio.name, '/sound')
        this.state.currentHighlight.url.audio ?
          this.audioExchanger.deleteFile(this.state.currentHighlight.url.audio, true).then(() => {
          }) : null
        this.audioExchanger .upload()
      }
    })
  }
  _keyExtractor = (item, index) => item.id;


  _getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )
  rendering = 0
  render() {
    this.rendering = this.rendering + 1
    return <Modal
      isOpen={this.props.isOpen}
      onClosed={() => {
        this.props.onClosed()
        this.clear()
        this.clearAudio()
        this.setState({ newing: !this.state.newing,uploading:false, animateHighlight: false,})
      }}
      style={{
        height: this.props.event_id ? "95%" : "100%", width: "100%", borderTopLeftRadius: 10, borderTopRightRadius: 10,
        backgroundColor: "#FEFFDE", borderColor: 'black', flexDirection: 'column'
      }}
      backButtonClose={true}
      coverScreen={true}
      position={'bottom'}
      swipeToClose={false}
    >{this.state.isMounted ?
      <View>
        <View style={{ height: "98%", width: "100%", marginTop: '3%', }}>{!this.props.event_id ?
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
            <ScrollView showsVerticalScrollIndicator={false} ref={"scrollView"} >
              <View style={{ height: "100%" }}>
                {this.state.highlightData.length > 0 ? <View style={{
                  height: this.state.highlightData.length == 0 ? 0 : height / 4 + height / 14,
                  width: "100%", borderColor: "gray",
                  borderWidth: 1
                }}>
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
                  />
                </View> : null}
                <View style={{ height: height / 14, alignItems: 'center', margin: '2%', }}>
                  <Item style={{ borderColor: '#1FABAB', width: "95%", margin: '2%', height: height / 17 }} rounded>
                    <TextInput maxLength={20} style={{ width: "100%", height: "100%", margin: '2%', marginBottom: '5%', }}
                      value={this.state.currentHighlight.title ? this.state.currentHighlight.title : ""}
                      maxLength={40} placeholder='Post Title' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                      onChangeText={(value) =>
                        this.onChangedTitle(value)
                      } />
                  </Item>
                </View>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', alignItem: 'center', marginBottom: "2%", ...shadower(6) }}>
                  <TouchableOpacity style={{ width: "15%", justifyContent: 'center', alignItem: 'center', marginLeft: "7%" }}
                    onPress={() => requestAnimationFrame(() => {
                      this.TakePhotoFromCamera()
                    })}>
                    <View style={{ flexDirection: "column" }}>
                      <Icon name="photo-camera" active={true} type="MaterialIcons"
                        style={{ color: "#0A4E52", alignSelf: "flex-start" }} />
                      <Text style={{ fontSize: 10, marginBottom: 6 }}>{"Photo"}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: "15%", backgroundColor: "transparent", justifyContent: 'center', alignItem: 'center' }}
                    onPress={() => requestAnimationFrame(() => { this.TakePhotoFromLibrary() })}>
                    <View style={{ flexDirection: "column" }}>
                      <Icon name="video" active={true} type="Entypo"
                        style={{ color: "#0A4E52", alignSelf: "flex-start" }} />
                      <Text style={{ fontSize: 10, marginBottom: 6 }}>{"Videos"}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: "15%", backgroundColor: "transparent", justifyContent: 'center', alignItem: 'center' }}
                    onPress={() => requestAnimationFrame(() => {
                      this.takeAudio()
                    })}>
                    <View style={{ flexDirection: "column" }}>
                      <Icon name="microphone" active={true} type="FontAwesome"
                        style={{ color: "#0A4E52", alignSelf: "flex-start" }} />
                      <Text style={{ fontSize: 10, marginBottom: 6 }}>{"Audio"}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: "15%", backgroundColor: "transparent", justifyContent: 'center', alignItem: 'center' }}
                    onPress={() => requestAnimationFrame(() => {
                      this.setState({
                        newing: !this.state.newing,
                        searchImageState: true
                      })
                    })}>
                    <View style={{ flexDirection: "column" }}>
                      <Icon name="web" active={true} type="MaterialCommunityIcons"
                        style={{ color: "#0A4E52", alignSelf: "flex-start", }} />
                      <Text style={{ fontSize: 10, marginBottom: 6 }}>{"Download"}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {this.state.currentHighlight.url.audio ?
                  <View style={{ height: height / 11, alignSelf: 'center', backgroundColor: "yellow", ...shadower(7), margin: '3%', width: '80%' }}>
                    <SimpleAudioPlayer url={this.state.currentHighlight.url}></SimpleAudioPlayer>
                    <Icon
                      name={'close'}
                      type="EvilIcons"
                      onPress={() => this.cleanAudio()} style={{
                        color: 'red',
                        position: 'absolute',
                        alignSelf: 'flex-end',
                        fontSize: 20
                      }}></Icon>
                  </View> : null}
                <View style={{ height: height / 4 - height / 18, width: "90%", alignSelf: 'center', }}>
                  <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItem: 'center', }}>
                    <TouchableOpacity onPress={() => this.setState({ newing: !this.state.newing, enlargeImage: true })} >
                      {this.state.currentHighlight.url && this.state.currentHighlight.url.photo && testForURL(this.state.currentHighlight.url.photo) ?
                        <CacheImages thumbnails source={{ uri: this.state.currentHighlight.url.photo }} style={{
                          alignSelf: 'center',
                          height: "100%", width: "100%",
                          borderColor: "#1FABAB", borderRadius: this.state.currentHighlight.url.photo || this.state.currentHighlight.url.video ? 10 : 100,
                        }} /> : <Thumbnail square
                          source={this.state.currentHighlight.url &&
                            this.state.currentHighlight.url.photo ? {
                              uri:
                                this.state.currentHighlight.url.photo
                            } : this.state.defaultUrl} style={{
                              alignSelf: 'center',
                              height: "100%", width: "100%", borderColor: "#1FABAB", borderRadius: this.state.currentHighlight.url.photo || this.state.currentHighlight.url.video ? 10 : 100,
                            }}></Thumbnail>}
                    </TouchableOpacity>
                    {this.state.currentHighlight.url.video ? <View style={{
                      position: 'absolute',
                      marginTop: '15%',
                      marginLeft: '36%',
                      opacity: .9,
                    }}>
                      <Icon onPress={() => {
                        this.choseAction(this.state.currentHighlight.url)
                      }} name={this.state.currentHighlight.url.video ? "play" : "headset"} style={{
                        backgroundColor: 'black',
                        opacity:.5,
                        borderRadius:30,
                        fontSize: 50, color: this.state.currentHighlight.url.audio ? 'yellow' : '#FEFFDE', alignSelf: 'center'
                      }} type={this.state.currentHighlight.url.video ? "EvilIcons" : "MaterialIcons"}>
                      </Icon></View> : null}
                    {this.state.uploading ? <View style={{
                      position: 'absolute',
                      marginLeft: '37%',
                      marginTop: "14%",
                    }}><Spinner color={'#FEFFDE'}></Spinner></View> : null}
                  </View>
                  {this.state.enlargeImage && this.state.currentHighlight.url.photo ? <PhotoViewer open={this.state.enlargeImage} hidePhoto={() =>
                    this.setState({ newing: !this.state.newing, enlargeImage: false })}
                    photo={this.state.currentHighlight.url.photo} /> : null}
                  {this.state.currentHighlight.url.video ||
                    this.state.currentHighlight.url.photo ? <View style={{ ...buttoner, position: 'absolute', alignSelf: 'flex-end', }}><Icon name={'close'} type="EvilIcons"
                      onPress={() => this.cleanMedia()}
                      style={{
                        color: 'white',
                        fontSize: 20,
                      }}></Icon></View> : null}
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
                      placeholder="Post Content"
                      style={{
                        textAlignVertical: 'top',  // hack android
                        height: "100%",
                        fontSize: 14,
                        color: '#333',
                      }}
                      maxLength={3000}
                      onChangeText={(value) => this.onChangedDescription(value)} />
                  </View>
                </View>
                <Button transparent onPress={() => {
                  this.onchangeHighLightPublicState(this.state.currentHighlight.public_state === 'public' ? 'private' : 'public')
                }}><Icon name={this.state.currentHighlight.public_state === 'public' ? "radio-button-checked" :
                  "radio-button-unchecked"} type={"MaterialIcons"}></Icon>
                  <Text>{`${this.state.currentHighlight.public_state}`}</Text></Button>
                <View style={{
                  height: height / 10,
                  justifyContent: 'space-between',
                  alignItem: 'center'
                }}>
                  {!this.props.updateState ? this.state.creating ? <Spinner></Spinner> :
                    <View style={{ alignSelf: 'flex-end', }}>
                      <Button onPress={() => { this.AddHighlight() }} rounded>
                        <Text style={{ color: "#FEFFDE", fontWeight: 'bold', }}>{"Ok"}</Text>
                      </Button>
                    </View> :
                    <View style={{ alignSelf: 'flex-end' }}>
                      <Button
                        onPress={() => { this.updateHighlight() }} rounded>
                        <Text style={{ color: "#FEFFDE", fontWeight: 'bold', }}>{"Update"}</Text>
                      </Button>
                    </View>}
                </View>
              </View>
            </ScrollView>
          </View>
          <SearchImage openPicker={() => {
            this.TakePhotoFromCamera()
          }}
            h_modal={true}
            isOpen={this.state.searchImageState}
            onClosed={(mother) => {
              this.setState({
                newing: !this.state.newing,
                searchImageState: false
              })
              //mother ? this.props.closeTeporary() : null
            }} />
        </View>
        <View style={{ position: 'absolute' }}>
            <Text style={{ margin: '7%', color: '#1F4237', fontWeight: 'bold' }} note>{this.props.updateState ? "update post" : "add post"}</Text>
        </View>
      </View> : <Spinner size={"small"} style={{ alignSelf: "center" }}></Spinner>}
    </Modal>

  }

}
