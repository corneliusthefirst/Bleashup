import * as RootNav from "../RootNave"
import GState from '../stores/globalState/index';
import emitter from './eventEmiter';
import { close_all_modals } from '../meta/events';

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
    pushActivityWithIndex(activity,data){
        if(data){
            if (data.message_id) {
                this.goToChatWithIndex(activity, data.message_id)
            } else if (data.remind_id) {
                this.gotoRemindsWithIndex(activity, data.remind_id, true)
            } else if (data.post_id) {
                this.gotoStarWithIndex(activity, data.post_id, true)
            } else {
                this.pushActivity(activity)
            } 
        }else{
            this.pushActivity(activity)
        }
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
        //this.sayCloseAllModals()
        this.pushRoute("Video",{
            video:url,
            date
        })
    }
    handleReply(event){
        setTimeout(() => this.pushActivity(event, "EventChat"), GState.waitToReply)
    }
    gotoRemindsWithIndex(event,id,withReply) {
        GState.toggleCurrentIndex(id, 5000)
        this.pushActivity(event, "Reminds", { id, 
            reply: withReply ? () => this.handleReply(event) :null })
    }
    gotoStarWithIndex(event, id, withReply) {
        GState.toggleCurrentIndex(id, 2000)
        this.pushActivity(event, "EventDetails", {
            id, reply: withReply ? () => this.handleReply(event): null })
    }
    goToChatWithIndex(event,id){
        GState.toggleCurrentIndex(id,5000)
        this.pushActivity(event,"EventChat",{id})
    }
    sayCloseAllModals(){
        setTimeout(() => {
            emitter.emit(close_all_modals)
        })
    }
    openPhoto(url,hideActions,date,callback){
        //this.sayCloseAllModals()
        this.pushRoute('PhotoViewer', { 
            photo: url,
            date,
            hideActions: hideActions||false,
            callback
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
