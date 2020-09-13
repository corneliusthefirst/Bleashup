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

export default class ChangeLogs extends BePureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newThing: false,
      loaded: false,
      searchString: "",
      hideHeader: false
    }
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
    })
  }

  renderDetail(item, sectionID, rowID) {
    return (<View><Text>{item.changed}</Text></View>)
  }
  startSearching() {
    this.setStatePure({
      searching: true
    })
  }
  search(text) {
    this.setStatePure({
      searchString: text
    })
  }
  cancleSearch() {
    this.setStatePure({
      searching: false,
      searchString: ""
    })
  }
  render() {
    let data = this.props.activeMember ?
      stores.ChangeLogs.changes &&
      stores.ChangeLogs.changes[this.props.event_id] &&
      stores.ChangeLogs.changes[this.props.event_id].
        filter(ele => ele && ele.updater === this.props.activeMember ||
          ele && ele.updater && ele.updater.phone === this.props.activeMember ||
          ele.type === message_types.date_separator) :
      (stores.ChangeLogs.changes && stores.ChangeLogs.changes[this.props.event_id] || []).filter(ele => 
        globalFunctions.filterHistory(ele,this.state.searchString||""))
    return (!this.state.loaded ? <View style={{
      width: '100%', height: '100%',
      backgroundColor: colorList.bodyBackground,
    }}></View> :

      <View style={{ height: "100%", width: "100%" }}>

        <View style={{ flex: 1, width: "100%" }} >
          <BleashupTimeLine
            searchString={this.state.searchString}
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
            data={data}
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

              {!this.state.searching ? <View style={{ width: '10%', paddingRight: '3%' }}>
                <TouchableOpacity>
                  <EvilIcons
                    name={"gear"}
                    style={{
                      ...GState.defaultIconSize,
                      color: colorList.headerIcon,
                      alignSelf: 'flex-end',
                    }} />
                </TouchableOpacity>
              </View> : null}

              <View style={{
                paddingLeft: '1%',
                marginRight: "2%",
                height: 35, width: this.state.searching ? "90%" : 35
              }}>
                <Searcher
                  searching={this.state.searching}
                  startSearching={this.startSearching.bind(this)}
                  cancelSearch={this.cancleSearch.bind(this)}
                  search={this.search.bind(this)}
                  searchString={this.state.searchString}
                >
                </Searcher>
              </View>

            </View>
          </View>}

      </View>
    )
  }
}
