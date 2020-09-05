import { PrivacyRequester } from "../settings/privacy/Requester";
import  moment  from 'moment';
export function sayTyping(typer){
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
    }, 1000);
}

export function checkUserOnlineStatus(phone,curentRef,refManager){
    console.warn("current check user online status ref is: ", curentRef)
    if(!curentRef){
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
        }, 4000,)
    refManager(setIntervalRef)
    }
}