import React, { Component } from "react";
import autobind from "autobind-decorator";
import {
  Content, Text,  Container, Right,Icon,Thumbnail,Card,CardItem,Left,Title,Toast,Spinner
} from "native-base";
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
    }
    if(this.props.navigation.getParam("update")==true){
         this.init
    }
  }
  init = ()=>{
    setTimeout(() => {
      this.setState({isMount:true,userInfo:this.props.navigation.getParam("userInfo")})
      this.setState({photo:this.state.userInfo.profile})
  }, 50)
   
  }
  componentDidMount(){
    this.init();
  }

  updateName = () => {
    this.setState({updatetitle:"Write your name"})
    this.setState({position:"bottom"})
    this.setState({coverscreen:true});
    this.setState({update:true})

  }
  editActu = ()=>{
    this.props.navigation.navigate("Actu",{userInfo:this.state.userInfo});
  }

    //for photo
    TakePhotoFromCamera = ()=>{    
      Pickers.SnapPhoto(true).then(res => {
        this.setState({uploading:true})
        let exchanger = new FileExchange(res.source,'/Photo/',res.size,0,null,(newDir,path,total)=>{
          this.state.userInfo.profile = path;
          this.setState({photo:path});
          this.setState({userInfo: this.state.userInfo});
          stores.LoginStore.updateProfile(path).then(()=>{
            this.setState({uploading: false})
          })
        },() => {
        Toast.show({text:'Unable To upload photo',position:'top'})
        this.setState({uploading:false})
        },(error) => {
            Toast.show({ text: 'Unable To upload photo', position: 'top' })
            this.setState({uploading: false})
        },res.content_type,res.filename,'/photo')
        this.state.photo?exchanger.deleteFile(this.state.photo):null
        exchanger.upload(0,res.size)
      });
  }


  
  render() {
    return (
      <Container style={{ backgroundColor: ColorList.bodyBackground,flexDirection:"column",width:"100%",height:"100%" }}>

        <View style={{ height:ColorList.headerHeight, }}>
           <View style={{
                ...bleashupHeaderStyle,
                height:ColorList.headerHeight
              }}>
                 <View style={{flex:1,flexDirection:"row",width:width/3,marginLeft:width/25,justifyContent:"space-between",alignItems:"center"}}>
                 <Icon name="arrow-back" active={true} type="MaterialIcons" style={{ color: ColorList.headerIcon, }} onPress={() => this.props.navigation.navigate("Settings")} />
                 <Text style={{fontSize:18,fontWeight:"bold",marginRight:"16%"}}>Profile</Text>
                 </View>
          </View>
        </View>
        
    { this.state.isMount? 
    <View style={{flexDirection:"column",height:height - height/10,width:"100%"}}>
    
       <View style={{width:"100%",justifyContent:"center",height:height/8,flexDirection:"row",marginTop:height/30}}>
          <View style={{width:"80%",flexDirection:"row"}}>
            <View style={{width:"10%"}}>
            <Icon name="user" active={true} type="AntDesign" style={{ color: ColorList.headerIcon, }}/>
            </View>
            <View style={{width:"65%",marginLeft:"5%",flexDirection:"column"}}>
               <Text style={{alignSelf:"flex-start"}} note>Name</Text>
               <Title style={{alignSelf:"flex-start"}}>{this.state.userInfo.nickname}</Title>
            </View>
          </View>
         
          <View style={{width:"10%"}}>
             <Icon name="edit" active={true} type="MaterialIcons" style={{ color:ColorList.bodySubtext }} onPress={this.updateName} />
          </View>
         

        </View>

      

      {this.state.uploading ? <Spinner/>:
             <View style={{height:ColorList.containerHeight/3,width:"100%",justifyContent:"center",alignItems:"center"}}>
          
             <TouchableWithoutFeedback onPress={() => {
                 requestAnimationFrame(() => {this.setState({enlarge:true})});
             }}>
               {this.state.userInfo.profile  && testForURL(this.state.userInfo.profile ) ? <CacheImages   {...this.props}
                   source={{ uri: this.state.userInfo.profile }} style={{height:ColorList.containerHeight/3,width:width-width/9,borderRadius:14}} /> :
                <Image source={require("../../../../Images/avatar.svg")} style={{height:ColorList.containerHeight/3,width:width-width/9,borderRadius:14}} ></Image>}
             </TouchableWithoutFeedback>
 
             <TouchableWithoutFeedback  onPress={this.TakePhotoFromCamera} >
               <View style={{...shadower(),height:52,width:52,borderRadius:26,backgroundColor:"#1FABAB",alignItems:"center",justifyContent:"center",alignSelf:"flex-end",marginTop:-height/20,marginRight:width/25,borderWidth:2,borderColor:ColorList.bodyBackground}}>
                 <Icon name="add-a-photo" active={true} type="MaterialIcons" style={{ color:ColorList.bodyBackground }}  onPress={this.TakePhotoFromCamera} />
               </View>
             </TouchableWithoutFeedback>
         </View>
      }

            
     

        <View style={{width:"100%",justifyContent:"center",flexDirection:"row",marginTop:height/30}}>
          <View style={{width:"90%",flexDirection:"column"}}>
            <View style={{flexDirection:"row",justifyContent:"flex-start"}}>
            <Icon name="infocirlceo" active={true} type="AntDesign" style={{ color:ColorList.headerIcon, }}/>
            <Text style={{alignSelf:"flex-start",marginLeft:"3%"}} note>Actu</Text>
            </View>

            <View style={{width:"92%",marginLeft:"12%",flexDirection:"row"}}>
              <View style={{width:"75%"}}>
              <Title style={{alignSelf:"flex-start"}} numberOfLines={1}  >{this.state.userInfo.status}</Title>
            </View>

               <View style={{width:"20%",marginLeft:"7%"}}>
               <Icon name="edit" active={true} type="MaterialIcons" style={{ color:ColorList.bodySubtext }} onPress={this.editActu}/>
               </View>
            </View>

          </View>


        </View>


        <View style={{width:"100%",justifyContent:"center",flexDirection:"row",marginTop:height/30}}>
          <View style={{width:"90%",flexDirection:"row"}}>
            <View style={{width:"10%"}}>
            <Icon name="phone" active={true} type="FontAwesome" style={{ color:ColorList.headerIcon }}/>
            </View>
            <View style={{width:"65%",marginLeft:"2%",flexDirection:"column"}}>
               <Text style={{alignSelf:"flex-start"}} note>Telephone</Text>
               <Title style={{alignSelf:"flex-start",marginLeft:2}}>{this.state.userInfo.phone}</Title>
            </View>
          </View>

        </View>

  
        <EditUserModal isOpen={this.state.update} onClosed={()=>{this.setState({update:false})}} type="nickname" userInfo={this.state.userInfo} title={this.state.updatetitle} position={this.state.position} coverscreen={this.state.coverscreen} maxLength={20} />


        </View>
        :null}
        
     
        {this.state.enlarge ? <PhotoViewer open={this.state.enlarge} hidePhoto={() => this.setState({ enlarge: false })} photo={this.state.userInfo.profile} /> : null}
      </Container>
    )
  }
}
