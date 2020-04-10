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
    constructor() { }
    @observable votes = [];
    saveKey = {
        key: "votes",
        data: []
    };
    fetchVoteFromRemote(voteID) {
        return new Promise((resolve, reject) => {
            let Vid = request.VID()
            Vid.vote_id = voteID
            tcpRequest.getVote(Vid, voteID + "_get_vote").then(JSONData => {
                EventListener.sendRequest(JSONData, voteID + "_get_vote").then(vote => {
                    console.warn(vote)
                    if (vote === 'empty' || !response) {
                        resolve(undefined)
                    } else {
                        this.addVote(vote).then(() => {
                            resolve(vote)
                        })
                    }
                }).catch(() => {
                    resolve()
                })
            })
        })
    }
    loadVote(voteID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                if (Votes && Votes.length > 0) {
                    let vote = find(Votes, { id: voteID })
                    if (vote) {
                        resolve(vote)
                    } else {
                        if (voteID === request.Vote().id) {
                            this.addVote(request.Vote()).then(() => {
                                resolve(request.Vote())
                            })
                        } else {
                            this.fetchVoteFromRemote(voteID).then((remoteVote) => {
                                resolve(remoteVote)
                            })
                        }
                    }
                } else {
                    this.fetchVoteFromRemote(voteID).then((remoteVote) => {
                        resolve(remoteVote)
                    })
                }
            })
        })
    }
    addVote(Vote) {
        return new Promise((resolve, rejectPromise) => {
            this.readFromStore().then(Votes => {
                Votes = reject(Votes, { id: Vote.id })
                if (Votes) this.saveKey.data = uniqBy([Vote, ...Votes], "id");
                else this.saveKey.data = [Vote];
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    removeVote(VoteID) {
        return new Promise((resolve, rejectPromise) => {
            this.readFromStore().then(Votes => {
                let vote = find(Votes, { id: VoteID })
                this.saveKey.data = reject(votes, { id: VoteID });
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve(vote);
                });
            });
        });
    }
    vote({ vote_id, voter, option }) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let voteIndex = findIndex(Votes, { id: vote_id })
                let optionIndex = findIndex(Votes[voteIndex].option, { index: option })
                Votes[voteIndex].option[optionIndex].vote_count =
                    Votes[voteIndex].option[optionIndex].vote_count + 1
                Votes[voteIndex].voter = uniqBy([...Votes[voteIndex].voter ? Votes[voteIndex].voter : [],
                { phone: voter, index: option }], 'phone')
                Votes[voteIndex].updated_at = moment().format()
                storage.save({ ...this.saveKey, data: Votes }).then(() => {
                    this.votes = Votes
                    resolve(Votes[voteIndex])
                })
            })
        })
    }
    fetchVotes(EventID, CommitteeID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                resolve(filter(Votes, {
                    event_id: EventID,
                    committee_id: CommitteeID
                }));
            });
        });
    }
    updateVoteTitle(NewVote, inform) {
        console.warn(NewVote)
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let index = findIndex(Votes, { id: NewVote.vote_id })
                Votes[index].title = NewVote.new_title
                this.saveKey.data = Votes
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve(Votes[index]);
                });
            });
        });
    }
    UpdateVoteDescription(NewVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let index = findIndex(Votes, { id: NewVote.vote_id })
                Votes[index].description = NewVote.new_description
                this.saveKey.data = Votes
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve(Votes[index]);
                });
            });
        });
    }

    UpdateVotePeriod(NewVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let index = findIndex(Votes, { id: NewVote.vote_id })
                let previousVote = find(Votes, { id: NewVote.vote_id })
                Votes[index].period = NewVote.period
                storage.save({ ...this.saveKey, data: Votes }).then(() => {
                    this.votes = Votes
                    resolve(previousVote)
                })
            });
        });
    }
    updateAlwayShowPercentage(newVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let index = findIndex(Votes, { id: newVote.vote_id })
                Votes[index].always_show = newVote.new_always_show
                this.saveKey.data = Votes
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve(Votes[index]);
                });
            });
        })
    }
    PublishVote(newVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let index = findIndex(Votes, { id: newVote.vote_id })
                Votes[index].published = newVote.new_public_state
                this.saveKey.data = Votes
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve(Votes[index]);
                });
            });
        });
    }
    updateVoteOptions(NewVote) {
        console.warn("updating vote options")
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let index = findIndex(Votes, { id: NewVote.vote_id })
                Votes[index].option = NewVote.new_option
                this.saveKey.data = Votes
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data
                    resolve(Votes[index])
                })
            })
        })
    }
    clearVoteCreation() {
        return new Promise((resolve, reject) => {
            this.readFromStore().then((Votes) => {
                let index = findIndex(Votes, { id: request.Vote().id })
                Votes[index] = request.Vote()
                this.saveKey.data = Votes
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data
                    resolve("ok")
                })
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
    readFromStore() {
        return new Promise((resolve, reject) => {
            storage
                .load({
                    key: "votes",
                    autoSync: true
                })
                .then(Votes => {
                    resolve(Votes);
                })
                .catch(error => {
                    resolve([]);
                });
        });
    }
}
