
import tcpRequest from '../../../services/tcpRequestData';
import EventListener from '../../../services/severEventListener';
import stores from '../../../stores';
import moment from 'moment';
import request from '../../../services/requestObjects';
import { format } from '../../../services/recurrenceConfigs';
import toTitleCase from '../../../services/toTitle';
import IDMaker from '../../../services/IdMaker';

class Requester {
    createVote(roomID,Vote, commieeName, activityName) { 
        return new Promise((resolve, reject) => {
            let notif = request.Notification()
            notif.notification.title = "New Vote (" + toTitleCase(Vote.title) + ") @ " + commieeName
            notif.notification.body = toTitleCase(stores.LoginStore.user.nickname) + " @ " + activityName + "Added a new Vote"
            notif.data.activity_id = Vote.event_id 
            notif.data.id = Vote.id 
            Vote.notif = notif
            tcpRequest.CreateVote(Vote, Vote.id + '_create').then((JSData) => {
                EventListener.sendRequest(JSData, Vote.id + '_create').then((response) => {
                    stores.Votes.addVote(roomID,Vote).then(() => {
                        stores.Events.addVote(Vote.event_id, Vote.id).then(() => {
                            let Change = {
                                id: IDMaker.make(),
                                event_id: Vote.event_id,
                                updated: 'new_vote',
                                changed: `Added ${Vote.title} Vote`,
                                title: `Update On Main Activity`,
                                updater: stores.LoginStore.user.phone,
                                new_value: { data: null, new_value: Vote.title },
                                date: moment().format(),
                                time: null
                            }
                            resolve()
                            stores.ChangeLogs.addChanges(Change).then(() => {
                
                            })
                        })
                    })
                }).catch((erro) => {
                    reject(erro)
                })
            })
        })
    }
    deleteVote(roomID,voteID, eventID) {
        return new Promise((resolve, reject) => {
            let VEID = request.VEID()
            VEID.event_id = eventID
            VEID.vote_id = voteID
            tcpRequest.deleteVote(VEID, voteID + '_delete').then(JSData => {
                EventListener.sendRequest(JSData, voteID + '_delete').then(response => {
                    stores.Votes.removeVote(roomID,voteID).then((vote) => {
                        stores.Events.removeVote(eventID, voteID).then(() => {
                            let Change = {
                                id: IDMaker.make(),
                                event_id: eventID,
                                updated: 'vote_deleted',
                                title: `Update On Main Activity`,
                                changed: `Deleted ${vote.title} vote`,
                                updater: stores.LoginStore.user.phone,
                                new_value: { data: null, new_value: vote },
                                date: moment().format(),
                                time: null
                            };
                            resolve()
                            stores.ChangeLogs.addChanges(Change).then(() => {
                            })
                        })
                    })
                }).catch((error) => {
                    reject(error)
                })
            })
        })
    }
    restoreVote(roomID,vote) {
        return new Promise((resolve, reject) => {
            tcpRequest.RestoreVote(Vote, vote.id + "_restore_vote").then((JSData) => {
                EventListener.sendRequest(JSData, vote.id + '_restore_vote').then((response) => {
                    stores.Votes.addVote(roomID,Vote).then(() => {
                        stores.Events.addVote(vote.event_id, vote.id).then(() => {
                            let Change = {
                                id: IDMaker.make(),
                                event_id: vote.event_id,
                                updated: 'vote_restored',
                                title: `Update on ${vote.title} vote`,
                                changed: `Restored ${vote.title} vote`,
                                updater: stores.LoginStore.user.phone,
                                new_value: { data: null, new_value: vote.id },
                                date: moment().format(),
                                time: null
                            };
                            resolve()
                            stores.ChangeLogs.addChanges(Change).then(() => {
                               
                            })
                        })
                    })
                }).catch((error) => {
                    reject(error)
                })
            })
        })
    }
    vote(roomID,eventID, voteID, option) {
        return new Promise((resolve, reject) => {
            let voter = request.goVote()
            voter.event_id = eventID
            voter.vote_id = voteID
            voter.option = option
            tcpRequest.Vote(voter, voteID + '_go_vote').then((JSData) => {
                EventListener.sendRequest(JSData, voteID + '_go_vote').then(response => {
                    stores.Votes.vote(roomID,
                        { ...voter, voter: stores.LoginStore.user.phone }).then((resp) => {
                        resolve(resp)
                    })
                }).catch((error) => {
                    reject(error)
                })
            })
        })
    }
    updateVotePeriod(roomID,voteID, eventID, newPeriod, oldPeriod) {
        return new Promise((resolve, reject) => {
            if (newPeriod !== oldPeriod) {
                let update = request.VotePeriod()
                update.event_id = eventID
                update.vote_id = voteID
                update.period = newPeriod
                tcpRequest.changeVotePeriod(update, voteID + '_period').then((JSData) => {
                    EventListener.sendRequest(JSData, voteID + '_period').then(() => {
                        stores.Votes.UpdateVotePeriod(roomID,update).then((vote) => {
                            let Change = {
                                id: IDMaker.make(),
                                event_id: update.event_id,
                                updated: 'vote_period',
                                title: `Update on ${vote.title} vote`,
                                changed: newPeriod && vote.period ? `Changed Voting End Date of ${vote.title} Vote To: ` :
                                    newPeriod && !vote.period ? `Added Voting End Date To ${vote.title} Vote : `
                                        : 'Remove Voting End Date From ${vote.title} Vote',
                                updater: stores.LoginStore.user.phone,
                                new_value: {
                                    data: null,
                                    new_value: newPeriod ? moment(newPeriod).format(format) : null
                                },
                                date: moment().format(),
                                time: null
                            };
                            resolve("ok")
                            stores.ChangeLogs.addChanges(Change).then(() => {
                              
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
    applyAllUpdate(roomID,newVote, oldVote) {
        return new Promise((resolve, reject) => {
            this.updateVotePeriod(roomID,newVote.id, newVote.event_id,
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
