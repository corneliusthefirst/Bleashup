import React, { useRef, useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View,StatusBar } from 'react-native';
// import Modal from 'react-native-modalbox';
import { CubeNavigationHorizontal } from 'react-native-3dcube-navigation';
import AllPosts from './constants/AllPosts';
import PostContainer from './components/PostContainer';


const Viewer = (props) => {
  const [isModalOpen, setModel] = useState(true);
  const [currentActivityIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const modalScroll = useRef(null);

    //StatusBar.setBackgroundColor('lightgray', true)
    //StatusBar.setBarStyle('light-content', true)
 





  const onPostSelect = (index) => {
    setCurrentUserIndex(index);
    setModel(true);
  };

  const onPostClose = () => {
    setModel(false);
   // StatusBar.setBackgroundColor('lightgrey', true)
    //StatusBar.setBarStyle('dark-content', true)
  };

  const onPostNext = (isScroll) => {
    const newIndex = currentActivityIndex + 1;
    if (AllPosts.length - 1 > currentActivityIndex) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    } else {
      setModel(false);
    }
  };

  const onPostPrevious = (isScroll) => {
    const newIndex = currentActivityIndex - 1;
    if (currentActivityIndex > 0) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    }
  };

  const onScrollChange = (scrollValue) => {
    if (currentScrollValue > scrollValue) {
      onPostNext(true);
      console.log('next');
      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onPostPrevious();
      console.log('previous');
      setCurrentScrollValue(scrollValue);
    }
  };

  const renderSeperator = () => (
    <View style={{ height: 1, backgroundColor: '#ccc' }} />
  );

  
  return (
   
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalOpen}
        style={styles.modal}
        onShow={() => {
          if (currentActivityIndex > 0) {
            modalScroll.current.scrollTo(currentActivityIndex, false);
          }
        }}
        onRequestClose={onPostClose}
      >
        {/* eslint-disable-next-line max-len */}
        <CubeNavigationHorizontal callBackAfterSwipe={g => onScrollChange(g)} ref={modalScroll} style={styles.container}>
          {AllPosts.map((item, index) => (
            <PostContainer
              onClose={onPostClose}
              onPostNext={onPostNext}
              onPostPrevious={onPostPrevious}
              activity={item}
              isNewPost={index !== currentActivityIndex}
            />
          ))}
        </CubeNavigationHorizontal>
      </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height:"100%",
    width:"100%",
    justifyContent: 'flex-start',
    //paddingVertical: 50,
    //backgroundColor: 'rgba(255,255,255,255)',
  },
  circle: {
    width: 66,
    margin: 4,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#72bec5',
  },
  modal: {
    flex:1,
  },
  title: {
    fontSize: 9, 
    textAlign: 'center',
  },
});


export default Viewer;



















/**
 *       <FlatList
        data={AllPosts}
        horizontal
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => onPostSelect(index)}>
            <Image
              style={styles.circle}
              source={{ uri: item.profile }}
              isHorizontal
            />
            <Text style={styles.title}>{item.title}</Text>

          </TouchableOpacity>
        )}
      />


      <FlatList
        data={AllPosts}
        ItemSeparatorComponent={renderSeperator}
        style={{ paddingHorizontal: 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => onPostSelect(index)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={styles.circle}
              source={{ uri: item.profile }}
            />
            <Text style={styles.title}>{item.title}</Text>

          </TouchableOpacity>
        )}
      />
 */