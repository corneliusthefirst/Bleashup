import CreateRequest from '../event/createEvent/CreateRequester';
import stores from "../../../stores";
import { findIndex } from 'lodash';
import request from '../../../services/requestObjects';
import Toaster from '../../../services/Toaster';
import Texts from '../../../meta/text';
import GState from '../../../stores/globalState/index';

export default function getRelation(user){
        return new Promise((resolve,reject) => {
            if (findIndex(stores.Contacts.contacts.contacts, { phone: user.phone }) >= 0) {
            stores.Events.readFromStore().then((events) => {
                let index = findIndex(events, (ele) => ele.type && ele.type === "relation" &&
                    findIndex(ele.participant, { phone: user.phone }) >= 0 &&
                    findIndex(ele.participant, { phone: stores.LoginStore.user.phone }) >= 0)
                if (index < 0) {
                    let relation = request.Event();
                    relation.type = "relation";
                    let opponent = request.Participant();
                    opponent.phone = user.phone;
                    opponent.master = true;
                    relation.participant.push(opponent);
                    CreateRequest.createEvent(relation).then((resp) => {
                          resolve(resp)
                    }).catch(() => {
                        Toaster({ text: 'unable to start a relation' })
                        reject()
                    })

                } else {
                    resolve(events[index])
                }
            })
        }else{
            GState.considerIvite()
            reject()
        }
        })
}