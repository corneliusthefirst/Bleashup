import emitter from './eventEmiter'
class ServerEventListener {
    constructor() {

    }
    listen(socket) {
        socket.on("error", error => {
            console.error(error.toString(), "error")
        });
        socket.on("data", data => {
            if (data.response) {
                switch (data.response) {
                    case "current-events": emitter.emit("current-events", data.body);
                        break;    
                } 
            }
            console.error(data.toString(), "data")

        });
        socket.on("timeout", data => {
            console.error(data.toString(), "timeout")
        });
        socket.on("closed", data => {
            console.error(error.toString(), "closed")
        });
    }
}


const EventListener = new ServerEventListener()
export default EventListener
