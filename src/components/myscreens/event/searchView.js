import React, { Component } from "react";
import { View,  TouchableWithoutFeedback, TouchableOpacity, Text,  Dimensions, ActivityIndicator, TextInput,StyleSheet } from 'react-native';
import BleashupFlatList from '../../BleashupFlatList';
import testForURL from '../../../services/testForURL';
import stores from "../../../stores/index"
import GlobalFunctions from "../../globalFunctions"
import {find} from "lodash";
import CacheImages from "../../CacheImages";
import colorList from '../../colorList';
import DetailsModal from "../../myscreens/invitations/components/DetailsModal";
import BeNavigator from '../../../services/navigationServices';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GState from "../../../stores/globalState";
import EvilIcons  from 'react-native-vector-icons/EvilIcons';
import Ionicons  from 'react-native-vector-icons/Ionicons';
import rounder from "../../../services/rounder";
import shadower from "../../shadower";
import ActivityPages from '../eventChat/chatPages';

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
       BeNavigator.pushActivity(event,ActivityPages.chat)
      } else {
         this.openDetails(event);
      }
  })
}


   render(){
       return(
    <View style={{height:"100%",width:colorList.containerWidth,backgroundColor:colorList.bodyBackground,alignItems:"center"}}>
       <View style={{height:colorList.headerHeight-10,width:"100%",alignItems:"center",backgroundColor:colorList.headerBackground,marginTop:"5%"}}>
        <View style={{flexDirection:"row",backgroundColor:colorList.bodyBackground,height:colorList.headerHeight-10,width:"94%",borderColor:"gray",borderWidth:1,
        justifyContent:"center",alignItems:"center",borderRadius:15}}>
          
              <MaterialIcons onPress={() => {this.props.navigation.goBack()}}
               style={{ color:colorList.bodyIcon,marginLeft:"2%",marginRight:"2%",...GState.defaultIconSize}} type={"MaterialIcons"}name={"arrow-back"}/>
                
              <EvilIcons type="EvilIcons"style={{...GState.defaultIconSize}} name="search" />
               <TextInput style={{fontSize:15}} placeholder="search @activity/relation"  onChangeText={text => this.searchFilterFunction(text)}  value={this.state.value} />
              <Ionicons name="ios-people" style={{marginRight:"2%",...GState.defaultIconSize}} />
        </View>
       </View>
       <View style={{flex:1,marginTop:"5%",marginLeft:"-3%"}}>
        {this.state.data.length == 0 ? null :
         (this.state.loading == true ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:colorList.bodyBackground }}>
               <ActivityIndicator />
            </View> : (
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
                      
                      <View style={{width:"20%",alignItems:"center"}}>
                      <TouchableWithoutFeedback>
                             {item.background && testForURL(item.image) ? <CacheImages small thumbnails {...this.props}
                                 source={{ uri:item.image}} /> :
                                 <Image resizeMode={"cover"} style={styles.thumbnail}  source={require("../../../../Images/images.jpeg")} />}
                         </TouchableWithoutFeedback>
                         </View>
     
                         <TouchableOpacity style={{width:((4/5)*100).toFixed(1).toString()+"%" ,marginTop: '2.2%',}} onPress={()=>{requestAnimationFrame(() => this.navigateToEventDetails(item))}} >
                           <View style={{ width: ((4/5)*100).toFixed(1).toString()+"%",flexDirection:"row"}}>
                         <View style={{flexDirection:"column",width:"76%"}}>
                                <View style={{alignSelf:"flex-start",marginLeft:2,fontSize:14}}>{item.name}</View>
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
                        'tab': ActivityPages.starts,
                         Event:this.state.event
                    })
                  }} 
                  isToBeJoint={true}
                  event={this.state.event}
                  isOpen={this.state.details}
                  onClosed={() => {this.setState({details: false})}
                  }>
        </DetailsModal>
      </View>
       )
   }
}

const styles = StyleSheet.create({
  thumbnail:{
    ...rounder(30,colorList.bodyBackground),
    ...shadower(3)
  }
})