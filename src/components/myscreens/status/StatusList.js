import React, { useRef, useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View,Dimensions } from 'react-native';
// import Modal from 'react-native-modalbox';
import { CubeNavigationHorizontal } from 'react-native-3dcube-navigation';
import StoryContainer from './components/StoryContainer';
import BleashupFlatList from '../../BleashupFlatList';
import BleashupHorizontalFlatList from '../../BleashupHorizotalFlatList';

let { height, width } = Dimensions.get('window');

const StatusListModule = (props) => {
  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const modalScroll = useRef(null);

  const onStorySelect = (index) => {
    setCurrentUserIndex(index);
    setModel(true);
  };

  const onStoryClose = () => {
    setModel(false);
  };

  const onStoryNext = (isScroll) => {
    const newIndex = currentUserIndex + 1;
    if (props.data.length - 1 > currentUserIndex) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    } else {
      setModel(false);
    }
  };

  const onStoryPrevious = (isScroll) => {
    const newIndex = currentUserIndex - 1;
    if (currentUserIndex > 0) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    }
  };

  const onScrollChange = (scrollValue) => {
    if (currentScrollValue > scrollValue) {
      onStoryNext(true);
      console.log('next');
      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious();
      console.log('previous');
      setCurrentScrollValue(scrollValue);
    }
  };

  const renderSeperator = () => (
    <View style={{ height: 1, backgroundColor: '#ccc' }} />
  );
 
  
  return (
    <View style={{justifyContent: 'flex-start'}}>
     {
       props.horizontal?
       <BleashupHorizontalFlatList  
         dataSource={props.data}
         //ItemSeparatorComponent={renderSeperator}
         //style={{ paddingHorizontal: 10 }}
         keyExtractor={(item, index) =>{item.event_id}}
         renderItem={(item, index) => (
         
          <TouchableOpacity onPress={() => onStorySelect(index)} style={{ flexDirection: 'row', alignItems: 'center' }}>
             <View style={{flexDirection:props.horizontal?"column":"row",marginLeft:10}}>
              <Image
                style={styles.circle}
                source={{ uri: item.profile }}
              />
              <Text style={styles.title}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
       />

       :
       <BleashupHorizontalFlatList  
         dataSource={props.data}
         vertical={true}
         ItemSeparatorComponent={renderSeperator}
         //style={{ paddingHorizontal: 10 }}
         keyExtractor={(item, index) =>{item.phone}}
         renderItem={(item, index ) => (

          <TouchableOpacity onPress={() => onStorySelect(index)} >
             <View style={{flexDirection:"row",marginLeft:10,alignItems:"center"}}>
              <Image
                style={styles.circle}
                source={{ uri: item.profile }}
              />
                <View style={{flexDirection:"column",marginLeft:4}}>
                  <Text style={{color:"black",fontSize:15,fontWeight:"500"}}>{item.username}</Text>
                  <Text style={{fontSize:13}} note>{item.updated_at}</Text> 
                </View>

              </View>
            </TouchableOpacity>
        
          )}
       />
     }


      <Modal
        animationType="slide"
        transparent={false}
        visible={isModelOpen}
        style={styles.modal}
        onShow={() => {
          if (currentUserIndex > 0) {
            modalScroll.current.scrollTo(currentUserIndex, false);
          }
        }}
        onRequestClose={onStoryClose}
      >
        {/* eslint-disable-next-line max-len */}
        <CubeNavigationHorizontal callBackAfterSwipe={g => onScrollChange(g)} ref={modalScroll} style={styles.container}>
          {props.data.map((item, index) => (
            <StoryContainer
              onClose={onStoryClose}
              onStoryNext={onStoryNext}
              onStoryPrevious={onStoryPrevious}
              user={item}
              isNewStory={index !== currentUserIndex}
            />
          ))}
        </CubeNavigationHorizontal>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical: 50,
    backgroundColor: 'rgba(255,255,255,255)',
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
    height:height
  },
  title: {
    fontSize: 9, textAlign: 'center',marginBottom:4
  },
});

 
export default StatusListModule;





/**
 *       <FlatList
        data={props.data}
        horizontal={props.horizontal}
        ItemSeparatorComponent={renderSeperator}
        style={{ paddingHorizontal: 10 }}
        renderItem={({ item, index }) => (

        <TouchableOpacity onPress={() => onStorySelect(index)} style={{ flexDirection: 'row', alignItems: 'center' }}>
           <View style={{flexDirection:props.horizontal?"column":"row"}}>
            <Image
              style={styles.circle}
              source={{ uri: item.profile }}
            />
            <Text style={styles.title}>{item.title}</Text>
            </View>
          </TouchableOpacity>
      
        )}
      />

 */