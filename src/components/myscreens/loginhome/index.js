import React, { Component } from "react";
import { Text, View, PermissionsAndroid, StyleSheet } from 'react-native';
import initialRoute from "../invitations/components/initialRoute";
import globalState from "../../../stores/globalState";
import connection from "../../../services/tcpConnect";
import rnFetchBlob from 'rn-fetch-blob';
import Waiter from "./Waiter";
import GState from '../../../stores/globalState/index';
import BeNavigator from '../../../services/navigationServices';
import AnimatedComponent from '../../AnimatedComponent';
const AppDir = rnFetchBlob.fs.dirs.SDCardDir + '/Bleashup';
const PhotoDir = AppDir + '/Photo';
const SounDir = AppDir + '/Sound';
const VideoDir = AppDir + '/Video';
const OthersDir = AppDir + '/Others';
const { fs } = rnFetchBlob;
export default class LoginHomeView extends AnimatedComponent {
  constructor(props) {
    super(props);
    GState.nav = this.props.navigation;
  }
  state = {};
  async requestReadAndWritePermission() {
    fs.exists(AppDir).then((status) => {
      if (!status) {
        fs.mkdir(AppDir).then(() => {
          fs.mkdir(PhotoDir).then(() => {
            fs.mkdir(SounDir).then(() => {
              fs.mkdir(VideoDir).then(() => {
                fs.mkdir(OthersDir).then(() => {
                  console.warn('all dirs created');
                });
              });
            });
          });
        });
      }
    });
  }

  render() {
    this.requestReadAndWritePermission();
    routeName = initialRoute.routeName;
    if ((globalState.loading = true)) {
      initialRoute.initialRoute().then((route) => {
        if (route !== 'Login') {
          connection
            .init()
            .then((socket) => {
              globalState.loading = false;
              BeNavigator.navigateTo(route);
            })
            .catch((error) => {
              GState.connected = false;
              console.warn('error while connecting socket', error);
            });
          setTimeout(() => BeNavigator.navigateTo(route), 500);
        } else {
          globalState.loading = false;
          BeNavigator.navigateTo(route);
        }
      });
    }
    return (
      <View style={styles.container}>
        {globalState.loading ? <Waiter /> : <Text> Waiting ... </Text>}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
