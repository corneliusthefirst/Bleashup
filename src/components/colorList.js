import React, { Component } from 'react';
import { Dimensions } from 'react-native';


let { height, width } = Dimensions.get('window');
class Colorlist extends Component {


//container
containerHeight = height
containerWidth = width
containerBackground = "#1FABAB"

//header
 headerIcon = "white"
 headerText = "white"
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
export default ColorList;