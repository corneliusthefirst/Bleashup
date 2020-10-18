import GState from '../stores/globalState/index';
class TEXTS {
    constructor(language) {
        this.lang = language
    }
    profile_card = {
        en: "Profile Card",
        fr: "Carte De Profile"
    }[GState.lang]

    phone_number = {
        en: "Phone number",
        fr: "Numero De Telephone"
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
    remind_message = {
        en: "Remind Message",
        fr: "Message Rappel"
    }[GState.lang]
    files = {
        en: "Files",
        fr: "Fichier"
    }[GState.lang]
    add_photos = {
        en: "Photos",
        fr: "Photos"
    }[GState.lang]
    qr_scanner = {
        en: "QR Join",
        fr: "Joindre Par QR"
    }[GState.lang]
    reminds = {
        en: "Reminds",
        fr: "Rappels"
    }[GState.lang]
    new_activity = {
        en: "New Activity",
        fr: "Nouvelle Activitee"
    }[GState.lang]
    cancel = {
        en: "Cancel",
        fr: "Anuller"
    }[GState.lang]
    go_back = {
        en: "Go Back",
        fr: "Retoure"
    }[GState.lang]
    confirm_password = {
        en: "Please confirm password",
        fr: "Confirmez votre mots de pass"
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
        fr: "Entree votre mots de pass"
    }[GState.lang]
    invalide_password = {
        en: "Invalid password",
        fr: "Mots de pass non valide"
    }[GState.lang]
    not_empty_password = {
        en: "password cannot be empty",
        fr: "mots de pass ne peut etre vide"
    }[GState.lang]
    enter_name = {
        en: "Please enter your name",
        fr: "Entree Votre nom"
    }[GState.lang]
    not_empty_name = {
        en: "User name cannot be empty",
        fr: "Ce champ ne peut etre vide"
    }[GState.lang]
    unable_to_verify_account = {
        en: "Unable To Verify Your Account, Please Check Your Internet Connection",
        fr: "Votre Compte N'a pas pu etre verifiee; SVP verifiez votre connection internet"
    }[GState.lang]
    phone_number_verify = {
        en: "Verify Your Phone Number",
        fr: "Verifiez votre numero de telephone"
    }[GState.lang]
    ok = {
        en: "OK",
        fr: "OK"
    }[GState.lang]
    sign_in = {
        en: "Sign In",
        fr: "Entree Votre Mots de pass"
    }[GState.lang]
    phone_number_verification = {
        en: "Phone Number Verification",
        fr: "Numero de verification"
    }[GState.lang]
    enter_verification_code = {
        en: "Please enter email verification code",
        fr: "Entree le code de verification recu"
    }[GState.lang]
    invalide_verification_code = {
        en: "Invalid email Verification code",
        fr: "Code de verfication invalide"
    }[GState.lang]
    confirm_you_account = {
        en: "Please Comfirm your Account; A verification Code was sent to your number",
        fr: "Confirmez votre compte; Un code de verificaton vous a ete envoyee"
    }[GState.lang]
    reset_password = {
        en: "Reset Password",
        fr: "changer de mot de pass"
    }[GState.lang]
    contacts = {
        en: "Contacts",
        fr: "Contacts"
    }[GState.lang]
    activity = {
        en: "Activity",
        fr: "Activitee"
    }[GState.lang]
    my_activity = {
        en:"My Activity",
        fr: "Mon Activitee"
    }[GState.lang]
    activities = {
        en: 'Activities',
        fr: 'Activitees'
    }[GState.lang]
    cannot_send_message = {
        en: "cannot to forward message",
        fr: "message ne peut etre transmit"
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
        en: "Public",
        fr: "Public"
    }[GState.lang]
    private = {
        en: "Private",
        fr: "Privee",
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
        fr: "Une Semaine Avant"
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
        fr: "Trente minutes avant"
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
        fr: "Huite heures avant"
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
        en: "Unable to perform request",
        fr: "Impossible d'efecture cette action"
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
        fr: "Deja Confirmee"
    }[GState.lang]
    reply = {
        en: "Mention",
        fr: "Mentioner"
    }[GState.lang]
    update = {
        en: "Update",
        fr: "Metre a jour"
    }[GState.lang]
    delete_ = {
        en: "Delete",
        fr: "Suprimer"
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
        fr: "Cette Activitee a ete suspendu"
    }[GState.lang]
    copy = {
        en: "Copy",
        fr: "Copier"
    }[GState.lang]
    star = {
        en: "Star",
        fr: "Favoriser"
    }[GState.lang]
    remind = {
        en: "Program",
        fr: "Programer"
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
        fr: "Cette video n'est plus accessible"
    }[GState.lang]
    new_messages = {
        en: 'New Messages',
        fr: "Nouveau messages"
    }[GState.lang]
    remind_must_have_atleate_date_time_or_title = {
        en: "Program Must Have Atleat a Title and Data/Time",
        fr: "Un Programme doit au moin contenire un title et une date"
    }[GState.lang]
    remind_configs = {
        en: "Program configs",
        fr: "Configuration Du Program"
    }[GState.lang]
    add_remind = {
        en: "Add Program",
        fr: "Ajouter un Program"
    }[GState.lang]
    scann_qr = {
        en : "Scan QR Code",
        fr: "Scanner le Code QR"
    }[GState.lang]
    program_members = {
        en: "Program Members",
        fr: "Membres du program"
    }[GState.lang]
    cannot_reply_unsent_message = {
        en: 'unable to reply for unsent messages',
        fr: 'ne peut repondre un message non envoyee'
    }[GState.lang]
    b_up_chatroom = {
        en: 'BeUp Chat Room',
        fr: 'Salon Conversation'
    }[GState.lang]
    send_a_message = {
        en: "Send a message as text",
        fr: 'Envoyer un message comme text'
    }[GState.lang]
    send_message_as_emoticons = {
        en: "Send message as emoticons",
        fr: "Envoyer un message emoticons"
    }[GState.lang]
    use_it_to = {
        en:"Use it to",
        fr: "Utilise le pour"
    }[GState.lang]
    send_multimedia_messages = {
        en:"Send multimedia files like: audio, video, photos and, any type of file",
        fr: "Envoyer des fichier multimedia tel que: audios, photo, video, and n'importe quelle type de fichier"
    }[GState.lang]
    share_thinks_like = {
        en: "Share Things like (Contacts, Activities, Programs, Highlights etc)",
        fr: "Partager des choses tell que des Contacts, des Activitee, des Programmes etc"
    }[GState.lang]
    mention_everything = {
        en: "Mention a message, program, highlight, any update made in the activity, activity description, activity photo and etc",
        fr: "Mentionner un message, un programme, une mise en évidence, toute mise à jour effectuée dans l'activité, la description de l'activité, la photo de l'activité, etc."
    }[GState.lang]
    turn_a_message_into_a_program = {
        en: "Turn a message into a program and vice versa",
        fr: "Faire d'un message un programme et vice versa"
    }[GState.lang]
    turn_a_message_a_highlight = {
        en: "Turn a message into a highlight and vice versa",
        fr: "Transformez un message en un moment fort et vice versa"
    }[GState.lang]
    be_up_reminds = {
        en : "BeUp Programs",
        fr: "Programmes"
    }[GState.lang]
    program_descriptions = {
        en: "Programs are the essence of the activity; use a program to make people know and be reminded of everything taking place in the activity. \n\n Click on the button below to add a program.",
        fr: "Programmes sont l'essence meme d'une activitee; Tres utiles pour signaler et rappeler tous ce qui se passe dans l'activitee. \n\n clickez sur le button dessous pour ajouter un programme."
    }[GState.lang]
    beup_highlight = {
        en: "BeUp Highlights",
        fr: "Moments forts"
    }[GState.lang]
    beup_highlight_description = {
        en: "Highlights are essential to keep important stuffs which are to be accessible by any member of the activity \n\n Click below to add a Highlight",
        fr: "Tres important pour garder les choses importants relative a l'activitee. \n\n Clickee le button dessou pour ajouter"
    }[GState.lang]
    beup_activity = {
        en: "BeUp Activity",
        fr: "Activitee de BeUp"
    }[GState.lang]
    beup_activity_description = {
        en: "BeUp activity is a place where one can organize programs, invite people to the program, share the program for people to join the program. An activity has group chat where people can discuss fun and stuffs related to programs. People can also Keep track most important stuffs in the activity by adding them as highlights. \n\n Click below to get started.",
        fr: "L'activité BeUp est un endroit où l'on peut organiser des programmes, inviter des gens au programme, partager le programme pour que les gens rejoignent le programme. Une activité comprend une discussion de groupe où les gens peuvent discuter de plaisir et de choses liées aux programmes. Les gens peuvent également suivre les éléments les plus importants de l'activité en les ajoutant en tant que faits saillants. \n \n Cliquez ci-dessous pour commencer."
    }[GState.lang]
    no_activity_found = {
        en: "No activity found! ",
        fr: "Aucune activité trouvée!"
    }[GState.lang]
    click_below_to_create_a_new_one = {
        en: "Click below to create a new one",
        fr: "Cliquez ci-dessous pour en créer un nouveau"
    }[GState.lang]
    activity_name= {
        en: "Activity name",
        fr: "Nom de l'activitee"
    }[GState.lang]
    add_activity = {
        en: "Create",
        fr: "Cree"
    }[GState.lang]
    show_less = {
        en:"Show less",
        fr: "Voir moin"
    }[GState.lang]
    show_more = {
        en: "Show more",
        fr: "Voir moin"
    }[GState.lang]
    activity_actions = {
        en: "Activity Actions",
        fr: "Actions sur l'activitee"
    }[GState.lang]
    delete_activity = {
        en: "Delete Activity",
        fr: "Effacer cette activitee"
    }[GState.lang]
    are_you_sure_to_delete_activity = {
        en: 'are you sure you want to delete this activity ?',
        fr: 'etes vous sur de vouloire effacer cette activitee'
    }[GState.lang]
    react_to_a_message = {
        en: "React to a sent message",
        fr: "React a un message envoyee"
    }[GState.lang]
    delete_a_message = {
        en: "Delete a sent message",
        fr: "Effacer un message envoyee"
    }[GState.lang]
    see_message_info = {
        en: "Check the status of every sent message",
        fr: "Verifier le status de chaque message envoyee"
    }[GState.lang]
    participants_list = {
        en: "Participants List",
        fr: "List des participants"
    }[GState.lang]
    select_activity = {
        en: "Select activity",
        fr: "Selectioner Lactivitee",
    }[GState.lang]
    program = {
        en: "Program",
        fr: "Program"
    }[GState.lang]
    restore = {
        en: "Restore",
        fr: "restorer"
    }[GState.lang]
    your_event_title = {
        en: "Program title",
        fr: "Title du program"
    }[GState.lang]
    remind_message = {
        en: "Program message",
        fr: "Message du rappel"
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
    days = {
        en: "days",
        fr: "jours"
    }[GState.lang]
    selete_recurrence_stop_date = {
        en: "Select repeat stop date",
        fr: "Date de fin de repetition"
    }[GState.lang]
    venue = {
        en: "Venue",
        fr: "lieux"
    }[GState.lang]
    details = {
        en: "Details",
        fr: "Detailes"
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
        en: "This messages wa never sent",
        fr: "Ce message n'a jamais ete envoyee"
    }[GState.lang]
    press_long_to_record = {
        en: "Long press to start recording",
        fr: "Apuiez Logntemp pour commencer a enregister"
    }[GState.lang]
    start_a_conversation = {
        en: "Relate",
        fr: "Discuter"
    }[GState.lang]
    write_to_disk_permission = {
        en: "Write To Storage Permission",
        fr: "Pemission D'utilisation de l'espace stockage"
    }[GState.lang]
    writ_to_disk_permission_message = {
        en: "BeUp Wants to write to disk",
        fr: "BeUp veut sauvegarder dans le stockage"
    }[GState.lang]
    loading_video = {
        en: "Video Loading",
        fr: "Chargement de la video"
    }[GState.lang]
    star_messages_at = {
        en: "Stars @",
        fr: "Stars @"
    }[GState.lang]
    reminds_at = {
        en: "Programs @ ",
        fr: "Programmes @ "
    }[GState.lang]
    typing = {
        en: "typing ...",
        fr: "ecrit ..."
    }[GState.lang]
    successfull_restoration = {
        en: "restoration was successful",
        fr: "restoration effectuer avec success"
    }[GState.lang]
    restored_already = {
        en: "restored already",
        fr: "deja restoree"
    }[GState.lang]
    add_participant = {
        en: "Add Participant To this Commitee",
        fr: "Ajouter des participant a ce comitee"
    }[GState.lang]
    select_members_to_remove = {
        en: "Select Members To Remove",
        fr: "Selectioner les members a enlever"
    }[GState.lang]
    no_member_selected = {
        en: "no members selected",
        fr: "pas de membres selectionee"
    }[GState.lang]
    are_you_sure_you_want_to_leave = {
        en: "Are you sure you want to leave this activity ?",
        fr: "Etes vous sur de vouloir quiter cette activitee"
    }[GState.lang]
    leave_activity = {
        en: "Leave activity",
        fr: "Quiter L'Activitee"
    }[GState.lang]
    not_member_anymore = {
        en: "You are not a  member anymore !",
        fr: "Vous n'etes plus un member de cette activitee"
    }[GState.lang]
    remove_photo = {
        en: "Remove Photo",
        fr: "Enlever la photo"
    }[GState.lang]
    are_you_sure_to_remove_photo = {
        en: "Are You Sure You Want To Remove This Photo",
        fr: "Etes vous sur de vouloir enlever cette photo"
    }[GState.lang]
    remove = {
        en: "Remove",
        fr: "Retirer"
    }[GState.lang]
    are_you_sure_to_close = {
        en: "Are You Sure You Want To Close This Activiy ?",
        fr: "Etes vous sur de vouloir fermer cette activitee"
    }[GState.lang]
    close_activity = {
        en: "Close Activity",
        fr: "Fermer L'Activitee"
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
        fr: "Occupee"
    }[GState.lang]
    at_school = {
        en: "At school",
        fr: "A l'ecole"
    }[GState.lang]
    at_work = {
        en: "At work",
        fr: "Au travail"
    }[GState.lang]
    at_cinema = {
        en: "At cinema",
        fr: "Au Cinema"
    }[GState.lang]
    at_meeting = {
        en: "At metting",
        fr: "En reunion"
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
        fr: "Batterie tres faible"
    }[GState.lang]
    copied = {
        en: 'copied !',
        fr: 'copiee'
    }[GState.lang]
    your_text = {
        en: "Your Message",
        fr: "Votre Message"
    }[GState.lang]
    enter_your_search = {
        en: "Enter your search",
        fr: "Entree votre recherche"
    }[GState.lang]
    a_bleashup_user = {
        en: "a BeUp user",
        fr: "un utilisateur de BeUp"
    }[GState.lang]
    start_a_relation_or_invite_a_contact = {
        en: "Start a relation or Invite a contact to join BeUp",
        fr: "Commencer une relation ou Inviter un contact a rejoindre BeUp"
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
        en: 'Bleashup would like to view your contacts.',
        fr: "Bleashup veut acceder a vos contact"
    }[GState.lang]
    accept = {
        en: "Accept",
        fr: "Accepter"
    }[GState.lang]
    unknow_user_consider_inviting = {
        en: "unnknown user please consider inviting this contact",
        fr: "Utilisateur inconnu SVP inviter ce contact"
    }[GState.lang]
    already_a_contact = {
        en: "Already exists as contacts",
        fr: "Exist Deja comme contact"
    }[GState.lang]
    activity_description = {
        en: "Activity description",
        fr: "Description de l'activitee"
    }[GState.lang]
    activity_description_placeholder = {
        en: "Activity Desciption goes here; no description currently provided.",
        fr: "La description de l'activitee vien ici; aucune description donnee pour le moment"
    }[GState.lang]
    no_description = {
        en: "No Description Provided",
        fr: "Pas de Description Donnee"
    }[GState.lang]
    select_new_members = {
        en: "Select New Members",
        fr: "Selectionez les nouveaux membres"
    }[GState.lang]
    members_and = {
        en: " members and ",
        fr: " membres et"
    }[GState.lang]
    masters = {
        en: " masters",
        fr: "masters"
    }[GState.lang]
    activity_photo = {
        en: "Activity Photo",
        fr: "Photo de Lactivitee"
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
        fr: "programmons ca"
    }[GState]
    last_seen = {
        en: "last seen: ",
        fr: "dernier fois: "
    }[GState.lang]
    history = {
        en: "History",
        fr: "Historique"
    }[GState.lang]
    delete_remind = {
        en: "Delete program",
        fr: "Effacer ce rappel"
    }[GState.lang]
    are_you_sure_to_delete = {
        en: "Are you sure you want to delete this program ?",
        fr: "etes vous sur de vouloire effacer ce program"
    }[GState.lang]
    remind_action = {
        en: "program actions",
        fr: "action sur le program"
    }[GState]
    no_connection_to_server = {
        en: "loading... from remote",
        fr: "chargement ..."
    }[GState.lang]
    logs = {
        en: "Change Logs",
        fr: "Changement"
    }[GState.lang]
    settings = {
        en: "Settings",
        fr: "Parametres"
    }[GState.lang]
    show_activity_description = {
        en: "View activity description",
        fr: "Voir la description de l'activitee"
    }[GState.lang]
    get_share_link = {
        en: "Get share link",
        fr: "Obtenir le lien de partage"
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
        en: "Unassign To Me",
        fr: "Me Deassigner"
    }[GState.lang]
    past_since = {
        en: "Past since: ",
        fr: "Passee Depuis"
    }[GState.lang]
    started = {
        en: "Started",
        fr: "Depuis"
    }[GState.lang]
    starts = {
        en: "Due",
        fr: "Pour"
    }[GState.lang]
    ends = {
        en: "Ends",
        fr: "Passes"
    }[GState.lang]
    deu = {
        en: "Deu",
        fr: "Pour"
    }[GState.lang]
    delete_highlight = {
        en: "Delete Star",
        fr: "Effacer Cette Etoile"
    }[GState.lang]
    are_you_sure_to_delete_this_highlight = {
        en: " Are you sure you want to delete these highlight ?",
        fr: "Etes vous sur de vouloir effacer cette eetoile"
    }[GState.lang]
    no = {
        en: "No",
        fr: "Non"
    }[GState.lang]
    yes = {
        en: "Yes",
        no: "Oui"
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
    yearly = {
        en: "yearly on",
        fr: "annuellement le"
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
        fr: "impossible de montree cette info"
    }[GState.lang]
    all_contacts = {
        en: "All Your Contacts",
        fr: "Tous Vos Contacts"
    }[GState.lang]
    all_activities = {
        en: "All Your Activities",
        fr: "Tous vos Activites"
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
        fr: "Chargement des donnee"
    }[GState.lang]
    reply_privately_to = {
        en: "Mention privately to",
        fr: "Mentioner en privee a"
    }[GState.lang]
    author = {
        en: "Author",
        fr: "Auteur"
    }[GState.lang]
    reply_privately = {
        en: "Mention privately",
        fr: "Mentioner en privee"
    }[GState.lang]
    remind_member_action = {
        en: "remind member action",
        fr: 'action sure les members'
    }[GState.lang]
    add_report = {
        en: "Add Report",
        fr: "Ajouter un raport"
    }[GState.lang]
    advanced_config = {
        en: "Advanced Configurations",
        fr: "Configuration Avancee"
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
        en: "Program Members",
        fr: "Membres du program"
    }[GState.lang]
    join_activity_via_qr = {
        en: "Join Actvity through QR code",
        fr: "Rejoindre un activitee par code QR"
    }[GState.lang]
    join_program_via_qr = {
        en: "Join program through QR",
        fr: "Rejoindre un program par code QR"
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
        fr: "Ajouter une video"
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
        fr: 'Camera'
    }[GState.lang]
    galery = {
        en: "Gallery",
        fr: 'Gallerie'
    }[GState.lang]
    star_must_have_at_least = {
        en: "A Star Must include at least a media or title",
        fr: "A message important doit avoir au moins un media ou un titre"
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
        en:'Title',
        fr: "Titre"
    }[GState.lang]
    not_found_item = {
        en: "Item not found",
        fr: "Element non trouvable"
    }[GState.lang]
    edit = {
        en:'Edit',
        fr: 'Editer'
    }[GState.lang]
    record_audio = {
        en: "Record Sound",
        fr: "Enregistree un son"
    }[GState.lang]
    all_programs = {
        en: "All Programs",
        fr: "Tous les programs"
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
        en: "Updates On Main Activity",
        fr: "Mises à jour sur l'activité principale"
    }[GState.lang]
}
const Texts = new TEXTS()
export default Texts