import React, { Component } from "react";

import SentInvitations from '../sent-invitations/invitationCard';
import ReceivedInvitations from '../received-invitations/invitationCard';
import { Spinner } from "native-base";
import stores from "../../../stores";
import { observer } from "mobx-react";
import { View } from 'react-native';
import BleashupScrollView from "../../BleashupScrollView";
import BleashupFlatList from '../../BleashupFlatList';

@observer export default class InvitationView extends Component {
  constructor(props){
    super(props)
    this.state = {

    }
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

