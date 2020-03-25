import React, { Component } from "react";
import { View, Vibration, TouchableWithoutFeedback, Dimensions, TouchableOpacity } from 'react-native';

import {
  Card,CardItem,Text,Label,Spinner,Button,Container,Icon
} from 'native-base';
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";

let { height, width } = Dimensions.get('window');
export default class NewContactView extends Component{
constructor(props){
  super(props)
  this.state={
      isMount:false
  }
}  


init = ()=>{
    setTimeout(() => {
      this.setState({isMount:true})
  }, 50)
   
  }
componentDidMount(){
    this.init();
}

render(){
    return (
      <Container style={{ backgroundColor: "#FEFFDE",flexDirection:"column",width:width }}>
         <View style={{ height: 40, }}>
           <View style={{
                ...bleashupHeaderStyle,
                
              }}>
                 <View style={{flexDirection:"row",width:width/2,marginLeft:width/25,justifyContent:"space-between",alignItems:"center"}}>
                 <Icon name="arrow-back" active={true} type="MaterialIcons" style={{ color: "#1FABAB", }} onPress={() => this.props.navigation.navigate("Contacts")} />
                 <Text style={{fontSize:18,fontWeight:"bold",marginRight:"14%"}}>New Contact</Text>
                 </View>
          </View>
         </View>
         { this.state.isMount? 
        <View style={{flexDirection:"column",height:height - height/10,width:"100%"}}>
            
            
         </View>
         :null}

        </Container>
    );
}

}