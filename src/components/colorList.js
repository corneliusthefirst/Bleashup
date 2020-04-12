import React, { Component } from 'react';
import { Dimensions } from 'react-native';


let { height, width } = Dimensions.get('window');
class Colorlist extends Component {


//container
containerHeight = height
containerWidth = width
containerBackground = "#1FABAB"

//header
iconInactive ="#ADE3D2"
headerIcon = "#0A4E52"
headerText = "#0A4E52"
 headerBlackText = "#0A4E52"
 headerBackground = "white"
 headerHeight = 50
 headerFontweight = "bold"
 headerFontSize = 20


//body
 bodyIcon = "#0A4E52"
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