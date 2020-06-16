/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';
import media from './constants/index';
import UserView from '../myscreens/Viewer/components/UserView';
import SwipeAccordion from '../myscreens/Viewer/components/swipeAccordion';
import Post from './Post';
import Orientation from 'react-native-orientation-locker';

//const ScreenHeight = Dimensions.get('window').height;

export default class SwiperComponent extends Component {
  onClose = () => {};

  componentDidMount(){
    Orientation.lockToPortrait();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={'black'}
          translucent={false}
        />

        <Swiper style={styles.wrapper} showsPagination={false}>
          {media.map((item, index) => (
            <View style={styles.slide1}>
              <Post
                //pause={isPause}
                post={item}
                onClose={() => {
                  this.onClose();
                }}
              />
              <UserView
                name={item.creator.name}
                profile={item.creator.profile}
                updated_at={item.creator.updated_at}
                onClose={() => {
                  this.onClose();
                }}
                swiper
              />
              <SwipeAccordion dataArray={item} />
            </View>
          ))}
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
