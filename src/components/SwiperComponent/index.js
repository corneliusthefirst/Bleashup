/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';
import media from './constants/index';
import UserView from '../myscreens/Viewer/components/UserView';
import TransparentAccordion from '../myscreens/Viewer/components/swipeAccordion';
import Post from './Post';

//const ScreenHeight = Dimensions.get('window').height;

export default class SwiperComponent extends Component {
  onClose = () => {};

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
              <UserView
                name={item.creator.name}
                profile={item.creator.profile}
                updated_at={item.creator.updated_at}
                onClose={() => {
                  this.onClose();
                }}
                swiper
              />
              <Post
                //pause={isPause}
                post={item}
                onClose={() => {
                  this.onClose();
                }}
              />

              <TransparentAccordion dataArray={item} />
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
