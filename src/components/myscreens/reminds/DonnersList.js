import React, { Component } from "react";
import BleashupFlatList from "../../BleashupFlatList";
import IntervalSeparator from "./IntervalSeparator";
import { MenuDivider } from "react-native-material-menu";
import ProfileView from "../invitations/components/ProfileView";
import RemindReportContent from "./ReportModal";
import AccordionModuleNative from "../MyTasks/BleashupAccordion";
import Octicons from "react-native-vector-icons/Octicons";
import { TouchableOpacity, Text, View } from "react-native";
import GState from "../../../stores/globalState";
import ColorList from "../../colorList";
import BeComponent from "../../BeComponent";
import Swipeout from "../eventChat/Swipeout";
import { format } from "../../../services/recurrenceConfigs";
import moment from "moment";
import shadower from "../../shadower";
import Spinner from "../../Spinner";

export default class DonnersList extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }
  concludeScrollForInterval(intervalIndex) {
    this.setStatePure({
      mounted: true,
      intervalIndex
    })
      if (intervalIndex >= 0) {
        intervalIndex && this.scrollToIndex(intervalIndex);
      }
  }
  state = {};
  componentDidMount() {
    let checker = (ele, date) => moment(ele.start, format).format("x") <= date &&
      moment(ele.end, format).format("x") > date
    let actualIntervalIndex = (date) => this.props.intervals.findIndex(
      (ele) => checker(ele, date)
    )
    setTimeout(() => {
      if (this.props.type && this.props.currentRemindUser) {
        let date = moment(this.props.currentRemindUser.status.date).format("x");
        let intervalIndex = actualIntervalIndex(date)
        this.concludeScrollForInterval(intervalIndex);
      } else {
        let date = moment().format("x");
        let intervalIndex = actualIntervalIndex(date);
        this.concludeScrollForInterval(intervalIndex);
      }
    });
  }

  onItemExpand(item) {
    let donners = this.props.donners(item);
    this.setStatePure({
      donners: donners,
    });
      if (this.props.type && this.props.currentRemindUser) {
        let index = donners.findIndex(
          (ele) => ele.phone == this.props.currentRemindUser.phone
        );
        this.scrollToDonnersIndex(index);
      }
  }
  renderHeader(item, index, toggle, expanded, shouldExpand) {
    return (
      <IntervalSeparator
        shouldExpand={shouldExpand}
        onPress={() => toggle()}
        actualInterval={
          this.props.actualInterval &&
          item.start === this.props.actualInterval.start &&
          item.end === this.props.actualInterval.end
        }
        first={index == 0 ? true : false}
        from={item.start}
        to={item.end}
      ></IntervalSeparator>
    );
  }
  keyExtractor = (item) => item.start + "-" + item.end;
  delay = 0;
  renderItems(ParentItem) {
    let donners = this.state.donners || [];
    return (
      <View style={{ width: "100%", maxHeight: 400 }}>
        <BleashupFlatList
          fit
          firstIndex={0}
          ref={"flatlist"}
          renderPerBatch={7}
          initialRender={20}
          numberOfItems={donners.length}
          keyExtractor={(item, index) => item.phone + item.status.date}
          getItemLayout={this.getItemLayoutForFlatList}
          dataSource={donners}  
          renderItem={(item, index) => {
            this.delay = this.delay >= 20 ? 0 : this.delay + 1;
            let isCurrentPointed = index === this.state.index;
            let shouldHighlight = this.props.currentRemindUser &&
              this.props.currentRemindUser.phone == item.phone
            return (
              <View style={{ width: "90%", alignSelf: "center", height: 53 }}>
                <Swipeout
                  swipeRight={() => {
                    this.props.reply &&
                      this.props.reply({ ...item, type: this.props.type });
                  }}
                  disableLeftSwipe={true}
                  onLongPress={() => { }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: isCurrentPointed
                        ? ColorList.remindsTransparent
                        : ColorList.bodyBackground,
                      borderRadius: 15,
                      minHeight: 55,
                      ...shadower(1),
                      paddingHorizontal: "2%",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "70%", alignSelf: "center" }}>
                      <ProfileView
                        showHighlighter={() => shouldHighlight && this.toggleItemHighlight(index)}
                        delay={this.delay}
                        phone={item.phone}
                      ></ProfileView>
                    </View>
                    {!this.props.cannotReport ? (
                      <TouchableOpacity
                        style={{
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => {
                          this.setStatePure({
                            isReportModalOpened: true,
                            interval: ParentItem,
                            currentReport: item.status,
                            currentUser: item,
                          });
                        }}
                        transparent
                      >
                        <Octicons
                          style={{
                            ...GState.defaultIconSize,
                            color: ColorList.indicatorColor,
                          }}
                          type="Octicons"
                          name="report"
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </Swipeout>
              </View>
            );
          }}
        ></BleashupFlatList>
      </View>
    );
  }
  getItemLayout(index) {
    return { length: 70, offset: index * 70, index };
  }
  getItemLayoutForFlatList(item, index) {
    return { length: 70, offset: index * 70, index };
  }
  toggleItemHighlight(index) {
    this.setStatePure({
      index: index,
    });
    setTimeout(() => {
      this.setStatePure({
        index: null,
      });
    }, 2000);
  }
  scrollToDonnersIndex(index) {
    index >= 0 && this.refs.flatlist && this.refs.flatlist.scrollToIndex(index);
  }
  expandItem(item) {
    this.refs.accordion && this.refs.accordion.toggleExpand(item);
  }
  scrollToIndex(index) {
    this.refs.accordion && this.refs.accordion.scrollToIndex(index);
  }
  render() {
    return this.state.mounted ? (
      <View>
        <AccordionModuleNative
          ref={"accordion"}
          hideToggler
          mainIndex={this.state.intervalIndex}
          getItemLayout={this.getItemLayout}
          keyExtractor={this.keyExtractor}
          _renderHeader={this.renderHeader.bind(this)}
          _renderContent={this.renderItems.bind(this)}
          dataSource={this.props.intervals}
          onExpand={this.onItemExpand.bind(this)}
        ></AccordionModuleNative>
        {this.state.isReportModalOpened ? (
          <RemindReportContent
            master={this.props.master}
            isOpen={this.state.isReportModalOpened}
            report={this.state.currentReport}
            user={this.state.currentUser}
            closed={() => {
              this.setStatePure({
                isReportModalOpened: false,
              });
            }}
            confirm={() => {
              this.props.confirm(this.state.currentUser, this.state.interval);
              //this.props.onClosed()
            }}
          ></RemindReportContent>
        ) : null}
      </View>
    ) : <Spinner></Spinner>;
  }
}
