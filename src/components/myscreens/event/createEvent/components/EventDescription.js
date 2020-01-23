import React, { Component } from "react";
import {
  Text, Icon,Item,
  Button,
} from "native-base";
import Textarea from 'react-native-textarea';
import {Linking,StyleSheet, View,Image,TouchableOpacity,TouchableWithoutFeedback, Dimensions,TextInput, Keyboard} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import  stores from '../../../../../stores/index';
//import { TextInput } from "react-native-gesture-handler";


 
let {height, width} = Dimensions.get('window');

export default class EventDescription extends Component {
    constructor(props) {
        super(props)
        this.state ={
           description:"",
           event_id:"",
           update:false
        }
        //this.initialisation();     
    }
    
    @autobind
    init(){
         this.setState({
          description: this.props.event.about.description,
          event_id:this.props.event.id,
          update:this.props.updateDes?this.props.updateDes:false
         });
    }
    componentDidMount(){
      this.init()
    }
    componentDidUpdate(prevProps,prevState){
      if(this.props.event.about.description !== prevProps.event.about.description){
        this.init()
      }
    }
    @autobind
    onChangedEventDescription(value) {
    
      this.setState({description:value});
      if(!this.state.update){
        stores.Events.updateDescription(this.state.event_id,value ,false).then(()=>{});
      }
    }

    @autobind
    updateDescription(){
      this.state.description !== this.props.event.about.description ? this.props.updateDesc(this.state.description) : null
      /*stores.Events.updateDescription(this.state.event_id,this.state.description ,false).then(()=>{});
      this.props.parentComp.state.EventData.about.description = this.state.description;
      this.props.parentComp.setState({EventData:this.props.parentComp.state.EventData});
      this.setState({
        description:"",
        update:false
      });*/
      this.props.onClosed();
    }
 
     
    render() {
     

    	return(

           
             <Modal
                isOpen={this.props.isOpen}
                onClosed={() => this.props.onClosed(this.state.description)}
                style={{
                    height: height/2, borderRadius: 15,marginTop:"-3%",
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",
                }}
                coverScreen={true}
                position={'bottom'}
                backButtonClose={true}
                //backdropPressToClose={false}
                >
           
                 <View  style={{flex:1,flexDirection:"column"}}>

                   <View style={{height:"10%"}}>
                    <Text style={{alignSelf:'flex-start',marginLeft:"1%",marginTop:"4%",
                    fontWeight:"500",fontSize:18}} >Activity Description </Text>              
                   </View>

            <View style={{ height: "70%" }}>
              <Textarea containerStyle={{
                width: "95%", margin: "1%",
                height: height / 3+height/30,
                borderRadius: 10, borderWidth: 1,
                borderColor: "#1FABAB",alignSelf: 'center',
                backgroundColor: "#f5fffa"
              }} maxLength={1000}
               style={{
                margin: 1,
                textAlignVertical: 'top',  // hack android
                backgroundColor: "#f5fffa",
                height: "95%",
                width: "98%"
              }}
                placeholder="Activity Description" value={this.state.description} keyboardType="default"
                onChangeText={(value) => this.onChangedEventDescription(value)} />

            </View>
            {this.state.update ? <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={{ height: "10%", marginTop: "5%" }}>
                <TouchableOpacity style={{ width: width / 4, height: height / 18, alignSelf: "flex-end", marginRight: "1%" }} >
                  <Button style={{ borderRadius: 8, borderWidth: 1, marginRight: "2%", backgroundColor: "#FEFFDE", borderColor: '#1FABAB', alignSelf: 'flex-end', width: width / 4, height: height / 18, justifyContent: "center" }} onPress={() => { this.updateDescription() }}>
                    <Text style={{ color: "#1FABAB" }}>Update</Text>
                  </Button>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback> : null}
              
               </View>
        
          </Modal>
    )}

    }

