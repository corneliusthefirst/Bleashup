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
    report = {
        en: "Report",
        fr: "Raport"
    }[GState.lang]
    set_current_alarm = {
        en: "Current Alarms: ",
        fr: "Alarms Courrant: "
    }[GState.lang]
    set = {
        en: "Set",
        fr: "Changer"
    }[GState.lang]
    public = {
        en:"Public",
        fr: "Public"
    }[GState.lang]
    private = {
        en: "Private",
        fr:"Privee",
    }[GState.lang]
    this_program = {
        en: "This program is ",
        fr: "Ce programme est "
    }[GState.lang]
    request_report = {
        en: "Request Report",
        fr: "Demander un raport"
    }[GState.lang]
    a_week_before = {
        en: "1 Week Before",
        fr:"Une Semaine Avant"
    }[GState.lang]
    two_days_before = {
        en: "2 Days Befors",
        fr: "Deux Jours Avant",
    }[GState.lang]
    one_day_before = {
        en: "1 day Before",
        fr: "Un jour avant",
    }[GState.lang]
    thirty_mins_before = {
        en: "30 Minuts Before",
        fr:"Trente minutes avant"
    }[GState.lang]
    one_hour_before = {
        en: "One hour before",
        fr:"Une heure avant"
    }[GState.lang]
    two_hours_before = {
        en:"Two hours before",
        fr:"Deux heures avant"
    }[GState.lang]
    three_hours_before = {
        en: "Three hours before",
        fr:"Trois heures avant",
    }[GState.lang]
    four_hours_before = {
        en: "Four hours before",
        fr: "Quatre heures avant"
    }[GState.lang]
    five_hours_before = {
        en: "Five hours before",
        fr: "Cinq heures avant",
    }[GState.lang]
    six_hours_before = {
        en: "Six hours before",
        fr: "Six heures avant"
    }[GState.lang]
    seven_hours_before = {
        en: "Seven hours before",
        fr: "Sept heures avant"
    }[GState.lang]
    eight_hours_before = {
        en: "Eight hours before",
        fr: "Huite heures avant"
    }[GState.lang]
    nine_hours_before = {
        en: "Nine hours before",
        fr:"Neuf heures avant"
    }[GState.lang]
    ten_hours_before =  {
        en:"Ten hours before",
        fr:"Dix heures avant"
    }[GState.lang]
    eleven_hours_before = {
        en:"Eleven hours before",
        fr: "Onze heures avant"
    }[GState.lang]
    twelve_hours_before = {
        en: "Twelve hours before",
        fr: "Douze heures avant"
    }[GState.lang]
    thirteen_hours_before = {
        en: "Thirteen hours before",
        fr: "Treize heures avant"
    }[GState.lang]
    fourteen_hours_before = {
        en: "Fourteen hours before",
        fr: "Quatoze heures avant"
    }[GState.lang]
    fifteen_hours_before = {
        en: "Fifteen hours before",
        fr: "Qinze heures avant"
    }[GState.lang]
    sixteen_hours_before = {
        en: "Sixteen hours before",
        fr: "Seize heures avant"
    }[GState.lang]
    seventeen_hours_before = {
        en: "Seventeen hours before",
        fr: "Dixsept heures avant"
    }[GState.lang]
    eighteen_hours_before = {
        en: "Eighteen hours before",
        fr: "Dixhuite heures avant"
    }[GState.lang]
    nineteen_hours_before = {
        en: "Nineteen hours before",
        fr: "Dixneuf heures avant"
    }[GState.lang]
    twenty_hours_before = {
        en: "Twenty hours before",
        fr: "Vingt heures avant"
    }[GState.lang]
    ten_minutes_before = {
        en: "10 Minuts Before",
        fr: "10 minutes avant"
    }[GState.lang]
    five_minutes_before = {
        en: "5 Minuts Before",
        fr: "Cinq minutes avant"
    }[GState.lang]
    two_minuts_before = {
        en: "2 Minuts Before",
        fr: "Deux Minutes avant"
    }[GState.lang]
    on_time = {
        en: "On Time",
        fr: "A l'heure dit"
    }[GState.lang]
    set_alarm_pattern = {
        en: "Set Alarms",
        fr: "Definissez Les Alarmes"
    }[GState.lang]
    alarms = {
        en: "Alarms",
        fr: "Alarmes"
    }[GState.lang]
    unable_to_perform_request = {
        en:"Unable to perform request",
        fr:"Impossible d'efecture cette action"
    }[GState.lang]
    not_enough_previledges_to_perform_action = {
        en: "you don't have enough priviledges to perform this action",
        fr: "Vous n'avez pas les priviledges requis pour ce type d'action"
    }[GState.lang]
    member_already_exists = {
        en: "member already exists",
        fr: "en fait deja partis"
    }[GState.lang]
    app_busy = {
        en: "App is Busy",
        fr: "Ocuppee"
    }[GState.lang]
    confirmed_already = {
        en: 'confirmed already!',
        fr:"Deja Confirmee"
    }[GState.lang]
    reply = {
        en:"reply",
        fr: "Repondre"
    }[GState.lang]
    update = {
        en: "Update",
        fr: "Metre a jour"
    }[GState.lang]
    delete_ = {
        en:"Delete",
        fr: "Suprimer"
    }[GState.lang]
    members = {
        en:"Members",
        fr:"Membres"
    }[GState.lang]
    assign = {
        en: "Assign",
        fr: "Assigner"
    }[GState.lang]
    unassign = {
        en: "Unassign",
        fr: "Deassigner"
    }[GState.lang]
    share = {
        en: 'Share',
        fr:"Partager"
    }[GState.lang]
    closed_activity = {
        en: `This activity has been closed`,
        fr:"Cette Activitee a ete suspendu"
    }[GState.lang]
    copy = {
        en: "Copy",
        fr:"Copier"
    }[GState.lang]
    star = {
        en: "Star",
        fr: "Favoriser"
    }[GState.lang]
    remind = {
        en:"Remind / Program",
        fr:"Rappeler / Programer"
    }[GState.lang]
    reminder = {
        en:"Remind",
        fr:"Rappel"
    }[GState.lang]
    seen_by = {
        en: "Seen by",
        fr:"Vue par",
    }[GState.lang]
    not_available_video = {
        en: "This video is not more available",
        fr:"Cette video n'est plus accessible"
    }[GState.lang]
    new_messages = {
        en: 'New Messages',
        fr: "Nouveau messages"
    }[GState.lang]
    remind_must_have_atleate_date_time_or_title = {
        en:"Remind / Program Must Have Atleat a Title and Data/Time",
        fr:"Un Rappel doit au moin contenire un title et une date"
    }[GState.lang]
    remind_configs = {
        en: "Remind configs",
        fr: "Configuration Du Rapel / Program"
    }[GState.lang]
    add_remind = {
        en: "Add Remind",
        fr:"Ajouter un Rappel / Program"
    }[GState.lang]
    program = {
        en:"Program",
        fr:"Program"
    }[GState.lang]
    restore = {
        en:"Restore",
        fr:"restorer"
    }[GState.lang]
    your_event_title = {
        en: "Program title",
        fr:"Title du program"
    }[GState.lang]
    remind_message = {
        en: "Remind message",
        fr:"Message du rappel"
    }[GState.lang]
    remind_date = {
        en: "Remind Date",
        fr: "Date du rappel"
    }[GState.lang]
    repeat = {
        en: "Repeat",
        fr: "Repetition"
    }[GState.lang]
    select_days = {
        en: "select days",
        fr: "selectioner les jours"
    }[GState.lang]
    view_days = {
        en: "view days",
        fr:"voir les jours"
    }[GState.lang]
    on_the = {
        en:"on the",
        fr: "le"
    }[GState.lang]
    update_remind = {
        en: "Update Remind",
        fr:"Editer le Rappel / Program"
    }[GState.lang]
    all_days = {
        en:"(all days)",
        fr: "(tous les jours)"
    }[GState.lang]
    days = {
        en:"days",
        fr: "jours"
    }[GState.lang]
    selete_recurrence_stop_date = {
        en: "Select repeat stop date",
        fr: "Date de fin de repetition"
    }[GState.lang]
    venue = {
        en: "Venue",
        fr:"lieux"
    }[GState.lang]
    details = {
        en: "Details",
        fr:"Detailes"
    }[GState.lang]
    unable_to_upload = {
        en: 'Unable To upload photo',
        fr: 'Cette Photo ne peut pas etre lu'
    }[GState.lang]
    event_must_have_a_name = {
        en: "The activity must have a name",
        fr: "Une activitee doit avoir un nom"
    }[GState.lang]
    this_message_was_never_sent = {
        en:"This messages wa never sent",
        fr: "Ce message n'a jamais ete envoyee"
    }[GState.lang]
    press_long_to_record = {
        en: "Long press to start recording",
        fr: "Apuiez Logntemp pour commencer a enregister"
    }[GState.lang]
}
const Texts = new TEXTS()
export default Texts