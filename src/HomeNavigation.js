import React, { Component } from "react"
import { createStackNavigator, createNavigationContainer } from "react-navigation"
import homePage from "./components/myscreens/home/homePage"
import { enableScreens } from 'react-native-screens';
import Event from './components/myscreens/event/index';
import PaginationView from "./components/myscreens/Viewer/constants/paginationSwipe";
import ContactView from './components/myscreens/Contacts/Contact';
import QRScanner from './components/myscreens/QR/index';
import CreateEventView from './components/myscreens/event/createEvent/index';

enableScreens()
const HomeNavigator = createStackNavigator({
    Home: { screen: homePage },
    QR:{screen:QRScanner},
    Contacts:{screen:ContactView},
    PaginationView: { screen: PaginationView },
    CreateEventView:{screen:CreateEventView},
    Event: { screen: Event },
}, {
    initialRouteName: "Home",
    headerMode: "none"
})
const HomeContainer = createNavigationContainer(HomeNavigator)

export default () => {
    return <HomeContainer id={1}></HomeContainer>
}
