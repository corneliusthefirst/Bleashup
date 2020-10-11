import { observable, action, extendObservable, autorun, computed } from "mobx";
import ColorList from "../../components/colorList";
import replies from "../../components/myscreens/eventChat/reply_extern";
import stores from "..";
import Toaster from "../../services/Toaster";
import Texts from "../../meta/text";
import {  Dimensions,} from "react-native"
const { height, width } = Dimensions.get('window');

export default class globalState {
  constructor(){
    Dimensions.addEventListener('change', (e) => {
      const { width, height } = e.window;
      this.width = width 
      this.height = height
    })
  }
  @observable scrollOuter = true;
  @observable writing = false;
  @observable eventUpdated = false;
  @observable isScrolling = true;
  @observable loading = false;
  showingProfile = false;
  @observable currentID = null;
  @observable searchableMembers = [];
  editingCommiteeName = false;
  @observable error = false;
  @observable downlading = false;
  @observable newContribution = false;
  @observable connected = true;
  @observable initialized = false;
  @observable currentRoom = null;
  @observable lang = "en";
  profilePlaceHolder = require("../../../Images/images.jpeg");
  bleashupImage = require("../../../assets/bleashuptitle1.png");
  activity_place_holder = require("../../../assets/default_event_image.jpeg");
  @observable reply = null;
  @observable success = false;
  @observable previousCommitee = null;
  @observable socket = null;
  @observable DeepLinkURL = "http://bleashup.com/";
  @observable DeepLinkURLs = "https://bleashup.com/";
  @observable currentRoomNewMessages;
  @observable passwordError = false;
  @observable newPasswordError = false;
  @observable nav = {};
  waitToReply = 100;
  nameMaxLength = 40;
  @observable height = height
  @observable width = width
  @observable messageMediaWidth = width * .52
  animationsDeclared = false;
  @observable nameError = false;
  defaultIconSize = { fontSize: 30, color: ColorList.bodyIcon };
  defaultTextStyle = { fontSize: 13, color: ColorList.bodyText };
  @observable newEvent = false;
  @observable emailError = false;
  @observable generalNewMessages = [];
  @observable ageError = false;
  currentCommitee = "General";
  @observable invitationUpdated = true;
  @observable newHightlight = false;
  @observable newVote = false;
  @observable dateError = false;
  @observable timeError = false;
  confimResult = () => { };

  get newEvent() {
    return this.newEvent;
  }
  set newEvent(New) {
    this.newEvent = New;
  }
  get invitationUpdated() {
    return this.invitationUpdated;
  }
  set invitationUpdated(New) {
    this.invitationUpdated = New;
  }
  get newVote() {
    return this.newVote;
  }
  set newVote(New) {
    this.newVote = New;
  }
  get newHightlight() {
    return this.newHightlight;
  }
  set newHightlight(New) {
    this.newHightlight = New;
  }
  get scrollOuter() {
    return this.scrollOuter;
  }
  get eventUpdated() {
    return this.eventUpdated;
  }
  get newContribution() {
    return this.newContribution;
  }
  set newContribution(state) {
    this.newContribution = state;
  }

  set eventUpdated(newState) {
    this.eventUpdated = newState;
  }
  set scrollOuter(newValue) {
    this.scrollOuter = newValue;
  }
  @computed get continueScroll() {
    return true;
  }

  get loading() {
    return this.loading;
  }
  set loading(newValue) {
    this.loading = newValue;
  }

  get error() {
    return this.error;
  }
  set error(newValue) {
    this.error = newValue;
  }

  get success() {
    return this.success;
  }
  set success(newValue) {
    this.success = newValue;
  }

  get passwordError() {
    return this.passwordError;
  }
  set passwordError(newValue) {
    this.passwordError = newValue;
  }

  get newPasswordError() {
    return this.newPasswordError;
  }
  set newPasswordError(newValue) {
    this.newPasswordError = newValue;
  }

  get nameError() {
    return this.nameError;
  }
  set nameError(newValue) {
    this.nameError = newValue;
  }

  get emailError() {
    return this.emailError;
  }
  set emailError(newValue) {
    this.emailError = newValue;
  }

  get ageError() {
    return this.ageError;
  }
  set ageError(newValue) {
    this.ageError = newValue;
  }

  get dateError() {
    return this.dateError;
  }
  set dateError(newValue) {
    this.dateError = newValue;
  }

  get timeError() {
    return this.timeError;
  }
  layoutsTimeout = {};
  set timeError(newValue) {
    this.timeError = newValue;
  }
  listeners = {}
  addEventListners(id) {
    if (this.listeners[id] && this.listeners[id].length >= 0) {
      this.listeners[id] = this.listeners[id].concat([this.listeners[id].length])
    } else {
      this.listeners[id] = [0]
    }
  }
  removeListener(id) {
    this.listeners && this.listeners[id] && this.listeners[id].splice(-1, 1)

  }
  canStopListening(id) {
    if (!this.listeners[id] ||
      this.listeners[id].length <= 1) {
      return true
    } else {
      return false
    }
  }
  currentPage = null
  prepareStarForMention(replyer) {
    return {
      id: replyer.id,
      video: replyer.url && replyer.url.video ? true : false,
      audio:
        (!replyer.url || !replyer.url.video) && replyer.url && replyer.url.audio
          ? true
          : false,
      photo:
        (!replyer.url || !replyer.url.video) && replyer.url && replyer.url.photo
          ? true
          : false,
      sourcer: replyer.url && replyer.url.photo ? replyer.url.photo : null,
      title: `${replyer.title} : \n ${replyer.description}`,
      replyer_phone: stores.LoginStore.user.phone,
      //replyer_name: stores.LoginStore.user.name,
      change_date: replyer.created_at,
      type_extern: replies.posts,
    };
  }
  considerIvite() {
    Toaster({ text: Texts.unknow_user_consider_inviting });
  }
  prepareRemindsForMetion(itemer) {
    return {
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
      title: itemer.title + ": \n" + itemer.description,
      change_date: itemer.current_date,
    };
  }
  prepareDescriptionForMention(description, activity_id, creator) {
    return {
      id: activity_id,
      type_extern: replies.description,
      title:
        Texts.activity_description +
        ": \n" +
        (description || Texts.no_description),
      replyer_phone: creator,
    };
  }
  prepareActivityPhotoForMention(photo, activity_id, creator) {
    return {
      id: activity_id,
      type_extern: replies.activity_photo,
      photo: true,
      sent: true,
      title: Texts.activity_photo + ": \n",
      sourcer: photo,
    };
  }
  computeRemindType(type) {
    switch (type) {
      case replies.done:
        return;
    }
  }
  prepareMentionForRemindsMembers(data, remind) {
    let user = stores.TemporalUsersStore.Users[data.phone];
    return {
      id: remind.id,
      type_extern: data.type,
      photo: true,
      sourcer: user.profile,
      rounded: true,
      title: remind.title + ": \n" + user.nickname,
      change_date: data.status.date,
      [data.type]: data
    };
  }
  isUndefined(data) {
    return !data || data == "undefined" || data == "null";
  }
  getItemLayout(item, index, dataArray, defaultVal, newOffset) {
    let def = defaultVal || 70;
    let offset = dataArray
      ? dataArray
        .slice(0, index)
        .reduce(
          (a, b) =>
            a +
            (b.dimensions ? b.dimensions.height : def) +
            (newOffset || 0),
          0
        )
      : index * def;
    return {
      length: item.dimensions ? item.dimensions.height : def,
      offset: offset,
      index: index,
    };
  }
  itemDebounce(item, callback, delay) {
    if (this.layoutsTimeout[item.id])
      clearTimeout(this.layoutsTimeout[item.id]);
    this.layoutsTimeout[item.id] = setTimeout(() => {
      callback();
      this.layoutsTimeout[item.id] = null;
    }, delay || 500);
  }
  toogleWait = 5000;
  setPointedID(id){
    this.currentID = id
  }
  isPointed(id){
    return this.currentID === id 
   }
  toggleCurrentIndex(id, delay) {
    this.currentID = id;
    setTimeout(() => {
      this.currentID = "";
    }, delay || 2000);
  }
}
