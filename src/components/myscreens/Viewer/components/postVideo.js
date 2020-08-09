/* eslint-disable react/no-unused-prop-types */
import React, {Component } from 'react';
import { Dimensions, Image, StyleSheet, View,Keyboard,ScrollView, TouchableOpacity,Text,StatusBar } from 'react-native';
import UserView from './UserView';
import VideoView from './videoView';
import ColorList from '../../../colorList';
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import GState from '../../../../stores/globalState';

const ScreenWidth  = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

class PostVideo extends Component {
  constructor(props) {
    super(props)
    this.state={}
}
   

componentWillMount(){ }



 render(){
  return (
   
    <View style={{
      height:"100%",
      width:"100%",
      flexDirection:"column",
      backgroundColor: ColorList.bodyBackgrounddark,
      justifyContent: 'space-between',
    }}>
     
       <StatusBar animated={true} barStyle="light-content" backgroundColor="#5F5F5F"></StatusBar>
    
  
      <View style={{width:"100%",flexDirection:"row",marginTop:5}}>

        <View style={{flex:1}}>
        <UserView name={this.props.about_activity.title} profile={this.props.about_activity.activity_profile} activityMode viewerMode/>
        </View>

         <View style={{width:110,flexDirection:"row",alignItems:"center"}}>
            <TouchableOpacity style={{marginLeft:3}}>
                <Text style={{color:ColorList.bodyTextBlue,fontSize:15}}>Subscribe</Text>
            </TouchableOpacity>
            <MaterialIcons name="notifications-none" type="MaterialIcons" style={{ ...GState.defaultIconSize,color:ColorList.bodyTextBlue}}/>   
         </View>

      </View>
    

      <View style={{width:"100%"}}>
         <View style={{width:"94%",alignSelf:"flex-end"}}>
           <UserView name={this.props.post.creator.name} profile={this.props.post.creator.profile} updated_at={this.props.post.creator.updated_at} onClosePress={this.props.onClose} viewerMode/>
         </View>
     </View> 

        <VideoView
          open={this.state.showVideo}
          onLoad={item => {this.props.onVideoLoaded(item)}}
          video={this.props.post.url}
          nextVideo ={e => this.props.changePost(e.nativeEvent)}
        ></VideoView>

     <ScrollView style={{flex:1,backgroundColor:ColorList.bodyBackgroundDarkGray}}>
      <View style={[styles.baseView]} >
      </View>
    </ScrollView>

    </View>

  );
 };
}


const styles = StyleSheet.create({
  videoStyle: {
    //height:240,
    //width:"100%",
    flex:1
  },
  baseView:{
    height:"100%",
    width:"100%",
  },

});

export default PostVideo;



/**
     <View style={{height:"33.7%",width:"100%"}}>
     <View style={styles.videoStyle}></View>

      
      </View>
       
     </View> 


     
       <View style={styles.baseview} >
       
       </View> */