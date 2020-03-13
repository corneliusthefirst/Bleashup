import React, { Component } from "react";
import { View } from "react-native";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import { Text, Icon, Spinner, Toast } from "native-base";
import BleashupFlatList from "../../BleashupFlatList";
import stores from "../../../stores";
import Voter from "../eventChat/Voter";
import shadower from "../../shadower";
import Modal from 'react-native-modalbox';
import VoteCreation from "../eventChat/VoteCreation";
import uuid from 'react-native-uuid';
import VoteRequest from './Requester';
import sayAppBusy from "./sayAppBusy";
import request from '../../../services/requestObjects';
import emitter from '../../../services/eventEmiter';
import { findIndex, find, uniqBy } from 'lodash';
import moment from "moment";

export default class Votes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      votes: []
    }
  }
  state = {}
  componentDidMount() {
    this.intializeVote()
  }
  componentWillMount() {
    emitter.on("votes-updated", (committee_id) => {
      console.warn(committee_id, "receiving new update")
      if (this.props.committee_id === committee_id) {
        this.intializeVote()
      }
    })
    emitter.on("vote-me", (index, vote) => this.votex(index, vote, true))
  }
  intializeVote() {
    stores.Votes.fetchVotes(this.props.event_id,
      this.props.committee_id).then((votes) => {
        this.setState({
          votes: votes,
          loaded: true,
          vote: this.state.vote && find(votes,{id:this.state.vote.id}),
          vote_id: request.Vote().id
        })
        this.props.takeVotes(votes)
      })
  }
  componentWillUnmount() {
    emitter.off("votes-updated")
    emitter.off("vote-me")
  }
  delay = 0
  AddVote() {
    this.setState({
      isVoteCreationModalOpened: true,
      vote_id:request.Vote().id
    })
  }
  createVote(vote) {
    this.setState({
      isVoteCreationModalOpened: false,
      vote_id: null,
    })
    if (!this.props.working) {
      this.props.startLoader()
      let newVote = {
        ...vote, id: uuid.v1(),
        committee_id: this.props.committee_id,
        event_id: this.props.event_id,
      }
      VoteRequest.createVote(newVote).then(() => {
        this.props.stopLoader()
        stores.Votes.clearVoteCreation().
          then(() => {

          })
        this.intializeVote()
        this.props.takeVote(newVote)
      }).catch((er) => {
        this.props.stopLoader()
      })
    } else {
      sayAppBusy()
    }
  }

  votex(index, message, foreign) {
    let vote = message.vote
    const haveIVoted = () => {
      let v = find(this.state.votes, { id: vote.id })
      return findIndex(v.voter, { phone: stores.LoginStore.user.phone }) >= 0
    }
    if (!haveIVoted()) {
      if (!this.props.working) {
        let meess = foreign ? message : {
          text: vote.title,
          received: [{
            phone: stores.LoginStore.user.phone,
            date: moment().format()
          }],
          type: 'vote',
          sender: this.props.sender,
          create_at: moment().format(),

        }
        this.props.startLoader()
        VoteRequest.vote(vote.event_id,
          vote.id, index).then((response) => {
            this.intializeVote()
            this.props.stopLoader()
            let mess = {
              ...meess,
              vote: {
                id: vote.id,
                option: vote.option.map(ele => {
                  return { ...ele, vote_count: ele.index === index ? ele.vote_count + 1 : ele.vote_count }
                }),
                voter: uniqBy([...vote.voter ? vote.voter : [], { phone: stores.LoginStore.user.phone, index: index }], ["phone"])
              }
            }
            //this.props.onClosed()
            this.props.voteItem(mess)
          }).catch(() => {
            this.props.stopLoader()
            Toast.show({ text: 'unable to perform this request', duration: 4000 })
          })

      } else {
        sayAppBusy()
      }
    } else {
      Toast.show({ text: 'voted already', duration: 400 })
    }
  }
  voteItem(message) {
    console.warn("initializing vote item")
    this.intializeVote()
    this.props.voteItem(message)
  }
  updateVote(vote){
    this.setState({
      isVoteCreationModalOpened:true,
      update:true,
      vote:vote
    })
  }
  appdateVote(previousVote,currentVote){
    this.setState({
      isVoteCreationModalOpened:false
    })
    if(!this.props.working){
      this.props.startLoader()
      VoteRequest.applyAllUpdate(currentVote,previousVote).then((re) => {
        console.warn(re)
        if(re){
          this.props.stopLoader()
          this.intializeVote()
        }
      }).catch(() => {
        Toast.show({text:'unable to perform request'})
      })
    }else{
      sayAppBusy()
    }
  }
  renderPerbatch = 10
  render() {
    return <Modal
      coverScreen={true}
      entry={'bottom'}
      position={'bottom'}
      backdropOpacity={0.7}
      swipeToClose={false}
      backButtonClose={true}
      onClosed={() => {
        this.props.onClosed()
        this.setState({
          //loaded: false,
          isVoteCreationModalOpened: false

        })
        this.name = null
        this.updated = null
      }}
      isOpen={this.props.isOpen}
      onOpened={() => {
        //this.intializeVote()
      }}
      style={{
        height: "90%",
        width: "100%",
        // backgroundColor: "#FEFFDE",
      }}
    ><View>
        <View style={{ height: '7%', width: '100%' }}>
          <View style={{ flexDirection: 'row', ...bleashupHeaderStyle, padding: '2%', }}>
            <View style={{ width: '90%' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 20, }}>{this.props.isSingleVote ? "Vote" : "Votes"}</Text>
            </View>
            <View style={{ width: '10%' }}>
              {!this.props.isSingleVote && <Icon onPress={() => requestAnimationFrame(() => this.AddVote())} type='AntDesign'
                name="pluscircle" style={{ color: "#1FABAB", alignSelf: 'center', }} />}
            </View>
          </View>
        </View>
        <View style={{ height: '93%' }}>
          {!this.state.loaded ? <Spinner size="small"></Spinner> :
            <BleashupFlatList
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item, index) => {
                this.delay = index % this.renderPerbatch == 0 ? 0 : this.delay + 1
                return <View style={{
                  borderRadius: 5, backgroundColor: '#FEFFDE',
                  margin: '2%',
                  ...shadower(1)
                }}>
                  <Voter updateVote={(vote) => {
                    this.updateVote(vote)
                  }} showVoters={this.props.showVoters} configurable key={index} vote={(option, voter) => this.votex(option, { vote: voter })} startLoader={this.props.startLoader}
                    stopLoader={this.props.stopLoader} delay={this.delay} message={{ vote: item }} voteItem={(mess) => {
                      this.voteItem(mess)
                    }}></Voter></View>
              }}
              renderPerBatch={this.renderPerbatch}
              firstIndex={0}
              initialRender={7}
              dataSource={this.state.votes.filter(ele => (this.props.vote_id && ele.id === this.props.vote_id) || !this.props.isSingleVote)}
              numberOfItems={this.props.isSingleVote ? 1 : this.state.votes.length}
            >
            </BleashupFlatList>}
        </View>
        <VoteCreation takeVote={(vote) => {
          this.createVote(vote)
        }} 
        vote={this.state.vote}
        updateVote={(prev,newV) => this.appdateVote(prev,newV)}
        update={this.state.update} vote_id={request.Vote().id}
          isOpen={this.state.isVoteCreationModalOpened} onClosed={() => {
            this.setState({
              isVoteCreationModalOpened: false
            })
          }}></VoteCreation>
      </View>
    </Modal>
  }
}
