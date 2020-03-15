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
import shadower from "../../shadower";
import TasksCreation from "../reminds/TasksCreation";
import GState from '../../../stores/globalState/index';
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";

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
      this.state.loaded !== nextState.loade ||
      this.props.activeMember !== nextProps.activeMember
  }
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this))
    emitter.on('refresh-history', () => {
      this.setState({ loaded: false })
      stores.ChangeLogs.fetchchanges(this.props.event_id).then(changes => {
        this.changes = changes
        setTimeout(() => {
          this.setState({
            newThing: !this.state.newThing,
            loaded: true
          })
        }, 200)
      })
    })
  }
  handleBackButton() {

  }
  componentWillUnmount() {
    emitter.off('refresh-history')
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  componentDidMount() {
    stores.ChangeLogs.fetchchanges(this.props.event_id).then(changes => {
      this.changes = changes
      setTimeout(() => {
        this.setState({
          newThing: !this.state.newThing,
          loaded: true
        })
      }, 200)
    })
  }
  @autobind goBack() {
    this.props.navigation.goBack()
  }

  renderDetail(item, sectionID, rowID) {
    return (<View><Text>{item.changed}</Text></View>)
  }
  render() {
    //console.warn(this.props.forMember, "poo")
    return (!this.state.loaded ? <View style={{width:'100%',height:'100%',
    backgroundColor: '#FEFFDE',}}><Spinner size={"small"}></Spinner></View>: <View style={{ width: "100%", height: "100%", backgroundColor: "#FEFFDE", }}>
      <View style={{ flex: 1, height: "95%", top: 0, bottom: 0, left: 0, right: 0 }}>
        <BleashupTimeLine
          circleSize={20}
          showPhoto={url => this.props.openPhoto(url)}
          master={this.props.master}
          mention={(data) => this.props.mention(data)}
          restore={(data) => this.props.restore(data)}
          circleColor='rgb(45,156,219)'
          lineColor='#1FABAB'
          timeContainerStyle={{ minWidth: 52, marginTop: -5, backgroundColor: '#FEFFDE', opacity: .8 }}
          timeStyle={{
            marginLeft: "4%",
            textAlign: 'center',
            backgroundColor: '#FEFFDE',
            padding: 4,
            borderRadius: 6,
            color: "#1FABAB",
            //borderWidth: .7,
            //borderColor: "#1FABAB",
          }}
          descriptionStyle={{ color: 'gray' }}
          onEventPress={(data) => {
            !GState.showingProfile ? this.props.propcessAndFoward(data) : null
          }}
          data={this.props.activeMember && this.props.activeMember !== null ?
            this.changes.filter(ele => ele.updater.phone === this.props.activeMember ||
              ele.type === "date_separator") : this.changes}
        >
        </BleashupTimeLine>
      </View>
      {this.state.hideHeader ? null : <View style={{
        width: "100%", height: 44, position: "absolute",
      }}>
        <View style={{
          flexDirection: 'row', ...bleashupHeaderStyle, 
         
        }}>
          <View style={{ margin: '1%', width: "85%" }}>
            <Text style={{
              fontWeight: 'bold', fontSize: 20,
            }}>{(this.props.forMember ? this.props.forMember :
              (this.props.isMe ? "Your " : "")) + " Activity Logs"}</Text>
          </View>
          <View style={{  width: '15%',backgroundColor: 'transparent', }}>
            <Icon style={{
              color: '#0A91A84',
              alignSelf: 'center'
            }} name={"gear"} type="EvilIcons"></Icon>
          </View>
        </View>
      </View>}
    </View>
    )
  }
}
