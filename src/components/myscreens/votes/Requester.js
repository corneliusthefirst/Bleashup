
import tcpRequest from '../../../services/tcpRequestData';
import EventListener from '../../../services/severEventListener';
import stores from '../../../stores';
import uuid from 'react-native-uuid';
import moment from 'moment';
import request from '../../../services/requestObjects';
import { format } from '../../../services/recurrenceConfigs';

class Requester {
    createVote(Vote) {
        return new Promise((resolve, reject) => {
            tcpRequest.CreateVote(Vote, Vote.id + '_create').then((JSData) => {
                console.warn(JSData)
                EventListener.sendRequest(JSData, Vote.id + '_create').then((response) => {
                    console.warn(response, "vote creation response")
                    stores.Votes.addVote(Vote).then(() => {
                        stores.Events.addVote(Vote.event_id, Vote.id).then(() => {
                            let Change = {
                                id: uuid.v1(),
                                event_id: Vote.event_id,
                                updated: 'new_vote',
                                changed: `Added ${Vote.title} Vote`,
                                title: `Update On Main Activity`,
                                updater: stores.LoginStore.user,
                                new_value: { data: null, new_value: Vote.title },
                                date: moment().format(),
                                time: null
                            }
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                resolve()
                            })
                        })
                    })
                }).catch((erro) => {
                    reject(erro)
                })
            })
        })
    }
    deleteVote(voteID, eventID) {
        return new Promise((resolve, reject) => {
            let VEID = request.VEID()
            VEID.event_id = eventID
            VEID.vote_id = voteID
            tcpRequest.deleteVote(VEID, voteID + '_delete').then(JSData => {
                EventListener.sendRequest(JSData, voteID + '_delete').then(response => {
                    stores.Votes.removeVote(voteID).then((vote) => {
                        stores.Events.removeVote(eventID, voteID).then(() => {
                            let Change = {
                                id: uuid.v1(),
                                event_id: eventID,
                                updated: 'vote_deleted',
                                title: `Update On Main Activity`,
                                changed: `Deleted ${vote.title} vote`,
                                updater: stores.LoginStore.user,
                                new_value: { data: null, new_value: vote },
                                date: moment().format(),
                                time: null
                            };
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                resolve()
                            })
                        })
                    })
                }).catch((error) => {
                    reject(error)
                })
            })
        })
    }
    restoreVote(vote) {
        return new Promise((resolve, reject) => {
            tcpRequest.RestoreVote(Vote, vote.id + "_restore_vote").then((JSData) => {
                EventListener.sendRequest(JSData, vote.id + '_restore_vote').then((response) => {
                    stores.Votes.addVote(Vote).then(() => {
                        stores.Events.addVote(vote.event_id, vote.id).then(() => {
                            let Change = {
                                id: uuid.v1(),
                                event_id: vote.event_id,
                                updated: 'vote_restored',
                                title: `Update on ${vote.title} vote`,
                                changed: `Restored ${vote.title} vote`,
                                updater: stores.LoginStore.user,
                                new_value: { data: null, new_value: vote.id },
                                date: moment().format(),
                                time: null
                            };
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                resolve()
                            })
                        })
                    })
                }).catch((error) => {
                    reject(error)
                })
            })
        })
    }
    vote(eventID, voteID, option) {
        return new Promise((resolve, reject) => {
            let voter = request.goVote()
            voter.event_id = eventID
            voter.vote_id = voteID
            voter.option = option
            tcpRequest.Vote(voter, voteID + '_go_vote').then((JSData) => {
                EventListener.sendRequest(JSData, voteID + '_go_vote').then(response => {
                    stores.Votes.vote({ ...voter, voter: stores.LoginStore.user.phone }).then((resp) => {
                        resolve(resp)
                    })
                }).catch((error) => {
                    reject(error)
                })
            })
        })
    }
    updateVotePeriod(voteID, eventID, newPeriod, oldPeriod) {
        return new Promise((resolve, reject) => {
            if (newPeriod !== oldPeriod) {
                let update = request.VotePeriod()
                update.event_id = eventID
                update.vote_id = voteID
                update.period = newPeriod
                tcpRequest.changeVotePeriod(update, voteID + '_period').then((JSData) => {
                    EventListener.sendRequest(JSData, voteID + '_period').then(() => {
                        stores.Votes.UpdateVotePeriod(update).then((vote) => {
                            let Change = {
                                id: uuid.v1(),
                                event_id: update.event_id,
                                updated: 'vote_period',
                                title: `Update on ${vote.title} vote`,
                                changed: newPeriod && vote.period ? `Changed Voting End Date of ${vote.title} Vote To: ` :
                                    newPeriod && !vote.period ? `Added Voting End Date To ${vote.title} Vote : `
                                        : 'Remove Voting End Date From ${vote.title} Vote',
                                updater: stores.LoginStore.user,
                                new_value: {
                                    data: null,
                                    new_value: newPeriod ? moment(newPeriod).format(format) : null
                                },
                                date: moment().format(),
                                time: null
                            };
                            stores.ChangeLogs.addChanges(Change).then(() => {
                                resolve("ok")
                            })
                        })
                    }).catch((e) => {
                        reject(e)
                    })
                })
            } else {
                resolve()
            }
        })
    }
    applyAllUpdate(newVote, oldVote) {
        return new Promise((resolve, reject) => {
            this.updateVotePeriod(newVote.id, newVote.event_id,
                newVote.period, JSON.parse(oldVote).period).then(t1 => {
                    resolve(t1)
                }).catch((e) => {
                    reject(e)
                })
        })
    }
}
const VoteRequest = new Requester()
export default VoteRequest