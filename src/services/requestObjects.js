import moment from "moment"
class Request {
    constructor() { }

    presence() {
        return {
            nothing: "this request is usually empty"
        }
    }
    Update() {
        return {
            action: "",
            event_id: "",
            phone: "",
            about_update: this.AboutUpdate(),
            participant_update: this.ParticipantUpdate(),
            location_update: this.LocationUpdate(),
            period_update: this.PeriodUpdate(),
            background_update: ""
        }
    }
    AboutUpdate() {
        return {
            action: "",
            title: "",
            description: ""
        }
    }
    ParticipantUpdate() {
        return {
            action: "",
            phone: "",
            master: "",
            status: "",
            host: ""
        }
    }
    updateVote() {
        return {
            event_id: "",
            vote_id: "",
            action: "",
            data: ""
        }
    }
    addVoteOption() {
        return {
            event_id: "",
            vote_id: "",
            option: this.Option()
        }
    }
    removeVoteOption() {
        return {
            event_id: "",
            vote_id: "",
            option_name: ""
        }
    }
    PeriodUpdate() {
        return {
            action: "",
            date: "",
            time: ""
        }
    }
    ContributionUpdate() {
        return {
            event_id: "",
            contribution_id: "",
            new_data: "",
            action: ""
        }
    }
    LocationUpdate() {
        return {
            action: "",
            string: "",
            url: ""
        }
    }
    remind() {
        return {
            id: '',
            event_id: "",
            create_at: moment().format("YYYY-MM-DD HH:mm"),
            updated_at: moment().format("YYYY-MM-DD HH:mm"),
            creator: '',
            title: '',
            description: '',
            period: this.Period()
        }
    }

    RemindID() {
        return {
            remind_id: ''
        }
    }

    RemindUdate() {
        return {
            action: "",
            event_id: "",
            remind_id: "",
            data: ""
        }
    }
    Invitation() {
        return {
            inviter: "",
            invitee: "",
            invitation_id: "",
            host: "",
            period: "",
            event_id: "",
            status: ""
        }
    }
    Invite() {
        return {
            invitee: "",
            invitation: this.Invitation(),
            host: ""
        }
    }
    ContributionState() {
        return {
            contribution_id: "",
            event_id: "",
            state: ""
        }
    }
    MustContribute() {
        return {
            contribution_id: "",
            event_id: "",
            action: ""
        }
    }
    ContributionPeriod() {
        return {
            event_id: "",
            contribution_id: "",
            period: this.Period()
        }
    }
    //this means Vote-Event-ID
    VEID() {
        return {
            event_id: "",
            vote_id: ""
        }
    }
    //this means Contribution-Event-ID
    CEID() {
        return {
            contribution_id: "",
            event_id: ""
        }
    }
    //this means Highlight-Event-ID
    HEID() {
        return {
            event_id: "",
            h_id: ""
        }
    }
    HID() {
        return {
            h_id: ""
        }
    }
    Vote() {
        return {
            id: "",
            likes: 0,
            event_id: "",
            title: "",
            created_at: moment().format("YYYY-MM-DD HH:mm"),
            updated_at: moment().format("YYYY-MM-DD HH:mm"),
            period: this.Period(),
            option: [this.Option()],
            description: "",
            published: false,
            creator: ""
        }
    }
    Option() {
        return {
            name: "",
            vote_number: 0
        }
    }
    Voter() {
        return {
            vote_id: "",
            option: ""
        }
    }
    //this means Vote-ID
    VID() {
        return {
            vote_id: ""
        }
    }
    VotePeriod() {
        return {
            event_id: "",
            vote_id: "",
            period: this.Period()
        }
    }
    Contribute() {
        return {
            contribution_id: "",
            contributor: this.Contributor()
        }
    }
    //this means Contribution-ID
    CID() {
        return {
            contribution_id: ""
        }
    }
    AddContributionMean() {
        return {
            event_id: "",
            contribution_id: "",
            new_mean: this.ContributionMean()
        }
    }
    RemoveContributionMean() {
        return {
            event_id: "",
            contribution_id: "",
            mean_name: ""
        }
    }
    UpdateContributionMeamName() {
        return {
            event_id: "",
            contribution_id: "",
            mean_name: "",
            new_name: ""
        }
    }
    Contribution() {
        return {
            id: "",
            creator: "",
            event_id: "",
            created_at: moment().format("YYYY-MM-DD HH:mm"),
            updated_at: moment().format("YYYY-MM-DD HH:mm"),
            title: "",
            period: this.Period(),
            contribution_mean: [this.ContributionMean()],
            contribution_number: 0,
            published: false,
            state: "open",
            contributor: [this.Contributor()],
            like: 0,
            amount: 0
        }
    }
    Highlight() {
        return {
            id: "",
            creator: "",
            event_id: "",
            created_at: moment().format("YYYY-MM-DD HH:mm"),
            updated_at: moment().format("YYYY-MM-DD HH:mm"),
            title: "",
            description: "",
            url: ""
        }
    }
    ContributionMean() {
        return {
            mean_name: "",
            credential: ""
        }
    }
    Contributor() {
        return {
            contributor: "",
            amount: 0,
            currency: ""
        }
    }
    Past() {
        return {
            event_id: ""
        }
    }
    Time() {
        let time = moment().format("YYYY-MM-DD HH:mm").split(" ")[1].split(":")
        return {
            hour: time[0],
            mins: time[1],
            secs: ''
        }
    }
    Date() {
        let date = moment().format("YYYY-MM-DD HH:mm").split(" ")[0].split("-")
        return {
            year: date[0],
            month: date[1],
            day: date[2]
        }
    }
    //This means Highlight-update
    HUpdate() {
        return {
            event_id: "",
            h_id: "",
            action: "",
            new_data: ""
        }
    }
    Event() {
        return {
            id: "",
            host: "",
            created_at: moment().format("YYYY-MM-DD HH:mm"),
            updated_at: moment().format("YYYY-MM-DD HH:mm"),
            creator_phone: "",
            about: this.About(),
            period: this.Period(),
            location: this.Location(),
            background: "",
            participant: [this.Participant()],
            likes: 0,
            reminds: null,
            public: false,
            votes: null,
            highlights: null,
            contributions: null,
            must_contribute: null
        }
    }
    Period() {
        return {
            time: this.Time(),
            date: this.Date()
        }
    }
    Location() {
        return {
            string: "",
            url: ""
        }
    }
    Participant() {
        return {
            phone: "",
            master: false,
            status: "invited",
            host: ""
        }
    }
    About() {
        return {
            title: "",
            description: ""
        }
    }
    Postpone() {
        return {
            event_id: "",
            new_time: this.Time(),
            new_date: this.Date()
        }
    }
    Leave() {
        return {
            event_id: "",
            phone: "",
        }
    }
    EventID() {
        return {
            event_id: ""
        }
    }
    EventIDHost() {
        return {
            event_id: "",
            host: ""
        }
    }
    Contact() {
        return {
            contact: "",
            host: ""
        }
    }
    Field() {
        return {
            event_id: "",
            field: ""
        }
    }
    User() {
        return {
            phone: "",
            nick_name: "",
            name: "",
            current_host: "",
            email: "",
            birth_date: "",
            status: "",
            profile: "",
            profile_ext: "",
            password: ""
        }
    }
    None() {
        return {
            none: ""
        }
    }
}
const request = new Request()

export default request
