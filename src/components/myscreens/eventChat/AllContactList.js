import React from "react"
import BeComponent from '../../BeComponent';
import { View } from 'react-native';
import CreationHeader from "../event/createEvent/components/CreationHeader";
import Texts from '../../../meta/text';
import Searcher from "../Contacts/Searcher";
import { justSearch, startSearching, cancelSearch } from './searchServices';
import initAllContacts from '../Contacts/initAllContacts';
import Spinner from '../../Spinner';
import globalFunctions from '../../globalFunctions';
import BleashupFlatList from "../../BleashupFlatList";
import ProfileSimple from "../currentevents/components/ProfileViewSimple";
import stores from "../../../stores";

export default class AllContacts extends BeComponent {
    constructor(props) {
        super(props)
        this.state = {
            searchString: "",
            contacts: [],
            searching: false
        }
        this.justSearch = justSearch.bind(this)
        this.cancelSearch = cancelSearch.bind(this)
        this.startSearching = startSearching.bind(this)
        this.initAllContacts = initAllContacts.bind(this)
    }
    phoneContacts = [{
        phone:stores.LoginStore.user.phone,
    }]
    componentDidMount() {
        this.initAllContacts()
    }
    select(item) {
        this.props.select && this.props.select({
            source: item.profile || stores.TemporalUsersStore.Users[item.phone] && 
            stores.TemporalUsersStore.Users[item.phone].profile,
            name: item.nickname || stores.TemporalUsersStore.Users[item.phone].nickname,
            item: item.phone,
            relation_type: "contact"
        })
    }
    render() {
        let data = this.state.contacts &&
            this.state.contacts.filter(ele =>
                globalFunctions.filterForRelation(ele, this.state.searchString))
        return !this.state.isMount ? <Spinner></Spinner> : <View>
            <View>
                <CreationHeader
                    back={this.props.goback}
                    title={this.state.searching ? "" : Texts.select_from + " " + Texts.all_contacts}
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
                ></CreationHeader>
            </View>
            <View>
                <BleashupFlatList
                    dataSource={data}
                    numberOfItems={data.length}
                    keyExtractor={(item, ind) => item.phone}
                    renderPerBatch={20}
                    initialRender={20}
                    renderItem={(item, index) => <View style={{
                        height: 70,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignSelf: 'center',
                    }}><ProfileSimple
                        searchString={this.state.searchString}
                        onPress={() => this.select(item)}
                        profile={item.nickname ? item : stores.TemporalUsersStore.Users[item.phone]}
                    ></ProfileSimple></View>}
                >
                </BleashupFlatList>
            </View>
        </View>
    }
}