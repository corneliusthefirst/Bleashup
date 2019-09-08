import React, { Component } from "react";

import SentInvitations from '../sent-invitations/invitationCard';
import ReceivedInvitations from '../received-invitations/invitationCard';
import BleashupFlatList from "../../BleashupFlatList";
import { Spinner } from "native-base";
import stores from "../../../stores";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import { View } from 'react-native';

@observer export default class InvitationView extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }
  refreshCardList = (activeKey) => {
    this.setState((prevState) => {
      return {
        deletedRowKey: activeKey
      };

    });

  }
  @autobind
  onRefresh() {
    this.setState({ refreshing: true })
    //call your callback function here
    this.addInvitation()
    this.setState({ refreshing: false })
  }

  componentDidMount() {
    setTimeout(() => {
      stores.Invitations.readFromStore().then(invitations => {
        this.setState({
          loadingInvitations: false,
          invitations: invitations
        });
      })
    }, 12)
  }
  generateKey(numberOfCharacters) {
    return require('random-string')({ length: numberOfCharacters });
  }
  _keyExtractor = (item, index) => item.invitation_id;
  render() {
    return <View style={{ height:"100%", backgroundColor: "#FEFFDE"}}>
    {
      this.state.loadingInvitations ? 
        <Spinner></Spinner>: 
          <BleashupFlatList
        initialRender={6}
        renderPerBatch={3}
        firstIndex={0}
        keyExtractor={this._keyExtractor}
        dataSource={stores.Invitations.invitations}
        numberOfItems={stores.Invitations.invitations.length}
        renderItem={(item, index) => {
          return item.sent ? <SentInvitations {...this.props} item={item} key={index} parentCardList={this} /> : 
          <ReceivedInvitations  {...this.props} item={item} key={index}
            parentCardList={this} />


        }}
      >
      </BleashupFlatList>}
    </View>
  }
}

