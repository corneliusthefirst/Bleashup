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

enableScreens()
const HomeNavigator = createStackNavigator({
    Home: { screen: homePage },
    QR:{screen:QRScanner},
    Contacts:{screen:ContactView},
    PaginationView: { screen: PaginationView },
    CreateEventView:{screen:CreateEventView},
    SwiperComponent:{screen:SwiperComponent},
    CameraScreen:{screen: CameraScreen},
    Profile: {screen:ProfileView},
    Actu: {screen:ActuView},
    PhotoViewer: {screen: PhotoViewer},
    Video: {screen:VideoViewer},
    Event: { screen: Event },
}, {
    initialRouteName: "Home",
    headerMode: "none"
})
const HomeContainer = createAppContainer(HomeNavigator)

export default () => {
    return <HomeContainer id={1}></HomeContainer>
}
