import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  Text,
} from "react-native";
import TasksCard from "./TasksCard";
import stores from "../../../stores/index";
import BleashupFlatList from "../../BleashupFlatList";
import { find, findIndex, uniqBy, reject, filter, concat, uniq } from "lodash";
import shadower from "../../shadower";
import RemindRequest from "./Requester";
import emitter from "../../../services/eventEmiter";
import SetAlarmPatternModal from "../event/SetAlarmPatternModal";
import AddReport from "./AddReportModal";
import SelectableContactList from "../../SelectableContactList";
import ContactListModal from "../event/ContactListModal";
import AreYouSure from "../event/AreYouSureModal";
import moment from "moment";
import {
  format,
  AlarmPatterns,
  callculateAlarmOffset,
} from "../../../services/recurrenceConfigs";
import {
  getcurrentDateIntervalsNoneAsync,
  getCurrentDateIntervalNonAsync,
  getcurrentDateIntervals,
  getCurrentDateInterval,
} from "../../../services/getCurrentDateInterval";
import { confirmedChecker } from "../../../services/mapper";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import { dateDiff } from "../../../services/datesWriter";
import colorList from "../../colorList";
import ShareFrame from "../../mainComponents/ShareFram";
import Share from "../../../stores/share";
import request from "../../../services/requestObjects";
import replies from "../eventChat/reply_extern";
import TaskCreationExtra from "./TaskCreationExtra";
import AnimatedComponent from "../../AnimatedComponent";
import MessageActions from "../eventChat/MessageActons";
import Vibrator from "../../../services/Vibrator";
import GState from "../../../stores/globalState/index";
import Toaster from "../../../services/Toaster";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { observer } from "mobx-react";
import IDMaker from "../../../services/IdMaker";
import Texts from "../../../meta/text";
import globalFunctions from "../../globalFunctions";
import BeNavigator from "../../../services/navigationServices";
import SideButton from "../../sideButton";
import rounder from "../../../services/rounder";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { _onScroll } from "../currentevents/components/sideButtonService";
import Searcher from "../Contacts/Searcher";
import {
  cancelSearch,
  startSearching,
  justSearch,
} from "../eventChat/searchServices";
import Spinner from "../../Spinner";
import AnimatedPureComponent from "../../AnimatedPureComponent";
import { returnCurrentPatterns, sendRemindAsMessage } from "./remindsServices";
import messagePreparer from "../eventChat/messagePreparer";
import { constructProgramLink } from '../eventChat/services';

@observer
class Reminds extends AnimatedPureComponent {
  initialize() {
    this.state = {
      eventRemindData: [],
      mounted: false,
      newing: false,
      update: false,
      isActionButtonVisible: true,
      event_id: this.props.event_id,
      RemindCreationState: false,
    };
    this.onScroll = _onScroll.bind(this);
    this.cancelSearch = cancelSearch.bind(this);
    this.startSearching = startSearching.bind(this);
    this.search = justSearch.bind(this);
  }
  addMembers(currentMembers, item) {
    this.setStatePure({
      isSelectableContactsModalOpened: true,
      currentTask: item,
      adding: true,
      removing: false,
      notcheckAll: false,
      contacts: this.props.event.participant.filter(
        (e) => findIndex(currentMembers, { phone: e.phone }) < 0
      ),
    });
  }
  saveAddMembers(members) {
    if (this.props.working) {
      this.sayAppBusy();
    } else {
      let newMembers = members.filter(
        (ele) =>
          findIndex(this.state.currentTask.members, { phone: ele.phone }) < 0
      );
      if (newMembers.length > 0) {
        this.props.startLoader();
        RemindRequest.addMembers(
          {
            ...this.state.currentTask,
            members: newMembers,
          },
          null,
          this.props.isRelation ? false : this.props.event.about.title
        )
          .then(() => {
            this.props.stopLoader();
            this.refreshReminds();
          })
          .catch((error) => {
            this.props.stopLoader();
          });
      } else {
        Toaster({ text: Texts.member_already_exists });
      }
    }
  }
  updateData(newremind) {
    this.setStatePure({
      newing: !this.state.newing,
    });
  }

  componentDidMount() {
    this.initReminds();
  }
  scrolled = 0;
  initReminds() {
    emitter.on("remind-updated", () => {
      this.refreshReminds();
    });
    if (
      !stores.Reminds.Reminds[this.props.event_id] ||
      stores.Reminds.Reminds[this.props.event_id].length <= 1
    ) {
      stores.Reminds.loadReminds(this.props.event_id).then((reminds) => { });
    }
    if (this.props.currentMembers || this.props.remind) {
      BeNavigator.pushTo("TaskCreation", this.returnTaskCreationOptions())
    }
    setTimeout(() => {
      this.setStatePure({
        mounted: true,
        //RemindCreationState:
        //  this.props.currentMembers || this.props.remind ? true : false,
      });
    }, 5);
    if (this.props.id)
      this.waitToScroll = setTimeout(() => {
        let scrollIndex = findIndex(this.getRemindData(), {
          id: this.props.id,
        });
        scrollIndex >= 0 &&
          this.refs.RemindsList &&
          this.refs.RemindsList.scrollToIndex(scrollIndex);
        clearTimeout(this.waitToScroll);
      }, 5);
  }
  saveRemoved(members) {
    if (this.props.working) {
      this.sayAppBusy();
    } else {
      this.props.startLoader();
      RemindRequest.removeMembers(
        members.map((ele) => ele.phone),
        this.state.currentTask.id,
        this.state.currentTask.event_id
      )
        .then(() => {
          this.refreshReminds();
          this.props.stopLoader();
        })
        .catch(() => {
          this.props.stopLoader();
        });
    }
  }
  unmountingComponent() {
    emitter.off("remind-updated");
    clearTimeout(this.waitToScroll);
    clearInterval(this.scrolling);
  }

  AddRemind() {
    if (!this.props.computedMaster) {
      Toaster({
        text: Texts.not_enough_previledges_to_perform_action,
        duration: 4000,
      });
    } else {
      BeNavigator.pushTo("TaskCreation", this.returnTaskCreationOptions())
      /*this.setStatePure({
        RemindCreationState: true,
        update: false,
        newing: !this.state.newing,
      });*/
    }
  }
  sendUpdate() {
    this.props.startLoader();
    RemindRequest.performAllUpdates(
      this.previousRemind,
      this.state.currentRemind
    )
      .then((res) => {
        this.props.stopLoader();
      })
      .catch(() => {
        this.props.stopLoader();
      });
  }
  refreshReminds() {
    this.animateUI();
    this.setStatePure({
      newing: !this.state.newing,
      currentTask:
        this.state.currentTask &&
        find(this.getRemindData(), { id: this.state.currentTask.id }),
    });
  }

  updateRemind(data) {
    this.previousRemind = JSON.stringify(data);
    this.setStatePure({
      //RemindCreationState: true,
      update: true,
      newing: !this.state.newing,
      remind_id: data.id,
    });
    BeNavigator.pushTo("TaskCreation", this.returnTaskCreationOptions(data.id, true))
  }

  back() {
    this.props.navigation.navigate("Home");
  }
  assignToMe(item) {
    this.setStatePure({
      currentRemind: item,
      isSelectAlarmPatternModalOpened: true,
      currentTask: item,
    });
  }
  markAsDone(item) {
    if (this.props.working) {
      this.sayAppBusy();
    } else {
      if (item.must_report) {
        this.setStatePure({
          showReportModal: true,
          currentTask: item,
        });
      } else {
        this.props.startLoader();
        let member = find(item.members, {
          phone: stores.LoginStore.user.phone,
        });
        RemindRequest.markAsDone(
          [
            {
              ...member,
              status: {
                date: moment().format(),
                status: member.status,
              },
            },
          ],
          item,
          null,
          this.props.isRelation ? false : this.props.event.about.title
        )
          .then((res) => {
            this.props.stopLoader();
            this.refreshReminds();
          })
          .catch((error) => {
            this.props.stopLoader();
          });
      }
    }
  }
  showToastMessage(message) {
    Toaster({ text: message });
  }
  confirm(user, interval) {
    if (this.props.working) {
      this.sayAppBusy();
    } else {
      if (
        findIndex(this.state.currentTask.confirmed, (ele) =>
          confirmedChecker(ele, user.phone, {
            start: interval.start,
            end: interval.end,
          })
        ) >= 0
      ) {
        this.showToastMessage(Texts.confirmed_already);
      } else {
        this.props.startLoader();
        RemindRequest.confirm(
          [user],
          this.state.currentTask.id,
          this.state.currentTask.event_id
        )
          .then((res) => {
            this.refreshReminds();
            this.props.stopLoader();
          })
          .catch(() => {
            this.showToastMessage(Texts.unable_to_perform_request);
            this.props.stopLoader();
          });
      }
    }
  }
  markAsDoneWithReport(report) {
    if (this.props.working) {
      this.sayAppBusy();
    } else {
      this.setStatePure({
        showReportModal: false,
      });
      this.props.startLoader();
      let member = find(this.state.currentTask.members, {
        phone: stores.LoginStore.user.phone,
      });
      RemindRequest.markAsDone(
        [
          {
            ...member,
            status: {
              report: report,
              date: moment().format(),
              status: member.status,
            },
          },
        ],
        this.state.currentTask,
        null
      )
        .then((res) => {
          this.props.stopLoader();
          this.refreshReminds();
        })
        .catch((error) => {
          this.props.stopLoader();
        });
    }
  }
  deleteRemind() {
    if (!this.props.working) {
      this.props.startLoader();
      RemindRequest.deleteRemind(
        this.state.currentTask.id,
        this.state.currentTask.event_id
      )
        .then(() => {
          this.refreshReminds();
          this.props.stopLoader();
        })
        .catch(() => {
          this.props.stopLoader();
        });
    } else {
      this.sayAppBusy();
    }
  }
  sayAppBusy() {
    Toaster({ text: Texts.app_busy });
  }
  saveAlarms(alarms, date) {
    if (this.state.forCurrentRemind) {
      this.setStatePure({
        forCurrentRemind: false,
        currentRemind: {
          ...this.state.currentRemind,
          extra: {
            ...this.state.currentRemind.extra,
            alarms,
            date,
          },
        },
      });
    } else {
      if (this.props.working) {
      } else {
        this.props.startLoader();
        RemindRequest.addMembers(
          {
            ...this.state.currentTask,
            members: [
              this.props.shared
                ? {
                  ...request.Participant(),
                  phone: stores.LoginStore.user.phone,
                  master: false,
                  status: "joint",
                  host: stores.Session.SessionStore.host,
                }
                : find(this.props.event.participant, {
                  phone: stores.LoginStore.user.phone,
                }),
            ],
          },
          alarms
        )
          .then(() => {
            this.props.stopLoader();
            this.refreshReminds();
          })
          .catch((error) => {
            this.props.stopLoader();
          });
      }
    }
  }
  flatterarray(array, result, i) {
    if (array.length === i) {
      return result;
    }
    result = [...result, ...array[i]];
    return this.flatterarray(array, result, i + 1);
  }
  filterDonners(interval) {
    //console.warn(interval)
    let donners = this.state.currentTask.donners.filter((ele) =>
      this.intervalFilterFunc(ele, interval)
    );
    return donners;
  }
  intervalFilterFunc(el, ele) {
    return (
      moment(el.status.date).format("x") >
      moment(ele.start, format).format("x") &&
      moment(el.status.date).format("x") <= moment(ele.end, format).format("x")
    );
  }
  filterConfirmed(interval) {
    return this.state.currentTask.confirmed.filter((ele) =>
      this.intervalFilterFunc(ele, interval)
    );
  }
  returnRouteActions(members, currentTask,
    actualInterval, intervals) {
    return {
      type: this.props.type,
      currentRemindUser: this.props.currentRemindUser,
      concernees: members,
      reply: this.reply.bind(this),
      confirmed: this.filterConfirmed.bind(this),
      donners: this.filterDonners.bind(this),
      intervals: intervals,
      confirm: this.confirm.bind(this),
      master:
        currentTask &&
        stores.LoginStore.user.phone === currentTask.creator,
      must_report:
        currentTask && currentTask.must_report,
      actualInterval: actualInterval,

    }
  }
  returnTaskCreationOptions(remind_id, update) {
    return {
      CreateRemind: (remind) => {
        this.setStatePure({
          currentRemind: remind,
          RemindCreationState: false,
          isExtra: true,
          TaskCreationExtra: true,
        });
      }
      ,
      starRemind: this.props.remind,
      master: this.props.master,
      event_id: this.props.event_id,
      update: update || this.state.update,
      remind_id: remind_id || this.state.remind_id,
      updateRemind: (remind) => {
        //console.error(remind)
        this.setStatePure({
          currentRemind: remind,
          TaskCreationExtra: true,
          isExtra: true,
          RemindCreationState: false,
        })
      },
      currentMembers: this.props.currentMembers,
      event: this.props.event
    }
  }
  showReport(intervals, thisInterval) {
    let item = this.state.remind;
    let members = uniq(item.members.map((ele) => ele.phone));
    BeNavigator.pushTo("Report", this.returnRouteActions(members,
      item,
      thisInterval,
      intervals))
    this.setStatePure({
      members: this.members,
      currentTask: item,
    });
  }

  addNewRemind() {
    this.scrollRemindListToTop();
    let remind = { ...this.state.currentRemind, id: IDMaker.make() };
    RemindRequest.CreateRemind(remind).then(() => {
      stores.Reminds.removeRemind(
        this.props.event.id,
        request.Remind().id
      ).then(() => {
        sendRemindAsMessage(
          remind,
          this.props.event.about.title
        ).then(() => { });
      });
    }); /*.catch(() => {
      console.warn("an error occured while creating the remind")
    })*/
  }
  scrollRemindListToTop() {
    this.refs.RemindsList.scrollToEnd();
    this.refs.RemindsList.resetItemNumbers();
  }
  _keyExtractor = (item, index) => item.id;
  delay = 1;
  getRemindData = () => {
    let RemindData = (stores.Reminds.Reminds
      ? stores.Reminds.Reminds[this.props.event_id]
      : []
    ).filter((ele) =>
      globalFunctions.filterReminds(ele, this.state.searchString || "")
    );
    return RemindData;
  };
  onChangedStatus(newStatus) {
    this.setStatePure({
      currentRemind: { ...this.state.currentRemind, status: newStatus },
    });
  }
  updateRequestReportOnComplete() {
    this.setStatePure({
      currentRemind: {
        ...this.state.currentRemind,
        must_report: this.state.currentRemind.must_report
          ? !this.state.currentRemind.must_report
          : true,
      },
    });
  }
  shareLink(){
    this.props.shareLink && this.props.shareLink(constructProgramLink(this.props.event.id,
      this.state.remind.id))
  }
  actionIndex = this.state.currentIndex ? this.state.currentIndex() : {};
  remindsActions = () => [
    {
      title: Texts.reply,
      callback: () => this.mention(this.state.remind),
      iconName: "reply",
      condition: () => true,
      iconType: "Entypo",
      color: colorList.replyColor,
    },
    {
      title: Texts.share,
      callback: () => this.share(),
      condition: () => true,
      iconName: "forward",
      iconType: "Entypo",
      color: colorList.indicatorColor,
    },
    {
      title: Texts.get_share_link,
      callback: () => this.shareLink(),
      condition: () => true,
      iconName: "ios-link",
      iconType: "Ionicons",
      color: colorList.indicatorColor,
    },
    {
      title: Texts.members,
      callback: () => this.showReport(this.state.intervals,
        this.state.actualInterval),
      condition: () => true,
      iconName: "ios-people",
      iconType: "Ionicons",
      color: colorList.likeActive,
    },
    {
      title: Texts.update,
      condition: () =>
        globalFunctions.isMe(this.state.creator) || this.props.master,
      callback: () => this.updateRemind(this.state.remind),
      iconName: "history",
      iconType: "MaterialIcons",
      color: colorList.darkGrayText,
    },
    {
      title: Texts.assign,
      condition: () =>
        globalFunctions.isMe(this.state.creator) || this.props.master,
      callback: () =>
        this.addMembers(
          uniqBy(this.state.remind.members, "phone"),
          this.state.remind
        ),
      iconName: "addusergroup",
      iconType: "AntDesign",
      color: colorList.indicatorColor,
    },
    {
      title: Texts.unassign,
      condition: () =>
        globalFunctions.isMe(this.state.creator) || this.props.master,
      callback: () =>
        this.removeMembers(
          uniqBy(
            this.state.remind.members.filter(
              (ele) =>
                this.state.creator || ele.phone === stores.LoginStore.user.phone
            )
          ),
          this.state.remind
        ),
      iconName: "deleteusergroup",
      iconType: "AntDesign",
      color: "orange",
    },
    {
      title: Texts.delete_,
      callback: () => this.removeRemind(this.state.remind),
      condition: () =>
        globalFunctions.isMe(this.state.creator) || this.props.master,
      iconName: "delete-forever",
      iconType: "MaterialCommunityIcons",
      color: colorList.delete,
    },
  ];
  showRemindActions(remind, intervals, thisInterval, creator, showModal) {
    this.setStatePure({
      intervals,
      creator,
      actualInterval: thisInterval,
      showRemindActions: !showModal,
      remind: remind,
    });
  }
  reply(item) {
    this.hideReportModal();
    setTimeout(() => {
      let reply = GState.prepareMentionForRemindsMembers(
        item,
        this.state.currentTask
      );
      this.props.mention(reply);
    });
  }
  hideReportModal() {
    this.setStatePure({
      isReportModalOpened: false,
    });
    this.props.clearIndexedRemind && this.props.clearIndexedRemind();
  }
  showSharer() {
    let message = messagePreparer.formMessageFromRemind(this.state.remind)
    this.props.showSharer && this.props.showSharer(message)
  }
  hideSharing() {
    this.setStatePure({
      isSharing: false,
    });
  }
  render() {
    return (
      <View>
        {this.renderReminds()}
        {this.state.isSelectAlarmPatternModalOpened ? (
          <SetAlarmPatternModal
            save={(alarms, date) => this.saveAlarms(alarms, date)}
            pattern={returnCurrentPatterns(this.state.currentRemind)}
            isOpen={this.state.isSelectAlarmPatternModalOpened}
            closed={() => {
              this.setStatePure({
                isSelectAlarmPatternModalOpened: false,
              });
            }}
          />
        ) : null}
        {this.state.isExtra ? (
          <TaskCreationExtra
            proceed={
              !this.state.update
                ? this.addNewRemind.bind(this)
                : this.sendUpdate.bind(this)
            }
            updateAlarms={() => {
              this.setStatePure({
                isSelectAlarmPatternModalOpened: true,
                forCurrentRemind: true,
              });
            }}
            onChangedStatus={this.onChangedStatus.bind(this)}
            currentRemind={this.state.currentRemind || {}}
            onComplete={this.updateRequestReportOnComplete.bind(this)}
            isOpen={this.state.isExtra}
            onClosed={() => {
              this.setStatePure({
                isExtra: false,
              });
            }}
          />
        ) : null}
        {this.state.showReportModal ? (
          <AddReport
            report={(report) => {
              this.markAsDoneWithReport(report);
            }}
            onClosed={() => {
              this.setStatePure({
                showReportModal: false,
              });
            }}
            isOpen={this.state.showReportModal}
          />
        ) : null}
        {this.state.isSelectableContactsModalOpened ? (
          <SelectableContactList
            adding={this.state.adding}
            removing={this.state.removing}
            addMembers={(members) => {
              this.saveAddMembers(members);
            }}
            saveRemoved={(members) => this.saveRemoved(members)}
            members={
              this.state.contacts && this.state.contacts.length > 0
                ? this.state.contacts
                : []
            }
            notcheckall={this.state.notcheckAll}
            isOpen={this.state.isSelectableContactsModalOpened}
            close={() => {
              this.setStatePure({
                isSelectableContactsModalOpened: false,
              });
            }}
          />
        ) : null}
        {this.state.isContactsModalOpened ? (
          <ContactListModal
            title={this.state.title}
            isOpen={this.state.isContactsModalOpened}
            onClosed={() => {
              this.setStatePure({
                isContactsModalOpened: false,
              });
            }}
            complexReport={this.state.complexReport}
            actualInterval={this.state.actualInterval}
            contacts={this.state.contacts ? this.state.contacts : []}
          />
        ) : null}

        {this.state.isAreYouModalOpened ? (
          <AreYouSure
            isOpen={this.state.isAreYouModalOpened}
            title={Texts.delete_remind}
            closed={() => {
              this.setStatePure({
                isAreYouModalOpened: false,
              });
            }}
            ok={Texts.delete_}
            callback={() => {
              this.deleteRemind();
            }}
            message={Texts.are_you_sure_you_want_to_leave}
          />
        ) : (
            false
          )}
        {this.state.showRemindActions ? (
          <MessageActions
            title={Texts.remind_action}
            actions={this.remindsActions}
            isOpen={this.state.showRemindActions}
            onClosed={() => {
              this.setStatePure({
                showRemindActions: false,
              });
            }}
          ></MessageActions>
        ) : null}
      </View>
    );
  }
  mention(itemer) {
    this.props.mention(GState.prepareRemindsForMetion(itemer));
  }
  showMedia = (url) => {
    if (url.video) {
      console.warn("showing video");
      BeNavigator.openVideo(url.video);
    } else {
      BeNavigator.openPhoto(url.photo);
    }
  };
  showMembers = (members) => {
    this.setStatePure({
      contacts: members,
      isContactsModalOpened: true,
      title: "Concernees",
      complexReport: false,
    });
  };
  removeMembers = (currentMembers, item) => {
    this.setStatePure({
      isSelectableContactsModalOpened: true,
      currentTask: item,
      contacts: currentMembers,
      adding: false,
      removing: true,
      notcheckAll: true,
    });
  };
  removeRemind = (item) => {
    this.setStatePure({
      currentTask: item,
      isAreYouModalOpened: true,
    });
  };
  share() {
    this.showSharer();
  }
  renderReminds() {
    let data = this.getRemindData();
    return (
      <View style={{ width: "100%", height: "100%" }}>
        {this.props.removeHeader ? null : (
          <View
            style={{
              height: colorList.headerHeight,
              width: "100%",
              //paddingLeft: "1%",
              //paddingRight: "1%",
            }}
          >
            <View
              style={{
                ...bleashupHeaderStyle,
                backgroundColor: colorList.headerBackground,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => requestAnimationFrame(() => this.props.goback())}
                style={{
                  width: "10%",
                  paddingLeft: "3%",
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  style={{
                    ...GState.defaultIconSize,
                    color: colorList.headerIcon,
                  }}
                  type={"MaterialIcons"}
                  name={"arrow-back"}
                />
              </TouchableOpacity>

              {!this.state.searching ? (
                <View
                  style={{
                    width: "80%",
                    paddingLeft: "9%",
                    justifyContent: "center",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      alignSelf: "flex-start",
                      color: colorList.headerText,
                      fontSize: colorList.headerFontSize,
                    }}
                  >
                    {Texts.reminds_at + " " + this.props.event.about.title}
                  </Text>
                </View>
              ) : null}
              <View
                style={{
                  height: 35,
                  width: this.state.searching ? "90%" : 35,
                }}
              >
                <Searcher
                  searchString={this.state.searchString}
                  searching={this.state.searching}
                  search={this.search}
                  startSearching={this.startSearching}
                  cancelSearch={this.cancelSearch}
                ></Searcher>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: "92%" }}>
          {this.state.mounted ? (
            <BleashupFlatList
              onScroll={this.onScroll}
              fit={this.props.fit}
              getItemLayout={(item, index) =>
                GState.getItemLayout(item, index, data, 70, 0)
              }
              initialRender={6}
              ref="RemindsList"
              renderPerBatch={10}
              firstIndex={0}
              //showVerticalScrollIndicator={false}
              keyExtractor={(item, index) => item.id}
              dataSource={data}
              renderItem={(item, index) => {
                this.delay = index >= 5 ? 0 : this.delay + 1;
                let isPointed = item.id === GState.currentID;
                let update_state =
                  moment(item.updated_at).format("x") +
                  Number(isPointed) +
                  (this.state.searchString
                    ? this.state.searchString.length
                    : 0);
                let membersState =
                  item.members.length +
                  item.donners.length +
                  item.confirmed.length;
                return (
                  <TasksCard
                    members_state={membersState}
                    intervals_updated_at={
                      stores.Reminds.remindsIntervals[item.event_id] &&
                      stores.Reminds.remindsIntervals[item.event_id][item.id] &&
                      stores.Reminds.remindsIntervals[item.event_id][item.id]
                        .updated_at
                    }
                    update_state={update_state}
                    searchString={this.state.searchString}
                    showReport={this.showReport.bind(this)}
                    pointed_id={this.props.id}
                    type={this.props.type}
                    currentRemindUser={this.props.currentRemindUser}
                    isPointed={isPointed}
                    onLayout={(layout) =>
                      GState.itemDebounce(
                        item,
                        () => {
                          index = findIndex(
                            stores.Reminds.Reminds[item.event_id],
                            { id: item.id }
                          );
                          stores.Reminds.persistDimenssion(
                            index,
                            item.event_id,
                            layout
                          );
                        },
                        500
                      )
                    }
                    showRemindActions={(
                      intervals,
                      thisInterval,
                      creator,
                      date,
                      showModal
                    ) => {
                      !showModal && Vibrator.vibrateShort();
                      this.showRemindActions(
                        { ...item, current_date: date },
                        intervals,
                        thisInterval,
                        creator,
                        showModal
                      );
                    }}
                    animate={this.animateUI}
                    showMedia={this.showMedia.bind(this)}
                    isLast={index === this.getRemindData().length - 1}
                    phone={stores.LoginStore.user.phone}
                    mention={(itemer) => {
                      this.mention(itemer);
                    }}
                    master={this.props.master}
                    markAsDone={(item) => this.markAsDone(item)}
                    assignToMe={(item) => this.assignToMe(item)}
                    calendar_id={this.props.event.calendar_id}
                    delay={this.delay}
                    addMembers={(currentMembers, item) =>
                      this.addMembers(currentMembers, item)
                    }
                    showMembers={this.showMembers.bind(this)}
                    showReport={this.showReport.bind(this)}
                    removeMembers={this.removeMembers}
                    updateRemind={(item) => this.updateRemind(item)}
                    update={(data) => this.updateRemind(data)}
                    deleteRemind={this.removeRemind.bind(this)}
                    item={item}
                  />
                );
              }}
              numberOfItems={this.getRemindData().length}
            />
          ) : (
              <Spinner></Spinner>
            )}
        </View>
        {this.state.isActionButtonVisible ? (
          <SideButton
            buttonColor={colorList.transparent}
            action={() => requestAnimationFrame(() => this.AddRemind())}
            renderIcon={() => (
              <TouchableOpacity
                style={{
                  backgroundColor: colorList.bodyBackground,
                  ...rounder(50, colorList.bodyBackground),
                  ...shadower(2),
                  justifyContent: "center",
                }}
                onPress={() => requestAnimationFrame(() => this.AddRemind())}
              >
                <MaterialCommunityIcons
                  type="AntDesign"
                  name="bell-plus"
                  style={{
                    ...GState.defaultIconSize,
                    color: colorList.reminds,
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
            )}
          ></SideButton>
        ) : null}
      </View>
    );
  }
}

export default Reminds;
