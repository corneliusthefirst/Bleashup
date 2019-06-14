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
        this.loading = newValue
    }


}
