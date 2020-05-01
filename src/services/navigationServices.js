import * as RootNav from "../RootNave"
import GState from '../stores/globalState/index';

class NavigatorClass {
    constructor() {
        this.navigation = GState.nav
    }
    navigateToActivity(tab, event) {
        GState.nav.navigate('Event', { Event: event, tab: tab })
    }
    navigateTo(page, param) {
        GState.nav.navigate(page, param)
    }
    pushTo(page, param){
        GState.nav.push(page, param)
    }
    pushActivity(event, page) {
        GState.nav.push('Event', { Event: event, tab: page || 'EventDetails' })
    }
    goBack() {
        GState.nav.goBack()
    }
}
const BeNavigator = new NavigatorClass()
export default BeNavigator
