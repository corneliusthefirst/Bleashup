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
import ImagePicker from 'react-native-customized-image-picker';
import  stores from '../../../../../stores/index';
import {observer} from 'mobx-react'
import moment from "moment"
import { head,filter,uniqBy,orderBy,find,findIndex,reject,uniq,indexOf,forEach,dropWhile } from "lodash";
import request from "../../../../../services/requestObjects";
import SearchImage from './SearchImage';
import  BleashupHorizontalFlatList from '../../../../BleashupHorizotalFlatList';

//create an extension to toast so that it can work in my modal


var uuid = require('react-native-uuid');
uuid.v1({
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date().getTime(),
  nsecs: Math.floor(Math.random() * 5678)+50
});





const options = {
  title: 'Select Avatar',
  //customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
    maxWidth:600,
    maxHeight:500,
    noData:true,
    allowEditing:true,
    quality:0.8
  },
};

let {height, width} = Dimensions.get('window');



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
          update:false,
          searchImageState:false
          
        }
      
    }
   




componentDidMount(){

    //i set the current new highlight data on startUp
    stores.Highlights.readFromStore().then(Highlights =>{
         // console.warn(Highlights,"All higlights");
          let highlight = find(Highlights, { id:this.props.highlight_id?this.props.highlight_id:"newHighlightId" }); 
         console.warn(highlight,"constructor higlight");
          this.setState({currentHighlight:highlight});
              
      });
       
        //console.warn(this.state.currentHighlight,"constructor");

       //On startUp for each highlightId in new Event i set all the highlightData
       stores.Events.readFromStore().then(Events => {
        //console.warn(Events,"All Events"); 
       let event =  find(Events, { id:this.props.event_id?this.props.event_id:"newEventId" });
   
       forEach(event.highlights,(highlightId)=>{
        stores.Highlights.readFromStore().then((Highlights)=>{
           let highlight = find(Highlights, { id:highlightId });
           //console.warn(highlight,"before"); 

           this.setState({highlightData: [ ...this.state.highlightData, highlight]}, () => { console.log(this.state.highlightData),"after" }); 
                    
       });

     });
     


  });




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

    ImagePicker.openCamera({
      cropping: true,
      quality:"medium"
    }).then(response => {
        let res = head(response);
        resolve(res.path);
        this.state.currentHighlight.url = res.path;
        this.setState({currentHighlight:this.state.currentHighlight});
        if(this.state.update==false){
        stores.Highlights.updateHighlightUrl(this.state.currentHighlight,false).then(()=>{});
        }
      })
 })


}


@autobind
TakePhotoFromLibrary(){
return new Promise((resolve, reject) => {

  ImagePicker.openPicker({
    cropping: true,
    quality:"medium"
  }).then(response => {
       let res = head(response);
       resolve(res.path);
       this.state.currentHighlight.url = res.path;
       this.setState({currentHighlight:this.state.currentHighlight});
       if(this.state.update==false){
       stores.Highlights.updateHighlightUrl(this.state.currentHighlight,false).then(()=>{});
       }
      })
})

}






@autobind
back(){
  this.props.onClosed();  
}

@autobind
resetHighlight(){
  this.state.currentHighlight = request.Highlight();
  this.state.currentHighlight.id = "newHighlightId";
  this.setState({currentHighlight:this.state.currentHighlight});
}



@autobind
onChangedTitle(value){
  //this.setState({title:value})
  this.state.currentHighlight.title = value;
  this.setState({currentHighlight:this.state.currentHighlight});
  if(this.state.update==false){
  stores.Highlights.updateHighlightTitle(this.state.currentHighlight,false).then(()=>{});
  }

}
@autobind
onChangedDescription(value){
  //this.setState({description:value})
  this.state.currentHighlight.description = value;
  this.setState({currentHighlight:this.state.currentHighlight});

  if(this.state.update==false){
    stores.Highlights.updateHighlightDescription(this.state.currentHighlight,false).then(()=>{});
  }

  
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
    newHighlight.event_id = this.props.event_id?this.props.event_id:"newEventId";   //new event id
   
    //console.warn(highlight);
    //add the new highlights to global highlights
    stores.LoginStore.getUser().then((user)=>{
      newHighlight.creator = user.name;
      newHighlight.created_at = moment().format("YYYY-MM-DD HH:mm");
    })

    this.state.highlightData.push(newHighlight);
    this.setState({highlightData:this.state.highlightData});

    if(this.props.event_id){
      this.props.parentComponent.state.highlightData.push(newHighlight);
      this.props.parentComponent.setState({highlightData:this.state.highlightData});
    }
   
    stores.Highlights.addHighlights(newHighlight ).then(()=>{});
    //add the new highlight id to our newly created event for it to be accessed later when needed using this id
    stores.Events.addHighlight(newHighlight.event_id, newHighlight.id,false).then(()=>{});
    stores.Events.readFromStore().then((Events)=>{console.warn(Events,"After highlight id insertion");})


     //reset the class currentHighlight state
     this.resetHighlight();
    
     //delete highlight and add a new highlight empty One
     stores.Highlights.removeHighlight("newHighlightId").then(()=>{});
     stores.Highlights.addHighlights(this.state.currentHighlight).then(()=>{});
     //stores.Highlights.resetHighlight(this.state.currentHighlight,false).then(()=>{});
     

   });
  }

}

@autobind
updateHighlight(){

stores.Highlights.updateHighlight(this.state.currentHighlight,false).then(()=>{});
this.resetHighlight();
this.setState({update:false});
this.props.onClosed();

}

@autobind
deleteHighlight(id){
  this.state.highlightData = reject(this.state.highlightData ,{id,id});
  console.warn(this.state.highlightData,"highlight data state");
  this.setState({highlightData: this.state.highlightData});
}


_keyExtractor = (item, index) => item.id;


_getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )

componentWillUnmount(){
  this.setState({animateHighlight:false});
}

componentWillMount(){
  //set this on mounting
  this.setState({animateHighlight:true});
}

    render() {
    	return(

   
     <Modal
      isOpen={this.props.isOpen}
      onClosed={()=>{
        this.props.onClosed()
        this.setState({animateHighlight:false})
      }}
      style={{ height: "100%", borderRadius: 3,
      backgroundColor:"#FEFFDE",borderColor:'black',width: "99%",flexDirection:'column'  }}
      coverScreen={true}
      position={'bottom'}
      swipeToClose={false}
      //backdropPressToClose={false}
     >
    <Root>
      <View style={{height:"100%",backgroundColor:"#FEFFDE",width:"100%"}}>
      <View style={{height:"8%",width:"96%",flexDirection:"row",backgroundColor:"#FEFFDE",alignItems:"flex-start",marginLeft:"2%",marginRight:"2%"}}>
           <View >
             <TouchableOpacity>
                <Icon  onPress={this.back} type='MaterialCommunityIcons' name="keyboard-backspace" style={{color:"#1FABAB"}} />
             </TouchableOpacity>
           </View>

         </View>

          <View style={{height:"95%",width:"100%"}}>

   <ScrollView ref={"svrollView"} >
     <View style={{height:this.state.highlightData.length==0 ? 0:height/4 + height/14,width:"100%",borderColor:"gray",borderWidth:1}} >
         <BleashupHorizontalFlatList
          initialRender={4}
          renderPerBatch={5}
          firstIndex={0}
          refHorizontal={(ref) => { this.flatListRef = ref }}
          keyExtractor={this._keyExtractor}
          dataSource={this.state.highlightData}
          parentComponent={this}
          getItemLayout={this._getItemLayout}
          renderItem={(item, index) => {
            return (
                <HighlightCard   participant={this.props.participant}  parentComponent={this} item={item} ancien={false} 
                   deleteHighlight={(id)=>{this.deleteHighlight(id)}} ref={"higlightcard"}/>
            );
          }} 
        >
        </BleashupHorizontalFlatList>
     </View>

          <View style={{height:height/6,alignItems:'center'}}>
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"500",fontSize:16}} >Highlight Name :</Text>
                    <Item  style={{borderColor:'black',width:"95%"}} rounded>
                     <Input value={this.state.currentHighlight.title} maxLength={40}  placeholder='Please enter highlight title' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                      onChangeText={(value) => this.onChangedTitle(value)} />
                     </Item>
               </View>

              <View style={{height:height/2 +height/12}}>
                 <View style={{flex:2,justifyContent:'space-between',alignItem:'center'}}>

                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"6%"}}
                     onPress={()=>{this.TakePhotoFromCamera().then((source) =>{})} }>
                        <View style={{flexDirection:"row"}}>
                           <Icon name="photo-camera" active={true} type="MaterialIcons"
                            style={{color: "#0A4E52",alignSelf:"flex-start"}}/>
                            <Text> Take Photo From Camera</Text>
                        </View>
                    </Button>

                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"3%"}} 
                    onPress={()=>{this.TakePhotoFromLibrary().then(source=>{})}}>
                         <View style={{flexDirection:"row"}}>
                            <Icon name="photo" active={true} type="FontAwesome"
                               style={{color: "#0A4E52",alignSelf:"flex-start"}}/>
                            <Text> Take Photo From Library</Text>
                          </View>
                    </Button>

                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"3%"}} 
                      onPress={()=>{this.setState({ searchImageState:true})}}>
                        <View style={{flexDirection:"row"}}>
                         <Icon name="google" active={true} type="AntDesign"
                            style={{color: "#0A4E52",alignSelf:"flex-start",marginLeft:5}}/>
                         <Text  style={{alignSelf:"center"}}> Download From Google</Text>
                        </View>
                    </Button>


                 </View>

                <View style={{ flex: 3, flexDirection: 'column',justifyContent:'center',alignItem:'center',marginTop:"4%"}}>
                    <TouchableOpacity onPress={() => this.setState({ enlargeImage: true })} >
                        <Image  source={this.state.currentHighlight.url!=""?{uri:this.state.currentHighlight.url}:this.state.defaultUrl} style={{alignSelf:'center',
                            height: "90%",width: "90%", borderWidth: 1, borderColor: "#1FABAB", borderRadius:100
                        }} />
                    </TouchableOpacity>
                </View>

                 <PhotoEnlargeModal isOpen={this.state.enlargeImage} onClosed={() => this.setState({ enlargeImage: false })} photo={this.state.currentHighlight.url} />
              
                </View>


                <View  style={{height:height/2,alignItems:'flex-start',justifyContent:'center'}}>
                   <View style={{width:"100%",height:"100%"}}>
                  
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"500",fontSize:16}} >Highlight Description :</Text>
                   <Textarea value={this.state.currentHighlight.description}  style={{width:"94%",margin:"3%",height:"70%",borderRadius:15,borderWidth:2,borderColor:"#9E9E9E",backgroundColor:"#f5fffa"}}  placeholder="Please enter highlight description"  onChangeText={(value) => this.onChangedDescription(value)} />

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
            <Button style={{width:"100%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"#1FABAB",justifyContent:'center',alignItem:'center'}}
               onPress={()=>{this.updateHighlight()}}>
               <Text style={{color:"#FEFFDE"}}> Update   Highlight </Text>
            </Button> 
            </TouchableOpacity>  }
            

                 </View>



            </ScrollView>

          </View>

        <SearchImage accessLibrary={()=>{this.TakePhotoFromLibrary().then(()=>{})}} isOpen={this.state.searchImageState} onClosed={() => {this.setState({ searchImageState: false })}}  />

        </View> 
  </Root>          

</Modal>

    )}

    }

  
     