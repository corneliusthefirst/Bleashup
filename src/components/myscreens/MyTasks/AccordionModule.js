/* eslint-disable react-native/no-inline-styles */
import { Accordion, Icon, Text } from "native-base";
import React, { Component } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import ActivityProfile from "../currentevents/components/ActivityProfile";
import stores from "../../../stores/index";
import Remind from "../reminds";
import { find } from "lodash";
import moment from "moment";

let { height, width } = Dimensions.get('window');

export default class AccordionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      working: false,
    };
  }

  componentDidMount() {
    console.warn("here we are", this.props.dataArray);
  }

  user = stores.LoginStore.user;
  computedMaster = false;
  member = false;
  master = false;

  initializeMaster = (event) => {
    let member = find(event.participant, { phone: this.user.phone });
    this.member = member ? true : false;
  };

  _renderHeader(item, expanded) {
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 6,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ActivityProfile Event={item} joint={true} />

        <View style={{ width: 30 }}>
          {expanded ? (
            <Icon style={{ fontSize: 18 }} type="AntDesign" name="up" />
          ) : (
            <Icon style={{ fontSize: 18 }} type="AntDesign" name="down" />
          )}
        </View>
      </View>
    );
  }
  _renderContent = (item) => {
    console.warn("item is", item);
    return (
      <View style={{ height: item.reminds.length > 0 ? 400 : 0 }}>

          <Remind
            share={{
              id: "456322",
              date: moment().format(),
              sharer: stores.LoginStore.user.phone,
              item_id: "a7f976f0-8cd8-11ea-9234-ebf9c3b94af7",
              event_id: item.id,
            }}
            startLoader={() => {
              this.setState({
                working: true,
              });
            }}
            stopLoader={() => {
              this.setState({
                working: false,
              });
            }}
            openMenu={() => this.openMenu()}
            clearCurrentMembers={() => {
              this.setState({ currentRemindMembers: null });
            }}
            mention={(Item) => this.mention(Item)}
            master={false}
            computedMaster={false}
            working={false}
            event={item}
            event_id={item.id}
            removeHeader
          />
      
      </View>
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Accordion
          dataArray={this.props.dataArray}
          animation={true}
          expanded={true}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
        />
      </View>
    );
  }
}
