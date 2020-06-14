import React, { Component } from "react";
import { View, Animated, TouchableWithoutFeedback, Dimensions, PanResponder, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text,Title,Thumbnail } from 'native-base';
import BleashupFlatList from '../../BleashupFlatList';
import testForURL from '../../../services/testForURL';
import stores from "../../../stores/index"
import GlobalFunctions from "../../globalFunctions"
import {uniq,concat,find} from "lodash";
import CacheImages from "../../CacheImages";
import colorList from '../../colorList';
import ProfileSimple from '../currentevents/components/ProfileViewSimple';
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";

let globalFunctions = GlobalFunctions;
let { height, width } = Dimensions.get('window');
export default class SearchUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
          data:[],
          loading:false,
          value:"",
          user:null
        }
    }

componentDidMount(){
   this.setState({data:this.props.navigation.getParam('userdata',{})});
}


t
searchFilterFunction = (text)=>{
  this.setState({loading: true,});
    globalFunctions.bleashupSearchUser(this.props.navigation.getParam('userdata',{}),text).then((data)=>{
      this.setState({data:data,value:text});
      this.setState({loading:false});
    })
}





   render(){
       return(
        
    <Container style={{height:"100%",width:colorList.containerWidth,backgroundColor:colorList.bodyBackground,alignItems:"center"}}>
       
      
       <View style={{height:70,width:"100%",alignItems:"center",justifyContent:"center"}}>
        <View style={{height:colorList.headerHeight-10,flexDirection:"row",backgroundColor:colorList.bodyBackground,width:"95%",borderColor:"gray",borderWidth:1,
        justifyContent:"center",alignItems:"center",borderRadius:15,}}>
          
              <Icon onPress={() => {this.props.navigation.goBack()}}
               style={{ color:colorList.bodyIcon,marginLeft:"2%",marginRight:"2%"}} type={"MaterialIcons"}name={"arrow-back"}></Icon>
                
              <Icon type="EvilIcons" name="search" />
               <Input style={{fontSize:15}} placeholder=" @search for user"  onChangeText={text => this.searchFilterFunction(text)}  value={this.state.value} />
              <Icon name="user" type="AntDesign" style={{marginRight:"2%"}} />
        </View>
       </View>
     
      <View style={{flex:1,marginTop:"5%",marginLeft:"4%"}}>
        {this.state.data.length == 0 ? null :
         (this.state.loading == true ?
            <Container style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:colorList.bodyBackground }}>
               <ActivityIndicator />
            </Container> : (
               <BleashupFlatList
                    initialRender={15}
                    renderPerBatch={5}
                    style={{backgroundColor:colorList.bodyBackground}}
                    firstIndex={0}
                    //extraData={this.state}
                    keyExtractor={(item,index)=>item.id}
                    dataSource={this.state.data}
                    noSpinner = {true}
                    renderItem={(item,index) =>{

                     return(
                         <ProfileSimple profile={item} invite ></ProfileSimple>
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