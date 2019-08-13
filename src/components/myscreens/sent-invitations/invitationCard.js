import React, { Component } from 'react';
import {
  Platform, StyleSheet, Image, TextInput, FlatList, TouchableOpacity,
  ActivityIndicator, View, Alert, BackHandler, ToastAndroid
} from 'react-native';

import autobind from "autobind-decorator";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header, Form, Thumbnail, Item,
  Title, Input, Left, Right, H3, H1, H2, Spinner, Button, InputGroup,
  DatePicker, CheckBox, List, Accordion, DeckSwiper
} from "native-base";

import Swipeout from 'react-native-swipeout';
import Modal from 'react-native-modalbox';
import styles from './style';
import CacheImages from "../../CacheImages";
import Exstyles from './style';
import svg from '../../../../svg/svg';
import { createOpenLink } from "react-native-open-maps";
import ProfileModal from '../invitations/components/ProfileModal';
import PhotoModal from "../invitations/components/PhotoModal";
import DetailsModal from "../invitations/components/DetailsModal";
import globalState from "../../../stores/globalState";
import AccordionModule from "../invitations/components/Accordion";
import DoublePhoto from "../invitations/components/doublePhoto";


const defaultPlaceholderObject = {
  component: ActivityIndicator,
  props: {
    style: styles.activityIndicatorStyle
  }
};

// We will use this placeholder object to override the default placeholder.
const propOverridePlaceholderObject = {
  component: Image,
  props: {
    style: styles.image,
    // source: {require('../../../../Images/avatar.svg')}
  }
};

 swipperComponent = (
  <View style={{alignItems:"center"}}>
     <Icon name="trashcan"  type="Octicons" onPress={{}} style={{color:"#1FABAB"}}/>
  </View>)




//Private class component for a flatLisItem
class CardListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //this shall be used on choosing a key to delete
      activeRowKey: null,
      isOpenDetails: false,
      isOpenStatus: false,
      enlargeEventImage: false,
      accept: true,
      deny: true,
      message: "",
      textcolor: "",
      isJoining:false,
      hasJoin:false,
      hasGone:true,
      seen:true,
      cards:[],
      dataArray:[]

    };
  }
 

componentWillMount(){  
    this.setInitialData().then(()=>{
      resolve();
    })
}
 
@autobind 
setInitialData(){
    return new Promise((resolve,reject)=> {

    const AccordData = this.props.item.sender_status
    max_length = this.props.item.sender_status.length
    this.state.dataArray = [{ title: AccordData.slice(0, 35), content: AccordData.slice(35, max_length) }]
    //deck swiper object

    item = this.props.item

    Description = { event_title: item.event_title, event_description: item.event_description }
    this.state.cards.push(Description)


    for (i = 0; i < item.highlight.length; i++) {
      this.state.cards.push(item.highlight[i])
    }
      })
 }



  //Maps schedule
  Query = { query: this.props.item.location };
  OpenLink = createOpenLink(this.Query);
  OpenLinkZoom = createOpenLink({ ...this.Query, zoom: 50 });


//accepted invitation
@autobind
onAccept() {
  this.setState({accept:true})
  this.props.item.accept = true
 //;
}
//refused invitation
@autobind
onDenied() {
  this.setState({deny:true})
  this.props.item.deny = true
}


  render() {
 
    const swipeSettings = {
      autoClose: true,
      //take this and do something onClose
      onClose: (secId, rowId, direction) => {
        if (this.state.activeRowKey != null) {
          this.setState({ activeRowKey: null });
        }
      },
      //on open i set the activerowkey
      onOpen: (secId, rowId, direction) => {
        this.setState({ activeRowKey: this.props.item.key });
      },

      right: [

        {
          onPress: () => {
            const deletingRow = this.state.activeRowKey;

            Alert.alert(
              'Alert',
              'Are you sure you want to delete ?',
              [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },

                {
                  text: 'Yes', onPress: () => {
                    this.props.sendCardListData.splice(this.props.index, 1);
                    //make request to delete to database(back-end)
                  
                    //Refresh FlatList
                    this.props.parentCardList.refreshFlatList(deletingRow);
                  }
                },
              ],
              { cancelable: true }
            );

          },
          text: 'Delete', type: 'delete',  component: this.swipperComponent

        },

      ],

      rowId: this.props.index,
      sectionId: 1
    }


 
    return (
      <Swipeout {...swipeSettings}>
        <Card style={{}}>
          <CardItem>
            <Left>
              <TouchableOpacity onPress={() => this.setState({ isOpenStatus: true })} >
                <CacheImages small thumbnails source={{ uri: this.props.item.sender_Image }}
                />
              </TouchableOpacity>
              <Body >
                <Text style={styles.flatlistItem} >{this.props.item.sender_name}</Text>

                {this.state.dataArray.content == "" ? <Text style={{
                  color: 'dimgray', padding: 10,
                  fontSize: 16, marginTop: -10, borderWidth: 0
                }} note>{this.props.item.sender_status}</Text> :

                  <AccordionModule dataArray={this.state.dataArray}/>

                }
              </Body>
            </Left>
          </CardItem>

          <CardItem cardBody>
            <Left>
              <DoublePhoto enlargeImage={() => this.setState({ enlargeEventImage: true })} LeftImage={this.props.item.receiver_Image}
                RightImage={this.props.item.event_Image }/>
            </Left>

            <Body >
            <TouchableOpacity onPress={() => this.setState({ isOpenDetails: true })} >
              <Text style={{ marginLeft: -40 }} 
              >{this.props.item.event_title}</Text>
              <Text style={{ marginLeft: -40, color: 'dimgray', fontSize: 12 }}> on the {this.props.item.created_date} at {this.props.item.event_time}</Text>
            </TouchableOpacity>                
            </Body>
          </CardItem>

          <CardItem>
          { this.state.hasGone ? 
              <View style={{}}>
              <Icon name="check-all"  type="MaterialCommunityIcons" onPress={{}} style={{color:this.state.seen?"#1FABAB":"gray",marginLeft:300}}/>
              </View> :

              <View style={{}}>
              <Icon name="check"  type="AntDesign" onPress={{}} style={{color:"gray",marginLeft:300}}/>
              </View>

          }
          
          </CardItem>

          <CardItem style={{ margin: 10,flexDirection:'row',justifyContent:'space-between' }}>
          
              <Text style={{ color: 'dimgray', fontSize: 13}}>{this.props.item.received_date}</Text>

              <Text style={{  color: 'dimgray', fontSize: 13}}>{this.props.item.invitation_status}</Text>
          
          </CardItem>

            <ProfileModal isOpen={this.state.isOpenStatus} profile={{
            nickname: this.props.item.sender_name,
            image: this.props.item.sender_Image,
            status: this.props.item.sender_status
          }} onClosed={() => this.setState({ isOpenStatus: false })} onAccept ={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
           accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin}
           joined={() => this.setState({ hasJoin: true })} />

          <PhotoModal isOpen={this.state.enlargeEventImage} image={this.props.item.event_Image} onClosed={() => this.setState({ enlargeEventImage: false })} 
           onAccept ={this.onAccept} onDenied={this.onDenied} deny={this.state.deny}
           accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin}
           joined={() => this.setState({ hasJoin: true })} />

         <View style={{marginBottom:10}}>
         <DetailsModal isOpen={this.state.isOpenDetails} details={this.state.cards} location={this.props.item.location}
          event_organiser_name={this.props.item.event_organiser_name}
          created_date={this.props.item.created_date} 
          onClosed={() => this.setState({ isOpenDetails: false })} item={this.props.item}
          OpenLinkZoom = {this.OpenLinkZoom}  OpenLink={this.OpenLink} onAccept ={this.onAccept} onDenied ={this.onDenied} deny={this.state.deny}
          accept={this.state.accept} isJoining={this.state.isJoining} hasJoin={this.state.hasJoin} joined={() => this.setState({ hasJoin: true })}/>        
          </View>
        </Card>
      </Swipeout>
    );
  }
}




export default CardListItem





/* 
*/



 /*
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);

  }
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    ToastAndroid.show("Back button is pressedee", ToastAndroid.SHORT);
    this.closeAllModals
    return true;
  }
  handleEvent = (event) => {
    this.setState({
      isOpenStatus: false
    })
  }
  handleEvent2 = (event) => {
    this.setState({
      enlargeEventImage: false
    })
  }

  handleEvent3 = (event) => {
    this.setState({
      isOpenDetails: false
    })
  }
  @autobind closeAllModals() {
    return this.setState({
      isOpenDetails: false,
      isOpenStatus: false,
      enlargeEventImage: false
    })
  }
*/




