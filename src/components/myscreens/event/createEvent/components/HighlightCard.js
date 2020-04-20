import React, { Component } from "react";
import {
  Card, CardItem, Icon, Label,
  Title, Input, Left, Right,
  Button, Thumbnail,
} from "native-base";

import { View, TouchableOpacity, Dimensions, Text, } from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import Swipeout from 'react-native-swipeout';
//import HighlightCardDetail from "./HighlightCardDetail";
import moment from "moment"
import { isEqual } from "lodash";
//import EventHighlights from "./EventHighlights"
import BleashupAlert from './BleashupAlert';
import testForURL from '../../../../../services/testForURL';
import CacheImages from '../../../../CacheImages';
import shadower from "../../../../shadower";
import PostMenu from "./PostMenu";
import ColorList from '../../../../colorList';
import buttoner from "../../../../../services/buttoner";
import MedaiView from "./MediaView";


let { height, width } = Dimensions.get('window')

export default class HighlightCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      updating: false,
      deleting: false,
      isOpen: false,
      check: false,
      master: this.props.participant.master == false ? this.props.participant.master : true
    }

  }


  @autobind
  update() {
    //new highlight update when event is not yet created but highlight already created
    this.props.parentComponent.state.currentHighlight = this.props.item;
    this.props.parentComponent.setState({ update: true });
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.mounted !== nextState.mounted || !isEqual(this.props.item, nextProps.item)
  }
  containsMedia() {
    return this.props.item.url.video || this.props.item.url.audio || this.props.item.url.photo ? true : false
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        mounted: true
      })
    }, 50 * this.props.delay)
  }

  creator = this.props.computedMaster//this.props.item.creator === this.props.phone 
  render() {

    return (

      this.state.mounted ?
        <View style={{ width: ColorList.containerWidth * .9, ...shadower(1), margin: 3, borderRadius: 3, padding: 5,justifyContent: 'center', }}>
          <View style={{ flexDirection: 'row',width:'98%', justifyContent: 'space-between', marginTop: 2, marginBottom: 2, height: height / 30,alignSelf: 'center', }}>
            <View style={{ maxWidth: '85%' }}>
              <Title style={{
                fontSize: 14, color: ColorList.headerBlackText, fontWeight: 'bold', alignSelf: 'flex-start',
              }}>{this.props.item.title ? this.props.item.title : ""}</Title>
            </View>
            <View>
              {this.creator ? <View style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', }}>
                <PostMenu creator={this.creator} mention={() => this.props.mention(this.props.item)} delete={() => this.props.deleteHighlight(this.props.item)}
                  update={() => this.props.update(this.props.item.id)}
                  master={this.props.participant.master}>
                </PostMenu>
              </View> : null}
            </View>
          </View>
         <MedaiView

            height={this.props.height}
            showItem={this.props.showItem}
            url={this.props.item.url}
         >
         </MedaiView>
          <View style={{ height: this.containsMedia() ? (height / 18) : (height / 7), margin: '.5%', }}>
            <Text ellipsizeMode='tail' style={{ fontSize: 12, }} numberOfLines={this.containsMedia() ? 2 : 10}>{this.props.description ? this.props.description : null}</Text>
          </View>
        </View> : <Card style={{ width: ColorList.containerWidth * .9, height: "100%" }}></Card>

    )
  }

}


