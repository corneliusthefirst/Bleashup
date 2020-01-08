import React, { Component } from "react";
import {
  Text, Icon,
  Button,Item,Input
} from "native-base";

import { View,TouchableOpacity,TouchableWithoutFeedback,Dimensions,Keyboard} from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import request from "../../../../../services/requestObjects";
import  stores from '../../../../../stores/index';

let {height, width} = Dimensions.get('window');

export default class EventLocation extends Component {
    constructor(props) {
        super(props)
        this.state ={
           location:request.Location(),
           event_id:"",
           update:false
        }

    } 
 

  @autobind
  init(){
      this.setState({
        update:this.props.updateLoc?this.props.updateLoc:false,
        location: this.props.event.location,
        event_id:this.props.event.id
      });
  }
  componentDidMount(){
    this.init()
  }
  componentDidUpdate(prevProps,prevState){
    if(this.props.event.location.string !== prevProps.event.location.string){
     this.init()
    }
  }

  @autobind
    onChangedLocation(value) {
      this.setState({location:{...this.state.location,string:value}});
      if(!this.state.update){
        console.warn(value)
        stores.Events.updateLocation(this.state.event_id,value,false).then(()=>{

        });
      }
     
   }

   @autobind
   updateLocation(){
     this.state.location.string !== this.props.event.location.string ? this.props.updateLocation(this.state.location.string) : null
     /*stores.Events.updateLocation(this.state.event_id,this.state.location,false).then(()=>{});
     this.setState({update:false});
     this.props.parentComp.state.EventData.location.string = this.state.location.string;
     this.props.parentComp.setState({EventData:this.props.parentComp.state.EventData});
     this.setState({location:request.Location()});*/
     this.props.onClosed();
   }

    render() {
     
    	return(


                <Modal
                isOpen={this.props.isOpen}
                onClosed={() => this.props.onClosed(this.state.location)}
                style={{
                    height: height/4, borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",
                    flexDirection:'column',marginTop:"-3%"
                  
                }}
                backButtonClose={true} 
                coverScreen={true}
                position={'bottom'}
               //backdropPressToClose={false}
                
                >


               <View  style={{height:"100%",width:"100%",justifyContent:'center'}}>
                   <View>
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"500",fontSize:18}} >Activity Location </Text>
                    <Item  style={{borderColor:'black',width:"95%",alignSelf:'center'}} rounded>
                     <Input placeholder='Activity Location' 
                     keyboardType='email-address' autoCapitalize="none"
                      returnKeyType='next' inverse last
                       value={this.state.location.string} 
                       onChangeText={(value) => this.onChangedLocation(value)} />
                     </Item>
                    </View>

              <TouchableWithoutFeedback  onPress={() => Keyboard.dismiss()}>      
               {this.state.update?     
                  <View style={{height:"20%",marginTop:"3%"}}>
                   <TouchableOpacity style={{width:width/4,height:height/18,alignSelf:"flex-end",marginRight:"2%"}} >
                   <Button style={{borderRadius:8,borderWidth:1,marginRight:"2%",backgroundColor:"#FEFFDE",borderColor:'#1FABAB',alignSelf:'flex-end',width:width/4,height:height/18,justifyContent:"center"}} onPress={()=>{this.updateLocation()}}>
                   <Text style={{color:"#1FABAB"}}>Update</Text>
                   </Button> 
                   </TouchableOpacity>
                   </View> 
                  : <View style={{height:"10%",marginTop:"3%"}}></View>}
              </TouchableWithoutFeedback> 

                </View>

                </Modal>

    )}

    }