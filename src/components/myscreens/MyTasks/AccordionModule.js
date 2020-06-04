import { Accordion, Icon, Text, View } from "native-base";
import React, { Component } from "react";
import ActivityProfile from "../currentevents/components/ActivityProfile";
import stores from "../../../stores/index";
import Remind from "../reminds";
import { find } from "lodash";
import moment from "moment";

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
    this.master =
      (member && member.master) || this.event.creator_phone === this.user.phone;
    this.computedMaster =
      event.who_can_update === "master"
        ? this.master
        : event.who_can_update === "creator"
        ? event.creator_phone === this.user.phone
        : true;
    this.member = member ? true : false;
    this.setState({ working: false });
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
    /*stores.Reminds.loadReminds(item.id, true).then((reminds) => {
      console.warn('reminds are', reminds);
    });*/
    //this.initializeMaster(item);
    return (
      <Remind
        //shared={false}
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
        //goback={this.props.goback()}
        //currentMembers={item.participant}
        mention={(Item) => this.mention(Item)}
        master={this.master}
        computedMaster={this.computedMaster}
        working={this.state.working}
        event={item}
        event_id={item.id}
        removeHeader
      />
    );
  };
  render() {
    return (
      <View style={{ backgroundColor: "white", flex: 1, padding: 5 }}>
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
