/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import {
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Container,
  Icon,
  Header,
  Form,
  Item,
  Title,
  Spinner,
  Button,
  Thumbnail,
  Alert,
  Textarea,
  List,
  ListItem,
  Label,
} from "native-base";

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions,
  LayoutAnimation,
} from "react-native";
import Modal from "react-native-modalbox";
import autobind from "autobind-decorator";
import CacheImages from "../../CacheImages";
import PhotoEnlargeModal from "../invitations/components/PhotoEnlargeModal";
import stores from "../../../stores/index";
import { observer } from "mobx-react";
import BleashupFlatList from "../../BleashupFlatList";
import CreateEvent from "../event/createEvent/CreateEvent";
import LocalTasksCreation from "./localTasksCreation";
import { find, findIndex, uniqBy, reject, filter } from "lodash";
import ColorList from "../../colorList";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import AccordionComponent from "./AccordionModule";
//const MyTasksData = stores.Reminds.MyTasksData

const dataArray = [
  { title: "First Element", content: "Lorem ipsum dolor sit amet" },
  { title: "Second Element", content: "Lorem ipsum dolor sit amet" },
  { title: "Third Element", content: "Lorem ipsum dolor sit amet" },
];

@observer
class MyTasksView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localRemindData: [],
      RemindCreationState: false,
      dataArray: [],
    };
  }

  updateData = (newremind) => {
    //console.warn("come back value",newremind)
    this.setState({
      localRemindData: [...this.state.localRemindData, newremind],
    });
  };

  componentDidMount() {
    stores.Events.readFromStore().then((events) => {
      events = reject(events, { id: "newEventId" });
      this.setState({ dataArray: events });
    });
  }

  @autobind
  AddRemind() {
    //this.props.navigation.navigate("LocalLocalTasksCreation",{localRemindData:this.state.localRemindData,updateData:this.updateData});
    this.setState({ RemindCreationState: true });
  }

  @autobind
  back() {
    this.props.navigation.navigate("Home");
  }

  _keyExtractor = (item, index) => item.id;

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: ColorList.bodyBackground }}>
        <View style={{ height: "8%" }}>
          <View
            style={{
              height: ColorList.headerHeight,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              ...bleashupHeaderStyle,
            }}
          >
            <View style={{ width: "18%", alignItems: "center" }}>
              <Icon
                name="arrow-back"
                active={true}
                type="MaterialIcons"
                style={{ color: ColorList.headerIcon }}
                onPress={this.back}
              />
            </View>

            <View
              style={{ width: "64%", paddingLeft: "4%", alignItems: "center" }}
            >
              <Text
                style={{
                  fontSize: ColorList.headerFontSize,
                  fontWeight: "bold",
                }}
              >
                Tasks / Reminds
              </Text>
            </View>

            <View style={{ width: "18%", alignItems: "center" }}>
              <TouchableOpacity>
                <Icon
                  type="AntDesign"
                  name="plus"
                  style={{ color: ColorList.headerIcon }}
                  onPress={this.AddRemind}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: "92%" }}>
          <AccordionComponent
            dataArray={this.state.dataArray}
            {...this.props}
          />
        </View>

        <LocalTasksCreation
          isOpen={this.state.RemindCreationState}
          onClosed={() => {
            this.setState({ RemindCreationState: false });
          }}
          parentComp={this}
          localRemindData={this.state.localRemindData}
        />
      </View>
    );
  }
}
export default MyTasksView;

/**     <View style={{height:"92%"}}>
        <BleashupFlatList
          initialRender={5}
          renderPerBatch={5}
          onScroll={this._onScroll}
          firstIndex={0}
          keyExtractor={this._keyExtractor}
          dataSource={this.state.localRemindData}
          renderItem={(item, index) => {
            return (
              <MyTasksCard {...this.props} item={item} key={index} parentCardList={this}>
              </MyTasksCard>
            );
          }}
        >
        </BleashupFlatList >


      </View>

        /*stores.LoginStore.getUser().then((user)=>{
           stores.Reminds.readFromStore().then((Reminds)=>{
           let reminds = filter(Reminds,{event_id:user.phone});
            this.setState({localRemindData:reminds});
         //console.warn("ok",reminds)
      })
 })*/
