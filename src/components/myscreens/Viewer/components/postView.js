/* eslint-disable react/no-unused-prop-types */
import React, { useState, } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    View,
    WebView
  } from 'react-native';
import Video from 'react-native-video';
// import Image from 'react-native-scalable-image';
import PropTypes from 'prop-types';

import Post from './Post';
import UserView from './UserView';
import Readmore from './Readmore';
import ProgressArray from './ProgressArray';
import Modal from 'react-native-modalbox';
import PostVideo from './postVideo';

const ScreenWidth = Dimensions.get('window').width;



const PostView = (props) => {
  const { posts,post,isLoaded,isReadMore,isModalOpen,onClose,onImageLoaded,onReadMoreClose,duration,currentIndex,
          onVideoLoaded,onReadMoreOpen,onPause,changePost,isPause,isNewPost,loading,nextPost,prevPost,activityname,about_activity } = props;
 
  const {name,profile,updated_at } = post.creator || {};
  const length= posts.map((_, i) => i)
  
  //console.warn(isNewPost)

  return (
    post.type ==='image' ?
     <TouchableOpacity
     activeOpacity={1}
     delayLongPress={500}
     onPress={e => changePost(e.nativeEvent)}
     onLongPress={() => onPause(true)}
     onPressOut={() => onPause(false)}
     style={styles.container}
   >
     <View style={styles.container}>
     
     <Post onImageLoaded={onImageLoaded} pause={isPause} isNewPost={isNewPost}
        onVideoLoaded={onVideoLoaded} post={post} onClose={onClose} 
      />

       {loading()}

       <UserView name={name} profile={profile} updated_at={updated_at} onClosePress={onClose} activity_name={about_activity.title}/>

       {isReadMore && <Readmore onReadMore={onReadMoreOpen} />}

     {length.map((i, index) => (
       <ProgressArray
         next={nextPost}
         isLoaded={isLoaded}
         duration={duration}
         pause={isPause}
         isNewPost={isNewPost}
         posts={posts}
         currentIndex={index}      //@was currentIndex before
         currentPost={posts[currentIndex]}
         //length={posts.map((_, i) => i)}
         progress={{ id: currentIndex }}
         post_index = {index}
         post_index_index = {i}
       />
       ))}
     </View>

     <Modal style={styles.modal} position="bottom" isOpen={isModalOpen} onClosed={onReadMoreClose}>
       <View style={styles.bar} />
       <WebView source={{ uri: 'https://www.google.com' }} />
     </Modal>

   </TouchableOpacity> :
      
      <PostVideo onImageLoaded={onImageLoaded} pause={isPause} isNewPost={isNewPost} 
        onVideoLoaded={onVideoLoaded} post={post} onClose={onClose} about_activity={about_activity} changePost = {changePost}
      />
  
    )
}








const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
      // paddingTop: 30,
      backgroundColor: 'red',
    },

    modal: {
      width: '100%',
      height: '90%',
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    bar: {
      width: 50,
      height: 8,
      backgroundColor: 'gray',
      alignSelf: 'center',
      borderRadius: 4,
      marginTop: 8,
    },
  });


  export default PostView;










  /**       <ProgressArray
            next={nextPost}
            isLoaded={isLoaded}
            duration={duration}
            pause={isPause}
            isNewPost={isNewPost}
            posts={posts}
            currentIndex={currentIndex}
            currentPost={posts[currentIndex]}
            length={posts.map((_, i) => i)}
            progress={{ id: currentIndex }}
          />     */