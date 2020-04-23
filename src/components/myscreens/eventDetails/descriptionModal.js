import React, { Component } from "react";
import {  Text,  Icon} from "native-base";
//import GState from "../../../../../stores/globalState";
import { View,ScrollView,Linking, } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import Modal from 'react-native-modalbox';
import colorList from '../../colorList';
import Creator from "../reminds/Creator";
import QRDisplayer from "../QR/QRCodeDisplayer";
import Hyperlink from 'react-native-hyperlink';

export default class DescriptionModal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }




  render() {
    return (

      <Modal
        isOpen={this.props.isOpen}
        onClosed={this.props.onClosed}
        style={{
          height: 290, borderRadius: 20,
          backgroundColor:colorList.bodyBackground, borderColor:'black', width: "80%", flexDirection: 'column', marginRight: "2%"
        }}
        position={'center'}
        //entry={'top'}
        coverScreen={true}
      >
                <View style={{ height: "100%", width: "100%",borderRadius: 20}}>
                  <View style={{
                    height: "70%", width: "100%",padding:"4%",
                    alignSelf: "center",borderRadius: 20,
                    backgroundColor:"mintcream"
                  }}>
                    <View style={{ flexDirection: 'row',justifyContent:"space-between",height:"20%",alignItems:"center" }}><Text style={{fontWeight:"400",color:colorList.bodyText}}>Activity description</Text>
                      {this.props.parent.props.computedMaster ? <Icon name={"pencil"} type={"EvilIcons"} onPress={() => {
                        this.props.parent.setState({ EventDescriptionState: true})
                      }}></Icon> : null}</View>
                   
                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                      <View style={{height:"80%"}}>
                        {this.props.Event.about.description != "" ?
                          <Hyperlink onPress={(url) => { Linking.openURL(url) }} linkStyle={{ color: '#48d1cc', fontSize: 16 }}>
                            <Text dataDetectorType={'all'} style={{ fontSize: 16, fontWeight: "400", margin: "1%", color: '#555756' }} delayLongPress={800}>{this.props.Event.about.description}</Text>
                          </Hyperlink> :
                          <Text style={{
                            fontWeight: "400", fontSize: 25,
                            alignSelf: 'center', marginTop: (colorList.containerHeight) / 8
                          }}
                            delayLongPress={800}>Here you can put </Text>}
                      </View>
                    </ScrollView>

                  </View>
               
               <View style={{height:"30%",flexDirection:"row",justifyContent:"space-between",marginLeft:"2%",marginRight:"2%"}}>
                 <View style={{ flexDirection: 'row', justifyContent: "center", marginTop: 'auto', marginBottom: 'auto' }}>
                  <QRDisplayer code={this.props.Event.id} title={this.props.Event.about.title}></QRDisplayer>
                 </View>
                 <View style={{marginTop:"22%"}}>
                   <Creator color={colorList.bodyBackground} creator={this.props.Event.creator_phone}
                    created_at={this.props.Event.created_at} />
                  </View>
                </View>

                </View>

      </Modal>


    );
  }
}
