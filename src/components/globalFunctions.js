import React, { Component } from "react";
import stores from "../stores";
import message_types from "./myscreens/eventChat/message_types";
import request from '../services/requestObjects';
import active_types from './myscreens/eventChat/activity_types';
import moment from 'moment';
import { format } from "../services/recurrenceConfigs";
import actFilterFunc from './myscreens/currentevents/activityFilterFunc';
import { reject, find } from 'lodash';

class Functions {
  constructor() { }
  bleashupSearch = (fieldArray, text) => {
    return new Promise((resolve, reject) => {
      const newData = fieldArray.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      resolve(newData);
    });
  };

  searchInActivities(fieldArray, text) {
    return fieldArray.filter((ele) => {
      const itemData =
        ele && ele.about && ele.about.title
          ? ele.about.title.toUpperCase()
          : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
  }

  bleashupSearchUser = (fieldArray, text) => {
    return new Promise((resolve, reject) => {
      const newData = fieldArray.filter(function (item) {
        const itemData = item.nickname
          ? item.nickname.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      resolve(newData);
    });
  };

  returnUserSearch(fieldArray, text) {
    return fieldArray.filter(function (item) {
      const itemData = item.nickname
        ? item.nickname.toUpperCase()
        : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
  }
  returnOponent(event) {
    return event && event.participant && event.participant.
      find(ele => ele && ele.phone !== stores.LoginStore.user.phone).phone
  }
  filterAllActivityAndRelation(event, text) {
    if (event) {
      text = (text && text.toLowerCase()) || ""
      if (event.type === active_types.relation) {
        let oponentPhone = this.returnOponent(event)
        let oponent = stores.TemporalUsersStore.Users[oponentPhone]
        return oponent && oponent.nickname && oponent.nickname.toLowerCase().includes(text)
      } else {
        return event.about && event.about.title && event.about.title.toLowerCase().includes(text)
      }
    } else {
      return false
    }
  }
  isMe(phone) {
    return phone === stores.LoginStore.user.phone;
  }
  /*getOponentSimple(participant){
     let oponent = participant.find(ele => ele.phone !== stores.LoginStore.user.phone)
      return stores.TemporalUsersStore.User.find((ele) => ele.phone === oponent.phone)
  }*/
  getOpponent = (event) => {
    return new Promise((resolve, reject) => {
      event.participant.forEach((participant) => {
        if (participant.phone != stores.LoginStore.user.phone) {
          stores.TemporalUsersStore.getUser(participant.phone).then((user) => {
            resolve(user);
          });
        }
      });
    });
  };
  filterForRelation(ele, search) {
    let name = ele && ele.nickname && ele.nickname.toLowerCase();
    name =
      name ||
      (ele && stores.TemporalUsersStore.Users[ele.phone] &&
        stores.TemporalUsersStore.Users[ele.phone].nickname.toLowerCase());
    return name && name.includes(search.toLowerCase()) ? true : false;
  }
  filterMessages(ele, search, isRelation) {
    const Relation = (message) => {
      return message && message.relation_type == active_types.activity
    }
    const userExist = (message) => {
      return stores.TemporalUsersStore.Users[message.item]
    }
    const returnName = (item) => {
      if (Relation(item) && userExist(item)) {
        return stores.TemporalUsersStore.Users[item.item].nickname
      }
      return item && item.name
    }
    if (ele && search && search.length > 0) {
      search = search.toLowerCase()
      let senderPhone = ele.sender && ele.sender.phone.replace && ele.sender.phone.replace("+", "00")
      let isText = (ele.text && ele.text.toLowerCase().includes(search))
      let isName = (returnName(ele) && ele.name.toLowerCase().includes(search))
      let user = senderPhone && senderPhone !== stores.LoginStore.user.phone &&
        stores.TemporalUsersStore.Users[senderPhone]
      let isUsername = user && user.nickname && user.nickname.toLowerCase().includes(search)
      return isText || (!isRelation && isUsername) || isName
    } else {
      return false
    }
  }
  byTitleAndDesc(ele, search) {
    search = search ? search.toLowerCase() : ""
    if (search) {
      return (search && (ele.title && ele.title.toLowerCase && ele.title.toLowerCase().includes(search) ||
        ele.description && ele.description.toLowerCase && ele.description.toLowerCase().includes(search)) ||
        (ele.location && ele.location.toLowerCase && ele.location.toLowerCase().includes(search)) ||
        (ele.members && ele.members.length && search.includes(ele.members.length.toString())))
    } else {
      return true
    }
  }
  filterStars(ele, search) {
    return ele && ele.id !== request.Highlight().id && this.byTitleAndDesc(ele, search)

  }
  filterReminds(ele, search) {
    return ele && ele.id !== request.Remind().id && this.byTitleAndDesc(ele, search)
  }
  filterHistory(ele, search) {
    if (ele && search && ele.type !== message_types.date_separator) {
      search = search.toLowerCase()
      let updater = typeof ele.updater == "object" ? stores.TemporalUsersStore.Users[ele.updater.phone] :
        stores.TemporalUsersStore.Users[ele.updater]
      let isLikeUpdater = updater && updater.nickname && updater.nickname.toLowerCase().includes(search)
      let likeUpdated = ele.changed && ele.changed.toLowerCase().includes(search)
      let likeTitle = ele.title && ele.title.toLowerCase().includes(search)
      return isLikeUpdater || likeUpdated || likeTitle
    } else {
      return false
    }
  }
  sortHighlights(a, b) {
    const formatThis = (ele, format) => moment(ele, format).format("x")
    return formatThis(a.created_at) <= formatThis(b.created_at) ? 1 : -1
  }
  sortReminds(reminds) {
    return reminds.sort(this.sortRemindValid).sort(this.sortRemind)
  }
  sortRemindValid(a, b) {
    const thisIntervalA = a && stores.Reminds.remindsIntervals && stores.Reminds.remindsIntervals[a.event_id] &&
      stores.Reminds.remindsIntervals[a.event_id][a.id]
      && stores.Reminds.remindsIntervals[a.event_id][a.id].correspondingDateInterval
    const thisIntervalB = b && stores.Reminds.remindsIntervals && stores.Reminds.remindsIntervals[b.event_id] &&
      stores.Reminds.remindsIntervals[b.event_id][b.id] &&
      stores.Reminds.remindsIntervals[b.event_id][b.id].correspondingDateInterval
    if (thisIntervalA && thisIntervalB) {
      return -1
    } else if (thisIntervalA && !thisIntervalB) {
      return -1
    }
    else if (!thisIntervalA && thisIntervalB) {
      return 1
    } else {
      return 0
    }
  }
  authorFirstWithouMe(members, author) {
    members = reject(
      [find(members, { phone: author }), ...reject(members, { phone: author }),
      ...reject(stores.Contacts.contacts.contacts, { phone: author })],
      { phone: stores.LoginStore.user.phone }
    ).filter(ele => ele);
    return members;
  }
  sortRemind(a, b) {
    const thisIntervalA = a && stores.Reminds.remindsIntervals &&
      stores.Reminds.remindsIntervals[a.event_id] &&
      stores.Reminds.remindsIntervals[a.event_id][a.id] &&
      stores.Reminds.remindsIntervals[a.event_id][a.id].correspondingDateInterval
    const formatThis = (ele, format) => moment(ele, format).format("x")
    const thisIntervalB = b && stores.Reminds.remindsIntervals &&
      stores.Reminds.remindsIntervals[b.event_id] &&
      stores.Reminds.remindsIntervals[b.event_id][b.id]
      && stores.Reminds.remindsIntervals[b.event_id][b.id].correspondingDateInterval
    const aStartDate = thisIntervalA ? formatThis(thisIntervalA.end, format) : 0
    const bStartDate = thisIntervalB ? formatThis(thisIntervalB.end, format) : 0
    if (bStartDate && aStartDate) {
      if (aStartDate < bStartDate) {
        return -1
      } else if (aStartDate > bStartDate) {
        return 1
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  sortActivityForRemindCreation() {
    const acts = stores.Events.events.filter(ele => actFilterFunc(ele) &&
      ele.type !== active_types.relation)
    const me = stores.LoginStore.user.phone
    const findMe = (act) => act.participant.find(ele => ele.phone == me)
    const isMeMaster = (act) => {
      let me = findMe(act)
      return me && me.master
    }
    const actTitle = a => (a && a.about && a.about.title) || ""
    const meCreator = act => act.creator_phone == me
    const actMembersCount = act => (act.participant && act.participant.length) || 0
    const sortByMembersCound = (a, b) => actMembersCount(a) >= actMembersCount(b) ? 1 : -1

    const sortByMaster = (a, b) => {
      const aMaster = isMeMaster(a)
      const bMaster = isMeMaster(b)
      if (aMaster || bMaster) {
        return 1
      } else {
        return -1
      }
    }
    const sortByCreator = (a, b) => {
      const aCreator = meCreator(a)
      const bCreator = meCreator(b)
      if (aCreator || bCreator) {
        return 1
      } else {
        return -1
      }
    }

    const sortByTitle = (a, b) => {
      const aTitle = actTitle(a)
      const bTitle = actTitle(b)
      if (aTitle >= bTitle) {
        return 1
      } else {
        return -1
      }
    }
    return acts.sort(sortByMaster).sort(sortByCreator).sort(sortByMembersCound)
  }
}

const globalFunctions = new Functions();
export default globalFunctions;
