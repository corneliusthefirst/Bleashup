
import React from "react"
import BottomTabs from '../../mainComponents/BottomTabs';
//import { SelectRelation } from './SelectRelation';
import AllContacts from './AllContactList';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GState from "../../../stores/globalState";
import ColorList from '../../colorList';
import ActivitiesList from "./ActivityList";
import Feather from 'react-native-vector-icons/Feather';
import { View } from 'react-native';


export default class SelectRelation extends BottomTabs {
    initialize() {

    }
    select(item){
        this.goback()
        this.selectItem(item)
    }
    goback() {
        this.props.navigation && this.props.navigation.goBack()
    }
    getParam = (param) => this.props.navigation && this.props.navigation.getParam(param)
    current_activity = this.getParam("current")
    selectItem = this.getParam("select")
    initialTab = this.getParam("tab") || null
    tabs = {
        Contacts: {
            screen: () => <AllContacts
                goback={this.goback.bind(this)}
                select={this.select.bind(this)} >
            </AllContacts>,
            navigationOptions: {
                tabBarLabel: "Contacts",
                tabBarIcon: ({ tintColor }) => (
                    <View>
                        <AntDesign name={"user"} style={{ ...GState.defaultIconSize, color: tintColor }} ></AntDesign>
                    </View>
                ),
                activeColor: ColorList.likeActive,
                inactiveColor: ColorList.indicatorColor,
                barStyle: {
                    backgroundColor: ColorList.indicatorColor
                },
            }
        },
        Activities: {
            screen: () => <ActivitiesList
                current_activity={this.getParam("current")}
                goback={this.goback.bind(this)}
                select={this.select.bind(this)}
            >
            </ActivitiesList>,
            navigationOptions: {
                tabBarLabel: "Activities",
                tabBarIcon: ({ tintColor }) => (
                    <View>
                        <AntDesign name={"addusergroup"} style={{ ...GState.defaultIconSize, color: tintColor }} />
                    </View>
                ),
                activeColor: ColorList.likeActive,
                inactiveColor: ColorList.indicatorColor,
                barStyle: {
                    backgroundColor: ColorList.indicatorColor
                },
            }
        }
    }
}
