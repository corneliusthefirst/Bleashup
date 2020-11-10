import React from "react"
import BleashupModal from '../../mainComponents/BleashupModal';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import GState from "../../../stores/globalState";
import Texts from '../../../meta/text';
import BleashupFlatList from "../../BleashupFlatList";
import Entypo from 'react-native-vector-icons/Entypo';
import ColorList from '../../colorList';
import rounder from "../../../services/rounder";
import shadower from "../../shadower";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Searcher from "../Contacts/Searcher";
import globalFunctions from '../../globalFunctions';
import ActivityProfile from '../currentevents/components/ActivityProfile';
import BeNavigator from '../../../services/navigationServices';
import ActivityPages from '../eventChat/chatPages';
import { justSearch, startSearching, cancelSearch } from '../eventChat/searchServices';

export default class SelectActivityToCreateRemind extends BleashupModal {
    initialize() {
        this.state = {
            currentLength: 1
        }
        this.swipeToClose = false

        this.search = justSearch.bind(this)
        this.startSearching = startSearching.bind(this)
        this.cancelSearch = cancelSearch.bind(this)
        this.createNewActivity = this.createNewActivity.bind(this)
        this.defaultItem = this.defaultItem.bind(this)
    }
    activities = []
    onClosedModal() {
        this.props.onClosed()
    }
    componentDidUpdate(prevProp, preState) {
        if (this.state.searchString !== preState.searchString) {
            this.toggleList()
        }
    }
    createWithMe(event) {
        BeNavigator.pushActivity(event, ActivityPages.reminds,
            {
                currentRemindMembers: event.participant
            })
        this.onClosedModal()
    }

    modalHeight = this.height * .53
    borderRadius = 10
    modalWidth = "70%"
    borderTopLeftRadius = 10
    onOpenModal() {
        setTimeout(() => {
            this.activities = globalFunctions.sortActivityForRemindCreation()
            this.setStatePure({
                currentLength: 1,
            })
        })
    }
    data = this.props.members
    position = "center"
    entry = "top"
    toggleList(currelyAll) {
        this.setStatePure({
            currentLength: currelyAll ? 1 : this.activities.length
        })
    }
    createNewActivity() {
        BeNavigator.navigateToCreateEvent({ remind: true })
        this.onClosedModal()
    }
    borderTopRightRadius = 10
    modalMinHieight = 50
    defaultItem() {
        return <View style={GState.descriptBoxStyle}>
            <View style={{
                alignSelf: 'center',
                marginBottom: "3%",
            }}>
                <Text style={GState.featureBoxTitle}>{Texts.no_activity_found}</Text>
            </View>
            <View style={{ marginBottom: '2%', }}>
                <Text style={{
                    ...GState.defaultTextStyle,
                    fontWeight: 'bold',
                }}>{Texts.click_below_to_create_a_new_one}</Text>
            </View>
            <TouchableOpacity onPress={this.createNewActivity}
                style={{
                    width: "90%",
                    height: 35,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                }}>
                <View
                    style={{
                        ...rounder(35, ColorList.bodyBackground),
                        justifyContent: 'center',
                    }}
                >
                    <Entypo name={"plus"} style={{
                        ...GState.defaultIconSize
                    }}></Entypo>
                </View>
            </TouchableOpacity>
        </View>
    }
    modalBody() {
        this.data = this.activities.slice(0, this.state.currentLength)
        this.data = this.data.filter(ele => globalFunctions.filterAllActivityAndRelation(ele, this.state.searchString || ""))
        let isAll = this.state.currentLength > 1 && this.data.length > 1
        return <View>
            <View style={{
                margin: '2%',
                flexDirection: 'row', 
                alignSelf: 'center',
                width: '95%',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                {!this.state.searching ? <View>
                    <Text ellipsizeMode={"tail"}
                        numberOfLines={1}
                        style={{
                            fontWeight: 'bold',
                            ...GState.defaultTextStyle
                        }}>
                        {Texts.select_activity}
                    </Text>
                </View> : null}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'flex-end'
                }}>{!this.state.searching ? <View style={{
                    alignSelf:'flex-end',
                    marginRight:6
                }}><TouchableOpacity
                    onPress={this.createNewActivity}
                    style={{
                        ...rounder(35, ColorList.descriptionBody)
                    }}>
                        <Entypo
                            style={{
                                ...GState.defaultIconSize
                            }}
                            name={"plus"}
                        />
                    </TouchableOpacity></View> : null}
                <View style={{
                    height: 35,
                    alignSelf:'flex-end',
                    flex: this.state.searching ? 1 : null,
                    width: this.state.searching ? null : 35
                }}>
                    <Searcher
                        searching={this.state.searching}
                        search={this.search}
                        searchString={this.state.searchString}
                        startSearching={this.startSearching}
                        cancelSearch={this.cancelSearch}
                    >
                    </Searcher>
                </View>
                </View>
            </View>
            <View style={{
                maxHeight: isAll || this.data.length <= 0 ? 200 : 60
            }}>
                <BleashupFlatList
                    fit
                    defaultItem={() => this.defaultItem()}
                    numberOfItems={this.data.length}
                    initialRender={10}
                    keyExtractor={(item, index) => item.id}
                    renderItem={(item, index) => <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingBottom: 4,
                        marginVertical: '2%',
                        justifyContent: 'space-between',
                    }}>
                        <View style={{
                            flex: 1,
                        }}>
                            <ActivityProfile
                                small
                                searchString={this.state.searchString}
                                Event={item}>
                            </ActivityProfile>
                        </View>
                        <TouchableOpacity style={{
                            ...rounder(40, ColorList.bodyDarkWhite),
                            justifyContent: 'center',
                        }} onPress={() => {
                            requestAnimationFrame(() => {
                                this.createWithMe(item)
                            })
                        }}><Entypo style={{
                            ...GState.defaultIconSize,
                            color: ColorList.indicatorColor
                        }} name={"arrow-bold-right"}></Entypo></TouchableOpacity>
                    </View>}
                    renderPerBatch={10}
                    dataSource={this.data}
                >
                </BleashupFlatList>
            </View>
            <TouchableOpacity
                onPress={() => this.toggleList(isAll)}
                style={{
                    margin: '1%',
                    borderRadius: 10,
                    borderTopLeftRadius: 0,
                    borderTopLeftRadius: 0,
                    paddingHorizontal: '2%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 35,
                    backgroundColor: ColorList.bodyBackground,
                    ...shadower(1)
                }}>
                <TouchableOpacity onPress={() => this.toggleList(isAll)} style={{
                    ...rounder(25, ColorList.bodyDarkWhite),
                    justifyContent: 'center',
                }}>
                    <AntDesign
                        style={{
                            ...GState.defaultIconSize,
                            color: ColorList.likeActive,
                            fontSize: 18,
                        }} name={isAll ? "upcircle" : "downcircle"} >

                    </AntDesign>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    }
}