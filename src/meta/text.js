import GState from '../stores/globalState/index';
class TEXTS {
    constructor(language){
        this.lang = language
    }
    profile_card = {
        en:"Profile Card",
        fr: "Carte De Profile"
    }[this.lang]

    phone_number = {
        en: "Phone number",
        fr: "Numero De Telephone"
    }[this.lang]
    
    continue = {
        en:"Continue",
        fr: "Continuer"
    }[this.lang]
    join = {
        en:"Join",
        fr: "Rejoindre"
    }[this.lang]
    on = {
        en: "On ",
        fr:"Le "
    }[this.lang]
}
const Texts = new TEXTS(GState.lang)
export default Texts