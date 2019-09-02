
import React, { Component } from 'react';
import {
  Platform, StyleSheet, Image, TextInput, ScrollView,
  FlatList, View, Alert, TouchableHighlight, RefreshControl
} from 'react-native';

import autobind from "autobind-decorator";
import {
  Text,
  Title, Input, Left, Right, H3, H1, H2, Spinner, Button,
  InputGroup, DatePicker, CheckBox, Thumbnail, List
} from "native-base";


import CardListItem from './invitationCard';
import ImageActivityIndicator from "../currentevents/components/imageActivityIndicator";
import { observer } from "mobx-react";
import stores from '../../../stores';
import BleashupScrollView from '../../BleashupScrollView';


@observer
class SendInvitations extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      deletedRowKey: null,
      loadingInvitations: true,
      refreshing: false

    });

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


  refreshCardList = (activeKey) => {
    this.setState((prevState) => {
      return {
        deletedRowKey: activeKey
      };

    });

  }


  generateKey(numberOfCharacters) {
    return require('random-string')({ length: numberOfCharacters });
  }


  @autobind
  onRefresh() {
    this.setState({ refreshing: true })
    //call your callback function here
    this.addInvitation()
    this.setState({ refreshing: false })
  }








  _keyExtractor = (item, index) => item.invitation_id;

  render() {

    return this.state.loadingInvitations ? (
      <Spinner></Spinner>
    ) : (
        <BleashupScrollView
          initialRender={6}
          renderPerBatch={1}
          firstIndex={0}
          keyExtractor={this._keyExtractor}
          dataSource={stores.Invitations.SendInvitations}
          numberOfItems={stores.Invitations.SendInvitations.length}
          renderItem={(item, index) => {
            return (
              <CardListItem {...this.props} item={item} key={index} parentCardList={this}>
              </CardListItem>
            );
          }}
        >
        </BleashupScrollView>
      );
  }
}


export default SendInvitations;

