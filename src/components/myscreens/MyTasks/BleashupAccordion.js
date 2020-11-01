/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ColorList from '../../colorList';
import BleashupScrollView from '../../BleashupScrollView';
import AntDesign  from 'react-native-vector-icons/AntDesign';
import GState from '../../../stores/globalState';
import AnimatedComponent from '../../AnimatedComponent';
import { _onScroll } from '../currentevents/components/sideButtonService';
import SideButton from '../../sideButton';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';
import rounder from '../../../services/rounder';
import shadower from '../../shadower';

export default class AccordionModuleNative extends AnimatedComponent {
 initialize(){
   this.state = {
     expanded: false,
     isActionButtonVisible:true
   };
   this.onScroll = _onScroll.bind(this)
 }
  
  componentDidMount(){
  }
  renderItem(dataArray,key, index) {
    return <View key={key}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: this.props.backgroundColor ?  this.props.backgroundColor : ColorList.bodyBackground,
        }}
      >
      <View style={{
          minWidth: this.props.hideToggler?'100%':'93%',
        marginBottom: 'auto',
        marginTop: 'auto',
      }}>
        {this.props._renderHeader(dataArray,index,() => {
          this.toggleExpand(dataArray);
        },this.state.expanded, this.props.mainIndex==index)}
        </View>
        {!this.props.hideToggler && <TouchableOpacity onPress={() => requestAnimationFrame(() => this.toggleExpand(dataArray))}>
          <View style={{ width: 30 }}>
            {this.expanded(dataArray) ? (
              <AntDesign style={{...GState.defaultIconSize, fontSize: 18 }} type="AntDesign" name="up" />
            ) : (
                <AntDesign style={{...GState.defaultIconSize, fontSize: 18 }} type="AntDesign" name="down" />
              )}
          </View>
        </TouchableOpacity>}
      </View>
      <View style={styles.parentHr} />
      {this.expanded(dataArray) && (
        <View>{this.props._renderContent(dataArray, index)}</View>
      )}
    </View>;
  }
  expanded(item) {
    return this.props.keyExtractor && this.state.expanded === this.props.keyExtractor(item);
  }
  scrollToIndex(index){
    this.refs.accordion && this.refs.accordion.scrollToIndex(index)
  }
  plusButtom() {
    return <TouchableOpacity
      style={{
        backgroundColor: ColorList.indicatorInverted,
        ...rounder(50, ColorList.indicatorInverted),
        ...shadower(2),
        justifyContent: "center",
      }}
      onPress={() => requestAnimationFrame(() => this.props.exportReports && this.props.exportReports())}
    >
      <MaterialCommunityIcons
        type="AntDesign"
        name="file-export"
        style={{
          ...GState.defaultIconSize,
          color: ColorList.indicatorColor,
          alignSelf: "center",
        }}
      />
    </TouchableOpacity>
  }
  render() {
    return <View><BleashupScrollView
      onScroll={this.onScroll}
      ref="accordion"
      style={{
        height:'100%',
        width:'100%'
      }}
      firstIndex={0}
      renderPerBatch={7}
      initialRender={15}
      numberOfItems={this.props.dataSource.length}
      keyExtractor={this.props.keyExtractor}
      getItemLayout={this.props.getItemLayout}
      dataSource={this.props.dataSource}
      backgroundColor={this.props.backgroundColor}
      renderItem={(item, key,index) => this.renderItem(item,key,index)}
    />
      {this.state.isActionButtonVisible && this.props.master? <SideButton
        buttonColor={ColorList.transparent}
        renderIcon={() => this.plusButtom()}
        ></SideButton>:null}
    </View>;
  }
  toggleExpand = (item) => {
   this.animateUI()
   !this.expanded(item) && this.props.onExpand && this.props.onExpand(item);
    this.setState({ expanded: this.props.keyExtractor ? this.state.expanded === this.props.keyExtractor(item) ? null : this.props.keyExtractor(item) : item });
  };
}

const styles = StyleSheet.create({
  parentHr: {
    //height: 1,
    color: ColorList.bodySubtext,
    width: '100%',
  },
});
