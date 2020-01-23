/* eslint-disable react/no-unused-prop-types */
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet,Text, View } from 'react-native';
import Video from 'react-native-video';
// import Image from 'react-native-scalable-image';
import PropTypes from 'prop-types';
import { find, reject, } from "lodash";

const ScreenWidth = Dimensions.get('window').width;

const Story = (props) => {
  const { story } = props;
  const { url,text,type,created_at } = story || {}; 
  
  //set posted date
  props.setPostDate(created_at);

  //black
  const TextColors = ["yellow","yellowgreen","teal","white","tan","sandybrown","palegreen","lightsteelblue","lightskyblue","greenyellow"]
  //["green","red","blue","aqua","black","brown","darkblue","darkgoldenrod","forestgreen"]
  

  const textLoaded = () => {
    if(type == 'text'){
      for(i of TextColors){
           if(text.background == i){
              props.setColor("black")
              props.textLoaded();
              return;
           }
      }
      props.setColor("white")
      props.textLoaded()
    }
  };
  textLoaded();

  const exactLength = (string) =>{
     let j = 0;
     for(i in string){
       if(string[i]!= " "){
         j++;
       }
     }
     return j;
  
  }

  return (
    <View style={styles.container}>
      {/* {!props.isLoaded && (
      <View style={styles.loading}>
        <ActivityIndicator color="white" />
      </View>
      )} */}
      {type === 'image' ? (
        <Image
          source={{ uri: url }}
          onLoadEnd={props.onImageLoaded}
          style={styles.content}
          resizeMode="stretch"
          // width={ScreenWidth}
        />
      ):
      (type === 'text'?
        <View  style={{flex:1,backgroundColor:text.background,justifyContent:"center"}}>
         <Text 
           //paused={props.pause || props.isNewStory}
           style={{fontSize:exactLength(text.string)>30?23:42,fontStyle:text.fontStyle,fontWeight:"bold",color:props.color,paddingLeft:"8%",paddingRight:"8%"}}
          >{text.string}</Text>
       </View>
        :(

        <Video
          source={{ uri: url }}
          paused={props.pause || props.isNewStory}
          onLoad={item => props.onVideoLoaded(item)}
          style={styles.content}
        />
      )
      )}
    </View>
  );
};

Story.propTypes = {
  story: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { width: '100%',
    height: '100%',
    flex: 1,
  },
  imageContent: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  loading: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default Story;
