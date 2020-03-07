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

let { height, width } = Dimensions.get('window')

export default class HighlightCardDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      enlargeImage: false
    }
  }

  render() {
    return (
      <Modal
        backButtonClose={true}
        isOpen={this.props.isOpen}
        onClosed={this.props.onClosed}
        position={'bottom'}
        swipeToClose={true}
        style={{
          height: "90%", alignSelf: 'center',
          backgroundColor: "#FEFFDE", borderTopLeftRadius: 8, borderTopRightRadius: 8, width: "100%", flexDirection: 'column'
        }}

        coverScreen={true}
      >
        <View>
          <View style={{ height: '94%' }}>
            <ScrollView showsVerticalScrollIndicator={false} >
              <View style={{ flex: 1, ...shadower(6) }}>
                {this.props.shouldRestore ? <View style={{ width: '95%', alignItems: 'flex-end', margin: '2%', }}><Button
                  style={{ alignSelf: 'flex-end', margin: '2%', marginRight: '2%' }} onPress={() => {
                    this.props.onClosed()
                    this.props.restore(this.props.item)
                  }} rounded><Text>{"Restore"}</Text></Button></View> : null}
                <HighLight mention={() => this.props.mention(this.props.item)} hideReplyer={true} color={"#FEFFDE"} showPhoto={(url) => this.props.showPhoto(url)} modal={true} showVideo={(url) => this.props.showVideo(url)} background={"#FEFFDE"} highlight={this.props.item} disableSwipper={true}></HighLight>
                {/*<View style={{alignItems:'center',justifyContent:'center',height:height/7}}>
               <Title style={{color:'#1FABAB',fontSize:23,fontWeight:"bold"}}>{this.props.item.title}</Title>
            </View>
            <View>
                <TouchableOpacity style={{ ...shadower(5) }} onPress={()=>{this.setState({enlargeImage:true})}}>
              {testForURL(this.props.item.url.photo)?<CacheImages thumbnails square source={{uri:this.props.item.url.photo}} style={{width:"92%",marginLeft:"4%",marginRight:"4%",marginBottom:"4%",borderRadius:5,height:height/3 + height/11}}>
                  </CacheImages> : <Thumbnail square large source={{ uri: this.props.item.url.photo }} style={{ width: "92%", marginLeft: "4%", marginRight: "4%", marginBottom: "4%", borderRadius: 5, height: height / 3 + height / 11 }}></Thumbnail>}
              </TouchableOpacity>
            </View>
            <View style={{margin:"5%",fontStyle:'italic'}}>
             <Text>{this.props.item.description}</Text>
              </View>*/}
              </View>
            </ScrollView>
            <View style={{ position: 'absolute', margin: '1%', }}><Text style={{ margin: '2%', color: '#A91A84', fontWeight: 'bold' }} note>{'post'}</Text></View>
          </View>
        </View>
      </Modal>



    )
  }
}