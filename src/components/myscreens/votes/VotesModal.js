
import BleashupModal from '../../mainComponents/BleashupModal';
import Votes from '.';
import React  from 'react';
import emitter from '../../../services/eventEmiter';
import { find } from 'lodash';
import stores from '../../../stores';

export default class VoteModal extends BleashupModal{
    initialize(){
        this.state = {
            votes: []
        }
    }
    componentWillMount(){
        emitter.on("vote-me", (index, message) => {
            let votex = find(stores.Votes.votes[this.props.event_id], { id: message.vote.id })
            this.refs.votes.votex(index, { ...message, vote: votex }, true)
        }
        )
    }
    onOpenModal(){

    }
    onClosedModal(){
        this.props.onClosed()
        this.name = null
        this.updated = null
    }
    modalBody(){
        return <Votes
            ref={"votes"}
            takeVotes={this.props.takeVotes}
            shared={this.props.shared}
            share={this.props.share}
            replying={this.props.replying}
            computedMaster={this.props.computedMaster}
            takeVote={this.props.takeVote}
            voteItem={this.props.voteItem}
            working={this.props.working}
            isSingleVote={this.props.isSingleVote}
            vote_id={this.props.vote_id}
            startLoader={this.props.startLoader}
            roomName={this.props.roomName}
            showVoters={this.props.showVoters}
            stopLoader={this.props.stopLoader}
            activity_name={this.props.activity_name}
            committee_id={this.props.committee_id}
            event_id={this.props.event_id}
            sender={this.props.sender}
        >
        </Votes>
    }
}