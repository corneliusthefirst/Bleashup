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
import Texts from "../../../meta/text";
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
   const ReadDirperms = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,{
       'title': 'BeUp',
       'message': Texts.beup_wants_to_read_from
   })
    const writePerms = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
      'title': 'BeUp',
      'message': Texts.beup_wants_to_read_from
    })

    const contactPerms = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      'title': 'BeUp',
      'message': Texts.beup_wants_to_read_from
    })

    const writeCalPerms = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR, {
      'title': 'BeUp',
      'message': Texts.beup_wants_to_read_from
    })
    console.warn(writePerms,ReadDirperms, contactPerms,writeCalPerms)
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
        BeNavigator.navigateTo(route);
        if (route !== 'Login') {
          connection
            .init()
            .then((socket) => {
            })
            .catch((error) => {
            });
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
