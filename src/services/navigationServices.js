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
    resetPushingState(){
        this.pushing = false
    }
    sayPushing(){
        this.pushing = true
    }
    pushWaite = 2000
    pushing = false
    pushTimeoutRef = null 
    waitAfterPush(){
        this.pushTimeoutRef = setTimeout(() => this.resetPushingState(), this.pushWaite)
    }
    push(route,params){
        GState.nav.push(route, params)
    }
    pushRoute(route,params){
        if(this.pushing){
            clearTimeout(this.pushTimeoutRef)
            this.waitAfterPush()
            
        }else{
            this.sayPushing()
            this.push(route,params)
            this.waitAfterPush()
        }
    }
    openVideo(url,date){
        this.pushRoute("Video",{
            video:url,
            date
        })
    }
    gotoRemindsWithIndex(event,id) {
        GState.toggleCurrentIndex(id, 5000)
        this.pushActivity(event, "Reminds", { id })
    }
    gotoStarWithIndex(event,id) {
        GState.toggleCurrentIndex(id, 2000)
        BeNavigator.pushActivity(event, "EventDetails", { id })
    }
    openPhoto(url,hideActions,date){
        this.pushRoute('PhotoViewer', { 
            photo: url,
            date,
            hideActions: hideActions||false
        })
    }
    pushTo(page, param){
        this.pushRoute(page,param)
    }
    pushActivity(event, page,options) {
        this.pushRoute('Event', { Event: event, tab: page || 'EventDetails', ...options })
    }
    goBack() {
        GState.nav.goBack()
    }
}
const BeNavigator = new NavigatorClass()
export default BeNavigator
