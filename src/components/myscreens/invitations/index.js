import React, { Component } from "react";

import SentInvitations from '../sent-invitations/invitationCard';
import ReceivedInvitations from '../received-invitations/invitationCard';
import { Spinner } from "native-base";
import stores from "../../../stores";
import { observer } from "mobx-react";
import { sortBy } from "lodash"
import { View } from 'react-native';
import BleashupScrollView from "../../BleashupScrollView";
import BleashupFlatList from '../../BleashupFlatList';

@observer export default class InvitationView extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  renderPerBatch = 6
  delay = 0
  _keyExtractor = (item, index) => item.invitation_id;
  render() {
    return <View style={{ height: "100%", backgroundColor: "#FEFFDE" }}>
      {
        this.state.loadingInvitations ?
          <Spinner></Spinner> :
          <BleashupFlatList
            initialRender={this.renderPerBatch}
            renderPerBatch={this.renderPerBatch}
            firstIndex={0}
            keyExtractor={this._keyExtractor}
            dataSource={sortBy(stores.Invitations.invitations, "period")}
            numberOfItems={stores.Invitations.invitations.length}
            renderItem={(item, index) => {
              this.delay = index % this.renderPerBatch === 0 ? 0 : this.delay + 1
              return item.sent ? <SentInvitations {...this.props} time_delay={this.delay * 100} item={item} key={index} parentCardList={this} /> :
                <ReceivedInvitations time_delay={this.delay * 100}  {...this.props} item={item} key={index}
                  parentCardList={this} />


            }}
          >
          </BleashupFlatList>}
    </View>
  }
}

