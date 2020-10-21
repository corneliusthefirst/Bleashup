import GState from '../stores/globalState/index';
class TEXTS {
    constructor(language) {
        this.lang = language
    }
    profile_card = {
        en: "Profile Card",
        fr: "Carte de profil"
    }[GState.lang]

    phone_number = {
        en: "Phone number",
        fr: "Numéro de téléphone"
    }[GState.lang]

    continue = {
        en: "Continue",
        fr: "Continuer"
    }[GState.lang]
    join = {
        en: "Join",
        fr: "Rejoindre"
    }[GState.lang]
    on = {
        en: "On ",
        fr: "Le "
    }[GState.lang]
    end_date = {
        en: 'End Date',
        fr: 'Date de fin'
    }[GState.lang]
    at = {
        en: 'at',
        fr: 'à'
    }[GState.lang]
    remind_message = {
        en: "Remind Message",
        fr: "Mot de rappel"
    }[GState.lang]
    files = {
        en: "Files",
        fr: "Fichiers"
    }[GState.lang]
    add_photos = {
        en: "Photos",
        fr: "Photos"
    }[GState.lang]
    qr_scanner = {
        en: "Join va QR",
        fr: "Rejoindre via QR"
    }[GState.lang]
    reminds = {
        en: "Reminds",
        fr: "Rappelle"
    }[GState.lang]
    new_activity = {
        en: "New Activity",
        fr: "Nouvelle activité"
    }[GState.lang]
    cancel = {
        en: "Cancel",
        fr: "Annuler"
    }[GState.lang]
    go_back = {
        en: "Go Back",
        fr: "Retour"
    }[GState.lang]
    confirm_password = {
        en: "Please confirm password",
        fr: "Veuillez confirmer le mot de passe"
    }[GState.lang]
    password_not_matched = {
        en: "password not matching",
        fr: "le mot de passe ne correspond pas"
    }[GState.lang]
    sign_up = {
        en: "SignUp",
        fr: "Inscription"
    }[GState.lang]
    enter_password = {
        en: "Please enter password",
        fr: "Veuillez entrer le mot de passe"
    }[GState.lang]
    invalide_password = {
        en: "Invalid password",
        fr: "Mot de passe invalide"
    }[GState.lang]
    not_empty_password = {
        en: "password cannot be empty",
        fr: "le mot de passe ne peut pas être vide"
    }[GState.lang]
    enter_name = {
        en: "Please enter your name",
        fr: "Veuillez entrer votre nom"
    }[GState.lang]
    not_empty_name = {
        en: "User name cannot be empty",
        fr: "Le nom d'utilisateur ne peut pas être vide"
    }[GState.lang]
    unable_to_verify_account = {
        en: "Unable To Verify Your Account, Please Check Your Internet Connection",
        fr: "Impossible de vérifier votre compte, veuillez vérifier votre connexion Internet"
    }[GState.lang]
    phone_number_verify = {
        en: "Verify Your Phone Number",
        fr: "Vérifiez votre numéro de téléphone"
    }[GState.lang]
    ok = {
        en: "OK",
        fr: "OK"
    }[GState.lang]
    sign_in = {
        en: "Sign In",
        fr: "Se connecter"
    }[GState.lang]
    phone_number_verification = {
        en: "Phone number verification",
        fr: "Vérification du numéro de téléphone"
    }[GState.lang]
    enter_verification_code = {
        en: "Please enter email verification code",
        fr: "Veuillez entrer le code de vérification"
    }[GState.lang]
    verfication_code_sent_to_you = {
        en:'Please Confirm your Account; A verification Code was sent to your number',
        fr:'Veuillez confirmer votre compte ; un code de vérification a été envoyé à votre numéro'
    }[GState.lang]
    message_actions = {
        en: "message actions",
        fr:'actions de message'
    }[GState.lang]
    invalide_verification_code = {
        en: "Invalid email verification code",
        fr: "Code de vérification non valable"
    }[GState.lang]
    confirm_you_account = {
        en: "Please Confirm your Account; A verification Code was sent to your number",
        fr: "CVeuillez confirmer votre compte ; un code de vérification a été envoyé à votre numéro"
    }[GState.lang]
    reset_password = {
        en: "Reset Password",
        fr: "Réinitialisation du mot de passe"
    }[GState.lang]
    contacts = {
        en: "Contacts",
        fr: "Contacts"
    }[GState.lang]
    activity = {
        en: "Activity",
        fr: "Activité"
    }[GState.lang]
    my_activity = {
        en: "My Activity",
        fr: "Mon activité"
    }[GState.lang]
    activities = {
        en: 'Activities',
        fr: 'Activités'
    }[GState.lang]
    cannot_send_message = {
        en: "cannot to forward message",
        fr: "ne peut pas faire suivre le message"
    }[GState.lang]
    search_in_your_contact = {
        en: "Search in your contacts",
        fr: "Recherchez dans vos contacts"
    }[GState.lang]
    report = {
        en: "Report",
        fr: "Rapport"
    }[GState.lang]
    set_current_alarm = {
        en: "Current Alarms: ",
        fr: "Alarmes actives : "
    }[GState.lang]
    set = {
        en: "Set",
        fr: "Définir"
    }[GState.lang]
    public = {
        en: "Public",
        fr: "Public"
    }[GState.lang]
    private = {
        en: "Private",
        fr: "Privée",
    }[GState.lang]
    activity_sucessfully_left = {
        en: "Activity successfully left",
        fr: 'Activité abandonnée avec succès'
    }[GState.lang]
    this_program = {
        en: "This program is ",
        fr: "Ce programme est "
    }[GState.lang]
    request_report = {
        en: "Request report",
        fr: "Demander un raport"
    }[GState.lang]
    a_week_before = {
        en: "1 week before",
        fr: "1 semaine avant"
    }[GState.lang]
    two_days_before = {
        en: "2 Days Before",
        fr: "2 jours avant",
    }[GState.lang]
    one_day_before = {
        en: "1 day Before",
        fr: "Un jour avant",
    }[GState.lang]
    thirty_mins_before = {
        en: "30 Minutes Before",
        fr: "30 minutes avant"
    }[GState.lang]
    one_hour_before = {
        en: "One hour before",
        fr: "Une heure avant"
    }[GState.lang]
    two_hours_before = {
        en: "Two hours before",
        fr: "Deux heures avant"
    }[GState.lang]
    three_hours_before = {
        en: "Three hours before",
        fr: "Trois heures avant",
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
        fr: "Huit heures avant"
    }[GState.lang]
    nine_hours_before = {
        en: "Nine hours before",
        fr: "Neuf heures avant"
    }[GState.lang]
    ten_hours_before = {
        en: "Ten hours before",
        fr: "Dix heures avant"
    }[GState.lang]
    eleven_hours_before = {
        en: "Eleven hours before",
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
        fr: "Quatorze heures avant"
    }[GState.lang]
    fifteen_hours_before = {
        en: "Fifteen hours before",
        fr: "Quinze heures avant"
    }[GState.lang]
    sixteen_hours_before = {
        en: "Sixteen hours before",
        fr: "Seize heures avant"
    }[GState.lang]
    seventeen_hours_before = {
        en: "Seventeen hours before",
        fr: "Dix-sept heures avant"
    }[GState.lang]
    eighteen_hours_before = {
        en: "Eighteen hours before",
        fr: "Dix-huit heures avant"
    }[GState.lang]
    nineteen_hours_before = {
        en: "Nineteen hours before",
        fr: "Dix-neuf heures avant"
    }[GState.lang]
    twenty_hours_before = {
        en: "Twenty hours before",
        fr: "Vingt heures avant"
    }[GState.lang]
    ten_minutes_before = {
        en: "10 Minutes before",
        fr: "10 minutes avant"
    }[GState.lang]
    five_minutes_before = {
        en: "5 Minutes Before",
        fr: "5 minutes avant"
    }[GState.lang]
    two_minuts_before = {
        en: "2 Minutes Before",
        fr: "2 minutes avant"
    }[GState.lang]
    on_time = {
        en: "On Time",
        fr: "A l'heure dit"
    }[GState.lang]
    set_alarm_pattern = {
        en: "Set alarms",
        fr: "Définir les alarmes"
    }[GState.lang]
    alarms = {
        en: "Alarms",
        fr: "Alarmes"
    }[GState.lang]
    unable_to_perform_request = {
        en: "Unable to perform request",
        fr: "Impossible d'efecture cette action"
    }[GState.lang]
    not_enough_previledges_to_perform_action = {
        en: "you don't have enough priviledges to perform this action",
        fr: "vous n'avez pas assez de privilèges pour effectuer cette action"
    }[GState.lang]
    member_already_exists = {
        en: "member already exists",
        fr: "ce membre en fait deja partis"
    }[GState.lang]
    app_busy = {
        en: "App is Busy",
        fr: "L'application est occupée"
    }[GState.lang]
    confirmed_already = {
        en: 'confirmed already!',
        fr: "déjà confirmé! "
    }[GState.lang]
    reply = {
        en: "Mention",
        fr: "Mentionner"
    }[GState.lang]
    update = {
        en: "Update",
        fr: "Editer"
    }[GState.lang]
    delete_ = {
        en: "Delete",
        fr: "Supprimer"
    }[GState.lang]
    members = {
        en: "Member(s)",
        fr: "Membre(s)"
    }[GState.lang]
    assign = {
        en: "Add Members",
        fr: "Ajouter des membres"
    }[GState.lang]
    unassign = {
        en: "Remove Members",
        fr: "Supprimer des membres"
    }[GState.lang]
    share = {
        en: 'Share',
        fr: "Partager"
    }[GState.lang]
    closed_activity = {
        en: `This activity has been closed`,
        fr: "Cette activité a été fermée"
    }[GState.lang]
    copy = {
        en: "Copy",
        fr: "Copier"
    }[GState.lang]
    star = {
        en: "Highlights",
        fr: "Moments forts"
    }[GState.lang]
    remind = {
        en: "Programs",
        fr: "Programmes"
    }[GState.lang]
    reminder = {
        en: "Remind",
        fr: "Rappel"
    }[GState.lang]
    seen_by = {
        en: "Seen by",
        fr: "Vue par",
    }[GState.lang]
    message_report = {
        en: "Message report",
        fr: "Raport du message"
    }[GState.lang]
    not_available_video = {
        en: "This video is not more available",
        fr: "Cette vidéo n'est plus disponible"
    }[GState.lang]
    new_messages = {
        en: 'New Messages',
        fr: "Nouveaux messages"
    }[GState.lang]
    remind_must_have_atleate_date_time_or_title = {
        en: "Program must have at least a title and date/time",
        fr: "Le programme doit avoir au moins un titre et une date/heure"
    }[GState.lang]
    remind_configs = {
        en: "Program configs",
        fr: "Configuration de programme"
    }[GState.lang]
    add_remind = {
        en: "Add Program",
        fr: "Ajouter un programme"
    }[GState.lang]
    scann_qr = {
        en: "Scan QR code",
        fr: "Scanner le code QR"
    }[GState.lang]
    program_members = {
        en: "Program Members",
        fr: "Membres du programme"
    }[GState.lang]
    cannot_reply_unsent_message = {
        en: 'unable to reply for unsent messages',
        fr: 'incapacité de répondre aux messages non envoyés'
    }[GState.lang]
    b_up_chatroom = {
        en: 'BeUp Chat Room',
        fr: 'BeUp Chat'
    }[GState.lang]
    send_a_message = {
        en: "Send a message as text",
        fr: 'Envoyer un message sous forme de texte'
    }[GState.lang]
    send_message_as_emoticons = {
        en: "Send message as emoticons",
        fr: "Envoyer un message sous forme d'émoticônes"
    }[GState.lang]
    use_it_to = {
        en: "Use it to",
        fr: "Utilisez-le pour"
    }[GState.lang]
    send_multimedia_messages = {
        en: "Send multimedia files like: audio, video, photos and, any type of file",
        fr: "Envoyer des fichiers multimédia tels que : audio, vidéo, photos et, tout type de fichier"
    }[GState.lang]
    share_thinks_like = {
        en: "Share Things like (Contacts, Activities, Programs, Highlights etc)",
        fr: "Partager des informations telles que (contacts, activités, programmes, moments forts, etc.)"
    }[GState.lang]
    mention_everything = {
        en: "Mention a message, program, highlight, any update made in the activity, activity description, activity photo and etc",
        fr: "Mentionner un message, un programme, un fait marquant, toute modification apportée à l'activité, la description de l'activité, la photo de l'activité, etc."
    }[GState.lang]
    turn_a_message_into_a_program = {
        en: "Turn a message into a program and vice versa",
        fr: "Transformer un message en programme et vice versa"
    }[GState.lang]
    turn_a_message_a_highlight = {
        en: "Turn a message into a highlight and vice versa",
        fr: "Faire d'un message un moment fort et vice versa"
    }[GState.lang]
    be_up_reminds = {
        en: "BeUp Programs",
        fr: "Programmes BeUp"
    }[GState.lang]
    program_descriptions = {
        en: "Programs are the essence of the activity; use a program to make people know and be reminded of everything taking place in the activity. \n\n Click on the button below to add a program.",
        fr: "Les programmes sont l'essence même de l'activité; utiliser un programme pour faire savoir aux gens et se rappeler tout ce qui se passe dans l'activité. \n \n Cliquez sur le bouton ci-dessous pour ajouter un programme."
    }[GState.lang]
    beup_highlight = {
        en: "BeUp Highlights",
        fr: "Moments forts De BeUp"
    }[GState.lang]
    beup_highlight_description = {
        en: "Highlights are essential to keep important stuff which is to be accessible by any member of the activity \n\n Click below to add a Highlight",
        fr: "Les moments forts sont essentiels pour conserver les éléments importants qui doivent être accessibles à tout membre de l'activité. \n\n Cliquez ci-dessous pour ajouter un moment fort"
    }[GState.lang]
    beup_activity = {
        en: "BeUp Activity",
        fr: "Activité BeUp"
    }[GState.lang]
    beup_activity_description = {
        en: "BeUp activity is a place where one can organize programs, invite people to the program, share the program for people to join the program. An activity has group chat where people can discuss fun and stuffs related to programs. People can also Keep track most important stuffs in the activity by adding them as highlights. \n\n Click below to get started.",
        fr: "L'activité BeUp est un endroit où l'on peut organiser des programmes, inviter des gens au programme, partager le programme pour que les gens rejoignent le programme. Une activité comprend une discussion de groupe où les membres peuvent discuter de plaisir et de choses liées aux programmes. Les gens peuvent également suivre les éléments les plus importants de l'activité en les ajoutant en tant que moment fort. \n \n Cliquez ci-dessous pour commencer."
    }[GState.lang]
    no_activity_found = {
        en: "No activity found! ",
        fr: "Aucune activité trouvée!"
    }[GState.lang]
    click_below_to_create_a_new_one = {
        en: "Click below to create a new one",
        fr: "Cliquez ci-dessous pour en créer un nouveau"
    }[GState.lang]
    activity_name = {
        en: "Activity name",
        fr: "Nom de l'activité"
    }[GState.lang]
    add_activity = {
        en: "Create",
        fr: "Créer"
    }[GState.lang]
    show_less = {
        en: "Show less",
        fr: "Montrer moins"
    }[GState.lang]
    show_more = {
        en: "Show more",
        fr: "En voir plus"
    }[GState.lang]
    activity_actions = {
        en: "Activity Actions",
        fr: "Actions d'activité"
    }[GState.lang]
    delete_activity = {
        en: "Delete Activity",
        fr: "Supprimer l'activité"
    }[GState.lang]
    are_you_sure_to_delete_activity = {
        en: 'are you sure you want to delete this activity?',
        fr: 'êtes-vous sûr de vouloir supprimer cette activité?'
    }[GState.lang]
    react_to_a_message = {
        en: "React to a sent message",
        fr: "Réagir à un message envoyé"
    }[GState.lang]
    delete_a_message = {
        en: "Delete a sent message",
        fr: "Supprimer un message envoyé"
    }[GState.lang]
    see_message_info = {
        en: "Check the status of every sent message",
        fr: "Vérifier le statut de chaque message envoyé"
    }[GState.lang]
    participants_list = {
        en: "Participants List",
        fr: "Liste des participants"
    }[GState.lang]
    select_activity = {
        en: "Select activity",
        fr: "Sélectionnez une activité",
    }[GState.lang]
    program = {
        en: "Program",
        fr: "Programme"
    }[GState.lang]
    restore = {
        en: "Restore",
        fr: "Restaurer"
    }[GState.lang]
    your_event_title = {
        en: "Program title",
        fr: "Titre du programme"
    }[GState.lang]
    remind_message = {
        en: "Program message",
        fr: "Message du programme"
    }[GState.lang]
    remind_date = {
        en: "Program date",
        fr: "Date du programme"
    }[GState.lang]
    repeat = {
        en: "Repeat",
        fr: "Répéter"
    }[GState.lang]
    select_days = {
        en: "select days",
        fr: "selectioner les jours"
    }[GState.lang]
    view_days = {
        en: "view days",
        fr: "voir les jours"
    }[GState.lang]
    on_the = {
        en: "on the",
        fr: "le"
    }[GState.lang]
    update_remind = {
        en: "Update Program",
        fr: "Editer le Programme"
    }[GState.lang]
    all_days = {
        en: "(all days)",
        fr: "(tous les jours)"
    }[GState.lang]
    Sunday = {
        en: 'Sunday',
        fr: "Dimanche"
    }[GState.lang]
    Monday = {
        en: 'Monday',
        fr: 'Lundi'
    }[GState.lang]
    Tuesday = {
        en: 'Tuesday',
        fr: 'Mardi'
    }[GState.lang]
    Wednesday = {
        en: 'Wednesday',
        fr: 'Mercredi'
    }[GState.lang]
    Thursday = {
        en: 'Thursday',
        fr: 'Jeudi'
    }[GState.lang]
    Friday = {
        en: 'Friday',
        fr: 'Vendredi'
    }[GState.lang]
    Saturday = {
        en: 'Saturday',
        fr: 'Samedi'
    }[GState.lang]
    days = {
        en: "days",
        fr: "jours"
    }[GState.lang]
    selete_recurrence_stop_date = {
        en: "Select repeat stop date",
        fr: "Sélectionnez la date d'arrêt de répétition"
    }[GState.lang]
    venue = {
        en: "Venue",
        fr: "lieux"
    }[GState.lang]
    details = {
        en: "Details",
        fr: "Détails"
    }[GState.lang]
    unable_to_upload = {
        en: 'Unable To upload photo',
        fr: 'Impossible de télécharger une photo'
    }[GState.lang]
    event_must_have_a_name = {
        en: "The activity must have a name",
        fr: "L'activité doit avoir un nom"
    }[GState.lang]
    this_message_was_never_sent = {
        en: "This message was never sent",
        fr: "Ce message n'a jamais été envoyé"
    }[GState.lang]
    press_long_to_record = {
        en: "Long press to start recording",
        fr: "Appuyez longuement pour commencer l'enregistrement"
    }[GState.lang]
    start_a_conversation = {
        en: "Relate",
        fr: "Discuter"
    }[GState.lang]
    write_to_disk_permission = {
        en: "Write to storage permission",
        fr: "Pemission D'utilisation de l'espace stockage"
    }[GState.lang]
    writ_to_disk_permission_message = {
        en: "BeUp Wants to write to disk",
        fr: "BeUp veut écrire sur le disque"
    }[GState.lang]
    loading_video = {
        en: "Video Loading",
        fr: "Chargement de la vidéo"
    }[GState.lang]
    star_messages_at = {
        en: "Highlights @",
        fr: "Moments forts @"
    }[GState.lang]
    reminds_at = {
        en: "Programs @ ",
        fr: "Programmes @ "
    }[GState.lang]
    typing = {
        en: "is typing ...",
        fr: "train de rédiger ..."
    }[GState.lang]
    remove_a_member = {
        en: 'Remove member',
        fr: 'Supprimer le membre'
    }[GState.lang]
    successfull_restoration = {
        en: "restoration was successful",
        fr: "la restauration a été un succès"
    }[GState.lang]
    restored_already = {
        en: "restored already",
        fr: "déjà restauré"
    }[GState.lang]
    forgot_password = {
        en: 'forgot password?',
        fr: 'Vous avez oublié votre mot de passe?'
    }[GState.lang]
    phone_error = {
        en: 'Phone number error',
        fr: 'Erreur de numéro de téléphone'
    }[GState.lang]
    enter_your_phone_number = {
        en: "Enter phone number",
        fr:'Entrer votre numéro de téléphone'
    }[GState.lang]
    verfication_error={
        en:'Verification error',
        fr:'Erreur de vérification'
    }[GState.lang]
    wrong_verification_code={
        en: 'wrong verification code; Please try again',
        fr:'code de vérification incorrect ; veuillez réessayer'
    }[GState.lang]
    please_provide_a_valide_phone = {
        en: "Please provide a valid mobile phone number",
        fr: 'Veuillez fournir un numéro de téléphone portable valide'
    }[GState.lang]
    add_participant = {
        en: "Add participant to this Commitee",
        fr: "Ajouter un participant à ce comité"
    }[GState.lang]
    select_members_to_remove = {
        en: "Select members to remove",
        fr: "Sélectionner les membres à supprimer"
    }[GState.lang]
    no_member_selected = {
        en: "no members selected",
        fr: "aucun membre sélectionné"
    }[GState.lang]
    are_you_sure_you_want_to_leave = {
        en: "Are you sure you want to leave this activity?",
        fr: "Voulez-vous vraiment quitter cette activité?"
    }[GState.lang]
    leave_activity = {
        en: "Leave activity",
        fr: "Quitter l'activité"
    }[GState.lang]
    leave = {
        en: 'Leave',
        fr: 'Quitter'
    }[GState.lang]
    published_successfully = {
        fr: 'Publié avec succès',
        en: 'Published successfully'
    }[GState.lang]
    not_member_anymore = {
        en: "You are not a  member anymore !",
        fr: "Vous n'êtes plus membre !"
    }[GState.lang]
    remove_photo = {
        en: "Remove photo",
        fr: "Supprimer la photo"
    }[GState.lang]
    are_you_sure_to_remove_photo = {
        en: "Are you sure you want to remove this photo?",
        fr: "Vous êtes sûr de vouloir retirer cette photo?"
    }[GState.lang]
    remove = {
        en: "Remove",
        fr: "Retirer"
    }[GState.lang]
    are_you_sure_to_close = {
        en: "Are You Sure You Want To Close This Activity?",
        fr: "Êtes-vous sûr de vouloir fermer cette activité?"
    }[GState.lang]
    close_activity = {
        en: "Close activity",
        fr: "Fermer l'activité"
    }[GState.lang]
    open_activity = {
        en: 'Open activity',
        fr: "Ouvrire l'activité"
    }[GState.lang]
    close = {
        en: "Close",
        fr: "Fermer"
    }[GState.lang]
    select_members = {
        en: "Select Members",
        fr: "Selectioner les membres"
    }[GState.lang]
    enter_your_name = {
        en: "Enter your name",
        fr: "Entree Votre nom"
    }[GState.lang]
    apply = {
        en: "Aply",
        fr: "Apliquer"
    }[GState.lang]
    enter_new_value = {
        en: "Enter new value",
        fr: "Entree les nouvelles valeurs"
    }[GState.lang]
    chose_status = {
        en: "Choose a status",
        fr: "Choisisez un status"
    }[GState.lang]
    no_status_available = {
        en: "@No status update here",
        fr: "@RAS"
    }[GState.lang]
    available = {
        en: "Available",
        fr: "Disponible"
    }[GState.lang]
    busy = {
        en: "Busy",
        fr: "Occupé"
    }[GState.lang]
    at_school = {
        en: "At school",
        fr: "À l'école"
    }[GState.lang]
    at_work = {
        en: "At work",
        fr: "Au travail"
    }[GState.lang]
    at_cinema = {
        en: "At cinema",
        fr: "Au cinéma"
    }[GState.lang]
    at_meeting = {
        en: "At metting",
        fr: "En réunion"
    }[GState.lang]
    sleeping = {
        en: "Sleeping",
        fr: "Endormis"
    }[GState.lang]
    urgent_call_only = {
        en: "Urgent calls only",
        fr: "Appel urgents uniquement"
    }[GState.lang]
    very_low_battery = {
        en: "Battery very low",
        fr: "Batterie très faible"
    }[GState.lang]
    copied = {
        en: 'copied !',
        fr: 'copié !'
    }[GState.lang]
    your_text = {
        en: "Your message",
        fr: "Votre message"
    }[GState.lang]
    enter_your_search = {
        en: "Enter your search",
        fr: "Entrez votre recherche"
    }[GState.lang]
    a_bleashup_user = {
        en: "BeUp user",
        fr: "utilisateur BeUp"
    }[GState.lang]
    start_a_relation_or_invite_a_contact = {
        en: "Start a relation or Invite a contact to join BeUp",
        fr: "Démarrer une relation ou inviter un contact à rejoindre BeUp"
    }[GState.lang]
    refresh_your_conctacts = {
        en: "Refresh your contacts",
        fr: "Actualiser vos contacts"
    }[GState.lang]
    invite = {
        en: "Invite",
        fr: "Iviter"
    }[GState.lang]
    beup_wants_to_access_your_contacts = {
        en: 'BeUp would like to view your contacts.',
        fr: "BeUp aimerait accéder à vos contacts"
    }[GState.lang]
    accept = {
        en: "Accept",
        fr: "Accepter"
    }[GState.lang]
    unknow_user_consider_inviting = {
        en: "unknown user please consider inviting this contact",
        fr: "utilisateur inconnu, veuillez envisager d'inviter ce contact"
    }[GState.lang]
    already_a_contact = {
        en: "Already exists as contacts",
        fr: "Existe déjà en tant que contacts"
    }[GState.lang]
    activity_description = {
        en: "Activity description",
        fr: "Description de l'activité"
    }[GState.lang]
    activity_description_placeholder = {
        en: "Activity Description goes here; no description currently provided.",
        fr: "La description de l'activité va ici; aucune description actuellement fournie."
    }[GState.lang]
    no_description = {
        en: "No Description Provided",
        fr: "Aucune description fournie"
    }[GState.lang]
    select_new_members = {
        en: "Select New Members",
        fr: "Selectionez les nouveaux membres"
    }[GState.lang]
    members_and = {
        en: " members and ",
        fr: " membres et "
    }[GState.lang]
    masters = {
        en: " masters",
        fr: " masters"
    }[GState.lang]
    activity_photo = {
        en: "Activity Photo",
        fr: "Photo de l'activité"
    }[GState.lang]
    profile_photo = {
        en: "Profile photo",
        fr: "Photo de profile"
    }[GState.lang]
    unable_to_reply = {
        en: "unable to mention",
        fr: "impossible de mentioner"
    }[GState.lang]
    name_cannot_be_empty = {
        en: "name cannot be empty",
        fr: "le nom ne peut etre vide"
    }[GState.lang]
    b_up_default_status = {
        en: "Hey, let's schedule that",
        fr: "programmons ca ensemble"
    }[GState.lang]
    last_seen = {
        en: "last seen: ",
        fr: "dernière fois: "
    }[GState.lang]
    history = {
        en: "History",
        fr: "Historique"
    }[GState.lang]
    delete_remind = {
        en: "Delete program",
        fr: "Supprimer le programme"
    }[GState.lang]
    are_you_sure_to_delete = {
        en: "Are you sure you want to delete this program?",
        fr: "Êtes-vous sûr de vouloir supprimer ce programme?"
    }[GState.lang]
    remind_action = {
        en: "program actions",
        fr: "actions sur le programme"
    }[GState.lang]
    no_connection_to_server = {
        en: "loading... from remote",
        fr: "chargement ..."
    }[GState.lang]
    logs = {
        en: "Change Logs",
        fr: "Modifications"
    }[GState.lang]
    edit_post = {
        en: 'Update highlight',
        fr: 'Edite le moment fort'
    }[GState.lang]
    add_highlight = {
        en: "Add a highlight",
        fr: 'Ajouter un  moment fort'
    }[GState.lang]
    settings = {
        en: "Settings",
        fr: "Réglages"
    }[GState.lang]
    show_activity_description = {
        en: "Description",
        fr: "Description"
    }[GState.lang]
    get_share_link = {
        en: "Link",
        fr: "Liens"
    }[GState.lang]
    highlights_actions = {
        en: 'actions on this highlights',
        fr: 'actions sur ce moment fort'
    }[GState.lang]
    done = {
        en: "Done",
        fr: "Fait"
    }[GState.lang]
    assign_me = {
        en: "Take Part",
        fr: "Prendre part"
    }[GState.lang]
    un_assign_to_me = {
        en: "Boycot",
        fr: "Boycotter"
    }[GState.lang]
    past_since = {
        en: "Past since ",
        fr: "Passé depuis "
    }[GState.lang]
    started = {
        en: "Started",
        fr: "A débuté"
    }[GState.lang]
    set = {
        en: 'Set',
        fr: 'Definir'
    }[GState.lang]
    starts = {
        en: "Due",
        fr: "Pour"
    }[GState.lang]
    ends = {
        en: "Ends",
        fr: "Prend fin"
    }[GState.lang]
    deu = {
        en: "Deu",
        fr: "Pour"
    }[GState.lang]
    delete_highlight = {
        en: "Delete highlight",
        fr: "Effacer ce moment fort"
    }[GState.lang]
    are_you_sure_to_delete_this_highlight = {
        en: "Are you sure you want to delete this highlight?",
        fr: "Voulez-vous vraiment supprimer ce moment fort?"
    }[GState.lang]
    no = {
        en: "No",
        fr: "Non"
    }[GState.lang]
    yes = {
        en: "Yes",
        fr: "Oui"
    }[GState.lang]
    every_day_at = {
        en: "every days at",
        fr: "tous les jours a"
    }[GState.lang]
    every_month_on_the = {
        en: "every months on the",
        fr: "chaques mois le"
    }[GState.lang]
    every = {
        en: "every",
        fr: "chaques"
    }[GState.lang]
    yearly_on = {
        en: "yearly on",
        fr: "chaque année le"
    }[GState.lang]
    until = {
        en: "until",
        fr: "jusqu'a"
    }[GState.lang]
    proceed = {
        en: "Proceed",
        fr: "Continuer"
    }[GState.lang]
    venue = {
        en: "Venue",
        fr: "Lieu"
    }[GState.lang]
    unable_to_load_data = {
        en: "Unable to load data",
        fr: "Impossible de charger les données"
    }[GState.lang]
    all_contacts = {
        en: "All Your Contacts",
        fr: "Tous Vos Contacts"
    }[GState.lang]
    all_activities = {
        en: "All Your Activities",
        fr: "Toutes vos activités"
    }[GState.lang]
    select_from = {
        en: "Select From",
        fr: "Selectioner De"
    }[GState.lang]
    remove_member = {
        en: "Remove Members",
        fr: "Retirer des membres"
    }[GState.lang]
    ban = {
        en: "Ban",
        fr: "Retirer"
    }[GState.lang]
    loading_data = {
        en: "Loading Data",
        fr: "Chargement des données"
    }[GState.lang]
    reply_privately_to = {
        en: "Mention privately to",
        fr: "Mention en privé à"
    }[GState.lang]
    author = {
        en: "Author",
        fr: "Auteur"
    }[GState.lang]
    reply_privately = {
        en: "Mention privately",
        fr: "Mention en privé"
    }[GState.lang]
    remind_member_action = {
        en: "remind member action",
        fr: 'action sure les members du programme'
    }[GState.lang]
    add_report = {
        en: "Add Report",
        fr: "Ajouter un raport"
    }[GState.lang]
    advanced_config = {
        en: "Advanced Configurations",
        fr: "Configurations avancées"
    }[GState.lang]
    weekly = {
        en: 'Week(s)',
        fr: 'Semaine(s)'
    }[GState.lang]
    daily = {
        en: "Day(s)",
        fr: 'Jour(s)'
    }[GState.lang]
    monthly = {
        en: 'Month(s)',
        fr: 'Mois'
    }[GState.lang]
    yearly = {
        en: 'Year(s)',
        fr: 'Ans'
    }[GState.lang]
    latest_update = {
        en: "Recently updated: ",
        fr: "Recement mis a jour "
    }[GState.lang]
    upddated_ = {
        en: "Updated ",
        fr: "Mis a jours "
    }[GState.lang]
    times = {
        en: "Times",
        fr: "Fois"
    }[GState.lang]
    program_members = {
        en: "Program members",
        fr: "Membres du programme"
    }[GState.lang]
    join_activity_via_qr = {
        en: "Join Activity through QR code",
        fr: "Joindre l'activité par le code QR"
    }[GState.lang]
    join_program_via_qr = {
        en: "Join program through QR",
        fr: "RRejoindre le programme par le biais de QR"
    }[GState.lang]
    relation = {
        en: "Relation",
        fr: "Relation"
    }[GState.lang]
    take_photo_from_internet = {
        en: "Take Photo from the internet",
        fr: "Prendre une photo sur internet"
    }[GState.lang]
    add_video = {
        en: "Add video",
        fr: "Ajouter une vidéo"
    }[GState.lang]
    add_audio = {
        en: "Add audio",
        fr: "Ajouter un audio"
    }[GState.lang]
    add_file = {
        en: "Add file",
        fr: "Ajouter un fichier"
    }[GState.lang]
    camera = {
        en: 'Camera',
        fr: 'Appareil photo'
    }[GState.lang]
    galery = {
        en: "Gallery",
        fr: 'Gallerie'
    }[GState.lang]
    star_must_have_at_least = {
        en: "A highlight must include at least a media or title",
        fr: "Un moment fort doit comprendre au moins un média ou un titre"
    }[GState.lang]
    manage_in_activity = {
        en: "Manage from activity",
        fr: "Gérer de l'activité"
    }[GState.lang]
    remove_photo = {
        en: "Remove Photo",
        fr: "Retirer la photo"
    }[GState.lang]
    title = {
        en: 'Title',
        fr: "Titre"
    }[GState.lang]
    not_found_item = {
        en: "Item not found",
        fr: "Element non trouvable"
    }[GState.lang]
    edit = {
        en: 'Edit',
        fr: 'Editer'
    }[GState.lang]
    add = {
        en: 'Add',
        fr: 'Ajouter'
    }[GState.lang]
    infinity = {
        en: 'infinity',
        fr: 'infini'
    }[GState.lang]
    record_audio = {
        en: "Record Sound",
        fr: "Enregistree un son"
    }[GState.lang]
    all_programs = {
        en: "All Programs",
        fr: "Tous les programmes"
    }[GState.lang]
    programs = {
        en: "Programs",
        fr: "Programmes"
    }[GState.lang]
    loading = {
        en: "Loading",
        fr: "Chargement"
    }[GState.lang]
    no_updates_yet = {
        en: "no updates yet",
        fr: 'aucune mise a jour faite'
    }[GState.lang]
    update_on_main_activity = {
        en: "Updates on activity",
        fr: "Mises à jour sur l'activité"
    }[GState.lang]
    changed_the_title_to = {
        en: "Changed The name of the activity to: ",
        fr: "A remplacé le nom par: "
    }[GState.lang]
    changed_background_photo = {
        fr: "A changé la photo d'arrière-plan de l'activité",
        en: "Changed the background photo of the activity"
    }[GState.lang]
    removed_the_background_of_th_activity = {
        fr: "A supprimé la photo d'arrière-plan de l'activité",
        en: "Removed The Activity Background Photo"
    }[GState.lang]
    changed_the_description_the_activity = {
        en: "Changed the description of the activity To: ",
        fr: "A changé la description de l'activité en: "
    }[GState.lang]
    removed_the_description_of_the_activity = {
        en: "Removed the description of the activity",
        fr: "A supprimé la description de l'activité"
    }[GState.lang]
    opnened_the_main_activity = {
        en: "Opened the  activity",
        fr: "A ouvert l'activité"
    }[GState.lang]
    closed_the_activity = {
        en: "Closed the activity",
        fr: "A fermé l'activité"
    }[GState.lang]
    changed_the_manage_previledge_of_the_activity = {
        en: "Changed the manage privileges of the activity To: ",
        fr: "A changé les privilèges de gestion de l'activité a: "
    }[GState.lang]
    shared_the_activity_to_his_contacts = {
        en: "Published the activity to his/her contacts",
        fr: "A publié l'activité à ses contacts"
    }[GState.lang]
    changed_participant_status = {
        en: "Changed participant(s) status",
        fr: "a changé le statut de participant (s)"
    }[GState.lang]
    left_the_activity = {
        en: "Left the activity",
        fr: "a quitté l'activité"
    }[GState.lang]
    removed_participants_from_activity = {
        en: "Removed participant(s) from activity",
        fr: "a supprimé le (s) participant (s) de l'activité "
    }[GState.lang]
    added_highlight = {
        en: "Added a highlight to the activity",
        fr: "a ajouté un message important à l'activité"
    }[GState.lang]
    updates_on = {
        en: "Updates On",
        fr: "Mises à jour sur"
    }[GState.lang]
    changed_the_content = {
        en: "Changed The Content of",
        fr: "a changé du contenu de"
    }[GState.lang]
    removed_the_content = {
        en: "Removed The Content of",
        fr: "a supprimé le contenu"
    }[GState.lang]
    changed_the_media = {
        en: "Changed The Media  of",
        fr: "A changé le média de"
    }[GState.lang]
    changed_title = {
        en: "Changed The Title of",
        fr: "A changé le titre de"
    }[GState.lang]
    to = {
        en: "to",
        fr: "à"
    }[GState.lang]
    removed_the_title = {
        en: "Removed The Title of",
        fr: "A supprimé le titre de"
    }[GState.lang]
    changed_the_privacy_level = {
        en: "Changed the privacy level of",
        fr: "A changé le niveau de confidentialité de"
    }[GState.lang]
    deleted = {
        en: "Deleted",
        fr: "A supprimé"
    }[GState.lang]
    restored = {
        en: "Restored",
        fr: "a restauré"
    }[GState.lang]
    new_participant = {
        en: "New Participant",
        fr: "Nouveau participant"
    }[GState.lang]
    you = {
        fr: "Vous",
        en: "You"
    }[GState.lang]
    join_activity = {
        en: "Joined The Activity",
        fr: "a rejoint l'activité"
    }[GState.lang]
    added_remind = {
        en: "Added a new Program",
        fr: 'a ajouté un nouveau programme'
    }[GState.lang]
    change_the_date_of_remind = {
        en: "Changed Date/Time Of The program To ",
        fr: "A changé la date / l'heure du programme " + this.to
    }[GState.lang]
    changed_remind_description = {
        en: "Changed the description of the program to",
        fr: "A changé la description du programme en",
    }[GState.lang]
    added_description_to_the_program = {
        en: "Added a description to the program",
        fr: "A ajouté une description au programme"
    }[GState.lang]
    removed_description_from_program = {
        en: "Removed the description of the program",
        fr: "A supprimé la description du programme"
    }[GState.lang]
    changed_the_title_of_the_program = {
        en: "Changed the title of the program to",
        fr: "A changé le titre du programme en"
    }[GState.lang]
    changed_the_privacy_level_of_program = {
        en: "Changed privacy level of the program to",
        fr: "A changé le niveau de confidentialité du programme en"
    }[GState.lang]
    changed_recurrence_config = {
        en: "Changed the recurrency configuration",
        fr: "A changé la configuration de la récurrence"
    }[GState.lang]
    assigned_to = {
        en: "Assigned the program To",
        fr: "A assigné le programme à"
    }[GState.lang]
    unassigned_from = {
        en: "Unassigned this program from ",
        fr: "A Non attribué ce programme a"
    }[GState.lang]
    marked_remind_as_done = {
        en: "Marked the program as done",
        fr: "A marqué le programme comme fait"
    }[GState.lang]
    confirmed_the_program_completion = {
        en: "Confirmed the program completion of",
        fr: "A confirmé la fin du programme"
    }[GState.lang]
    changed_the_must_report_status = {
        en: "Changed the must report status of the program",
        fr: "a changé le statut de rapport obligatoire du programme"
    }[GState.lang]
    added_members_to_the_activity = {
        en: "Added new members to the activity",
        fr: "A ajouté de nouveaux membres à l'activité"
    }[GState.lang]
    changed_program_location = {
        en: "Changed the venue of the program to",
        fr: "A changé le lieu du programme pour"
    }[GState.lang]
    changed_media_specifications_of_program = {
        en: "Changed the media of the program ",
        fr: "A changé le média du programme"
    }[GState.lang]
    shared = {
        en: "Shared",
        fr: "A partagé"
    }[GState.lang]
    to_his = {
        en: "to his",
        fr: "a ses"
    }[GState.lang]
    changed_the_default_alarm_settings = {
        en: "Changed the default alarms definition of the program",
        fr: "A changé la définition des alarmes par défaut du programme"
    }[GState.lang]
    first_update = {
        en: "First Update",
        fr: "Première mise à jour"
    }[GState.lang]
    created_the_activity = {
        en: "Created the activity",
        fr: "ont créé l'activité"
    }[GState.lang]
    microphone_permission = {
        en: "Microphone Permission",
        fr: "Autorisation du microphone"
    }[GState.lang]
    beup_needs_to_record = {
        en: 'BeUp needs access to your microphone to record audio',
        fr: "BeUp a besoin d'accéder à votre microphone pour enregistrer de l'audio"
    }[GState.lang]
    ask_me_later = {
        en: "Ask Me Later",
        fr: "Demande moi plus tard"
    }[GState.lang]
    cannot_record_due_to = {
        en: "cannot record due to ",
        fr: "impossible d'enregistrer en raison de "
    }[GState.lang]
    activity_setting = {
        en: "Activity Settings",
        fr: "Paramètres d'activité"
    }[GState.lang]
    can_be_managed_by = {
        en: "Can be managed by",
        fr: "Peut être géré par"
    }[GState.lang]
    shared_the_activity = {
        en: "Shared The Activity",
        fr: "partagé l'activité"
    }[GState.lang]
    activity_successfully_shared = {
        en: "successfully published",
        fr: "publié avec succès"
    }[GState.lang]
    activity_sucessfully_joined = {
        en: "Activity successfully joined !",
        fr: "Activité jointe avec succès"
    }[GState.lang]
    unpublished_the_activity = {
        en: "UnPublished The Activity",
        fr: "a non publié l'activité"
    }[GState.lang]
    name_is_too_long = {
        en: "name is too long; the name should not be more than 30 characters",
        fr: "le nom est trop long; le nom ne doit pas dépasser 30 caractères"
    }[GState.lang]
    anybody = {
        en: "anybody",
        fr: "n'importe qui"
    }[GState.lang]
    masters = {
        fr: "master",
        en: "master"
    }[GState.lang]
    creator = {
        en: "creator",
        fr: "createur"
    }[GState.lang]
    master = {
        en: "Master",
        fr: "Master"
    }[GState.lang]
    member = {
        en: "Member",
        fr: "Membre"
    }[GState.lang]
    check_activity = {
        en: "Check activities",
        fr: "Vérifier les activités"
    }[GState.lang]
    remove_as_master = {
        en: "Remove as Master",
        fr: "Supprimer en tant que maître"
    }[GState.lang]
    add_as_masteur = {
        en: "Add as Master",
        fr: "Ajouter en tant que maître"
    }[GState.lang]
    leave_activity = {
        en: "Leave activity",
        fr: "Quitter l'activité"
    }[GState.lang]
    invitation_was_successfull = {
        en: "invitations were successfully sent !",
        fr: "les invitations ont été envoyées avec succès "
    }[GState.lang]
    open = {
        en: "Open",
        fr: "Ouvrire"
    }[GState.lang]
    close = {
        en: "Close",
        fr: "Fermer"
    }[GState.lang]
    from = {
        fr: 'De',
        en: 'From'
    }[GState.lang]
    now = {
        en: 'now',
        fr: 'maintenant'
    }[GState.lang]
    today = {
        en: 'Today',
        fr: "Aujourd'hui"
    }[GState.lang]
    yesterday = {
        en: 'Yesterday',
        fr: 'Hier'
    }[GState.lang]
    two_days_ago = {
        en: '2 Days Ago',
        fr: 'Il y a deux jours'
    }[GState.lang]
    three_days_ago = {
        en: '3 Days Ago',
        fr: 'Il y a 3 jours',
    }[GState.lang]
    four_days_ago = {
        en: '4 Days Ago',
        fr: 'Il y a 4 jours'
    }[GState.lang]
    five_day_ago = {
        fr: 'Il y a 5 jours',
        en: '5 Days Ago'
    }[GState.lang]
    six_days_ago = {
        en: '6 Days Ago',
        fr: 'Il y a 6 jours'
    }[GState.lang]
    seven_days_ago = {
        en: '7 Days Ago',
        fr: 'Il y a 7 jours'
    }[GState.lang]
    telephone = {
        en: 'Telephone',
        fr: 'Téléphone'
    }[GState.lang]
    status = {
        en: 'Status',
        fr: 'Statut'
    }[GState.lang]
    name = {
        en: 'Name',
        fr: 'Nom'
    }[GState.lang]
    write_your_status = {
        en: 'Write your Status',
        fr: 'Inscrivez votre statut'
    }[GState.lang]
    blocked = {
        en: 'Blocked',
        fr: 'Bloqué'
    }[GState.lang]
    muted = {
        en: 'Muted',
        fr: 'Muet'
    }[GState.lang]
    forwarded = {
        en: 'forwarded',
        fr: 'transmis'
    }[GState.lang]
    years_ago = {
        en:'long times ago',
        fr: "il y a longtemps"
    }[GState.lang]
}
const Texts = new TEXTS()
export default Texts