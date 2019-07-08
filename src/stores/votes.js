import storage from "./Storage";
import {
    observable,
    action
} from "mobx";
import {
    uniqBy,
    dropWhile,
    find,
    filter,
    sortBy,
    findIndex
} from "lodash";
import moment from "moment";
export default class votes {
    constructor() {}
    @observable votes = [];
    saveKey = {
        key: "votes",
        data: []
    };
    addVote(Vote) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                if (Votes) this.saveKey.data = uniqBy(Votes.concat([Vote]), "id");
                else this.saveKey.data = [Vote];
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    removeVote(VoteID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                this.saveKey.data = dropWhile(votes, ["id", VoteID]);
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    fetchVotes(EventID) {
        return new Promise((resolve, reject) => {
            if (this.votes) {
                resolve(
                    sortBy(filter(this.votes, {
                        event_id: EventID
                    })),
                    "update_date"
                );
            } else {
                this.readFromStore().then(Votes => {
                    resolve(sortBy(filter(Votes, {
                        event_id: EventID
                    })), "update_date");
                });
            }
        });
    }
    updateVoteTitle(NewVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let Vote = find(Votes, {
                    id: NewVote.id
                });
                let index = findIndex(Votes, {
                    id: NewVote.id
                });
                Vote.title = NewVote.title;
                if (inform) Vote.title_updated = true;
                Vote.update_date = moment.format("YYYY-MM-DD HH:mm");
                Votes.splice(index, 1, Vote);
                this.saveKey.data = sortBy(Votes, "update_date");
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    UpdateVoteDescription(NewVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let Vote = find(Votes, {
                    id: NewVote.id
                });
                let index = findIndex(Votes, {
                    id: NewVote.id
                });
                Vote.description = NewVote.description;
                if (inform) {
                    Vote.description_updated = true;
                    Vote.updated = true;
                }
                Vote.update_date = moment.format("YYYY-MM-DD HH:mm");
                Votes.splice(index, 1, Vote);
                this.saveKey.data = sortBy(Votes, "update_date");
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }

    UpdateVotePeriod(NewVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let Vote = find(Votes, {
                    id: NewVote.id
                });
                let index = findIndex(Votes, {
                    id: NewVote.id
                });
                Vote.period = NewVote.period;
                if (inform) {
                    Vote.period_updated = true;
                    Vote.updated = true;
                }
                Vote.update_date = moment.format("YYYY-MM-DD HH:mm");
                Votes.splice(index, 1, Vote);
                this.saveKey.data = sortBy(Votes, "update_date");
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    PublishVote(VoteID, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let Vote = find(Votes, {
                    id: VoteID
                });
                let index = findIndex(Votes, {
                    id: VoteID
                });
                Vote.published = true;
                Vote.update_date = moment.format("YYYY-MM-DD HH:mm");
                Votes.splice(index, 1, Vote);
                this.saveKey.data = sortBy(Votes, "update_date");
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    addVoteOption(NewVote, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let Vote = find(Votes, {
                    id: NewVote.id
                });
                let index = findIndex(Votes, {
                    id: NewVote.id
                });
                if (Vote.option) Vote.option = Vote.option.concat([NewVote.option]);
                else Vote.option = [NewVote.option];
                if (inform) {
                    Vote.option_added = true;
                    Vote.updated = true;
                }
                Vote.update_date = moment.format("YYYY-MM-DD HH:mm");
                Votes.splice(index, 1, Vote);
                this.saveKey.data = sortBy(Votes, "update_date");
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    removeVoteOption(VoteID, OptionName, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let Vote = find(Votes, {
                    id: VoteID
                });
                let index = findIndex(Votes, {
                    id: VoteID
                });
                Vote.option = dropWhile(Vote.option, ["name", OptionName]);
                if (inform) {
                    Vote.option_removed = true;
                    Vote.updated = true;
                }
                Vote.update_date = moment.format("YYYY-MM-DD HH:mm");
                Votes.splice(index, 1, Vote);
                this.saveKey.data = sortBy(Votes, "update_date");
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    UpdateVoteOptionName(VoteID, OptionName, NewOptionName, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let Vote = find(Votes, {
                    id: VoteID
                });
                let index = findIndex(Votes, {
                    id: VoteID
                });
                let option = find(Vote.option, {
                    name: OptionName
                });
                let optionIndex = findIndex(Vote.option, {
                    name: OptionName
                });
                option.name = NewOptionName;
                Vote.option.splice(optionIndex, 1, option);
                if (inform) {
                    Vote.option_name_changed = true;
                    Vote.updated = true;
                }
                Vote.update_date = moment.format("YYYY-MM-DD HH:mm");
                Votes.splice(index, 1, Vote);
                this.saveKey.data = sortBy(Votes, "update_date");
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    likeVote(VoteID, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let Vote = find(Votes, {
                    id: VoteID
                });
                let index = findIndex(Votes, {
                    id: VoteID
                });
                Vote.likes += 1;
                if (inform) Vote.like_updated = true;
                Vote.update_date = moment.format("YYYY-MM-DD HH:mm");
                Votes.splice(index, 1, Vote);
                this.saveKey.data = sortBy(Votes, "update_date");
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    unlikeVote(VoteID) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let Vote = find(Votes, {
                    id: VoteID
                });
                let index = findIndex(Votes, {
                    id: VoteID
                });
                Vote.likes -= 1;
                Vote.update_date = moment.format("YYYY-MM-DD HH:mm");
                Votes.splice(index, 1, Vote);
                this.saveKey.data = sortBy(Votes, "update_date");
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    votes(VoteID, OptionName, inform) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                let Vote = find(Votes, {
                    id: VoteID
                });
                let index = findIndex(Votes, {
                    id: VoteID
                });
                let option = find(Vote.option, {
                    name: OptionName
                });
                let optionIndex = findIndex(Vote.option, {
                    name: OptionName
                });
                option.vote_number += 1;
                Vote.option.splice(optionIndex, 1, option);
                Vote.voted = inform;
                Vote.update_date = moment.format("YYYY-MM-DD HH:mm");
                Votes.splice(index, 1, Vote);
                this.saveKey.data = sortBy(Votes, "update_date");
                storage.save(this.saveKey).then(() => {
                    this.votes = this.saveKey.data;
                    resolve();
                });
            });
        });
    }
    UpdateEventVotes(EventID, NewVotes) {
        return new Promise((resolve, reject) => {
            this.readFromStore().then(Votes => {
                Votes = dropWhile(Votes, ["event_id", EventID]);
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
