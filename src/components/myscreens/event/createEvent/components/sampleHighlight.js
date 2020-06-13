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
import Textarea from 'react-native-textarea';
import CacheImages from "../../../../CacheImages";
import HighlightCard from "./HighlightCard"
import stores from '../../../../../stores/index';
import { observer } from 'mobx-react'
import moment from "moment"
import { head, filter, uniqBy, orderBy, find, findIndex, reject, uniq, indexOf, forEach, dropWhile } from "lodash";
import request from "../../../../../services/requestObjects";
import SearchImage from './SearchImage';
import BleashupHorizontalFlatList from '../../../../BleashupHorizotalFlatList';
import testForURL from '../../../../../services/testForURL';
import PhotoInputModal from "../../PhotoInputModal";
import { KeyboardAvoidingView } from 'react-native';

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
            let event_id = this.props.event_id ? this.props.event_id : "newEventId";
            stores.Highlights.fetchHighlights(event_id).then(Highlights => {
                this.setState({ highlightData: Highlights })
            })


            /**setInterval(() => {
             if((this.state.animateHighlight == true) && (this.state.highlightData.length > 2)){
             this.highlight_flatlistRef.scrollToIndex({animated: true, index: this.state.initialScrollIndex,viewOffset:0,viewPosition:0});
            
            if(this.state.initialScrollIndex >= (this.state.highlightData.length)-2){
              this.setState({initialScrollIndex:0})
            }else{
              this.setState({initialScrollIndex:this.state.initialScrollIndex + 2})
            }
             }
            } ,4000)*/
            this.setState({ isMounted: true });

        }, 400)

    }


    @autobind
    TakePhotoFromCamera() {

        return new Promise((resolve, reject) => {

            ImagePicker.openCamera({
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
        if (this.state.currentHighlight.url.photo == "") {

            Toast.show({
                text: "Highlight must have atleast an image !",
                buttonText: "Okay",
                duration: 6000,
                buttonTextStyle: { color: "#008000" },
                buttonStyle: { backgroundColor: "#5cb85c" },
                textStyle: { color: "salmon", fontSize: 15 }
            })

        } else {
            var arr = new Array(32);
            let num = Math.floor(Math.random() * 16)
            uuid.v1(null, arr, num);
            let New_id = uuid.unparse(arr, num);
            //console.warn(id);

            stores.Highlights.readFromStore().then(Highlights => {
                let newHighlight = request.Highlight();
                console.warn("here5", newHighlight);
                let highlight = find(Highlights[this.props.event_id], { id: "newHighlightId" });
                console.warn("here4", highlight)
                newHighlight = highlight;
                newHighlight.id = New_id;
                newHighlight.event_id = this.props.event_id ? this.props.event_id : "newEventId";   //new event id

                //console.warn(highlight);
                //add the new highlights to global highlights
                stores.LoginStore.getUser().then((user) => {
                    newHighlight.creator = user.name;
                    newHighlight.created_at = moment().format("YYYY-MM-DD HH:mm");
                })
                console.warn("here1")
                this.setState({ highlightData: [...this.state.highlightData, newHighlight] }, () => { console.log("after", this.state.highlightData) });
                console.warn("here2")
                if (this.props.event_id) {
                    this.props.parentComponent.setState({ highlightData: [...this.props.parentComponent.state.highlightData, newHighlight] }, () => { console.log("after", this.props.parentComponent.state.highlightData) });
                    console.warn("here3")
                }

                stores.Highlights.addHighlights(this.props.event_id, newHighlight).then(() => { });
                //add the new highlight id to our newly created event for it to be accessed later when needed using this id
                stores.Events.addHighlight(newHighlight.event_id, newHighlight.id, false).then(() => { });
                stores.Events.readFromStore().then((Events) => { console.warn(Events, "After highlight id insertion"); })

                //reset the class currentHighlight state
                this.resetHighlight();

                //delete highlight and add a new highlight empty One
                stores.Highlights.removeHighlight(this.props.event_id, "newHighlightId").then(() => { });
                stores.Highlights.addHighlights(this.props.event_id, this.state.currentHighlight).then(() => { });
                //stores.Highlights.resetHighlight(this.state.currentHighlight,false).then(()=>{});
            });
        }

    }

    @autobind
    updateHighlight() {

        stores.Highlights.updateHighlight(this.props.event_id, this.state.currentHighlight, false).then(() => { });
        this.resetHighlight();
        this.setState({ update: false });
        this.props.onClosed();

    }

    @autobind
    deleteHighlight(id) {
        this.state.highlightData = reject(this.state.highlightData, { id, id });
        console.warn(this.state.highlightData, "highlight data state");
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
                    height: height * .7, borderTopLeftRadius: 10, borderTopRightRadius: 10,
                    backgroundColor: "#FEFFDE", width: "100%",
                }}
                coverScreen={true}
                position={'bottom'}
                swipeToClose={false}
            //backdropPressToClose={false}
            >
                <View style={{ height: "100%", width: "90%", margin: '1%', }}>
                    <View style={{ alignItems: "flex-start", margin: '2%', height: "5%", flexDirection: 'row', }}>
                        <Title style={{ fontSize: 25, fontWeight: '400', color: "gray", width: "98%", alignSelf: 'flex-start', }}>{"New Highlight"}</Title>
                        <Button style={{ flexDirection: 'row', alignItems: 'flex-end', }} rounded>
                            <Text style={{ color: "#FEFFDE", fontWeight: 'bold', }}>{"Ok"}</Text>
                        </Button>
                    </View>
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <View style={{ height: "95%" }}>
                            <View style={{ width: "90%" }}>
                                <View style={{ margin: '1%' }}>
                                    <Item style={{ width: "100%", marginTop: "1%", marginBottom: "1%", }}>
                                        <TextInput value={this.state.currentHighlight.title} style={{
                                            width: "100%",
                                            borderRadius: 15, borderWidth: .7,
                                        }}
                                            maxLength={20}
                                            placeholder={'Title'} autoCapitalize="none" returnKeyType='next' inverse last
                                            onChangeText={(value) => this.onChangedTitle(value)} />
                                    </Item>
                                </View>
                                <View style={{
                                    flexDirection: 'column', margin: '1%', height: "24%", shadowOpacity: 1,
                                    shadowOffset: {
                                        height: 1,
                                    },
                                    shadowRadius: 10, elevation: 6
                                }}>
                                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.setState({
                                        isPhotoOptionsModalOpened: true
                                    }))} >
                                        {this.state.currentHighlight.url && this.state.currentHighlight.url.photo && testForURL(this.state.currentHighlight.url.photo) ?
                                            <CacheImages source={{ uri: this.state.currentHighlight.url.photo }} style={{
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
                                    <PhotoInputModal isOpen={this.state.isPhotoOptionsModalOpened}></PhotoInputModal>
                                </View>
                                <View style={{ alignItems: 'flex-start', justifyContent: 'center', backgroundColor: "transparent", }}>
                                    <View style={{ width: "100%", height: "100%", backgroundColor: "transparent", }}>
                                        <Textarea value={this.state.currentHighlight.description}
                                            containerStyle={{ width: "100%", margin: "1%", borderRadius: 10, borderWidth: 1, borderColor: "#1FABAB", backgroundColor: "#f5fffa" }}
                                            placeholder="Highlight Description"
                                            style={{
                                                textAlignVertical: 'top',  // hack android
                                                height: height / 4,
                                                fontSize: 14,
                                                color: '#333',
                                            }}
                                            maxLength={1000}
                                            onChangeText={(value) => this.onChangedDescription(value)} />
                                    </View>
                                </View>
                                {/*
              <View style={{ height: height / 8, justifyContent: 'space-between', alignItem: 'center' }}>
                {!this.state.update ?
                  <TouchableOpacity style={{ width: "80%", alignSelf: 'center' }}>
                    <Button style={{ width: "100%", borderRadius: 15, borderColor: "#1FABAB", backgroundColor: "#1FABAB", justifyContent: 'center', alignItem: 'center' }}
                      onPress={() => { this.AddHighlight() }}>
                      <Text style={{ color: "#FEFFDE" }}> Add   Highlight </Text>
                    </Button>
                  </TouchableOpacity> :
                  <TouchableOpacity style={{ width: "80%", alignSelf: 'center' }}>
                    <Button style={{ width: "100%", borderRadius: 15, borderColor: "#1FABAB", backgroundColor: "#1FABAB", justifyContent: 'center', alignItem: 'center' }}
                      onPress={() => { this.updateHighlight() }}>
                      <Text style={{ color: "#FEFFDE" }}> Update   Highlight </Text>
                    </Button>
                  </TouchableOpacity>}
              </View>

                */}
                            </View>
                            <SearchImage accessLibrary={() => { this.TakePhotoFromLibrary().then(() => { }) }} isOpen={this.state.searchImageState} onClosed={() => { this.setState({ searchImageState: false }) }} />
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

        ) : <Spinner size={"small"} style={{ alignSelf: "center" }}></Spinner>
    }

}


