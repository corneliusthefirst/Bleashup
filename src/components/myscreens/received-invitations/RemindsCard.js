import React, {Component} from 'react';
import {Platform, StyleSheet,Image,TextInput,FlatList,TouchableOpacity, ActivityIndicator, View,Alert,TouchableHighlight} from 'react-native';

import autobind from "autobind-decorator";
import {
  Content,Card,CardItem,Text,Body,Container,Icon,Header,Form,Thumbnail,Item,Title,Input,Left,Right,H3,H1,H2,Spinner,Button,InputGroup,DatePicker,CheckBox,List,Accordion,DeckSwiper
} from "native-base";


export default class RemindListItem extends Component {
    constructor(props) {
        super(props);
    }

    render(){
    	return(

           <Text>Here</Text>
    	);
    }


}
/*
   <Content>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: 'Image URL'}} />
                <Body>
                  <Text>NativeBase</Text>
                  <Text note>GeekyAnts</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={{uri: 'Image URL'}} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent>
                  <Icon active name="thumbs-up" />
                  <Text>12 Likes</Text>
                </Button>
              </Left>
              <Body>
                <Button transparent>
                  <Icon active name="chatbubbles" />
                  <Text>4 Comments</Text>
                </Button>
              </Body>
              <Right>
                <Text>11h ago</Text>
              </Right>
            </CardItem>
          </Card>
 </Content>  
*/