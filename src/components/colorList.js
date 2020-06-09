import React, { Component } from 'react';
import { Dimensions } from 'react-native';


let { height, width } = Dimensions.get('window');
class colorlist {
    constructor() {
    }

    //container
    containerHeight = height
    containerWidth = width
    headerTextSize = 14
    containerBackground = "#1FABAB"
    redIcon='red'
    containerBackground = "white"

    //header
    iconGray = '#555756'
    iconActive = "#1FABAB"
    iconInactive = "#ADE3D2"
    replyBackground = "rgba(34, 0, 0, 0.1)"
    headerTextInverted = "black"
    headerIcon = "black"
    headerText = "black"
    headerBlackText = "black"
    headerBackground = "white"
    headerHeight = 55
    headerFontweight = "bold"
    buttonerBackground = 'rgba(52, 52, 52, 0.6)'
    bottunerLighter = "rgba(34, 0, 0, 0.05)"
    headerFontSize = 16
    reminds = "#2DDFD5"
    post = "#F4AC1C"
    vote = "#4B6CF7"
    chatboxBorderRadius = 5
    copy = "#92E578"
    delete = "red"

    //body
    bodyIcon = "black"
    bodyText = "black"
    bodyBackground = "white"
    bodySubtext = "gray"
    bodyDarkWhite = "#f4f6fc"
    darkGrayText = "#696969"
    //modal
 

    //pop menu
    popMenuBackground = "white"

    //likes 
    heartColor = '#FE1D1D'
    likeActive = "#1FABAB"
    likeInactive = "black"
    indicatorColor = "#057D74"
    indicatorInverted = "#DDECE9"
    
    //messages 
    senTBoxColor = "#F3F8F7"
    receivedBox = "#FFFFFF"


}

const ColorList = new colorlist()
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