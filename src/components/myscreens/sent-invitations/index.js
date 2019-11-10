
import React, { Component } from 'react';
import {
  Platform, StyleSheet, Image, TextInput, ScrollView,
  FlatList, View, Alert, TouchableHighlight, RefreshControl
} from 'react-native';

import autobind from "autobind-decorator";
import {
  Text,
  Title, Input, Left, Right, H3, H1, H2, Spinner, Button,
  InputGroup, DatePicker, CheckBox, Thumbnail, List,Container,Content
} from "native-base";


import CardListItem from './invitationCard';
import ImageActivityIndicator from "../currentevents/components/imageActivityIndicator";
import { observer } from "mobx-react";
import stores from '../../../stores';
import BleashupScrollView from '../../BleashupScrollView';
import CreateEvent from '../event/createEvent/CreateEvent';


@observer
class SendInvitations extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      deletedRowKey: null,
      loadingInvitations: true,
      invitations:null

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


  _keyExtractor = (item, index) => item.invitation_id;

  render() {

    return this.state.loadingInvitations ? (
      <Spinner></Spinner>
    ) : (
   <Container style={{flex:1}}>


        <BleashupScrollView
          initialRender={4}
          renderPerBatch={5}
          firstIndex={0}
          ref={"sendlist"}
          keyExtractor={this._keyExtractor}
          dataSource={this.state.invitations}
          renderItem={(item, index) => {
            return (
              <CardListItem {...this.props} item={item} key={index} parentCardList={this} Invitations={this.state.invitations}>
              </CardListItem>
            );
          }} 
        >
        </BleashupScrollView>
         
        <CreateEvent Parentprops={this.props} ></CreateEvent>
      
    </Container>

      );
  }
}


export default SendInvitations;

