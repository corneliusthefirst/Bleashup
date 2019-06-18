import {
    observable,
    action,
    extendObservable,
    autorun,
    computed
} from 'mobx'

export default class globalState {
    @observable scrollOuter = true
    @observable isScrolling = true
    @observable loading = false;
    @observable error = false;
    @observable success = false;
    @observable passwordError=false;
    @observable newPasswordError=false;

    get scrollOuter() {
        return this.scrollOuter
    }
    set scrollOuter(newValue) {
        this.scrollOuter = newValue
    }
    @computed get continueScroll() {
        return true
    }


    get loading() {
        return this.loading
    }
    set loading(newValue) {
        this.loading= newValue
    }

    get error() {
        return this.error
    }
    set error(newValue) {
        this.error = newValue
    }

    get success() {
        return this.success
    }
    set success(newValue) {
        this.success = newValue
    }

    get passwordError() {
        return this.passwordError
    }
    set passwordError(newValue) {
        this.passwordError = newValue
    }

    get newPasswordError() {
        return this.newPasswordError
    }
    set newPasswordError(newValue) {
        this.newPasswordError = newValue
    }


}
