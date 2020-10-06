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
import MessageActions from "../eventChat/MessageActons";
import Texts from "../../../meta/text";
import emitter from "../../../services/eventEmiter";
import { members_updated } from "../../../meta/events";
import replies from '../eventChat/reply_extern';

export default class DonnersList extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      newing: false,
    };
  }
  concludeScrollForInterval(intervalIndex) {
    this.setStatePure({
      mounted: true,
      intervalIndex,
    });
    if (intervalIndex >= 0) {
      intervalIndex && this.scrollToIndex(intervalIndex);
    }
  }
  showAction(item) {
    this.setStatePure({
      showAction: true,
      item,
    });
  }
  MembersAction = () => [
    {
      title: Texts.reply,
      callback: () => this.props.reply(this.state.item),
      iconName: "reply",
      condition: () => true,
      iconType: "Entypo",
      color: ColorList.replyColor,
    },
    {
      title: Texts.reply_privately,
      callback: () => this.props.replyPrivate(this.state.item),
      iconName: "reply",
      condition: () => !this.props.isRelation,
      iconType: "Entypo",
      color: ColorList.replyColor,
    },
  ];
  hideAction() {
    this.setStatePure({
      showAction: false,
    });
  }
  handleUpdateEvent() {
    if (this.mounted) {
      const donner = this.props.donners(this.state.interval);
      const user = donner.find(
        (ele) =>
         ele && ele.phone == this.state.currentPhone &&
          this.state.currentUser.status.date == ele.status.date
      );
      this.setStatePure({
        newing: !this.state.newing,
        donners: donner,
        currentReport: user && user.status,
        canConfirm: this.checkCanConfirm(this.state.interval, {
          ...this.state.currentUser,
          phone: this.state.currentPhone,
        }),
        currentUser: user,
      });
    }
  }
  state = {};
  componentDidMount() {
    let checker = (ele, date) =>
      moment(ele.start, format).format("x") <= date &&
      moment(ele.end, format).format("x") > date;
    let actualIntervalIndex = (date) =>
      this.props.intervals.findIndex((ele) => checker(ele, date));
    setTimeout(() => {
      if (this.props.type && this.props.currentRemindUser) {
        let date = moment(this.props.currentRemindUser.status.date).format("x");
        let intervalIndex = actualIntervalIndex(date);
        this.concludeScrollForInterval(intervalIndex);
      } else {
        let date = moment().format("x");
        let intervalIndex = actualIntervalIndex(date);
        this.concludeScrollForInterval(intervalIndex);
      }
    });
    emitter.on(members_updated, () => {
      this.handleUpdateEvent();
    });
  }
  unmountingComponent() {
    emitter.off(members_updated);
  }
  onItemExpand(item) {
    this.donners = this.props.donners(item);
    this.setStatePure({
      donners: this.donners,
    });
    if (this.props.type && this.props.currentRemindUser) {
      let index = this.donners.findIndex(
        (ele) => ele && ele.phone == this.props.currentRemindUser.phone
      );
      this.scrollToDonnersIndex(index, item);
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
  checkCanConfirm(interval, item) {
    return this.props.confirmed &&
      this.props
        .confirmed(interval)
        .find(
          (ele) =>
            ele.phone == item.phone && ele.status.date == item.status.date
        )
      ? false
      : true;
  }
  showReport(interval, item, index) {
   item && this.setStatePure({
      isReportModalOpened: true,
      interval: interval,
      currentIndex: index,
      total: this.donners.length,
      newing: !this.state.newing,
      currentReport: item.status,
      canConfirm: this.checkCanConfirm(interval, item),
      currentPhone: item.phone,
      currentUser: item,
    });
  }
  keyExtractor = (item) => item.start + "-" + item.end;
  delay = 0;
  renderItems(ParentItem) {
    this.donners = this.state.donners || [];
    return (
      <View style={{ width: "100%", maxHeight: 400 }}>
        <BleashupFlatList
          fit
          firstIndex={0}
          ref={"flatlist"}
          renderPerBatch={7}
          initialRender={20}
          numberOfItems={this.donners.length}
          keyExtractor={(item, index) => item.phone + item.status.date}
          getItemLayout={this.getItemLayoutForFlatList}
          dataSource={this.donners}
          renderItem={(item, index) => {
            this.delay = this.delay >= 20 ? 0 : this.delay + 1;
            let isCurrentPointed = index === this.state.index;
            let shouldHighlight =
              this.props.currentRemindUser &&
              this.props.currentRemindUser.phone == item.phone;
            return (
              <View style={{ width: "90%", alignSelf: "center", height: 53 }}>
                <Swipeout
                  onLongPress={() =>
                    this.showAction({
                      ...item,
                      status: { date: item.status.date },
                      type: this.props.type,
                    })
                  }
                  swipeRight={() => {
                    this.props.reply &&
                      this.props.reply({
                        ...item,
                        type: this.props.type,
                        status: { date: item.status.date },
                      });
                  }}
                //disableLeftSwipe={true}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: isCurrentPointed
                        ? ColorList.remindsTransparent
                        : ColorList.bodyBackground,
                      borderRadius: 5,
                      minHeight: 55,
                      alignItems: 'center',
                      ...shadower(1),
                      paddingHorizontal: "2%",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1, alignSelf: "center" }}>
                      <ProfileView
                        showHighlighter={() =>
                          shouldHighlight && this.toggleItemHighlight(index)
                        }
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
                          this.showReport(ParentItem, item, index);
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
        {this.state.showAction ? (
          <MessageActions
            title={Texts.remind_member_action}
            actions={this.MembersAction}
            isOpen={this.state.showAction}
            onClosed={this.hideAction.bind(this)}
          ></MessageActions>
        ) : null}
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
  scrollToDonnersIndex(index, interval) {
    index >= 0 && this.refs.flatlist && this.refs.flatlist.scrollToIndex(index);
    if (this.props.currentRemindUser.with_report && this.props.type == replies.done) {
      this.showReport(interval, this.donners[index], index)
    }
  }
  expandItem(item) {
    this.refs.accordion && this.refs.accordion.toggleExpand(item);
  }
  scrollToIndex(index) {
    this.refs.accordion && this.refs.accordion.scrollToIndex(index);
  }
  replyReport() {
    this.showAction({
      ...this.state.currentUser,
      phone: this.state.currentPhone,
      status: { date: this.state.currentReport.date },
      type: this.props.type,
      with_report: true,
    });
  }
  switchBack() {
    if (this.state.currentIndex <= 0) {
      let index = this.donners.length - 1;
      this.showReport(this.state.interval, this.donners[index], index);
    } else {
      let index = this.state.currentIndex + 1;
      this.showReport(this.state.interval, this.donners[index], index);
    }
  }
  switchFront() {
    if (this.state.currentIndex >= this.donners.length - 1) {
      this.showReport(this.state.interval, this.donners[0], 0);
    } else {
      let index = this.state.currentIndex + 1;
      this.showReport(this.state.interval, this.donners[index], index);
    }
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
            total={this.state.total}
            reply={this.replyReport.bind(this)}
            currentIndex={this.state.currentIndex}
            switchBack={this.switchBack.bind(this)}
            switchFront={this.switchFront.bind(this)}
            master={this.props.master}
            canConfirm={this.state.canConfirm}
            currentPhone={this.state.currentPhone}
            editReport={this.props.editReport}
            isOpen={this.state.isReportModalOpened}
            report={this.state.currentReport}
            user={this.state.currentUser}
            closed={() => {
              this.setStatePure({
                isReportModalOpened: false,
              });
            }}
            confirm={() => {
              this.props.confirm(
                {
                  ...this.state.currentUser,
                  phone: this.state.currentPhone,
                },
                this.state.interval
              );
              //this.props.onClosed()
            }}
          ></RemindReportContent>
        ) : null}
      </View>
    ) : (
        <Spinner></Spinner>
      );
  }
}
