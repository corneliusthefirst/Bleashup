import React from "react"


import BottomTabs from './components/mainComponents/BottomTabs';
import HomePage from "./components/myscreens/home/homePage";
import AllReminds from './components/myscreens/reminds/AllReminds';
import { View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Texts from './meta/text';
import ColorList from './components/colorList';
import HomeTab from "./components/myscreens/home/HomeTab";

export default class HomeTabs extends BottomTabs {

    initialTab = "Home"
    tabs = {
        Home: {
            screen: () => <HomePage {...this.props}></HomePage>,
            navigationOptions: {
                tabBarLabel: Texts.activities,
                tabBarIcon: (all) => {
                    return <HomeTab color={all.tintColor} focused={all.focused}></HomeTab>
                }
                ,
                tabBarOptions: {
                    activeTintColor: ColorList.indicatorColor,
                },
                activeColor: ColorList.indicatorColor,
                activeTintColor: ColorList.indicatorColor,
                barStyle: {
                    backgroundColor: "#f69b31",
                },
            },
        },
        AllReminds: {
            screen: () => <AllReminds {...this.props}></AllReminds>,
            navigationOptions: {
                tabBarLabel: Texts.programs,
                tabBarIcon: ({ tintColor,focused }) => (
                   <HomeTab remind color={tintColor} focused={focused}></HomeTab>
                ),
                tabBarOptions: {
                    activeTintColor: ColorList.likeActive,
                },
                activeColor: ColorList.indicatorColor,
                inactiveColor: ColorList.iconInactive,
                barStyle: {
                    backgroundColor: "#f69b31",
                },
            },
        }
    }
}