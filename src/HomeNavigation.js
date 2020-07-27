import React, { Component } from "react"
import { createStackNavigator, createNavigationContainer } from "react-navigation"
import homePage from "./components/myscreens/home/homePage"
import { enableScreens } from 'react-native-screens';
import Event from './components/myscreens/event/index';

enableScreens()
const HomeNavigator = createStackNavigator({
    Home: { screen: homePage },
    Event: { screen: Event },
}, {
    initialRouteName: "Home",
    headerMode: "none"
})
const HomeContainer = createNavigationContainer(HomeNavigator)

export default () => {
    return <HomeContainer id={1}></HomeContainer>
}
