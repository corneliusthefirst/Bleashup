const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;


export default {

    cardlistItem: {
        color:'black',
        padding:10,
        fontSize:16
    },

    modal: {
     justifyContent: 'center',
     alignItems: 'center',
     height: 380
   },
   image: {
    width:150,
    height: 204
  },
  activityIndicatorStyle: {
    width: 150,
    height: 204,
    backgroundColor: 'transparent'
  }
}
