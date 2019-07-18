import { observable, action, extendObservable, autorun, computed } from "mobx";

export default class globalState {
  @observable scrollOuter = true;
  @observable eventUpdated = false;
  @observable isScrolling = true;
  @observable loading = false;
  @observable error = false;
  @observable newContribution = false;
  @observable success = false;
  @observable passwordError = false;
  @observable newPasswordError = false;
  writing = false;
  @observable nameError = false;
  @observable newEvent = false;
  @observable emailError = false;
  @observable ageError = false;
  @observable invitationUpdated = true;
  @observable newHightlight = false;
  @observable newVote = false;

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
}
