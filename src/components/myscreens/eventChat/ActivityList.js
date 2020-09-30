import React from "react"
import BeComponent from '../../BeComponent';
import { View } from 'react-native';
import CreationHeader from "../event/createEvent/components/CreationHeader";
import Texts from '../../../meta/text';
import Searcher from "../Contacts/Searcher";
import { justSearch, startSearching, cancelSearch } from './searchServices';
import BleashupFlatList from "../../BleashupFlatList";
import globalFunctions from '../../globalFunctions';
import stores from "../../../stores";
import ActivityProfile from "../currentevents/components/ActivityProfile";
import actFilterFunc from '../currentevents/activityFilterFunc';
import active_types from './activity_types';

export default class ActivitiesList extends BeComponent {
    constructor(props) {
        super(props)
        this.state = {
            searching: false,
            searchString: ""
        }
        this.justSearch = justSearch.bind(this)
        this.cancelSearch = cancelSearch.bind(this)
        this.startSearching = startSearching.bind(this)
    }
    select(item) {
        this.props.select({
            relation_type: active_types.activity,
            source: item.background,
            name: item.about.title,
            item: item.id
        })
    }
    render() {
        let data = globalFunctions.
            searchInActivities(stores.Events.events.filter(ele => actFilterFunc(ele)
                && ele.type !== active_types.relation && ele.id !== this.props.current_activity),
                this.state.searchString)
        return <View>
            <View>
                <CreationHeader
                    back={this.props.goback}
                    title={this.state.searching ? "" : Texts.select_from + " " + Texts.all_activities}
                    extra={<View style={{
                        height: 35, width: this.state.searching ? "80%" : 35
                    }}>
                        <Searcher
                            searching={this.state.searching}
                            searchString={this.state.searchString}
                            startSearching={this.startSearching}
                            cancelSearch={this.cancelSearch}
                            search={this.justSearch}
                        >
                        </Searcher>
                    </View>}
                >

                </CreationHeader>
            </View>
            <View>
                <BleashupFlatList
                    dataSource={data}
                    initialRender={20}
                    renderPerBatch={10}
                    numberOfItems={data.length}
                    keyExtractor={(item, index) => item.id}
                    renderItem={(item, index) => <View style={{
                        height: 70
                    }}><ActivityProfile
                        small
                        searchString={this.state.searchString}
                        onPress={() => this.select(item)} Event={item}>
                        </ActivityProfile></View>}
                >
                </BleashupFlatList>
            </View>
        </View>
    }
}