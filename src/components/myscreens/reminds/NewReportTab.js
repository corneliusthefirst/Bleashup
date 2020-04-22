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
} from "native-base";
import { map } from "lodash";
import Modal from "react-native-modalbox";
import shadower from "../../shadower";
import ConcerneeList from "./ConcerneeList";
import DonnersList from "./DonnersList";
import TabModal from "../../mainComponents/TabModal";
const screenheight = Math.round(Dimensions.get("window").height);
export default class ReportTabModal extends TabModal {
  initialize() {
    this.state = {
      content: null,
      complexReport: false,
      mounted: false,
    };
  }
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
  TabHeader() {
    return null
  }
  tabs = [
    {
      heading: () => <Text>Members</Text>,
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
      heading: () => <Text>Done</Text>,
      body: () => (
        <View style={{ height: "100%" }}>
          <DonnersList
            donners={this.props.donners}
            master={this.props.master}
            actualInterval={this.props.actualInterval}
            confirm={(e) => this.props.confirm(e)}
            must_report={this.props.must_report}
          ></DonnersList>
        </View>
      ),
    },
    {
      heading: () => <Text>Confirmed</Text>,
      body: () => (
        <View style={{ height: "100%" }}>
          <ConcerneeList
            master={this.props.master}
            contacts={this.props.confirmed}
            complexReport={true}
            must_report={this.props.must_report}
            actualInterval={this.props.actualInterval}
          ></ConcerneeList>
        </View>
      ),
    },
  ];
}
