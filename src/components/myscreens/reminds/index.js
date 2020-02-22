import React, { Component } from "react";
import {
  Icon,
  Item, Title, Spinner, Toast,
  Button,
} from "native-base";

import { StyleSheet, View, Image, TouchableOpacity, Dimensions } from 'react-native';
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
import BleashupScrollView from '../../BleashupScrollView';
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
      contacts: this.props.event.participant.filter(e => findIndex(currentMembers, { phone: e.phone }) < 0 && e.phone !== stores.LoginStore.user.phone)
    })
  }
  saveAddMembers(members) {
    if (this.props.working) {
      Toast.show({ text: 'App is Busy' })
    } else {
      let newMembers = members.filter(ele => findIndex(this.state.currentTask.members, { phone: ele.phone }) < 0)
      if (newMembers.length > 0) {
        this.props.startLoader()
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
    this.setState({
      eventRemindData: [newremind, ...this.state.eventRemindData]
    });
  }

  componentDidMount() {
    emitter.on('remind-updated', () => {
      this.refreshReminds()
    })
    stores.Reminds.loadReminds(this.props.event_id).then((Reminds) => {
      setTimeout(() => {
        this.setState({ eventRemindData: Reminds, mounted: true });
      }, 100)
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
    console.warn('receiving updated remind message')
    stores.Reminds.loadReminds(this.props.event_id).then((Reminds) => {
      //console.warn(Reminds)
      this.setState({ eventRemindData: Reminds });
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
    console.warn(item)
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
        RemindRequest.markAsDone([find(item.members, { phone: stores.LoginStore.user.phone })], item, null).then((res) => {
          this.props.stopLoader()
          this.refreshReminds()
        }).catch((error) => {
          this.props.stopLoader()
        })
      }
    }
  }
  confirm(user) {
    if (this.props.working) {
      Toast.show({ text: 'App is Busy' })
    } else {

      if (findIndex(this.state.currentTask.confirmed, { phone: user.phone }) >= 0) {
        Toast.show({ text: 'Task Completion Has Already Been Confirmed', duration: 5000 })
      } else {
        this.props.startLoader()
        RemindRequest.confirm([user], this.state.currentTask.id, this.state.currentTask.event_id).then((res) => {
          this.refreshReminds()
          this.props.stopLoader()
        }).catch(() => {
          this.props.stopLoader()
        })
      }
    }
  }
  markAsDoneWithReport(report) {
    if (this.props.working) {
      Toast.show({ text: 'App is Busy' })
    } else {
      console.warn(report)
      this.setState({
        showReportModal: false
      })
      this.props.startLoader()
      RemindRequest.markAsDone([{
        ...find(this.state.currentTask.members,
          { phone: stores.LoginStore.user.phone }),
        status: report
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
      RemindRequest.deleteRemind(this.state.currentTask.id, this.state.currentTask.event_id).then(() => {
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
        ...this.state.currentTask, members: [find(this.props.event.participant,
          { phone: stores.LoginStore.user.phone })]
      }, alarms).then(() => {
        this.props.stopLoader()
        this.refreshReminds()
      }).catch((error) => {
        this.props.stopLoader()
      })
    }
  }
  _keyExtractor = (item, index) => item.id
  delay = 1
  render() {

    return !this.state.mounted ? <Spinner size={'small'}></Spinner> : (

      <View style={{ backgroundColor: '#FEFFDE' }}>
        <View style={{ height: "6%", width: "100%", padding: "2%", justifyContent: "space-between", flexDirection: "row", backgroundColor: "#FEFFDE", alignItems: "center", ...shadower() }}>
          <View>
            <Title style={{ fontSize: 20, fontWeight: 'bold', ...shadower() }}>{"Reminds"}</Title>
          </View>

          <View style={{ ...shadower()}}>
            <TouchableOpacity onPress={() => requestAnimationFrame(() => this.AddRemind())}>
              <Icon type='AntDesign' name="pluscircle" style={{ color: "#1FABAB", ...shadower() }} />
            </TouchableOpacity>
          </View>

        </View>
        <View style={{ height: "93%", }}>
          <BleashupFlatList
            initialRender={5}
            renderPerBatch={5}
            //onScroll={this._onScroll}
            firstIndex={0}
            //showVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            dataSource={this.state.eventRemindData}
            renderItem={(item, index) => {
              this.delay = index >= 5 ? 0 : this.delay + 1
              return (
                <View key={index}>
                  <TasksCard
                    isLast={index === this.state.eventRemindData.length - 1}
                    phone={stores.LoginStore.user.phone}
                    mention={itemer => {
                      this.props.mention({
                        id: itemer.id,
                        replyer_phone: itemer.creator.phone,
                        //replyer_name: itemer.creator.nickname,
                        type_extern: 'Reminds ',
                        title: itemer.title + ': \n' + itemer.description
                      })
                    }}
                    master={this.props.master}
                    markAsDone={(item) => this.markAsDone(item)}
                    assignToMe={(item) => this.assignToMe(item)}
                    calendar_id={this.props.event.calendar_id}
                    delay={this.delay}
                    addMembers={(currentMembers, item) =>
                      this.addMembers(currentMembers, item)}
                    showMembers={(members) => {
                      this.setState({
                        contacts: members,
                        isContactsModalOpened: true,
                        title: 'Concernees'
                      })
                    }}
                    showDonners={(members, iteme) => {
                      this.setState({
                        iscontactReportModalOpened: true,
                        currentTask: item,
                        contacts: members
                      })
                    }}
                    showConfirmed={(members, item) => {
                      this.setState({
                        isContactsModalOpened: true,
                        title: 'Comfirmed Completion',
                        contacts: members
                      })
                    }}
                    removeMembers={(currentMembers, item) => {
                      let contacts = currentMembers.filter(ele => findIndex(item.donners, { phone: ele.phone }) < 0)
                      this.setState({
                        isSelectableContactsModalOpened: true,
                        currentTask: item,
                        contacts: item.creator === stores.LoginStore.user.phone ?
                          contacts : contacts.filter(ele => ele.phone === stores.LoginStore.user.phone),
                        adding: false,
                        removing: true,
                        notcheckAll: true,
                      })
                    }}
                    updateRemind={(item) => this.updateRemind(item)}
                    update={(data) => this.updateRemind(data)}
                    deleteRemind={(item) => {
                      this.setState({
                        currentTask: item,
                        isAreYouModalOpened: true,
                      })
                    }}
                    item={item} key={index}>
                  </TasksCard>
                </View>
              );
            }}
            numberOfItems={this.state.eventRemindData.length}
          >
          </BleashupFlatList>


        </View>

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
            this.setState({
              RemindCreationState: false, update: false,
              remind_id: null, remind: null
            })
          }}
          working={this.props.working}
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
          members={uniqBy(this.state.contacts ? this.state.contacts : [], ['phone'])}
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
          contacts={uniq(this.state.contacts ? this.state.contacts.map(ele => ele.phone) : [])}></ContactListModal> : null}
        {this.state.iscontactReportModalOpened ? <ContactsReportModal
          must_report={this.state.currentTask.must_report}
          master={this.props.computedMaster}
          confirm={(user) => this.confirm(user)}
          isOpen={this.state.iscontactReportModalOpened}
          members={this.state.contacts}
          onClosed={() => {
            this.setState({
              iscontactReportModalOpened: false
            })
          }}></ContactsReportModal> : null}
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
          message={"Are You Sure You Want To Delete This Remind?"}></AreYouSure> : null}
      </View>


    )
  }

}