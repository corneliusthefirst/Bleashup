import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
//import CacheImages from "../../../../../CacheImages";
import PhotoEnlargeModal from "../../PhotoEnlargeModal";



 


export default class EventPhoto extends Component {
    constructor(props) {
        super(props)
        this.state={
          enlargeImage:false,
          EventPhoto:require('../../../../../../../Images/eventphoto.jpg')
        }

    }












    render() {
    	return(
             <Modal
                isOpen={this.props.parentComponent.state.EventPhotoState}
                onClosed={()=>{this.props.parentComponent.setState({EventPhotoState:false})}}
                style={{
                    height: "50%", borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",flexDirection:'column',
                    marginTop:"-2%"
                }}
                position={'bottom'}
                backdropPressToClose={false}
                coverScreen={true}
                >
                <View style={{flex:1}}>
                 <View style={{flex:2,justifyContent:'space-between',alignItem:'center'}}>

                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"6%"}}
                     onPress={()=>{this.props.parentComponent.TakePhotoFromCamera().then(source =>{
                          this.setState({EventPhoto: source});
                     })} }>
                     <Text> Take Photo From Camera</Text>
                    </Button>

                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"3%"}} 
                    onPress={()=>{this.props.parentComponent.TakePhotoFromLibrary().then(source=>{    
                      this.setState({ EventPhoto: source})
                         }
                      )}}>
                     <Text> Take Photo From Library</Text>
                    </Button>

                 </View>


                <View style={{ flex: 3, flexDirection: 'column',justifyContent:'center',alignItem:'center',marginTop:"4%"}}>
                    <TouchableOpacity onPress={() => this.setState({ enlargeImage: true })} >
                        <Image  source={ this.state.EventPhoto } style={{alignSelf:'center',
                            height: "90%",width: "90%", borderWidth: 1, borderColor: "#1FABAB", borderRadius:100
                        }}  />
                    </TouchableOpacity>
                </View>

                 <View style={{flex:1,alignSelf:'flex-end'}}>
                  <Button style={{width:"20%",borderRadius:8,marginRight:"4%",backgroundColor:'#1FABAB'}} onPress={()=>{ this.setState({EventPhotoState:true})}}>
                  <Text style={{color:"#FEFFDE"}}>OK</Text>
                  </Button>
                  </View>


                 <PhotoEnlargeModal isOpen={this.state.enlargeImage} onClosed={() => this.setState({ enlargeImage: false })} photo={this.state.EventPhoto} />
              
                </View>
                </Modal>


    )}

    }





    /*
    <View style={{ flex: 4, flexDirection: 'column',justifyContent:'center',alignItem:'center',marginTop:"4%"}}>
                    <TouchableOpacity onPress={() => this.setState({ enlargeImage: true })} >
                        <Image  source={require('../../../../../../../Images/eventphoto.jpg')} style={{alignSelf:'center',
                            height: "90%",width: "51%", borderWidth: 1, borderColor: "#1FABAB", borderRadius:300
                        }}  />
                    </TouchableOpacity>
                </View>
    */