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
//import BeBackground from '../../../services/backgroundSync';
//import BackgroundJob from 'react-native-background-job';
const AppDir = rnFetchBlob.fs.dirs.SDCardDir + '/Bleashup';
const PhotoDir = AppDir + '/Photo';
const SounDir = AppDir + '/Sound';
const VideoDir = AppDir + '/Video';
const OthersDir = AppDir + '/Others';
const { fs } = rnFetchBlob;

//BackgroundJob.cancelAll();
//BackgroundJob.register(backgroundJob);

//BackgroundJob.schedule(backgroundSchedule);
export default class LoginHomeView extends AnimatedComponent {
  constructor(props) {
    super(props);
    GState.nav = this.props.navigation;
  }
  componentDidMount(){
    //BackgroundJob.
    //BeBackground.startTask()
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
      initialRoute.initialRoute().then((route) => {
        if (route !== 'Login') {
          connection
            .init()
            .then((socket) => {
              BeNavigator.navigateTo(route);
            })
            .catch((error) => {
              GState.connected = false;
              console.warn('error while connecting socket', error);
            });
          setTimeout(() => BeNavigator.navigateTo(route), 500);
        } else {
          BeNavigator.navigateTo(route);
        }
      });
    return (
      <View style={styles.container}>
        <Waiter />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
