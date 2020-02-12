import React, { Component } from "react";
import {
  Content,  Text, Icon, 
   Item, Title, Input,
  Button,
} from "native-base";

import {View,TouchableOpacity,TouchableWithoutFeedback,Dimensions,Keyboard} from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import request from "../../../../../services/requestObjects";
import  stores from '../../../../../stores/index';


let {height, width} = Dimensions.get('window')

export default class EventTitle extends Component {
    constructor(props) {
      super(props)
      this.state={
          title:"",
          update:false,
          event_id:""
         }
         
    }

    @autobind
    init(){
        this.setState({
          update:this.props.updateTitle?this.props.updateTitle:false,
          title:this.props.event.about.title,
          event_id:this.props.eventId
        });
    }

   componentDidMount(){
          this.init() 
 }
componentDidUpdate(prevProp,prevState){
  if(this.props.event.about.title !== prevProp.event.about.title){
    this.init()
  }
}

   @autobind
   onChangedTitle(value) { 
     this.setState({title:value});
     if(!this.state.update){
     stores.Events.updateTitle("newEventId",value,false).then(()=>{});
     }
   }
   
   @autobind
   updateTitle(){
     stores.Events.updateTitle(this.state.event_id,this.state.title,false).then(()=>{});
     this.setState({update:false});
     this.props.parentComp.state.EventData.title = this.state.title;
     this.props.parentComp.setState({EventData:this.props.parentComp.state.EventData});
     this.setState({title:""});
     this.props.onClosed();
   }



    render() {
    	return(
          <Modal
                isOpen={this.props.isOpen}
                onClosed={() => this.props.onClosed(this.state.title)}
                onClosingState={()=>{this.setState({show:false})}}
                style={{
                    height: height/4  , borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",
                    marginTop:"-3%"
                }}
                coverScreen={true}
                position={'bottom'}
                backButtonClose={true}
                >

          <View  style={{height:"100%",width:"100%",justifyContent:'center'}}>
                   <View>
                   <Text style={{fontWeight: 'bold', margin: '5%',}}>Activity Name</Text>
                    <Item  style={{borderColor:'black',width:"95%",alignSelf:'center'}} rounded>
                     <Input  maxLength={40} placeholder='Activity Name' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                       value={this.state.title} onChangeText={(value) => this.onChangedTitle(value)} />
                     </Item>
                    </View>

            {this.state.update ? <TouchableWithoutFeedback  onPress={() => Keyboard.dismiss()}>         
                  <View style={{height:"20%",marginTop:"3%"}}>
                   <TouchableOpacity style={{width:width/4,height:height/18,alignSelf:"flex-end",marginRight:"2%"}} >
                   <Button style={{borderRadius:8,borderWidth:1,marginRight:"2%",backgroundColor:"#FEFFDE",borderColor:'#1FABAB',
                   alignSelf:'flex-end',width:width/4,height:height/18,justifyContent:"center"}} onPress={()=>{this.updateTitle()}}>
                   <Text style={{color:"#1FABAB"}}>Update</Text>
                   </Button> 
                   </TouchableOpacity>
                   </View>
              </TouchableWithoutFeedback>:null}

           </View>


      </Modal>

    )}

    }
