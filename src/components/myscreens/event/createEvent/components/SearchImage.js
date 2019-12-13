import React, { Component } from "react";
import { Content, Card, CardItem, Text, Body, Icon, Header ,Button} from "native-base";
//import GState from "../../../../../stores/globalState";
import { View ,Linking,Alert,Dimensions,ScrollView } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import Swipeout from "react-native-swipeout";
import InAppBrowser from 'react-native-inappbrowser-reborn';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";


let {height, width} = Dimensions.get('window');
export default class SearchImage extends Component {
  constructor(props) {
    super(props)

    this.state={ }
  }

  async openLink(url) {
    try {
      
      if (await InAppBrowser.isAvailable()) {

        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#1FABAB',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'overFullScreen',
          modalTransitionStyle: 'partialCurl',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#1FABAB',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right'
          },
          headers: {
            'my-custom-header': 'my custom header value'
          }
        })

        //Alert.alert(JSON.stringify(result))
      }
      else Linking.openURL(url)
    } catch (error) {
      Alert.alert(error.message)
    }
  }

/*
@autobind
checkStorage(){
  setInterval(() => {
    DeviceInfo.getFreeDiskStorage().then(freeDiskStorage => {
    if(this.state.storageSizeBefore-100>freeDiskStorage && this.state.goBack==true){
         console.warn("storage before",this.state.storageSizeBefore)
         console.warn("storage after",freeDiskStorage)
         console.warn("differences",(this.state.storageSizeBefore - freeDiskStorage))
          this.setState({goBack:true});
    }
  })
  } ,1000)

}*/




  render() {
    return (
   
      <Modal
          isOpen={this.props.isOpen}
          onClosed={this.props.onClosed}
          style={{
           height: height/2 , borderRadius: 15,
           backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "96%",flexDirection:'column',marginRight:"2%"
          }}
                position={'center'}
                backdropPressToClose={false}
                swipeToClose={false}
                coverScreen={true}
                >
                <View style={{flexDirection:"column",flex:1,justifyContent:'space-between',alignItem:'center',margin:"3%"}}>
                  
                 
                    <TouchableOpacity  style={{alignSelf:"flex-start",marginTop:"3%" }} transparent>
                      <Text style={{ color: "darkgreen", fontSize: 20,fontWeight:"500" }}  onPress={()=>{ this.props.onClosed() }} >Cancel</Text>
                     </TouchableOpacity>

                      <TouchableOpacity  style={{alignSelf:"flex-end",margin:"0%",marginTop:-(height/28) }} transparent>
                      <Text style={{ color: "darkgreen", fontSize: 20,fontWeight:"500" }}  onPress={()=>{
                            this.props.accessLibrary()
                            this.props.onClosed() }} >Go</Text>
                     </TouchableOpacity>  
                  
                

                    <Text  style={{alignSelf:"center",color: "#1FABAB",fontSize:18}}>Some suggested free sites</Text>
                   
                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"10%"}}
                      onPress={()=>{
                        let url = "https://www.pixabay.com"
                        this.openLink(url)
                       
                        }}>
                         <Text  style={{alignSelf:"center"}}>Pixabay</Text>
                    </Button> 

                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"10%"}}
                      onPress={()=>{
                          let url = "https://www.pixels.com"
                          this.openLink(url);
                          
                          }}>
                         <Text  style={{alignSelf:"center"}}> Pixels </Text>
                    </Button>
  
                    <Button style={{alignSelf:'center',width:"90%",borderRadius:15,borderColor:"#1FABAB",backgroundColor:"transparent",justifyContent:'center',alignItem:'center',marginTop:"10%"}}
                      onPress={()=>{
                        let url = "https://www.pexels.com"
                        this.openLink(url)
                       
                        }}>
                         <Text  style={{alignSelf:"center"}}>Pexels</Text>
                    </Button>  
                    
                  <TouchableOpacity>
                    <Text  style={{alignSelf:"flex-start",color:"darkturquoise",margin:"5%"}} 
                       onPress={()=>{  let url = 'https://www.google.com'
                                       this.openLink(url) }}>Others..</Text>
                  </TouchableOpacity>
                    
                </View>
             </Modal>

   
    );
  }
}
