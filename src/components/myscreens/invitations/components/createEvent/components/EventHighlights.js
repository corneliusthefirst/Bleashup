import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea,List,ListItem,Label
} from "native-base";
 
import { StyleSheet, View,Image,TouchableOpacity,FlatList,ScrollView, Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import CacheImages from "../../../../../CacheImages";
import HighlightCard from "./HighlightCard"
import PhotoEnlargeModal from "../../PhotoEnlargeModal";
import ImagePicker from 'react-native-image-picker';
import  stores from '../../../../../../stores/index';
import {observer} from 'mobx-react'

const highlightData = stores.Events.highlightData


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
        super(props)
        this.state={
          enlargeImage:false,
          title:"",
          description:"",
          url:require('../../../../../../../Images/highlightphoto.jpg'),
          initialScrollIndex:2,
          highlightData:highlightData ,
          animateHighlight:false


        }

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
    const source = { uri: response.uri };
 
    // You can also display the image using data:
    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
 
   resolve(source)

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
    const source = { uri: response.uri };
 
    // You can also display the image using data:
    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
 
       resolve(source)
    }
   
 })

})

}

componentDidMount(){
  
  setInterval(() => {
    if(this.state.animateHighlight == true){
    this.flatListRef.scrollToIndex({animated: true, index: this.state.initialScrollIndex,viewOffset:0,viewPosition:0});

   if(this.state.initialScrollIndex >= (this.state.highlightData.length)-2){
     this.setState({initialScrollIndex:0})
   }else{
     this.setState({initialScrollIndex:this.state.initialScrollIndex + 2})
   }
    }
  } ,4000) 


 }

 //animation(){}





@autobind
back(){
  this.setState({animateHighlight:false})
  this.props.parentComponent.setState({EventHighlightState:false})

  }

@autobind
onChangedTitle(value){
  this.setState({title:value})
}
@autobind
onChangedDescription(value){
  this.setState({description:value})
}

@autobind
AddHighlight(){
  highlight={
    id: "",
    creator: "",
    event_id: "",
    created_at: "",
    updated_at: "",
    title:this.state.title,
    url:this.state.url,
    description:this.state.description
  }
 stores.Events.NewHighlightData.push(highlight)
}

  getItemLayout = (data, index) => (
    { length: 100, offset: 100 * index, index }
  )
 _keyExtractor = (item, index) => item.id;
 _renderItem = ({item,index}) => (
   
    <HighlightCard item={item} />
    
  );




    render() {
    	return(


     <Modal
      isOpen={this.props.parentComponent.state.EventHighlightState}
      onClosed={()=>{this.props.parentComponent.setState({EventHighlightState:false})}}
      style={{ height: "100%", borderRadius: 3,
      backgroundColor:"#FEFFDE",borderColor:'black',width: "99%",flexDirection:'column'  }}
      coverScreen={true}
      position={'bottom'}
      backdropPressToClose={false}
     >

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
            <View style={{height:"22%",width:"100%",borderColor:"gray",borderWidth:1}} >
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
                     <Input placeholder='Please enter event title' keyboardType='email-address' autoCapitalize="none" returnKeyType='next' inverse last
                      onChangeText={(value) => this.onChangedTitle(value)} />
                     </Item>
               </View>

              <View style={{height:height/2}}>
                 <View style={{flex:2,justifyContent:'space-between',alignItem:'center'}}>

                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"6%"}}
                     onPress={()=>{this.TakePhotoFromCamera().then(source =>{
                          this.setState({url: source});
                     })} }>
                     <Text> Take Photo From Camera</Text>
                    </Button>

                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"3%"}} 
                    onPress={()=>{this.TakePhotoFromLibrary().then(source=>{    
                      this.setState({ url: source})
                         }
                      )}}>
                     <Text> Take Photo From Library</Text>
                    </Button>

                 </View>

                <View style={{ flex: 4, flexDirection: 'column',justifyContent:'center',alignItem:'center',marginTop:"4%"}}>
                    <TouchableOpacity onPress={() => this.setState({ enlargeImage: true })} >
                        <Image  source={ this.state.url } style={{alignSelf:'center',
                            height: "90%",width: "90%", borderWidth: 1, borderColor: "#1FABAB", borderRadius:100
                        }}  />
                    </TouchableOpacity>
                </View>

                 <PhotoEnlargeModal isOpen={this.state.enlargeImage} onClosed={() => this.setState({ enlargeImage: false })} photo={this.state.url} />
              
                </View>


                <View  style={{height:height/2,alignItems:'flex-start',justifyContent:'center'}}>
                   <View style={{width:"100%",height:"100%"}}>
                  
                   <Text style={{alignSelf:'flex-start',margin:"3%",fontWeight:"400",fontSize:18}} >Highlight Description:</Text>
                   <Textarea style={{width:"94%",margin:"3%",height:"70%"}} bordered placeholder="Please enter highlight description"  onChangeText={(value) => this.onChangedDescription(value)} />

                   </View>
                 </View>
            
                
                 <View style={{height:height/8,justifyContent:'space-between',alignItem:'center'}}>

                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"#1FABAB",justifyContent:'center',alignItem:'center'}}
                     onPress={()=>{this.AddHighlight()}}>
                     <Text style={{color:"#FEFFDE"}}> Add Highlight </Text>
                    </Button>
                 </View>



            </ScrollView>

          </View>



        </View> 


             
  </Modal>

    )}

    }

   