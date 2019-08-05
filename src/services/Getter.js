import emitter from "./eventEmiter"
import stores from "../stores"
import GState from "../stores/globalState"
import ServerEventListener from "./severEventListener"
class Getter {
    constructor(props) {
    }
    get_data(data) {
        return new Promise((resolve, reject) => {
            emitter.once("successful", (response, dataResponse) => {
                console.warn(dataResponse)
                GState.writing = false
                resolve(dataResponse);
            });
            emitter.once("unsuccessful", (response, dataError) => {
                GState.writing = false
                reject(dataError);
            });
            ServerEventListener.socket.write(data);
        });
    }

}
const geter = new Getter()
export default geter 