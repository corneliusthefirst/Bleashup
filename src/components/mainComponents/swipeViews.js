/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {View, Dimensions,Text } from 'react-native';
import Swiper from 'react-native-swiper';
import AnimatedComponent from '../AnimatedComponent';
import ColorList from '../colorList';

const ScreenHeight = Dimensions.get('window').height;

export default class SwiperView extends AnimatedComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={{height:this.props.height ? this.props.height : ScreenHeight,
            backgroundColor:this.props.backgroundColor ? this.props.backgroundColor : 'black',justifyContent: 'center',alignItems: 'center'}}>
       <Swiper
          ref={(ref) => (this.swiper = ref)}
          showsPagination={false}
          loop={true}
          showsButtons={true}
          nextButton={<Text style={{color:ColorList.bodyIcon,fontSize:40}}>›</Text>}
          prevButton={<Text style={{color:ColorList.bodyIcon,fontSize:40}}>‹</Text>}
         >
          {this.props.swipeArray.map((item, index) => {

            return (
              <View style={{height:this.props.height ? this.props.height : ScreenHeight,
               backgroundColor:this.props.backgroundColor ? this.props.backgroundColor : 'black',justifyContent: 'center',alignItems: 'center'}}>
                   {item}
              </View>
            );
           })
          }
        </Swiper>
    </View>
    );
   }
}
