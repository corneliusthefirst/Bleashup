import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert,Textarea,List,ListItem,Label
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity,FlatList,ScrollView,Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import autobind from "autobind-decorator";
import Swipeout from 'react-native-swipeout';
import PhotoEnlargeModal from "../../../invitations/components/PhotoEnlargeModal";
import CacheImages from '../../../../CacheImages';
import testForURL from '../../../../../services/testForURL';
import shadower from "../../../../shadower";
import HighLight from "../../../highlights_details/Highlight";

let {height, width} = Dimensions.get('window')

export default class HighlightCardDetail extends Component {
    constructor(props) {
        super(props)
        this.state={
          enlargeImage:false
         }
    }

    render(){
      return(
     <Modal
                backButtonClose={true}
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                position={'bottom'}
                swipeToClose={true}
                style={{
                    height:"90%",alignSelf: 'center',
                    backgroundColor:"#FEFFDE",borderTopLeftRadius: 8,borderTopRightRadius: 8,width: "100%",flexDirection:'column'
                }}

                coverScreen={true}
            >
           
          <ScrollView showsVerticalScrollIndicator={false} >
            <View style={{flex:1,...shadower(6)}}>
            <HighLight showPhoto={(url) => this.props.showPhoto(url)} modal={true} showVideo={(url) => this.props.showVideo(url)} background={"#FEFFDE"} highlight={this.props.item} disableSwipper={true}></HighLight>
            {/*<View style={{alignItems:'center',justifyContent:'center',height:height/7}}>
               <Title style={{color:'#1FABAB',fontSize:23,fontWeight:"bold"}}>{this.props.item.title}</Title>
            </View>
            <View>
                <TouchableOpacity style={{ ...shadower(5) }} onPress={()=>{this.setState({enlargeImage:true})}}>
              {testForURL(this.props.item.url.photo)?<CacheImages thumbnails square source={{uri:this.props.item.url.photo}} style={{width:"92%",marginLeft:"4%",marginRight:"4%",marginBottom:"4%",borderRadius:5,height:height/3 + height/11}}>
                  </CacheImages> : <Thumbnail square large source={{ uri: this.props.item.url.photo }} style={{ width: "92%", marginLeft: "4%", marginRight: "4%", marginBottom: "4%", borderRadius: 5, height: height / 3 + height / 11 }}></Thumbnail>}
              </TouchableOpacity>
            </View>
            <View style={{margin:"5%",fontStyle:'italic'}}>
             <Text>{this.props.item.description}</Text>
              </View>*/}
            </View>
            </ScrollView>
            {this.state.enlargeImage && this.props.item.url && this.props.item.url.photo?<PhotoEnlargeModal isOpen={this.state.enlargeImage} 
            onClosed={() => this.setState({ enlargeImage: false })}
             photo={this.props.item.url.photo} />:null}
              
            </Modal>



        )
    }
}