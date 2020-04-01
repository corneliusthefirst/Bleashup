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
    if (this.state.loading) {
      return (
        <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </Container>
      );
    }

       return(
        
        <Container style={{height: '100%',width:"100%",backgroundColor: 'white',alignItems:"center"}}>
        <Header searchBar rounded style={{backgroundColor:"FEFFDE",borderRadius:20,height:45,marginTop:5,width:"100%"}}>
          <Item style={{width:"100%",backgroundColor:"white",borderRadius:10}}> 
            <Icon type="EvilIcons" name="search" />
            <Input placeholder="Search"  onChangeText={text => this.searchFilterFunction(text)}  value={this.state.value} />
            <Icon name="ios-people" />
          </Item>

        </Header>


        <View style={{flex:1,backgroundColor:"red",marginTop:10}}>

        {this.state.loading ?
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
               <ActivityIndicator />
            </Container> : (
               <BleashupFlatList
                    initialRender={10}
                    renderPerBatch={5}
                    style={{backgroundColor:"#FEFFDE"}}
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
                     <View style={{flexDirection:"row",margin:"3%",width:width-width/5}}>
                      <View style={{width:"15%"}}>
                      <TouchableWithoutFeedback>
                             {item.background && testForURL(item.background) ? <CacheImages small thumbnails {...this.props}
                                 source={{ uri:item.background}} /> :
                                 <Thumbnail  small source={require("../../../../Images/images.jpeg")} ></Thumbnail>}
                         </TouchableWithoutFeedback>
                         </View>
     
                        <TouchableOpacity style={{width:"82%"}} onPress={()=>{this.openDetail(item)}} >
                         <View style={{flexDirection:"column",width:"78%"}}>
                                <Title style={{alignSelf:"flex-start",marginLeft:2}}>{item.about.title}</Title>
                                <Title style={{color:"gray",alignSelf:"flex-start",fontSize:15,marginLeft:2}}>{item.about.description}</Title>
                         </View>
                        </TouchableOpacity>
                    </View> :
                   
                    <View style={{flexDirection:"row",margin:"3%",width:width-width/5}}>
                      <View style={{width:"15%"}}>
                      <TouchableWithoutFeedback>
                             {opponent.profile && testForURL(opponent.profile) ? <CacheImages small thumbnails {...this.props}
                                 source={{ uri:opponent.profile}} /> :
                                 <Thumbnail  small source={require("../../../../Images/images.jpeg")} ></Thumbnail>}
                         </TouchableWithoutFeedback>
                         </View>
     
                        <TouchableOpacity onPress={()=>{this.openDetail(item)}}>
                         <View style={{flexDirection:"column",width:"82%"}}>
                                <Title style={{alignSelf:"flex-start",marginLeft:2}}>{opponent.nickname}</Title>
                                <Title style={{color:"gray",alignSelf:"flex-start",fontSize:15,marginLeft:2}}>{opponent.status}</Title>
                         </View>
                        </TouchableOpacity>
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