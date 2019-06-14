const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
 /* imageContainer: {
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
  },*/
  phoneinput : {
    flex: 1,
    marginTop: deviceHeight / 20,
    height:deviceHeight / 17,
    padding:10,
    //marginLeft: deviceHeight / 50
  },

 
  buttonstyle: {
    marginTop:15,
    width:deviceWidth,
    
  },
  H3:{
    marginTop:-deviceHeight / 2,
    fontSize:18,
    color:'seagreen',
    marginLeft: deviceHeight / 50
    
  }

};
