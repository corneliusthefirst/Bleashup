import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity, Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
//import CacheImages from "../../../../../CacheImages";
import PhotoEnlargeModal from "../../../invitations/components/PhotoEnlargeModal";
//import ImagePicker from 'react-native-image-picker';
import { head,filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../../../services/requestObjects";
import  stores from '../../../../../stores/index';
import ImagePicker from 'react-native-customized-image-picker';
import SearchImage from './SearchImage';



let {height, width} = Dimensions.get('window');

export default class EventPhoto extends Component {
    constructor(props) {
        super(props)
        this.state={
          enlargeImage:false,
          EventPhoto:"",
          DefaultPhoto:require('../../../../../../Images/eventphoto.jpg'),
          searchImageState:false
        }

        stores.Events.readFromStore().then(Events =>{
            let event = find(Events, { id:"newEventId" }); 
            this.setState({EventPhoto:event.background})
            
        });
        
    }

    @autobind
    TakePhotoFromCamera(){
    
    return new Promise((resolve, reject) => {
    
      ImagePicker.openCamera({
        cropping: true
      }).then(response => {
        let res = head(response);
        this.setState({EventPhoto: res.path});
        stores.Events.updateBackground("newEventId",res.path,false).then(()=>{});
        resolve(res.path);
      });
    

    }) 
    
     }
    
    @autobind
    TakePhotoFromLibrary(){
    return new Promise((resolve, reject) => {

    ImagePicker.openPicker({
      cropping: true
    }).then(response => {
      let res = head(response);
      this.setState({EventPhoto: res.path});
      stores.Events.updateBackground("newEventId",res.path,false).then(()=>{});
      resolve(res.path);
    });

    
    })
    
    }


  








    render() {
    	return(
             <Modal
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
                    height: height/2 + height/12, borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",flexDirection:'column',
                    marginTop:"-4%"
                }}
                position={'bottom'}
                backdropPressToClose={false}
                coverScreen={true}
                >
         <View style={{flex:1}}>
                 <View style={{flex:2,justifyContent:'space-between',alignItem:'center'}}>
                    
                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"10%"}}
                      onPress={()=>{this.TakePhotoFromCamera().then(()=>{})}}>
                        <View style={{flexDirection:"row"}}>
                         <Icon name="photo-camera" active={true} type="MaterialIcons"
                            style={{color: "#0A4E52",alignSelf:"flex-start"}}/>
                         <Text  style={{alignSelf:"center"}}>Take Photo From Camera</Text>
                        </View>
                    </Button>
                  
                    
            
                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"3%"}} 
                      onPress={()=>{this.TakePhotoFromLibrary().then(url=>{})}}
                     >
                       <View style={{flexDirection:"row"}}>
                         <Icon name="photo" active={true} type="FontAwesome"
                            style={{color: "#0A4E52",alignSelf:"flex-start"}}/>
                         <Text  style={{alignSelf:"center"}}>  Take Photo From Library</Text>
                        </View>
                    </Button>
              
                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"3%"}} 
                      onPress={()=>{this.setState({ searchImageState:true})}}>
                        <View style={{flexDirection:"row"}}>
                         <Icon name="google" active={true} type="AntDesign"
                            style={{color: "#0A4E52",alignSelf:"flex-start",marginLeft:5}}/>
                         <Text  style={{alignSelf:"center"}}> Download From Google</Text>
                        </View>
                    </Button>

                 </View>


                <View style={{ flex: 3, flexDirection: 'column',justifyContent:'center',alignItem:'center',marginTop:"8%"}}>
                    <TouchableOpacity onPress={() => this.setState({ enlargeImage: true })} >
                        <Image  source={this.state.EventPhoto? {uri:this.state.EventPhoto}:this.state.DefaultPhoto}
                         style={{alignSelf:'center',height: "90%",width: "90%", borderWidth: 1, borderColor: "#1FABAB", borderRadius:100
                        }}  />
                    </TouchableOpacity>
                </View>


                 <PhotoEnlargeModal isOpen={this.state.enlargeImage} onClosed={() => this.setState({ enlargeImage: false })} photo={this.state.EventPhoto} />
                 <SearchImage accessLibrary={()=>{this.TakePhotoFromLibrary().then(()=>{})}} isOpen={this.state.searchImageState} onClosed={() => {this.setState({ searchImageState: false })}}  />
      
       </View>
                </Modal>


    )}

    }





/**   
 *  <View style={{flex:1,alignSelf:'flex-end'}}>
     <Button style={{width:"20%",borderRadius:8,marginRight:"4%",marginTop:"-3%",backgroundColor:'#1FABAB'}} onPress={()=>{ this.setState({EventPhotoState:true})}}>
      <Text style={{color:"#FEFFDE"}}>OK</Text>
     </Button>
     </View> */
















/**  

const options = {
    title: 'Select Avatar',
    //customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
      maxWidth:600,
      maxHeight:500,
      noData:true,
      allowEditing:true,
      quality:0.7
    },
  };

        TakePhotoFromCamera(){
    
      return new Promise((resolve, reject) => {
      
      ImagePicker.launchCamera(options, (response) => {
      
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          
          //const source = { uri: response.uri };
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
       
         resolve(response.uri);
         stores.Events.updateBackground("newEventId",response.uri,false).then(()=>{});
        }
      
      
      
        })
      }) 
      
       }
      
      @autobind
      TakePhotoFromLibrary(){
      return new Promise((resolve, reject) => {
      ImagePicker.launchImageLibrary(options, (response) => {
       
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          //const source = { uri: response.uri };
          // You can also display the image using data:
          // const source = { uri: 'data:image/jpeg;base64,' + response.data };
       
             resolve(response.uri);
             stores.Events.updateBackground("newEventId",response.uri,false).then(()=>{});
          }
         
       })
      
      })
      
      }

 */

