import React, { Component } from "react";
import {
  Content, Card, CardItem, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,Root,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea,List,ListItem,Label
} from "native-base";
 
import {Linking,Text,StyleSheet, View,Image,TouchableOpacity,FlatList,ScrollView, Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import CacheImages from "../../CacheImages";
import HighlightCard from "../event/createEvent/components/HighlightCard"
import PhotoEnlargeModal from "../invitations/components/PhotoEnlargeModal";
import ImagePicker from 'react-native-image-picker';
import  stores from '../../../stores/index';
import {observer} from 'mobx-react'
import { filter,uniqBy,head,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../services/requestObjects";

import EventTitle from "../event/createEvent/components/EventTitle";
import EventPhoto from "../event/createEvent/components/EventPhoto";
import EventLocation from "../event/createEvent/components/EventLocation";
import EventDescription from "../event/createEvent/components/EventDescription";
import EventHighlights from "../event/createEvent/components/EventHighlights";
import Hyperlink from 'react-native-hyperlink';


let {height, width} = Dimensions.get('window');

@observer
export default class EventDetailView extends Component {
   
    constructor(props) {
        super(props)
        this.state={
          enlargeImage:false,
          initialScrollIndex:2,
          highlightData:[],
          EventData:request.Event(),
          animateHighlight:true,
          defaultDetail:"No  Event Decription !!",
          defaultLocation:"No event location given !",
          username:"",
          EventDescriptionState:false,
          EventLocationState:false,
          creation_date:"",
          creation_time:"",
          status:request.Participant(),
          EventHighlightState:false

        }
  
         
  }


@autobind
initializer(){
    //let id = "43db0b10-0886-11ea-9234-771074f153d3";
    //pass event id
    stores.Events.loadCurrentEvent(this.props.event.id).then((event)=>{
     
        this.setState({EventData:event});
        //obtain higlight data
        forEach(this.state.EventData.highlights,(highlightId)=>{
      
        stores.Highlights.readFromStore().then((Highlights)=>{
        let highlight = find(Highlights, { id:highlightId });

        this.setState({highlightData: [ ...this.state.highlightData, highlight]}, () => { console.log(this.state.highlightData),"after" }); 
        
        let res = this.state.EventData.created_at.split(" ");
       
        this.setState({creation_date:res[0]});
        this.setState({creation_time:res[1]});
      
     });
   });
           //this.state.status.master = true;
           this.state.status.master = event.status.master;
           this.setState({status:this.state.status});  

});

//get user object for user nick-name
if(this.state.EventData.creator_phone){
   stores.TemporalUsersStore.getUser(this.state.EventData.creator_phone).then(user =>{
        this.setState({username:user.nick_name});
   })
  }

}
  


componentDidMount(){
  this.initializer();

  setInterval(() => {
    if((this.state.animateHighlight == true) && (this.state.highlightData.length > 2)){
    this.flatListRef.scrollToIndex({animated: true, index: this.state.initialScrollIndex,viewOffset:0,viewPosition:0});

   if(this.state.initialScrollIndex >= (this.state.highlightData.length)-2){
     this.setState({initialScrollIndex:0});
   }else{
     this.setState({initialScrollIndex:this.state.initialScrollIndex + 2})
   }
    }
  } ,4000) 


 }





@autobind
back(){
  this.setState({animateHighlight:false})
  //add backward navigation to calling page
}  
  
  @autobind
  deleteHighlight(id){
    this.state.highlightData = reject(this.state.highlightData ,{id,id});
    console.warn(this.state.highlightData,"highlight data state");
    this.setState({highlightData: this.state.highlightData});
  }
  



  getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )
 _keyExtractor = (item, index) => item.id;
 _renderItem = ({item,index}) => (
   
    <HighlightCard item={item} deleteHighlight={(id)=>{this.deleteHighlight(id)}} ancien={true}/>
    
  );


  @autobind
  newHighlight(){
    this.setState({EventHighlightState:true})
  }


    render() {
    	return(
 
      <View style={{height:"100%",backgroundColor:"#FEFFDE",width:"100%"}}>
        <View style={{height:"8%",width:"96%",justifyContent:"space-between",flexDirection:"row",backgroundColor:"#FEFFDE",alignItems:"center",marginLeft:"2%",marginRight:"2%"}}>
           <View >
             <TouchableOpacity>
                <Icon  onPress={this.back} type='MaterialCommunityIcons' name="keyboard-backspace" style={{color:"#1FABAB"}} />
             </TouchableOpacity>
           </View>

             <View >
               <Text style={{color:"#1FABAB",fontSize:18}}>Bleashup</Text>
             </View>

              <View >           
               <TouchableOpacity>  
                <Icon type='AntDesign' name="pluscircle" style={{color:"#1FABAB"}} onPress={this.newHighlight} />
               </TouchableOpacity>
             </View>

         </View>

          <View style={{height:"92%",width:"100%"}}>

           <ScrollView style={{flex:1}}>
            <View style={{height:this.state.highlightData.length==0? 0:height/4 + height/14,width:"100%",borderColor:"gray",borderWidth:1}} >
              <FlatList
              style={{flex:1}}
              data={this.state.highlightData}
              ref={(ref) => { this.flatListRef = ref }}
              horizontal={true}
              getItemLayout={this.getItemLayout}
              initialScrollIndex={0}
              initialNumToRender={3}
              maxToRenderPerBatch={4}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              />
            </View>
          
            <View  style={{height:this.state.EventData.about.description.length>500?height/3+height/16:height/3,width:"96%",borderWidth:1,borderColor:"#1FABAB",margin:"2%"}}>
            <ScrollView nestedScrolEnabled={true}>
            <View style={{flex:1}}>
            {this.state.EventData.about.description ?
             <Hyperlink onPress={(url)=>{Linking.openURL(url)}} linkStyle={{ color: '#48d1cc', fontSize: 16}}>
              <Text  dataDetectorType={'all'} style={{fontStyle:'italic', fontSize: 16,fontWeight:"500",margin:"1%"}} delayLongPress={1500}  onLongPress={()=>{if(this.state.status.master==true){
                this.setState({EventDescriptionState:true})
                this.refs.description_ref.init();
                }}}>{this.state.EventData.about.description}</Text> 
             </Hyperlink>:
              <Text style={{fontStyle:'italic',fontWeight:"500",margin:"1%",fontSize:30,alignSelf:'center',marginTop:(height)/8}} delayLongPress={1500}  onLongPress={()=>{
                if(this.state.status.master==true){
                  this.setState({EventDescriptionState:true})}}}>{this.state.defaultDetail}</Text> }
            
            </View>
            </ScrollView>
           </View> 
            
         


        {this.state.EventData.location.string ?
             <View style={{ flexDirection: "column",height:height/5,alignItems:"flex-end" ,marginRight:"3%"}}>


                    <TouchableOpacity delayLongPress={1500}  onLongPress={()=>{if(this.state.status.master==true){
                      this.setState({EventLocationState:true})
                      this.refs.location_ref.init();
                      }}} >
                        <Text ellipsizeMode="clip" numberOfLines={3} style={{ fontSize: 14, color: "#1FABAB", margin:"2%" }}>
                            {this.state.EventData.location.string }
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.props.OpenLinkZoom}>
                        <Image
                            source={require("../../../../Images/google-maps-alternatives-china-720x340.jpg")}
                            style={{
                                height: height/10,
                                width: width/3,
                                borderRadius: 15,
  

                            }}
                            resizeMode="contain"
                            onLoad={() => { }}
                        />

                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.props.OpenLink} style={{margin:"2%" }}>
                        <Text note> View On Map </Text>
                    </TouchableOpacity>

              </View> :
              <TouchableOpacity delayLongPress={1000}  onLongPress={()=>{
                if(this.state.status.master==true){
                  this.setState({EventLocationState:true})}}}>
              <View>
              <Text  ellipsizeMode="clip" numberOfLines={3} style={{ alignSelf:'flex-end',fontSize: 14, color: "#1FABAB", margin:"2%" }}>
                {this.state.defaultLocation}</Text>
              </View>
              </TouchableOpacity>  }
      
           <View style={{flexDirection:"row",marginTop:this.state.EventData.location.string?"3%":"28%"}}>
               <Text style={{alignSelf:"flex-start",fontSize:13,color:"gray"}} >on the {this.state.creation_date} at {this.state.creation_time}</Text>
               <Text style={{alignSelf:"flex-end",fontSize:15}}  note>{this.state.username}</Text>
           </View>


         </ScrollView>

       </View>

       <EventDescription isOpen={this.state.EventDescriptionState} onClosed={()=>{this.setState({EventDescriptionState:false})}}
        ref={"description_ref"} eventId={this.state.EventData.id} updateDes={true} parentComp={this}/>
        
       <EventLocation  isOpen={this.state.EventLocationState} onClosed={()=>{this.setState({EventLocationState:false})}}
        ref={"location_ref"}  updateLoc={true} eventId={this.state.EventData.id} parentComp={this} />
         
        <EventHighlights update={false}  isOpen={this.state.EventHighlightState} onClosed={()=>{this.setState({EventHighlightState:false})}}
           parentComponent={this} ref={"highlights"} event_id={this.state.EventData.id}/>

        </View> 
  

  
    )}

    }

   