import React, { Component } from "react";
import { View, BackHandler, TouchableOpacity, Text } from 'react-native';
import stores from '../../../stores';
import BleashupTimeLine from '../../BleashupTimeLine';
import moment from "moment";
import emitter from '../../../services/eventEmiter';
import testForURL from '../../../services/testForURL';
import shadower from "../../shadower";
import TasksCreation from "../reminds/TasksCreation";
import GState from '../../../stores/globalState/index';
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import colorList from '../../colorList';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import message_types from '../eventChat/message_types';
import Texts from '../../../meta/text';
import Searcher from "../Contacts/Searcher";
import BeComponent from '../../BeComponent';
import globalFunctions from '../../globalFunctions';
import BePureComponent from '../../BePureComponent';
import { search, computeSearch, startSearching, cancelSearch, finish, pushSearchDown, pushSearchUp } from '../eventChat/searchServices';
import searchToolsParts from '../eventChat/searchToolsPart';

export default class ChangeLogs extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      newThing: false,
      loaded: false,
      searchString: this.props.activeMember ? stores.TemporalUsersStore.Users[this.props.activeMember].nickname : "",
      currentSearchIndex: -1,
      foundIndex: -1,
      searchResult: [],
      hideHeader: false
    }
    this.search = search.bind(this)
    this.filterFunc = globalFunctions.filterHistory
    this.computeSearch = computeSearch.bind(this)
    this.startSearching = startSearching.bind(this)
    this.cancelSearch = cancelSearch.bind(this)
    this.finish = finish.bind(this)
    this.pushDown = pushSearchDown.bind(this)
    this.pushUp = pushSearchUp.bind(this)
    this.searchToolsParts = searchToolsParts.bind(this)
  }
  state = {}
  changes = []
  /*shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.newThing !== nextState.newThing ||
      this.props.isMe !== nextProps.isMe ||
      this.state.searching !== nextState.searching ||
      this.state.searchString !== nextState.searchString ||
      this.state.loaded !== nextState.loaded ||
      this.props.activeMember !== nextProps.activeMember
  }*/
  componentMounting() {
    emitter.on('refresh-history', () => {
      this.setStatePure({
        newThing: !this.state.newThing,
      })
    })
  }
  unmountingComponent() {
    emitter.off('refresh-history')
  }
  componentDidMount() {
    setTimeout(() => {
      this.setStatePure({
        newThing: !this.state.newThing,
        loaded: true
      })
      if(this.props.activeMember){
        this.setStatePure({
          searching:true,
        })
        this.search(stores.TemporalUsersStore.Users[this.props.activeMember].nickname)
      }
    })
  }

  renderDetail(item, sectionID, rowID) {
    return (<View><Text>{item.changed}</Text></View>)
  }
  scrollToIndex(index){
    this.refs.timeline && this.refs.timeline.scrollToIndex(index)
  }
  render() {
    this.data = (stores.ChangeLogs.changes &&
      stores.ChangeLogs.changes[this.props.event_id])||[]
    return (!this.state.loaded ? <View style={{
      width: '100%', height: '100%',
      backgroundColor: colorList.bodyBackground,
    }}></View> :

      <View style={{ height: "100%", width: "100%" }}>

        <View style={{ flex: 1, width: "100%" }} >
          <BleashupTimeLine
            ref={"timeline"}
            searchString={this.state.searchString}
            foundIndex={this.state.foundIndex}
            index={this.props.index}
            renderCircle={() => <View></View>}
            circleSize={20}
            showPhoto={url => this.props.openPhoto(url)}
            master={this.props.master}
            mention={(data) => this.props.mention(data)}
            restore={(data) => this.props.restore(data)}
            circleColor='white'
            lineColor={colorList.indicatorColor}
            timeContainerStyle={{ minWidth: 52, backgroundColor: colorList.bodyBackground, opacity: .8 }}
            timeStyle={{
              marginLeft: "4%",
              textAlign: 'center',
              backgroundColor: colorList.bodyBackground,
              padding: 4,
              borderRadius: 6,
              color: colorList.bodyIcon,
              //borderWidth: .7,
              //borderColor: "#1FABAB",
            }}
            descriptionStyle={{ color: colorList.bodyText }}
            onEventPress={(data) => {
              !GState.showingProfile ? this.props.propcessAndFoward(data) : null
            }}
            data={this.data}
          >
          </BleashupTimeLine>
        </View>

        {this.state.hideHeader ? null :
          <View style={{ 
          height: colorList.headerHeight, 
          width: "100%", 
          backgroundColor: colorList.headerBackground, 
          position: "absolute" 
        }}>
            <View style={{
              flex: 1, 
              ...bleashupHeaderStyle, 
              paddingLeft: '1%', 
              paddingRight: '1%', 
              backgroundColor: colorList.headerBackground,
              justifyContent: 'space-between',
              flexDirection: "row", 
              alignItems: "center"
            }}>
              <View style={{ width: "10%", paddingLeft: "1%" }} >
                <TouchableOpacity onPress={() => requestAnimationFrame(this.props.goback)} >
                  <MaterialIcons
                    style={{ ...GState.defaultIconSize, color: colorList.headerIcon }}
                    name={"arrow-back"}>
                  </MaterialIcons>
                </TouchableOpacity>
              </View>
              {!this.state.searching ? <View style={{ width: '70%', paddingLeft: '2%', justifyContent: "center" }}>
                <Text style={{
                  color: colorList.headerText,
                  fontSize: colorList.headerFontSize,
                  fontWeight: colorList.headerFontweight,
                  alignSelf: 'flex-start'
                }}>{Texts.history}</Text>
              </View> : null}

              <View style={{
                paddingLeft: '1%',
                marginRight: "2%",
                height: 35, width: this.state.searching ? "67%" : 35
              }}>
                <Searcher
                  searching={this.state.searching}
                  startSearching={this.startSearching}
                  cancelSearch={this.cancelSearch}
                  search={this.search}
                  searchString={this.state.searchString}
                >
                </Searcher>
              </View>
              {this.state.searching && this.state.searchResult && this.state.searchResult.length > 0?this.searchToolsParts():null}
            </View>
          </View>}

      </View>
    )
  }
}
