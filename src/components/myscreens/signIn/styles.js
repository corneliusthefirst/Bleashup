const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  /*imageContainer: {
    flex: 1,
    width: null,
    height: null
  },
  logoContainer: {
    flex: 1,
    marginTop: deviceHeight / 8,
    marginBottom: 30
  },
  logo: {
    position: "absolute",
    left: Platform.OS === "android" ? 40 : 50,
    top: Platform.OS === "android" ? 35 : 60,
    width: 280,
    height: 100
  },
  text: {
    color: "#D8D8D8",
    bottom: 6,
    marginTop: 5
  },
   H3:{
    marginTop:deviceHeight / 6,
    fontSize:18,
    color:'#1FABAB',
    marginLeft: deviceHeight / 5.7,
   // borderRadius:2,
    paddingRight:4,
    paddingLeft:4,
    width:deviceWidth/4,
    backgroundColor:'darkslategrey'
    
  },*/
  

 
  buttonstyle: {
    marginTop:50,
    width:deviceWidth/2,
    marginLeft:deviceWidth/4
    
    
  },
 
  input:{
    marginTop:50
  }

};


