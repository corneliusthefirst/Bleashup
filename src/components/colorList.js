/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Dimensions } from 'react-native';

let { height, width } = Dimensions.get('window');
class colorlist {
  constructor() {}

  errorColor = '#A91A84';
  containerHeight = height;
  containerWidth = '100%';
  headerTextSize = 14;
  containerBackground = '#1FABAB';
  redIcon = 'red';
  photoPlaceHolderColor = "#C5C5C5"
  containerBackground = 'white';
  profilePlaceHolderHeight = 35
  replyColor = "#56B671"

  //header
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
  post = '#F4AC1C';
  vote = '#4B6CF7';
  chatboxBorderRadius = 5;
  copy = '#92E578';
  delete = 'red';

  //body
  bodyIcon = 'black';
  bodyText = 'black';
  bodyBackground = 'white';
  bodySubtext = '#696969';
  bodyDarkWhite = '#f4f6fc';
  darkGrayText = '#696969';
  bodyTextBlue = '#1e90ff';
  bodyIconBlue = '#1e90ff';

  //dark body
  bodyIcondark = '#f4f6fc';
  bodyTextdark = '#f4f6fc';
  bodyBackgrounddark = '#101010';
  bodyBackgroundDarkGray = '#202020';
  transparent = "rgba(0, 0, 0, 0.001)";
  //modal

  //pop menu
  popMenuBackground = 'white';

  //likes
  heartColor = '#FE1D1D';
  likeActive = '#1FABAB';
  likeInactive = 'black';
  indicatorColor = '#057D74';
  indicatorInverted = '#DDECE9';

  //messages
  senTBoxColor = ["#FEF0EF", "#FEF7EF", "#FEFDEF", "#EFFEF8", "#EFF8FE", "#F8EFFE"]
  //7 "#FEF7EF"
  // 6 "#FEFDEF"
  // 5 "#EFFEF8"
   //4 "#EFF8FE" 
  // 3"#F8EFFE"
  //2 "#D2E5FB"
  //1 '#BCEFD7';
  receivedBox = 'white';

  //Array Iterate
  colorArray = ['#1e90ff', '#8b008b',  '#cd5c5c', '#66cdaa', '#48d1cc', '#663399', '#4682b4', '#663399', '#00ced1', '#7b68ee', '#ff69b4','#228b22', '#5f9ea0','#6495ed'];

}

const ColorList = new colorlist();
export default ColorList;

/**import React, { Component } from 'react';
import { Dimensions } from 'react-native';


let { height, width } = Dimensions.get('window');
class Colorlist extends Component {


//container
containerHeight = height
containerWidth = width
containerBackground = "#1FABAB"

//header
 headerIcon = "ivory"
 headerText = "ivory"
 headerBlackText = "black"
 headerBackground = "#1FABAB"
 headerHeight = 50
 headerFontweight = "bold"
 headerFontSize = 20


//body
 bodyIcon = "black"
 bodyText = "black"
 bodyBackground = "white"
 bodySubtext = "gray"
 bodyDarkWhite = "#f4f6fc"

 //modal


 //pop menu
 popMenuBackground = "white"


}

ColorList = new Colorlist()
export default ColorList; */
