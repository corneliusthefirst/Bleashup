import React, { Component } from 'react';
import { Platform, StyleSheet, Image, TextInput, FlatList, View, Alert, TouchableHighlight } from 'react-native';

import autobind from "autobind-decorator";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header, Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner, Button, InputGroup, DatePicker, CheckBox, Thumbnail
} from "native-base";

import cardListData from './EventData';

import CardListItem from './invitationCard';

import NestedScrollView from "react-native-nested-scroll-view"
import stores from '../../../stores';
import ImageActivityIndicator from '../currentevents/imageActivityIndicator';

class ReceivedInvitations extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      deletedRowKey: null,
      loadingEvents: true
    });

  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loadingEvents: false,
        Events: stores.Invitations.ReceivedInvitations.length !==0 ? stores.Invitations.ReceivedInvitations: cardListData
      });
    }, 0)
  }

  //callback function to refresh state of change
  refreshCardList = (activeKey) => {
    this.setState((prevState) => {
      return {
        //give the key to delete to the deleted row key
        deletedRowKey: activeKey
      };

    });
    //flatlist here is a reference to flatlist
    this.refs.cardlist.scrollToEnd();
  }


  /// Adding a new item using a modal
  /*   @autobind
    _onPressAdd () {
        //alert("You add Item");
        this.refs.addModal.showAddModal();
    }*/
  render() {
    return this.state.loadingEvents ? <ImageActivityIndicator /> : (

      <View>
        <NestedScrollView>
          <View>
            <FlatList
              //reference name to Flatlist
              style={{ flex: 1 }}
              ref={"cardlist"}
              listKey={'Invitations'}
              data={this.state.Events}
              renderItem={({ item, index }) => {
                //console.log(`Item=${JSON.stringify(item)}, Index = ${index}`);

                return (
                  //this is my private class just created
                  <CardListItem item={item} index={index} parentCardList={this} refresh={this.refreshCardList}>
                  </CardListItem>
                );


              }}
            >

            </FlatList>
          </View>
        </NestedScrollView>
      </View>


    );
  }
}


export default ReceivedInvitations;


















































