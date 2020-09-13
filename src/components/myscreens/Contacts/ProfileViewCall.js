import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import ProfileView from '../invitations/components/ProfileView';
import ProfileSimple from "../currentevents/components/ProfileViewSimple";
import BeComponent from '../../BeComponent';

export default class ProfileViewCall extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      hide: false,
    };
  }

  hide = (hidestate) => {
    this.setStatePure({ hide: hidestate });
  };

  render() {
    return !this.state.hide ? (
      <TouchableOpacity
        onPress={() => {
          requestAnimationFrame(() => {
            this.props.createRelation();
          });
        }}
      >
        <ProfileView
          contact
          full
          searching={this.props.searching}
          searchString={this.props.searchString}
          phoneInfo={this.props.phoneInfo}
          delay={this.props.delay}
          phone={this.props.phone}
          updateContact={this.props.updateContact}
          hideMe={(hidestate) => {
            this.hide(hidestate);
          }}
        />
      </TouchableOpacity>
    ) : (
      <ProfileSimple 
      showInvite={this.props.showInvite}
       searching={this.props.searching} 
       searchString={this.props.searchString} 
       profile={this.props.phoneInfo} invite />
    );
  }
}
