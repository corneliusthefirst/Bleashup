import GState from '../stores/globalState/index';
class TEXTS {
    constructor(language){
        this.lang = language
    }
    profile_card = {
        en:"Profile Card",
        fr: "Carte De Profile"
    }[GState.lang]

    phone_number = {
        en: "Phone number",
        fr: "Numero De Telephone"
    }[GState.lang]
    
    continue = {
        en:"Continue",
        fr: "Continuer"
    }[GState.lang]
    join = {
        en:"Join",
        fr: "Rejoindre"
    }[GState.lang]
    on = {
        en: "On ",
        fr:"Le "
    }[GState.lang]
    remind_message = {
        en:"Remind Message",
        fr:"Message Rappel"
    }[GState.lang]
    files = {
        en:"Files",
        fr:"Fichier"
    }[GState.lang]
    add_photos = {
        en:"Add Photos",
        fr:"Photos"
    }[GState.lang]
    qr_scanner = {
        en:"QR Join",
        fr: "Joindre Par QR"
    }[GState.lang]
    reminds = {
        en:"Reminds",
        fr:"Rappels"
    }[GState.lang]
    new_activity = {
        en:"New Activity",
        fr:"Nouvelle Activitee"
    }[GState.lang]
    cancel = {
        en:"Cancel",
        fr:"Anuller"
    }[GState.lang]
    go_back = {
        en: "Go Back",
        fr:"Retoure"
    }[GState.lang]
    join_via_qr = {
        en: "Join activity through QR Code",
        fr:"Rejoindre par QR"
    }[GState.lang]
}
const Texts = new TEXTS(GState.lang)
export default Texts