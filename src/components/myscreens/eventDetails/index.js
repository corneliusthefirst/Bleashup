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
import moment from 'moment';

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
          participant:request.Participant(),
          EventHighlightState:false

        }
  
     
  }


@autobind
initializer(){
  
    //let id = "8d117fa0-23d2-11ea-9234-6932809c090d";
    //let id = "4305a0f0-23d5-11ea-9234-6932809c090d";
    //pass event id (this.props.event_id)
    stores.Events.loadCurrentEvent(this.props.event_id).then((event)=>{
      //console.warn("here1",event)
      this.setState({EventData:event});
      //console.warn("event data",this.state.EventData);

      //obtain higlight data
      if(this.state.EventData.highlights.length > 0){
        forEach(this.state.EventData.highlights,(highlightId)=>{
      
          stores.Highlights.readFromStore().then((Highlights)=>{
          let highlight = find(Highlights, { id:highlightId });
  
          this.setState({highlightData: [ ...this.state.highlightData, highlight]}, ()=>{}); 
          
          });
       });
  
      }
      
      //set the creation_date and time
     
      //console.warn(this.state.EventData.created_at);
      //console.warn(this.state.creation_date,"and",this.state.creation_time)

      //this.state.participant.master = true;
      //this.state.participant.master = event.participant.master;
      //search current user among participants of the event
      stores.TempLoginStore.getUser().then((user)=>{
        //console.warn("here2",user)
        //stores.TemporalUsersStore.addUser(user).then((users)=>{console.warn("these are users",users)});
        let participant = find(this.state.EventData.participant, { phone:user.phone });
        this.setState({participant:participant});
        //console.warn("participant object",this.state.participant);

        //get creator nick-name
        if(this.state.EventData.creator_phone !=""){
         // console.warn("here3")
          stores.TemporalUsersStore.getUser(this.state.EventData.creator_phone).then((creatorInfo) =>{
           // console.warn("here4",creatorInfo)
            this.setState({username:creatorInfo.nickname});
            //console.warn("user nick name",this.state.username);
          })
        }     

           })



  });

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
    //console.warn(this.state.highlightData,"highlight data state");
    this.setState({highlightData: this.state.highlightData});
  }
  



  getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )
 _keyExtractor = (item, index) => item.id;
 _renderItem = ({item,index}) => (
   
    <HighlightCard item={item} deleteHighlight={(id)=>{this.deleteHighlight(id)}} ancien={true} participant={this.state.participant}/>
    
  );


  @autobind
  newHighlight(){
    this.setState({EventHighlightState:true})
  }


    render() {

    let creation_date= moment(this.state.EventData.created_at).format().split("T")[0]
    let creation_time= moment(this.state.EventData.created_at).format().split("T")[1].split("+")[0]

    	return(
 
      <View style={{height:"100%",backgroundColor:"#FEFFDE",width:"100%"}}>
        <View style={{height:"7%",width:"94%",justifyContent:"space-between",flexDirection:"row",backgroundColor:"#FEFFDE",alignItems:"center",marginLeft:"3%",marginRight:"3%"}}>
           <View >
             <TouchableOpacity>
                <Icon  onPress={this.back} type='MaterialCommunityIcons' name="keyboard-backspace" style={{color:"#1FABAB"}} />
             </TouchableOpacity>
           </View>

              <View >           
               <TouchableOpacity>  
                <Icon type='AntDesign' name="pluscircle" style={{color:"#1FABAB"}} onPress={this.newHighlight} />
               </TouchableOpacity>
             </View>

         </View>
  
      <View style={{height:"92%",flexDirection:"column",width:"100%"}} >
         <ScrollView>
            <View style={{height:this.state.highlightData.length==0? 0:height/4 + height/14,width:"100%"}} >
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
            {this.state.EventData.about.description != "" ?
             <Hyperlink onPress={(url)=>{Linking.openURL(url)}} linkStyle={{ color: '#48d1cc', fontSize: 16}}>
              <Text  dataDetectorType={'all'} style={{fontSize: 16,fontWeight:"500",margin:"1%"}} delayLongPress={800}  onLongPress={()=>{if(this.state.participant.master==true){
                this.setState({EventDescriptionState:true})
                this.refs.description_ref.init();
                }}}>{this.state.EventData.about.description}</Text> 
             </Hyperlink>:
              <Text style={{fontWeight:"500",margin:"1%",fontSize:30,alignSelf:'center',marginTop:(height)/8}} delayLongPress={800}  onLongPress={()=>{
                if(this.state.participant.master==true){this.setState({EventDescriptionState:true})}}}>{this.state.defaultDetail}</Text> }
            </View>
            </ScrollView>
           </View> 
            
         


        {this.state.EventData.location.string != "" ?
             <View style={{ flexDirection: "column",height:height/5,alignItems:"flex-end" ,marginRight:"3%",marginBottom:"5%"}}>


                    <TouchableOpacity delayLongPress={800}  onLongPress={()=>{if(this.state.participant.master==true){
                      this.setState({EventLocationState:true})
                      this.refs.location_ref.init();
                      }}} >
                        <Text ellipsizeMode="clip" numberOfLines={3} style={{ fontSize: 14, color: "#1FABAB", margin:"1%" }}>
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

                    <TouchableOpacity onPress={this.props.OpenLink} style={{margin:"1%" }}>
                        <Text note> View On Map </Text>
                    </TouchableOpacity>

              </View> :
              <TouchableOpacity delayLongPress={1000}  onLongPress={()=>{
                if(this.state.participant.master==true){
                  this.setState({EventLocationState:true})}}}>
              <View>
              <Text  ellipsizeMode="clip" numberOfLines={3} style={{ alignSelf:'flex-end',fontSize: 14, color: "#1FABAB", margin:"2%" }}>
                {this.state.defaultLocation}</Text>
              </View>
              </TouchableOpacity>}
      

            </ScrollView>
           
            <View style={{flexDirection:"row",position:'absolute',justifyContent:"space-between",bottom:0,margin:3,width:"98%"}}>
               <Text style={{margin:"1%",fontSize:11,color:"gray"}} >on the {creation_date} at {creation_time}</Text>
               <Text style={{margin:"1%",fontSize:11}}  note>by {this.state.username} </Text>
             </View>
        
        
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

   