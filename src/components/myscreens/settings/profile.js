import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content, Text,  Container, Right,Icon,Thumbnail,Card,CardItem,Left,Title,
} from "native-base";
import { Button,View,Dimensions,TouchableWithoutFeedback,Image} from "react-native";


import stores from "../../../stores";
import { functionDeclaration } from "@babel/types";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import testForURL from '../../../services/testForURL';
import GState from '../../../stores/globalState/index';
import PhotoViewer from '../event/PhotoViewer';
import CacheImages from '../../CacheImages';
import EditUserModal from "./editUserModal"


let { height, width } = Dimensions.get('window');
export default class ProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMount:false, 
      userInfo:null,
      enlarge:false,
      updateName:false
    }
  }

  componentDidMount(){
    setTimeout(() => {
        this.setState({isMount:true,userInfo:this.props.navigation.getParam("userInfo")})
    }, 50)
     
  
  }
  updateName = () => {
     this.setState({updateName:true})
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#FEFFDE",flexDirection:"column",width:width }}>
        <View style={{ height: 40, }}>
           <View style={{
                ...bleashupHeaderStyle,
                
              }}>
                 <View style={{flexDirection:"row",width:width/3,marginLeft:width/25,justifyContent:"space-between",alignItems:"center"}}>
                 <Icon name="arrow-back" active={true} type="MaterialIcons" style={{ color: "#1FABAB", }} onPress={() => this.props.navigation.navigate("Settings")} />
                 <Text style={{fontSize:18,fontWeight:"bold",marginRight:"16%"}}>Profile</Text>
                 </View>
          </View>
        </View>
        
    { this.state.isMount? 
    <View style={{flexDirection:"column",height:height - height/10,width:"100%"}}>
    
       <View style={{width:"100%",justifyContent:"center",height:height/8,flexDirection:"row",marginTop:height/30}}>
          <View style={{width:"80%",flexDirection:"row"}}>
            <View style={{width:"10%"}}>
            <Icon name="user" active={true} type="AntDesign" style={{ color: "#1FABAB", }}/>
            </View>
            <View style={{width:"65%",marginLeft:"5%",flexDirection:"column"}}>
               <Text style={{alignSelf:"flex-start"}} note>Name</Text>
               <Title style={{alignSelf:"flex-start"}}>{this.state.userInfo.nickname}</Title>
            </View>
          </View>

          <View style={{width:"10%"}}>
             <Icon name="edit" active={true} type="MaterialIcons" style={{ color: "gray" }} onPress={this.updateName}/>
          </View>
        </View>

        <View>


            <View style={{width:"100%",justifyContent:"center",alignItems:"center"}}>
                  <TouchableWithoutFeedback onPress={() => {
                        requestAnimationFrame(() => {
                           this.setState({enlarge:true})
                        });
                    }}>
                        {this.state.userInfo.profile  && testForURL(this.state.userInfo.profile ) ? <CacheImages   {...this.props}
                            source={{ uri: this.state.userInfo.profile }} /> :
                            <Image source={require("../../../../Images/images.jpeg")} style={{flex:1,borderRadius:14}} ></Image>}
                    </TouchableWithoutFeedback>
                    <View style={{height:height/15,width:width/7,borderRadius:30,backgroundColor:"#1FABAB",alignItems:"center",justifyContent:"center",alignSelf:"flex-end",marginTop:-height/20,marginRight:width/25}}>
                    <Icon name="add-a-photo" active={true} type="MaterialIcons" style={{ color: "white" }}/>
                    </View>
            </View>
        </View>

        <View style={{width:"100%",justifyContent:"center",flexDirection:"row",marginTop:height/30}}>
          <View style={{width:"80%",flexDirection:"row"}}>
            <View style={{width:"10%"}}>
            <Icon name="infocirlceo" active={true} type="AntDesign" style={{ color: "#1FABAB", }}/>
            </View>
            <View style={{width:"65%",marginLeft:"5%",flexDirection:"column"}}>
               <Text style={{alignSelf:"flex-start"}} note>Actu</Text>
               <Title style={{alignSelf:"flex-start",width:width-width/3,marginLeft:"-8%"}} numberOfLines={2} >{this.state.userInfo.status}</Title>
            </View>
          </View>

          <View style={{width:"10%"}}>
             <Icon name="edit" active={true} type="MaterialIcons" style={{ color: "gray" }}/>
          </View>
        </View>


        <View style={{width:"100%",justifyContent:"center",flexDirection:"row",marginTop:height/30}}>
          <View style={{width:"90%",flexDirection:"row"}}>
            <View style={{width:"10%"}}>
            <Icon name="phone" active={true} type="FontAwesome" style={{ color: "#1FABAB", }}/>
            </View>
            <View style={{width:"65%",marginLeft:"2%",flexDirection:"column"}}>
               <Text style={{alignSelf:"flex-start"}} note>Telephone</Text>
               <Title style={{alignSelf:"flex-start",marginLeft:2}}>{this.state.userInfo.phone}</Title>
            </View>
          </View>

        </View>

  
        <EditUserModal isOpen={this.state.updateName} onClosed={()=>{this.setState({updateName:false})}} nickname={true} userInfo={this.state.userInfo} title={"Write your name"}/>


        </View>
        :null}
        
     
        {this.state.enlarge ? <PhotoViewer open={this.state.enlarge} hidePhoto={() => this.setState({ enlarge: false })} photo={this.state.userInfo.profile} /> : null}
      </Container>
    )
  }
}
