import React, { Component } from "react"
import { createStackNavigator, createNavigationContainer, createAppContainer } from "react-navigation"
import homePage from "./components/myscreens/home/homePage"
import { enableScreens } from 'react-native-screens';
import Event from './components/myscreens/event/index';
import PaginationView from "./components/myscreens/Viewer/constants/paginationSwipe";
import ContactView from './components/myscreens/Contacts/Contact';
import QRScanner from './components/myscreens/QR/index';
import CreateEventView from './components/myscreens/event/createEvent/index';
import CameraScreen from './components/mainComponents/BleashupCamera/index';
import SwiperComponent from './components/SwiperComponent/index';
import ProfileView from './components/myscreens/settings/profile';
import PhotoViewer from './components/myscreens/event/PhotoViewer';
import VideoViewer from './components/myscreens/highlights_details/VideoModal';
import ActuView from './components/myscreens/settings/editActu';
import SearchUser from './components/myscreens/Contacts/searchUser';
import RemindDetail from './components/myscreens/eventChat/RemindDetail';
import StarDetail from './components/myscreens/eventChat/StarDetail';
import ReportTabModal from './components/myscreens/reminds/NewReportTab';
import TasksCreation from './components/myscreens/reminds/TasksCreation';
import SelectRelation  from './components/myscreens/eventChat/SelectRelation';
import ContactsModal from './components/ContactsModal';
import EventHighlights from './components/myscreens/event/createEvent/components/EventHighlights';
import HomeTabs from './HomeTabs';
import BackgroundImageChanger from './components/myscreens/settings/PageBackgroundChanger';

enableScreens()
const HomeNavigator = createStackNavigator({
    Home: { screen: HomeTabs },
    QR: { screen: QRScanner },
    Contacts: { screen: ContactView },
    Report: { screen: ReportTabModal },
    TaskCreation: { screen: TasksCreation },
    StarCreation : {screen:EventHighlights},
    PaginationView: { screen: PaginationView },
    CreateEventView: { screen: CreateEventView },
    SwiperComponent: { screen: SwiperComponent },
    CameraScreen: { screen: CameraScreen },
    RemindDetail: { screen: RemindDetail },
    StarDetail: { screen: StarDetail },
    ContactsList: {screen: ContactsModal},
    SearchUser: { screen: SearchUser },
    Profile: { screen: ProfileView },
    SelectRelation: { screen: SelectRelation },
    Actu: { screen: ActuView },
    PhotoViewer: { screen: PhotoViewer },
    Background: {screen: BackgroundImageChanger},
    Video: { screen: VideoViewer },
    Event: { screen: Event },
}, {
    initialRouteName: "Home",
    headerMode: "none"
})
const HomeContainer = createAppContainer(HomeNavigator)

export default () => {
    return <HomeContainer id={1}></HomeContainer>
}
