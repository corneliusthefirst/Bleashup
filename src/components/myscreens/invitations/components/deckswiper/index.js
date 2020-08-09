import React, { Component } from "react";
import { View } from 'react-native';
import SwiperCard from './swiperCard';
import SwiperHighlight from './swiperHighlight';
import autobind from 'autobind-decorator';


export default class DeckSwiperModule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      descriptionEnd: false,
      highlightEnd: false
    }

  }

  @autobind
  SwipeLeft() {
    this._deckSwiper._root.swipeLeft()
  }
  @autobind
  SwipeRight() {
    this._deckSwiper._root.swipeRight()
  }



  @autobind
  Desc(item) {
    if (item.url) {
      //creating the highlights starting and ending data
      const highlightData = item.description
      max_length = highlightData.length
      highlightStartData = highlightData.slice(0, 280)
      highlightEndData = highlightData.slice(280, max_length)

      return (
        <SwiperHighlight highlightStartData={highlightStartData} highlightEndData={highlightEndData} item={item}
          highlightEnd={this.state.highlightEnd} swipeleft={this.SwipeLeft} swiperight={this.SwipeRight}
          onClosed={() => this.setState({ highlightEnd: false })} onOpen={() => this.setState({ highlightEnd: true })} />


      )
    } else {

      const descriptionData = item.event_description
      max_length = item.event_description ? item.event_description.length : 0
      descriptionStartData = descriptionData && descriptionData.length > 0 ? descriptionData.slice(0, 500) : descriptionData
      descriptionEndData = descriptionData && descriptionData.length > 0 ? descriptionData.slice(500, max_length) : descriptionData


      return (

        <SwiperCard descriptionStartData={descriptionStartData} descriptionEndData={descriptionEndData} item={item}
          descriptionEnd={this.state.descriptionEnd} swipeleft={this.SwipeLeft} swiperight={this.SwipeRight}
          onClosed={() => this.setState({ descriptionEnd: false })} onOpen={() => this.setState({ descriptionEnd: true })} />


      )


    }
  }

  render() {

    return (
      <View style={{ width: "98%", height: 300, marginTop: -40, marginLeft: 5 }}>
        <DeckSwiper
          ref={(c) => this._deckSwiper = c}
          dataSource={this.props.details}
          renderEmpty={() => { }
          }
          renderItem={item => this.Desc(item)}
        />
      </View>
    );

  }
}
