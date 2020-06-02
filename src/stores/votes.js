import storage from "./Storage";
import {
    observable,
    action
} from "mobx";
import {
    uniqBy,
    reject,
    find,
    filter,
    sortBy,
    findIndex
} from "lodash";
import moment from "moment";
import request from '../services/requestObjects';
import tcpRequest from '../services/tcpRequestData';
import EventListener from '../services/severEventListener';

export default class votes {
    constructor() {
        //storage.remove(this.saveKey).then(() => {})
        this.initilizeVotes()
        this.saveInterval = setInterval(() => {
            this.previousSaveTime !== this.currentSaveTime ?
                this.saver() : null
        }, this.saveInterval)

    }
    saveInterval = 2000
    saverInterval = null
    currentSaveTime = moment().format()
    previousSaveTime = moment().format()
    initilizeVotes() {
        console.warn("initializing votes")
        storage.load(this.readKey).then(data => {
            this.votes = data
        }).catch(() => {
            this.votes = {}
        })
    } 
    @observable votes = {};
    saver() {
        if (Object.keys(this.votes > 0)) {
            console.warn("persisiting votes")
            this.saveKey.data = this.votes
            storage.save(this.saveKey).then(() => {
                this.previousSaveTime = this.currentSaveTime
            })
        }
    }
    saveKey = {
        key: "votes",
        data: {}
    };
    extraVotes = {}

    fetchVoteFromRemote(roomID, voteID, simple) {
        return new Promise((resolve, reject) => {
            //if (this.extraVotes[voteID]) {
            //    resolve(this.extraVotes[voteID])
            //} else {
                let Vid = request.VID()
                Vid.vote_id = voteID
                tcpRequest.getVote(Vid, voteID + "_get_vote").then(JSONData => {
                    EventListener.sendRequest(JSONData, voteID + "_get_vote").then(vote => {
                        if (vote.data === 'empty' || !vote.data) {
                            resolve(request.Vote())
                        } else {
                            this.extraVotes[voteID] = vote.data
                            simple ? resolve(vote.data) : this.addVote(roomID, vote.data).then(() => {
                                resolve(vote.data)
                            })
                        }
                    }).catch(() => {
                        resolve(request.Vote())
                    })
                })
          //  }
        })
    }
    loadVote(roomID, voteID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                if (Votes[roomID] && Votes[roomID].length > 0) {
                    let vote = find(Votes[roomID], { id: voteID })
                    if (vote) {
                        resolve(vote)
                    } else {
                        if (voteID === request.Vote().id) {
                            this.addVote(roomID, request.Vote()).then(() => {
                                resolve(request.Vote())
                            })
                        } else {
                            this.fetchVoteFromRemote(voteID).then((remoteVote) => {
                                console.warn("votes fetched from remote", remoteVote)
                                resolve(remoteVote)
                            })
                        }
                    }
                } else {
                    if (voteID === request.Vote().id) {
                        this.addVote(roomID, request.Vote()).then(() => {
                            resolve(request.Vote())
                        })
                    } else {
                        this.fetchVoteFromRemote(voteID).then((remoteVote) => {
                            console.warn("votes fetched from remote", remoteVote)
                            resolve(remoteVote)
                        })
                    }
                }
            })
        })
    }
    addVote(roomID, Vote) {
        return new Promise((resolve, rejectPromise) => {
            this.readFromStore().then(Votes => {
                Votes[roomID] = reject(Votes[roomID], { id: Vote.id })
                if (Votes[roomID] && Votes[roomID].length > 0) {
                    Votes[roomID][Votes[roomID].length] = {
                        ...Vote,
                        index: Votes[roomID].length
                    }
                    this.setProperty(Votes)
                    resolve()
                }
                else {
                    Votes[roomID] = [{ ...Vote, index: 0 }]
                    this.setProperty(Votes)
                    resolve()
                }

            });
        });
    }
    setProperty(votes) {
        this.votes = votes
        this.currentSaveTime = moment().format()
    }
    removeVote(roomID, VoteID) {
        return new Promise((resolve, rejectPromise) => {
            this.readFromStore().then(Votes => {
                let vote = find(Votes[roomID], { id: VoteID })
                Votes[roomID] = reject(Votes[roomID], { id: VoteID });
                this.setProperty(Votes)
                resolve(vote);
            });
        });
    }
    vote(roomID, { vote_id, voter, option }) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let voteIndex = findIndex(Votes[roomID], { id: vote_id })
                if (voteIndex < 0) {
                    resolve(null)
                } else {
                    let optionIndex = findIndex(Votes[roomID][voteIndex].option, { index: option })
                    Votes[roomID][voteIndex].option[optionIndex].vote_count =
                        Votes[roomID][voteIndex].option[optionIndex].vote_count + 1
                    Votes[roomID][voteIndex].voter = uniqBy([...Votes[roomID][voteIndex].voter ? Votes[roomID][voteIndex].voter : [],
                    { phone: voter, index: option }], 'phone')
                    Votes[roomID][voteIndex].updated_at = moment().format()
                    this.setProperty(Votes)
                    resolve(Votes[roomID][voteIndex])
                }
            })
        })
    }
    fetchVotes(EventID, CommitteeID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                resolve(Votes && Votes[EventID] &&
                    Votes[EventID].filter(ele => ele.committee_id === CommitteeID));
            });
        });
    }
    updateVoteTitle(roomID, NewVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let index = findIndex(Votes[roomID], { id: NewVote.vote_id })
                Votes[roomID][index].title = NewVote.new_title
                this.setProperty(Votes)
                resolve(Votes[roomID][index]);
            });
        });
    }
    UpdateVoteDescription(roomID, NewVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let index = findIndex(Votes[roomID], { id: NewVote.vote_id })
                Votes[roomID][index].description = NewVote.new_description
                this.setProperty(Votes)
                resolve(Votes[roomID][index]);
            });
        });
    }

    UpdateVotePeriod(roomID, NewVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let index = findIndex(Votes[roomID], { id: NewVote.vote_id })
                let previousVote = Votes[roomID][index]
                Votes[roomID][index].period = NewVote.period
                this.setProperty(Votes)
                resolve(previousVote)
            });
        });
    }
    updateAlwayShowPercentage(roomID, newVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let index = findIndex(Votes[roomID], { id: newVote.vote_id })
                Votes[roomID][index].always_show = newVote.new_always_show
                this.setProperty(Votes)
                resolve(Votes[roomID][index]);
            });
        })
    }
    PublishVote(roomID, newVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let index = findIndex(Votes[roomID], { id: newVote.vote_id })
                Votes[roomID][index].published = newVote.new_public_state
                this.setProperty(Votes)
                resolve(Votes[roomID][index]);
            });
        });
    }
    updateVoteOptions(roomID, NewVote) {
        console.warn("updating vote options")
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let index = findIndex(Votes[roomID], { id: NewVote.vote_id })
                Votes[roomID][index].option = NewVote.new_option
                this.setProperty(Votes)
                resolve(Votes[roomID][index])
            })
        })
    }
    clearVoteCreation(roomID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((Votes) => {
                let index = findIndex(Votes[roomID], { id: request.Vote().id })
                Votes[roomID][index] = request.Vote()
                this.setProperty(Votes)
                resolve("ok")
            })
        })
    }
    UpdateEventVotes(EventID, NewVotes) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                Votes = reject(Votes, ["event_id", EventID]);
                Votes = Votes.concat(NewVotes);
                this.saveKey.data = sortBy(Votes, "update_date");
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    readKey = {
        key: "votes",
        autoSync: true
    }
    readFromStore() {
        return new Promise((resolve, reject) => {
            resolve(this.votes)
        });
    }
}
