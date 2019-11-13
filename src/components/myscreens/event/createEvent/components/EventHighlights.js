import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,Root,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea,List,ListItem,Label,Toast
} from "native-base";
   
import { StyleSheet, View,Image,TouchableOpacity,FlatList,ScrollView, Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
//import CacheImages from "../../../../CacheImages";
import HighlightCard from "./HighlightCard"
import PhotoEnlargeModal from "../../../invitations/components/PhotoEnlargeModal";
import ImagePicker from 'react-native-image-picker';
import  stores from '../../../../../stores/index';
import {observer} from 'mobx-react'
import moment from "moment"
import { filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../../../services/requestObjects";

//create an extension to toast so that it can work in my modal


var uuid = require('react-native-uuid');
uuid.v1({
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: Math.floor(Math.random() * 5678)+50
});


//const highlightData = stores.Events.highlightData


const options = {
  title: 'Select Avatar',
  //customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

let {height, width} = Dimensions.get('window')


export default class EventHighlights extends Component {
   
    constructor(props) {
        super(props);
        this.state={ 
          enlargeImage:false,
          title:"",
          description:"",
          url:"",
          defaultUrl:require('../../../../../../Images/highlightphoto.jpg'),     
          initialScrollIndex:2,
          highlightData:[],
          animateHighlight:false,
          currentHighlight:request.Highlight(),
          update:false
    


        }

 
           //i set the current new highlight data on startUp
           stores.Highlights.readFromStore().then(Highlights =>{
               console.warn(Highlights,"All higlights");
               let highlight = find(Highlights, { id:"newHighlightId" }); 
               console.warn(highlight,"constructor higlight");
               //this.setState({currentHighlight:highlight});
              
            });
       
        console.warn(this.state.currentHighlight,"constructor");

       //On startUp for each highlightId in new Event i set all the highlightData
       stores.Events.readFromStore().then(Events => {
        console.warn(Events,"All Events"); 
       let event =  find(Events, { id:"newEventId" });
   
       forEach(event.highlights,(highlightId)=>{
        stores.Highlights.readFromStore().then((Highlights)=>{
           let highlight = find(Highlights, { id:highlightId });
           console.warn(highlight,"before"); 

           this.setState({highlightData: [ ...this.state.highlightData, highlight]}, () => { console.log(this.state.highlightData),"after" }); 
                    
       });

     });


  });


      
    }
   





componentDidMount(){

  setInterval(() => {
    if((this.state.animateHighlight == true) && (this.state.highlightData.length > 2)){
    this.flatListRef.scrollToIndex({animated: true, index: this.state.initialScrollIndex,viewOffset:0,viewPosition:0});

   if(this.state.initialScrollIndex >= (this.state.highlightData.length)-2){
     this.setState({initialScrollIndex:0})
   }else{
     this.setState({initialScrollIndex:this.state.initialScrollIndex + 2})
   }
    }
  } ,4000) 


 }



@autobind
TakePhotoFromCamera(){

return new Promise((resolve, reject) => {

ImagePicker.launchCamera(options, (response) => {

  if (response.didCancel) {
    console.log('User cancelled image picker');
  } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  } else { 
      
        resolve(response.uri);
        this.state.currentHighlight.url = response.uri;
        if(!this.state.update){
        stores.Highlights.updateHighlightUrl(this.state.currentHighlight,false).then(()=>{resolve()});
        }else{;}
      }

   })
 })

}


@autobind
TakePhotoFromLibrary(){
return new Promise((resolve, reject) => {
ImagePicker.launchImageLibrary(options, (response) => {
 
  if (response.didCancel) {
    console.log('User cancelled image picker');
  } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  } else {
       resolve(response.uri )
       this.state.currentHighlight.url = response.uri;
       if(!this.state.update){
       stores.Highlights.updateHighlightUrl(this.state.currentHighlight,false).then(()=>{resolve()});
       }else{;}
      }
   
 })

})

}






@autobind
back(){
  this.setState({animateHighlight:false})
  this.props.parentComponent.setState({EventHighlightState:false})

  }

@autobind
onChangedTitle(value){
  //this.setState({title:value})
  this.state.currentHighlight.title = value;
  this.setState({currentHighlight:this.state.currentHighlight});
  if(!this.state.update){
  stores.Highlights.updateHighlightTitle(this.state.currentHighlight,false).then(()=>{resolve()});
  }else{ ; }

}
@autobind
onChangedDescription(value){
  //this.setState({description:value})
  this.state.currentHighlight.description = value;
  this.setState({currentHighlight:this.state.currentHighlight});

  if(!this.state.update){
    stores.Highlights.updateHighlightDescription(this.state.currentHighlight,false).then(()=>{resolve()});
  }else{ ; }

  
}

@autobind
AddHighlight(){
if(this.state.currentHighlight.url == ""){
  
  Toast.show({
      text: "Highlight must have atleast an image !",
      buttonText: "Okay",
      duration:6000,
      buttonTextStyle: { color: "#008000" },
      buttonStyle: { backgroundColor: "#5cb85c" },
      textStyle:{color:"salmon",fontSize:15}
    })

  }else{
  var arr = new Array(32);
  let num = Math.floor(Math.random() * 16)
  uuid.v1(null, arr,num); 
  let New_id = uuid.unparse(arr,num);
  //console.warn(id);

  stores.Highlights.readFromStore().then(Highlights =>{ 
    let newHighlight = request.Highlight();
    let highlight = find(Highlights, { id:"newHighlightId" }); 
    newHighlight =  highlight;
    newHighlight.id = New_id;
    //console.warn(highlight);
    //add the new highlights to global highlights
    stores.LoginStore.getUser().then((user)=>{
      newHighlight.creator = user.name;
      newHighlight.created_at = moment().format("YYYY-MM-DD HH:mm");
    })

    this.state.highlightData.push(newHighlight);
    this.setState({highlightData:this.state.highlightData});
   
    stores.Highlights.addHighlights(newHighlight ).then(()=>{resolve() });
    //add the new highlight id to our newly created event for it to be accessed later when needed using this id
    stores.Events.addHighlight("newEventId", newHighlight.id,false).then(()=>{resolve()});

     //reset the class currentHighlight state
     this.state.currentHighlight = request.Highlight();
     this.state.currentHighlight.id = "newHighlightId";
     this.setState({currentHighlight:this.state.currentHighlight});
    
     //delete highlight and add a new highlight empty One
     stores.Highlights.removeHighlight("newHighlightId").then(()=>{});
     stores.Highlights.addHighlights(this.state.currentHighlight,false).then(()=>{});
     //stores.Highlights.resetHighlight(this.state.currentHighlight,false).then(()=>{});
     
     //console.warn(this.state.currentHighlight);

   });
  }

}

@autobind
UpdateHighlight(){
if(this.state.update ){

//remove the highlight having this id and add the updated one so when it fetch it is updated one
stores.Highlights.removeHighlight(this.state.currentHighlight.id).then(()=>{});
stores.Highlights.addHighlights(this.state.currentHighlight,false).then(()=>{});

//reset back the currenthighlight and desactivate the update state
this.state.currentHighlight = request.Highlight();
this.state.currentHighlight.id = "newHighlightId";
this.setState({currentHighlight:this.state.currentHighlight});
this.setState({update:false});

 
}

}





 
  getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )
 _keyExtractor = (item, index) => item.id;
 _renderItem = ({item,index}) => (
   
    <HighlightCard item={item} parentComponent={this} ref={"higlightcard"}/>
    
  );




    render() {
    	return(

   
     <Modal
      isOpen={this.props.isOpen}
      onClosed={this.props.onClosed}
      style={{ height: "100%", borderRadius: 3,
      backgroundColor:"#FEFFDE",borderColor:'black',width: "99%",flexDirection:'column'  }}
      coverScreen={true}
      position={'bottom'}
      swipeToClose={false}
      backdropPressToClose={false}
     >
    <Root>
      <View style={{height:"100%",backgroundColor:"#FEFFDE",width:"100%"}}>
            <Header>
            <Body>
              <Title>BleashUp </Title>
            </Body>
            <Right>
              <Button onPress={this.back} transparent>
                <Icon type='Ionicons' name="md-arrow-round-back" />
              </Button>
            </Right>
           </Header>

          <View style={{height:"95%",width:"100%"}}>

           <ScrollView>
            <View style={{height:height/4 + height/14,width:"100%",borderColor:"gray",borderWidth:1}} >
              <FlatList
              style={{flex:1}}
              data={this.state.highlightData}
              ref={(ref) => { this.flatListRef = ref }}
              horizontal={true}
              getItemLayout={this.getItemLayout}
              initialScrollIndex={0}
              initialNumToRender={3}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              />
            </View>

          <View style={{height:height/6,alignItems:'center'}}>
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"400",fontSize:18}} >Highlight Name :</Text>
                    <Item  style={{borderColor:'black',width:"95%"}} rounded>
                     <Input value={this.state.currentHighlight.title} placeholder='Please enter event title' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                      onChangeText={(value) => this.onChangedTitle(value)} />
                     </Item>
               </View>

              <View style={{height:height/2}}>
                 <View style={{flex:2,justifyContent:'space-between',alignItem:'center'}}>

                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"6%"}}
                     onPress={()=>{this.TakePhotoFromCamera().then(source =>{
                        
                          this.state.currentHighlight.url = source;
                          this.setState({currentHighlight:this.state.currentHighlight});
                          stores.Highlights.updateHighlightUrl(this.state.currentHighlight,false).then(()=>{resolve()});
                     })} }>
                     <Text> Take Photo From Camera</Text>
                    </Button>

                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"3%"}} 
                    onPress={()=>{this.TakePhotoFromLibrary().then(source=>{    
                      
                      this.state.currentHighlight.url = source;
                      this.setState({currentHighlight:this.state.currentHighlight});
                      stores.Highlights.updateHighlightUrl(this.state.currentHighlight,false).then(()=>{resolve()});
                         }
                      )}}>
                     <Text> Take Photo From Library</Text>
                    </Button>

                 </View>

                <View style={{ flex: 4, flexDirection: 'column',justifyContent:'center',alignItem:'center',marginTop:"4%"}}>
                    <TouchableOpacity onPress={() => this.setState({ enlargeImage: true })} >
                        <Image  source={this.state.currentHighlight.url?{uri:this.state.currentHighlight.url}:this.state.defaultUrl} style={{alignSelf:'center',
                            height: "90%",width: "90%", borderWidth: 1, borderColor: "#1FABAB", borderRadius:100
                        }}  />
                    </TouchableOpacity>
                </View>

                 <PhotoEnlargeModal isOpen={this.state.enlargeImage} onClosed={() => this.setState({ enlargeImage: false })} photo={this.state.currentHighlight.url} />
              
                </View>


                <View  style={{height:height/2,alignItems:'flex-start',justifyContent:'center'}}>
                   <View style={{width:"100%",height:"100%"}}>
                  
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"400",fontSize:18}} >Highlight Description :</Text>
                   <Textarea value={this.state.currentHighlight.description}  style={{width:"94%",margin:"3%",height:"70%"}} bordered placeholder="Please enter highlight description"  onChangeText={(value) => this.onChangedDescription(value)} />

                   </View>
                 </View>
            
                
                 <View style={{height:height/8,justifyContent:'space-between',alignItem:'center'}}>
          {!this.state.update?
          <TouchableOpacity style={{width:"80%",alignSelf:'center'}}>
            <Button style={{width:"100%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"#1FABAB",justifyContent:'center',alignItem:'center'}}
               onPress={()=>{this.AddHighlight()}}>
               <Text style={{color:"#FEFFDE"}}> Add   Highlight </Text>
             </Button> 
            </TouchableOpacity> :
            <TouchableOpacity style={{width:"80%",alignSelf:'center'}}>
            <Button style={{borderRadius:15,borderColor:"#1FABAB",backgroundColor:"#1FABAB",justifyContent:'center',alignItem:'center'}}
               onPress={()=>{this.UpdateHighlight()}}>
               <Text style={{color:"#FEFFDE"}}> Update   Highlight </Text>
            </Button> 
            </TouchableOpacity>  }
            

                 </View>



            </ScrollView>

          </View>



        </View> 
  </Root>          

</Modal>

    )}

    }

   