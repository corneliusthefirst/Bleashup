import * as RootNav from "../RootNave"
import GState from '../stores/globalState/index';
import emitter from './eventEmiter';
import { close_all_modals } from '../meta/events';
import ActivityPages from '../components/myscreens/eventChat/chatPages';

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
        setTimeout(() => this.pushToChat(event,{}), GState.waitToReply)
    }
    gotoChangeLogs(event,options){
        this.pushActivity(event,ActivityPages.logs,options)
    }
    gotoRemindsWithIndex(event,id,withReply,options) {
        //GState.toggleCurrentIndex(id, 7000)
        GState.setPointedID(id)
        this.pushActivity(event, ActivityPages.reminds, { id, 
            reply: withReply ? (reply) => this.handleReply(event) :null,...options })
    }
    goToRemind(event,withReply){
        this.pushActivity(event, ActivityPages.reminds, {
            reply: withReply ? (reply) => this.handleReply(event) : null
        })
    }
    gotoStarWithIndex(event, id, withReply) {
        //GState.toggleCurrentIndex(id, 7000)
        GState.setPointedID(id)
        this.pushActivity(event, ActivityPages.starts, {
            id, reply: withReply ? (reply) => this.handleReply(event): null })
    }
    goToChatWithIndex(event,id){
        //GState.toggleCurrentIndex(id,5000)
        GState.setPointedID(id)
        this.pushToChat(event,ActivityPages.chat,{id})
    }
    sayCloseAllModals(){
        emitter.emit(close_all_modals)
        
    }
    openPhoto(url,hideActions,date,callback){
       // this.sayCloseAllModals()
        let route = 'PhotoViewer'
        this.pushRoute(route, { 
            photo: url,
            date,
            hideActions: hideActions||false,
            callback
        },route)
    }
    pushTo(page, param){
        this.pushRoute(page,param,page)
    }
    leave_route_event = "leave_route"
    pushToChat(event,options){
        emitter.emit(this.leave_route_event)
        setTimeout(() => {
            this.pushActivity(event, ActivityPages.chat, options)
        })
    }
    pushActivity(event, page,options) {
        page = page || ActivityPages.chat
        this.pushRoute('Event', { Event: event, tab: page, ...options }, `Event/${page}`)
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
    gotoStarDetail(post_id,activity_id,more){
        let route = "StarDetail"
        this.pushRoute(route,{post_id,activity_id,...more},route)
    }
    goToRemindDetail(remind_id,activity_id,more){
        let route = "RemindDetail"
        this.pushRoute(route,{remind_id,activity_id,...more},route)
    }
    goBack() {
        GState.nav.goBack()
    }
}
const BeNavigator = new NavigatorClass()
export default BeNavigator
