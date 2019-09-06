
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
import BleashupFlatList from '../../BleashupFlatList';


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

  








  render() {

    return 
  }
}


export default SendInvitations;

