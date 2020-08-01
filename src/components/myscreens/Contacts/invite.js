import React, { Component } from "react";
import stores from "../../../stores";
import Modal from 'react-native-modalbox';
import { 
  View, 
  Dimensions, 
  TouchableWithoutFeedback, 
  TouchableOpacity, 
  Image, 
  Text,
  Linking
} from "react-native";
import Message from "../eventChat/Message";
import colorList from '../../colorList';
import ColorList from "../../colorList";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

let { height, width } = Dimensions.get('window');

export default class Invite extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isMount:false,
        whatsapp:false,
        discord:false
      }
    }

   componentDidMount(){
    setTimeout(() => {
      //check if whatsapp is install
      Linking.canOpenURL(`whatsapp://send?text=text`).then((bool)=>{
         if(bool){
           this.setState({whatsapp:true});
         }
      })

      
      this.setState({isMount:true});
    }, 20)
   }
 
   openWhatsapp = ()=>{
    whatsappMsg = "Here is bleashup,my service for all my social activities.Come here:https://bleashup.com/dl/";
    Linking.openURL(`whatsapp://send?text=${whatsappMsg}`);
    //Linking.openURL(`https://discordapp.com/channels/send?text=${whatsappMsg}`);
    //this.props.onClosed();
   }

   openGmail = ()=>{
    mailsubject = "Bleashup : Android + iPhone";
    mailbody = "Bleashup is a fast application,easy and sure which i use to communicate with my relations,manage my activities(events,meetings,groups etc) with it amazing reminds,supports and contribution system.It also deeply facilate cruising through it discovery page,just come and see.Download freely here:https://www.bleashup.co/download/."
    Linking.openURL(`mailto:""?subject=${mailsubject}&body=${mailbody}`);
    //this.props.onClosed();
   }

  openMessage = ()=>{
    message = "Here is bleashup,my service for all my social activities.Come here:https://bleashup.com/dl/";
    Linking.openURL(`sms:?addresses=null&body=${message}`);
    //this.props.onClosed();
   }




    render(){
        return(
         
            <Modal
          
            isOpen={this.props.isOpen}
            onClosed={this.props.onClosed}
            style={{
                backgroundColor:ColorList.bodyBackground,alignItems:"center",
                height:height/5, borderTopLeftRadius: 8, borderTopRightRadius: 8, width:width
            }}

            position={'bottom'}
            swipeToClose={false}
            backdropPressToClose={false}
            //animationDuration={400}
            coverScreen={true}
           >
          {this.state.isMount?
            <View style={{flexDirection:"column"}}>
             <View  style={{flexDirection:"row",height:"70%",alignItems:"center",justifyContent:"space-between"}}>
              
             <TouchableOpacity onPress={()=>{this.openMessage()}}  >
               <View style={{flexDirection:"column",alignItems:"center"}} >
               <View style={{height:height/17,width:width/8,borderRadius:25,margin:"5%",backgroundColor:"dodgerblue",justifyContent:"center",alignItems:"center"}} >
               <MaterialIcons name="message" active={true} type="MaterialIcons" style={{color: "white",marginTop:4 }} onPress={()=>{this.openMessage()}}  />
               </View>
               <Text note>message</Text>
               </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>{this.openGmail()}}>
               <View style={{margin:"5%",flexDirection:"column",alignItems:"center"}} >
               <MaterialIconCommunity name="email" active={true} type="MaterialCommunityIcons" style={{ color: "indianred",fontSize:45}} onPress={()=>{this.openGmail()}} />
               <Text  note>email</Text>
               </View>
               </TouchableOpacity>

               {this.state.whatsapp?
               <TouchableOpacity   onPress={()=>{this.openWhatsapp()}}>
               <View style={{flexDirection:"column",alignItems:"center"}}>
               <View style={{height:height/17,width:width/8,borderRadius:25,margin:"5%",backgroundColor:"limegreen",justifyContent:"center",alignItems:"center"}}>
                <FontAwesome name="whatsapp" active={true} type="FontAwesome" style={{ color: "white", }}  onPress={()=>{this.openWhatsapp()}}/>
               </View>
               <Text  note>whatsapp</Text>
               </View>
               </TouchableOpacity>:null}

             </View>
              <View>
                 <TouchableOpacity style={{height:40,width:width-width/5,justifyContent:"center",alignItems:"center",borderWidth:1,borderColor:"gray",backgroundColor:ColorList.bodyBackground,borderRadius:25}} onPress={this.props.onClosed}>
                   <Text style={{fontSize:14,fontWeight:"400",color:"red"}}>CANCEL</Text>
                 </TouchableOpacity>
                   
              </View>

              </View>:null}

           </Modal> 

        )
    }

}