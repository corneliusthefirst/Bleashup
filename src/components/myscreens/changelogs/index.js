import React, { Component } from "react";
import { View, BackHandler } from 'react-native';
import {
  Icon,
  Text,
  Spinner,
  Title
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
import colorList from '../../colorList';

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
      })
    })
  }

  /*
  @autobind goBack() {
    this.props.navigation.goBack()
  }*/

  renderDetail(item, sectionID, rowID) {
    return (<View><Text>{item.changed}</Text></View>)
  }

  render() {
    //console.warn(this.props.forMember, "poo")
    return (!this.state.loaded ? <View style={{
      width: '100%', height: '100%',
      backgroundColor: colorList.bodyBackground,
    }}></View> :

      <View style={{ height: "100%", width: "100%" }}>

        <View style={{ flex: 1, width: "100%" }} >
          <BleashupTimeLine
            circleSize={20}
            showPhoto={url => this.props.openPhoto(url)}
            master={this.props.master}
            mention={(data) => this.props.mention(data)}
            restore={(data) => this.props.restore(data)}
            circleColor='white'
            lineColor='#1FABAB'
            timeContainerStyle={{ minWidth: 52, backgroundColor: colorList.bodyBackground, opacity: .8 }}
            timeStyle={{
              marginLeft: "4%",
              textAlign: 'center',
              backgroundColor: colorList.bodyBackground,
              padding: 4,
              borderRadius: 6,
              color: "#1FABAB",
              //borderWidth: .7,
              //borderColor: "#1FABAB",
            }}
            descriptionStyle={{ color: colorList.bodyText }}
            onEventPress={(data) => {
              !GState.showingProfile ? this.props.propcessAndFoward(data) : null
            }}
            data={this.props.activeMember && this.props.activeMember !== null ?
              this.changes.filter(ele => ele && ele.updater === this.props.activeMember ||
                ele && ele.updater && ele.updater.phone === this.props.activeMember ||
                ele.type === "date_separator") : this.changes}
          >
          </BleashupTimeLine>
        </View>

        {this.state.hideHeader ? null :
          <View style={{ height: colorList.headerHeight, width: colorList.headerWidth, backgroundColor: colorList.headerBackground, position: "absolute" }}>
            <View style={{
              flex: 1, ...bleashupHeaderStyle, paddingLeft: '1%', paddingRight: '1%', backgroundColor: colorList.headerBackground,
              flexDirection: "row", alignItems: "center"
            }}>
              <View style={{ width: "10%", paddingLeft: "1%" }} >
                <Icon onPress={this.props.goback}
                  style={{ color: colorList.headerIcon }} type={"MaterialIcons"} name={"arrow-back"}></Icon>
              </View>
              <View style={{ width: '70%', paddingLeft: '2%', justifyContent: "center" }}>
                <Title style={{ color: colorList.headerText, fontSize: colorList.headerFontSize, fontWeight: colorList.headerFontweight, alignSelf: 'flex-start' }}>{"History"}</Title>
              </View>

              <View style={{ width: '10%', paddingRight: '3%' }}>
                <Icon
                  name={"gear"} type="EvilIcons" style={{ color: colorList.headerIcon, alignSelf: 'center', }} />
              </View>

              <View style={{ width: '10%', paddingLeft: '1%', }}>
                <Icon onPress={() => {
                  this.props.openMenu()
                }} style={{ color: colorList.headerIcon }} type={"Ionicons"} name={"ios-menu"}></Icon>
              </View>

            </View>
          </View>}

      </View>
    )
  }
}
