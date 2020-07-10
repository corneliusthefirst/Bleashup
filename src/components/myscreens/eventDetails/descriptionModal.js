import React, { Component } from "react";
import { Text, Icon } from "native-base";
//import GState from "../../../../../stores/globalState";
import { View, ScrollView, Linking, TouchableOpacity } from "react-native"
import Modal from 'react-native-modalbox';
import colorList from '../../colorList';
import Creator from "../reminds/Creator";
import QRDisplayer from "../QR/QRCodeDisplayer";
import Hyperlink from 'react-native-hyperlink';
import BleashupModal from '../../mainComponents/BleashupModal';

export default class DescriptionModal extends BleashupModal {
  
  onClosedModal = () => {
    this.props.onClosed();
  }

  backButtonClose = false
  swipeToClose = false
  position = 'center'
  modalWidth = '80%'
  modalHeight = 290
  borderRadius = 20
  borderTopLeftRadius = 20
  borderTopRightRadius = 20

  modalBody() {
    return (
      <View style={{ height: "100%", width: "100%", borderRadius: 20, flexDirection: 'column' }}>
        <View style={{
          height: "70%", width: "100%", padding: "4%",
          alignSelf: "center", borderRadius: 20,
          backgroundColor: "mintcream"
        }}>
          <View style={{ flexDirection: 'row', justifyContent: "space-between", height: "20%", alignItems: "center" }}><Text style={{ fontWeight: "500", color: colorList.bodyText }}>@Activity description</Text>
            {this.props.parent.props.computedMaster ? <TouchableOpacity onPress={() => requestAnimationFrame(() => {
              this.props.parent.setStatePure({ EventDescriptionState: true })
            })}><Icon name={"pencil"} type={"EvilIcons"}></Icon></TouchableOpacity> : null}</View>

          <ScrollView keyboardShouldPersistTaps={"handled"}
            nestedScrollEnabled showsVerticalScrollIndicator={false}>
            <View style={{ height: "80%" }}>
              {this.props.Event.about.description != "" ?
                <Hyperlink onPress={(url) => { Linking.openURL(url) }} linkStyle={{ color: '#48d1cc', fontSize: 16 }}>
                  <Text dataDetectorType={'all'} style={{ fontSize: 16, fontWeight: "400", margin: "1%", color: '#555756' }} delayLongPress={800}>{this.props.Event.about.description}</Text>
                </Hyperlink> :
                <Text style={{
                  fontWeight: "400", fontSize: 17,
                  alignSelf: 'center',
                }}
                  note>@Area allocated  for activity description where you can give some info,conditions or talk about the activity essence  </Text>}
            </View>
          </ScrollView>

        </View>

        <View style={{ height: "30%", flexDirection: "row", justifyContent: "space-between", marginLeft: "2%", marginRight: "2%" }}>
          <View style={{ flexDirection: 'row', justifyContent: "center", marginTop: 'auto', marginBottom: 'auto' }}>
            <QRDisplayer code={this.props.Event.id} title={this.props.Event.about.title}></QRDisplayer>
          </View>
          <View style={{ marginTop: "22%", width: '5%' }}>
            <Creator color={colorList.bodyBackground} creator={this.props.Event.creator_phone}
              created_at={this.props.Event.created_at} />
          </View>
        </View>

      </View>
    )
  }

}

