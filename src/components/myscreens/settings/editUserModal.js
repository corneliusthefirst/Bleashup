import React, { Component } from "react";
import stores from "../../../stores";
import Modal from 'react-native-modalbox';
import { Button,View,Dimensions,TouchableWithoutFeedback,Image,TextInput} from "react-native";
import { Title ,Text,Label,Input} from "native-base";
//import { TextInput } from "react-native-gesture-handler";
import { filter,map,find} from "lodash";
import autobind from "autobind-decorator";

let { height, width } = Dimensions.get('window');

export default class EditUserModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isMount:false, 
        value:"",
        userInfo:null,
        previousLength:0,
        textLength:0
      }
    }

    @autobind
    init(){
      //console.warn("here is init")
      setTimeout(() => {
        if(this.props.type == "nickname"){
           this.setState({value:this.props.userInfo.nickname});
        }
        else if(this.props.type == "actu"){
          this.setState({value:this.props.userInfo.status});
        }
        this.setState({userInfo:this.props.userInfo,previousLength:this.state.value.length})
        this.setState({textLength:this.props.maxLength-this.state.previousLength, isMount:true})
      }, 50)
    }

    componentDidMount(){
        this.init();
         
    }
      
      textChanged = (value)=>{
         if(value.length > this.state.previousLength){
           this.setState({previousLength:this.state.previousLength+1})
           this.setState({textLength:this.props.maxLength-this.state.previousLength})
         }else{
          this.setState({previousLength:this.state.previousLength-1})
          this.setState({textLength:this.props.maxLength-this.state.previousLength})
         }

         if(this.props.type == "nickname"){
            this.state.userInfo.nickname = value;
            this.setState({value:value});
           
          }
          else if(this.props.type == "actu"){
            this.state.userInfo.status = value;
            this.setState({value:value});
          }
      }
      save = ()=>{
        if(this.props.type == "nickname"){
         stores.LoginStore.updateName(this.state.value).then(()=>{
         this.props.onClosed();
        });
      }
      else if(this.props.type == "actu"){
        //for data array update
        map(this.props.data,(o)=>{o.state =false});
        let data = find(this.props.data,{id:"0"});
        
        if(data){
         this.props.data[0].name = this.state.value;
         this.props.data[0].state = true; 
        }
        else{
         data={id:"0",name:this.state.value,state:true};
         this.props.data = [data].concat(this.props.data);     
        }

        stores.LoginStore.updateStatus(this.state.value).then(()=>{
          stores.LoginStore.updateStatusOptions(this.props.data).then(()=>{})
          this.props.parent.init();
          this.props.onClosed();
          });
      }
         
      }

      cancel = ()=>{
         this.setState({value:""});
         this.props.onClosed();
      }

      /*unmount = ()=>{
        this.setState({isMount:false});
      }
      componentWillUnmount(){
         this.unmount()
      }*/

     render(){
        return (
         
            <Modal
            coverScreen={true}
            isOpen={this.props.isOpen}
            onClosed={this.props.onClosed}
            style={{
                backgroundColor:"#FEFFDE",alignItems:"center",
                height: height/4, borderTopLeftRadius: 8, borderTopRightRadius: 8, width:width
            }}
            position={this.props.position}
            coverScreen={this.props.coverscreen}
           >
             {this.state.isMount?
          <View style={{flexDirection:"column",width:"90%",margin:"5%"}}>
            <Title style={{alignSelf:"flex-start"}}>{this.props.title}</Title>

            <View style={{flexDirection:"row",borderColor:"#1FABAB",borderBottomWidth:2,alignItems:"center",justifyContent:"space-between"}} >
              <Input  autoCapitalize="none" style={{alignSelf:"flex-start"}} value={this.state.value} style={{}} onChangeText={this.textChanged} maxLength={this.state.textLength} ></Input>
             <Label>{this.state.textLength}</Label>
            </View>
            <View style={{flexDirection:"row",alignSelf:"flex-end",width:"50%",justifyContent:"space-between",marginTop:height/30}}>
                <TouchableWithoutFeedback style={{height:height/20}}><Text onPress={this.cancel}>cancel</Text></TouchableWithoutFeedback>
                <TouchableWithoutFeedback style={{height:height/20}}><Text onPress={this.save}>save</Text></TouchableWithoutFeedback>
            </View>
          </View>

            :null}
        </Modal>
       
     
        );
    }



}