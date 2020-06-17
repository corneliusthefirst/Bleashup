/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';
import media from './constants/index';
import UserView from '../myscreens/Viewer/components/UserView';
import SwipeAccordion from '../myscreens/Viewer/components/swipeAccordion';
import Post from './Post';
import Orientation from 'react-native-orientation-locker';
import moment from 'moment';
import { concat } from "lodash";

//const ScreenHeight = Dimensions.get('window').height;

const toaddRight = [
  {
    id: '1435',
    url:
      'https://images.unsplash.com/photo-1532579853048-ec5f8f15f88d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    type: 'image',
    message:
      'In 2012 Mark Zuckerberg commented, "The biggest mistake we made as a company was betting too much on HTML as opposed to native".[8] He promised that Facebook would soon deliver a better mobile experience.Inside Facebook, Jordan Walke found a way to generate UI elements for iOS from a background JavaScript thread.[9] They decided to organise an internal Hackathon to perfect this prototype in order to be able to build native apps with this technology.[10]After months of development, Facebook released the first version for the React JavaScript Configuration in 2015. During a technical talk,[11] Christopher Chedeau explained that Facebook was already using React Native in production for their Group App and their Ads Manager App.',
    creator: {
      name: 'Mark Angel',
      profile: 'https://avatars0.githubusercontent.com/u/16208872?s=460&v=4',
      updated_at: moment().format(),
    },
  },

  {
    id: '8756',
    url:
      '/storage/emulated/0/beats/APOLOGY Dancehall x Afrobeat x Wizkid Type Beat Instrumental.mp4',
    type: 'video',
    message:
      'was betting too much on HTML as opposed https://avatars0.githubusercontent.com/u/16208872?s=460&v=4 ',
    creator: {
      name: 'Lutin Noir',
      profile: 'https://avatars2.githubusercontent.com/u/45196619?s=460&v=4',
      updated_at: moment().format(),
    },
  },

  {
    id: '2546',
    url:
      'https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    type: 'image',
    message: '',
    creator: {
      name: 'Jacque levantreur',
      profile: 'https://avatars2.githubusercontent.com/u/45196619?s=460&v=4',
      updated_at: moment().format(),
    },
  },
];

const toaddLeft = [
  {
    id: '1435',
    url:
      'https://images.unsplash.com/photo-1532579853048-ec5f8f15f88d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    type: 'image',
    message:
      'In 2012 Mark Zuckerberg commented, "The biggest mistake we made as a company was betting too much on HTML as opposed to native".[8] He promised that Facebook would soon deliver a better mobile experience.Inside Facebook, Jordan Walke found a way to generate UI elements for iOS from a background JavaScript thread.[9] They decided to organise an internal Hackathon to perfect this prototype in order to be able to build native apps with this technology.[10]After months of development, Facebook released the first version for the React JavaScript Configuration in 2015. During a technical talk,[11] Christopher Chedeau explained that Facebook was already using React Native in production for their Group App and their Ads Manager App.',
    creator: {
      name: 'Jackson Martinez',
      profile: 'https://avatars0.githubusercontent.com/u/16208872?s=460&v=4',
      updated_at: moment().format(),
    },
  },

  {
    id: '8756',
    url:
      'https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    type: 'image',
    message:
      'was betting too much on HTML as opposed https://avatars0.githubusercontent.com/u/16208872?s=460&v=4 ',
    creator: {
      name: 'Dell sapardor',
      profile: 'https://avatars2.githubusercontent.com/u/45196619?s=460&v=4',
      updated_at: moment().format(),
    },
  },

  {
    id: '2546',
    url:
      'https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
    type: 'image',
    message: '',
    creator: {
      name: 'Micheal Tholar',
      profile: 'https://avatars2.githubusercontent.com/u/45196619?s=460&v=4',
      updated_at: moment().format(),
    },
  },
];

export default class SwiperComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      media: media,
      toaddLeft: toaddLeft,
      toaddRight: toaddRight,
    };

    /*let tab = [];
    for (let i = 0; i < 50; i++) {
      tab[i] = i.toString();
    }
    this.setState({ media: tab.concat(this.state.media) });*/
  }

  addMediaRight = (data) => {
    this.state.media = this.state.media.concat(data);
    this.setState({ media: this.state.media });
  };

  addMediaLeft = (data, index) => {
    /* var j = index - 2;
    if (j > 4) {
      for (let i = 0; i < data.length; i++) {
        this.state.media[j] = data[i];
        console.warn("index j is",j);
        j--;
      }
    }*/
    this.setState({ media: data.concat(this.state.media) });
    //this.swiper.scrollTo(this.state.toaddLeft.length - 1, true);
    //scrollBy(this.state.toaddLeft.length - 1, true);
  };

  onClose = () => {};

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  onchageIndex = (index) => {
    console.warn("index is",index);
    if (index >= this.state.media.length - 1) {
      this.addMediaRight(this.state.toaddRight);
    } else if (index === 0) {
      this.addMediaLeft(this.state.toaddLeft, index);
    }
  };

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
          loadMinimal={true}
          loadMinimalSize={5}
          index={50}
          onIndexChanged={(index) => this.onchageIndex(index)}
        >
          {this.state.media.map((item, index) => (
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
