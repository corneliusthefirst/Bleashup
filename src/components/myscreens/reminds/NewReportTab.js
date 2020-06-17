import React, { PureComponent } from "react";
import { View, Dimensions } from "react-native";
import {
  Content,
  Text,
  Item,
  Container,
  Tabs,
  Tab,
  TabHeading,
  Spinner,
  Icon,
} from "native-base";
import { map } from "lodash";
import Modal from "react-native-modalbox";
import shadower from "../../shadower";
import ConcerneeList from "./ConcerneeList";
import DonnersList from "./DonnersList";
import TabModal from "../../mainComponents/TabModal";
import CreationHeader from "../event/createEvent/components/CreationHeader";
import ColorList from '../../colorList';
const screenheight = Math.round(Dimensions.get("window").height);
export default class ReportTabModal extends TabModal {
  initialize() {
    this.state = {
      content: null,
      complexReport: false,
      mounted: false,
    };
  }
  swipeToClose = false
  onClosedModal() {
    this.props.onClosed();
    this.setState({
      content: null,
    });
  }
  onOpenModal() {
    setTimeout(() => {
      this.setState({
        content: this.props.content,
        mounted: true,
      });
      this.props.stopLoader();
    }, 20);
  }
  inialPage=1
  tabs = [{
    heading: () => <Icon
      onPress={this.onClosedModal.bind(this)}
      type="MaterialIcons"
      name="arrow-back"
      style={{ color: ColorList.headerIcon }}
    ></Icon>,
    body: () => null
  },
  {
    heading: () => <Icon name={"ios-people"} type="Ionicons"></Icon>,
    body: () => (
      <View style={{ height: "100%" }}>
        {this.state.mounted ? (
          <ConcerneeList
            contacts={this.props.concernees}
            complexReport={false}
            must_report={this.props.must_report}
            actualInterval={this.props.actualInterval}
          ></ConcerneeList>
        ) : (
            <Spinner size="small"></Spinner>
          )}
      </View>
    ),
  },
  {
    heading: () => <Icon name={"md-checkmark"} type={"Ionicons"} style={{ 
      color:ColorList.indicatorColor
     }}></Icon>,
     tabBarColor:ColorList.indicatorColor,
    body: () => (
      <View style={{ height: "100%" }}>
        <DonnersList
          intervals={this.props.intervals}
          donners={this.props.donners}
          master={this.props.master}
          actualInterval={this.props.actualInterval}
          confirm={this.props.confirm}
          must_report={this.props.must_report}
        ></DonnersList>
      </View>
    ),
  },
  {
    heading: () => <Icon name="check-all" type={"MaterialCommunityIcons"} style={{
      color:ColorList.likeActive
    }}></Icon>,
    tabBarColor:ColorList.likeActive,
    body: () => (
      <View style={{ height: "100%" }}>
        <DonnersList
          cannotReport
          intervals={this.props.intervals}
          master={this.props.master}
          donners={this.props.confirmed}
          must_report={this.props.must_report}
          actualInterval={this.props.actualInterval}
        ></DonnersList>
      </View>
    ),
  },
  ];
}
