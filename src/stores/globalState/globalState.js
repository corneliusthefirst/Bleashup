import {
    observable,
    action,
    extendObservable,
    autorun,
    computed
} from 'mobx'

export default class globlaState {
    @observable scrollOuter = true
    @observable isScrolling = true

    get scrollOuter() {
        return this.scrollOuter
    }
    set scrollOuter(newValue) {
        this.scrollOuter = newValue
    }
    @computed get continueScroll() {
        return true
    }
}
