/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Dimensions } from 'react-native';

let { height, width } = Dimensions.get('window');
class colorlist {
  constructor() {
    
  }
  errorColor = '#A91A84';
  containerHeight = height;
  containerWidth = '100%';
  headerTextSize = 14;
  greenColor = '#1FABAB'
  containerBackground = '#1FABAB';
  redIcon = 'red';
  photoPlaceHolderColor = "#C5C5C5"
  containerBackground = 'white';
  profilePlaceHolderHeight = 30
  replyColor = "#56B671"
  iconGray = '#555756';
  iconActive = '#1FABAB';
  iconInactive = '#ADE3D2';
  replyBackground = 'rgba(34, 0, 0, 0.1)';
  headerTextInverted = 'black';
  headerIcon = 'black';
  headerText = 'black';
  headerBlackText = 'black';
  headerBackground = 'white';
  headerHeight = 55;
  headerFontweight = 'bold';
  buttonerBackground = 'rgba(52, 52, 52, 0.6)';
  bottunerLighter = 'rgba(34, 0, 0, 0.05)';
  headerFontSize = 16;
  reminds = '#2DDFD5';
  remindsTransparent = "rgba(45, 223, 213, 0.3)"
  post = '#F4AC1C';
  postTransparent = "rgba(244, 172, 28,0.3)"
  vote = '#4B6CF7';
  chatboxBorderRadius = 5;
  copy = '#92E578';
  delete = 'red';
  bodyIcon = 'black';
  bodyText = 'black';
  bodyBackground = 'white';
  bodySubtext = '#696969';
  bodyDarkWhite = '#f4f6fc';
  darkGrayText = '#696969';
  bodyTextBlue = '#1e90ff';
  bodyIconBlue = '#1e90ff';
  bodyIcondark = '#f4f6fc';
  bodyTextdark = '#f4f6fc';
  bodyBackgrounddark = '#101010';
  bodyBackgroundDarkGray = '#202020';
  transparent = "rgba(0, 0, 0, 0.001)";
  popMenuBackground = 'white';
  heartColor = '#FE1D1D';
  likeActive = '#1FABAB';
  likeInactive = 'black';
  indicatorColor = '#057D74';
  indicatorInverted = '#DDECE9';
  descriptionBody = "mintcream";
  recorderColor = 'rgba(92, 185, 158,.8)'
  sendRand = () => Math.floor(Math.random() * (this.senTBoxColor.length-1))
  senTBoxColor = ["#EFF8FE"]
  receivedBox = 'white';
  colorArray = ['#1e90ff',  '#cd5c5c', '#48d1cc', '#663399', '#4682b4', '#663399', '#00ced1', '#7b68ee', '#5f9ea0','#6495ed'];

}

const ColorList = new colorlist();
export default ColorList;

