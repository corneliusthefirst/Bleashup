import React, { Component } from "react";
import { View, Dimensions, TouchableWithoutFeedback, Text, } from "react-native";
import CacheImages from '../../CacheImages';
import styles from "./styles";
import stores from "../../../stores";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import testForURL from '../../../services/testForURL';
import GState from '../../../stores/globalState/index';
import ColorList from '../../colorList';
import rounder from "../../../services/rounder";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

let { height, width } = Dimensions.get('window');

export default class SettingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMount:false,
      userInfo:null
    }
  }

  componentDidMount(){
    setTimeout(() => {
      stores.LoginStore.getUser().then(user => {
        if(!user.status) {
          user.status = "";
        }
        this.setState({userInfo:user,isMount:true}) });
      }, 20)

  }


  openProfile = (userInfo)=>{
     this.props.navigation.navigate("Profile",{userInfo:userInfo});
  }

  render() {
    return (
      <View style={{ backgroundColor:ColorList.bodyBackground,height:"100%",width:"100%"}}>
        <View style={{ height:ColorList.headerHeight, }}>
           <View style={{
                ...bleashupHeaderStyle,
                height:ColorList.headerHeight
              }}>
                 <View style={{flex:1,flexDirection:"row",width:width/3,marginLeft:width/25,justifyContent:"space-between",alignItems:"center"}}>
                 <MaterialIcons name="arrow-back" active={true} type="MaterialIcons" style={{...GState.defaultIconSize, color:ColorList.headerIcon, }} onPress={() => this.props.navigation.navigate("Home")} />
                 <Text style={{...GState.defaultTextStyle,fontSize:18,fontWeight:"bold",marginRight:"8%"}}>Settings</Text>
                 </View>
          </View>
        </View>
      { this.state.isMount? <View style={{flexDirection:"column",height:ColorList.containerHeight/7,width:width}}>
          <View style={{flex:1,flexDirection:"row",margin:"3%",width:"100%",alignItems:"center"}}>
              <View style={{width:"25%"}}>
                 <TouchableWithoutFeedback onPress={() => {
                        requestAnimationFrame(() => {
                            GState.showingProfile = true
                             this.openProfile(this.state.userInfo);
                            setTimeout(() => {
                                GState.showingProfile = false
                            }, 50)
                        });
                    }}>
                        {this.state.userInfo.profile  && testForURL(this.state.userInfo.profile ) ? <CacheImages  thumbnails {...this.props}
                            source={{ uri: this.state.userInfo.profile }} /> :
                            <Image resizeMode={"cover"} style={{
                              ...rounder(60,ColorList.bodyBackground),
                              justifyContent: 'center',
                            }} source={require("../../../../Images/images.jpeg")} ></Image>}
                    </TouchableWithoutFeedback>
                    </View>
                    <View style={{flexDirection:"column",width:"70%"}}>
                           <Text style={{...GState.defaultTextStyle,alignSelf:"flex-start"}}>{this.state.userInfo.nickname}</Text>
                           <Text style={{...GState.defaultTextStyle,color:"gray",alignSelf:"flex-start",fontSize:15}}>{this.state.userInfo.status}</Text>
                    </View>
          </View>
          
        </View>
       :null}
      </View>
    )
  }
}
