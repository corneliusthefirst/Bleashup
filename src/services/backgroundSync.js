
import connect from './tcpConnect';
import {Alert} from "react-native"
//import BackgroundJob from 'react-native-background-job';
//import BackgroundTask from 'react-native-background-task'
//import EventListener from './severEventListener';


class backgroundSyncer {
    constructor(){
        //BackgroundTask.cancel()
    }
    init(){
        BackgroundJob.schedule(backgroundSchedule)
            .then(() => console.log("Success"))
            .catch(err => console.err(err));
    }
    startTask(){
        this.init()
    }
    taskRan = false
    stopBackgroundTask(){
        console.warn("stoping background task!")
        /*BackgroundTask.statusAsync().then((state) => {
            console.warn("background task status: ", state)
            if (state.available){
                EventListener.stopConnection()
                BackgroundTask.finish()
            }
            this.taskRan = false
            const reason = state.unavailableReason
            if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
                Alert.alert('Denied', 'Please enable background "Background App Refresh" for this app')
            } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
                Alert.alert('Restricted', 'Background tasks are restricted on your device')
            }
        })*/
    }
    task(){
        console.warn("starting background task! ")
       connect.connect().then(() => {
           this.taskRan = true
           console.warn("conncetion completely initialized!")
       })
    }
}

const BeBackground = new backgroundSyncer()
export default BeBackground