import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Icon,Title,Item,Text
} from "native-base";
import { Button,View,Dimensions,TouchableWithoutFeedback,Image,FlatList,ScrollView} from "react-native";


import stores from "../../../stores";
import { functionDeclaration } from "@babel/types";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import EditUserModal from "./editUserModal";
import shadower from "../../../components/shadower";
//import BleashupFlatList from '../../BleashupFlatList';
import { filter,map,find} from "lodash";
import ColorList from '../../colorList';


let { height, width } = Dimensions.get('window');
export default class ActuView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMount:false, 
      userInfo:null,
      update:false,
      updatetitle:"",
      position:"",
      coverscreen:true,
      data:null

    }
   
  }

 init = ()=>{
  stores.LoginStore.getStatusOptions().then((data)=>{
      this.setState({data:data});          
  })
  setTimeout(() => {
    this.setState({userInfo:this.props.navigation.getParam("userInfo"),isMount:true});
    console.warn(this.state.userInfo)
   }, 50)
 }

  componentDidMount(){
    this.init();
  }

updateActu = () => {
    
    this.setState({updatetitle:"Write your actu"})
    this.setState({position:"bottom"})
    this.setState({coverscreen:true});
    this.setState({update:true})
    this.refs.toedit.init();
}

updateOptions = (item)=>{
  //console.warn(item.name,item.state,this.state.data);
  map(this.state.data,(o)=>{o.state =false});
  this.state.data[parseInt(item.id, 10)].name = item.name;
  this.state.data[parseInt(item.id, 10)].state = true;
  this.setState({data:this.state.data});
  //console.warn(item.name,item.state,this.state.data);
  stores.LoginStore.updateStatus(item.name).then(()=>{
    stores.LoginStore.updateStatusOptions(this.state.data).then(()=>{
        this.state.userInfo.status = item.name;
        this.setState({userInfo:this.state.userInfo});
        
    })} )
}

edit = ()=>{
  this.props.navigation.navigate("Profile",{"update":true})
}
  render(){
      return(
        
            <View style={{width:"100%",height:"100%"}}>

              <View style={{ height:ColorList.headerHeight, }}>
                <View style={{
                  ...bleashupHeaderStyle,
                  height:ColorList.headerHeight
                 }}>
                 <View style={{height:"100%",flexDirection:"row",width:width/3,marginLeft:width/25,justifyContent:"space-between",alignItems:"center"}}>
                 <Icon name="arrow-back" active={true} type="MaterialIcons" style={{ color:ColorList.headerIcon, }} onPress={this.edit} />
                 <Text style={{fontSize:18,fontWeight:"bold",marginRight:"30%"}}>Actu</Text>
                 </View>
               </View>
             </View>

             { this.state.isMount? 
             <View style={{flexDirection:"column",height:height - height/10,width:"100%",backgroundColor:ColorList.bodyBackground}}>
                     
    
              <View style={{width:"100%",justifyContent:"center",flexDirection:"row",flex:2,marginTop:height/30}}>
                <View style={{width:"90%",flexDirection:"column"}}>
                <View style={{flexDirection:"row",justifyContent:"flex-start"}}>
                <Icon name="infocirlceo" active={true} type="AntDesign" style={{ color:ColorList.bodyIcon, }}/>
                <Text style={{alignSelf:"flex-start",marginLeft:"3%"}} note>Actu</Text>
              </View>

               <View style={{width:"92%",marginLeft:"12%",flexDirection:"row"}}>
                <ScrollView style={{width:"80%",height:height/8}} showsVerticalScrollIndicator={false}>
                 <Text style={{alignSelf:"flex-start",color:this.state.userInfo.status?"black":"gray"}}   >{this.state.userInfo.status?this.state.userInfo.status:"@No status update here"}</Text>
                </ScrollView>

                 <View style={{width:"10%",marginLeft:"5%"}}>
                 <Icon name="edit" active={true} type="MaterialIcons" style={{ color: "gray" }} onPress={this.updateActu}/>
                 </View>
            </View>
            </View>
          </View>





              <View style={{flex:1}}>
                <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"flex-start"}}>
                   <Title style={{fontSize: 18,fontWeight:"bold",marginLeft:"5%"}}>Choose a status</Title>
                </View>
              </View>
             <View style={{flex:9}}>
              <View style={{flex:1,alignItems:"center"}}>
               <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={item=>item.id}
                    renderItem={({ item, index }) => 
                      <View style={{flexDirection:"row",height:height/13,width:width,justifyContent:"center"}}>
                          <View style={{width:3*width/4,justifyContent:"center"}}>
                            <Title style={{fontSize: 18,marginLeft:"6%",alignSelf:"flex-start"}} onPress={()=>{this.updateOptions(item)}} >{item.name}</Title>
                          </View>
                          <View  style={{width:width/4,justifyContent:"center"}}>
                          {item.state==true?<Icon  style={{fontSize: 18,alignSelf:"flex-end",marginRight:"15%"}} name="md-checkmark" type="Ionicons"></Icon>:null}
                          </View>
                      </View>
                      
                    }

                >
                </FlatList>
              </View>
            </View>







              <EditUserModal  ref={"toedit"}  parent={this}  data={this.state.data} isOpen={this.state.update} onClosed={()=>{this.setState({update:false})}} type={this.state.updatetype} userInfo={this.state.userInfo} title={this.state.updatetitle} position={this.state.position} coverscreen={this.state.coverscreen} maxLength={150} type="actu" />

             </View>
              :null}

        

            </View>
            

          
      )
  }

}