import React, { Component } from 'react';
import { Dimensions } from 'react-native';


let { height, width } = Dimensions.get('window');
class colorlist {
    constructor() {
    }

    //container
    containerHeight = height
    containerWidth = width
    containerBackground = "#1FABAB"

    //header
    iconGray = '#555756'
    iconActive = "#1FABAB"
    iconInactive = "#ADE3D2"
    headerIcon = "#0A4E52"
    headerText = "#0A4E52"
    headerTextInverted = "white"
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
    darkGrayText = "#696969"
    //modal


    //pop menu
    popMenuBackground = "white"


}

const ColorList = new colorlist()
export default ColorList;