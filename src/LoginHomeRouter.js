import React,{Component} from "react"
import { createStackNavigator, createNavigationContainer } from "react-navigation"
import HomeNavigation from "./HomeNavigation"
import LoginView from './components/myscreens/login/index';
import LoginHomeView from './components/myscreens/loginhome/index';
import { enableScreens } from 'react-native-screens';

enableScreens()
const HomeNavigator = createStackNavigator({
    Home:{screen:HomeNavigation},
    Login:{screen:LoginView},
    LoginHome:{screen:LoginHomeView}
},{
    initialRouteName:"LoginHome",
    headerMode:"none"
})
const HomeContainer = createNavigationContainer(HomeNavigator)

export default () => {
    return <HomeContainer id={1}></HomeContainer>
}
