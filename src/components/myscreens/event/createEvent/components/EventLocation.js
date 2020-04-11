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
import colorList from '../../../../colorList';


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
  componentWillMount(){
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow.bind(this));
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide.bind(this));
  }
  handleKeyboardDidHide(){
    this.keyboarddissmissed = true
  }
  handleKeyboardDidShow() {
    this.keyboarddissmissed = false
  }
  componentWillUnmount() {
    this.keyboardDidHideSub.remove();
    this.keyboardDidShowSub.remove()
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
   keyboarddissmissed = false
   @autobind
   updateLocation(){
     if(!this.keyboarddissmissed){
       this.keyboarddissmissed = true
       Keyboard.dismiss()
     }else{
       this.state.location.string !== this.props.event.location.string ? this.props.updateLocation(this.state.location.string) : null
       /*stores.Events.updateLocation(this.state.event_id,this.state.location,false).then(()=>{});
       this.setState({update:false});
       this.props.parentComp.state.EventData.location.string = this.state.location.string;
       this.props.parentComp.setState({EventData:this.props.parentComp.state.EventData});
       this.setState({location:request.Location()});*/
       this.props.onClosed();
     }
   }

    render() {
     
    	return(


                <Modal
                isOpen={this.props.isOpen}
                onClosed={() => this.props.onClosed(this.state.location)}
                style={{
                    height: height/4, borderRadius: 15,
                    backgroundColor:colorList.bodyBackground,borderColor:'black',borderWidth:1,width: "70%",
                    flexDirection:'column'
                  
                }}
                backButtonClose={true} 
                coverScreen={true}
                position={'center'}
               //backdropPressToClose={false}
                
                >


               <View  style={{height:"100%",width:"100%",alignItems:"center"}}>

                   <View style={{height:"50%",width:"90%"}}>
                     <Input maxLength={20} placeholder='@activity Location adresse' 
                       keyboardType='email-address' autoCapitalize="none"
                      returnKeyType='next' inverse last
                       value={this.state.location.string} 
                       onChangeText={(value) => this.onChangedLocation(value)} 
                       style={{borderBottomWidth:1,borderColor:colorList.bodyIcon}}/>
                    </View>

                  
                   <View style={{height:"20%",marginTop:"12%",width:"100%"}}>
                 
                   <Button style={{borderRadius:15,borderWidth:1,backgroundColor:colorList.bodyBackground,borderColor:colorList.bodyIcon,width:"90%",justifyContent:"center",alignSelf:"center"}} onPress={()=>{this.updateLocation()}}>
                   <Text style={{color:colorList.bodyText}}>Update</Text>
                   </Button> 
                   </View> 

                </View>

                </Modal>

    )}

    }