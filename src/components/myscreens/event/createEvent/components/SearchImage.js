import React, { Component } from "react";
import { Content, Card, CardItem, Text, Body, Icon, Header, Button } from "native-base";
//import GState from "../../../../../stores/globalState";
import { View, Linking, Alert, Dimensions, ScrollView } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import Swipeout from "react-native-swipeout";
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";


let { height, width } = Dimensions.get('window');
export default class SearchImage extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  async openLink(url) {
    this.props.openPicker ? this.props.openPicker() : this.props.accessLibrary()
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
          height: height / 2, borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
          backgroundColor: "#FEFFDE", borderColor: 'black', width: "96%", flexDirection: 'column', marginRight: "2%"
        }}
        position={'top'}
        //backdropPressToClose={false}
        //swipeToClose={false}
        entry={'top'}
        coverScreen={true}
      >
        <View style={{ flexDirection: "column", flex: 1, justifyContent: 'space-between', alignItem: 'center', margin: "3%" }}>
          <View style={{ flexDirection: 'row', }}>
            <TouchableOpacity style={{ alignSelf: "flex-start", width: "100%" }} transparent>
              <Icon style={{ fontSize: 20, fontWeight: "500" }} name={'close'} type={'EvilIcons'} onPress={() => { this.props.onClosed() }} ></Icon>
            </TouchableOpacity>

            {/*<TouchableOpacity style={{ alignSelf: "flex-end", margin: "0%", }}>
              <Text style={{ color: "darkgreen", fontSize: 20, fontWeight: "500" }} onPress={() => {
                this.props.accessLibrary()
                this.props.onClosed()
              }} >Go</Text>
            </TouchableOpacity>*/}



          </View>
          <Text style={{ alignSelf: "center", color: "#1FABAB", fontSize: 18 }}>Some suggested free sites</Text>

          <Button style={{ alignSelf: 'center', width: "90%", borderRadius: 15, borderColor: "#1FABAB", backgroundColor: "transparent", justifyContent: 'center', alignItem: 'center', marginTop: "10%" }}
            onPress={() => {
              this.props.onClosed(true)
              if (this.props.h_modal) {
                setTimeout(() => {
                  let url = "https://www.pixabay.com"
                  this.openLink(url)
                }, 250)
              } else {
                let url = "https://www.pixabay.com"
                this.openLink(url)
              }

            }}>
            <Text style={{ alignSelf: "center" }}>Pixabay</Text>
          </Button>

          <Button style={{ alignSelf: 'center', width: "90%", borderRadius: 15, borderColor: "#1FABAB", backgroundColor: "transparent", justifyContent: 'center', alignItem: 'center', marginTop: "10%" }}
            onPress={() => {
              this.props.onClosed()
              let url = "https://www.pixels.com"
              this.openLink(url);

            }}>
            <Text style={{ alignSelf: "center" }}> Pixels </Text>
          </Button>

          <Button style={{ alignSelf: 'center', width: "90%", borderRadius: 15, borderColor: "#1FABAB", backgroundColor: "transparent", justifyContent: 'center', alignItem: 'center', marginTop: "10%" }}
            onPress={() => {
              this.props.onClosed()
              let url = "https://www.pexels.com"
              this.openLink(url)

            }}>
            <Text style={{ alignSelf: "center" }}>Pexels</Text>
          </Button>

          <TouchableOpacity>
            <Text style={{ alignSelf: "flex-start", color: "darkturquoise", margin: "5%" }}
              onPress={() => {
                this.props.onClosed()
                let url = 'https://www.google.com'
                this.openLink(url)
              }}>Others..</Text>
          </TouchableOpacity>

        </View>
      </Modal>


    );
  }
}
