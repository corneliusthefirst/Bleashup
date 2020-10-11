import GState from '../stores/globalState';
const Emitter = require('tiny-emitter');
const tinnyEmiter = new Emitter()

class Emit {
    on(event, callback, ctx) {
        GState.addEventListners(event)
        return tinnyEmiter.on(event, callback, ctx)
    }
    off(event, calback) {
        if (GState.canStopListening(event)) {
            console.warn("removing listerner ",event)
            tinnyEmiter.off(event, calback)
        } 
        GState.removeListener(event)
        console.warn(GState.listeners[event]," _"+event)

    }
    emit(event, ...args) {
        return tinnyEmiter.emit(event, ...args)
    }
    once(event, callback, ctx) {
        return tinnyEmiter.once(event, callback)
    }
}
const emitter = new Emit()
export default emitter
