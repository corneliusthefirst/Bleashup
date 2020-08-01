/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BleashupModal from "./mainComponents/BleashupModal";
import ColorList from './colorList';
import Entypo  from 'react-native-vector-icons/Entypo';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';

export default class PrivacyModal extends BleashupModal {
  initialize() {
    this.state = {
      block: this.props.blockState,
      mute: this.props.muteState,
    };
  }
  onClosedModal() {
    this.props.onClosed();
  }

  backdropOpacity = 0.1;
  entry = "bottom";
  position = "bottom";
  modalBackground = 'white';
  modalHeight = 120;

  state = {};
  componentDidMount() {}
  onOpenModal() {
    /* this.setStatePure({
      contacts: this.props.contacts,
    });*/
  }
  toggleBlock = () => {
    this.setStatePure({ blockState: !this.state.blockState });
  };
  toggleMute = () => {
    this.setStatePure({ muteState: !this.state.muteState });
  };
  modalBody() {
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 15,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 12,
              marginBottom: 20,
              padding: 10,
            }}
          >
            <Entypo
              name="sound-mute"
              active={true}
              style={{ color: ColorList.bodyIcon, marginRight: 20 }}
              onPress={() => this.toggleMute()}
            />
            {this.state.blockState ? (
              <Text style={{ color: ColorList.bodyText }}>UnMute</Text>
            ) : (
              <Text style={{ color: ColorList.bodyText }}>Mute Group</Text>
            )}
          </View>

          {this.state.muteState ? (
            <Text style={{ color: 'green' }}>#Muted</Text>
          ) : null}
        </View>

        {this.props.event.type !== 'relation' ? (
          <Text style={{ color: '#c94c4c',marginLeft:15 }}>
            Can Only Block One to One Chat
          </Text>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ 
              margin:2,
              backgroundColor: '#c94c4c',
              justifyContent: 'flex-start', }}>
              <MaterialIcons
                name="block"
                active={true}
                style={{ color: 'white' }}
                onPress={() => this.toggleBlock()}
              />

              {this.state.blockState ? (
                <Text>UnBlock</Text>
              ) : (
                <Text>Block</Text>
              )}
            </TouchableOpacity>

            {this.state.blockState ? (
              <Text style={{ color: '#c94c4c' }}>Blocked</Text>
            ) : null}
          </View>
        )}
      </View>
    );
  }
}
