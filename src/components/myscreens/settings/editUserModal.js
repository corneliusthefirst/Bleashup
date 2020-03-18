import React, { Component } from "react";
import stores from "../../../stores";
import Modal from 'react-native-modalbox';
import { Button,View,Dimensions,TouchableWithoutFeedback,Image,TextInput} from "react-native";
import { Title ,Text,Label,Input} from "native-base";
//import { TextInput } from "react-native-gesture-handler";


let { height, width } = Dimensions.get('window');

export default class EditUserModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isMount:false, 
        value:"",
        userInfo:null
      }
    }

    componentDidMount(){
        setTimeout(() => {
            this.setState({isMount:true,userInfo:this.props.userInfo})
            if(this.props.nickname){
               this.setState({value:this.state.userInfo.nickname});
            }
        }, 50)
         
      
      }
      textChanged = (value)=>{
         if(this.props.nickname){
            this.state.userInfo.nickname = value;
            this.setState({value:value});
           
          }
      }
      save = ()=>{
         stores.LoginStore.updateName(this.state.value).then(()=>{
          this.setState({updateName:false}) 
        });
         
      }
      cancel = ()=>{
         this.setState({updateName:false});
      }

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
            position={'bottom'}
            coverScreen={true}
           >
             {this.state.isMount?
          <View style={{flexDirection:"column",width:"90%",margin:"5%"}}>
            <Title style={{alignSelf:"flex-start"}}>{this.props.title}</Title>

            <View style={{flexDirection:"row",borderColor:"#1FABAB",borderBottomWidth:2,alignItems:"center",justifyContent:"space-between"}} >
              <Input  autoCapitalize="none" style={{alignSelf:"flex-start"}} value={this.state.value} style={{}} onChangeText={this.textChanged} maxLength={20} ></Input>
              <Label>20</Label>
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