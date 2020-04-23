import React, { Component } from "react";
import {
  Text, Icon,Item,
  Button,
} from "native-base";
import Textarea from 'react-native-textarea';
import {View,TouchableOpacity,
  TouchableWithoutFeedback, Dimensions, Keyboard} from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import  stores from '../../../../../stores/index';
import colorList from '../../../../colorList';
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
  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow.bind(this));
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide.bind(this));
  }
  handleKeyboardDidShow(){
    this.keyboardDissmissed = false
  }
  handleKeyboardDidHide() {
    console.warn("hidding keyboard !!")
    this.keyboardDissmissed = true
  }
    componentDidUpdate(prevProps,prevState){
      if(this.props.event.about.description !== prevProps.event.about.description){
        this.init()
      }
    }
    componentWillUnmount(){
      this.keyboardDidHideSub.remove();
      this.keyboardDidShowSub.remove()
    }
    @autobind
    onChangedEventDescription(value) {
    
      this.setState({description:value});
      if(!this.state.update){
        stores.Events.updateDescription(this.state.event_id,value ,false).then(()=>{});
      }
    }
    keyboardDissmissed = false
    @autobind
    updateDescription(){
      if(!this.keyboardDissmissed){
        this.keyboardDissmissed = true
        Keyboard.dismiss()
      }else{
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
    }
 
     
    render() {
     

    	return(

           
             <Modal
                isOpen={this.props.isOpen}
                onClosed={() => this.props.onClosed(this.state.description)}
                style={{
                    height: 290, borderRadius: 25,
                    backgroundColor:colorList.bodyBackground,borderColor:'black',borderWidth:1,width: "82%",
                }}
                coverScreen={true}
                position={'center'}
                backButtonClose={true}
                >
           
          <View  style={{height:"100%",flexDirection:"column"}}>


            <View style={{ height: "70%",borderRadius: 25,marginTop:"5%" }}>
              <Textarea containerStyle={{
                width: "96%", 
                height: "100%",
                borderWidth: 1,borderRadius: 25,
                borderColor:colorList.bodyText,alignSelf: 'center',
                backgroundColor: "mintcream"
              }} maxLength={1000}
               style={{
                margin: 1,
                textAlignVertical: 'top',  // hack android
                backgroundColor: "#f5fffa",borderRadius: 25,
              }}
                placeholder="@activity Description" value={this.state.description} keyboardType="default"
                onChangeText={(value) => this.onChangedEventDescription(value)} />

               </View>

               <View style={{height:"25%",justifyContent:"center"}}>
                  <Button style={{ borderRadius: 15, borderWidth: 1, backgroundColor:colorList.bodyBackground, borderColor:colorList.bodyIcon, alignSelf: 'center', width:"90%", justifyContent: "center" }} onPress={() => { this.updateDescription() }}>
                    <Text style={{ color: colorList.bodyText }}>Update Description</Text>
                  </Button>  
              </View>

               </View>
        
          </Modal>
    )}

    }

