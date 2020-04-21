import React, { Component } from "react";
import {
  Button, Text, Icon
} from "native-base";

import { StyleSheet, View, Image, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import Swipeout from 'react-native-swipeout';
import PhotoEnlargeModal from "../../../invitations/components/PhotoEnlargeModal";
import CacheImages from '../../../../CacheImages';
import testForURL from '../../../../../services/testForURL';
import shadower from "../../../../shadower";
import HighLight from "../../../highlights_details/Highlight";
import ColorList from '../../../../colorList';
import BleashupModal from "../../../../mainComponents/BleashupModal";
import CreationHeader from "./CreationHeader";

let { height, width } = Dimensions.get('window')

export default class HighlightCardDetail extends BleashupModal {
  constructor(props) {
    super(props)
    this.state = {
      enlargeImage: false
    }
  }
onClosedModal(){
  this.props.onClosed()
}
  modalBody() {
    return (
        <View>
        <CreationHeader
          title={'Post Detail'}
          back={() => this.onClosedModal()}
        >
        </CreationHeader>
          <View style={{ height: ColorList.containerHeight - (ColorList.headerHeight + 20) }}>
            <ScrollView showsVerticalScrollIndicator={false} >
              <View style={{ flex: 1, ...shadower(6) }}>
                {this.props.shouldRestore ? <View style={{ width: '95%', alignItems: 'flex-end', margin: '2%',height:'100%' }}><Button
                  style={{ alignSelf: 'flex-end', margin: '2%', marginRight: '2%' }} onPress={() => {
                    this.props.onClosed()
                    this.props.restore(this.props.item)
                  }} rounded><Text>{"Restore"}</Text></Button></View> : null}
                <HighLight 
                shouldNotMention={this.props.shouldNotMention}
                 mention={() => this.props.mention(this.props.item)} 
                 hideReplyer={true} color={ColorList.bodyBackground} 
                 showPhoto={(url) => this.props.showPhoto(url)} 
                 modal={true} 
                 showVideo={(url) => this.props.showVideo(url)} 
                 background={ColorList.bodyBackground} 
                 highlight={this.props.item}
                  disableSwipper={true}></HighLight>
              </View>
            </ScrollView>
          </View>
        </View>
    )
  }
}