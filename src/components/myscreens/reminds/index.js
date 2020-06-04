import React, { Component } from "react";
import {
  Icon,
  Item, Title, Spinner, Toast,
  Button,
} from "native-base";

import {
  StyleSheet, View, Image, TouchableOpacity, Dimensions, ToastAndroid,
  Platform,
  AlertIOS,
} from 'react-native';
import autobind from "autobind-decorator";
import TasksCard from "./TasksCard"
import stores from '../../../stores/index';
import BleashupFlatList from '../../BleashupFlatList';
import TasksCreation from './TasksCreation';
import { find, findIndex, uniqBy, reject, filter, concat, uniq } from "lodash";
import shadower from '../../shadower';
import RemindRequest from './Requester';
import emitter from '../../../services/eventEmiter';
import SetAlarmPatternModal from '../event/SetAlarmPatternModal';
import AddReport from "./AddReportModal";
import SelectableContactList from "../../SelectableContactList";
import ContactListModal from "../event/ContactListModal";
import ContactsReportModal from "./ContactsReportModal";
import AreYouSure from "../event/AreYouSureModal";
import moment from 'moment';
import { format } from "../../../services/recurrenceConfigs";
import {
  getcurrentDateIntervalsNoneAsync,
  getCurrentDateIntervalNonAsync,
  getcurrentDateIntervals,
  getCurrentDateInterval
} from "../../../services/getCurrentDateInterval";
import { confirmedChecker } from "../../../services/mapper";
import ReportTabModal from './NewReportTab';
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import { dateDiff } from "../../../services/datesWriter";
import colorList from '../../colorList';
import PhotoViewer from '../event/PhotoViewer';
import VideoViewer from "../highlights_details/VideoModal";
import ShareFrame from "../../mainComponents/ShareFram";
import Share from "../../../stores/share";
import request from "../../../services/requestObjects";
import replies from '../eventChat/reply_extern';
//const MyTasksData = stores.Reminds.MyTasksData

export default class Reminds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eventRemindData: [],
      mounted: false,
      newing: false,
      update: false,
      event_id: this.props.event_id,
      RemindCreationState: false
    }
    console.warn("running remind index con")
  }
  //manual event_id
  state = {}
  addMembers(currentMembers, item) {
    console.warn("pressing add contacts")
    this.setState({
      isSelectableContactsModalOpened: true,
      currentTask: item,
      adding: true,
      removing: false,
      notcheckAll: false,
      contacts: this.props.event.participant.filter(e => findIndex(currentMembers, { phone: e.phone }) < 0)
    })
  }
  saveAddMembers(members) {
    if (this.props.working) {
      Toast.show({ text: 'App is Busy' })
    } else {
      let newMembers = members.filter(ele => findIndex(this.state.currentTask.members, { phone: ele.phone }) < 0)
      if (newMembers.length > 0) {
        this.props.startLoader()
        console.warn(newMembers)
        RemindRequest.addMembers({ ...this.state.currentTask, members: newMembers }).then(() => {
          this.props.stopLoader()
          this.refreshReminds()
        }).catch((error) => {
          this.props.stopLoader()
        })
      } else {
        Toast.show({ text: 'member already exists' })
      }
    }
  }
  updateData(newremind) {
    //this.state.eventRemindData.unshift(newremind)
    let intervals = getcurrentDateIntervalsNoneAsync({
      start: moment(newremind.period).format(format),
      end: moment(newremind.recursive_frequency.recurrence).format(format)
    },
      newremind.recursive_frequency.interval,
      newremind.recursive_frequency.frequency,
      newremind.recursive_frequency.days_of_week)
    thisInterval = getCurrentDateIntervalNonAsync(intervals, moment().format(format))
    this.setState({
      eventRemindData: [{
        ...newremind, thisInterval, intervals
      }, ...this.state.eventRemindData]
    });
  }
  componentDidMount() {
    !this.props.shared ? this.initReminds() : this.initShared()
  }
  initShared() {
    this.shareStore = new Share(this.props.share.id)
    this.shareStore.readFromStore().then(() => {
      this.shareStore
        && this.shareStore.share
        && this.shareStore.share.event
        ? this.setState({
          mounted: true
        }) : null
    })
    stores.Reminds.loadRemindFromRemote(this.props.share.item_id).
      then((remind) => {
        stores.Events.loadCurrentEventFromRemote(this.props.share.event_id).then((event) => {
          this.shareStore.saveCurrentState({
            ...this.props.share,
            remind: Array.isArray(remind) ? remind[0] : remind,
            event
          }).then(() => {
            this.setState({
              mountedx: true,
              mounted: true
            })
          })
        }).catch(() => {
          console.warn("unable to fetch activity")
        })
      })
  }
  initReminds() {
    emitter.on('remind-updated', () => {
      this.refreshReminds()
    })
    results = []
    let intervals = []
    let thisInterval = {}
    stores.Reminds.loadReminds(this.props.event_id).then((Reminds) => {
      console.warn(Reminds);
      setTimeout(() => {
        this.setState({
          mounted: true,
          RemindCreationState: this.props.currentMembers ? true : false,
          eventRemindData: Reminds
        })
      })
    })
  }
  saveRemoved(members) {
    if (this.props.working) {
      Toast.show({ text: 'App is Busy' })
    } else {
      this.props.startLoader()
      RemindRequest.removeMembers(members.map(ele => ele.phone), this.state.currentTask.id,
        this.state.currentTask.event_id).then(() => {
          this.refreshReminds()
          this.props.stopLoader()
        }).catch(() => {
          this.props.stopLoader()
        })
    }
  }
  componentWillUnmount() {
    emitter.off('remind-updated')
  }

  @autobind
  AddRemind() {
    if (!this.props.computedMaster) {
      Toast.show({ text: "You don't have enough previlidges to add a remind", duration: 4000 })
    } else {
      this.setState({
        RemindCreationState: true,
        newing: !this.state.newing
      })
    }
  }
  sendUpdate(newRemind) {
    if (!this.props.working) {
      this.props.startLoader()
      RemindRequest.performAllUpdates(this.previousRemind, JSON.parse(newRemind)).then((res) => {
        if (res) {
          //Toast.show({ text: 'All updates applied', type: 'success' })
          let reminds = this.state.eventRemindData
          thisremind = findIndex(reminds, { id: JSON.parse(newRemind).id })
          reminds[thisremind] = JSON.parse(newRemind)
          this.setState({
            eventRemindData: reminds
          })
        }
        this.props.stopLoader()
      }).catch(() => {
        this.props.stopLoader()
      })
    } else {
      Toast.show({ text: 'App is Busy' })
    }
  }
  refreshReminds() {
    this.props.shared ?
      stores.Reminds.loadRemindFromRemote(this.props.share.item_id).then(remind => {
        this.shareStore.saveCurrentState({ ...this.shareStore.share, remind: Array.isArray(remind) ? remind[0] : remind }).then(() =>{
          this.setState({
            mountedx:!this.state.mountedx
          })
        })
      }) :
      stores.Reminds.loadReminds(this.props.event_id).then((Reminds) => {
        this.setState({
          eventRemindData: Reminds,
          currentTask: this.state.currentTask && find(Reminds, { id: this.state.currentTask.id })
        });
      })
  }

  updateRemind(data) {
    this.previousRemind = JSON.stringify(data)
    this.setState({
      RemindCreationState: true,
      update: true,
      newing: !this.state.newing,
      remind_id: data.id
    })
  }

  @autobind
  back() {
    this.props.navigation.navigate('Home');

  }
  assignToMe(item) {
    this.setState({
      isSelectAlarmPatternModalOpened: true,
      currentTask: item
    })
  }
  markAsDone(item) {
    if (this.props.working) {
      Toast.show({ text: 'App is Busy' })
    } else {
      if (item.must_report) {
        this.setState({
          showReportModal: true,
          currentTask: item
        })
      } else {
        this.props.startLoader()
        let member = find(item.members, { phone: stores.LoginStore.user.phone })
        RemindRequest.markAsDone([{
          ...member, status: {
            date: moment().format(),
            status: member.status
          }
        }], item, null).then((res) => {
          this.props.stopLoader()
          this.refreshReminds()
        }).catch((error) => {
          this.props.stopLoader()
        })
      }
    }
  }
  showToastMessage(message){
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT)
    } else {
      AlertIOS.alert(message);
    }
  }
  confirm(user) {
    if (this.props.working) {
      Toast.show({ text: 'App is Busy' })
    } else {

      if (findIndex(this.state.currentTask.confirmed,
        ele => confirmedChecker(ele, user.data.phone,
          { start: user.start, end: user.end })) >= 0) {
        this.showToastMessage("confirmed already!")
      
      } else {
        this.props.startLoader()
        RemindRequest.confirm([user.data],
          this.state.currentTask.id,
          this.state.currentTask.event_id).then((res) => {
            this.refreshReminds()
            this.props.stopLoader()
          }).catch(() => {
            this.showToastMessage('Unable to perform network request')
            this.props.stopLoader()
          })
      }
    }
  }
  markAsDoneWithReport(report) {
    if (this.props.working) {
      Toast.show({ text: 'App is Busy' })
    } else {
      this.setState({
        showReportModal: false
      })
      this.props.startLoader()
      let member = find(this.state.currentTask.members,
        { phone: stores.LoginStore.user.phone })
      RemindRequest.markAsDone([{
        ...member,
        status: {
          report: report,
          date: moment().format(),
          status: member.status
        }
      }], this.state.currentTask, null).then((res) => {
        this.props.stopLoader()
        this.refreshReminds()
      }).catch((error) => {
        this.props.stopLoader()
      })
    }

  }
  deleteRemind() {
    if (!this.props.working) {
      this.props.startLoader()
      RemindRequest.deleteRemind(this.state.currentTask.id,
        this.state.currentTask.event_id).then(() => {
          this.refreshReminds()
          this.props.stopLoader()
        }).catch(() => {
          this.props.stopLoader()
        })
    } else {
      Toast.show({ text: 'App is Busy' })
    }
  }
  saveAlarms(alarms) {
    if (this.props.working) {
      Toast.show({ text: 'App is Busy' })
    } else {
      this.props.startLoader()
      RemindRequest.addMembers({
        ...this.state.currentTask, members: [this.props.shared ? {...request.Participant(),
          phone: stores.LoginStore.user.phone,
          master: false, status: 'joint', host: stores.Session.SessionStore.host
        } :
          find(this.props.event.participant,
            { phone: stores.LoginStore.user.phone })]
      }, alarms).then(() => {
        this.props.stopLoader()
        this.refreshReminds()
      }).catch((error) => {
        this.props.stopLoader()
      })
    }
  }
  flatterarray(array, result, i) {
    if (array.length === i) return result
    result = [...result, ...array[i]]
    return this.flatterarray(array, result, i + 1)
  }
  @autobind showReport(item, intervals, thisInterval) {
    this.props.startLoader()
    let confirmed = intervals.map(ele => {
      temp = item.confirmed.filter(el => moment(el.status.date).format('X') >
        moment(ele.start, format).format("X") &&
        moment(el.status.date).format('X') <= moment(ele.end, format).format('X'))
      temp = [{ type: 'interval', from: ele.start, to: ele.end },
      ...temp.map(e => {
        return {
          data: e,
          start: ele.start, end: ele.end
        }
      })]
      return temp
    })
    let donners = intervals.map(ele => {
      temp = item.donners.filter(el => moment(el.status.date).format('X') >
        moment(ele.start, format).format("X") &&
        moment(el.status.date).format('X') <= moment(ele.end,
          format).format('X'))
      temp = [{
        type: 'interval', from: ele.start,
        to: ele.end
      }, ...temp.map(e => {
        return {
          data: e,
          start: ele.start, end: ele.end
        }
      })]
      return temp
    })
    let members = item.members.map(ele => ele.phone)
    this.setState({
      confirmed: this.flatterarray(confirmed, [], 0),
      members: uniq(members),
      actualInterval: thisInterval,
      isReportModalOpened: true,
      currentTask: item,
      donners: this.flatterarray(donners, [], 0),
      complexReport: false
    })
  }
  scrollRemindListToTop() {
    this.refs.RemindsList.scrollToEnd()
    this.refs.RemindsList.resetItemNumbers()
  }
  _keyExtractor = (item, index) => item.id
  delay = 1
  renderSharedRemind() {
    return this.state.mounted && <ShareFrame
      share={this.shareStore && this.shareStore.share}
      sharer={this.shareStore && this.shareStore.share && this.shareStore.share.sharer}
      date={this.shareStore && this.shareStore.share && this.shareStore.share.date}
      content={() => <View style={{width:"100%"}}>
        <TasksCard
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
          update={(data) => this.updateRemind(data)}
          deleteRemind={this.removeRemind.bind(this)}
          item={this.shareStore && this.shareStore.share && this.shareStore.share.remind}
        ></TasksCard>
      </View>}
    ></ShareFrame>
  }
  render() {
    return <View>
      {!this.props.shared ? this.renderReminds() : this.renderSharedRemind()}
      <TasksCreation
        master={this.props.master}
        event_id={this.props.event_id}
        update={this.state.update}
        RemindRequest={RemindRequest}
        remind_id={this.state.remind_id}
        updateData={(newRem) => this.updateData(newRem)}
        updateRemind={(data) => this.sendUpdate(data)}
        isOpen={this.state.RemindCreationState}
        onClosed={() => {
          this.props.clearCurrentMembers()
          this.setState({
            RemindCreationState: false, update: false,
            remind_id: null, remind: null
          })
        }}
        reinitializeList={() => this.scrollRemindListToTop()}
        working={this.props.working}
        currentMembers={this.props.currentMembers}
        stopLoader={this.props.stopLoader}
        startLoader={this.props.startLoader}
        event={this.props.event}
        eventRemindData={this.state.eventRemindData}></TasksCreation>
      {this.state.isSelectAlarmPatternModalOpened ? <SetAlarmPatternModal save={(alarms) => this.saveAlarms(alarms)} isOpen={this.state.isSelectAlarmPatternModalOpened} closed={() => {
        this.setState({
          isSelectAlarmPatternModalOpened: false
        })
      }}></SetAlarmPatternModal> : null}
      {this.state.showReportModal ? <AddReport report={(report) => {
        this.markAsDoneWithReport(report)
      }} onClosed={() => {
        this.setState({
          showReportModal: false
        })
      }} isOpen={this.state.showReportModal}></AddReport> : null}
      {this.state.isSelectableContactsModalOpened ? <SelectableContactList
        adding={this.state.adding}
        removing={this.state.removing}
        addMembers={(members) => {
          this.saveAddMembers(members)
        }}
        saveRemoved={(members) => this.saveRemoved(members)}
        members={this.state.contacts && this.state.contacts.length > 0 ? this.state.contacts : []}
        notcheckall={this.state.notcheckAll}
        isOpen={this.state.isSelectableContactsModalOpened} close={() => {
          this.setState({
            isSelectableContactsModalOpened: false
          })
        }}></SelectableContactList> : null}
      {this.state.isContactsModalOpened ? <ContactListModal
        title={this.state.title}
        isOpen={this.state.isContactsModalOpened}
        onClosed={() => {
          this.setState({
            isContactsModalOpened: false
          })
        }}
        complexReport={this.state.complexReport}
        actualInterval={this.state.actualInterval}
        contacts={this.state.contacts ? this.state.contacts : []}></ContactListModal> : null}
      {this.state.iscontactReportModalOpened ? <ContactsReportModal
        actualInterval={this.state.actualInterval}
        must_report={this.state.currentTask.must_report}
        master={stores.LoginStore.user.phone === this.state.currentTask.creator}
        confirm={(user) => this.confirm(user)}
        isOpen={this.state.iscontactReportModalOpened}
        members={this.state.contacts}
        onClosed={() => {
          this.setState({
            iscontactReportModalOpened: false
          })
        }}></ContactsReportModal> : null}
      {this.state.isReportModalOpened ? <ReportTabModal
        concernees={this.state.members}
        confirmed={this.state.confirmed}
        donners={this.state.donners}
        confirm={e => this.confirm(e)}
        master={stores.LoginStore.user.phone === this.state.currentTask.creator}
        must_report={this.state.currentTask.must_report}
        stopLoader={() => this.props.stopLoader()}
        actualInterval={this.state.actualInterval}
        complexReport={this.state.complexReport}
        changeComplexReport={() => {
          this.setState({
            complexReport: !this.state.complexReport
          })
        }}
        onClosed={() => {
          this.setState({
            isReportModalOpened: false
          })
        }}
        isOpen={this.state.isReportModalOpened}
      ></ReportTabModal> : null}
      <PhotoViewer open={this.state.showPhoto} photo={this.state.photo} hidePhoto={() => {
        this.setState({
          showPhoto: false
        })
      }}>
      </PhotoViewer>
      <VideoViewer video={this.state.video} isOpen={this.state.showVideo} hideVideo={() => {
        this.setState({
          showVideo: false
        })
      }}></VideoViewer>
      {this.state.isAreYouModalOpened ? <AreYouSure isOpen={this.state.isAreYouModalOpened}
        title={'Delete Remind'} closed={() => {
          this.setState({
            isAreYouModalOpened: false
          })
        }}
        ok={"Delete"}
        callback={() => {
          this.deleteRemind()
        }}
        message={"Are you sure you want to delete this remind?"}></AreYouSure> : null}
    </View>
  }
  mention(itemer) {
    this.props.mention({
      id: itemer.id,
      replyer_phone: itemer.creator.phone,
      video:
        itemer.remind_url && itemer.remind_url.video
          ? true
          : false,
      audio:
        itemer.remind_url &&
          !itemer.remind_url.video &&
          itemer.remind_url.audio
          ? true
          : false,
      photo:
        itemer.remind_url &&
          !itemer.remind_url.video &&
          itemer.remind_url.photo
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
      title: itemer.title + ": \n" + itemer.description,
    })
  }
  showMedia = (url) => {
    if (url.video) {
      console.warn("showing video");
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
  }
  showMembers = (members) => {
    this.setState({
      contacts: members,
      isContactsModalOpened: true,
      title: "Concernees",
      complexReport: false,
    });
  }
  removeMembers = (currentMembers, item) => {
    this.setState({
      isSelectableContactsModalOpened: true,
      currentTask: item,
      contacts: currentMembers,
      adding: false,
      removing: true,
      notcheckAll: true,
    });
  }
  removeRemind = (item) => {
    this.setState({
      currentTask: item,
      isAreYouModalOpened: true,
    });
  }
  renderReminds() {
    return !this.state.mounted ? <View style={{ width: '100%', height: '100%', }}></View> : (
      <View style={{ width: '100%', height: '100%', }}>
      
        <View style={{ height: colorList.headerHeight, width: '100%'  }}>
          
          <View style={{
            ...bleashupHeaderStyle,
            backgroundColor: colorList.headerBackground,
            flexDirection: "row", alignItems: "center",
          }}>

            <View style={{ width: '10%', paddingLeft: '3%',height:"100%",justifyContent:"center" }}>
              <Icon onPress={this.props.goback}
                style={{ color: colorList.headerIcon }}
                type={"MaterialIcons"} name={"arrow-back"}></Icon>
            </View>

            <View style={{ width: '67%', paddingLeft: '9%', justifyContent: "center",height:"100%",justifyContent:"center" }}>
              <Title style={{ fontWeight: 'bold', alignSelf: 'flex-start', color: colorList.headerText,
              fontSize: colorList.headerFontSize, }}>{"Reminds"}</Title>
            </View>

            <View style={{ width: '13%', paddingRight: '3%',height:"100%",justifyContent:"center" }}>
              <Icon onPress={() => requestAnimationFrame(() => this.AddRemind())} type='AntDesign'
                name="plus" style={{ color: colorList.headerIcon, alignSelf: 'center', }} />
            </View>

            {/*<View style={{ width: '10%', paddingLeft: '1%',height:"100%",justifyContent:"center" }}>
              <Icon onPress={() => {
                this.props.openMenu()
              }} style={{ color: colorList.headerIcon }} type={"Ionicons"} name={"ios-menu"}></Icon>
            </View>*/}

          </View>
          
        </View>

        <View style={{ height: "93%", }}>
          <BleashupFlatList
            initialRender={5}
            ref="RemindsList"
            renderPerBatch={5}
            //onScroll={this._onScroll}
            firstIndex={0}
            //showVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            dataSource={this.state.eventRemindData}
            renderItem={(item, index) => {
              this.delay = index >= 5 ? 0 : this.delay + 1
              return (
                <View>
                  <TasksCard
                    showMedia={this.showMedia.bind(this)}
                    isLast={index === this.state.eventRemindData.length - 1}
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
                  ></TasksCard>
                </View>
              );
            }}
            numberOfItems={this.state.eventRemindData.length}
          >
          </BleashupFlatList>
        </View>
      </View>


    )
  }

}