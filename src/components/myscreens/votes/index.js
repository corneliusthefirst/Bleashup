import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import { Text, Icon, Spinner, Toast } from "native-base";
import BleashupFlatList from "../../BleashupFlatList";
import stores from "../../../stores";
import Voter from "../eventChat/Voter";
import shadower from "../../shadower";
import Modal from "react-native-modalbox";
import VoteCreation from "../eventChat/VoteCreation";
import uuid from "react-native-uuid";
import VoteRequest from "./Requester";
import sayAppBusy from "./sayAppBusy";
import request from "../../../services/requestObjects";
import emitter from "../../../services/eventEmiter";
import { findIndex, find, uniqBy } from "lodash";
import moment from "moment";
import { dateDiff } from "../../../services/datesWriter";
import labler from "../eventChat/labler";
import formVoteOptions from "../../../services/formVoteOptions";
import BleashupModal from "../../mainComponents/BleashupModal";
import CreationHeader from "../event/createEvent/components/CreationHeader";
import ColorList from "../../colorList";
import ShareFrame from "../../mainComponents/ShareFram";
import Share from "../../../stores/share";
import replies from "../eventChat/reply_extern";
let { height, width } = Dimensions.get("window");

export default class Votes extends BleashupModal {
  initialize() {
    this.state = {
      votes: [],
    };
  }
  state = {};
  onClosedModal() {
    this.props.onClosed();
    this.setState({
      loaded: false,
      isVoteCreationModalOpened: false,
    });
    this.name = null;
    this.updated = null;
  }
  state = {};
  componentDidMount() {
    !this.props.shared ? this.intializeVote(true) : this.initializeSharedVote();
  }
  initializeSharedVote(status) {
    this.shareStore = new Share(this.props.share.id);
    this.shareStore.readFromStore().then(() => {
      this.shareStore.share && this.shareStore.share.event
        ? this.setState({
          loaded: true,
        })
        : null;
    });
    stores.Votes.fetchVoteFromRemote(
      this.props.event_id,
      this.props.share.item_id,
      true
    ).then((vote) => {
      stores.Events.loadCurrentEventFromRemote(this.props.share.event_id).then(
        (event) => {
          this.shareStore
            .saveCurrentState({
              ...this.props.share,
              event,
              vote: Array.isArray(vote) ? vote[0] : vote,
            })
            .then(() => {
              this.setState({
                loaded: true,
              });
            });
        }
      );
    });
  }
  componentWillMount() {
    !this.props.shared &&
      emitter.on("votes-updated", (committee_id) => {
        console.warn(committee_id, "receiving new update");
        if (this.props.committee_id === committee_id) {
          this.intializeVote();
        }
      });
    !this.props.shared &&
      emitter.on("vote-me", (index, message) => {
        let voter = find(stores.Votes.votes[this.props.event_id], {
          id: message.vote.id,
        });
        this.votex(index, { ...message, vote: voter }, true);
      });
  }
  intializeVote(status) {
    let votes = stores.Votes.votes[this.props.event_id]
      ? stores.Votes.votes[this.props.event_id]
        .filter((ele) => ele.committee_id === this.props.committee_id)
        .reverse()
      : [];
    this.props.shared
      ? stores.Votes.fetchVoteFromRemote(
        this.props.event_id,
        this.props.share.item_id,
        true
      ).then((vote) => {
        this.shareStore.saveCurrentState({
          ...this.shareStore.share,
          vote: Array.isArray(vote) ? vote[0] : vote,
        });
      })
      : this.setState({
        votes: votes,
        loaded: status ? false : true,
        vote_id: request.Vote().id,
      });
    this.props.takeVotes(votes);
  }
  onOpenModal() {
    setTimeout(() => {
      this.setState({
        loaded: true,
      });
    })
  }
  componentWillUnmount() {
    !this.props.shared && emitter.off("votes-updated");
    !this.props.shared && emitter.off("vote-me");
  }
  delay = 0;
  AddVote() {
    this.setState({
      isVoteCreationModalOpened: true,
      update: false,
      vote: null,
      vote_id: request.Vote().id,
    });
  }
  createVote(vote) {
    this.setState({
      isVoteCreationModalOpened: false,
      vote_id: null,
    });
    if (!this.props.working) {
      this.props.startLoader();
      let newVote = {
        ...vote,
        id: uuid.v1(),
        committee_id: this.props.committee_id,
        event_id: this.props.event_id,
      };
      VoteRequest.createVote(
        this.props.event_id,
        newVote,
        this.props.activity_name,
        this.props.roomName
      )
        .then(() => {
          this.props.stopLoader();
          stores.Votes.clearVoteCreation(this.props.event_id).then(() => { });
          this.intializeVote();
          this.props.takeVote(newVote);
        })
        .catch((er) => {
          this.props.stopLoader();
        });
    } else {
      sayAppBusy();
    }
  }
  //voteShared(index,message,vote)
  votex(index, message, foreign) {
    console.warn(message)
    let vote = message.vote;
    const haveIVoted = (vote) => {
      return findIndex(vote.voter, { phone: stores.LoginStore.user.phone }) >= 0;
    };
    if (!vote.period || dateDiff({ recurrence: vote.period }) < 0) {
      if (!haveIVoted(vote)) {
        if (!this.props.working) {
          let meess = foreign
            ? {
              ...message,
              sender: this.props.sender,
            }
            : {
              text: vote.title,
              received: [
                {
                  phone: stores.LoginStore.user.phone,
                  date: moment().format(),
                },
              ],
              type: "vote",
              sender: this.props.sender,
            };
         this.props.startLoader &&  this.props.startLoader();
          VoteRequest.vote(this.props.event_id, vote.event_id, vote.id, index)
            .then((newVote) => {
              this.intializeVote();
             this.props.stopLoader && this.props.stopLoader();
              let mess = {
                ...meess,
                vote: this.props.shared ? vote : newVote,
              };
              console.warn(mess)
              this.props.voteItem(mess);
            })
            /*.catch(() => {
             this.props.stopLoader && this.props.stopLoader();
              Toast.show({
                text: "unable to perform this request",
                duration: 4000,
              });
            });*/
        } else {
          sayAppBusy();
        }
      } else {
        Toast.show({ text: "voted already", duration: 4000 });
      }
    } else {
      Toast.show({ text: "Voting period has ended", duration: 4000 });
    }
  }
  voteItem(message) {
    this.intializeVote();
    this.props.voteItem(message);
  }
  updateVote(vote) {
    this.setState({
      isVoteCreationModalOpened: true,
      update: true,
      vote: vote,
    });
  }
  appdateVote(previousVote, currentVote) {
    this.setState({
      isVoteCreationModalOpened: false,
    });
    if (!this.props.working) {
      this.props.startLoader();
      VoteRequest.applyAllUpdate(this.props.event_id, currentVote, previousVote)
        .then((re) => {
          if (re) {
            this.props.stopLoader();
            this.intializeVote();
          }
        })
        .catch(() => {
          Toast.show({ text: "unable to perform request" });
        });
    } else {
      sayAppBusy();
    }
  }

  mentionVote(vote, creator) {
    this.props.replying({
      id: vote.id,
      type_extern: replies.votes,
      title: `${vote.title} : \n ${vote.description} \n\n ${formVoteOptions(
        vote
      )} `,
      replyer_phone: stores.LoginStore.user.phone,
    });
  }
  renderPerbatch = 10;
  swipeToClose = false;
  renderVotes() {
    return (
      <View>
        <CreationHeader
          back={this.onClosedModal.bind(this)}
          title={this.props.isSingleVote ? "Vote" : "Votes"}
          extra={
            !this.props.isSingleVote &&
            this.props.computedMaster && (
              <Icon
                onPress={() => requestAnimationFrame(() => this.AddVote())}
                type="AntDesign"
                name="plus"
                style={{
                  color: ColorList.bodyIcon,
                  alignSelf: "center",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              />
            )
          }
        ></CreationHeader>
        <View
          style={{
            height: ColorList.containerHeight - (ColorList.headerHeight + 20),
          }}
        >
          {!this.state.loaded ? null : (
            <BleashupFlatList
              keyExtractor={(item, index) => index.toString()}
              renderItem={(item, index) => {
                this.delay =
                  index % this.renderPerbatch == 0 ? 0 : this.delay + 1;
                return (
                  <View
                    key={index.toString()}
                    style={{
                      borderRadius: 5,
                      margin: "2%",
                      ...shadower(1),
                    }}
                  >
                    <Voter
                      handleLongPress={this.props.handleLongPress}
                      computedMaster={this.props.computedMaster}
                      mention={(vote, creator) =>
                        this.mentionVote(vote, creator)
                      }
                      updateVote={(vote) => {
                        this.updateVote(vote);
                      }}
                      showVoters={this.props.showVoters}
                      configurable
                      key={index}
                      vote={(option, voter) =>
                        this.votex(option, { vote: voter })
                      }
                      startLoader={this.props.startLoader}
                      stopLoader={this.props.stopLoader}
                      delay={this.delay}
                      message={{ vote: item }}
                    ></Voter>
                  </View>
                );
              }}
              renderPerBatch={this.renderPerbatch}
              firstIndex={0}
              initialRender={7}
              dataSource={
                this.props.isSingleVote &&
                  stores.Votes.votes[this.props.event_id]
                  ? [
                    find(stores.Votes.votes[this.props.event_id], {
                      id: this.props.vote_id,
                    }),
                  ]
                  : this.state.votes
              }
              numberOfItems={
                this.props.isSingleVote ? 1 : this.state.votes.length
              }
            ></BleashupFlatList>
          )}
        </View>
      </View>
    );
  }
  renderSharedVote() {
    console.warn("rendering shared vote; shared condition ", this.state.loaded && !this.shareStore.share,this.state.loaded, this.shareStore && this.shareStore.share)
    if(!this.state.loaded || !this.shareStore.share) this.initializeSharedVote()
    return this.state.loaded ? (
      <ShareFrame
        share={this.shareStore && this.shareStore.share}
        date={this.props.share.date}
        sharer={this.props.share.sharer}
        content={() => {
          return (
            <View
              style={{
                marginLeft: '2%',
                width: "100%",
                borderRadius: 3,
              }}
            >
              <Voter
                handleLongPress={this.props.handleLongPress}
                mention={(vote, creator) => this.mentionVote(vote, creator)}
                updateVote={(vote) => {
                  this.updateVote(vote);
                }}
                showVoters={this.props.showVoters}
                configurable
                vote={(option, voter) => this.votex(option, {...this.props.message,vote:voter},true)}
                startLoader={this.props.startLoader}
                stopLoader={this.props.stopLoader}
                delay={this.delay}
                message={{ vote: this.shareStore.share.vote || {} }}
                voteItem={(mess) => {
                  this.voteItem(mess);
                }}
              ></Voter>
            </View>
          );
        }}
      ></ShareFrame>
    ) : null;
  }
  borderTopLeftRadius = 0;
  borderTopRightRadius = 0;
  modalBody() {
    return (
      <View>
        {!this.props.shared ? this.renderVotes() : this.renderSharedVote()}
        <VoteCreation
          takeVote={(vote) => {
            this.createVote(vote);
          }}
          committee_id={this.props.event_id}
          vote={this.state.vote}
          computedMaster={this.props.computedMaster}
          updateVote={(prev, newV) => this.appdateVote(prev, newV)}
          update={this.state.update}
          vote_id={this.state.vote_id}
          isOpen={this.state.isVoteCreationModalOpened}
          onClosed={() => {
            this.setState({
              isVoteCreationModalOpened: false,
            });
          }}
        ></VoteCreation>
      </View>
    );
  }

  render() {
    return !this.props.shared ? this.modal() : this.modalBody()
  }
}
