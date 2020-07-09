/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import ProfileSimple from '../components/myscreens/currentevents/components/ProfileViewSimple';
import stores from '../stores/index';
import BeNavigator from '../services/navigationServices';
import BeComponent from './BeComponent';

export default class RelationProfile extends BeComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View
        style={{
          paddingBottom: 2,
          paddingTop: 2,
          borderRadius: 5,
          width: '100%',
        }}
      >
        <View
          style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}
        >
          {
            <TouchableOpacity
              onPress={() =>
                requestAnimationFrame(() =>
                  BeNavigator.navigateToActivity('EventChat', this.props.Event)
                )
              }
              style={{ width: '65%' }}
            >
              <ProfileSimple
                showPhoto={(url) => this.props.showPhoto(url)}
                profile={
                  stores.TemporalUsersStore.Users[
                    this.props.Event.participant.find(
                      (ele) => ele.phone !== stores.LoginStore.user.phone
                    ).phone
                  ]
                }
                relation
                style={{ height: 50, width: 50, borderRadius: 25 }}
              />
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
}
