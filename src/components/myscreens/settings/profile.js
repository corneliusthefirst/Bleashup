/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import { Button,View,Dimensions,TouchableWithoutFeedback,Image} from "react-native";

import stores from "../../../stores";
import { functionDeclaration } from "@babel/types";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import testForURL from '../../../services/testForURL';
import GState from '../../../stores/globalState/index';
import PhotoViewer from '../event/PhotoViewer';
import CacheImages from '../../CacheImages';
import EditUserModal from "./editUserModal";
import shadower from "../../../components/shadower";
import ColorList from '../../colorList';
import Pickers from '../../../services/Picker';
import FileExchange from '../../../services/FileExchange';
import rounder from "../../../services/rounder";
import BeNavigator from "../../../services/navigationServices";
import BleashupCamera from '../../mainComponents/BleashupCamera/index';
import SwiperView from '../../mainComponents/swipeViews';
import Toaster from "../../../services/Toaster";
import AntDesign  from 'react-native-vector-icons/AntDesign';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import FontAwesome  from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, Text } from 'react-native';
import Spinner from '../../Spinner';

let { height, width } = Dimensions.get('window');
export default class ProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMount:false, 
      userInfo:null,
      enlarge:false,
      update:false,
      updatetitle:"",
      position:"",
      coverscreen:true,
      uploading:false,
      photo:"",
      openBCamera:false,
    }
    if(this.props.navigation.getParam("update")==true){
         this.init
    }
  }
  init = ()=>{
    setTimeout(() => {
      this.setState({isMount:true,userInfo:this.props.navigation.getParam("userInfo")})
      this.setState({photo:this.state.userInfo.profile})
  }, 50);
  }
  componentDidMount(){
    this.init();
  }

  updateName = () => {
    this.setState({updatetitle:"Write your name"})
    this.setState({position:"bottom"});
    this.setState({coverscreen:true});
    this.setState({update:true});

  }

  editActu = () => {
    console.warn("here");
    this.props.navigation.navigate("Actu",{userInfo:this.state.userInfo});
  }

    //for photo
    TakePhotoFromCamera = () => {
      this.setState({openBCamera:true});
      /*Pickers.SnapPhoto(true).then(res => {
        this.setState({uploading:true})
        let exchanger = new FileExchange(res.source,'/Photo/',res.size,0,null,(newDir,path,total)=>{
          this.state.userInfo.profile = path;
          this.setState({photo:path});
          this.setState({userInfo: this.state.userInfo});
          stores.LoginStore.updateProfile(path).then(()=>{
            this.setState({uploading: false})
          })
        },() => {
        Toaster({text:'Unable To upload photo',position:'top'})
        this.setState({uploading:false});
        },(error) => {
            Toaster({ text: 'Unable To upload photo', position: 'top' })
            this.setState({uploading: false})
        },res.content_type,res.filename,'/photo')
        this.state.photo?exchanger.deleteFile(this.state.photo):null
        exchanger.upload(0,res.size)
      });*/
  }

  photoTaken = (result) => {
    this.state.userInfo.profile = result.source;
    this.state.userInfo.status = result.message;
    this.setState({photo:result.source});
    this.setState({userInfo: this.state.userInfo});
    stores.LoginStore.updateProfile(result.source).then(() => {
      /*stores.LoginStore.updateStatus(result.message).then(() => {
        this.setState({uploading: false});
        console.warn("user is", this.state.userInfo);
      });*/
    });
  }

  uploadError = (e) => {
    this.setState({uploading: false});
  }

  renderPhoto = () => {
    return (
      this.state.uploading ? <Spinner/>:
        <View style={{height:300,width:"100%",justifyContent:"center",alignItems:"center"}}>
        <TouchableWithoutFeedback onPress={() => {
            requestAnimationFrame(() => {this.setState({enlarge:true})});
        }}>
          {this.state.userInfo.profile  && testForURL(this.state.userInfo.profile ) ? <CacheImages   {...this.props}
              source={{ uri: this.state.userInfo.profile }} style={{height:ColorList.containerHeight/3,width:ColorList.containerHeight/3,borderRadius:ColorList.containerHeight/6}} /> :
           <Image source={require("../../../../Images/avatar.svg")} style={{height:ColorList.containerHeight/3,width:ColorList.containerHeight/3,borderRadius:ColorList.containerHeight/6}} ></Image>}
        </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.TakePhotoFromCamera}>
          <View style={{...rounder(52,ColorList.indicatorColor),alignItems:"center",borderWidth:2,borderColor:ColorList.bodyBackground,position:'absolute',right:width/6,bottom:40}}>
            <MaterialIcons name="add-a-photo" active={true} type="MaterialIcons" style={{...GState.defaultIconSize, color:ColorList.bodyBackground }}  />
          </View>
        </TouchableWithoutFeedback>
    </View>

    );
  }

  renderProfileInfo = () => {
    return (
      <View style={{height:300,width:"85%",justifyContent:"center",alignItems:"center",flexDirection:'column'}}>

       <View style={{width:"100%",justifyContent:"center",height:height/8,flexDirection:"row",marginTop:15}}>
          <View style={{width:"80%",flexDirection:"row"}}>
            <AntDesign name="user" active={true} type="AntDesign" style={{ ...GState.defaultTextStyle, color: ColorList.headerIcon, }}/>
            <View style={{flex:1,marginLeft:"5%",flexDirection:"column"}}>
               <Text style={{...GState.defaultTextStyle,alignSelf:"flex-start"}} note>Name</Text>
               <Text style={{...GState.defaultTextStyle,alignSelf:"flex-start"}}>{this.state.userInfo.nickname}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={this.updateName} style={{width:"10%"}}>
             <MaterialIcons name="edit" type="MaterialIcons" style={{...GState.defaultIconSize, color:ColorList.bodySubtext }}  />
          </TouchableOpacity>

        </View>

        <View style={{width:"100%",justifyContent:"center",height:height/8,flexDirection:"row",marginTop:15}}>

          <View style={{width:"80%",flexDirection:"row"}}>

            <AntDesign name="infocirlceo" active={true} type="AntDesign" style={{...GState.defaultIconSize, color:ColorList.headerIcon, }}/>

            <View style={{flex:1,marginLeft:"5%",flexDirection:"column"}}>
            <Text style={{...GState.defaultTextStyle,alignSelf:"flex-start"}} note>Actu</Text>
            <Text style={{...GState.defaultTextStyle,alignSelf:"flex-start"}} numberOfLines={1}  >{this.state.userInfo.status}</Text>
            </View>

          </View>

          <TouchableOpacity onPress={this.editActu} style={{width:"10%"}}>
          <MaterialIcons name="edit"  type="MaterialIcons" style={{...GState.defaultIconSize, color:ColorList.bodySubtext }}/>
          </TouchableOpacity>

        </View>


        <View style={{width:"100%",justifyContent:"center",flexDirection:"row",marginTop:height/30}}>

          <View style={{width:"90%",flexDirection:"row"}}>
            <FontAwesome name="phone" active={true} type="FontAwesome" style={{...GState.defaultIconSize, color:ColorList.headerIcon }}/>
            <View style={{flex:1,marginLeft:"5%",flexDirection:"column"}}>
               <Text style={{...GState.defaultTextStyle,alignSelf:"flex-start"}} note>Telephone</Text>
               <Text style={{...GState.defaultTextStyle,alignSelf:"flex-start",marginLeft:2}}>{this.state.userInfo.phone}</Text>
            </View>
          </View>

        </View>


      </View>
    );
  }







  render() {
    return (
      <Container style={{ backgroundColor: ColorList.bodyBackground,flexDirection:"column",width:"100%",height:"100%" }}>

        <View style={{ height:ColorList.headerHeight}}>
           <View style={{
                ...bleashupHeaderStyle,
                height:ColorList.headerHeight
              }}>
                 <View style={{flex:1,flexDirection:"row",width:width/3,marginLeft:width/25,justifyContent:"space-between",alignItems:"center"}}>
                 <Icon name="arrow-back" active={true} type="MaterialIcons" style={{ color: ColorList.headerIcon }} onPress={() => this.props.navigation.goBack()} />
                 <Text style={{fontSize:18,fontWeight:"bold",marginRight:"16%"}}>Profile</Text>
                 </View>
          </View>
        </View>

     { this.state.isMount ?
      <View style={{flexDirection:"column",height:height - height/10,width:"100%"}}>

        <SwiperView swipeArray = {[this.renderPhoto(),this.renderProfileInfo()]} backgroundColor="white" height={300} />

       <View style={{flexDirection:1,flexDirection:'column',alignItems:'center'}}>

           <View style={{width:'80%',flexDirection:'row',marginTop:50}}>
            <Icon name="sound-mute" active={true} type="Entypo" style={{ color: ColorList.headerIcon, }} onPress={() => this.props.navigation.navigate("Settings")} />
            <TouchableWithoutFeedback  style={{flex:1}} onPress={()=> BeNavigator.navigateTo("MuteView")}>
              <Text style={{fontSize:17,fontWeight:"400",marginLeft:"5%"}}>Mute Settings</Text>
            </TouchableWithoutFeedback>

           </View>

            <View style={{width:'80%',flexDirection:'row',marginTop:25}}>
              <Icon name="block" active={true} type="MaterialIcons" style={{ color: 'red', }} onPress={() => this.props.navigation.navigate("Settings")} />
              <TouchableWithoutFeedback style={{flex:1}}  onPress={()=> BeNavigator.navigateTo("BlockView")}>
               <Text style={{fontSize:17,fontWeight:"400",marginLeft:"5%"}}>Block Settings</Text>
              </TouchableWithoutFeedback>
            </View>

       </View>




        <EditUserModal isOpen={this.state.update} onClosed={()=>{this.setState({update:false});}} type="nickname" userInfo={this.state.userInfo} title={this.state.updatetitle} position={this.state.position} coverscreen={this.state.coverscreen} maxLength={20} />

        </View>
      : null}

        {this.state.openBCamera &&  <BleashupCamera  isOpen={this.state.openBCamera} onClosed={()=>{this.setState({openBCamera:false});}} onCaptureFinish={(result)=>{this.photoTaken(result)}} 
        nomessage={false} novideo={true} messagePlaceHolder = {"say something for your status"} maxLength={30} multiline={false}
         directreturn={false} onCameraReady={()=>{console.log('camera is  ready');}}  onMountError = {(e)=>this.uploadError(e)} />}
        {this.state.enlarge ? <PhotoViewer open={this.state.enlarge} hidePhoto={() => this.setState({ enlarge: false })} photo={this.state.userInfo.profile} /> : null}
      </Container>
    );
  }
}
