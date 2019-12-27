import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Item, Title, Input, Left, Right, Spinner,
  Button,Textarea,Label
} from "native-base";
 
import { StyleSheet, View,Image,TouchableOpacity, Dimensions} from 'react-native';
import autobind from "autobind-decorator";
import TasksCard from "./TasksCard"
import PhotoEnlargeModal from "../invitations/components/PhotoEnlargeModal";
import  stores from '../../../stores/index';
import {observer} from 'mobx-react'
import BleashupFlatList from '../../BleashupFlatList';
import LocalTasksCreation from './TasksCreation';
import { find, findIndex, uniqBy, reject,filter } from "lodash";

//const MyTasksData = stores.Reminds.MyTasksData
 

@observer
export default class Reminds extends Component {
    constructor(props) {
        super(props)
        this.state={
          eventRemindData:[]
        }
    }


updateData = newremind => {
  //console.warn("come back value",newremind)
  this.setState({eventRemindData:[ ...this.state.eventRemindData, newremind]});
}

componentDidMount(){
  stores.LoginStore.getUser().then((user)=>{
   stores.Reminds.readFromStore().then((Reminds)=>{
    let reminds = filter(Reminds,{event_id:user.phone});
    this.setState({eventRemindData:reminds});
    //console.warn("ok",reminds)
   })
 })
}

@autobind
AddRemind(){
  this.props.navigation.navigate("TasksCreation",{eventRemindData:this.state.eventRemindData,updateData:this.updateData});
}



@autobind
back() {
  this.props.navigation.navigate('Home');

}

_keyExtractor = (item, index) => item.id

  render() {
       
     return(

      <View style={{flex:1,backgroundColor:'#FEFFDE'}}>
        <View style={{height:"8%",width:"96%",justifyContent:"space-between",flexDirection:"row",backgroundColor:"#FEFFDE",alignItems:"center",marginLeft:"2%",marginRight:"2%"}}>
           <View >
             <TouchableOpacity>
                <Icon  onPress={this.back} type='MaterialCommunityIcons' name="keyboard-backspace" style={{color:"#1FABAB"}} />
             </TouchableOpacity>
           </View>

             <View >
               <Text style={{fontSize:18}}>Tasks / Reminds</Text>
             </View>

              <View >           
               <TouchableOpacity>  
                <Icon type='AntDesign' name="pluscircle" style={{color:"#1FABAB"}} onPress={this.AddRemind} />
               </TouchableOpacity>
             </View>

         </View>

      <View style={{height:"92%"}}>
        <BleashupFlatList 
          initialRender={5}
          renderPerBatch={5}
          onScroll={this._onScroll}
          firstIndex={0}
          keyExtractor={this._keyExtractor}
          dataSource={this.state.eventRemindData}
          renderItem={(item, index) => {
            return (
              <TasksCard {...this.props} item={item} key={index} parentCardList={this}>
              </TasksCard>
            );
          }}
        >
        </BleashupFlatList >
  

      </View>
 
   </View>

   
   )}

 }