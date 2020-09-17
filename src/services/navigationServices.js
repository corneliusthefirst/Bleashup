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
    resetPushingState(key){
        delete this.pushing[key]
    }
    sayPushing(key){
        this.pushing[key] = true
    }
    pushWaite = 2000
    pushing = {}
    pushTimeoutRef = {}
    waitAfterPush(key){
        this.pushTimeoutRef[key] = setTimeout(() => this.resetPushingState(key), this.pushWaite)
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
    pushRoute(route,params,key){
        if(this.pushing[key]){
            clearTimeout(this.pushTimeoutRef[key])
            this.waitAfterPush(key)
            
        }else{
            this.sayPushing(key)
            this.push(route,params)
            this.waitAfterPush(key)
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
    gotoChangeLogs(event,options){
        this.pushActivity(event,"ChangeLogs",options)
    }
    gotoRemindsWithIndex(event,id,withReply,options) {
        GState.toggleCurrentIndex(id, 7000)
        this.pushActivity(event, "Reminds", { id, 
            reply: withReply ? () => this.handleReply(event) :null,...options })
    }
    goToRemind(event,withReply){
        this.pushActivity(event, "Reminds", {
            reply: withReply ? () => this.handleReply(event) : null
        })
    }
    gotoStarWithIndex(event, id, withReply) {
        GState.toggleCurrentIndex(id, 7000)
        this.pushActivity(event, "EventDetails", {
            id, reply: withReply ? () => this.handleReply(event): null })
    }
    goToChatWithIndex(event,id){
        GState.toggleCurrentIndex(id,5000)
        this.pushActivity(event,"EventChat",{id})
    }
    sayCloseAllModals(){
        emitter.emit(close_all_modals)
        
    }
    openPhoto(url,hideActions,date,callback){
       // this.sayCloseAllModals()
        this.pushRoute('PhotoViewer', { 
            photo: url,
            date,
            hideActions: hideActions||false,
            callback
        })
    }
    pushTo(page, param){
        this.pushRoute(page,param,page)
    }
    pushActivity(event, page,options) {
        page = page || 'EventDetails'
        this.pushRoute('Event', { Event: event, tab: page, ...options },`Event/${page}`)
    }
    navigateToContacts(){
        this.navigateTo("Contacts")
    }
    navigateToQR(){
        this.navigateTo("QR")
    }
    navigateToCreateEvent(){
        this.navigateTo("CreateEventView")
    }
    goBack() {
        GState.nav.goBack()
    }
}
const BeNavigator = new NavigatorClass()
export default BeNavigator
