import React, { Component } from "react";
import { View, BackHandler } from 'react-native';
import {
  Icon,
  Text,
  Spinner
} from 'native-base';
import autobind from "autobind-decorator";
import { TouchableOpacity } from "react-native-gesture-handler";
import stores from '../../../stores';
import { findIndex } from "lodash";
import BleashupTimeLine from '../../BleashupTimeLine';
import moment from "moment";
import emitter from '../../../services/eventEmiter';
import testForURL from '../../../services/testForURL';

export default class ChangeLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newThing: false,
      loaded: false,
      hideHeader: false
    }
  }
  state = {}
  changes = []
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.newThing !== nextState.newThing ||
      this.props.isMe !== nextProps.isMe ||
      this.state.loaded !== nextState.loade||
      this.props.activeMember !== nextProps.activeMember 
      }
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this))
    emitter.on('refresh-history', () => {
      this.setState({ loaded: false })
      stores.ChangeLogs.fetchchanges(this.props.event_id).then(changes => {
        this.changes =  changes
        setTimeout(() => {
          this.setState({
            newThing: !this.state.newThing,
            loaded: true
          })
        }, 200)
      })
    })
  }
  handleBackButton(){
    
  }
  componentWillUnmount() {
    emitter.off('refresh-history')
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentDidMount() {
    stores.ChangeLogs.fetchchanges(this.props.event_id).then(changes => {
      this.changes =  changes
      setTimeout(() => {
        this.setState({
          newThing: !this.state.newThing,
          loaded: true
        })
      }, 200)
    })
  }

  propcessAndFoward(change) {
    if (Array.isArray(change.new_value.new_value) && change.new_value.new_value[0] && change.new_value.new_value[0].phone) {
      this.props.showMembers(change.new_value.new_value)
    } else if (Array.isArray(change.new_value.new_value) && change.new_value.new_value[0] && change.new_value.new_value[0].includes("00")) {
      console.warn("showing contacts")
      this.props.showContacts(change.new_value.new_value)
    } else if(typeof change.new_value.new_value === "string" && testForURL(change.new_value.new_value)){
      this.props.openPhoto(change.new_value.new_value)
    }
    else if (typeof change.new_value.new_value === "string" || 
    (Array.isArray(change.new_value.new_value) && typeof change.new_value.new_value[0] === "string") ||
    typeof change.new_value.new_value === 'object') {
      this.props.showContent(change.new_value.new_value)
    } else {

    }
  }
  @autobind goBack() {
    this.props.navigation.goBack()
  }

  renderDetail(item, sectionID, rowID) {
    return (<View><Text>{item.changed}</Text></View>)
  }
  render() {
    console.warn(this.props.forMember,"poo")
    return (!this.state.loaded ? <Spinner size={"small"}></Spinner> : <View style={{ width: "100%", height: "100%", backgroundColor: "#FEFFDE", }}>
      <View style={{ flex: 1, height: "95%", top: 0, bottom: 0, left: 0, right: 0 }}>
        <BleashupTimeLine
          circleSize={20}
          circleColor='rgb(45,156,219)'
          lineColor='#1FABAB'
          timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
          timeStyle={{
            marginLeft: "4%",
            textAlign: 'center',
            backgroundColor: '#FEFFDE',
            color: 'white', padding: 5,
            borderRadius: 6,
            color: "#1FABAB",
            borderWidth: .7,
            borderColor: "#1FABAB",
          }}
          descriptionStyle={{ color: 'gray' }}
          onEventPress={(data) => {
            this.propcessAndFoward(data)
          }}
          data={this.props.activeMember && this.props.activeMember !== null ? 
            this.changes.filter(ele => ele.updater.phone === this.props.activeMember ||
             ele.type === "date_separator") : this.changes}
        >
        </BleashupTimeLine>
      </View>
      {this.state.hideHeader ? null : <View style={{
        width: "100%", height: 44, position: "absolute", opacity: .6 ,
        backgroundColor: "#FEFFDE", shadowOpacity: 1,
        shadowOffset: {
          height: 1,
        },
        shadowRadius: 10, elevation: 6,
      }}>
        <View style={{ flexDirection: 'row', width: "100%", }}>
          <Text style={{ alignSelf: 'flex-start', margin: '3%', fontWeight: 'bold', fontSize: 20, width: "83%" }}>{(this.props.isMe ? "Your " : "" )+ "Activities Logs"}</Text>
          <Icon style={{ alignSelf: 'flex-end', margin: '3%', }} name={"dots-three-vertical"} type="Entypo"></Icon>
        </View>
      </View>}
    </View>
    )
  }
}
