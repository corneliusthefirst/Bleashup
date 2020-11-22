import React, { Component } from "react";
import { Text, View, PermissionsAndroid, StyleSheet } from 'react-native';
import initialRoute from "../invitations/components/initialRoute";
import globalState from "../../../stores/globalState";
import connection from "../../../services/tcpConnect";
import Waiter from "./Waiter";
import GState from '../../../stores/globalState/index';
import BeNavigator from '../../../services/navigationServices';
import AnimatedComponent from '../../AnimatedComponent';
import Texts from "../../../meta/text";
import { AppDir, OthersDir, PhotoDir, SounDir, VideoDir } from "../../../stores/globalState/globalState";
//import BeBackground from '../../../services/backgroundSync';
//import BackgroundJob from 'react-native-background-job';
//BackgroundJob.cancelAll();
//BackgroundJob.register(backgroundJob);
import rnFetchBlob from 'rn-fetch-blob';
const { fs } = rnFetchBlob;
//BackgroundJob.schedule(backgroundSchedule);
export default class LoginHomeView extends AnimatedComponent {
  constructor(props) {
    super(props);
    GState.nav = this.props.navigation;
  }
  componentDidMount() {
    //BackgroundJob.
    //BeBackground.startTask()
  }
  state = {};
  async requestReadAndWritePermission() {
    const ReadDirperms = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
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
    /*const docManPerms = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.MANAGE_DOCUMENTS,{
      title: Texts.write_to_disk_permission,
      message: Texts.writ_to_disk_permission_message
    })*/
    console.warn(writePerms, ReadDirperms, contactPerms, writeCalPerms,/*docManPerms*/)
    const status = await fs.exists(AppDir)
    console.warn('app dir exitence status is: ', status)
    if (!status) await fs.mkdir(AppDir)
    const photoDirExist = await fs.exists(PhotoDir)
    if (!photoDirExist) await fs.mkdir(PhotoDir)
    const videoDirExist = await fs.exists(VideoDir)
    if (!videoDirExist) await fs.mkdir(VideoDir)
    const soundDirExist = await fs.exists(SounDir)
    if (!soundDirExist) await fs.mkdir(SounDir)
    const othersDirExist = await fs.exists(OthersDir)
    if (!othersDirExist) await fs.mkdir(OthersDir)
    console.warn('all dirs created');

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
