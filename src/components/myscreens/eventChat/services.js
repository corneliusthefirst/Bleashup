import { PrivacyRequester } from "../settings/privacy/Requester";
import moment from 'moment';
import { Clipboard } from 'react-native';
import Vibrator from "../../../services/Vibrator";
import Toaster from "../../../services/Toaster";
import Texts from '../../../meta/text';
export function sayTyping(typer) {
    let user = typer
    this.typingTimeout && clearTimeout(this.typingTimeout);
    this.setStatePure({
        typing: true,
        typer: user.nickname
    });
    this.typingTimeout = setTimeout(() => {
        this.setStatePure({
            typing: false,
            typer: user.nickname
        });
        clearTimeout(this.typingTimeout)
        this.typingTimeout = null
    }, 1000);
}

export function checkUserOnlineStatus(phone, curentRef, refManager) {
    console.warn("current check user online status ref is: ", curentRef)
    if (!curentRef) {
        let fun = () => {
            PrivacyRequester.checkUserStatus(phone).then(status => {
                const isOnline = status.status == "online"
                const hasEverConnected = status.last_seen && status.last_seen !== "undefined" ? true : false
                this.setStatePure({
                    last_seen: isOnline ? "Online" : hasEverConnected ? moment(status.last_seen).calendar() : "years ago",
                    is_online: isOnline
                })

            })
        }
        fun()
        let setIntervalRef = setInterval(() => {
            fun()
        }, 4000)
        refManager(setIntervalRef)
    }
}

export function copyText(text) {
    Clipboard.setString(text);
    Vibrator.vibrateShort();
    Toaster({ text: Texts.copied, type: 'success' });
}
const base = "https://bleashup.com/event/"
export function constructActivityLink(activity_id) {
    return base + activity_id
}
export function constructProgramLink(activity_id, program_id) {
    return base + activity_id + '/reminds/' + program_id
}

export function constructStarLink(activity_id, star_id) {
    return base + activity_id + '/stars/' + star_id
}