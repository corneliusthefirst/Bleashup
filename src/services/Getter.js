import emitter from "tiny-emitter"
import stores from "../stores"
import GState from "../stores/globalState"
export default class Getter {
    get_data(data) {
        return new Promise((resolve, reject) => {
            do {
                if (!GState.writing) {
                    GState.writing = true;
                    emitter.once("successful", (response, dataResponse) => {
                        GState.writing = false
                        resolve(dataResponse);
                    });
                    emitter.once("unsuccessful", (response, dataError) => {
                        GState.writing = false
                        reject(dataError);
                    });
                    stores.Session.getSession().then(session => {
                        session.socket.write(data);
                    });
                }
            } while (GState.writing)
        });
    }

} 