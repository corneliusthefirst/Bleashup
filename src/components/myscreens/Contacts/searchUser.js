import React, { Component } from "react";
import { 
   View, 
   Dimensions, 
   ActivityIndicator, 
   Text, 
   TextInput as Input 
} from 'react-native';
import BleashupFlatList from '../../BleashupFlatList';
import testForURL from '../../../services/testForURL';
import stores from "../../../stores/index"
import GlobalFunctions from "../../globalFunctions"
import CacheImages from "../../CacheImages";
import colorList from '../../colorList';
import ProfileSimple from '../currentevents/components/ProfileViewSimple';
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import  EvilIcons  from 'react-native-vector-icons/EvilIcons';
import AntDesign  from 'react-native-vector-icons/AntDesign';

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
        
    <View style={{height:"100%",width:colorList.containerWidth,backgroundColor:colorList.bodyBackground,alignItems:"center"}}>
       
      
       <View style={{height:70,width:"100%",alignItems:"center",justifyContent:"center"}}>
        <View style={{height:colorList.headerHeight-10,flexDirection:"row",backgroundColor:colorList.bodyBackground,width:"95%",borderColor:"gray",borderWidth:1,
        justifyContent:"center",alignItems:"center",borderRadius:15,}}>
          
              <MaterialIcons onPress={() => {this.props.navigation.goBack()}}
               style={{ color:colorList.bodyIcon,marginLeft:"2%",marginRight:"2%"}} type={"MaterialIcons"}name={"arrow-back"}/>
                
              <EvilIcons name="search" />
               <Input style={{fontSize:15}} placeholder=" @search for user"  onChangeText={text => this.searchFilterFunction(text)}  value={this.state.value} />
              <AntDesign name="user" style={{marginRight:"2%"}} />
        </View>
       </View>
     
      <View style={{flex:1,marginTop:"5%",marginLeft:"4%"}}>
        {this.state.data.length == 0 ? null :
         (this.state.loading == true ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:colorList.bodyBackground }}>
               <ActivityIndicator />
            </View> : (
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
       
      </View>
       )
   }

}