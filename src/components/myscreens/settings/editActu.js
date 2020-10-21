/* eslint-disable prettier/prettier */
import React, { Component } from "react";

import { Button, View, Dimensions, TouchableWithoutFeedback, Image, ScrollView, Text } from "react-native";
import stores from "../../../stores";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import EditUserModal from "./editUserModal";
import shadower from "../../../components/shadower";
import BleashupFlatList from '../../BleashupFlatList';
import { filter, map, find } from "lodash";
import ColorList from '../../colorList';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GState from "../../../stores/globalState";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Texts from '../../../meta/text';
import TextContent from '../eventChat/TextContent';


let { height, width } = Dimensions.get('window');
export default class ActuView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMount: false,
      userInfo: null,
      update: false,
      updatetitle: "",
      position: "",
      coverscreen: true,
      data: {}

    }

  }

  init = () => {
    stores.LoginStore.getStatusOptions().then((data) => {
      this.setState({ data: data });
    })
    setTimeout(() => {
      this.setState({ userInfo: this.props.navigation.getParam("userInfo"), isMount: true });
      console.warn(this.state.userInfo)
    }, 50)
  }

  componentDidMount() {
    this.init();
  }

  updateActu = () => {
    this.setState({ updatetitle: Texts.write_your_status })
    this.setState({ position: "bottom" })
    this.setState({ coverscreen: true });
    this.setState({ update: true })
    this.refs.toedit.init();
  }

  updateOptions = (item) => {
    let newdata = this.state.data;
    map(newdata, (o) => { o.id === item.id ? o.state = true : o.state = false });
    this.setState({ data: newdata })
    //console.warn(item.name,item.state,this.state.data);
    stores.LoginStore.updateStatus(item.name).then(() => {
      stores.LoginStore.updateStatusOptions(this.state.data).then(() => {
        this.state.userInfo.status = item.name;
        this.setState({ userInfo: this.state.userInfo });
      })
    });
  }

  edit = () => {
    this.props.navigation.navigate("Profile", { "update": true })
  }

  render() {
    return (

      <View style={{ width: "100%", height: "100%" }}>

        <View style={{ height: ColorList.headerHeight, }}>
          <View style={{
            ...bleashupHeaderStyle,
            height: ColorList.headerHeight
          }}>
            <View style={{ height: "100%", flexDirection: "row", width: width / 3, marginLeft: width / 25, justifyContent: "space-between", alignItems: "center" }}>
              <MaterialIcons name="arrow-back" active={true} type="MaterialIcons" style={{ ...GState.defaultIconSize, color: ColorList.headerIcon, }} onPress={this.edit} />
              <Text style={{ ...GState.defaultTextStyle, fontSize: 18, fontWeight: "bold", marginRight: "30%" }}>{Texts.status}</Text>
            </View>
          </View>
        </View>

        {this.state.isMount ?
          <View style={{ flexDirection: "column", height: height - height / 10, width: "100%", backgroundColor: ColorList.bodyBackground }}>


            <View style={{ width: "100%", justifyContent: "center", flexDirection: "row", flex: 2, marginTop: height / 30 }}>
              <View style={{ width: "90%", flexDirection: "column" }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                  <AntDesign name="infocirlceo" active={true} type="AntDesign" style={{ ...GState.defaultIconSize, color: ColorList.bodyIcon, }} />
                  <Text style={{
                    ...GState.defaultTextStyle,
                    alignSelf: "flex-start", marginLeft: "3%",
                    color: ColorList.bodyTextdark
                  }} note>{Texts.status}</Text>
                </View>

                <View style={{ width: "92%", marginLeft: "12%", flexDirection: "row" }}>
                  <ScrollView style={{ width: "80%", height: height / 8 }} showsVerticalScrollIndicator={false}>
                    <TextContent
                      style={{
                        ...GState.defaultTextStyle, alignSelf: "flex-start",
                        color: this.state.userInfo.status ? "black" : "gray"
                      }}
                    >{this.state.userInfo.status ? this.state.userInfo.status
                      : Texts.no_status_available}
                    </TextContent>
                  </ScrollView>

                  <View style={{ width: "10%", marginLeft: "5%" }}>
                    <MaterialIcons name="edit" 
                    active={true} type="MaterialIcons" 
                    style={{ ...GState.defaultIconSize, color: "gray" }} onPress={this.updateActu} />
                  </View>
                </View>
              </View>
            </View>





            <View style={{ flex: 1 }}>
              <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "flex-start" }}>
                <Text style={{ ...GState.defaultTextStyle, fontSize: 18, fontWeight: "bold", marginLeft: "5%" }}>{Texts.chose_status}</Text>
              </View>
            </View>
            <View style={{ flex: 9 }}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <BleashupFlatList
                  showsVerticalScrollIndicator={false}
                  dataSource={this.state.data}
                  extraData={this.state}
                  initialRender={10}
                  numberOfItems={this.state.data.length}
                  keyExtractor={item => item.id}
                  renderItem={(item, index) => (
                    <View style={{ flexDirection: "row", height: height / 13, width: width, justifyContent: "center" }}>
                      <View style={{ width: 3 * width / 4, justifyContent: "center" }}>
                        <Text style={{ ...GState.defaultTextStyle, fontSize: 18, marginLeft: "6%", alignSelf: "flex-start" }}
                          onPress={() => { this.updateOptions(item) }} >{item.name}</Text>
                      </View>
                      <View style={{ width: width / 4, justifyContent: "center" }}>
                        {item.state == true ? <Ionicons style={{ ...GState.defaultIconSize, fontSize: 25, alignSelf: "flex-end", marginRight: "15%" }} name="md-checkmark" type="Ionicons"></Ionicons> : null}
                      </View>
                    </View>)

                  }

                >
                </BleashupFlatList>
              </View>
            </View>
            <EditUserModal
              ref={"toedit"}
              parent={this}
              data={this.state.data}
              isOpen={this.state.update}
              onClosed={() => { this.setState({ update: false }) }}
              type={this.state.updatetype}
              userInfo={this.state.userInfo}
              title={this.state.updatetitle}
              position={this.state.position}
              coverscreen={this.state.coverscreen}
              maxLength={150} type="actu" />

          </View>
          : null}

      </View>
    )
  }

}