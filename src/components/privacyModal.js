/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Icon, Button } from "native-base";
import { View, Text } from 'react-native';
import BleashupModal from "./mainComponents/BleashupModal";
import ColorList from './colorList';

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
            <Icon
              name="sound-mute"
              active={true}
              type="Entypo"
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
            <Button iconLeft style={{ backgroundColor: '#c94c4c' }}>
              <Icon
                name="block"
                active={true}
                type="MaterialIcons"
                style={{ color: 'white' }}
                onPress={() => this.toggleBlock()}
              />

              {this.state.blockState ? (
                <Text>UnBlock</Text>
              ) : (
                <Text>Block</Text>
              )}
            </Button>

            {this.state.blockState ? (
              <Text style={{ color: '#c94c4c' }}>Blocked</Text>
            ) : null}
          </View>
        )}
      </View>
    );
  }
}
