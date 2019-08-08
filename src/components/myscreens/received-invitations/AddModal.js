import React, {Component} from 'react';
import {Platform, StyleSheet, Text,Image,TextInput,FlatList, View,Alert,TouchableHighlight,Dimensions} from 'react-native';
//import flatListData from '../data/FlatListData'; 
import Modal from 'react-native-modalbox';
//import Button from 'react-native-button';
import cardListData from './EventData';
import {
  Content, Card, CardItem, Body, Container, Icon, Header, Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner, Button, InputGroup, DatePicker, CheckBox, Thumbnail, List
} from "native-base";



var screen = Dimensions.get('window');
export default class AddModal extends Component {
    
    constructor(props){
        super(props);
        //defining the state in the constructor
        this.state = {
            newFoodName:'',
            newFoodDescription:''
        };
    }
    //define the showAddModal function to show the modal when called 
    showAddModal() {
       this.refs.myModal.open();
    }

    //function to automatically generate keys
  
   generateKey(numberOfCharacters){
       return require('random-string')({length: numberOfCharacters});    
    }
     
    render() {
        return (
          <Modal 
             ref = {"myModal"}
             style ={{
              justifyContent:'center',
             // borderRadius:Platform.Os ==='ios' ? 30 : 0,
              shadowRadius:10,
              width: screen.width - 60,
              borderRadius:30,
              height:280
             }}
          position = 'center'
          backdrop={true}
          onClosed = {() => {
              //alert("Modal closed");
          }}>
             
             <Text style = {{
                 fontSize:16,
                 fontWeight:'bold',
                 textAlign:'center',
                 marginTop:30
  

             }}> New food information</Text>

             <TextInput style={{
                height:40,
                borderBottomColor:'gray',
                marginLeft:30,
                marginRight:30,
                marginTop:10,
                marginBottom:20,
                borderBottomWidth:1,
                fontSize:16,
                                
             }}
             onChangeText= { (text) => this.setState({newFoodName: text}) }
             placeholder="Enter new food's name"
             value = {this.state.newFoodName}
             />
             
            

             <TextInput style={{
                height:40,
                borderBottomColor:'gray',
                marginLeft:30,
                marginRight:30,
                marginTop:0,
                marginBottom:20,
                borderBottomWidth:1,
                fontSize:16                 
             }}
             onChangeText= { (text) => this.setState({newFoodDescription: text}) }
             placeholder="Enter new food's Description"
             value = {this.state.newFoodDescription}
             />
             <Button style = {{ fontSize: 18,width:100, color: 'white'}}
             containerStyle = {{
                 padding: 8,
                 marginLeft: 70,
                 marginRight: 70,
                 height: 48,
                 borderRadius: 6,
                 backgroundColor: 'mediumseagreen'

             }}
             onPress = {()=> {
                //check if the box are filled
     /*           if (this.state.newFoodName.length == 0 || this.state.newFoodDescription.length == 0){
                    alert("You must enter food's name and description");
                }
                //else
                //newKey is used for inserting and refresh
                const newKey = this.generateKey(24); 
                const newFood = {
                   key: newKey,
                   name: this.state.newFoodName,
                   imageUrl:"https://upload.wikimedia.org/wikipedia/commons/6/64/Foods_%28cropped%29.jpg",
                   foodDescription:this.state.newFoodDescription
                };

                */
    //newKey is used for inserting and refresh
     const newKey = this.generateKey(6); 
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


                cardListData.push(newdata);
                
                this.props.parentFlatList.refreshFlatList(newKey);
                this.refs.myModal.close();

             }}
             
             >
             <Text>Save</Text>
             </Button>
            

          </Modal>
        );
    }
}