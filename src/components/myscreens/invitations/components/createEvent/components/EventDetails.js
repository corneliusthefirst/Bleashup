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


let {height, width} = Dimensions.get('window')


@observer
export default class EventDetailView extends Component {
   
    constructor(props) {
        super(props)
        this.state={
          enlargeImage:false,
          initialScrollIndex:2,
          highlightData:highlightData ,
          animateHighlight:true,
          EventDetailState:true,
          defaultDetail:"No  Event Decription !!",
          defaultLocation:""


        }
       this.Props ={
        location:"gare de grenoble",
        //description:"Après une période de concertation publique, le chantier de modernisation de la gare SNCF de Grenoble, ainsi que la construction d'une nouvelle gare routière, ont été lancés dès l'été 20145. Ces travaux comprennent un prolongement du passage souterrain sud, une nouvelle entrée de gare côté Europole vers la place Robert-Schuman, une nouvelle zone d'accueil pour les taxis, une refonte du hall de vente et de l'espace billetterie, une nouvelle gare routière de vingt quais disposant de son propre bâtiment, dont le rez-de-chaussée sert d'espace d'attente des voyageurs et l'étage est affecté à l'exploitation et aux conducteurs.",
       //location:"",
        description:"",
        date:"17/10/2018",
        time:"12:15"
       }
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





@autobind
back(){
  this.setState({animateHighlight:false})
  //this.props.parentComponent.setState({EventHighlightState:false})
  this.setState({EventHighlightState:false})

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
      //isOpen={this.props.parentComponent.state.EventDetailState}
      //onClosed={()=>{this.props.parentComponent.setState({EventDetailState:false})}}
      isOpen={this.state.EventDetailState}
      onClosed={()=>{this.setState({EventDetailState:false})}}
      style={{ height: "100%", borderRadius: 3,
      backgroundColor:"#FEFFDE",borderColor:'black',width: "99%",flexDirection:'column'  }}
      position={'center'}
      swipeToClose={false}

     >

      <View style={{height:"100%",backgroundColor:"#FEFFDE",width:"100%"}}>
        <View style={{height:"8%",width:"100%"}}>
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
         </View>

          <View style={{height:"92%",width:"100%"}}>

           <ScrollView style={{flex:1}}>
            <View style={{height:(height/4)+(height/8),width:"100%",borderColor:"gray",borderWidth:1}} >
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
          
            <View  style={{height:height/3,width:"96%",borderWidth:1,borderColor:"#1FABAB",margin:"2%"}}>
            <ScrollView nestedScrolEnabled={true}>
            <View style={{flex:1}}>
            {this.Props.description ?
              <Text  style={{fontStyle:'italic',fontWeight:"500",margin:"2%"}}>{this.Props.description}</Text> :
              <Text style={{fontStyle:'italic',fontWeight:"500",margin:"2%",fontSize:30,alignSelf:'center',marginTop:(height)/8}}>{this.state.defaultDetail}</Text> }
            
            </View>
            </ScrollView>
           </View> 
            
         


{this.Props.location ?
       <View style={{ flexDirection: "column",height:height/5,alignItems:"flex-end" ,marginRight:"3%"}}>


                    <TouchableOpacity>
                        <Text ellipsizeMode="clip" numberOfLines={3} style={{ fontSize: 14, color: "#1FABAB", margin:"2%" }}>
                            {this.Props.location}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.props.OpenLinkZoom}>
                        <Image
                            source={require("../../../../../../../Images/google-maps-alternatives-china-720x340.jpg")}
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
              <View>
              <Text>{this.state.defaultLocation}</Text>
              </View> }
      



         </ScrollView>

       </View>





        </View> 


             
  </Modal>

    )}

    }

   