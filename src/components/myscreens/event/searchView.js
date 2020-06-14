import React, { Component } from "react";
import { View, Animated, TouchableWithoutFeedback,TouchableOpacity, ScrollView , Dimensions, PanResponder,ActivityIndicator } from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text,Title,Thumbnail } from 'native-base';
import BleashupFlatList from '../../BleashupFlatList';
import testForURL from '../../../services/testForURL';
import stores from "../../../stores/index"
import GlobalFunctions from "../../globalFunctions"
import {uniq,concat,find} from "lodash";
import CacheImages from "../../CacheImages";
import colorList from '../../colorList';
import DetailsModal from "../../myscreens/invitations/components/DetailsModal";
import BeNavigator from '../../../services/navigationServices';

let globalFunctions =  GlobalFunctions;
let { height, width } = Dimensions.get('window');
export default class SearchView extends Component {
    constructor(props) {
        super(props)
        this.state = {
          data:[],
          loading:false,
          value:"",
          details: false,
          event:null
        }
    }

componentDidMount(){
   this.setState({data:stores.Events.searchdata});
}



searchFilterFunction = (text)=>{
  this.setState({loading: true,});
    globalFunctions.bleashupSearch(stores.Events.searchdata,text).then((data)=>{
      this.setState({data:data,value:text});
      this.setState({loading:false});
    })
}

openDetails=(event) => {
  this.setState({details:true,event:event});
}

navigateToEventDetails = (item) => {
  let event = find(stores.Events.events , { id:item.id});
  stores.Events.isParticipant(item.id, stores.Session.SessionStore.phone).then(status => {
      if (status) {
       BeNavigator.pushActivity(event,"EventChat")
      } else {
         this.openDetails(event);
      }
  })
}


   render(){
       return(
        
    <Container style={{height:"100%",width:colorList.containerWidth,backgroundColor:colorList.bodyBackground,alignItems:"center"}}>
       
       <View style={{height:colorList.headerHeight-10,width:"100%",alignItems:"center",backgroundColor:colorList.headerBackground,marginTop:"5%"}}>
        <View style={{flexDirection:"row",backgroundColor:colorList.bodyBackground,height:colorList.headerHeight-10,width:"94%",borderColor:"gray",borderWidth:1,
        justifyContent:"center",alignItems:"center",borderRadius:15}}>
          
              <Icon onPress={() => {this.props.navigation.goBack()}}
               style={{ color:colorList.bodyIcon,marginLeft:"2%",marginRight:"2%"}} type={"MaterialIcons"}name={"arrow-back"}></Icon>
                
              <Icon type="EvilIcons" name="search" />
               <Input style={{fontSize:15}} placeholder="search @activity/relation"  onChangeText={text => this.searchFilterFunction(text)}  value={this.state.value} />
              <Icon name="ios-people" style={{marginRight:"2%"}} />
        </View>
       </View>

       <View style={{flex:1,marginTop:"5%",marginLeft:"-3%"}}>

        {this.state.data.length == 0 ? null :
         (this.state.loading == true ?
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:colorList.bodyBackground }}>
               <ActivityIndicator />
            </Container> : (
               <BleashupFlatList
                    initialRender={20}
                    renderPerBatch={20}
                    style={{backgroundColor:colorList.bodyBackground}}
                    firstIndex={0}
                    //extraData={this.state}
                    keyExtractor={(item,index)=>item.id}
                    dataSource={this.state.data}
                    noSpinner = {true}
                    renderItem={(item,index) =>{

                     return(
                  
                     <View style={{flexDirection:"row",width:"100%",marginBottom:"2%",marginTop: '2%',}}>
                      
                      <View style={{width:colorList.containerWidth/5,alignItems:"center"}}>
                      <TouchableWithoutFeedback>
                             {item.background && testForURL(item.image) ? <CacheImages small thumbnails {...this.props}
                                 source={{ uri:item.image}} /> :
                                 <Thumbnail  small source={require("../../../../Images/images.jpeg")} ></Thumbnail>}
                         </TouchableWithoutFeedback>
                         </View>
     
                         <TouchableOpacity style={{width:(4*colorList.containerWidth)/5,marginTop: '2.2%',}} onPress={()=>{requestAnimationFrame(() => this.navigateToEventDetails(item))}} >
                         <View style={{width:(4*colorList.containerWidth)/5,flexDirection:"row"}}>
                         <View style={{flexDirection:"column",width:"76%"}}>
                                <Title style={{alignSelf:"flex-start",marginLeft:2,fontSize:14}}>{item.name}</Title>
                         </View>
                          <View style={{flexDirection:"column",width:"24%"}}>
                                <Text style={{alignSelf:"flex-start",fontSize:14}}>{item.type=="relation"?"@relation":"@activity"}</Text>
                         </View>
                         </View>
                         </TouchableOpacity>
                        </View>

                      )
                    }
                    }

                >
                </BleashupFlatList>)
                )}
        </View> 
       
         <DetailsModal goToActivity={() => {
                    this.props.navigation.navigate('Event',
                    {
                        'tab':'EventDetails',
                         Event:this.state.event
                    })
                  }} 
                  isToBeJoint={true}
                  event={this.state.event}
                  isOpen={this.state.details}
                  onClosed={() => {this.setState({details: false})}
                  }>
        </DetailsModal>

      </Container>
       )
   }

}