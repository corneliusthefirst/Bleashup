/*import React, { Component } from 'react';
import { Platform, StyleSheet, Image, TextInput, FlatList, View, Alert, TouchableHighlight } from 'react-native';

import autobind from "autobind-decorator";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header, Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner, Button, InputGroup, DatePicker, CheckBox, Thumbnail, List
} from "native-base";

import cardListData from './EventData';

import CardListItem from './invitationCard';

import NestedScrollView from "react-native-nested-scroll-view"
import ImageActivityIndicator from "../currentevents/imageActivityIndicator";
import {OptimizedFlatList} from 'react-native-optimized-flatlist'
import { observable, action} from "mobx";
import globalState from "../../../stores/globalState"
import { observer } from "mobx-react";


@observer
class ReceivedInvitations extends Component {
  constructor(props) {
    super(props);
    this.state = ({
       deletedRowKey: null,
       loadingInvitations: true

    });

  }

  componentDidMount() {
      this.setState({
        loadingInvitations: false
    });
  }





  //callback function to refresh state of change
  refreshCardList = (activeKey) => {
    this.setState((prevState) => {
      return {
        //give the key to delete to the deleted row key
        deletedRowKey: activeKey
      };

    });
    //flatlist here is a reference to flatlist
   // this.refs.cardlist.scrollToEnd();
  }


generateKey(numberOfCharacters){
       return require('random-string')({length: numberOfCharacters});    
 }

@autobind
@action addInvitation(){
    const  newKey = this.generateKey(6)

    const newdata={
      "key" : newKey,
      "sender_Image":"https://upload.wikimedia.org/wikipedia/commons/b/bf/Cornish_cream_tea_2.jpg",
      "sender_name":"giles",
      "sender_status":"Falling on the way means you need to work harder",
      "receiver_Image":"https://upload.wikimedia.org/wikipedia/commons/6/6e/Lactarius_indigo_48568.jpg",
      "received_date":"28/06/2019",
      "created_date":"27/06/2019",
      "event_organiser_name":"corneliusthefirst",
      "event_description":"De plus, les nouvelles API à votre disposition sont également « entraînables » de façon très simple. Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule,De plus, les nouvelles API à votre disposition sont également « entraînables » de façon très simple. Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule, grâce au machine learning De plus, les nouvelles API à votre disposition sont également « entraînables » de façon très simple. Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule,",
      "event_Image":"https://upload.wikimedia.org/wikipedia/commons/a/ac/Simple_somen.jpg",
      "event_time":"13:51",
      "event_title":"Ceremony anesty",
      "location":"pizza Hut grenoble",
      "invitation_status":"master",
      "highlight":[
        {title:"highlight_1",description:" Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule,Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule,Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule",image:"https://cdn.stocksnap.io/img-thumbs/960w/VQZNYH80K6.jpg"},
        {title:"highlight_2",description:" Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule",image:"https://cdn.stocksnap.io/img-thumbs/960w/X6QBLPBXAJ.jpg"}
        ],
      "accept":false,
      "deny":false

   
    }

       globalState.cardListData.push(newdata);
      //this.refs.cardlist.scrollToEnd();
        this.refreshCardList(newKey);
        //this.refs.cardlist.scrollToIndex({viewPosition:0});
}











 _keyExtractor = (item, index) => item.key;
 
  render() {

     return this.state.loadingInvitations ? (
      <ImageActivityIndicator />
    ) : (
         
            <NestedScrollView  alwaysBounceHorizontal={true}>
             <View>
             <View style={{flex:1,flexDirection: 'column'}}>
             <Button onPress={this.addInvitation}>
                 <Text>add Invitation</Text>
             </Button>
             </View>

             <View>
             <FlatList
              initialNumToRender={5}
              maxToRenderPerBatch={6}
              windowSize={10}
              ref={"cardlist"}
              onContentSizeChange={()=> this.refs.cardlist.scrollToEnd()}
              updateCellsBatchingPeriod={25} 
              listKey={'Invitations'}
              keyExtractor={this._keyExtractor}
              data={globalState.cardListData}
              renderItem={( {item,index} )=> {           
              return(
                     //this is my private class just created
                     <CardListItem cardListData={globalState.cardListData} item={item} index={index} parentCardList = {this} refresh={this.refreshCardList}>
                     </CardListItem>
                 );


             }}
             >
                
             </FlatList>
             </View>
            </View>
            </NestedScrollView>
           
        
           
     );
  }
}


export default ReceivedInvitations;

*/














import React, { Component } from 'react';
import { Platform, StyleSheet, Image, TextInput, FlatList, View, Alert, TouchableHighlight,RefreshControl } from 'react-native';

import autobind from "autobind-decorator";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header, Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner, Button, InputGroup, DatePicker, CheckBox, Thumbnail, List
} from "native-base";

import cardListData from './EventData';

import CardListItem from './invitationCard';

import NestedScrollView from "react-native-nested-scroll-view"
import ImageActivityIndicator from "../currentevents/imageActivityIndicator";
import {OptimizedFlatList} from 'react-native-optimized-flatlist'
import { observable, action} from "mobx";
import globalState from "../../../stores/globalState"
import { observer } from "mobx-react";


@observer
class ReceivedInvitations extends Component {
  constructor(props) {
    super(props);
    this.state = ({
       deletedRowKey: null,
       loadingInvitations: true,
       refreshing:false

    });

  }

  componentDidMount() {
      this.setState({
        loadingInvitations: false
    });
  }





  //callback function to refresh state of change
  refreshCardList = (activeKey) => {
    this.setState((prevState) => {
      return {
        //give the key to delete to the deleted row key
        deletedRowKey: activeKey
      };

    });
    //flatlist here is a reference to flatlist
   // this.refs.cardlist.scrollToEnd();
  }


generateKey(numberOfCharacters){
       return require('random-string')({length: numberOfCharacters});    
 }

@autobind
@action addInvitation(){
    const  newKey = this.generateKey(6)

    const newdata={
      "key" : newKey,
      "sender_Image":"https://upload.wikimedia.org/wikipedia/commons/b/bf/Cornish_cream_tea_2.jpg",
      "sender_name":"giles",
      "sender_status":"Falling on the way means you need to work harder",
      "receiver_Image":"https://upload.wikimedia.org/wikipedia/commons/6/6e/Lactarius_indigo_48568.jpg",
      "received_date":"28/06/2019",
      "created_date":"27/06/2019",
      "event_organiser_name":"corneliusthefirst",
      "event_description":"De plus, les nouvelles API à votre disposition sont également « entraînables » de façon très simple. Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule,De plus, les nouvelles API à votre disposition sont également « entraînables » de façon très simple. Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule, grâce au machine learning De plus, les nouvelles API à votre disposition sont également « entraînables » de façon très simple. Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule,",
      "event_Image":"https://upload.wikimedia.org/wikipedia/commons/a/ac/Simple_somen.jpg",
      "event_time":"13:51",
      "event_title":"Ceremony anesty",
      "location":"pizza Hut grenoble",
      "invitation_status":"master",
      "highlight":[
        {title:"highlight_1",description:" Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule,Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule,Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule",image:"https://cdn.stocksnap.io/img-thumbs/960w/VQZNYH80K6.jpg"},
        {title:"highlight_2",description:" Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule",image:"https://cdn.stocksnap.io/img-thumbs/960w/X6QBLPBXAJ.jpg"}
        ],
      "accept":false,
      "deny":false

   
    }

       globalState.cardListData.push(newdata);
}

@autobind
onRefresh(){
  this.setState({refreshing:true})
  //call your callback function here
  this.addInvitation()
  this.setState({refreshing:false})
}








 _keyExtractor = (item, index) => item.key;
 
  render() {

     return this.state.loadingInvitations ? (
      <ImageActivityIndicator />
    ) : (
         
            <NestedScrollView  alwaysBounceHorizontal={true}>
            
             <View style={{flex:1,flexDirection: 'column'}}>
             <FlatList
              initialNumToRender={5}
              maxToRenderPerBatch={6}
              windowSize={10}
              ref={"cardlist"}
              onContentSizeChange={()=> this.refs.cardlist.scrollToEnd()}
              updateCellsBatchingPeriod={25} 
              listKey={'Invitations'}
              keyExtractor={this._keyExtractor}
              data={globalState.cardListData}
              renderItem={( {item,index} )=> {           
              return(
                     //this is my private class just created
                     <CardListItem cardListData={globalState.cardListData} item={item} index={index} parentCardList = {this} refresh={this.refreshCardList}>
                     </CardListItem>
                 );


             }}
             refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
             }
             >
                
             </FlatList>
            </View>
            </NestedScrollView>
           
        
           
     );
  }
}


export default ReceivedInvitations;



























/*
  ComponentWillMount() {
    /*create this object from ariving data to form new_invitation
     cardListData = [
    {
      "key" : "32143",
      "sender_Image":"https://upload.wikimedia.org/wikipedia/commons/b/bf/Cornish_cream_tea_2.jpg",
      "sender_name":"cornelius",
      "sender_status":"One step ahead the world De plus, les nouvelles API à votre disposition",
      "receiver_Image":"https://upload.wikimedia.org/wikipedia/commons/6/6e/Lactarius_indigo_48568.jpg",
      "received_date":"28/06/2019",
      "created_date":"27/06/2019",
      "event_organiser_name":"Giles",
      "event_description":"De plus, les nouvelles API à votre disposition sont également « entraînables » de façon très simple. Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule, grâce au machine learning",
      "event_Image":"https://upload.wikimedia.org/wikipedia/commons/a/ac/Simple_somen.jpg",
      "event_time":"13:51",
      "event_title":"Ceremony anesty",
      "location":"pizza Hut grenoble",
      "invitation_status":"master",
      "highlight":[
        {title:"highlight_1",description:" Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule",image:"https://cdn.stocksnap.io/img-thumbs/960w/VQZNYH80K6.jpg"},
        {title:"highlight_2",description:" Prenons l’exemple d’une API de reconnaissance visuelle : il vous suffit de la nourrir d’une vingtaine d’images d’un objet pour qu’elle apprenne ensuite à le faire seule",image:"https://cdn.stocksnap.io/img-thumbs/960w/X6QBLPBXAJ.jpg"}
        ]
   
    }


    //then
    //cardListData.push(new_invitation)
  }
*/














































