import { observable, action, extendObservable, autorun, computed } from "mobx";
import ColorList from "../../components/colorList";
import replies from "../../components/myscreens/eventChat/reply_extern";
import stores from "..";
import Toaster from "../../services/Toaster";
import Texts from "../../meta/text";
import { Dimensions, Platform, NativeModules } from "react-native"
import shadower from "../../components/shadower";
import active_types from '../../components/myscreens/eventChat/activity_types';
const { height, width } = Dimensions.get('window');
import * as configs from "../../config/bleashup-server-config.json"
import moment from 'moment';
const { fs } = rnFetchBlob;
import rnFetchBlob from 'rn-fetch-blob';
const AppDir = rnFetchBlob.fs.dirs.DownloadDir + '/BeUp';
const PhotoDir = AppDir + '/Photo';
const SounDir = AppDir + '/Sound';
const VideoDir = AppDir + '/Video';
const OthersDir = AppDir + '/Others';
import { containsAudio, containsPhoto, containsVideo, containsFile } from "../../components/myscreens/event/createEvent/components/mediaTypes.service";
const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
    NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier;
const lan = deviceLanguage && deviceLanguage.includes('fr') ? 'fr' : 'en'
export { AppDir, PhotoDir, SounDir, VideoDir, OthersDir }
export default class globalState {
  constructor() {
    this.lang = lan
    Dimensions.addEventListener('change', (e) => {
      const { width, height } = e.window;
      this.width = width
      this.height = height
    })
  }
  setBeroute(nav) {
    this.nav = nav
  }
  @observable scrollOuter = true;
  @observable writing = false;
  @observable isDarkMode = true
  toMB(data) {
    const divider = 1000 * 1000
    return data / divider
  }
  returnItem(item){
    return Array.isArray(item)?item[0]:item
  }
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
  profilePlaceHolder = require("../../../Images/images.webp");
  bleashupImage = require("../../../assets/bleashuptitle1.webp");
  activity_place_holder = require("../../../assets/default_event_image.webp");
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
  waitToReply = 200;
  nameMaxLength = 40;
  @observable height = height
  @observable width = width
  @observable messageMediaWidth = width * .52
  animationsDeclared = false;
  @observable nameError = false;
  defaultIconSize = { fontSize: 30, color: ColorList.bodyIcon, };
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
  alreadyListening(id) {
    return this.listeners[id] && this.listeners[id].length > 0
  }
  removeListener(id) {
    this.listeners && this.listeners[id] && this.listeners[id].splice(-1, 1)

  }
  descriptBoxStyle = {
    margin: '6%',
    alignSelf: 'center',
    width: '90%',
    padding: '2%',
    borderRadius: 6,
    ...shadower(1),
    backgroundColor: ColorList.descriptionBody,
    flexDirection: 'column',

  }
  imageBackgroundContainer = {
    resizeMode: 'cover',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  }
  buttonStyle = {
    borderRadius: 10,
    ...shadower(2),
    backgroundColor: ColorList.descriptionBody,
    padding: 5,
    marginRight: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row'

  }
  buttonTextStyle = {
    ...this.defaultTextStyle,
    color: ColorList.indicatorColor,
    fontWeight: 'bold',
  }
  baseURL = configs.file_server.protocol +
    "://" + configs.file_server.host + ":" + configs.file_server.port
  @observable backgroundImage = (stores && stores.States && stores.States.states && stores.States.states.app_background) || this.defaultBackground
  defaultBackground = require('../../../assets/chat_screen.webp')
  featureBoxTitle = {
    ...this.defaultTextStyle,
    fontSize: 20,
    color: ColorList.indicatorColor,
    fontWeight: 'bold',
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
      video: containsVideo(replyer.url) ? true : false,
      audio: containsAudio(replyer.url) ? true : false,
      photo: containsPhoto(replyer.url) ? true : false,
      file: containsFile(replyer.url) ? true : false,
      sourcer: replyer.url ? replyer.url.photo ||
        replyer.url.video ? replyer.url.photo :
        replyer.url.source : null,
      title: `${replyer.title} : \n ${replyer.description}`,
      duration: replyer.url && replyer.url.duration,
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
      video: containsVideo(itemer.remind_url) ? true : false,
      audio: containsAudio(itemer.remind_url) ? true : false,
      photo: containsPhoto(itemer.remind_url) ? true : false,
      file: containsFile(itemer.remind_url) ? true : false,
      duration: itemer.remind_url && itemer.remind_url.duration,
      sourcer:
        itemer.remind_url ? itemer.remind_url.video || itemer.remind_url.photo
          ? itemer.remind_url.photo
          : itemer.remind_url.source : null,
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
  prepareActivityPhotoForMention(photo, activity_id, creator, type) {
    return {
      id: activity_id,
      type_extern: replies.activity_photo,
      photo: true,
      replyer_phone: creator,
      sent: true,
      title: (type == active_types.relation ? Texts.profile_photo : Texts.activity_photo) + ": \n",
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
      from_activity: remind.event_id,
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
  calculateRemindType(remind) {
    return remind.location ||
      (remind.remind_url && remind.remind_url.photo) ||
      remind.description ||
      (remind.remind_url && remind.remind_url.video) ||
      (remind.remind_url && remind.remind_url.source)
      ? "event"
      : "reminder";
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
  setPointedID(id) {
    this.currentID = id
  }
  isPointed(id) {
    return this.currentID === id
  }
  toggleCurrentIndex(id, delay) {
    this.currentID = id;
    setTimeout(() => {
      this.currentID = "";
    }, delay || 2000);
  }
}
