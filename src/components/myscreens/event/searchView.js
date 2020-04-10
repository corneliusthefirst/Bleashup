import React, { Component } from "react";
import { View, Animated, TouchableWithoutFeedback, Dimensions, PanResponder,ActivityIndicator } from 'react-native';
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { Container, Header, Item, Input, Icon, Button, Text,Title,Thumbnail } from 'native-base';
import BleashupFlatList from '../../BleashupFlatList';
import testForURL from '../../../services/testForURL';
import stores from "../../../stores/index"
import GlobalFunctions from "../../globalFunctions"
import {uniq,concat} from "lodash";
import CacheImages from "../../CacheImages";
import colorList from '../../colorList';

let globalFunctions = new GlobalFunctions();
let { height, width } = Dimensions.get('window');
export default class SearchView extends Component {
    constructor(props) {
        super(props)
        this.state = {
          data:[],
          loading:false,
          value:""
        }
    }

componentDidMount(){
   console.warn(stores.Events.searchdata)
   this.setState({data:stores.Events.searchdata});
}



searchFilterFunction = (text)=>{
  this.setState({loading: true,});
    globalFunctions.bleashupSearch(stores.Events.searchdata,text).then((data)=>{
      this.setState({data:data,value:text});
      this.setState({loading:false});
    })
}


   render(){
       return(
        
        <Container style={{height:"100%",width:colorList.containerWidth,backgroundColor:colorList.bodyBackground,alignItems:"center"}}>
       
       <View style={{height:65,width:"100%",alignItems:"center",backgroundColor:colorList.headerBackground}}>
        <View style={{flexDirection:"row",backgroundColor:colorList.bodyBackground,height:colorList.headerHeight,width:"95%",borderColor:"gray",borderWidth:1,justifyContent:"center",marginTop:"2%",alignItems:"center",borderRadius:15}}>
          
              <Icon onPress={() => {this.props.navigation.goBack()}}
               style={{ color:colorList.bodyIcon,marginLeft:"2%",marginRight:"2%"}} type={"MaterialIcons"}name={"arrow-back"}></Icon>
                
              <Icon type="EvilIcons" name="search" />
               <Input style={{fontSize:15}} placeholder="search @activity/relation"  onChangeText={text => this.searchFilterFunction(text)}  value={this.state.value} />
              <Icon name="ios-people" style={{marginRight:"2%"}} />
        </View>
       </View>

        <View style={{flex:1,marginTop:10}}>

        {this.state.data.length == 0 ? null :
         (this.state.loading == true ?
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:colorList.bodyBackground }}>
               <ActivityIndicator />
            </Container> : (
               <BleashupFlatList
                    initialRender={10}
                    renderPerBatch={5}
                    style={{backgroundColor:colorList.bodyBackground}}
                    firstIndex={0}
                    //extraData={this.state}
                    keyExtractor={(item,index)=>item.id}
                    dataSource={this.state.data}
                    noSpinner = {true}
                    renderItem={(item,index) =>{

                     return(
                  
                     <View style={{flexDirection:"row",width:"100%",marginBottom:"5%"}}>
                      
                      <View style={{width:colorList.containerWidth/5,alignItems:"center"}}>
                      <TouchableWithoutFeedback>
                             {item.background && testForURL(item.image) ? <CacheImages small thumbnails {...this.props}
                                 source={{ uri:item.image}} /> :
                                 <Thumbnail  small source={require("../../../../Images/images.jpeg")} ></Thumbnail>}
                         </TouchableWithoutFeedback>
                         </View>
     
                         <TouchableWithoutFeedback style={{width:(4*colorList.containerWidth)/5}} onPress={()=>{this.openDetail(item)}} >
                         <View style={{width:(4*colorList.containerWidth)/5,flexDirection:"row"}}>
                         <View style={{flexDirection:"column",width:"76%"}}>
                                <Title style={{alignSelf:"flex-start",marginLeft:2,fontSize:14}}>{item.name}</Title>
                         </View>
                          <View style={{flexDirection:"column",width:"24%"}}>
                                <Text style={{alignSelf:"flex-start",fontSize:14}}>{item.type=="relation"?"@relation":"@activity"}</Text>
                         </View>
                         </View>
                         </TouchableWithoutFeedback>
                        </View>

                      )
                    }
                    }

                >
                </BleashupFlatList>)
                )}
        </View> 
        
      </Container>
       )
   }

}