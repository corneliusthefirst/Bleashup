import React, { Component } from "react";
import { View, Animated, TouchableWithoutFeedback, Dimensions, PanResponder,ActivityIndicator } from 'react-native';
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { Container, Header, Item, Input, Icon, Button, Text,Title,Thumbnail } from 'native-base';
import BleashupFlatList from '../../BleashupFlatList';
import testForURL from '../../../services/testForURL';
import stores from "../../../stores/index"
import GlobalFunctions from "../../globalFunctions"
import {uniq,concat} from "lodash";
import CacheImages from "../../CacheImages";
import colorList from '../../colorList';

let globalFunctions = new GlobalFunctions();
let { height, width } = Dimensions.get('window');
export default class SearchView extends Component {
    constructor(props) {
        super(props)
        this.state = {
          data:[],
          loading:true,
          value:""
        }
    }

dataArray=[]

componentDidMount(){
  this.fetchData(); 
}

fetchData = ()=>{
  stores.Events.readFromStore().then((events)=>{
    this.setState({ data:events,loading: false,});
    this.dataArray = events;
  }).catch(error => {
    this.setState({ error:error, loading: false });
  });
}

searchFilterFunction = (text)=>{
   //events = globalFunctions.bleashupSearch(["title","",""],text,this.dataArray)
   activitydata = globalFunctions.bleashupSearchActivity(text,this.dataArray);
   console.warn("activity data",activitydata);
   relationdata = globalFunctions.bleashupSearchRelation(text,this.dataArray);
   console.warn("relationdata",relationdata);
   data = uniq(concat(activitydata,relationdata));
   this.setState({data:data});
   console.warn("here");
}


opponent={}
 getuser = (item)=>{
       //this is done to use as default for my test
       if(item.type == "relation"){
          item.participant.forEach((participant)=>{
               if(participant.phone != stores.LoginStore.user.phone){
                this.opponent = participant;
               }
          })
      }
      return this.opponent;
 }

   render(){
       return(
        
        <Container style={{height:"100%",width:colorList.containerWidth,backgroundColor:colorList.bodyBackground,alignItems:"center"}}>
       
       <View style={{height:65,width:"100%",alignItems:"center",backgroundColor:colorList.headerBackground}}>
        <View style={{flexDirection:"row",backgroundColor:colorList.bodyBackground,height:colorList.headerHeight,width:"95%",borderColor:"gray",borderWidth:1,justifyContent:"center",marginTop:"2%",alignItems:"center",borderRadius:15}}>
          
              <Icon onPress={() => {this.props.navigation.goBack()}}
               style={{ color:colorList.bodyIcon,marginLeft:"2%",marginRight:"2%"}} type={"MaterialIcons"}name={"arrow-back"}></Icon>
                
              <Icon type="EvilIcons" name="search" />
               <Input placeholder="search @activity/relation"  onChangeText={text => this.searchFilterFunction(text)}  value={this.state.value} />
              <Icon name="ios-people" style={{marginRight:"2%"}} />
        </View>
       </View>

        <View style={{flex:1,marginTop:10}}>

        {this.state.loading ?
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
               <ActivityIndicator />
            </Container> : (
               <BleashupFlatList
                    initialRender={10}
                    renderPerBatch={5}
                    style={{backgroundColor:colorList.bodyBackground}}
                    firstIndex={0}
                    //extraData={this.state}
                    keyExtractor={(item,index)=>item.id}
                    dataSource={this.state.data}
                    noSpinner = {true}
                    renderItem={(item,index) =>{
                    opponent = this.getuser(item);
                    console.warn(opponent);

                   return(
                     item.type=="activity"?
                     <View style={{flexDirection:"row",width:"100%",marginBottom:"5%"}}>
                      
                      <View style={{width:colorList.containerWidth/5,alignItems:"center"}}>
                      <TouchableWithoutFeedback>
                             {item.background && testForURL(item.background) ? <CacheImages small thumbnails {...this.props}
                                 source={{ uri:item.background}} /> :
                                 <Thumbnail  small source={require("../../../../Images/images.jpeg")} ></Thumbnail>}
                         </TouchableWithoutFeedback>
                         </View>
     
                         <TouchableWithoutFeedback style={{width:(4*colorList.containerWidth)/5,backgroundColor:"red"}} onPress={()=>{this.openDetail(item)}} >
                         <View style={{flexDirection:"column",width:"100%"}}>
                                <Title style={{alignSelf:"flex-start",marginLeft:2,fontSize:14}}>{item.about.title}</Title>
                                <Title style={{color:"gray",alignSelf:"flex-start",fontSize:14,marginLeft:2}}>{item.about.description}</Title>
                         </View>
                         </TouchableWithoutFeedback>

                    </View> :
                   
                    <View style={{flexDirection:"row",width:"100%",marginBottom:"5%"}}>

                      <View style={{width:colorList.containerWidth/5,alignItems:"center"}}>
                      <TouchableWithoutFeedback>
                             {opponent.profile && testForURL(opponent.profile) ? <CacheImages small thumbnails {...this.props}
                                 source={{ uri:opponent.profile}} /> :
                                 <Thumbnail  small source={require("../../../../Images/images.jpeg")} ></Thumbnail>}
                         </TouchableWithoutFeedback>
                         </View>
     
                         <TouchableWithoutFeedback style={{width:(4*colorList.containerWidth)/5,backgroundColor:"red"}} onPress={()=>{this.openDetail(item)}} >
                         <View style={{flexDirection:"column",width:"100%"}}>
                                <Title style={{alignSelf:"flex-start",marginLeft:2,fontSize:14}}>{opponent.nickname}</Title>
                                <Title style={{color:"gray",alignSelf:"flex-start",fontSize:14,marginLeft:2}}>{opponent.status}</Title>
                         </View>
                         </TouchableWithoutFeedback>
                    </View>
                                  

                      )
                    }
                    }

                >
                </BleashupFlatList>)}
        </View> 
        
      </Container>
       )
   }

}