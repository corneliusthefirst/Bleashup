import React, { Component } from 'react';
import { Icon, Item, Title, Spinner, Toast, Button } from 'native-base';

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  Platform,
  AlertIOS,
} from "react-native";
import autobind from 'autobind-decorator';
import TasksCard from './TasksCard';
import stores from "../../../stores/index";
import BleashupFlatList from "../../BleashupFlatList";
import TasksCreation from "./TasksCreation";
import { find, findIndex, uniqBy, reject, filter, concat, uniq } from 'lodash';
import shadower from "../../shadower";
import RemindRequest from "./Requester";
import emitter from "../../../services/eventEmiter";
import SetAlarmPatternModal from "../event/SetAlarmPatternModal";
import AddReport from './AddReportModal';
import SelectableContactList from '../../SelectableContactList';
import ContactListModal from '../event/ContactListModal';
import ContactsReportModal from './ContactsReportModal';
import AreYouSure from '../event/AreYouSureModal';
import moment from "moment";
import { format } from '../../../services/recurrenceConfigs';
import {
  getcurrentDateIntervalsNoneAsync,
  getCurrentDateIntervalNonAsync,
  getcurrentDateIntervals,
  getCurrentDateInterval,
} from '../../../services/getCurrentDateInterval';
import { confirmedChecker } from '../../../services/mapper';
import ReportTabModal from "./NewReportTab";
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import { dateDiff } from '../../../services/datesWriter';
import colorList from "../../colorList";
import PhotoViewer from "../event/PhotoViewer";
import VideoViewer from '../highlights_details/VideoModal';
import ShareFrame from '../../mainComponents/ShareFram';
import Share from '../../../stores/share';
import request from '../../../services/requestObjects';
import replies from "../eventChat/reply_extern";
import TaskCreationExtra from './TaskCreationExtra';
import uuid from 'react-native-uuid';
import AnimatedComponent from '../../AnimatedComponent';
import MessageActions from '../eventChat/MessageActons';
import Vibrator from '../../../services/Vibrator';
import GState from '../../../stores/globalState/index';
//const MyTasksData = stores.Reminds.MyTasksData

export default class Reminds extends AnimatedComponent {
  initialize(){
    this.state = {
      eventRemindData: [],
      mounted: true,
      newing: false,
      update: false,
      event_id: this.props.event_id,
      RemindCreationState: false,
    };
    console.warn('running remind index con');
  }
  //manual event_id
  state = {};
  addMembers(currentMembers, item) {
    console.warn('pressing add contacts');
    this.setState({
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
      Toast.show({ text: "App is Busy" });
    } else {
      let newMembers = members.filter(
        (ele) =>
          findIndex(this.state.currentTask.members, { phone: ele.phone }) < 0
      );
      if (newMembers.length > 0) {
        this.props.startLoader();
        console.warn(newMembers);
        RemindRequest.addMembers({
          ...this.state.currentTask,
          members: newMembers,
        })
          .then(() => {
            this.props.stopLoader();
            this.refreshReminds();
          })
          .catch((error) => {
            this.props.stopLoader();
          });
      } else {
        Toast.show({ text: "member already exists" });
      }
    }
  }
  updateData(newremind) {
    //this.state.eventRemindData.unshift(newremind)
    /*let intervals = getcurrentDateIntervalsNoneAsync(
      {
        start: moment(newremind.period).format(format),
        end: moment(newremind.recursive_frequency.recurrence).format(format),
      },
      newremind.recursive_frequency.interval,
      newremind.recursive_frequency.frequency,
      newremind.recursive_frequency.days_of_week
    );
    thisInterval = getCurrentDateIntervalNonAsync(
      intervals,
      moment().format(format)
    );*/
    this.setState({
      newing: !this.state.newing,
      /*eventRemindData: [
        {
          ...newremind,
          thisInterval,
          intervals,
        },
        ...this.getRemindData(),
      ],*/
    });
  }

  componentDidMount() {
    !this.props.shared ? this.initReminds() : this.initShared();
  }
  initShared() {
    this.shareStore = new Share(this.props.share.id);
    this.shareStore.readFromStore().then(() => {
      this.shareStore && this.shareStore.share && this.shareStore.share.event
        ? this.setState({
          mounted: true,
        })
        : null;
    });
    stores.Reminds.loadRemindFromRemote(this.props.share.item_id).then(
      (remind) => {
        stores.Events.loadCurrentEventFromRemote(this.props.share.event_id)
          .then((event) => {
            this.shareStore
              .saveCurrentState({
                ...this.props.share,
                remind: Array.isArray(remind) ? remind[0] : remind,
                event,
              })
              .then(() => {
                this.setState({
                  mountedx: true,
                  mounted: true,
                });
              });
          })
          .catch(() => {
            console.warn("unable to fetch activity");
          });
      }
    );
  }
  scrolled = 0
  initReminds() {
    emitter.on("remind-updated", () => {
      this.refreshReminds();
    });
    this.setState({
      mounted: true,
      RemindCreationState: this.props.currentMembers || this.props.remind ? true : false,
    });
    if(this.props.id) this.waitToScroll = setTimeout(() => {
      console.warn("scrolling to index")
      this.scrolling = setInterval(() => {
       this.refs.RemindsList && this.refs.RemindsList.scrollToIndex(findIndex(stores.Reminds.Reminds[this.props.event_id],
          { id: this.props.id }))
        this.scrolled = this.scrolled + 1
        if(this.scrolled > 10) clearInterval(this.scrolling)
      },500)
    }, 1000)
  }
  saveRemoved(members) {
    if (this.props.working) {
      Toast.show({ text: "App is Busy" });
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
  componentWillUnmount() {
    emitter.off("remind-updated");
    clearTimeout(this.waitToScroll)
    clearInterval(this.scrolling)
    
  }

  @autobind
  AddRemind() {
    if (!this.props.computedMaster) {
      Toast.show({
        text: "You don't have enough previlidges to add a remind",
        duration: 4000,
      });
    } else {
      this.setState({
        RemindCreationState: true,
        update: false,
        newing: !this.state.newing,
      });
    }
  }
  sendUpdate() {
    if (!this.props.working) {
      this.props.startLoader();
      RemindRequest.performAllUpdates(
        this.previousRemind,
        this.state.currentRemind
      )
        .then((res) => {
          if (res) {
            this.setState({
              newing: !this.state.newing,
              update: false
            });
          }
          this.props.stopLoader();
        })
        .catch(() => {
          this.props.stopLoader();
        });
    } else {
      Toast.show({ text: "App is Busy" });
    }
  }
  refreshReminds() {
    this.animateUI()
    this.setState({
      newing: !this.state.newing,
      currentTask:
        this.state.currentTask &&
        find(this.getRemindData(), { id: this.state.currentTask.id }),
    });
  }

  updateRemind(data) {
    this.previousRemind = JSON.stringify(data);
    this.setState({
      RemindCreationState: true,
      update: true,
      newing: !this.state.newing,
      remind_id: data.id,
    });
  }

  @autobind
  back() {
    this.props.navigation.navigate("Home");
  }
  assignToMe(item) {
    this.setState({
      isSelectAlarmPatternModalOpened: true,
      currentTask: item,
    });
  }
  markAsDone(item) {
    if (this.props.working) {
      Toast.show({ text: "App is Busy" });
    } else {
      if (item.must_report) {
        this.setState({
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
  }
  showToastMessage(message) {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(message);
    }
  }
  confirm(user, interval) {
    if (this.props.working) {
      Toast.show({ text: "App is Busy" });
    } else {
      if (
        findIndex(this.state.currentTask.confirmed, (ele) =>
          confirmedChecker(ele, user.phone, {
            start: interval.start,
            end: interval.end,
          })
        ) >= 0
      ) {
        this.showToastMessage('confirmed already!');
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
            this.showToastMessage("Unable to perform network request");
            this.props.stopLoader();
          });
      }
    }
  }
  markAsDoneWithReport(report) {
    if (this.props.working) {
      Toast.show({ text: "App is Busy" });
    } else {
      this.setState({
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
      Toast.show({ text: "App is Busy" });
    }
  }
  saveAlarms(alarms) {
    console.warn(alarms)
    if (this.props.working) {
      Toast.show({ text: "App is Busy" });
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
  flatterarray(array, result, i) {
    if (array.length === i) {
      return result;
    }
    result = [...result, ...array[i]];
    return this.flatterarray(array, result, i + 1);
  }
  filterDonners(interval) {
    //console.warn(interval)
    let donners = this.state.currentTask.donners.filter((ele) => this.intervalFilterFunc(ele, interval))
    return donners
  }
  intervalFilterFunc(el, ele) {
    return moment(el.status.date).format("x") >
      moment(ele.start, format).format('x') &&
      moment(el.status.date).format("x") <=
      moment(ele.end, format).format("x")
  }
  filterConfirmed(interval) {
    return this.state.currentTask.confirmed.filter(ele => this.intervalFilterFunc(ele, interval))
  }
  @autobind showReport(item, intervals, thisInterval) {
    let members = item.members.map((ele) => ele.phone);
    this.setState({
      members: uniq(members),
      //actualInterval: thisInterval,
      isReportModalOpened: true,
      //intervals,
      currentTask: item,
      complexReport: false,
    });
  }
  addNewRemind() {
    console.warn("adding remind")
    this.scrollRemindListToTop()
    RemindRequest.CreateRemind({ ...this.state.currentRemind, id: uuid.v1() },
      this.props.event.about.title).then(() => {
        this.refs.task_creator.resetRemind()
        stores.Reminds.removeRemind(this.props.event.id,
          request.Remind().id).then(() => {
            this.updateData(this.state.currentRemind)
          })
      }).catch(() => {
        console.warn("an error occured while creating the remind")
      })
  }
  scrollRemindListToTop() {
    this.refs.RemindsList.scrollToEnd();
    this.refs.RemindsList.resetItemNumbers();
  }
  _keyExtractor = (item, index) => item.id;
  delay = 1;
  renderSharedRemind() {
    return (
      this.state.mounted && (
        <ShareFrame
          share={this.shareStore && this.shareStore.share}
          sharer={
            this.shareStore &&
            this.shareStore.share &&
            this.shareStore.share.sharer
          }
          date={
            this.shareStore &&
            this.shareStore.share &&
            this.shareStore.share.date
          }
          content={() => (
            <View style={{ width: "100%" }}>
              <TasksCard
                animate={this.animateUI}
                showMedia={this.showMedia.bind(this)}
                phone={stores.LoginStore.user.phone}
                mention={(itemer) => {
                  this.mention(itemer);
                }}
                delay={this.delay}
                markAsDone={(item) => this.markAsDone(item)}
                assignToMe={(item) => this.assignToMe(item)}
                showMembers={this.showMembers.bind(this)}
                showReport={this.showReport.bind(this)}
                removeMembers={this.removeMembers}
                updateRemind={(item) => this.updateRemind(item)}
                deleteRemind={this.removeRemind.bind(this)}
                item={
                  this.shareStore &&
                  this.shareStore.share &&
                  this.shareStore.share.remind
                }
              />
            </View>
          )}
        />
      )
    );
  }

  getRemindData = () => {
    let RemindData = stores.Reminds.Reminds
      ? stores.Reminds.Reminds[this.props.event_id]
      : [];
    return RemindData;
  };
  onChangedStatus(newStatus) {
    this.setState({
      currentRemind: { ...this.state.currentRemind, status: newStatus },
    });
  }
  updateRequestReportOnComplete() {
    this.setState({
      currentRemind: {
        ...this.state.currentRemind,
        must_report: this.state.currentRemind.must_report
          ? !this.state.currentRemind.must_report
          : true,
      },
    });
  }
  actionIndex = this.state.currentIndex ? this.state.currentIndex() : {}
  remindsActions =() => [
    {
      title:'Reply',
      callback:() => this.mention(this.state.remind),
      iconName:"reply",
      condition:() => true,
      iconType:"Entypo",
      color:colorList.replyColor
    },
    {
      title:'Share Remind',
      callback:() => this.share(),
      condition:() => true,
      iconName:"forward",
      iconType:"Entypo",
      color:colorList.indicatorColor
    },
    {
      title:"Members",
      callback: () => this.showReport(this.state.remind),
      condition:() => true,
      iconName:"ios-people",
      iconType:"Ionicons",
      color:colorList.likeActive
    },
    {
      title:"updateRemind",
      condition:() => this.actionIndex.creator || this.props.master,
      callback:() => this.updateRemind(this.state.remind),
      iconName:"history",
      iconType:"MaterialIcons",
      color:colorList.darkGrayText
    },
    {
      title:"Assign members",
      condition:() => this.props.master,
      callback:() => this.addMembers(uniqBy(this.state.remind.members,"phone"),this.state.remind),
      iconName: "addusergroup",
      iconType: "AntDesign",
      color:colorList.indicatorColor
    },{
      title: "Unassign members",
      condition:() => this.props.master,
      callback: () => this.removeMembers(uniqBy(this.state.remind.members.filter(ele => this.state.creator ||
        ele.phone === stores.LoginStore.user.phone)),this.state.remind),
      iconName:"deleteusergroup",
      iconType:"AntDesign",
      color:"orange"
    },
    {
      title:"Delete Remind",
      callback:() => this.removeRemind(this.state.remind),
      condition:() => this.props.master,
      iconName: "delete-forever",
      iconType: "MaterialCommunityIcons",
      color:colorList.delete
    }
  ]
  showRemindActions(remind,intervals,thisInterval,creator){
    this.setState({
      intervals,
      creator,
      actualInterval:thisInterval,
      showRemindActions:true,
      remind:remind
    })
  }
  render() {
    return (
      <View>
        {!this.props.shared ? this.renderReminds() : this.renderSharedRemind()}
        <TasksCreation
          CreateRemind={(remind) => {
            this.setState({
              currentRemind: remind,
              RemindCreationState: false,
              isExtra: true,
              TaskCreationExtra: true
            })
          }}
          ref={"task_creator"}
          starRemind={this.props.remind}
          master={this.props.master}
          event_id={this.props.event_id}
          update={this.state.update}
          remind_id={this.state.remind_id}
          isOpen={this.state.RemindCreationState}
          onClosed={(exernal) => {
           exernal && this.props.clearCurrentMembers();
            this.setState({
              RemindCreationState: false,
              remind_id: null,
              remind: null,
            });
          }}
          updateRemind={(remind) => {
            this.setState({
              currentRemind: remind,
              TaskCreationExtra: true,
              isExtra: true,
              RemindCreationState: false
            })
          }}
          working={this.props.working}
          currentMembers={this.props.currentMembers}
          stopLoader={this.props.stopLoader}
          startLoader={this.props.startLoader}
          event={this.props.event}
          eventRemindData={this.getRemindData()}
        />
        <SetAlarmPatternModal
          save={(alarms) => this.saveAlarms(alarms)}
          isOpen={this.state.isSelectAlarmPatternModalOpened}
          closed={() => {
            this.setState({
              isSelectAlarmPatternModalOpened: false,
            });
          }}
        />
        <TaskCreationExtra
          proceed={
            !this.state.update
              ? this.addNewRemind.bind(this)
              : this.sendUpdate.bind(this)
          }
          onChangedStatus={this.onChangedStatus.bind(this)}
          currentRemind={this.state.currentRemind || {}}
          onComplete={this.updateRequestReportOnComplete.bind(this)}
          isOpen={this.state.isExtra}
          onClosed={() => {
            this.setState({
              isExtra: false,
            });
          }}
        />
        <AddReport
          report={(report) => {
            this.markAsDoneWithReport(report);
          }}
          onClosed={() => {
            this.setState({
              showReportModal: false,
            });
          }}
          isOpen={this.state.showReportModal}
        />
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
            this.setState({
              isSelectableContactsModalOpened: false,
            });
          }}
        />
        <ContactListModal
          title={this.state.title}
          isOpen={this.state.isContactsModalOpened}
          onClosed={() => {
            this.setState({
              isContactsModalOpened: false,
            });
          }}
          complexReport={this.state.complexReport}
          actualInterval={this.state.actualInterval}
          contacts={this.state.contacts ? this.state.contacts : []}
        />
        <ReportTabModal
          concernees={this.state.members}
          confirmed={this.filterConfirmed.bind(this)}
          donners={this.filterDonners.bind(this)}
          intervals={this.state.intervals}
          confirm={this.confirm.bind(this)}
          master={
            this.state.currentTask && stores.LoginStore.user.phone === this.state.currentTask.creator
          }
          must_report={this.state.currentTask && this.state.currentTask.must_report}
          stopLoader={() => this.props.stopLoader()}
          actualInterval={this.state.actualInterval}
          complexReport={this.state.complexReport}
          changeComplexReport={() => {
            this.setState({
              complexReport: !this.state.complexReport,
            });
          }}
          onClosed={() => {
            this.setState({
              isReportModalOpened: false,
            });
          }}
          isOpen={this.state.isReportModalOpened}
        />
        <PhotoViewer
          open={this.state.showPhoto}
          photo={this.state.photo}
          hidePhoto={() => {
            this.setState({
              showPhoto: false,
            });
          }}
        />
        <VideoViewer
          video={this.state.video}
          isOpen={this.state.showVideo}
          hideVideo={() => {
            this.setState({
              showVideo: false,
            });
          }}
        />
        <AreYouSure
          isOpen={this.state.isAreYouModalOpened}
          title={"Delete Remind"}
          closed={() => {
            this.setState({
              isAreYouModalOpened: false,
            });
          }}
          ok={'Delete'}
          callback={() => {
            this.deleteRemind();
          }}
          message={"Are you sure you want to delete this remind?"}
        />
        <MessageActions
        title={"remind actions"}
        actions={this.remindsActions}
        isOpen={this.state.showRemindActions}
        onClosed={() => {
          this.setState({
            showRemindActions:false
          })
        }}
        >
        </MessageActions>
      </View>
    );
  }
  mention(itemer) {
    this.props.mention({
      id: itemer.id,
      replyer_phone: itemer.creator.phone,
      video: itemer.remind_url && itemer.remind_url.video ? true : false,
      audio:
        itemer.remind_url && !itemer.remind_url.video && itemer.remind_url.audio
          ? true
          : false,
      photo:
        itemer.remind_url && !itemer.remind_url.video && itemer.remind_url.photo
          ? true
          : false,
      sourcer:
        itemer.remind_url && itemer.remind_url.video
          ? itemer.remind_url.photo
          : itemer.remind_url && itemer.remind_url.photo
            ? itemer.remind_url.photo
            : itemer.remind_url && itemer.remind_url.audio
              ? itemer.remind_url.audio
              : null,
      type_extern: replies.reminds,
      title: itemer.title + ': \n' + itemer.description,
    });
  }
  showMedia = (url) => {
    if (url.video) {
      console.warn('showing video');
      this.setState({
        showVideo: true,
        video: url.video,
      });
    } else {
      this.setState({
        showPhoto: true,
        photo: url.photo,
      });
    }
  };
  showMembers = (members) => {
    this.setState({
      contacts: members,
      isContactsModalOpened: true,
      title: 'Concernees',
      complexReport: false,
    });
  };
  removeMembers = (currentMembers, item) => {
    this.setState({
      isSelectableContactsModalOpened: true,
      currentTask: item,
      contacts: currentMembers,
      adding: false,
      removing: true,
      notcheckAll: true,
    });
  };
  removeRemind = (item) => {
    this.setState({
      currentTask: item,
      isAreYouModalOpened: true,
    });
  };
  share(){

  }
  renderReminds() {
    return !this.state.mounted ? (
      <View style={{ width: "100%", height: "100%" }} />
    ) : (
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
                  alignItems: 'center',
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
                  <Icon
                    style={{ color: colorList.headerIcon }}
                    type={"MaterialIcons"}
                    name={"arrow-back"}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    width: "80%",
                    paddingLeft: "9%",
                    justifyContent: "center",
                    height: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Title
                    style={{
                      fontWeight: "bold",
                      alignSelf: "flex-start",
                      color: colorList.headerText,
                      fontSize: colorList.headerFontSize,
                    }}
                  >
                    {"Reminds"}
                  </Title>
                </View>

                <TouchableOpacity
                  style={{
                    width: "13%",
                    paddingRight: "3%",
                    height: "100%",
                    justifyContent: "center",
                  }}
                  onPress={() => requestAnimationFrame(() => this.AddRemind())}
                >
                  <Icon
                    type="AntDesign"
                    name="plus"
                    style={{ color: colorList.headerIcon, alignSelf: "center" }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: '92%' }}>
            <BleashupFlatList
              fit={this.props.fit}
              getItemLayout={(item,index) => GState.getItemLayout(item,index,this.getRemindData())}
              initialRender={6}
              ref="RemindsList"
              renderPerBatch={5}
              onScroll={this.props.onscroll}
              firstIndex={0}
              //showVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              dataSource={this.getRemindData()}
              renderItem={(item, index) => {
                this.delay = index >= 5 ? 0 : this.delay + 1;
                return (item.id == request.Remind().id ? null:
                    <TasksCard
                    onLayout={(layout) => GState.itemDebounce(item,() => {
                      stores.Reminds.persistDimenssion(index,item.event_id,layout)
                    },500)}
                      showRemindActions={(intervals,thisInterval,creator) => {
                        Vibrator.vibrateShort()
                        this.showRemindActions(item,intervals,thisInterval,creator)
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
                      key={index}
                    />
                );
              }}
              numberOfItems={this.getRemindData().length}
            />
          </View>
        </View>
      );
  }
}
