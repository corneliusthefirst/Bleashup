/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {View, Dimensions,Text } from 'react-native';
//import Swiper from 'react-native-swiper';
//import ColorList from '../colorList';
import data from './paginationdata';
import GestureRecognizer from 'react-native-swipe-gestures';
import ProfileSimple from '../../currentevents/components/ProfileViewSimple';

const ScreenHeight = Dimensions.get('window').height;

export default class PaginationView extends Component {
    constructor(props){
      super(props);
      this.state = {
          currentposition:0,
          numberOfItems: Math.round( ScreenHeight / 60),
          currentItems:[],
      };
    }

    init(){
        this.setState({currentItems:data.slice(0,this.state.numberOfItems), currentposition: this.state.numberOfItems});
    }
    componentDidMount(){
        this.init();
    }

    config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
      };

    onSwipeDown = () => {
        if (this.state.currentposition === 0 ){

        }
        else if (this.state.currentposition - this.state.numberOfItems > 0) {
            this.setState({
                currentItems:data.slice(this.state.currentposition,this.state.currentposition - this.state.numberOfItems),
                currentposition: this.state.currentposition - this.state.numberOfItems,
            });
         }
         else {
             this.setState({
                 currentItems:data.slice(this.state.currentposition,0),
                 currentposition: 0,
                });
         }
      };

    onSwipeUp = () => {
        if (this.state.currentposition === data.length){

        }
        else if (this.state.currentposition + this.state.numberOfItems < data.length) {
           this.setState({
               currentItems:data.slice(this.state.currentposition,this.state.currentposition + this.state.numberOfItems),
               currentposition: this.state.currentposition + this.state.numberOfItems,
            });

        }
        else {
            this.setState({
                currentItems:data.slice(this.state.currentposition,data.length),
                currentposition:data.length,
            });
        }
      };


  render() {
    return (
        <View style={{height:this.props.height ? this.props.height : ScreenHeight,
            backgroundColor:this.props.backgroundColor ? this.props.backgroundColor : 'black',justifyContent: 'center',alignItems: 'center'}}>
        <GestureRecognizer
          onSwipeDown={this.onSwipeDown}
          onSwipeUp={this.onSwipeUp}
          config={this.config}
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            flexDirection:'column',
          }}
         >
        {this.state.currentItems.map((item, index) => {

            return (
             item.type === 'image' ? <ProfileSimple profile={{profile:item.url,nickname:item.creator.name}}/> : <ProfileSimple  profile={{profile:item.creator.profile,nickname:item.creator.name}}/>
            );
        })
        }

         </GestureRecognizer>

       </View>
    );
   }
}

/**       <Swiper
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
        </Swiper> */
