import React from "react";

import BeComponent from "../../BeComponent";
import TaskCardminimal from "./TaskCardMinimal";
import { View, Text, Image, ImageBackground,TouchableOpacity } from "react-native";
import ColorList from "../../colorList";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import GState from "../../../stores/globalState";
import Texts from "../../../meta/text";
import BleashupFlatList from "../../BleashupFlatList";
import stores from "../../../stores";
import { observer } from "mobx-react";
import request from "../../../services/requestObjects";
import AnimatedComponent from "../../AnimatedComponent";
import shadower from "../../shadower";
import Searcher from "../Contacts/Searcher";
import {
  startSearching,
  cancelSearch,
  justSearch,
} from "../eventChat/searchServices";
import globalFunctions from "../../globalFunctions";
import BeNavigator from "../../../services/navigationServices";
import CreateRemind from "../event/createEvent/CreateRemind";
import { _onScroll } from "../currentevents/components/sideButtonService";
import SelectActivityToCreateRemind from "./SelectActivityToCreateRemind";
import Spinner from "../../Spinner";
import RemindMembers from "./RemindMembers";
import EvilIcons  from 'react-native-vector-icons/EvilIcons';

@observer
class AllReminds extends AnimatedComponent {
  initialize() {
    this.state = {
      mounted: false,
      newing: false,
      isActionButtonVisible: true,
    };
    this.renderItem = this.renderItem.bind(this);
    this.search = justSearch.bind(this);
    this.startSearching = startSearching.bind(this);
    this.cancelSearch = cancelSearch.bind(this);
    this.onScroll = _onScroll.bind(this);
    this.startAnim = this.startAnim.bind(this);
    this.createRemind = this.createRemind.bind(this);
    this.hideNewRemindModal = this.hideNewRemindModal.bind(this);
    this.settings = this.settings.bind(this)
  }
  getItemLayout(item, index) {
    return { length: 80, offset: index * 80, index };
  }
  keyExtractor(item, index) {
    return item && item.id && item.id !== request.Remind().id ? item.id : index;
  }
  startAnim() {
    //if(this.animeTimeOut) clearTimeout(this.animeTimeOut)
    // this.animeTimeOut = setTimeout(() => {
    this.animateUI();
    //    clearTimeout(this.animeTimeOut)
    //    this.animeTimeOut = null
    //},10)
  }
  cleanStates(){
    stores.States.removeNewReminds()
  }
  componentDidMount() {
    setTimeout(() => {
      this.setStatePure({
        mounted: true,
      },() => {
        setTimeout(()=> {
            this.canClean = true
        },2000)
      });
    });
  }
  createRemind() {
    this.setStatePure({
      isNewRemindModalOpened: true,
    });
  }
  hideNewRemindModal() {
    this.setStatePure({
      isNewRemindModalOpened: false,
    });
  }
  goToRemindDetail(item) {
    BeNavigator.goToRemindDetail(item.id, item.event_id);
  }
  renderItem(item, index) {
    return item && item.id && item.id !== request.Remind().id ? (
      <TaskCardminimal
        goToRemindDetail={() => this.goToRemindDetail(item)}
        searchString={this.state.searchString}
        animate={this.startAnim}
        item={{ ...item, description: null, remind_url: null }}
      />
    ) : null;
  }
  settings(){
    BeNavigator.navigateTo("Profile");
  }
  render() {
    GState.setBeroute(this.props.navigation)
    this.data = stores.Reminds.allReminds.filter((ele) =>
      globalFunctions.filterReminds({...ele,description:null}, this.state.searchString || "")
    );
    
    return (
      <ImageBackground
        source={GState.backgroundImage}
        style={GState.imageBackgroundContainer}
      >
        <View
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <View
            style={{
              height: ColorList.headerHeight,
              backgroundColor: ColorList.bodyBackground,
              width: ColorList.containerWidth,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: "2%",
              ...shadower(5),
            }}
          >
            {!this.state.searching ? (
              <Image
                source={GState.bleashupImage}
                style={{
                  marginLeft: 5,
                  width: 100,
                  height: 50,
                }}
              ></Image>
            ) : null}
            <View style={{
              flexDirection:'row',
              alignItems: 'center',
            }}>
              {!this.state.searching ? <View style={{
                marginRight: 10
              }}><TouchableOpacity
                style={{ 
                  alignSelf: 'center',
                 }}
                onPress={this.settings}
              >
                  <EvilIcons
                    name="gear"
                    style={{ 
                      ...GState.defaultIconSize
                     }}
                    onPress={this.settings}
                  />
                </TouchableOpacity></View> : null}
              <View
                style={{
                  flex: this.state.searching ? 1 : null,
                  width: this.state.searching ? null : 35,
                  height: 35,
                }}
              >
                <Searcher
                  search={this.search}
                  startSearching={this.startSearching}
                  cancelSearch={this.cancelSearch}
                  searching={this.state.searching}
                  searchString={this.searchString}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              minHeight: "90%",
              flex: 1,
            }}
          >
            {this.state.mounted ? (
              <BleashupFlatList
                backgroundColor={ColorList.transparent}
                onScroll={this.onScroll}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                getItemLayout={this.getItemLayout}
                renderPerBatch={20}
                initialRender={20}
                dataSource={this.data}
                numberOfItems={this.data.length}
              ></BleashupFlatList>
            ) : (
              <Spinner big color={ColorList.bodyBackground}></Spinner>
            )}
          </View>
        </View>
        {this.state.isActionButtonVisible ? (
          <CreateRemind createRemind={this.createRemind}></CreateRemind>
        ) : null}
        {this.state.isNewRemindModalOpened ? (
          <SelectActivityToCreateRemind
            isOpen={this.state.isNewRemindModalOpened}
            onClosed={this.hideNewRemindModal}
          ></SelectActivityToCreateRemind>
        ) : null}
      </ImageBackground>
    );
  }
}
export default AllReminds;
