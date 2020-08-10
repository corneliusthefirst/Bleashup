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
    confirm_password =  {
        en:"Please confirm password",
        fr:"Confirmez votre mots de pass"
    }[GState.lang]
    password_not_matched = {
        en: "password not matching",
        fr: "mots de passes ne correspondent pas"
    }[GState.lang]
    sign_up = {
        en: "SignUp",
        fr: "Cree un Compte"
    }[GState.lang]
    enter_password = {
        en: "Please enter password",
        fr:"Entree votre mots de pass"
    }[GState.lang]
    invalide_password = {
        en: "Invalid password",
        fr: "Mots de pass non valide"
    }[GState.lang]
    not_empty_password = {
        en: "password cannot be empty",
        fr:"mots de pass ne peut etre vide"
    }[GState.lang]
    enter_name = {
        en: "Please enter your name",
        fr: "Entree Votre nom"
    }[GState.lang]
    not_empty_name = {
        en: "User name cannot be empty",
        fr: "Ce champ ne peut etre vide"
    }[GState.lang]
    unable_to_verify_account= {
        en: "Unable To Verify Your Account, Please Check Your Internet Connection",
        fr: "Votre Compte N'a pas pu etre verifiee; SVP verifiez votre connection internet"
    }[GState.lang]
    phone_number_verify = {
        en:"Verify Your Phone Number",
        fr:"Verifiez votre numero de telephone"
    }[GState.lang]
    ok = {
        en: "OK",
        fr:"OK"
    }[GState.lang]
    sign_in= {
        en:"Sign In",
        fr:"Entree Votre Mots de pass"
    }[GState.lang]
    phone_number_verification = {
        en: "Phone Number Verification",
        fr:"Numero de verification"
    }[GState.lang]
    enter_verification_code =  {
        en: "Please enter email verification code",
        fr: "Entree le code de verification recu"
    }[GState.lang]
    invalide_verification_code = {
        en: "Invalid email Verification code",
        fr: "Code de verfication invalide"
    }[GState.lang]
    confirm_you_account = {
        en:"Please Comfirm your Account; A verification Code was sent to your number",
        fr:"Confirmez votre compte; Un code de verificaton vous a ete envoyee"
    }[GState.lang]
    reset_password = {
        en: "Reset Password",
        fr: "changer de mot de pass"
    }[GState.lang]
    contacts = {
        en: "Contacts",
        fr:"Contacts"
    }[GState.lang]
    activity = {
        en: "Activity",
        fr:"Activitee"
    }[GState.lang]
    cannot_send_message = {
        en: "cannot to forward message",
        fr:"message ne peut etre transmit"
    }[GState.lang]
    search_in_your_contact = {
        en: "Search in your contacts",
        fr: "Rechercher dans vos contacts"
    }[GState.lang]
}
const Texts = new TEXTS()
export default Texts