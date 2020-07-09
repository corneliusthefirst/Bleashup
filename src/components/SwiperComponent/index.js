/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';
//import this.state.media from './constants/index';
import UserView from '../myscreens/Viewer/components/UserView';
import SwipeAccordion from '../myscreens/Viewer/components/swipeAccordion';
import Post from './Post';
import AnimatedComponent from '../AnimatedComponent';
//const ScreenHeight = Dimensions.get('window').height;

export default class SwiperComponent extends AnimatedComponent {
  initialize(){
    this.state = {
      itemswiper: {},
      isPause: true,
      currentIndex: this.props.navigation.getParam('currentIndex')
        ? this.props.navigation.getParam('currentIndex')
        : 0,
      media: this.props.navigation.getParam('dataArray'),
      mapFunction: this.props.navigation.getParam('mapFunction'),
    };
  }
  init = (currentIndex) => {
    this.setStatePure({
      itemswiper: this.state.mapFunction(this.state.media[currentIndex]),
    });
    this.post.setState({ isPause: false });
  };

  componentDidMount() {
    this.init(this.state.currentIndex);
    //this.swiper.scrollBy(this.state.currentIndex, true);
  }

  onchageIndex = (index) => {
    this.setStatePure({
      itemswiper: this.state.mapFunction(this.state.media[index]),
      // isPause: true,
    });
    this.post.setState({ isPause: false });
  };

  onMomentumScrollEnd = (state) => {
    //this.post.onScrollEnd();
    //this.setStatePure({ isPause: !this.state.isPause });
  };

  onScrollBeginDrag = (state) => {
    // this.post.onScrollStart();
  };

  onTouchStartCapture = (state) => {
    //this.post.onScrollEnd();
  };
  goBack(){
    this.props.navigation.goBack()
  }
  execParam(method){
    this.props.navigation.getParam(method) && this.props.navigation.getParam(method)(this.state.itemswiper)
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={'black'}
          translucent={false}
        />

        <Swiper
          ref={(ref) => (this.swiper = ref)}
          style={styles.wrapper}
          showsPagination={false}
          loadMinimal
          loop={false}
          loadMinimalSize={5}
          index={this.state.currentIndex}
          onTouchStartCapture={(e, state, context) =>
            this.onTouchStartCapture(state)
          }
          onMomentumScrollEnd={(e, state, context) =>
            this.onMomentumScrollEnd(state)
          }
          onScrollBeginDrag={(e, state, context) =>
            this.onScrollBeginDrag(state)
          }
          onIndexChanged={(index) => this.onchageIndex(index)}
        >
          {this.state.media.map((item, index) => {
            let itemswiper = item

            return (
              <View style={styles.slide1}>
                <Post
                  ref={(ref) => (this.post = ref)}
                  //isPause={this.state.isPause}
                  post={this.state.mapFunction(itemswiper)}
                  onClose={() => {
                    this.props.navigation.goBack();
                  }}
                />
              </View>
            );
          })}
        </Swiper>
        {this.state.itemswiper.creator ? (
          <UserView
            forward={() => this.execParam("forward") }
            reply={() => {
              this.goBack()
              this.execParam("reply")
            }}
            name={this.state.itemswiper.creator.name}
            profile={this.state.itemswiper.creator.profile}
            updated_at={this.state.itemswiper.creator.updated_at}
            onClose={() => {
              this.goBack()
            }}
            swiper
            removeMessage={() =>
              this.props.removeMessage(this.state.itemswiper)
            }
          />
        ) : null}
        {this.state.itemswiper.creator ? (
          <SwipeAccordion 
          startThis={() => {
              this.execParam("starThis")
          }
          }
          reply={() => {
            this.execParam("remindThis")
          }}
          dataArray={this.state.itemswiper} />
        ) : null}
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
